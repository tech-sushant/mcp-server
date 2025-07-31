import {
  SetUpPercySchema,
  RunTestsOnBrowserStackSchema,
} from "./common/schema.js";
import { BOOTSTRAP_FAILED } from "./common/commonMessages.js";
import { formatToolResult } from "./common/utils.js";
import { BrowserStackConfig } from "../../lib/types.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { PercyIntegrationTypeEnum } from "./common/types.js";
import { getBrowserStackAuth } from "../../lib/get-auth.js";
import { fetchPercyToken } from "./percy-web/fetchPercyToken.js";
import { runPercyWeb } from "./percy-web/handler.js";
import { runPercyAutomateOnly } from "./percy-automate/handler.js";
import { runBstackSDKOnly } from "./bstack/sdkHandler.js";
import { checkPercyIntegrationSupport } from "./common/utils.js";

export async function runTestsOnBrowserStackHandler(
  rawInput: unknown,
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const input = RunTestsOnBrowserStackSchema.parse(rawInput);
    const result = runBstackSDKOnly(input, config);
    return await formatToolResult(result);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: BOOTSTRAP_FAILED(error, {
            config,
            percyMode: "bstack-only",
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

    // Handle Percy Automate: Check if BrowserStack Automate needs to be set up first
    if (input.integrationType === "automate" || input.integrationType === "automate_already_setup") {
      // Create adapter object for Percy Automate
      const percyInput = {
        projectName: input.projectName,
        detectedLanguage: input.detectedLanguage,
        detectedBrowserAutomationFramework:
          input.detectedBrowserAutomationFramework,
        detectedTestingFramework: input.detectedTestingFramework,
        integrationType: PercyIntegrationTypeEnum.AUTOMATE,
      };

      const supportCheck = checkPercyIntegrationSupport(percyInput);
      if (!supportCheck.supported) {
        return {
          content: [
            {
              type: "text",
              text:
                supportCheck.errorMessage ||
                "Percy Automate is not supported for this configuration.",
            },
          ],
          isError: true,
          shouldSkipFormatting: true,
        };
      }

      const percyToken = await fetchPercyToken(input.projectName, authorization, {
        type: PercyIntegrationTypeEnum.AUTOMATE,
      });

      // Create combined setup instructions: BrowserStack Automate first (if needed), then Percy Automate
      const automateSteps = input.integrationType === "automate" ? [
        {
          type: "instruction" as const,
          content: "First, set up BrowserStack Automate by using the setupBrowserStackAutomateTests tool if you haven't already. This is required for Percy Automate to work properly.",
          title: "Prerequisites: BrowserStack Automate Setup",
          isError: false,
        },
      ] : [];

      const percyAutomateResult = runPercyAutomateOnly(percyInput, percyToken);

      const combinedSteps = [
        ...automateSteps,
        ...(percyAutomateResult.steps || []),
      ];

      return await formatToolResult({
        ...percyAutomateResult,
        steps: combinedSteps,
      });
    } else {
      // Handle Percy Web
      const percyInput = {
        projectName: input.projectName,
        detectedLanguage: input.detectedLanguage,
        detectedBrowserAutomationFramework:
          input.detectedBrowserAutomationFramework,
        detectedTestingFramework: input.detectedTestingFramework,
        integrationType: PercyIntegrationTypeEnum.WEB,
      };

      const supportCheck = checkPercyIntegrationSupport(percyInput);
      if (!supportCheck.supported) {
        return {
          content: [
            {
              type: "text",
              text:
                supportCheck.errorMessage ||
                "Percy Web integration not supported for this configuration.",
            },
          ],
          isError: true,
          shouldSkipFormatting: true,
        };
      }

      const percyToken = await fetchPercyToken(input.projectName, authorization, {
        type: PercyIntegrationTypeEnum.WEB,
      });

      const result = runPercyWeb(percyInput, percyToken);

      return await formatToolResult(result);
    }
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
