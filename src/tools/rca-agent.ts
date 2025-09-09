import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import logger from "../logger.js";
import { BrowserStackConfig } from "../lib/types.js";
import { getBrowserStackAuth } from "../lib/get-auth.js";
import { getBuildId } from "./rca-agent-utils/get-build-id.js";
import { getTestIds } from "./rca-agent-utils/get-failed-test-id.js";
import { getRCAData } from "./rca-agent-utils/rca-data.js";
import { formatRCAData } from "./rca-agent-utils/format-rca.js";
import { TestStatus } from "./rca-agent-utils/types.js";

// Tool function that fetches RCA data
export async function fetchRCADataTool(
  args: { testId: string[] },
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const authString = getBrowserStackAuth(config);

    // Limit to first 3 test IDs for performance
    const testIds = args.testId.slice(0, 3);

    const rcaData = await getRCAData(testIds, authString);

    const formattedData = formatRCAData(rcaData);

    return {
      content: [
        {
          type: "text",
          text: formattedData,
        },
      ],
    };
  } catch (error) {
    logger.error("Error fetching RCA data", error);
    throw error;
  }
}

export async function listTestIdsTool(
  args: {
    projectName: string;
    buildName: string;
    status?: TestStatus;
  },
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const { projectName, buildName, status } = args;
    const authString = getBrowserStackAuth(config);
    const [username, accessKey] = authString.split(":");

    // Get build ID if not provided
    const buildId = await getBuildId(
      username,
      accessKey,
      projectName,
      buildName,
    );

    // Get test IDs
    const testIds = await getTestIds(buildId, authString, status);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(testIds, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error("Error listing test IDs", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: `Error listing test IDs: ${errorMessage}`,
        },
      ],
    };
  }
}

// Registers the fetchRCA tool with the MCP server
export default function addRCATools(
  server: McpServer,
  config: BrowserStackConfig,
) {
  const tools: Record<string, any> = {};

  tools.fetchRCA = server.tool(
    "fetchRCA",
    "Retrieves AI-RCA (Root Cause Analysis) data for a BrowserStack Automate and App-Automate session and provides insights into test failures.",
    {
      testId: z
        .array(z.string())
        .max(3)
        .describe(
          "Array of test IDs to fetch RCA data. Input should be a maximum of 3 IDs at a time. If you get more than 3 Ids ask user to choose less than 3",
        ),
    },
    async (args) => {
      try {
        return await fetchRCADataTool(args, config);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error during fetching RCA data: ${errorMessage}`,
            },
          ],
        };
      }
    },
  );

  tools.listTestIds = server.tool(
    "listTestIds",
    "List test IDs from a BrowserStack Automate build, optionally filtered by status",
    {
      projectName: z.string().describe("The project name of the test run"),
      buildName: z.string().describe("The build name of the test run"),
      status: z
        .nativeEnum(TestStatus)
        .optional()
        .describe(
          "Filter tests by status. If not provided, all tests are returned.",
        ),
    },
    async (args) => {
      try {
        return await listTestIdsTool(args, config);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error during listing test IDs: ${errorMessage}`,
            },
          ],
        };
      }
    },
  );

  return tools;
}
