export enum AppSDKSupportedLanguageEnum {
  java = "java",
}
export type AppSDKSupportedLanguage = keyof typeof AppSDKSupportedLanguageEnum;

export enum AppSDKSupportedFrameworkEnum {
  appium = "appium",
}
export type AppSDKSupportedFramework =
  keyof typeof AppSDKSupportedFrameworkEnum;

export enum AppSDKSupportedTestingFrameworkEnum {
  testng = "testng",
}
export type AppSDKSupportedTestingFramework =
  keyof typeof AppSDKSupportedTestingFrameworkEnum;

export enum AppSDKSupportedPlatformEnum {
  android = "android",
  ios = "ios",
}
export type AppSDKSupportedPlatform = keyof typeof AppSDKSupportedPlatformEnum;

export type AppConfigMapping = Record<
  AppSDKSupportedLanguageEnum,
  Partial<
    Record<
      AppSDKSupportedFrameworkEnum,
      Partial<
        Record<
          AppSDKSupportedTestingFrameworkEnum,
          { instructions: (username: string, accessKey: string) => string }
        >
      >
    >
  >
>;
