import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { startBrowserSession } from "./live-utils/start-session";
import logger from "../logger";
import {
  isLocalURL,
  ensureLocalBinarySetup,
  killExistingBrowserStackLocalProcesses,
} from "../lib/local";

/**
 * Launches a Browser Live Session on BrowserStack.
 */
export async function startBrowserLiveSession(args: {
  desiredBrowser: string;
  desiredOSVersion: string;
  desiredURL: string;
  desiredOS: string;
  desiredBrowserVersion: string;
}): Promise<CallToolResult> {
  if (!args.desiredBrowser) {
    throw new Error("You must provide a desiredBrowser.");
  }

  if (!args.desiredURL) {
    throw new Error("You must provide a desiredURL.");
  }

  if (!args.desiredOS) {
    throw new Error("You must provide a desiredOS.");
  }

  if (!args.desiredOSVersion) {
    throw new Error("You must provide a desiredOSVersion.");
  }

  if (!args.desiredBrowserVersion) {
    throw new Error("You must provide a desiredBrowserVersion.");
  }

  // Validate URL format
  try {
    new URL(args.desiredURL);
  } catch (error) {
    logger.error("Invalid URL format: %s", error);
    throw new Error("The provided URL is invalid.");
  }

  const isLocal = isLocalURL(args.desiredURL);
  if (isLocal) {
    await ensureLocalBinarySetup();
  } else {
    await killExistingBrowserStackLocalProcesses();
  }

  const launchUrl = await startBrowserSession({
    browser: args.desiredBrowser,
    os: args.desiredOS,
    osVersion: args.desiredOSVersion,
    url: args.desiredURL,
    browserVersion: args.desiredBrowserVersion,
    isLocal,
  });

  return {
    content: [
      {
        type: "text",
        text: `Successfully started a browser session. If a browser window did not open automatically, use the following URL to start the session: ${launchUrl}`,
      },
    ],
  };
}

export default function addBrowserLiveTools(server: McpServer) {
  server.tool(
    "runBrowserLiveSession",
    "Use this tool when user wants to manually check their website on a particular browser and OS combination using BrowserStack's cloud infrastructure. Can be used to debug layout issues, compatibility problems, etc.",
    {
      desiredBrowser: z
        .string()
        .describe(
          "The browser to run the test on. Example: 'Chrome', 'IE', 'Safari', 'Edge'. Always ask the user for the browser they want to use, do not assume it.",
        ),
      desiredOSVersion: z
        .string()
        .describe(
          "The OS version to run the browser on. Example: '10' for Windows, '12' for macOS, '14' for iOS",
        ),
      desiredOS: z
        .string()
        .describe(
          "The operating system to run the browser on. Example: 'Windows', 'macOS', 'iOS', 'Android'",
        ),
      desiredURL: z
        .string()
        .describe(
          "The URL of the website to test. This can be a local URL (e.g., http://localhost:3000) or a public URL. Always ask the user for the URL, do not assume it.",
        ),
      desiredBrowserVersion: z
        .string()
        .describe(
          "The version of the browser to use. Example: 133.0, 134.0, 87.0",
        ),
    },
    async (args) => {
      try {
        return startBrowserLiveSession(args);
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to start a browser live session. Error: ${error}. Please open an issue on GitHub if the problem persists`,
              isError: true,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
