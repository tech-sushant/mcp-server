import { getTMBaseURL } from "../../../lib/tm-base-url.js";

export const TCG_TRIGGER_URL = async () =>
  `${await getTMBaseURL()}/api/v1/integration/tcg/test-generation/suggest-test-cases`;
export const TCG_POLL_URL = async () =>
  `${await getTMBaseURL()}/api/v1/integration/tcg/test-generation/test-cases-polling`;
export const FETCH_DETAILS_URL = async () =>
  `${await getTMBaseURL()}/api/v1/integration/tcg/test-generation/fetch-test-case-details`;
export const FORM_FIELDS_URL = async (projectId: string) =>
  `${await getTMBaseURL()}/api/v1/projects/${projectId}/form-fields-v2`;
export const BULK_CREATE_URL = async (projectId: string, folderId: string) =>
  `${await getTMBaseURL()}/api/v1/projects/${projectId}/folder/${folderId}/bulk-test-cases`;
