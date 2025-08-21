// Framework configurations and mappings for App SDK
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedFramework,
  AppSDKSupportedTestingFramework,
} from "../common/types.js";

/**
 * Mapping of supported languages to their available frameworks and testing frameworks
 */
export const APP_FRAMEWORK_SUPPORT_MAP: Record<
  AppSDKSupportedLanguage,
  {
    frameworks: AppSDKSupportedFramework[];
    testingFrameworks: AppSDKSupportedTestingFramework[];
  }
> = {
  java: {
    frameworks: ["appium"],
    testingFrameworks: [
      "testng",
      "junit5",
      "selenide",
      "jbehave",
      "cucumber-testng",
      "cucumber-junit4",
      "cucumber-junit5",
    ],
  },
  nodejs: {
    frameworks: ["webdriverio", "nightwatch", "jest", "mocha", "cucumber-js"],
    testingFrameworks: [
      "webdriverio",
      "nightwatch",
      "jest",
      "mocha",
      "cucumber-js",
    ],
  },
  python: {
    frameworks: ["pytest", "appium"],
    testingFrameworks: ["robot", "pytest", "behave", "lettuce"],
  },
  ruby: {
    frameworks: ["rspec", "cucumber-ruby"],
    testingFrameworks: ["rspec", "cucumber-ruby"],
  },
  csharp: {
    frameworks: ["appium"],
    testingFrameworks: ["nunit", "mstest", "xunit", "specflow", "reqnroll"],
  },
};

/**
 * Check if a framework is supported for a given language
 */
export function isFrameworkSupported(
  language: AppSDKSupportedLanguage,
  framework: AppSDKSupportedFramework,
): boolean {
  return (
    APP_FRAMEWORK_SUPPORT_MAP[language]?.frameworks.includes(framework) || false
  );
}

/**
 * Check if a testing framework is supported for a given language
 */
export function isTestingFrameworkSupported(
  language: AppSDKSupportedLanguage,
  testingFramework: AppSDKSupportedTestingFramework,
): boolean {
  return (
    APP_FRAMEWORK_SUPPORT_MAP[language]?.testingFrameworks.includes(
      testingFramework,
    ) || false
  );
}

/**
 * Get all supported frameworks for a language
 */
export function getSupportedFrameworks(
  language: AppSDKSupportedLanguage,
): AppSDKSupportedFramework[] {
  return APP_FRAMEWORK_SUPPORT_MAP[language]?.frameworks || [];
}

/**
 * Get all supported testing frameworks for a language
 */
export function getSupportedTestingFrameworks(
  language: AppSDKSupportedLanguage,
): AppSDKSupportedTestingFramework[] {
  return APP_FRAMEWORK_SUPPORT_MAP[language]?.testingFrameworks || [];
}

/**
 * Get the default testing framework for a language
 */
export function getDefaultTestingFramework(
  language: AppSDKSupportedLanguage,
): AppSDKSupportedTestingFramework | null {
  const frameworks = getSupportedTestingFrameworks(language);
  if (frameworks.length === 0) return null;

  // Return sensible defaults for each language
  switch (language) {
    case "java":
      return "testng";
    case "nodejs":
      return "webdriverio";
    case "python":
      return "pytest";
    case "ruby":
      return "rspec";
    case "csharp":
      return "nunit";
    default:
      return frameworks[0];
  }
}

/**
 * Validate language, framework, and testing framework combination
 */
export function validateFrameworkCombination(
  language: AppSDKSupportedLanguage,
  framework: AppSDKSupportedFramework,
  testingFramework: AppSDKSupportedTestingFramework,
): { valid: boolean; error?: string } {
  const languageConfig = APP_FRAMEWORK_SUPPORT_MAP[language];

  if (!languageConfig) {
    return { valid: false, error: `Language "${language}" is not supported` };
  }

  if (!languageConfig.frameworks.includes(framework)) {
    return {
      valid: false,
      error: `Framework "${framework}" is not supported for language "${language}". Supported frameworks: ${languageConfig.frameworks.join(", ")}`,
    };
  }

  if (!languageConfig.testingFrameworks.includes(testingFramework)) {
    return {
      valid: false,
      error: `Testing framework "${testingFramework}" is not supported for language "${language}". Supported testing frameworks: ${languageConfig.testingFrameworks.join(", ")}`,
    };
  }

  return { valid: true };
}
