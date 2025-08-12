import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { trackMCP } from "../lib/instrumentation.js";
import { getAppSDKPrefixCommand } from "./app-sdk-utils/commands.js";

import {
  AppSDKSupportedFramework,
  AppSDKSupportedLanguage,
  AppSDKSupportedTestingFramework,
  AppSDKSupportedPlatform,
  AppSDKSupportedLanguageEnum,
  AppSDKSupportedFrameworkEnum,
  AppSDKSupportedTestingFrameworkEnum,
  AppSDKSupportedPlatformEnum,
} from "./app-sdk-utils/types.js";

import {
  generateAppBrowserStackYMLInstructions,
  getAppInstructionsForProjectConfiguration,
  formatAppInstructionsWithNumbers,
} from "./app-sdk-utils/instructions.js";

import { getBrowserStackAuth } from "../lib/get-auth.js";
import { BrowserStackConfig } from "../lib/types.js";

/**
 * BrowserStack App Automate SDK hooks into your mobile test framework to seamlessly run tests on BrowserStack.
 * This tool gives instructions to setup a browserstack.yml file in the project root and installs the necessary dependencies.
 */
export async function bootstrapAppProjectWithSDK({
  detectedFramework,
  detectedTestingFramework,
  detectedLanguage,
  desiredPlatforms,
  appPath,
  config,
}: {
  detectedFramework: AppSDKSupportedFramework;
  detectedTestingFramework: AppSDKSupportedTestingFramework;
  detectedLanguage: AppSDKSupportedLanguage;
  desiredPlatforms: AppSDKSupportedPlatform[];
  appPath?: string;
  config: BrowserStackConfig;
}): Promise<CallToolResult> {
  // Get credentials from config
  const authString = getBrowserStackAuth(config);
  const [username, accessKey] = authString.split(":");

  // Get SDK setup command
  const sdkSetupCommand = getAppSDKPrefixCommand(
    detectedLanguage,
    detectedTestingFramework,
    username,
    accessKey,
    appPath,
  );

  // Generate browserstack.yml instructions
  const ymlInstructions = generateAppBrowserStackYMLInstructions(
    desiredPlatforms,
    username,
    accessKey,
    appPath || "bs://sample.app",
  );

  // Get project configuration instructions
  const instructionsForProjectConfiguration =
    getAppInstructionsForProjectConfiguration(
      detectedFramework,
      detectedTestingFramework,
      detectedLanguage,
    );

  let combinedInstructions = "";

  // Step 1: Add SDK setup command
  if (sdkSetupCommand) {
    combinedInstructions += sdkSetupCommand;
  }

  // Step 2: Add browserstack.yml setup
  if (ymlInstructions) {
    combinedInstructions += "\n\n" + ymlInstructions;
  }

  // Step 3: Add language/framework-specific setup
  if (instructionsForProjectConfiguration) {
    combinedInstructions += "\n\n" + instructionsForProjectConfiguration;
  }

  // Apply consistent formatting for all configurations
  return formatFinalAppInstructions(combinedInstructions);
}

// Helper function to apply consistent formatting to all instruction types
function formatFinalAppInstructions(
  combinedInstructions: string,
): CallToolResult {
  const fullInstructions = `⚠️ IMPORTANT: DO NOT SKIP ANY STEP
All the setup steps described in this file MUST be executed regardless of any existing configuration or setup.
This ensures proper BrowserStack App Automate SDK setup.

${formatAppInstructionsWithNumbers(combinedInstructions)}`;

  return {
    content: [
      {
        type: "text",
        text: fullInstructions,
        isError: false,
      },
    ],
  };
}

export default function addAppSDKTools(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};

  tools.setupBrowserStackAppAutomateTests = server.tool(
    "setupBrowserStackAppAutomateTests",
    "Set up and run automated mobile app tests on BrowserStack using the BrowserStack App Automate SDK. Use for mobile app functional or integration tests on real Android and iOS devices. Example prompts: run this mobile app test on browserstack; set up this project for browserstack app automate; test my app on android devices. Integrate BrowserStack App Automate SDK into your project",
    {
      detectedFramework: z
        .nativeEnum(AppSDKSupportedFrameworkEnum)
        .describe(
          "The mobile automation framework configured in the project. Example: 'appium'",
        ),

      detectedTestingFramework: z
        .nativeEnum(AppSDKSupportedTestingFrameworkEnum)
        .describe(
          "The testing framework used in the project. Currently supports TestNG for Java projects. Example: 'testng'",
        ),

      detectedLanguage: z
        .nativeEnum(AppSDKSupportedLanguageEnum)
        .describe(
          "The programming language used in the project. Currently supports Java. Example: 'java'",
        ),

      desiredPlatforms: z
        .array(z.nativeEnum(AppSDKSupportedPlatformEnum))
        .describe(
          "The mobile platforms the user wants to test on. Always ask this to the user, do not try to infer this. Example: ['android', 'ios']",
        ),

      appPath: z
        .string()
        .optional()
        .describe(
          "Path to the mobile app file (.apk for Android, .ipa for iOS). Can be a local file path or a BrowserStack app URL (bs://). If not provided, will use sample app.",
        ),
    },

    async (args) => {
      try {
        trackMCP(
          "setupBrowserStackAppAutomateTests",
          server.server.getClientVersion()!,
          undefined,
          config,
        );

        return await bootstrapAppProjectWithSDK({
          detectedFramework: args.detectedFramework as AppSDKSupportedFramework,
          detectedTestingFramework:
            args.detectedTestingFramework as AppSDKSupportedTestingFramework,
          detectedLanguage: args.detectedLanguage as AppSDKSupportedLanguage,
          desiredPlatforms: args.desiredPlatforms as AppSDKSupportedPlatform[],
          appPath: args.appPath,
          config,
        });
      } catch (error) {
        trackMCP(
          "setupBrowserStackAppAutomateTests",
          server.server.getClientVersion()!,
          error,
          config,
        );

        return {
          content: [
            {
              type: "text",
              text: `Failed to bootstrap project with BrowserStack App Automate SDK. Error: ${error}. Please open an issue on GitHub if the problem persists`,
              isError: true,
            },
          ],
          isError: true,
        };
      }
    },
  );

  return tools;
}
