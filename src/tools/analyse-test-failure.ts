import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { retrieveTestObservabilityLogs } from "./testfailurelogs-utils/o11y-logs.js";
import { retrieveObservabilityTestCase } from "./testfailurelogs-utils/test-case.js";

export async function analyseTestFailure(args: {
  testId: string;
}): Promise<CallToolResult> {
  try {
    const failureLogs = await retrieveTestObservabilityLogs(args.testId);
    const testCase = await retrieveObservabilityTestCase(args.testId);

    const response = {
      failure_logs: failureLogs,
      test_case: testCase,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: `Error reading log files: ${errorMessage}`,
        },
      ],
    };
  }
}

export default function addAnalyseTestFailureTool(server: McpServer) {
  server.tool(
    "analyseTestFailure",
    "Fetch the logs of a test run from BrowserStack",
    {
      testId: z
        .string()
        .describe("The BrowserStack test ID to fetch logs from"),
    },
    async (args) => {
      try {
        return await analyseTestFailure(args);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error during fetching test logs: ${errorMessage}`,
            },
          ],
        };
      }
    },
  );
}
