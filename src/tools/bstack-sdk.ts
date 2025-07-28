import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { RunTestsOnBrowserStackParamsShape } from "./sdk-utils/common/schema.js";
import { runTestsOnBrowserStackHandler } from "./sdk-utils/handler.js";

const RUN_ON_BROWSERSTACK_DESCRIPTION =
  "Use this tool to get setup instructions for running your functional tests on BrowserStack's cloud infrastructure. You can run tests using the BrowserStack SDK alone, or enable Percy visual testing integration (only where BrowserStack SDK has built-in Percy support). For standalone Percy setups (Percy Web or Percy Automate), use the Percy SDK tools instead.";

export function registerRunBrowserStackTestsTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  server.tool(
    "runTestsOnBrowserStack",
    RUN_ON_BROWSERSTACK_DESCRIPTION,
    RunTestsOnBrowserStackParamsShape,
    async (args) => {
      return runTestsOnBrowserStackHandler(args, config);
    },
  );
}

export default registerRunBrowserStackTestsTool;
