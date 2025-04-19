export type SDKSupportedLanguage = "nodejs" | "python";
export type SDKSupportedBrowserAutomationFramework = "playwright" | "selenium";
export type SDKSupportedTestingFramework =
  | "jest"
  | "codeceptjs"
  | "playwright"
  | "pytest"
  | "robot"
  | "behave"
  | "cucumber"
  | "nightwatch"
  | "webdriverio"
  | "mocha";

export type ConfigMapping = Record<
  SDKSupportedLanguage,
  Record<
    SDKSupportedBrowserAutomationFramework,
    Partial<Record<SDKSupportedTestingFramework, { instructions: string }>>
  >
>;
