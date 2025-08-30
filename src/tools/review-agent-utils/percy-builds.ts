/**
 * Utility for fetching Percy build information.
 */

export interface PercyBuildInfo {
  noBuilds: boolean;
  isFirstBuild: boolean;
  lastBuildId?: string;
}

/**
 * Fetches Percy build information for a given token.
 * @param percyToken - The Percy API token.
 * @returns PercyBuildInfo object.
 */
export async function getPercyBuildInfo(
  percyToken: string,
): Promise<PercyBuildInfo> {
  const apiUrl = "https://percy.io/api/v1/builds";

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Token token=${percyToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Percy builds: ${response.statusText}`);
  }

  const data = await response.json();
  const builds = data.data ?? [];

  if (builds.length === 0) {
    return { noBuilds: true, isFirstBuild: false, lastBuildId: undefined };
  }

  const isFirstBuild = builds.length === 1;
  const lastBuildId = builds[0].id;

  return { noBuilds: false, isFirstBuild, lastBuildId };
}
