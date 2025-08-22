// Framework configurations and mappings for App SDK
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedFramework,
  AppSDKSupportedTestingFramework,
} from "./types.js";

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
      "cucumberTestng",
      "cucumberJunit4",
      "cucumberJunit5",
    ],
  },
  nodejs: {
    frameworks: ["webdriverio", "nightwatch", "jest", "mocha", "cucumberJs"],
    testingFrameworks: [
      "webdriverio",
      "nightwatch",
      "jest",
      "mocha",
      "cucumberJs",
    ],
  },
  python: {
    frameworks: ["pytest", "appium"],
    testingFrameworks: ["robot", "pytest", "behave", "lettuce"],
  },
  ruby: {
    frameworks: ["rspec", "cucumberRuby"],
    testingFrameworks: ["rspec", "cucumberRuby"],
  },
  csharp: {
    frameworks: ["appium"],
    testingFrameworks: ["nunit", "mstest", "xunit", "specflow", "reqnroll"],
  },
};

export function isFrameworkSupported(
  language: AppSDKSupportedLanguage,
  framework: AppSDKSupportedFramework,
): boolean {
  return (
    APP_FRAMEWORK_SUPPORT_MAP[language]?.frameworks.includes(framework) || false
  );
}

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

export function getSupportedFrameworks(
  language: AppSDKSupportedLanguage,
): AppSDKSupportedFramework[] {
  return APP_FRAMEWORK_SUPPORT_MAP[language]?.frameworks || [];
}

export function getSupportedTestingFrameworks(
  language: AppSDKSupportedLanguage,
): AppSDKSupportedTestingFramework[] {
  return APP_FRAMEWORK_SUPPORT_MAP[language]?.testingFrameworks || [];
}

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
