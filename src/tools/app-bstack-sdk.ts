import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setupAppAutomateHandler } from "./app-sdk-utils/handler.js";
import { BrowserStackConfig } from "../lib/types.js";
import {
  SETUP_APP_BSTACK_DESCRIPTION,
  SetupAppBstackParamsShape,
} from "./app-sdk-utils/common/constants.js";

export function registerAppBstackTools(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};

  tools.setupBrowserStackAppAutomateTests = server.tool(
    "setupBrowserStackAppAutomateTests",
    SETUP_APP_BSTACK_DESCRIPTION,
    SetupAppBstackParamsShape,
    async (args) => {
      try {
        return await setupAppAutomateHandler(args, config);
      } catch (error) {
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

export default registerAppBstackTools;
