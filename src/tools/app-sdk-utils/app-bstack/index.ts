// Barrel exports for App BrowserStack module
export {
  getAppSDKPrefixCommand,
  getAppInstructionsForProjectConfiguration,
} from "./app-instructions.js";
export {
  generateAppBrowserStackYMLInstructions,
  generateDeviceConfig,
} from "./configUtils.js";
export {
  APP_FRAMEWORK_SUPPORT_MAP,
  isFrameworkSupported,
  isTestingFrameworkSupported,
  getSupportedFrameworks,
  getSupportedTestingFrameworks,
  getDefaultTestingFramework,
  validateFrameworkCombination,
} from "./frameworks.js";

export * from "./types.js";
export * from "./constants.js";
export * from "./utils.js";
export * from "./app-instructions.js";
export * from "./schema.js";
export * from "./formatter.js";
