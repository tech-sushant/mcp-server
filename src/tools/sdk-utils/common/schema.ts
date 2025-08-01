import { z } from "zod";
import {
  SDKSupportedBrowserAutomationFrameworkEnum,
  SDKSupportedTestingFrameworkEnum,
  SDKSupportedLanguageEnum,
} from "./types.js";
import { PercyIntegrationTypeEnum } from "./types.js";

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
      "Set to 'automate' if the user says 'run Percy automate' or if the codebase contains BrowserStack Automate SDK or any related yml file. In all other cases, set to 'web'. This value must be provided explicitly or determined by clear codebase inspection—never inferred automatically."
    ),
};

export const RunTestsOnBrowserStackParamsShape = {
  projectName: z
    .string()
    .describe(
      "A single name for your project to organize all your tests. This is required for Percy.",
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
