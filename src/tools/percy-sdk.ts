import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for standalone Percy visual testing
 */
const SETUP_PERCY_DESCRIPTION =
  "This tool is intended only for Percy Web (integrationType: 'web') and is meant for users running Percy on their own infrastructure. If you're using Percy Automate, use the setupBrowserStackAutomateTests tool instead. If the user simply requests \"setup Percy\", and the codebase already uses BrowserStack Automate, default to using setupBrowserStackAutomateTests";

/**
 * Registers the standalone Percy setup tool with the MCP server.
 * Focuses on Percy Web and Percy Automate without BrowserStack integration.
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
