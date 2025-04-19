export type LiveSupportedPlatform = "android" | "ios" | "windows" | "macos";
export type LiveSupportedBrowser =
  | "chrome"
  | "firefox"
  | "edge"
  | "internet-explorer"
  | "safari"
  | "samsung browser";

export type LiveConfigMapping = Record<
  LiveSupportedPlatform,
  Partial<
    Record<
      LiveSupportedBrowser,
      {
        version: string;
      }
    >
  >
>;
