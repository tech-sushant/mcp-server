/**
 * Centralized error and fallback messages for runTestsOnBrowserStack tool.
 */

export const IMPORTANT_SETUP_WARNING =
  "⚠️ IMPORTANT: DO NOT SKIP ANY STEP\nAll the setup steps described below MUST be executed regardless of any existing configuration or setup.\nThis ensures proper BrowserStack SDK setup.";

export const UNKNOWN_CONFIGURATION_ERROR =
  "Unknown configuration for runTestsOnBrowserStack. Please check your input parameters and try again.";

export const PERCY_WEB_NOT_IMPLEMENTED =
  "Percy Web (direct Percy SDK) support is not yet implemented. Please check back later.";

export const PERCY_AUTOMATE_NOT_IMPLEMENTED =
  "Percy Automate support is not yet implemented for this configuration. Please check back later.";

export enum PercyAutomateNotImplementedType {
  LANGUAGE = "language",
  FRAMEWORK = "framework",
}

export function getPercyAutomateNotImplementedMessage(
  type: PercyAutomateNotImplementedType,
  input: {
    detectedLanguage: string;
    detectedBrowserAutomationFramework: string;
  },
  supported: string[],
): string {
  if (type === PercyAutomateNotImplementedType.LANGUAGE) {
    return `Percy Automate does not support the language: ${input.detectedLanguage}. Supported languages are: ${supported.join(", ")}.`;
  } else {
    return `Percy Automate does not support ${input.detectedBrowserAutomationFramework} for ${input.detectedLanguage}. Supported frameworks for ${input.detectedLanguage} are: ${supported.join(", ")}.`;
  }
}

export const BOOTSTRAP_FAILED = (
  error: unknown,
  context: { config: unknown; percyMode?: string; sdkVersion?: string },
) =>
  `Failed to bootstrap project with BrowserStack SDK.
Error: ${error}
Config: ${JSON.stringify(context.config, null, 2)}
Percy Mode: ${context.percyMode ?? "automate"}
SDK Version: ${context.sdkVersion ?? "N/A"}
Please open an issue on GitHub if the problem persists.`;
