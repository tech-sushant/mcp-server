import { TestStatus, FailedTestInfo, TestRun, TestDetails } from "./types.js";

let hasNext = false;
let nextPageUrl: string | null = null;

export async function getTestIds(
  buildId: string,
  authString: string,
  status?: TestStatus,
): Promise<FailedTestInfo[]> {
  const baseUrl = `https://api-automation.browserstack.com/ext/v1/builds/${buildId}/testRuns`;

  // Build initial URL
  const initialUrl = new URL(baseUrl);
  if (status) initialUrl.searchParams.set("test_statuses", status);

  // Use stored nextPageUrl if available, otherwise fresh URL
  const requestUrl =
    hasNext && nextPageUrl ? nextPageUrl : initialUrl.toString();
  let allFailedTests: FailedTestInfo[] = [];

  // Construct Basic auth header
  const encodedCredentials = Buffer.from(authString).toString("base64");
  const authHeader = `Basic ${encodedCredentials}`;

  try {
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch test runs: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as TestRun;

    // Extract failed IDs from current page
    if (data.hierarchy && data.hierarchy.length > 0) {
      allFailedTests = extractFailedTestIds(data.hierarchy);
    }

    // Update pagination state in memory
    hasNext = data.pagination?.has_next || false;
    nextPageUrl =
      hasNext && data.pagination?.next_page
        ? buildNextPageUrl(baseUrl, status, data.pagination.next_page)
        : null;

    // Return failed test IDs from current page only
    return allFailedTests;
  } catch (error) {
    console.error("Error fetching failed tests:", error);
    throw error;
  }
}

// Helper to build next page URL safely
function buildNextPageUrl(
  baseUrl: string,
  status: TestStatus | undefined,
  nextPage: string,
): string {
  const url = new URL(baseUrl);
  if (status) url.searchParams.set("test_statuses", status);
  url.searchParams.set("next_page", nextPage);
  return url.toString();
}

// Recursive function to extract failed test IDs from hierarchy
function extractFailedTestIds(hierarchy: TestDetails[]): FailedTestInfo[] {
  let failedTests: FailedTestInfo[] = [];

  for (const node of hierarchy) {
    if (node.details?.status === "failed" && node.details?.run_count) {
      if (node.details?.observability_url) {
        const idMatch = node.details.observability_url.match(/details=(\d+)/);
        if (idMatch) {
          failedTests.push({ id: idMatch[1] });
        }
      }
    }

    if (node.children && node.children.length > 0) {
      failedTests = failedTests.concat(extractFailedTestIds(node.children));
    }
  }

  return failedTests;
}
