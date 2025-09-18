import { z } from "zod";
import {
  AppSDKSupportedFrameworkEnum,
  AppSDKSupportedTestingFrameworkEnum,
  AppSDKSupportedLanguageEnum,
  AppSDKSupportedPlatformEnum,
} from "./index.js";

// App Automate specific device configurations
export const APP_DEVICE_CONFIGS = {
  android: [
    { deviceName: "Samsung Galaxy S22 Ultra", platformVersion: "12.0" },
    { deviceName: "Google Pixel 7 Pro", platformVersion: "13.0" },
    { deviceName: "OnePlus 9", platformVersion: "11.0" },
  ],
  ios: [
    { deviceName: "iPhone 14", platformVersion: "16" },
    { deviceName: "iPhone 13", platformVersion: "15" },
    { deviceName: "iPad Air 4", platformVersion: "14" },
  ],
};

// Step delimiter for parsing instructions
export const STEP_DELIMITER = "---STEP---";

// Default app path for examples
export const DEFAULT_APP_PATH = "bs://sample.app";

// Tool description and schema for setupBrowserStackAppAutomateTests
export const SETUP_APP_AUTOMATE_DESCRIPTION =
  "Set up BrowserStack App Automate SDK integration for Appium-based mobile app testing. ONLY for Appium based framework . This tool configures SDK for various languages with appium. For pre-built Espresso or XCUITest test suites, use 'runAppTestsOnBrowserStack' instead.";

export const SETUP_APP_AUTOMATE_SCHEMA = {
  detectedFramework: z
    .nativeEnum(AppSDKSupportedFrameworkEnum)
    .describe(
      "The mobile automation framework configured in the project. Example: 'appium'",
    ),

  detectedTestingFramework: z
    .nativeEnum(AppSDKSupportedTestingFrameworkEnum)
    .describe(
      "The testing framework used in the project. Be precise with framework selection Example: 'testng', 'behave', 'pytest', 'robot'",
    ),

  detectedLanguage: z
    .nativeEnum(AppSDKSupportedLanguageEnum)
    .describe(
      "The programming language used in the project. Supports Java and C#. Example: 'java', 'csharp'",
    ),

  devices: z
    .array(
      z.union([
        // Android: [android, deviceName, osVersion]
        z.tuple([
          z
            .literal(AppSDKSupportedPlatformEnum.android)
            .describe("Platform identifier: 'android'"),
          z
            .string()
            .describe(
              "Device name, e.g. 'Samsung Galaxy S24', 'Google Pixel 8'",
            ),
          z.string().describe("Android version, e.g. '14', '16', 'latest'"),
        ]),
        // iOS: [ios, deviceName, osVersion]
        z.tuple([
          z
            .literal(AppSDKSupportedPlatformEnum.ios)
            .describe("Platform identifier: 'ios'"),
          z.string().describe("Device name, e.g. 'iPhone 15', 'iPhone 14 Pro'"),
          z.string().describe("iOS version, e.g. '17', '16', 'latest'"),
        ]),
      ]),
    )
    .max(3)
    .default([[AppSDKSupportedPlatformEnum.android, 'Samsung Galaxy S24', 'latest']])
    .describe(
      "Preferred input: 1-3 tuples describing target mobile devices. Example: [['android', 'Samsung Galaxy S24', '14'], ['ios', 'iPhone 15', '17']]",
    ),

  appPath: z
    .string()
    .describe(
      "Path to the mobile app file (.apk for Android, .ipa for iOS). Can be a local file path or a BrowserStack app URL (bs://)",
    ),
  project: z
    .string()
    .optional()
    .default("BStack-AppAutomate-Suite")
    .describe("Project name for organizing test runs on BrowserStack."),
};

// Legacy schema for backward compatibility
export const SETUP_APP_AUTOMATE_SCHEMA_LEGACY = {
  detectedFramework: z
    .nativeEnum(AppSDKSupportedFrameworkEnum)
    .describe(
      "The mobile automation framework configured in the project. Example: 'appium'",
    ),

  detectedTestingFramework: z
    .nativeEnum(AppSDKSupportedTestingFrameworkEnum)
    .describe(
      "The testing framework used in the project. Be precise with framework selection Example: 'testng', 'behave', 'pytest', 'robot'",
    ),

  detectedLanguage: z
    .nativeEnum(AppSDKSupportedLanguageEnum)
    .describe(
      "The programming language used in the project. Supports Java and C#. Example: 'java', 'csharp'",
    ),

  desiredPlatforms: z
    .array(z.nativeEnum(AppSDKSupportedPlatformEnum))
    .describe(
      "The mobile platforms the user wants to test on. Always ask this to the user, do not try to infer this. Example: ['android', 'ios']",
    ),

  appPath: z
    .string()
    .describe(
      "Path to the mobile app file (.apk for Android, .ipa for iOS). Can be a local file path or a BrowserStack app URL (bs://)",
    ),
  project: z
    .string()
    .optional()
    .default("BStack-AppAutomate-Suite")
    .describe("Project name for organizing test runs on BrowserStack."),
};
