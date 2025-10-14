import { storedPercyResults } from "../lib/inmemory-store.js";
import { updateFileAndStep } from "./percy-snapshot-utils/utils.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { percyWebSetupInstructions } from "../tools/sdk-utils/percy-web/handler.js";

export async function updateTestsWithPercyCommands(args: {
  uuid: string;
  index: number;
}): Promise<CallToolResult> {
  const { uuid, index } = args;
  const stored = storedPercyResults.get();

  if (!stored || !stored.uuid || stored.uuid !== uuid || !stored[uuid]) {
    throw new Error(`No test files found in memory for UUID: ${uuid}`);
  }

  const fileStatusMap = stored[uuid];
  const filePaths = Object.keys(fileStatusMap);

  if (index < 0 || index >= filePaths.length) {
    throw new Error(
      `Invalid index: ${index}. There are ${filePaths.length} files for UUID: ${uuid}`,
    );
  }

  const result = await updateFileAndStep(
    filePaths[index],
    index,
    filePaths.length,
    percyWebSetupInstructions,
  );

  // Mark this file as updated (true) in the unified structure
  const updatedStored = { ...stored };
  updatedStored[uuid][filePaths[index]] = true; // true = updated
  storedPercyResults.set(updatedStored);

  return {
    content: result,
  };
}
