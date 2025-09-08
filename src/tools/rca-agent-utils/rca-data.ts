import { RCAState, RCATestCase, RCAResponse } from "./types.js";

interface ScanProgressContext {
  sendNotification: (notification: any) => Promise<void>;
  _meta?: {
    progressToken?: string | number;
  };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isInProgressState(state: RCAState): boolean {
  return [
    RCAState.PENDING,
    RCAState.FETCHING_LOGS,
    RCAState.GENERATING_RCA,
    RCAState.GENERATED_RCA,
  ].includes(state);
}

function isFailedState(state: RCAState): boolean {
  return [
    RCAState.FAILED,
    RCAState.LLM_SERVICE_ERROR,
    RCAState.LOG_FETCH_ERROR,
    RCAState.UNKNOWN_ERROR,
    RCAState.TIMEOUT,
  ].includes(state);
}

function calculateProgress(
  resolvedCount: number,
  totalCount: number,
  baseProgress: number = 10,
): number {
  const progressRange = 90 - baseProgress;
  const completionProgress = (resolvedCount / totalCount) * progressRange;
  return Math.min(100, baseProgress + completionProgress);
}

async function notifyProgress(
  context: ScanProgressContext | undefined,
  message: string,
  progress: number,
) {
  if (!context?.sendNotification) return;

  await context.sendNotification({
    method: "notifications/progress",
    params: {
      progressToken: context._meta?.progressToken?.toString(),
      message,
      progress,
      total: 100,
    },
  });
}

async function updateProgress(
  context: ScanProgressContext | undefined,
  testCases: RCATestCase[],
  message?: string,
) {
  const inProgressCases = testCases.filter((tc) => isInProgressState(tc.state));
  const resolvedCount = testCases.length - inProgressCases.length;

  await notifyProgress(
    context,
    message ??
      `RCA analysis in progress (${resolvedCount}/${testCases.length} resolved)`,
    inProgressCases.length === 0
      ? 100
      : calculateProgress(resolvedCount, testCases.length),
  );
}

async function fetchInitialRCA(
  testId: string,
  headers: Record<string, string>,
  baseUrl: string,
): Promise<RCATestCase> {
  const url = baseUrl.replace("{testId}", testId);

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      return {
        id: testId,
        testRunId: testId,
        state: RCAState.LOG_FETCH_ERROR,
        rcaData: {
          error: `HTTP ${response.status}: Failed to start RCA analysis`,
        },
      };
    }

    const data = await response.json();

    const apiState = data.state?.toLowerCase();
    let resultState: RCAState;

    if (apiState === "completed") resultState = RCAState.COMPLETED;
    else if (apiState === "pending") resultState = RCAState.PENDING;
    else if (apiState === "fetching_logs") resultState = RCAState.FETCHING_LOGS;
    else if (apiState === "generating_rca")
      resultState = RCAState.GENERATING_RCA;
    else if (apiState === "generated_rca") resultState = RCAState.GENERATED_RCA;
    else if (apiState === "processing" || apiState === "running")
      resultState = RCAState.GENERATING_RCA;
    else if (apiState === "failed" || apiState === "error")
      resultState = RCAState.UNKNOWN_ERROR;
    else if (apiState) resultState = RCAState.UNKNOWN_ERROR;
    else resultState = RCAState.PENDING;

    return {
      id: testId,
      testRunId: testId,
      state: resultState,
      ...(resultState === RCAState.COMPLETED && { rcaData: data }),
      ...(isFailedState(resultState) &&
        data.state && {
          rcaData: {
            error: `API returned state: ${data.state}`,
            originalResponse: data,
          },
        }),
    };
  } catch (error) {
    return {
      id: testId,
      testRunId: testId,
      state: RCAState.LLM_SERVICE_ERROR,
      rcaData: {
        error:
          error instanceof Error ? error.message : "Network or parsing error",
      },
    };
  }
}

async function pollRCAResults(
  testCases: RCATestCase[],
  headers: Record<string, string>,
  baseUrl: string,
  context: ScanProgressContext | undefined,
  pollInterval: number,
  timeout: number,
  initialDelay: number,
): Promise<RCAResponse> {
  const startTime = Date.now();
  await delay(initialDelay);

  try {
    while (true) {
      const inProgressCases = testCases.filter((tc) =>
        isInProgressState(tc.state),
      );
      await updateProgress(context, testCases);

      if (inProgressCases.length === 0) break;

      if (Date.now() - startTime >= timeout) {
        inProgressCases.forEach((tc) => {
          tc.state = RCAState.TIMEOUT;
          tc.rcaData = { error: `Timeout after ${timeout}ms` };
        });
        await updateProgress(context, testCases, "RCA analysis timed out");
        break;
      }

      await Promise.allSettled(
        inProgressCases.map(async (tc) => {
          try {
            const pollUrl = baseUrl.replace("{testId}", tc.id);
            const response = await fetch(pollUrl, { headers });
            if (!response.ok) {
              const errorText = await response.text();
              tc.state = RCAState.LOG_FETCH_ERROR;
              tc.rcaData = {
                error: `HTTP ${response.status}: Polling failed - ${errorText}`,
              };
              return;
            }

            const data = await response.json();
            if (!isFailedState(tc.state)) {
              const apiState = data.state?.toLowerCase();
              if (apiState === "completed") {
                tc.state = RCAState.COMPLETED;
                tc.rcaData = data;
              } else if (apiState === "failed" || apiState === "error") {
                tc.state = RCAState.UNKNOWN_ERROR;
                tc.rcaData = {
                  error: `API returned error state: ${data.state}`,
                  originalResponse: data,
                };
              } else if (apiState === "pending") tc.state = RCAState.PENDING;
              else if (apiState === "fetching_logs")
                tc.state = RCAState.FETCHING_LOGS;
              else if (apiState === "generating_rca")
                tc.state = RCAState.GENERATING_RCA;
              else if (apiState === "generated_rca")
                tc.state = RCAState.GENERATED_RCA;
              else if (apiState === "processing" || apiState === "running")
                tc.state = RCAState.GENERATING_RCA;
              else {
                tc.state = RCAState.UNKNOWN_ERROR;
                tc.rcaData = {
                  error: `API returned unknown state: ${data.state}`,
                  originalResponse: data,
                };
              }
            }
          } catch (err) {
            if (!isFailedState(tc.state)) {
              tc.state = RCAState.LLM_SERVICE_ERROR;
              tc.rcaData = {
                error:
                  err instanceof Error
                    ? err.message
                    : "Network or parsing error",
              };
            }
          }
        }),
      );

      await delay(pollInterval);
    }
  } catch (err) {
    testCases
      .filter((tc) => isInProgressState(tc.state))
      .forEach((tc) => {
        tc.state = RCAState.UNKNOWN_ERROR;
        tc.rcaData = {
          error: err instanceof Error ? err.message : "Unexpected error",
        };
      });
    await updateProgress(
      context,
      testCases,
      "RCA analysis failed due to unexpected error",
    );
  }

  return { testCases };
}

export async function getRCAData(
  testIds: string[],
  authString: string,
  context?: ScanProgressContext,
): Promise<RCAResponse> {
  const pollInterval = 5000;
  const timeout = 30000;
  const initialDelay = 20000;

  const baseUrl =
    "https://api-observability.browserstack.com/ext/v1/testRun/{testId}/testRca";
  const headers = {
    Authorization: `Basic ${Buffer.from(authString).toString("base64")}`,
    "Content-Type": "application/json",
  };

  await notifyProgress(context, "Starting RCA analysis for test cases...", 0);

  const testCases = await Promise.all(
    testIds.map((testId) => fetchInitialRCA(testId, headers, baseUrl)),
  );

  const inProgressCount = testCases.filter((tc) =>
    isInProgressState(tc.state),
  ).length;

  await notifyProgress(
    context,
    `Initial RCA requests completed. ${inProgressCount} cases pending analysis...`,
    10,
  );

  if (inProgressCount === 0) return { testCases };

  return await pollRCAResults(
    testCases,
    headers,
    baseUrl,
    context,
    pollInterval,
    timeout,
    initialDelay,
  );
}
