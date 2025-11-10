import { getTMBaseURL } from "../../../lib/tm-base-url.js";

export const getTCGTriggerURL = async (): Promise<string> => {
  const baseUrl = await getTMBaseURL();
  return `${baseUrl}/api/v1/integration/tcg/test-generation/suggest-test-cases`;
};

export const getTCGPollURL = async (): Promise<string> => {
  const baseUrl = await getTMBaseURL();
  return `${baseUrl}/api/v1/integration/tcg/test-generation/test-cases-polling`;
};

export const getFetchDetailsURL = async (): Promise<string> => {
  const baseUrl = await getTMBaseURL();
  return `${baseUrl}/api/v1/integration/tcg/test-generation/fetch-test-case-details`;
};

export const getFormFieldsURL = async (projectId: string): Promise<string> => {
  const baseUrl = await getTMBaseURL();
  return `${baseUrl}/api/v1/projects/${projectId}/form-fields-v2`;
};

export const getBulkCreateURL = async (
  projectId: string,
  folderId: string,
): Promise<string> => {
  const baseUrl = await getTMBaseURL();
  return `${baseUrl}/api/v1/projects/${projectId}/folder/${folderId}/bulk-test-cases`;
};
