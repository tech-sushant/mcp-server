import { listTestFiles } from "./percy-snapshot-utils/detect-test-files.js";
import { testFilePathsMap, storedPercyResults } from "../lib/inmemory-store.js";
import { updateFileAndStep } from "./percy-snapshot-utils/utils.js";
import { percyWebSetupInstructions } from "./sdk-utils/percy-web/handler.js";
import crypto from "crypto";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export async function addListTestFiles(): Promise<CallToolResult> {
  const storedResults = storedPercyResults.get();
  if (!storedResults) {
    throw new Error(
      "No Framework details found. Please call expandPercyVisualTesting first to fetch the framework details.",
    );
  }

  const language = storedResults.detectedLanguage;
  const framework = storedResults.detectedTestingFramework;

  // Use stored paths from setUpPercy
  const dirs = storedResults.folderPaths;
  const files = storedResults.filePaths;

  let testFiles: string[] = [];

  if (files && files.length > 0) {
    testFiles = testFiles.concat(files);
  }

  if (dirs && dirs.length > 0) {
    for (const dir of dirs) {
      const discoveredFiles = await listTestFiles({
        language,
        framework,
        baseDir: dir,
      });
      testFiles = testFiles.concat(discoveredFiles);
    }
  }

  // Validate that we have at least one test file
  if (testFiles.length === 0) {
    throw new Error(
      "No test files found. Please provide either specific file paths (files) or directory paths (dirs) containing test files.",
    );
  }

  if (testFiles.length === 1) {
    const result = await updateFileAndStep(testFiles[0],0,1,percyWebSetupInstructions);
    return {
      content: result,
    };
  }

  // For multiple files, use the UUID workflow
  const uuid = crypto.randomUUID();
  testFilePathsMap.set(uuid, testFiles);

  return {
    content: [
      {
        type: "text",
        text: `The Test files are stored in memory with id ${uuid} and the total number of tests files found is ${testFiles.length}. You can use this UUID to retrieve the tests file paths later.`,
      },
      {
        type: "text",
        text: `You can now use the tool addPercySnapshotCommands to update the test file with Percy commands for visual testing with the UUID ${uuid}`,
      },
    ],
  };
}
