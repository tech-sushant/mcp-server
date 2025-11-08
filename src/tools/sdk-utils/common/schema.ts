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
    .optional()
    .describe(
      "An array of absolute folder paths containing UI test files. If not provided, analyze codebase for UI test folders by scanning for test patterns which contain UI test cases as per framework. Return empty array if none found.",
    ),
  filePaths: z
    .array(z.string())
    .optional()
    .describe(
      "An array of absolute file paths to specific UI test files. Use this when you want to target specific test files rather than entire folders. If not provided, will use folderPaths instead.",
    ),
};

// Shared mobile device schema for App Automate (no browser field)
export const MobileDeviceSchema = z.discriminatedUnion("platform", [
  z.object({
    platform: z.literal("android"),
    deviceName: z.string().describe("Device name, e.g. 'Samsung Galaxy S24', 'Google Pixel 8'"),
    osVersion: z.string().describe("Android version, e.g. '14', '16', 'latest'"),
  }),
  z.object({
    platform: z.literal("ios"),
    deviceName: z.string().describe("Device name, e.g. 'iPhone 15', 'iPhone 14 Pro'"),
    osVersion: z.string().describe("iOS version, e.g. '17', '16', 'latest'"),
  }),
]);

const DeviceSchema = z.discriminatedUnion("platform", [
  z.object({
    platform: z.literal("windows"),
    osVersion: z.string().describe("Windows version, e.g. '10', '11'"),
    browser: z.string().describe("Browser name, e.g. 'chrome', 'firefox', 'edge'"),
    browserVersion: z.string().describe("Browser version, e.g. '132', 'latest', 'oldest'"),
  }),
  z.object({
    platform: z.literal("android"),
    deviceName: z.string().describe("Device name, e.g. 'Samsung Galaxy S24'"),
    osVersion: z.string().describe("Android version, e.g. '14', '16', 'latest'"),
    browser: z.string().describe("Browser name, e.g. 'chrome', 'samsung browser'"),
  }),
  z.object({
    platform: z.literal("ios"),
    deviceName: z.string().describe("Device name, e.g. 'iPhone 12 Pro'"),
    osVersion: z.string().describe("iOS version, e.g. '17', 'latest'"),
    browser: z.string().describe("Browser name, typically 'safari'"),
  }),
  z.object({
    platform: z.enum(["mac", "macos"]),
    osVersion: z.string().describe("macOS version name, e.g. 'Sequoia', 'Ventura'"),
    browser: z.string().describe("Browser name, e.g. 'safari', 'chrome'"),
    browserVersion: z.string().describe("Browser version, e.g. 'latest'"),
  }),
]);

export const RunTestsOnBrowserStackParamsShape = {
  projectName: z
    .string()
    .describe("A single name for your project to organize all your tests."),
  detectedLanguage: z.nativeEnum(SDKSupportedLanguageEnum),
  detectedBrowserAutomationFramework: z.nativeEnum(SDKSupportedBrowserAutomationFrameworkEnum),
  detectedTestingFramework: z.nativeEnum(SDKSupportedTestingFrameworkEnum),
  devices: z
    .array(DeviceSchema)
    .max(3)
    .default([])
    .describe(
      "Device objects array. Use the object format directly - no transformation needed. Add only when user explicitly requests devices. Examples: [{ platform: 'windows', osVersion: '11', browser: 'chrome', browserVersion: 'latest' }] or [{ platform: 'android', deviceName: 'Samsung Galaxy S24', osVersion: '14', browser: 'chrome' }].",
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
