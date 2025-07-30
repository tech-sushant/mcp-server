import {
  SetUpPercySchema,
  RunTestsOnBrowserStackSchema,
} from "./common/schema.js";
import {
  BOOTSTRAP_FAILED,
  IMPORTANT_SETUP_WARNING,
} from "./common/errorMessages.js";
import {
  formatInstructionsWithNumbers,
  generateVerificationMessage,
} from "./common/formatUtils.js";
import { BrowserStackConfig } from "../../lib/types.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  RunTestsInstructionResult,
  PercyIntegrationTypeEnum,
} from "./common/types.js";
import { getBrowserStackAuth } from "../../lib/get-auth.js";
import { fetchPercyToken } from "./percy-web/fetchPercyToken.js";
import { runPercyWeb } from "./percy-web/handler.js";
import { isPercyWebFrameworkSupported } from "./percy-web/frameworks.js";
import { runPercyAutomateOnly } from "./percy-automate/handler.js";
import { isPercyAutomateFrameworkSupported } from "./percy-automate/frameworks.js";
import { runBstackSDKOnly } from "./bstack/sdkHandler.js";
import { runPercyWithSDK } from "./percy-bstack/handler.js";

async function formatToolResult(
  resultPromise: Promise<RunTestsInstructionResult> | RunTestsInstructionResult,
): Promise<CallToolResult> {
  const { steps, requiresPercy, missingDependencies, shouldSkipFormatting } =
    await resultPromise;

  if (shouldSkipFormatting) {
    return {
      content: steps.map((step) => ({
        type: "text" as const,
        text: step.content,
      })),
      isError: steps.some((s) => s.isError),
      steps,
      requiresPercy,
      missingDependencies,
    };
  }

  const combinedInstructions = steps.map((step) => step.content).join("\n");
  const { formattedSteps, stepCount } =
    formatInstructionsWithNumbers(combinedInstructions);
  const verificationMessage = generateVerificationMessage(stepCount);

  const finalContent = [
    { type: "text" as const, text: IMPORTANT_SETUP_WARNING },
    { type: "text" as const, text: formattedSteps },
    { type: "text" as const, text: verificationMessage },
  ];

  return {
    content: finalContent,
    isError: steps.some((s) => s.isError),
    requiresPercy,
    missingDependencies,
  };
}

export async function runTestsOnBrowserStackHandler(
  rawInput: unknown,
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const input = RunTestsOnBrowserStackSchema.parse(rawInput);

    if (!input.enablePercy) {
      const result = runBstackSDKOnly(input, config);
      return await formatToolResult(result);
    } else {
      const percyWithSDKResult = runPercyWithSDK(input, config);

      if (percyWithSDKResult.steps.some((step) => step.isError)) {
        const {
          detectedLanguage,
          detectedBrowserAutomationFramework,
          detectedTestingFramework,
        } = input;
        return {
          content: [
            {
              type: "text",
              text: `Percy is not supported for this configuration using the BrowserStack SDK. Language: ${detectedLanguage} Framework: ${detectedBrowserAutomationFramework} Testing Framework: ${detectedTestingFramework} Would you like to try running this with the Percy SDK instead?`,
            },
          ],
          isError: true,
          shouldSkipFormatting: true,
        };
      }
      return await formatToolResult(percyWithSDKResult);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: BOOTSTRAP_FAILED(error, {
            config,
            percyMode: (rawInput as any)?.enablePercy
              ? "percy-on-bstack"
              : "bstack-only",
          }),
        },
      ],
      isError: true,
    };
  }
}

export async function setUpPercyHandler(
  rawInput: unknown,
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const input = SetUpPercySchema.parse(rawInput);
    const authorization = getBrowserStackAuth(config);

    // Create adapter object for Percy handlers
    const percyInput = {
      projectName: input.projectName,
      detectedLanguage: input.detectedLanguage,
      detectedBrowserAutomationFramework:
        input.detectedBrowserAutomationFramework,
      detectedTestingFramework: input.detectedTestingFramework,
      integrationType: input.integrationType,
    };

    let result: RunTestsInstructionResult;

    if (input.integrationType === PercyIntegrationTypeEnum.AUTOMATE) {
      // Check framework compatibility before fetching token
      const isSupported = isPercyAutomateFrameworkSupported(
        input.detectedLanguage,
        input.detectedTestingFramework
      );
      if (!isSupported) {
        return {
          content: [
            {
              type: "text",
              text: `Percy Automate is not supported for this configuration. Language: ${input.detectedLanguage} Testing Framework: ${input.detectedTestingFramework}`,
            },
          ],
          isError: true,
          shouldSkipFormatting: true,
        };
      }
    } else if (input.integrationType === PercyIntegrationTypeEnum.WEB) {
      // Check framework compatibility before fetching token for Percy Web
      const isSupported = isPercyWebFrameworkSupported(
        input.detectedLanguage,
        input.detectedBrowserAutomationFramework
      );
      if (!isSupported) {
        return {
          content: [
            {
              type: "text",
              text: `Percy Web is not supported for this configuration. Language: ${input.detectedLanguage} Browser Automation Framework: ${input.detectedBrowserAutomationFramework}`,
            },
          ],
          isError: true,
          shouldSkipFormatting: true,
        };
      }
    }

    // Determine options for fetchPercyToken based on integrationType
    let percyTokenOptions = {};
    if (input.integrationType === PercyIntegrationTypeEnum.WEB) {
      percyTokenOptions = { type: PercyIntegrationTypeEnum.WEB };
    } else if (input.integrationType === PercyIntegrationTypeEnum.AUTOMATE) {
      percyTokenOptions = { type: PercyIntegrationTypeEnum.AUTOMATE };
    }

    const percyToken = await fetchPercyToken(
      input.projectName,
      authorization,
      percyTokenOptions,
    );

    if (input.integrationType === PercyIntegrationTypeEnum.WEB) {
      result = runPercyWeb(percyInput, percyToken || "YOUR_PERCY_TOKEN_HERE");
    } else {
      result = runPercyAutomateOnly(
        percyInput,
        percyToken || "YOUR_PERCY_TOKEN_HERE",
      );
    }

    return await formatToolResult(result);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: BOOTSTRAP_FAILED(error, {
            config,
            percyMode: (rawInput as any)?.integrationType,
          }),
        },
      ],
      isError: true,
    };
  }
}
