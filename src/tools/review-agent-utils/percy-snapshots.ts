// Utility for fetching Percy snapshot IDs for a given build (up to `maxSnapshots`).
export async function getPercySnapshotIds(
  buildId: string,
  percyToken: string,
  maxSnapshots = 300,
): Promise<string[]> {
  const perPage = 30;
  const allSnapshotIds: string[] = [];
  let cursor: string | undefined = undefined;

  while (allSnapshotIds.length < maxSnapshots) {
    const url = new URL(`https://percy.io/api/v1/snapshots`);
    url.searchParams.set("build_id", buildId);
    url.searchParams.set("page[limit]", String(perPage));
    if (cursor) url.searchParams.set("page[cursor]", cursor);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Token token=${percyToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Percy snapshots: ${response.statusText}`,
      );
    }

    const data = await response.json();
    const snapshots = data.data ?? [];
    if (snapshots.length === 0) break; // no more snapshots

    allSnapshotIds.push(...snapshots.map((s: any) => String(s.id)));

    // Set cursor to last snapshot ID of this page for next iteration
    cursor = snapshots[snapshots.length - 1].id;

    // Stop if we've collected enough
    if (allSnapshotIds.length >= maxSnapshots) break;
  }

  // Return only up to maxSnapshots
  return allSnapshotIds.slice(0, maxSnapshots);
}
