import { z } from "zod";
import {
  SDKSupportedBrowserAutomationFrameworkEnum,
  SDKSupportedTestingFrameworkEnum,
  SDKSupportedLanguageEnum,
} from "./types.js";

export const SetUpPercyParamsShape = {
  projectName: z.string().describe("A unique name for your Percy project."),
  detectedLanguage: z.nativeEnum(SDKSupportedLanguageEnum),
  detectedBrowserAutomationFramework: z.nativeEnum(
    SDKSupportedBrowserAutomationFrameworkEnum,
  ),
  detectedTestingFramework: z.nativeEnum(SDKSupportedTestingFrameworkEnum),
  integrationType: z
    .enum(["web", "automate"])
    .describe("Type of Percy integration: 'web' for Percy Web testing, 'automate' for Percy Automate with BrowserStack"),
};

export const RunTestsOnBrowserStackParamsShape = {
  projectName: z
    .string()
    .describe(
      "A single name for your project to organize all your tests.",
    ),
  detectedLanguage: z.nativeEnum(SDKSupportedLanguageEnum),
  detectedBrowserAutomationFramework: z.nativeEnum(
    SDKSupportedBrowserAutomationFrameworkEnum,
  ),
  detectedTestingFramework: z.nativeEnum(SDKSupportedTestingFrameworkEnum),
  desiredPlatforms: z
    .array(z.enum(["windows", "macos", "android", "ios"]))
    .describe("An array of platforms to run tests on."),
};

export const SetUpPercySchema = z.object(SetUpPercyParamsShape);
export const RunTestsOnBrowserStackSchema = z.object(
  RunTestsOnBrowserStackParamsShape,
);

export type SetUpPercyInput = z.infer<typeof SetUpPercySchema>;
export type RunTestsOnBrowserStackInput = z.infer<
  typeof RunTestsOnBrowserStackSchema
>;
