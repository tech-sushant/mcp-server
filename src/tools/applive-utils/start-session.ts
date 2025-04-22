import childProcess from "child_process";
import logger from "../../logger";

export async function startSession(args: {
  appUrl: string;
  desiredPlatform: "android" | "ios";
  desiredPhone: string;
  desiredPlatformVersion: string;
}): Promise<string> {
  const { appUrl, desiredPlatform, desiredPhone, desiredPlatformVersion } =
    args;
  const appHashedId = appUrl.split("bs://").pop();
  // replace all spaces with +
  const desiredPhoneWithSpaces = desiredPhone.replace(/\s+/g, "+");

  const launchUrl = `"https://app-live.browserstack.com/dashboard#os=${encodeURIComponent(desiredPlatform)}&os_version=${encodeURIComponent(desiredPlatformVersion)}&device=${desiredPhoneWithSpaces}&app_hashed_id=${appHashedId}&scale_to_fit=true&speed=1&start=true"`;

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
