import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for standalone Percy visual testing
 */
const SETUP_PERCY_DESCRIPTION =
  "Set up standalone Percy visual testing using the Percy SDK. Use for Percy Web (integrationType: 'web') or Percy Automate (integrationType: 'app'). Example prompts: set up Percy automate for this project; set up Percy web for this; set up Percy for this.";

/**
 * Registers the standalone Percy setup tool with the MCP server.
 * Focuses on Percy Web and Percy Automate without BrowserStack integration.
 */
export function registerPercySetupTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  server.tool(
    "setupPercyVisualTesting",
    SETUP_PERCY_DESCRIPTION,
    SetUpPercyParamsShape,
    async (args) => {
      return setUpPercyHandler(args, config);
    },
  );
}

export default registerPercySetupTool;
