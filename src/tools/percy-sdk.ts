import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BrowserStackConfig } from "../lib/types.js";
import { SetUpPercyParamsShape } from "./sdk-utils/common/schema.js";
import { setUpPercyHandler } from "./sdk-utils/handler.js";

/**
 * Tool description for standalone Percy visual testing
 */
const SETUP_PERCY_DESCRIPTION =
  "Set up Percy visual testing for your project. This supports both Percy Web Standalone and Percy Automate.";

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
      return setUpPercyHandler(args, config, server);
    },
  );
  return tools;
}

import fs from "fs";
import path from "path";
import crypto from "crypto";
// set the json in memory to hold the spec file paths with uuid as key
const specFilePaths: Record<string, string[]> = {};

function findSpecFiles(dir: string): any {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...findSpecFilesRecursive(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".spec.js")) {
        files.push(fullPath);
      }
    }
    
    // Store the found spec files in memory with a UUID key
    const uuid = crypto.randomUUID();
    specFilePaths[uuid] = files;
    return {uuid,length};
  } catch (error) {
    // Return a UUID even if no files are found or there's an error
    const uuid = crypto.randomUUID();
    specFilePaths[uuid] = files; // files will be empty array
    const length = files.length;
    return {uuid,length} ;
  }
}

function findSpecFilesRecursive(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...findSpecFilesRecursive(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".spec.js")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors and continue
  }

  return files;
}

import { z } from "zod";

export const SetSpecFilePathParams = {
  testPath: z
    .string()
    .describe(
      "Path to the directory containing test files for Percy integration sampling.",
    ),
};

export function SetSpecFilePath(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};
  tools.SetSpecFilePath = server.tool(
    "setSpecFilePath",
    "Set the path to the spec file for Percy visual testing and return the UUID for later retrieval.",
    SetSpecFilePathParams,
    async (args) => {
      const { uuid, length } = findSpecFiles(args.testPath);
      return {
        content: [
          {
            type: "text",
            text: `The Spec file is stored in memory with id ${uuid} and the total number of spec files found is ${length}. You can use this UUID to retrieve the spec file paths later.`,
          },
          {
            type: "text",
            text: `You can now use the tool UpdateTestFileWithPercy to update the test file with Percy commands for visual testing. with the UUID ${uuid}`,
          },
        ],
      };
    },
  );
  return tools;
}


export const UpdateTestFileWithPercyParams = {
  uuid: z.string().describe("UUID of the spec file paths"),
  index: z.number().optional().describe("Optional index to specify which spec file to update").default(0),
};

export function UpdateTestFileWithPercy(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};

  tools.UpdateTestFileWithPercy = server.tool(
    "updateTestFileWithPercy",
    "Update the test file with Percy commands for visual testing.",
    UpdateTestFileWithPercyParams,
    async (args, extra) => {
      const file = specFilePaths[args.uuid][args.index];
      const instructions = `To enable visual testing with Percy, you need to add the screenshot commands in the given test file:
 import \`percy\` and use it to take a screenshot:

\`\`\`javascript
Example usage:
// import percy
const { percy } = require('browserstack-node-sdk');

//inside the real test cases in the file add the screenshot command as below
describe("<Your Test Code>", () => {
  it("<Your Test Case>", async () => {
    await percy.screenshot(driver, "<Relevant Snapshot Name>");
  });
});
\`\`\``;


      const content: { type: "text"; text: string }[] = [
        {
          type: "text",
          text: `Complete all the steps and in sequence. If their is request to call the tool Call the tool after updating the file only. Strictly follow the instructions provided.`,
        },
        {
          type: "text",
          text: `Step 1 : Update file ${file} with the following instructions:\n${instructions}`,
        }
      ];

      // Only add the next step instruction if there's a next index available
      const nextIndex = args.index + 1;
      if (specFilePaths[args.uuid] && nextIndex < specFilePaths[args.uuid].length) {
        content.push({
          type: "text",
          text: `Step 2 : Call the tool UpdateTestFileWithPercy with index as ${nextIndex} out of ${specFilePaths[args.uuid].length}`,
        });
      }

      return {
        content: content, 
      };
    },
  );
  return tools;
}
