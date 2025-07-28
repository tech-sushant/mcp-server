import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for standalone Percy visual testing
 */
const SETUP_PERCY_DESCRIPTION =
  "Use this tool to get setup instructions for standalone Percy visual testing. This sets up Percy with your own testing infrastructure: Percy Web for local projects, or Percy Automate for your own Selenium/Playwright grid. This does NOT integrate with BrowserStack's test execution infrastructure - use BrowserStack SDK tools for that.";

/**
 * Registers the standalone Percy setup tool with the MCP server.
 * Focuses on Percy Web and Percy Automate without BrowserStack integration.
 */
export function registerPercySetupTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  server.tool(
    "setUpPercy",
    SETUP_PERCY_DESCRIPTION,
    SetUpPercyParamsShape,
    async (args) => {
      return setUpPercyHandler(args, config);
    },
  );
}

export default registerPercySetupTool;
