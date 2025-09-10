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

// Tool function to fetch build ID
export async function getBuildIdTool(
  args: {
    projectName: string;
    buildName: string;
  },
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const { projectName, buildName } = args;
    const authString = getBrowserStackAuth(config);
    const [username, accessKey] = authString.split(":");
    const buildId = await getBuildId(
      projectName,
      buildName,
      username,
      accessKey,
    );
    return {
      content: [
        {
          type: "text",
          text: buildId,
        },
      ],
    };
  } catch (error) {
    logger.error("Error fetching build ID", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: `Error fetching build ID: ${errorMessage}`,
        },
      ],
    };
  }
}

// Tool function that fetches RCA data
export async function fetchRCADataTool(
  args: { testId: string[] },
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const authString = getBrowserStackAuth(config);

    // Limit to first 3 test IDs for performance
    const testIds = args.testId;

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
    buildId: string;
    status?: TestStatus;
  },
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const { buildId, status } = args;
    const authString = getBrowserStackAuth(config);

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
          "Array of test IDs to fetch RCA data for (maximum 3 IDs). If not provided, use the listTestIds tool get all failed testcases. If more than 3 IDs are provided, only the first 3 will be processed.",
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

  tools.getBuildId = server.tool(
    "getBuildId",
    "Get the BrowserStack build ID for a given project and build name.",
    {
      projectName: z
        .string()
        .describe(
          "The Browserstack project name used while creation of test run. Check browserstack.yml or similar project configuration files. If found extract it and provide to user, IF not found or unsure, prompt the user for this value. Do not make assumptions",
        ),
      buildName: z
        .string()
        .describe(
          "The Browserstack build name used while creation of test run. Check browserstack.yml or similar project configuration files. If found extract it and provide to user, IF not found or unsure, prompt the user for this value. Do not make assumptions",
        ),
    },
    async (args) => {
      try {
        return await getBuildIdTool(args, config);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error during fetching build ID: ${errorMessage}`,
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
      buildId: z
        .string()
        .describe(
          "The Browserstack Build ID of the test run. If not known, use the getBuildId tool to fetch it using project and build name",
        ),
      status: z
        .nativeEnum(TestStatus)
        .describe(
          "Filter tests by status. If not provided, all tests are returned. Example for RCA usecase always use failed status",
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
