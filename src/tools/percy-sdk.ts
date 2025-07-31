import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for standalone Percy visual testing
 */
const SETUP_PERCY_DESCRIPTION =
  "Set up Percy visual testing. Supports both Percy Web (integrationType: 'web') for standalone Percy testing on your own infrastructure, and Percy Automate (integrationType: 'automate') for Percy with BrowserStack Automate. For Percy Automate, this tool will guide you to set up BrowserStack Automate first using setupBrowserStackAutomateTests if needed. Example prompts: setup Percy for web testing; setup Percy with BrowserStack Automate.";

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
