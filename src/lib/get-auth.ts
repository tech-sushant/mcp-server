export function getBrowserStackAuth(server: {
  authHeaders?: Record<string, string>;
}) {
  const username = server.authHeaders?.["browserstack-username"];
  const accessKey = server.authHeaders?.["browserstack-access-key"];
  if (!username || !accessKey) {
    throw new Error("BrowserStack credentials not set on server.authHeaders");
  }
  return `${username}:${accessKey}`;
}
