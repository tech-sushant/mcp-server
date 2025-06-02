export const DOMAINS = {
  API: process.env.API_DOMAIN || "https://api.browserstack.com",
  API_CLOUD:
    process.env.API_CLOUD_DOMAIN || "https://api-cloud.browserstack.com",
  TEST_MANAGEMENT:
    process.env.TEST_MGMT_DOMAIN || "https://test-management.browserstack.com",
  API_OBSERVABILITY:
    process.env.API_OBSERVABILITY_DOMAIN ||
    "https://api-observability.browserstack.com",
  LIVE: process.env.LIVE_DOMAIN || "https://live.browserstack.com",
  WWW: process.env.WWW_DOMAIN || "https://www.browserstack.com",
  APP_LIVE: process.env.APP_LIVE_DOMAIN || "https://app-live.browserstack.com",
  API_ACCESSIBILITY:
    process.env.API_ACCESSIBILITY_DOMAIN ||
    "https://api-accessibility.browserstack.com",
  SCANNER: process.env.SCANNER_DOMAIN || "https://scanner.browserstack.com",
} as const;
