import logger from "../../logger";
import childProcess from "child_process";

interface StartSessionArgs {
  browser: string;
  os: string;
  osVersion: string;
  url: string;
  browserVersion: string;
  isLocal: boolean;
}

export async function startBrowserSession(
  args: StartSessionArgs,
): Promise<string> {
  const launchUrl = `"https://live.browserstack.com/dashboard#os=${encodeURIComponent(args.os)}&os_version=${encodeURIComponent(args.osVersion)}&browser=${encodeURIComponent(args.browser)}&browser_version=${encodeURIComponent(args.browserVersion)}&scale_to_fit=true&url=${encodeURIComponent(args.url)}&resolution=responsive-mode&speed=1&local=${args.isLocal ? "true" : "false"}&start=true"`;

  try {
    const start =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
          ? "start"
          : "xdg-open";
    childProcess.exec(start + " " + launchUrl);

    return launchUrl;
  } catch (error) {
    logger.error(
      `Failed to open browser automatically: ${error}. Please open this URL manually: ${launchUrl}`,
    );
    return launchUrl;
  }
}
