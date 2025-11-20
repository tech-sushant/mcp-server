import { apiClient } from "../../lib/apiClient.js";
import { getBrowserStackAuth } from "../../lib/get-auth.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { formatAxiosError } from "../../lib/error.js";
import { BrowserStackConfig } from "../../lib/types.js";
import { getTMBaseURL } from "../../lib/tm-base-url.js";
import { projectIdentifierToId } from "./TCG-utils/api.js";

interface TestCaseStep {
  step: string;
  result: string;
}

interface IssueTracker {
  name: string;
  host: string;
}

/**
 * Schema for updating a test case with partial fields.
 */
export const UpdateTestCaseSchema = z.object({
  project_identifier: z
    .string()
    .describe("Identifier of the project (Starts with 'PR-')"),
  test_case_identifier: z
    .string()
    .describe("Test case identifier (e.g., TC-123)"),
  test_case: z.object({
    name: z.string().optional().describe("Updated name of the test case"),
    description: z
      .string()
      .optional()
      .describe("Updated brief description of the test case"),
    owner: z
      .string()
      .email()
      .optional()
      .describe("Updated email of the test case owner"),
    preconditions: z
      .string()
      .optional()
      .describe("Updated preconditions (HTML allowed)"),
    test_case_steps: z
      .array(
        z.object({
          step: z.string().describe("Action to perform in this step"),
          result: z.string().describe("Expected result of this step"),
        }),
      )
      .optional()
      .describe("Updated list of steps and expected results"),
    issues: z
      .array(z.string())
      .optional()
      .describe(
        "Updated list of linked Jira, Asana or Azure issues ID's. This should be strictly in array format not the string of json.",
      ),
    issue_tracker: z
      .object({
        name: z
          .string()
          .describe(
            "Issue tracker name. For example, use jira for Jira, azure for Azure DevOps, or asana for Asana.",
          ),
        host: z.string().url().describe("Base URL of the issue tracker"),
      })
      .optional(),
    tags: z
      .array(z.string())
      .optional()
      .describe(
        "Updated tags to attach to the test case. This should be strictly in array format not the string of json",
      ),
    custom_fields: z
      .record(z.string(), z.string())
      .optional()
      .describe("Updated map of custom field names to values"),
    automation_status: z
      .string()
      .optional()
      .describe(
        "Updated automation status of the test case. Common values include 'not_automated', 'automated', 'automation_not_required'.",
      ),
  }),
});

type UpdateTestCaseArgs = z.infer<typeof UpdateTestCaseSchema>;

/**
 * Sanitizes the update arguments by removing null values and incomplete objects.
 */
export function sanitizeUpdateArgs(args: UpdateTestCaseArgs) {
  const cleaned = { ...args };
  const cleanedTestCase = { ...cleaned.test_case };

  if (cleanedTestCase.description === null) delete cleanedTestCase.description;
  if (cleanedTestCase.owner === null) delete cleanedTestCase.owner;
  if (cleanedTestCase.preconditions === null)
    delete cleanedTestCase.preconditions;
  if (cleanedTestCase.automation_status === null)
    delete cleanedTestCase.automation_status;

  if (cleanedTestCase.issue_tracker) {
    if (
      cleanedTestCase.issue_tracker.name === undefined ||
      cleanedTestCase.issue_tracker.host === undefined
    ) {
      delete cleanedTestCase.issue_tracker;
    }
  }

  return {
    ...cleaned,
    test_case: cleanedTestCase,
  };
}

/**
 * Partially updates an existing test case.
 */
export async function updateTestCase(
  args: UpdateTestCaseArgs,
  config: BrowserStackConfig,
): Promise<CallToolResult> {
  try {
    const sanitizedArgs = sanitizeUpdateArgs(args);
    const body = { test_case: sanitizedArgs.test_case };
    const tmBaseUrl = await getTMBaseURL(config);
    const url = `${tmBaseUrl}/api/v2/projects/${encodeURIComponent(
      args.project_identifier,
    )}/test-cases/${encodeURIComponent(args.test_case_identifier)}/update`;

    const authString = getBrowserStackAuth(config);
    const [username, password] = authString.split(":");

    const resp = await apiClient.patch({
      url,
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body,
    });

    const data = resp.data;
    if (!data.success) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to update test case: ${JSON.stringify(data)}`,
            isError: true,
          },
        ],
        isError: true,
      };
    }

    const tc = data.test_case || data;
    const projectId = await projectIdentifierToId(
      args.project_identifier,
      config,
    );

    return {
      content: [
        {
          type: "text",
          text: `Test case successfully updated:
            - Identifier: ${tc.identifier || args.test_case_identifier}
            - Title: ${tc.title || tc.name || "N/A"}

          You can view it here: ${tmBaseUrl}/projects/${projectId}/folder/search?q=${tc.identifier || args.test_case_identifier}`,
        },
        { type: "text", text: JSON.stringify(tc, null, 2) },
      ],
    };
  } catch (err) {
    return formatAxiosError(err, "Failed to update test case");
  }
}

