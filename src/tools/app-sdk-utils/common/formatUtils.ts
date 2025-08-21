// Utility functions for formatting instructions and results
import { STEP_DELIMITER } from "./constants.js";

/**
 * Formats instructions with step numbers
 */
export function formatAppInstructionsWithNumbers(instructions: string): string {
  const steps = instructions
    .split(STEP_DELIMITER)
    .filter((step) => step.trim());

  return steps
    .map((step, index) => `**Step ${index + 1}:**\n${step.trim()}`)
    .join("\n\n");
}

/**
 * Formats environment variable commands based on platform
 */
export function formatEnvCommands(
  username: string,
  accessKey: string,
  isWindows: boolean = process.platform === "win32",
): string {
  if (isWindows) {
    return `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``;
  } else {
    return `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``;
  }
}

/**
 * Formats multi-line commands for cross-platform compatibility
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
