export enum SDKSupportedLanguageEnum {
  nodejs = "nodejs",
  python = "python",
  java = "java",
  csharp = "csharp",
}
export type SDKSupportedLanguage = keyof typeof SDKSupportedLanguageEnum;

export enum SDKSupportedBrowserAutomationFrameworkEnum {
  playwright = "playwright",
  selenium = "selenium",
  cypress = "cypress",
  webdriverio = "webdriverio",
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
  junit4 = "junit4",
  junit5 = "junit5",
  testng = "testng",
  serenity = "serenity",
  cypress = "cypress",
  nunit = "nunit",
  mstest = "mstest",
  xunit = "xunit",
  specflow = "specflow",
  reqnroll = "reqnroll",
}
export type SDKSupportedTestingFramework =
  keyof typeof SDKSupportedTestingFrameworkEnum;

export type ConfigMapping = Record<
  SDKSupportedLanguageEnum,
  Partial<
    Record<
      SDKSupportedBrowserAutomationFrameworkEnum,
      Partial<
        Record<
          SDKSupportedTestingFrameworkEnum,
          { instructions: (username: string, accessKey: string) => string }
        >
      >
    >
  >
>;
