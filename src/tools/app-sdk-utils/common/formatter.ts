import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { STEP_DELIMITER } from "./constants.js";
/**
 * Formats the final instructions for BrowserStack App Automate SDK setup.
 * Adds a warning and ensures all steps are included.
 */
export function formatFinalAppInstructions(
  formattedInstructions: string,
): CallToolResult {
  const fullInstructions = `⚠️ IMPORTANT: DO NOT SKIP ANY STEP
All the setup steps described in this file MUST be executed regardless of any existing configuration or setup.
This ensures proper BrowserStack App Automate SDK setup.
Each step is compulsory and sequence needs to be maintained.

${formattedInstructions}`;

  return {
    content: [
      {
        type: "text",
        text: fullInstructions,
        isError: false,
      },
    ],
  };
}

/**
 * Creates a step block with proper formatting
 */
export function createStep(title: string, content: string): string {
  return `${STEP_DELIMITER}
${title}

${content}`;
}

/**
 * Combines multiple instruction parts into a formatted string
 */
export function combineInstructions(...instructionParts: string[]): string {
  return instructionParts.filter(Boolean).join("\n\n");
}

/**
 * Formats environment variable commands based on platform
 */
export function formatEnvCommands(
  username: string,
  accessKey: string,
  isWindows: boolean,
): string {
  if (isWindows) {
    return `\`\`\`cmd
setx BROWSERSTACK_USERNAME "${username}"
setx BROWSERSTACK_ACCESS_KEY "${accessKey}"
\`\`\``;
  }
  return `\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``;
}

/**
 * Normalizes multi-line shell commands. Currently returns the command as-is,
 * but centralizing this allows future tweaks without touching callers.
 */
export function formatMultiLineCommand(
  command: string,
  isWindows: boolean = process.platform === "win32",
): string {
  if (isWindows) {
    // For Windows, keep commands on single line
    return command.replace(/\s*\\\s*\n\s*/g, " ");
  }
  return command;
}

/**
 * Numbers steps separated by STEP_DELIMITER and returns a single string.
 */
export function formatAppInstructionsWithNumbers(instructions: string): string {
  const steps = instructions
    .split(STEP_DELIMITER)
    .filter((step) => step.trim());

  return steps
    .map((step, index) => `**Step ${index + 1}:**\n${step.trim()}`)
    .join("\n\n");
}
