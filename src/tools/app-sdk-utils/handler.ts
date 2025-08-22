import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { BrowserStackConfig } from "../../lib/types.js";
import { getBrowserStackAuth } from "../../lib/get-auth.js";
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedTestingFramework,
  AppSDKInstruction,
  formatAppInstructionsWithNumbers,
  getAppInstructionsForProjectConfiguration,
  SetupAppBstackParamsShape,
} from "./common/index.js";
import {
  getAppSDKPrefixCommand,
  generateAppBrowserStackYMLInstructions,
} from "./app-bstack/index.js";

export async function setupAppAutomateHandler(
  rawInput: unknown,
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  const input = z.object(SetupAppBstackParamsShape).parse(rawInput);
  const auth = getBrowserStackAuth(config);
  const [username, accessKey] = auth.split(":");

  const instructions: AppSDKInstruction[] = [];

  // Step 1: Generate SDK setup command
  const sdkCommand = getAppSDKPrefixCommand(
    input.detectedLanguage as AppSDKSupportedLanguage,
    input.detectedFramework as string,
    username,
    accessKey,
    input.appPath as string | undefined,
  );

  if (sdkCommand) {
    instructions.push({ content: sdkCommand, type: "setup" });
  }

  // Step 2: Generate browserstack.yml configuration
  const configInstructions = generateAppBrowserStackYMLInstructions(
    (input.desiredPlatforms as string[]) ?? ["android"],
    username,
    accessKey,
    input.appPath as string | undefined,
    input.detectedTestingFramework as AppSDKSupportedTestingFramework,
  );

  if (configInstructions) {
    instructions.push({ content: configInstructions, type: "config" });
  }

  // Step 3: Generate project configuration and run instructions
  const projectInstructions = getAppInstructionsForProjectConfiguration(
    input.detectedFramework as string,
    input.detectedTestingFramework as AppSDKSupportedTestingFramework,
    input.detectedLanguage as AppSDKSupportedLanguage,
  );

  if (projectInstructions) {
    instructions.push({ content: projectInstructions, type: "run" });
  }

  const combinedInstructions = instructions
    .map((instruction) => instruction.content)
    .join("\n\n");

  return {
    content: [
      {
        type: "text",
        text: formatAppInstructionsWithNumbers(combinedInstructions),
        isError: false,
      },
    ],
    isError: false,
  };
}
