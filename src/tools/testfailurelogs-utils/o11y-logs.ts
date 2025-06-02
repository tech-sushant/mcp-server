import { TestObservabilityLog, TestObservabilityLogResponse } from "./types.js";
import {
  filterBrowserstackLogs,
  filterHookRunLogs,
  filterSdkLogs,
} from "./filters.js";

// Authentication
let customAuth: string | undefined;

export function setObservabilityLogsAuth(authString: string) {
  customAuth = authString;
}

function getAuth() {
  return customAuth;
}

// Fetch and filter observability logs for a test run
export async function retrieveTestObservabilityLogs(
  testId: string,
): Promise<TestObservabilityLog> {
  const url = `https://api-observability.browserstack.com/ext/v1/testRun/${testId}/logs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${getAuth()}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Test with ID ${testId} not found. Please check the test ID and try again.`,
      );
    }
    throw new Error(
      `Failed to retrieve observability logs for test ID ${testId}`,
    );
  }

  const ollyLogs = (await response.json()) as TestObservabilityLogResponse;
  return await processAndFilterLogs(ollyLogs);
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
