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

// Framework mapping for Java Maven archetype generation for App Automate
export const JAVA_APP_FRAMEWORK_MAP: Record<string, string> = {
  testng: "browserstack-sdk-archetype-integrate",
  junit5: "browserstack-sdk-archetype-integrate",
  selenide: "selenide-archetype-integrate",
  jbehave: "browserstack-sdk-archetype-integrate",
  cucumberTestng: "browserstack-sdk-archetype-integrate",
  cucumberJunit4: "browserstack-sdk-archetype-integrate",
  cucumberJunit5: "browserstack-sdk-archetype-integrate",
};

// Common Gradle setup instructions for App Automate (platform-independent)
export const GRADLE_APP_SETUP_INSTRUCTIONS = `
**For Gradle setup:**
1. Add browserstack-java-sdk to dependencies:
   compileOnly 'com.browserstack:browserstack-java-sdk:latest.release'

2. Add browserstackSDK path variable:
   def browserstackSDKArtifact = configurations.compileClasspath.resolvedConfiguration.resolvedArtifacts.find { it.name == 'browserstack-java-sdk' }

3. Add javaagent to gradle tasks:
   jvmArgs "-javaagent:\${browserstackSDKArtifact.file}"
`;

// Step delimiter for parsing instructions
export const STEP_DELIMITER = "---STEP---";

// Default app path for examples
export const DEFAULT_APP_PATH = "bs://sample.app";

// Platform detection utilities
export const PLATFORM_UTILS = {
  isWindows: process.platform === "win32",
  isMac: process.platform === "darwin",
  isAppleSilicon: process.platform === "darwin" && process.arch === "arm64",
  getPlatformLabel(): string {
    if (this.isWindows) return "Windows";
    if (this.isMac)
      return this.isAppleSilicon ? "macOS Apple silicon" : "macOS Intel";
    return "Linux";
  },
} as const;

// Tool description and schema for setupBrowserStackAppAutomateTests
export const SETUP_APP_BSTACK_DESCRIPTION =
  "Set up and run automated mobile app tests on BrowserStack using the BrowserStack App Automate SDK. Use for mobile app functional or integration tests on real Android and iOS devices. Example prompts: run this mobile app test on browserstack; set up this project for browserstack app automate; test my app on android devices. Integrate BrowserStack App Automate SDK into your project";

import { z } from "zod";
import {
  AppSDKSupportedFrameworkEnum,
  AppSDKSupportedTestingFrameworkEnum,
  AppSDKSupportedLanguageEnum,
  AppSDKSupportedPlatformEnum,
} from "../index.js";

export const SetupAppBstackParamsShape = {
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
      "Path to the mobile app file (.apk for Android, .ipa for iOS). Can be a local file path or a BrowserStack app URL (bs://). This parameter is required.",
    ),
};
