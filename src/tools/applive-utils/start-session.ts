import childProcess from "child_process";
import logger from "../../logger";
import { sanitizeUrlParam } from "../../lib/utils";

interface StartSessionArgs {
  appUrl: string;
  desiredPlatform: "android" | "ios";
  desiredPhone: string;
  desiredPlatformVersion: string;
}

export async function startSession(args: StartSessionArgs): Promise<string> {
  // Sanitize all input parameters
  const sanitizedArgs = {
    appUrl: sanitizeUrlParam(args.appUrl),
    desiredPlatform: sanitizeUrlParam(args.desiredPlatform),
    desiredPhone: sanitizeUrlParam(args.desiredPhone),
    desiredPlatformVersion: sanitizeUrlParam(args.desiredPlatformVersion),
  };

  // Get app hash ID and format phone name
  const appHashedId = sanitizedArgs.appUrl.split("bs://").pop();
  const desiredPhoneWithSpaces = sanitizedArgs.desiredPhone.replace(
    /\s+/g,
    "+",
  );

  // Construct URL with encoded parameters
  const params = new URLSearchParams({
    os: sanitizedArgs.desiredPlatform,
    os_version: sanitizedArgs.desiredPlatformVersion,
    app_hashed_id: appHashedId || "",
    scale_to_fit: "true",
    speed: "1",
    start: "true",
  });

  const launchUrl = `https://app-live.browserstack.com/dashboard#${params.toString()}&device=${desiredPhoneWithSpaces}`;

  try {
    // Use platform-specific commands with proper escaping
    const command =
      process.platform === "darwin"
        ? ["open", launchUrl]
        : process.platform === "win32"
          ? ["cmd", "/c", "start", launchUrl]
          : ["xdg-open", launchUrl];

    // Use spawn instead of exec to prevent shell injection
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
