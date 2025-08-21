// Main orchestration handler for App SDK utilities
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedFramework,
  AppSDKSupportedTestingFramework,
  AppSDKResult,
  AppSDKInstruction,
  formatAppInstructionsWithNumbers,
  getAppInstructionsForProjectConfiguration,
  createError,
  validateLanguage,
  validateTestingFramework,
} from "./common/index.js";

import {
  getAppSDKPrefixCommand,
  generateAppBrowserStackYMLInstructions,
  validateFrameworkCombination,
} from "./app-bstack/index.js";

/**
 * Main handler for running App SDK only setup
 */
export async function runAppSDKOnlyHandler(
  language: string,
  framework: string,
  testingFramework: string,
  username: string,
  accessKey: string,
  platforms: string[] = ["android"],
  appPath?: string,
): Promise<AppSDKResult> {
  try {
    // Validate inputs
    if (!validateLanguage(language)) {
      return {
        success: false,
        instructions: [],
        error: `Unsupported language: ${language}. Supported languages: java, nodejs, python, ruby, csharp`,
      };
    }

    if (!validateTestingFramework(testingFramework)) {
      return {
        success: false,
        instructions: [],
        error: `Unsupported testing framework: ${testingFramework}`,
      };
    }

    // Validate framework combination
    const validation = validateFrameworkCombination(
      language as AppSDKSupportedLanguage,
      framework as AppSDKSupportedFramework,
      testingFramework as AppSDKSupportedTestingFramework,
    );

    if (!validation.valid) {
      return {
        success: false,
        instructions: [],
        error: validation.error,
      };
    }

    const instructions: AppSDKInstruction[] = [];

    // Generate SDK setup commands
    const sdkCommand = getAppSDKPrefixCommand(
      language as AppSDKSupportedLanguage,
      framework,
      username,
      accessKey,
      appPath,
    );

    if (sdkCommand) {
      instructions.push({
        content: sdkCommand,
        type: "setup",
      });
    }

    // Generate browserstack.yml configuration
    const configInstructions = generateAppBrowserStackYMLInstructions(
      platforms,
      username,
      accessKey,
      appPath,
      testingFramework,
    );

    if (configInstructions) {
      instructions.push({
        content: configInstructions,
        type: "config",
      });
    }

    // Generate project configuration and run instructions
    const projectInstructions = getAppInstructionsForProjectConfiguration(
      framework,
      testingFramework as AppSDKSupportedTestingFramework,
      language as AppSDKSupportedLanguage,
    );

    if (projectInstructions) {
      instructions.push({
        content: projectInstructions,
        type: "run",
      });
    }

    return {
      success: true,
      instructions,
    };
  } catch (error) {
    return {
      success: false,
      instructions: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generate complete setup instructions as formatted string
 */
export async function generateCompleteAppSDKInstructions(
  language: string,
  framework: string,
  testingFramework: string,
  username: string,
  accessKey: string,
  platforms: string[] = ["android"],
  appPath?: string,
): Promise<string> {
  const result = await runAppSDKOnlyHandler(
    language,
    framework,
    testingFramework,
    username,
    accessKey,
    platforms,
    appPath,
  );

  if (!result.success) {
    throw createError(result.error || "Failed to generate instructions");
  }

  const combinedInstructions = result.instructions
    .map((instruction) => instruction.content)
    .join("\n\n");

  return formatAppInstructionsWithNumbers(combinedInstructions);
}

/**
 * Validate app SDK configuration
 */
export function validateAppSDKConfig(config: {
  language: string;
  framework: string;
  testingFramework: string;
  platforms: string[];
  username?: string;
  accessKey?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validateLanguage(config.language)) {
    errors.push(`Invalid language: ${config.language}`);
  }

  if (!validateTestingFramework(config.testingFramework)) {
    errors.push(`Invalid testing framework: ${config.testingFramework}`);
  }

  if (config.platforms.length === 0) {
    errors.push("At least one platform must be specified");
  }

  const invalidPlatforms = config.platforms.filter(
    (p) => !["android", "ios"].includes(p),
  );
  if (invalidPlatforms.length > 0) {
    errors.push(
      `Invalid platforms: ${invalidPlatforms.join(", ")}. Supported: android, ios`,
    );
  }

  if (config.username && config.language && config.testingFramework) {
    const validation = validateFrameworkCombination(
      config.language as AppSDKSupportedLanguage,
      config.framework as AppSDKSupportedFramework,
      config.testingFramework as AppSDKSupportedTestingFramework,
    );

    if (!validation.valid) {
      errors.push(validation.error!);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get supported options for app SDK configuration
 */
export function getAppSDKSupportedOptions() {
  return {
    languages: ["java", "nodejs", "python", "ruby", "csharp"],
    platforms: ["android", "ios"],
    testingFrameworks: {
      java: [
        "testng",
        "junit5",
        "selenide",
        "jbehave",
        "cucumber-testng",
        "cucumber-junit4",
        "cucumber-junit5",
      ],
      nodejs: ["webdriverio", "nightwatch", "jest", "mocha", "cucumber-js"],
      python: ["robot", "pytest", "behave", "lettuce"],
      ruby: ["rspec", "cucumber-ruby"],
      csharp: ["nunit", "mstest", "xunit", "specflow", "reqnroll"],
    },
  };
}
