import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for standalone Percy visual testing
 */
const SETUP_PERCY_DESCRIPTION =
  "Set up Percy visual testing. Supports Percy Web (detectedIntegrationType: 'web') for standalone Percy testing, Percy Automate (detectedIntegrationType: 'automate') for Percy with BrowserStack Automate setup, and Percy Automate when BrowserStack is already configured (detectedIntegrationType: 'automate_already_setup'). For Percy Automate setup, you will first need to call the setupBrowserStackAutomateTests tool if BrowserStack Automate is not already configured. Example prompts: setup Percy for web testing; setup Percy with BrowserStack Automate.";

/**
 * Registers the Percy setup tool with the MCP server.
 * Handles both Percy Web and Percy Automate independently.
 * For Percy Automate, guides users to set up BrowserStack Automate first.
 */
export function registerPercySetupTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};
  tools.setupPercyVisualTesting = server.tool(
    "setupPercyVisualTesting",
    SETUP_PERCY_DESCRIPTION,
    SetUpPercyParamsShape,
    async (args) => {
      return setUpPercyHandler(args, config);
    },
  );
  return tools;
}

export default registerPercySetupTool;
