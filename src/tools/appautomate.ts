import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import logger from "../logger.js";
import { getBrowserStackAuth } from "../lib/get-auth.js";
import { BrowserStackConfig } from "../lib/types.js";
import { trackMCP } from "../lib/instrumentation.js";
import { maybeCompressBase64 } from "../lib/utils.js";
import { remote } from "webdriverio";

import {
  getDevicesAndBrowsers,
  BrowserStackProducts,
} from "../lib/device-cache.js";

import {
  findMatchingDevice,
  getDeviceVersions,
  resolveVersion,
  validateArgs,
  uploadApp,
} from "./appautomate-utils/appautomate.js";

// Types
interface Device {
  device: string;
  display_name: string;
  os_version: string;
  real_mobile: boolean;
}

interface PlatformDevices {
  os: string;
  os_display_name: string;
  devices: Device[];
}

enum Platform {
  ANDROID = "android",
  IOS = "ios",
}

/**
 * Launches an app on a selected BrowserStack device and takes a screenshot.
 */
async function takeAppScreenshot(args: {
  desiredPlatform: Platform;
  desiredPlatformVersion: string;
  appPath: string;
  desiredPhone: string;
  config: BrowserStackConfig;
}): Promise<CallToolResult> {
  let driver;
  try {
    validateArgs(args);
    const { desiredPlatform, desiredPhone, appPath, config } = args;
    let { desiredPlatformVersion } = args;

    const platforms = (
      await getDevicesAndBrowsers(BrowserStackProducts.APP_AUTOMATE)
    ).mobile as PlatformDevices[];

    const platformData = platforms.find(
      (p) => p.os === desiredPlatform.toLowerCase(),
    );

    if (!platformData) {
      throw new Error(`Platform ${desiredPlatform} not found in device cache.`);
    }

    const matchingDevices = findMatchingDevice(
      platformData.devices,
      desiredPhone,
    );

    const availableVersions = getDeviceVersions(matchingDevices);
    desiredPlatformVersion = resolveVersion(
      availableVersions,
      desiredPlatformVersion,
    );

    const selectedDevice = matchingDevices.find(
      (d) => d.os_version === desiredPlatformVersion,
    );

    if (!selectedDevice) {
      throw new Error(
        `Device "${desiredPhone}" with version ${desiredPlatformVersion} not found.`,
      );
    }
    const authString = getBrowserStackAuth(config);
    const [username, password] = authString.split(":");

    const app_url = await uploadApp(appPath, username, password);
    logger.info(`App uploaded. URL: ${app_url}`);

    const capabilities = {
      platformName: desiredPlatform,
      "appium:platformVersion": selectedDevice.os_version,
      "appium:deviceName": selectedDevice.device,
      "appium:app": app_url,
      "appium:autoGrantPermissions": true,
      "bstack:options": {
        userName: username,
        accessKey: password,
        appiumVersion: "2.0.1",
      },
    };

    logger.info("Starting WebDriver session on BrowserStack...");
    try {
      driver = await remote({
        protocol: "https",
        hostname: "hub.browserstack.com",
        port: 443,
        path: "/wd/hub",
        capabilities,
      });
    } catch (error) {
      logger.error("Error initializing WebDriver:", error);
      throw new Error(
        "Failed to initialize the WebDriver or a timeout occurred. Please try again.",
      );
    }

    const screenshotBase64 = await driver.takeScreenshot();
    const compressed = await maybeCompressBase64(screenshotBase64);

    return {
      content: [
        {
          type: "image",
          data: compressed,
          mimeType: "image/png",
          name: `screenshot-${selectedDevice.device}-${Date.now()}`,
        },
      ],
    };
  } catch (error) {
    logger.error("Error during app automation or screenshot capture", error);
    throw error;
  } finally {
    if (driver) {
      logger.info("Cleaning up WebDriver session...");
      await driver.deleteSession();
    }
  }
}

/**
 * Registers the `takeAppScreenshot` tool with the MCP server.
 */
export default function addAppAutomationTools(
  server: McpServer,
  config: BrowserStackConfig,
) {
  server.tool(
    "takeAppScreenshot",
    "Use this tool to take a screenshot of an app running on a BrowserStack device. This is useful for visual testing and debugging.",
    {
      desiredPhone: z
        .string()
        .describe(
          "The full name of the device to run the app on. Example: 'iPhone 12 Pro' or 'Samsung Galaxy S20'. Always ask the user for the device they want to use.",
        ),
      desiredPlatformVersion: z
        .string()
        .describe(
          "The platform version to run the app on. Use 'latest' or 'oldest' for dynamic resolution.",
        ),
      desiredPlatform: z
        .enum([Platform.ANDROID, Platform.IOS])
        .describe("Platform to run the app on. Either 'android' or 'ios'."),
      appPath: z
        .string()
        .describe(
          "The path to the .apk or .ipa file. Required for app installation.",
        ),
    },
    async (args) => {
      try {
        trackMCP(
          "takeAppScreenshot",
          server.server.getClientVersion()!,
          undefined,
          config,
        );
        return await takeAppScreenshot({ ...args, config });
      } catch (error) {
        trackMCP(
          "takeAppScreenshot",
          server.server.getClientVersion()!,
          error,
          config,
        );
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error during app automation or screenshot capture: ${errorMessage}`,
            },
          ],
        };
      }
    },
  );
}
