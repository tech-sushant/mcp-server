// Handler for Percy Automate only mode - Visual testing without BrowserStack infrastructure
import { RunTestsInstructionResult, RunTestsStep } from "../common/types.js";
import { SetUpPercyInput } from "../common/schema.js";
import { SUPPORTED_CONFIGURATIONS } from "./frameworks.js";
import { SDKSupportedLanguage } from "../common/types.js";
import {
  PercyAutomateNotImplementedType,
  getPercyAutomateNotImplementedMessage,
} from "../common/errorMessages.js";

export function runPercyAutomateOnly(
  input: SetUpPercyInput,
  percyToken: string,
): RunTestsInstructionResult {
  const steps: RunTestsStep[] = [];

  // Check if this configuration is supported for Percy Automate
  const languageConfig =
    SUPPORTED_CONFIGURATIONS[input.detectedLanguage as SDKSupportedLanguage];

  if (!languageConfig) {
    return {
      steps: [
        {
          type: "error",
          title: "Language Not Supported",
          content: getPercyAutomateNotImplementedMessage(
            PercyAutomateNotImplementedType.LANGUAGE,
            input,
            Object.keys(SUPPORTED_CONFIGURATIONS),
          ),
          isError: true,
        },
      ],
      requiresPercy: true,
      missingDependencies: [],
      shouldSkipFormatting: true,
    };
  }

  const testingFrameworkConfig = languageConfig[input.detectedTestingFramework];

  if (!testingFrameworkConfig) {
    return {
      steps: [
        {
          type: "error",
          title: "Testing Framework Not Supported",
          content: getPercyAutomateNotImplementedMessage(
            PercyAutomateNotImplementedType.FRAMEWORK,
            {
              ...input,
              detectedBrowserAutomationFramework:
                input.detectedTestingFramework,
            },
            Object.keys(languageConfig),
          ),
          isError: true,
        },
      ],
      requiresPercy: true,
      missingDependencies: [],
      shouldSkipFormatting: true,
    };
  }

  // Generate instructions for the supported configuration with project name
  const instructions = testingFrameworkConfig.instructions;

  // Prepend a step to set the Percy token in the environment
  steps.push({
    type: "instruction",
    title: "Set Percy Token in Environment",
    content: `Set the environment variable generated for your project before running your tests:\n\nexport PERCY_TOKEN="${percyToken}"\n\n(For Windows, use 'setx PERCY_TOKEN "${percyToken}"' or 'set PERCY_TOKEN=${percyToken}' as appropriate.)`,
  });

  steps.push({
    type: "instruction",
    title: `Percy Automate Setup for ${input.detectedLanguage} with ${input.detectedTestingFramework}`,
    content: instructions,
  });

  return {
    steps,
    requiresPercy: true,
    missingDependencies: [],
  };
}
