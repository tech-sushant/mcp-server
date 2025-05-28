import { TestObservabilityLog, TestObservabilityLogResponse } from "./types.js";
import config from "../../config.js";
import {
  filterBrowserstackLogs,
  filterHookRunLogs,
  filterSdkLogs,
} from "./filters.js";

// Authentication
const auth = Buffer.from(
  `${config.browserstackUsername}:${config.browserstackAccessKey}`,
).toString("base64");

// Fetch and filter observability logs for a test run
export async function retrieveTestObservabilityLogs(
  testId: string,
): Promise<TestObservabilityLog> {
  const url = `https://api-observability.browserstack.com/ext/v1/testRun/${testId}/logs`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to retrieve logs: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const ollyLogs = (await response.json()) as TestObservabilityLogResponse;
    return await processAndFilterLogs(ollyLogs);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to retrieve observability logs: ${message}`);
  }
}

// Filter and structure logs for output
async function processAndFilterLogs(
  logData: TestObservabilityLogResponse,
): Promise<any> {
  return {
    failureLogs: logData.failureLogs,
    browserstackLogs: await filterBrowserstackLogs(
      logData.browserstackLogs,
      logData.testStartedAt,
      logData.testFinishedAt,
    ),
    sdkLogs: await filterSdkLogs(
      logData.sdkLogs,
      logData.testStartedAt,
      logData.testFinishedAt,
    ),
    hookRunLogs: await filterHookRunLogs(
      logData.hookRunLogs,
      logData.testStartedAt,
      logData.testFinishedAt,
    ),
    framework: logData.framework || null,
  };
}
