import config from "../../config.js";
import {
  HarEntry,
  HarFile,
  filterLinesByKeywords,
  validateLogResponse,
  LogResponse,
} from "./utils.js";

const auth = Buffer.from(
  `${config.browserstackUsername}:${config.browserstackAccessKey}`,
).toString("base64");

// NETWORK LOGS
export async function retrieveNetworkFailures(
  sessionId: string,
): Promise<LogResponse> {
  const url = `https://api.browserstack.com/automate/sessions/${sessionId}/networklogs`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  const validationResult = validateLogResponse(response, "network logs");
  if (validationResult) return validationResult;

  const networklogs: HarFile = await response.json();

  // Filter for failure logs
  const failureEntries: HarEntry[] = networklogs.log.entries.filter(
    (entry: HarEntry) => {
      return (
        entry.response.status === 0 ||
        entry.response.status >= 400 ||
        entry.response._error !== undefined
      );
    },
  );

  return {
    logs: failureEntries.map((entry: any) => ({
      startedDateTime: entry.startedDateTime,
      request: {
        method: entry.request?.method,
        url: entry.request?.url,
        queryString: entry.request?.queryString,
      },
      response: {
        status: entry.response?.status,
        statusText: entry.response?.statusText,
        _error: entry.response?._error,
      },
      serverIPAddress: entry.serverIPAddress,
      time: entry.time,
    })),
  };
}

// SESSION LOGS
export async function retrieveSessionFailures(
  sessionId: string,
): Promise<LogResponse> {
  const url = `https://api.browserstack.com/automate/sessions/${sessionId}/logs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  const validationResult = validateLogResponse(response, "session logs");
  if (validationResult) return validationResult;

  const logText = await response.text();
  return { logs: filterSessionFailures(logText) };
}

// CONSOLE LOGS
export async function retrieveConsoleFailures(
  sessionId: string,
): Promise<LogResponse> {
  const url = `https://api.browserstack.com/automate/sessions/${sessionId}/consolelogs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  const validationResult = validateLogResponse(response, "console logs");
  if (validationResult) return validationResult;

  const logText = await response.text();
  return { logs: filterConsoleFailures(logText) };
}

// FILTER: session logs
export function filterSessionFailures(logText: string): string[] {
  const keywords = [
    "error",
    "fail",
    "exception",
    "fatal",
    "unable to",
    "not found",
    '"success":false',
    '"success": false',
    '"msg":',
    "console.error",
    "stderr",
  ];
  return filterLinesByKeywords(logText, keywords);
}

// FILTER: console logs
export function filterConsoleFailures(logText: string): string[] {
  const keywords = [
    "failed to load resource",
    "uncaught",
    "typeerror",
    "referenceerror",
    "scanner is not ready",
    "status of 4",
    "status of 5",
    "not found",
    "undefined",
    "error:",
  ];
  return filterLinesByKeywords(logText, keywords);
}
