import { apiClient } from "./apiClient.js";
import logger from "../logger.js";

const TM_BASE_URLS = [
  "https://test-management.browserstack.com",
  "https://test-management-eu.browserstack.com",
  "https://test-management-in.browserstack.com",
] as const;

let cachedBaseUrl: string | null = null;

export async function getTMBaseURL(): Promise<string> {
  if (cachedBaseUrl) {
    logger.debug(`Using cached TM base URL: ${cachedBaseUrl}`);
    return cachedBaseUrl;
  }

  logger.info("No cached TM base URL found, testing available URLs");

  for (const baseUrl of TM_BASE_URLS) {
    try {
      const res = await apiClient.get({
        url: `${baseUrl}/api/v2/projects/`,
        raise_error: false,
      });

      if (res.ok) {
        cachedBaseUrl = baseUrl;
        logger.info(`Selected TM base URL: ${baseUrl}`);
        return baseUrl;
      }
    } catch (err) {
      logger.debug(`Failed TM base URL: ${baseUrl} (${err})`);
    }
  }

  const fallback = TM_BASE_URLS[0];
  cachedBaseUrl = fallback;
  logger.warn(`All TM URLs failed. Using fallback: ${fallback}`);
  return fallback;
}

export function clearTMBaseURLCache(): void {
  cachedBaseUrl = null;
  logger.debug("Cleared TM base URL cache");
}
