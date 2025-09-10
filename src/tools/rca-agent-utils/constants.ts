import { z } from "zod";
import { TestStatus } from "./types.js";

export const FETCH_RCA_PARAMS = {
  testId: z
    .array(z.string())
    .max(3)
    .describe(
      "Array of test IDs to fetch RCA data for (maximum 3 IDs). If not provided, use the listTestIds tool get all failed testcases. If more than 3 IDs are provided, only the first 3 will be processed.",
    ),
};

export const GET_BUILD_ID_PARAMS = {
  projectName: z
    .string()
    .describe(
      "The Browserstack project name used while creation of test run. Check browserstack.yml or similar project configuration files. If found extract it and provide to user, IF not found or unsure, prompt the user for this value. Do not make assumptions",
    ),
  buildName: z
    .string()
    .describe(
      "The Browserstack build name used while creation of test run. Check browserstack.yml or similar project configuration files. If found extract it and provide to user, IF not found or unsure, prompt the user for this value. Do not make assumptions",
    ),
};

export const LIST_TEST_IDS_PARAMS = {
  buildId: z
    .string()
    .describe(
      "The Browserstack Build ID of the test run. If not known, use the getBuildId tool to fetch it using project and build name",
    ),
  status: z
    .nativeEnum(TestStatus)
    .describe(
      "Filter tests by status. If not provided, all tests are returned. Example for RCA usecase always use failed status",
    ),
};
