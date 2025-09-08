import { TestStatus, FailedTestInfo, TestRun, TestDetails } from "./types.js";

export async function getTestIds(
  buildId: string,
  authString: string,
  status?: TestStatus,
): Promise<FailedTestInfo[]> {
  const baseUrl = `https://api-automation.browserstack.com/ext/v1/builds/${buildId}/testRuns`;
  let url = status ? `${baseUrl}?test_statuses=${status}` : baseUrl;
  let allFailedTests: FailedTestInfo[] = [];
  let requestNumber = 0;

  // Construct Basic auth header
  const encodedCredentials = Buffer.from(authString).toString("base64");
  const authHeader = `Basic ${encodedCredentials}`;

  try {
    while (true) {
      requestNumber++;

      const response = await fetch(url, {
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
        const currentFailedTests = extractFailedTestIds(data.hierarchy);
        allFailedTests = allFailedTests.concat(currentFailedTests);
      }

      // Check for pagination termination conditions
      if (!data.pagination?.has_next || !data.pagination.next_page) {
        break;
      }

      // Safety limit to prevent runaway requests
      if (requestNumber >= 5) {
        break;
      }

      // Prepare next request
      url = `${baseUrl}?next_page=${encodeURIComponent(data.pagination.next_page)}`;
    }

    // Return unique failed test IDs
    return allFailedTests;
  } catch (error) {
    console.error("Error fetching failed tests:", error);
    throw error;
  }
}

// Recursive function to extract failed test IDs from hierarchy
function extractFailedTestIds(hierarchy: TestDetails[]): FailedTestInfo[] {
  let failedTests: FailedTestInfo[] = [];

  for (const node of hierarchy) {
    if (node.details?.status === "failed" && node.details?.run_count) {
      if (node.details?.observability_url) {
        const idMatch = node.details.observability_url.match(/details=(\d+)/);
        if (idMatch) {
          failedTests.push({
            test_id: idMatch[1],
            test_name: node.display_name || `Test ${idMatch[1]}`,
          });
        }
      }
    }

    if (node.children && node.children.length > 0) {
      failedTests = failedTests.concat(extractFailedTestIds(node.children));
    }
  }

  return failedTests;
}
