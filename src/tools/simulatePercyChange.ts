import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";
import { SIMULATE_PERCY_CHANGE_DESCRIPTION } from "./sdk-utils/common/constants.js";

export function registerSimulatePercyChangeTool(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};
  tools.simulatePercyChange = server.tool(
    "simulatePercyChange",
    SIMULATE_PERCY_CHANGE_DESCRIPTION,
    SetUpPercyParamsShape,
    async (args) => {
      // 1. Analyze the project using existing Percy logic
      const percyAnalysis = await setUpPercyHandler(args, config);

      const instructions = [
        "1. Select a UI component or page in your project that is already covered by a Percy snapshot/test.",
        "2. Inject a visible UI change, such as adding a large, obvious popup or banner in the center of the screen. This change should be easy to spot visually and should not be subtle.",
        "   Example: Add a <div> with a fixed position, bright background color, and large text in the center of the viewport.",
        "3. Ensure the change is only present for the selected test case or snapshot (if possible), to avoid affecting unrelated tests.",
        "4. Re-run your Percy visual tests using the same workflow as before.",
        "5. Visit the Percy dashboard and confirm that the visual difference is detected and highlighted.",
        "6. After confirming, revert the simulated change to restore your UI to its original state."
      ];
      const instruction = { type: "text" as const, text: instructions.join('\n') };
      percyAnalysis.content?.push(instruction);
      return percyAnalysis;
    }
  );
  return tools;
}

export default registerSimulatePercyChangeTool;
