// Barrel exports for App BrowserStack module
export {
  getAppSDKPrefixCommand,
  getJavaAppFrameworkForMaven,
} from "./commands.js";
export {
  generateAppBrowserStackYMLInstructions,
  generateDeviceConfig,
  generateBrowserStackConfig,
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
