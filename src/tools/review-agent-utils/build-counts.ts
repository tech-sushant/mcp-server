// Utility for fetching the count of Percy builds.
export async function getPercyBuildCount(percyToken: string) {
  const apiUrl = `https://percy.io/api/v1/builds`;

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

  let isFirstBuild = false;
  let lastBuildId;

  if (builds.length === 0) {
    return { noBuilds: true, isFirstBuild: false, lastBuildId: undefined };
  } else if (builds.length === 1) {
    isFirstBuild = true;
    lastBuildId = builds[0].id;
  } else {
    isFirstBuild = false;
    lastBuildId = builds[0].id;
  }

  return { noBuilds: false, isFirstBuild, lastBuildId };
}
