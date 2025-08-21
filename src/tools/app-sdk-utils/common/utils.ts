// General utility functions for App SDK utilities
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedTestingFramework,
} from "./types.js";

/**
 * Validates that a language is supported
 */
export function validateLanguage(
  language: string,
): language is AppSDKSupportedLanguage {
  const supportedLanguages = ["java", "nodejs", "python", "ruby", "csharp"];
  return supportedLanguages.includes(language);
}

/**
 * Validates that a testing framework is supported
 */
export function validateTestingFramework(
  framework: string,
): framework is AppSDKSupportedTestingFramework {
  const supportedFrameworks = [
    "testng",
    "junit5",
    "selenide",
    "jbehave",
    "cucumber-testng",
    "cucumber-junit4",
    "cucumber-junit5",
    "webdriverio",
    "nightwatch",
    "jest",
    "mocha",
    "cucumber-js",
    "robot",
    "pytest",
    "behave",
    "lettuce",
    "rspec",
    "cucumber-ruby",
    "nunit",
    "mstest",
    "xunit",
    "specflow",
    "reqnroll",
  ];
  return supportedFrameworks.includes(framework);
}

/**
 * Gets the appropriate shell command prefix based on platform
 */
export function getShellPrefix(): string {
  return process.platform === "win32" ? "cmd" : "bash";
}

/**
 * Sanitizes input strings for safe command generation
 */
export function sanitizeInput(input: string): string {
  // Basic sanitization - remove potentially dangerous characters
  return input.replace(/[;&|`$(){}[\]]/g, "");
}

/**
 * Checks if app path is a BrowserStack URL
 */
export function isBrowserStackAppUrl(appPath: string): boolean {
  return appPath.startsWith("bs://");
}

/**
 * Generates a unique build name with timestamp
 */
export function generateBuildName(baseName: string = "app-automate"): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "");
  return `${baseName}-${timestamp}`;
}

/**
 * Creates error message with context
 */
export function createError(
  message: string,
  context?: Record<string, any>,
): Error {
  const error = new Error(message);
  if (context) {
    (error as any).context = context;
  }
  return error;
}
