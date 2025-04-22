import { sanitizeUrlParam } from "../../lib/utils";
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
  // Sanitize all input parameters
  const sanitizedArgs = {
    browser: sanitizeUrlParam(args.browser),
    os: sanitizeUrlParam(args.os),
    osVersion: sanitizeUrlParam(args.osVersion),
    url: sanitizeUrlParam(args.url),
    browserVersion: sanitizeUrlParam(args.browserVersion),
    isLocal: args.isLocal,
  };

  // Construct URL with encoded parameters
  const params = new URLSearchParams({
    os: sanitizedArgs.os,
    os_version: sanitizedArgs.osVersion,
    browser: sanitizedArgs.browser,
    browser_version: sanitizedArgs.browserVersion,
    scale_to_fit: "true",
    url: sanitizedArgs.url,
    resolution: "responsive-mode",
    speed: "1",
    local: sanitizedArgs.isLocal ? "true" : "false",
    start: "true",
  });

  const launchUrl = `https://live.browserstack.com/dashboard#${params.toString()}`;

  try {
    // Use platform-specific commands with proper escaping
    const command =
      process.platform === "darwin"
        ? ["open", launchUrl]
        : process.platform === "win32"
          ? ["cmd", "/c", "start", launchUrl]
          : ["xdg-open", launchUrl];

    // nosemgrep:javascript.lang.security.detect-child-process.detect-child-process
    const child = childProcess.spawn(command[0], command.slice(1), {
      stdio: "ignore",
      detached: true,
    });

    // Handle process errors
    child.on("error", (error) => {
      logger.error(
        `Failed to open browser automatically: ${error}. Please open this URL manually: ${launchUrl}`,
      );
    });

    // Unref the child process to allow the parent to exit
    child.unref();

    return launchUrl;
  } catch (error) {
    logger.error(
      `Failed to open browser automatically: ${error}. Please open this URL manually: ${launchUrl}`,
    );
    return launchUrl;
  }
}
