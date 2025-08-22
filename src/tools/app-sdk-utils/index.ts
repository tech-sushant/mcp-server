// Main entry point for App SDK utilities
export { setupAppAutomateHandler } from "./handler.js";

// Re-export types and enums for external usage
export type {
  AppSDKSupportedLanguage,
  AppSDKSupportedFramework,
  AppSDKSupportedTestingFramework,
  AppSDKSupportedPlatform,
  AppSDKResult,
  AppSDKInstruction,
} from "./common/types.js";

export {
  AppSDKSupportedLanguageEnum,
  AppSDKSupportedFrameworkEnum,
  AppSDKSupportedTestingFrameworkEnum,
  AppSDKSupportedPlatformEnum,
} from "./common/types.js";

// Re-export key utilities
export { formatAppInstructionsWithNumbers } from "./common/index.js";
