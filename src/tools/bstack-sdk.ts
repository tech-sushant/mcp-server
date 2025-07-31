import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { RunTestsOnBrowserStackParamsShape } from "./sdk-utils/common/schema.js";
import { runTestsOnBrowserStackHandler } from "./sdk-utils/handler.js";

const RUN_ON_BROWSERSTACK_DESCRIPTION =
  "Set up and run automated web-based tests on BrowserStack using the BrowserStack SDK. This tool only handles BrowserStack Automate setup without Percy integration. For Percy visual testing, use the setupPercyVisualTesting tool separately. Example prompts: run this test on browserstack; set up this project for browserstack automate.";

export function registerRunBrowserStackTestsTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};
  tools.setupBrowserStackAutomateTests = server.tool(
    "setupBrowserStackAutomateTests",
    RUN_ON_BROWSERSTACK_DESCRIPTION,
    RunTestsOnBrowserStackParamsShape,
    async (args) => {
      return runTestsOnBrowserStackHandler(args, config);
    },
  );

  return tools;
}

export default registerRunBrowserStackTestsTool;
