import config from "../../config.js";
import {
  filterLinesByKeywords,
  validateResponse,
  LogResponse,
} from "../../lib/utils.js";

const auth = Buffer.from(
  `${config.browserstackUsername}:${config.browserstackAccessKey}`,
).toString("base64");

// DEVICE LOGS
export async function retrieveDeviceLogs(
  sessionId: string,
  buildId: string,
): Promise<LogResponse> {
  const url = `https://api.browserstack.com/app-automate/builds/${buildId}/sessions/${sessionId}/deviceLogs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  const validationResult = validateResponse(response, "device logs");
  if (validationResult) return validationResult;

  const logText = await response.text();
  return { logs: filterDeviceFailures(logText) };
}

// APPIUM LOGS
export async function retrieveAppiumLogs(
  sessionId: string,
  buildId: string,
): Promise<LogResponse> {
  const url = `https://api.browserstack.com/app-automate/builds/${buildId}/sessions/${sessionId}/appiumlogs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  const validationResult = validateResponse(response, "Appium logs");
  if (validationResult) return validationResult;

  const logText = await response.text();
  return { logs: filterAppiumFailures(logText) };
}

// CRASH LOGS
export async function retrieveCrashLogs(
  sessionId: string,
  buildId: string,
): Promise<LogResponse> {
  const url = `https://api.browserstack.com/app-automate/builds/${buildId}/sessions/${sessionId}/crashlogs`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  const validationResult = validateResponse(response, "crash logs");
  if (validationResult) return validationResult;

  const logText = await response.text();
  return { logs: filterCrashFailures(logText) };
}

// FILTER HELPERS
export function filterDeviceFailures(logText: string): string[] {
  const keywords = [
    "error",
    "exception",
    "fatal",
    "anr",
    "not responding",
    "process crashed",
    "crash",
    "force close",
    "signal",
    "java.lang.",
    "unable to",
  ];
  return filterLinesByKeywords(logText, keywords);
}

export function filterAppiumFailures(logText: string): string[] {
  const keywords = [
    "error",
    "fail",
    "exception",
    "not found",
    "no such element",
    "unable to",
    "stacktrace",
    "appium exited",
    "command failed",
    "invalid selector",
  ];
  return filterLinesByKeywords(logText, keywords);
}

export function filterCrashFailures(logText: string): string[] {
  const keywords = [
    "fatal exception",
    "crash",
    "signal",
    "java.lang.",
    "caused by:",
    "native crash",
    "anr",
    "abort message",
    "application has stopped unexpectedly",
  ];
  return filterLinesByKeywords(logText, keywords);
}
