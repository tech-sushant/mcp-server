export type SDKSupportedLanguage = "nodejs" | "python" | "java" | "csharp";
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
  | "mocha"
  | "junit4"
  | "junit5"
  | "testng"
  | "xunit"
  | "nunit";

export type ConfigMapping = Record<
  SDKSupportedLanguage,
  Record<
    SDKSupportedBrowserAutomationFramework,
    Partial<Record<SDKSupportedTestingFramework, { instructions: string }>>
  >
>;
