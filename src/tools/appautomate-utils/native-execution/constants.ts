import { z } from "zod";
import { AppTestPlatform } from "./types.js";
import { MobileDeviceSchema } from "../../sdk-utils/common/schema.js";

export const RUN_APP_AUTOMATE_DESCRIPTION = `Execute pre-built native mobile test suites (Espresso for Android, XCUITest for iOS) by direct upload to BrowserStack. ONLY for compiled .apk/.ipa test files. This is NOT for SDK integration or Appium tests. For Appium-based testing with SDK setup, use 'setupBrowserStackAppAutomateTests' instead.`;

export const RUN_APP_AUTOMATE_SCHEMA = {
  appPath: z
    .string()
    .describe(
      "Path to your application file:\n" +
        "If in development IDE directory:\n" +
        "• For Android: 'gradle assembleDebug'\n" +
        "• For iOS:\n" +
        "  xcodebuild clean -scheme YOUR_SCHEME && \\\n" +
        "  xcodebuild archive -scheme YOUR_SCHEME -configuration Release -archivePath build/app.xcarchive && \\\n" +
        "  xcodebuild -exportArchive -archivePath build/app.xcarchive -exportPath build/ipa -exportOptionsPlist exportOptions.plist\n\n" +
        "If in other directory, provide existing app path",
    ),
  testSuitePath: z
    .string()
    .describe(
      "Path to your test suite file:\n" +
        "If in development IDE directory:\n" +
        "• For Android: 'gradle assembleAndroidTest'\n" +
        "• For iOS:\n" +
        "  xcodebuild test-without-building -scheme YOUR_SCHEME -destination 'generic/platform=iOS' && \\\n" +
        "  cd ~/Library/Developer/Xcode/DerivedData/*/Build/Products/Debug-iphonesimulator/ && \\\n" +
        "  zip -r Tests.zip *.xctestrun *-Runner.app\n\n" +
        "If in other directory, provide existing test file path",
    ),
  devices: z
    .array(MobileDeviceSchema)
    .max(3)
    .default([])
    .describe(
      "Mobile device objects array. Use the object format directly - no transformation needed. Add only when user explicitly requests devices. Examples: [{ platform: 'android', deviceName: 'Samsung Galaxy S24', osVersion: '14' }] or [{ platform: 'ios', deviceName: 'iPhone 15', osVersion: '17' }].",
    ),
  project: z
    .string()
    .optional()
    .default("BStack-AppAutomate-Suite")
    .describe("Project name for organizing test runs on BrowserStack."),
  detectedAutomationFramework: z
    .nativeEnum(AppTestPlatform)
    .describe(
      "The automation framework used in the project, such as 'espresso' (Android) or 'xcuitest' (iOS).",
    ),
};
