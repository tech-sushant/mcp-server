import { z } from "zod";
import {
  SDKSupportedBrowserAutomationFrameworkEnum,
  SDKSupportedTestingFrameworkEnum,
  SDKSupportedLanguageEnum,
} from "./types.js";

export enum PercyMode {
  PercyDisabled = "percy-disabled", // BrowserStack SDK only, no Percy
  PercyWithSDK = "percy-on-browserstack-infra", // BrowserStack SDK + Percy integration (with fallback)
  PercyWeb = "percy-on-local-infra", // Percy Web only (not implemented)
}

// Internal enum for execution paths (includes fallback)
export enum InternalPercyMode {
  PercyDisabled = "percy-disabled",
  PercyWithSDK = "percy-on-browserstack-infra",
  PercyAutomate = "percy-automate",
  PercyWeb = "percy-on-local-infra",
}

// Centralized enum for Percy (Zod) - Only user-facing options
export const PercyModeEnum = z.nativeEnum(PercyMode);

// User-facing schema - only 3 options for user
export const RunTestsOnBrowserStackParamsShape = {
  detectedBrowserAutomationFramework: z.nativeEnum(
    SDKSupportedBrowserAutomationFrameworkEnum,
  ),
  detectedTestingFramework: z.nativeEnum(SDKSupportedTestingFrameworkEnum),
  detectedLanguage: z.nativeEnum(SDKSupportedLanguageEnum),
  desiredPlatforms: z.array(z.enum(["windows", "macos", "android", "ios"])),
  percyMode: PercyModeEnum.default(PercyMode.PercyDisabled).describe(
    "Percy mode: No 'Percy' in user input → percy-disabled. 'Percy' without 'BrowserStack'/'Automate' → percy-on-local-infra. 'Percy' with 'BrowserStack' or 'Automate' → percy-on-browserstack-infra. Always map user requests to the correct tool and mode per these rules.",
  ),
};

export const RunTestsOnBrowserStackSchema = z.object(
  RunTestsOnBrowserStackParamsShape,
);

export type RunTestsOnBrowserStackInput = z.infer<
  typeof RunTestsOnBrowserStackSchema
>;
