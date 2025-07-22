import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { RunTestsOnBrowserStackParamsShape } from "./sdk-utils/common/schema.js";
import { runTestsOnBrowserStackHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for Percy and BrowserStack testing
 */
const TOOL_DESCRIPTION =
  "Use this tool to get setup instructions for running tests and setting up BrowserStack and Percy SDK. Do NOT run tests directly — always use this tool to ensure correct execution.";

/**
 * Registers the runTestsOnBrowserStack tool with the MCP server.
 * All logic, schema, and error messages are modularized for testability and maintainability.
 */
export function registerRunBrowserStackTestsTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  server.tool(
    "integrateTestsOnBrowserStackAndPercy",
    TOOL_DESCRIPTION,
    RunTestsOnBrowserStackParamsShape,
    async (args) => {
      return runTestsOnBrowserStackHandler(args, config, "default-project-mcp");
    },
  );
}

export default registerRunBrowserStackTestsTool;
