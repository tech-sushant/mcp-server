import { z } from "zod";
import { PercyIntegrationTypeEnum } from "./types.js";
import {
  SDKSupportedBrowserAutomationFrameworkEnum,
  SDKSupportedTestingFrameworkEnum,
  SDKSupportedLanguageEnum,
} from "./types.js";

// Platform enums for better validation
export const PlatformEnum = {
  WINDOWS: "windows",
  MACOS: "macos",
  ANDROID: "android",
  IOS: "ios",
} as const; 

export const WindowsPlatformEnum = {
  WINDOWS: "windows",
} as const;

export const MacOSPlatformEnum = {
  MAC: "mac",
  MACOS: "macos",
} as const;

export const SetUpPercyParamsShape = {
  projectName: z.string().describe("A unique name for your Percy project."),
  detectedLanguage: z.nativeEnum(SDKSupportedLanguageEnum),
  detectedBrowserAutomationFramework: z.nativeEnum(
    SDKSupportedBrowserAutomationFrameworkEnum,
  ),
  detectedTestingFramework: z.nativeEnum(SDKSupportedTestingFrameworkEnum),
  integrationType: z
    .nativeEnum(PercyIntegrationTypeEnum)
    .describe(
      "Specify the Percy integration type: web (Percy Web) or automate (Percy Automate). If not provided, always prompt the user with: 'Please specify the Percy integration type.' Do not proceed without an explicit selection. Never use a default.",
    ),
  folderPaths: z
    .array(z.string())
    .describe(
      "An array of absolute folder paths containing UI test files. If not provided, analyze codebase for UI test folders by scanning for test patterns which contain UI test cases as per framework. Return empty array if none found.",
    ),
};

export const RunTestsOnBrowserStackParamsShape = {
  projectName: z
    .string()
    .describe("A single name for your project to organize all your tests."),
  detectedLanguage: z.nativeEnum(SDKSupportedLanguageEnum),
  detectedBrowserAutomationFramework: z.nativeEnum(
    SDKSupportedBrowserAutomationFrameworkEnum,
  ),
  detectedTestingFramework: z.nativeEnum(SDKSupportedTestingFrameworkEnum),
  devices: z
    .array(
      z.union([
        // Windows: [windows, osVersion, browser, browserVersion]
        z.tuple([
          z
            .nativeEnum(WindowsPlatformEnum)
            .describe("Platform identifier: 'windows'"),
          z.string().describe("Windows version, e.g. '10', '11'"),
          z.string().describe("Browser name, e.g. 'chrome', 'firefox', 'edge'"),
          z
            .string()
            .describe("Browser version, e.g. '132', 'latest', 'oldest'"),
        ]),
        // Android: [android, name, model, osVersion, browser]
        z.tuple([
          z
            .literal(PlatformEnum.ANDROID)
            .describe("Platform identifier: 'android'"),
          z
            .string()
            .describe(
              "Device name, e.g. 'Samsung Galaxy S24', 'Google Pixel 8'",
            ),
          z.string().describe("Android version, e.g. '14', '16', 'latest'"),
          z.string().describe("Browser name, e.g. 'chrome', 'samsung browser'"),
        ]),
        // iOS: [ios, name, model, osVersion, browser]
        z.tuple([
          z.literal(PlatformEnum.IOS).describe("Platform identifier: 'ios'"),
          z.string().describe("Device name, e.g. 'iPhone 12 Pro'"),
          z.string().describe("iOS version, e.g. '17', 'latest'"),
          z.string().describe("Browser name, typically 'safari'"),
        ]),
        // macOS: [mac|macos, name, model, browser, browserVersion]
        z.tuple([
          z
            .nativeEnum(MacOSPlatformEnum)
            .describe("Platform identifier: 'mac' or 'macos'"),
          z.string().describe("macOS version name, e.g. 'Sequoia', 'Ventura'"),
          z.string().describe("Browser name, e.g. 'safari', 'chrome'"),
          z.string().describe("Browser version, e.g. 'latest'"),
        ]),
      ]),
    )
    .max(3)
    .default([])
    .describe(
      "Preferred input: 1-3 tuples describing target devices.Example: [['windows', '11', 'chrome', 'latest'], ['android', 'Samsung Galaxy S24', '14', 'chrome'], ['ios', 'iPhone 15', '17', 'safari']]",
    ),
};

export const SetUpPercySchema = z.object(SetUpPercyParamsShape);

export const RunTestsOnBrowserStackSchema = z.object(
  RunTestsOnBrowserStackParamsShape,
);

export type SetUpPercyInput = z.infer<typeof SetUpPercySchema>;
export type RunTestsOnBrowserStackInput = z.infer<
  typeof RunTestsOnBrowserStackSchema
>;

export const RunPercyScanParamsShape = {
  projectName: z.string().describe("The name of the project to run Percy on."),
  percyRunCommand: z
    .string()
    .optional()
    .describe(
      "The test command to run with Percy. Optional — the LLM should try to infer it first from project context.",
    ),
  integrationType: z
    .nativeEnum(PercyIntegrationTypeEnum)
    .describe(
      "Specifies whether to integrate with Percy Web or Percy Automate. If not explicitly provided, prompt the user to select the desired integration type.",
    ),
};

export const FetchPercyChangesParamsShape = {
  project_name: z
    .string()
    .describe(
      "The name of the BrowserStack project. If not found, ask user directly.",
    ),
};

export const ManagePercyBuildApprovalParamsShape = {
  buildId: z
    .string()
    .describe("The ID of the Percy build to approve or reject."),
  action: z
    .enum(["approve", "unapprove", "reject"])
    .describe("The action to perform on the Percy build."),
};
