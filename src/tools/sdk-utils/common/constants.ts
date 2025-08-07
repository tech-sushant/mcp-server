
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
Percy Mode: ${context.percyMode ?? "automate"}
SDK Version: ${context.sdkVersion ?? "N/A"}
Please open an issue on GitHub if the problem persists.`;

export const percyAutomateAggressiveInstruction = `
**MANDATORY: Aggressive, Exhaustive Percy Automate Integration**

You MUST follow these steps with NO EXCEPTIONS:

1. Recursively search the ENTIRE target directory and ALL subdirectories for EVERY file relevant to the language/framework.
2. For EACH relevant file, analyze the code to find EVERY location where a Percy snapshot (or equivalent) should be called (e.g., after each navigation, UI change, or significant state in tests). Insert snapshot calls at ALL such points, not just the first or most obvious one.
3. At the top of EVERY relevant file, ensure the necessary import/setup is present (do NOT duplicate if already present).
4. Insert the snapshot call (with a clear, descriptive, and unique name) at EVERY identified point in EVERY relevant file.
5. Double-check your work. If in doubt, add more snapshot calls rather than fewer. DO NOT stop until you have processed ALL relevant files and ALL important points within them.

Iteratively update every relevant test file in the directory and all subdirectories, adding Percy integration to each, one file at a time, until all are complete.
`;

export const SIMULATE_PERCY_CHANGE_DESCRIPTION =
  "Simulate a Percy visual change by guiding the user to inject a visible UI change (such as a large popup) into the app, re-run Percy, and confirm that the visual difference is detected. This tool analyzes the project, provides step-by-step instructions for the simulation, and leverages existing Percy setup logic. No direct code injection is performed; this is an instructional tool for LLM-driven workflows.";

export const SETUP_PERCY_DESCRIPTION =
  "Set up Percy visual testing for your project. This supports both Percy Web Standalone and Percy Automate.";

export const RUN_ON_BROWSERSTACK_DESCRIPTION =
  "Set up and run automated web-based tests on BrowserStack using the BrowserStack SDK. Use this tool for functional or integration test setup on BrowserStack only. For any visual testing or Percy integration, use the dedicated Percy setup tool. Example prompts: run this test on browserstack; set up this project for browserstack.";
