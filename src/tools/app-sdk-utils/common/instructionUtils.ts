// Instruction generation utilities shared across different modules
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedTestingFramework,
} from "./index.js";

import {
  getJavaAppInstructions,
  getCSharpAppInstructions,
  getNodejsAppInstructions,
  getPythonAppInstructions,
  getRubyAppInstructions,
} from "../app-bstack/instructions.js";

export function getAppInstructionsForProjectConfiguration(
  framework: string,
  testingFramework: AppSDKSupportedTestingFramework,
  language: AppSDKSupportedLanguage,
): string {
  if (!framework || !testingFramework || !language) {
    return "";
  }

  switch (language) {
    case "java":
  return getJavaAppInstructions();
    case "nodejs":
      return getNodejsAppInstructions(testingFramework);
    case "python":
      return getPythonAppInstructions(testingFramework);
    case "ruby":
      return getRubyAppInstructions(testingFramework);
    case "csharp":
  return getCSharpAppInstructions();
    default:
      return "";
  }
}
