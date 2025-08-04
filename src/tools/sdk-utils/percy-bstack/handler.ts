import { RunTestsInstructionResult, RunTestsStep } from "../common/types.js";
import { RunTestsOnBrowserStackInput } from "../common/schema.js";
import { getBrowserStackAuth } from "../../../lib/get-auth.js";
import { getSDKPrefixCommand } from "../bstack/commands.js";
import { generateBrowserStackYMLInstructions } from "../bstack/configUtils.js";
import { getInstructionsForProjectConfiguration } from "../common/instructionUtils.js";
import {
  formatPercyInstructions,
  getPercyInstructions,
} from "./instructions.js";
import { BrowserStackConfig } from "../../../lib/types.js";
import {
  SDKSupportedBrowserAutomationFramework,
  SDKSupportedTestingFramework,
  SDKSupportedLanguage,
} from "../common/types.js";
import * as fs from "fs";
import * as path from "path";
import logger from "../../../logger.js";

function findSpecFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...findSpecFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".spec.js")) {
        files.push(fullPath);
      }
    }
  } catch {
    // Skip directories that can't be read
  }

  return files;
}

export async function findAndSampleTestFiles(
  testPath: string,
  mcpServer: any,
): Promise<RunTestsStep[]> {
  const steps: RunTestsStep[] = [];

  try {
    logger.info(`Searching for test files in path: ${testPath}`);
    const files = findSpecFiles(testPath);
    logger.info(`Found ${files.length} test files in path: ${testPath}`);

    const testFiles = files.filter((file: string) => {
      try {
        const content = fs.readFileSync(file, "utf8");
        return content.includes("describe(") && content.includes("it(");
      } catch (error) {
        logger.info(`Failed to read file ${path.basename(file)}: ${error}`);
        return false;
      }
    });

    if (testFiles.length === 0) {
      logger.info(
        `No test files found in path: ${testPath}. Ensure there are *.spec.js files with describe() and it() patterns.`,
      );
      steps.push({
        type: "instruction",
        title: "No Test Files Found",
        content:
          "No *.spec.js files with describe() and it() patterns found in the specified path.",
      });
      return steps;
    }

    for (const file of testFiles) {
      try {
        const content = fs.readFileSync(file, "utf8");
        logger.info(`Sampling file: ${path.basename(file)}`);

        // Add line numbers to content for better LLM understanding
        const contentWithLineNumbers = content
          .split("\n")
          .map((line, index) => `${index + 1}: ${line}`)
          .join("\n");

        const samplingPrompt = `You are a test automation expert. Add Percy visual testing capabilities to the given test file.

REQUIREMENTS:
1. Add the Percy import: const { percy } = require('browserstack-node-sdk');
2. Add percy.screenshot() calls in appropriate test locations
3. Preserve all existing test logic and structure
4. Add meaningful snapshot names
5. Return ONLY the specific lines that need to be changed/added

IMPORTANT: Use this format for each change:
**--newline-start--**line-no:<line_number>--**
<new_line_content>

For new lines to be inserted between existing lines, use:
**--newline-start--**line-no:<line_number>+--**
<new_line_content>

Example responses:
**--newline-start--**line-no:1--**
const { percy } = require('browserstack-node-sdk');

**--newline-start--**line-no:15+--**
    await percy.screenshot(driver, "Login Page Screenshot");

File with line numbers:
${contentWithLineNumbers}

Provide only the specific line changes needed for Percy integration.`;

        const response = await mcpServer.server.createMessage({
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: samplingPrompt,
              },
            },
          ],
          modelPreferences: {
            costPriority: 0.9,
            speedPriority: 0.9,
            intelligencePriority: 0.3,
          },
          maxTokens: 2000,
        });

        const responseText =
          response.content.type === "text" ? response.content.text : "";

        // Optimized logging - only log first line of response for better readability
        const firstLine = responseText.split("\n")[0] || "";
        logger.info(
          `Response for file ${path.basename(file)}: ${firstLine.substring(0, 100)}...`,
        );

        // Parse line-specific changes
        const lineChangePattern =
          /\*{2}--newline-start--\*{2}line-no:(\d+)(\+)?--\*{2}\n([^*]*?)(?=\*{2}--newline-start--\*{2}|$)/g;
        const changes: Array<{
          lineNo: number;
          content: string;
          isInsert: boolean;
        }> = [];
        let match;

        while ((match = lineChangePattern.exec(responseText)) !== null) {
          const lineNo = parseInt(match[1], 10);
          const isInsert = !!match[2]; // + means insert after line
          const content = match[3].trim();
          changes.push({ lineNo, content, isInsert });
        }

        if (changes.length > 0) {
          try {
            const lines = content.split("\n");

            // Sort changes by line number in descending order to avoid index shifting
            changes.sort((a, b) => b.lineNo - a.lineNo);

            for (const change of changes) {
              if (change.isInsert) {
                // Insert after the specified line
                lines.splice(change.lineNo, 0, change.content);
              } else {
                // Replace the specified line (1-based indexing)
                lines[change.lineNo - 1] = change.content;
              }
            }

            const updatedContent = lines.join("\n");
            fs.writeFileSync(file, updatedContent, "utf8");
            logger.info(
              `Updated file ${path.basename(file)} with ${changes.length} Percy changes`,
            );
          } catch (writeError) {
            logger.info(
              `Failed to write to file ${path.basename(file)}: ${writeError}`,
            );
            steps.push({
              type: "error",
              title: `❌ Failed to update ${path.basename(file)}`,
              content: `Error writing to file: ${writeError}`,
              isError: true,
            });
          }
        } else {
          logger.info(
            `No valid line changes found for file ${path.basename(file)}`,
          );
          steps.push({
            type: "error",
            title: `❌ Invalid response for ${path.basename(file)}`,
            content: `LLM response did not contain proper line change markers. Response: ${responseText.substring(0, 200)}...`,
            isError: true,
          });
        }
      } catch {
        return steps;
      }
    }
  } catch (error) {
    steps.push({
      type: "error",
      title: "Error Processing Test Files",
      content: `Failed to process test files: ${error}`,
      isError: true,
    });
  }

  return steps;
}

export async function runPercyWithBrowserstackSDK(
  input: RunTestsOnBrowserStackInput,
  config: BrowserStackConfig,
  testPath?: string,
  mcpServer?: any,
): Promise<RunTestsInstructionResult> {
  const steps: RunTestsStep[] = [];
  const authString = getBrowserStackAuth(config);
  const [username, accessKey] = authString.split(":");

  // Check if Percy is supported for this configuration
  const percyResult = getPercyInstructions(
    input.detectedLanguage as SDKSupportedLanguage,
    input.detectedBrowserAutomationFramework as SDKSupportedBrowserAutomationFramework,
    input.detectedTestingFramework as SDKSupportedTestingFramework,
  );

  if (!percyResult) {
    // Percy not supported for this configuration
    return {
      steps: [
        {
          type: "error",
          title: "Percy Not Supported",
          content: `Percy is not supported for this ${input.detectedBrowserAutomationFramework} framework configuration. Please use BrowserStack SDK only mode or try a different framework combination.`,
          isError: true,
        },
      ],
      requiresPercy: true,
      shouldSkipFormatting: true,
      missingDependencies: [],
    };
  }

  // Handle frameworks with unique setup instructions that don't use browserstack.yml
  if (
    input.detectedBrowserAutomationFramework === "cypress" ||
    input.detectedTestingFramework === "webdriverio"
  ) {
    const frameworkInstructions = getInstructionsForProjectConfiguration(
      input.detectedBrowserAutomationFramework as SDKSupportedBrowserAutomationFramework,
      input.detectedTestingFramework as SDKSupportedTestingFramework,
      input.detectedLanguage as SDKSupportedLanguage,
      username,
      accessKey,
    );

    if (frameworkInstructions && frameworkInstructions.setup) {
      steps.push({
        type: "instruction",
        title: "Framework-Specific Setup",
        content: frameworkInstructions.setup,
      });
    }

    steps.push({
      type: "instruction",
      title: "Percy Setup (BrowserStack SDK + Percy)",
      content: formatPercyInstructions(percyResult),
    });

    // Add test file sampling if testPath and mcpServer are provided
    logger.info(
      `Detected framework ${input.detectedBrowserAutomationFramework} with Percy support`,
    );
    logger.info(`Test Path: ${testPath}`);

    if (testPath && mcpServer) {
      logger.info(`Sampling test files in path: ${testPath}`);
      const samplingSteps = await findAndSampleTestFiles(testPath, mcpServer);
      steps.push(...samplingSteps);
    }

    if (frameworkInstructions && frameworkInstructions.run) {
      steps.push({
        type: "instruction",
        title: "Run the tests",
        content: frameworkInstructions.run,
      });
    }

    return {
      steps,
      requiresPercy: true,
      missingDependencies: [],
    };
  }

  // Default flow using browserstack.yml with Percy
  const sdkSetupCommand = getSDKPrefixCommand(
    input.detectedLanguage as SDKSupportedLanguage,
    input.detectedTestingFramework as SDKSupportedTestingFramework,
    username,
    accessKey,
  );

  if (sdkSetupCommand) {
    steps.push({
      type: "instruction",
      title: "Install BrowserStack SDK",
      content: sdkSetupCommand,
    });
  }

  const ymlInstructions = generateBrowserStackYMLInstructions(
    input.desiredPlatforms as string[],
    true,
    input.projectName,
  );

  if (ymlInstructions) {
    steps.push({
      type: "instruction",
      title: "Configure browserstack.yml",
      content: ymlInstructions,
    });
  }

  const frameworkInstructions = getInstructionsForProjectConfiguration(
    input.detectedBrowserAutomationFramework as SDKSupportedBrowserAutomationFramework,
    input.detectedTestingFramework as SDKSupportedTestingFramework,
    input.detectedLanguage as SDKSupportedLanguage,
    username,
    accessKey,
  );

  if (frameworkInstructions && frameworkInstructions.setup) {
    steps.push({
      type: "instruction",
      title: "Framework-Specific Setup",
      content: frameworkInstructions.setup,
    });
  }

  steps.push({
    type: "instruction",
    title: "Percy Setup (BrowserStack SDK + Percy)",
    content: formatPercyInstructions(percyResult),
  });

  // Add test file sampling if testPath and mcpServer are provided
  if (testPath && mcpServer) {
    const samplingSteps = await findAndSampleTestFiles(testPath, mcpServer);
    steps.push(...samplingSteps);
  }

  if (frameworkInstructions && frameworkInstructions.run) {
    steps.push({
      type: "instruction",
      title: "Run the tests",
      content: frameworkInstructions.run,
    });
  }

  return {
    steps,
    requiresPercy: true,
    missingDependencies: [],
  };
}
