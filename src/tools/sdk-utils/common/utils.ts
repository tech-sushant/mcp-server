import { PercyIntegrationTypeEnum } from "../common/types.js";
import { isPercyAutomateFrameworkSupported } from "../percy-automate/frameworks.js";
import { isPercyWebFrameworkSupported } from "../percy-web/frameworks.js";

/**
 * Utility to check Percy integration support for a given input.
 * Returns { supported: boolean, errorMessage?: string }
 */
export function checkPercyIntegrationSupport(input: {
  integrationType: string;
  detectedLanguage: string;
  detectedTestingFramework?: string;
  detectedBrowserAutomationFramework?: string;
}): { supported: boolean; errorMessage?: string } {
  if (input.integrationType === PercyIntegrationTypeEnum.AUTOMATE) {
    const isSupported = isPercyAutomateFrameworkSupported(
      input.detectedLanguage,
      input.detectedTestingFramework || ""
    );
    if (!isSupported) {
      return {
        supported: false,
        errorMessage: `Percy Automate is not supported for this configuration. Language: ${input.detectedLanguage} Testing Framework: ${input.detectedTestingFramework}`,
      };
    }
  } else if (input.integrationType === PercyIntegrationTypeEnum.WEB) {
    const isSupported = isPercyWebFrameworkSupported(
      input.detectedLanguage,
      input.detectedBrowserAutomationFramework || ""
    );
    if (!isSupported) {
      return {
        supported: false,
        errorMessage: `Percy Web is not supported for this configuration. Language: ${input.detectedLanguage} Browser Automation Framework: ${input.detectedBrowserAutomationFramework}`,
      };
    }
  }
  return { supported: true };
}
