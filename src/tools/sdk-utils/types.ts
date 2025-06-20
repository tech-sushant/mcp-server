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
  | "nunit"
  | "mstest";


export enum SDKSupportedLanguageEnum {
  nodejs = "nodejs",
  python = "python",
  java = "java",
}
export type SDKSupportedLanguage = keyof typeof SDKSupportedLanguageEnum;

export enum SDKSupportedBrowserAutomationFrameworkEnum {
  playwright = "playwright",
  selenium = "selenium",
  cypress = "cypress",
}
export type SDKSupportedBrowserAutomationFramework =
  keyof typeof SDKSupportedBrowserAutomationFrameworkEnum;

export enum SDKSupportedTestingFrameworkEnum {
  jest = "jest",
  codeceptjs = "codeceptjs",
  playwright = "playwright",
  pytest = "pytest",
  robot = "robot",
  behave = "behave",
  cucumber = "cucumber",
  nightwatch = "nightwatch",
  webdriverio = "webdriverio",
  mocha = "mocha",
  junit = "junit",
  testng = "testng",
  cypress = "cypress",
}
export type SDKSupportedTestingFramework =
  keyof typeof SDKSupportedTestingFrameworkEnum;

export type ConfigMapping = Record<
  SDKSupportedLanguageEnum,
  Record<
    SDKSupportedBrowserAutomationFrameworkEnum,
    Partial<Record<SDKSupportedTestingFrameworkEnum, { instructions: string }>>
  >
>;
