import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import logger from "../logger.js";
import { retrieveTestObservabilityLogs } from "./testfailurelogs-utils/o11y-logs.js";
import {
  retrieveObservabilityTestCase,
  setObservabilityAuth,
} from "./testfailurelogs-utils/test-case.js";
import { setObservabilityLogsAuth } from "./testfailurelogs-utils/o11y-logs.js";
import { trackMCP } from "../lib/instrumentation.js";

export async function analyseTestFailure(args: {
  testId: string;
  browserstackUsername: string;
  browserstackAccessKey: string;
}): Promise<CallToolResult> {
  try {
    // Set custom auth for this tool (if needed)
    const authString = Buffer.from(
      `${args.browserstackUsername || ""}:${args.browserstackAccessKey || ""}`,
    ).toString("base64");

    setObservabilityAuth(authString);
    setObservabilityLogsAuth(authString);

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
    logger.error("Error during analysing the test ID", error);
    throw error;
  }
}

export default function addAnalyseTestFailureTool(server: McpServer) {
  server.tool(
    "analyseTestFailure",
    "Use this tool to analyse a failed test-id from BrowserStack Test Reporting and Analytics",
    {
      testId: z.string().describe("The BrowserStack test ID to analyse"),
      browserstackUsername: z.string().describe("Your BrowserStack username"),
      browserstackAccessKey: z
        .string()
        .describe("Your BrowserStack access key"),
    },
    async (args) => {
      try {
        trackMCP("analyseTestFailure", server.server.getClientVersion()!);
        return await analyseTestFailure(args);
      } catch (error) {
        trackMCP("analyseTestFailure", server.server.getClientVersion()!);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error during analysing test ID: ${errorMessage}`,
            },
          ],
        };
      }
    },
  );
}
