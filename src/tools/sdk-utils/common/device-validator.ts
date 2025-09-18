import {
  getDevicesAndBrowsers,
  BrowserStackProducts,
} from "../../../lib/device-cache.js";
import { resolveVersion } from "../../../lib/version-resolver.js";
import { customFuzzySearch } from "../../../lib/fuzzy.js";
import { SDKSupportedBrowserAutomationFrameworkEnum } from "./types.js";

export interface ValidatedEnvironment {
  platform: string;
  osVersion: string;
  browser?: string;
  browserVersion?: string;
  deviceName?: string;
  notes?: string;
}

// Centralized defaults
const DEFAULTS = {
  windows: { browser: "chrome" },
  macos: { browser: "safari" },
  android: { device: "Samsung Galaxy S24", browser: "chrome" },
  ios: { device: "iPhone 15", browser: "safari" },
} as const;

/**
 * Validates device tuples against real BrowserStack device data
 * This prevents hallucination by checking against actual available devices
 * Throws errors directly if validation fails
 */
export async function validateDevices(
  devices: Array<Array<string>>,
  framework?: string,
): Promise<ValidatedEnvironment[]> {
  const validatedEnvironments: ValidatedEnvironment[] = [];

  if (!devices || devices.length === 0) {
    // Default fallback - no validation needed
    return [
      {
        platform: "windows",
        osVersion: "latest",
        browser: "chrome",
        browserVersion: "latest",
      },
    ];
  }

  try {
    // Determine what data we need to fetch
    const needsDesktop = devices.some((env) =>
      ["windows", "mac", "macos"].includes((env[0] || "").toLowerCase()),
    );
    const needsMobile = devices.some((env) =>
      ["android", "ios"].includes((env[0] || "").toLowerCase()),
    );

    // Fetch only needed data
    let liveData: any = null;
    let appAutomateData: any = null;

    if (needsDesktop) {
      liveData = await getDevicesAndBrowsers(BrowserStackProducts.LIVE);
    }

    if (needsMobile) {
      // Use framework-specific endpoint for app automate data
      if (framework === SDKSupportedBrowserAutomationFrameworkEnum.playwright) {
        appAutomateData = await getDevicesAndBrowsers(
          BrowserStackProducts.PLAYWRIGHT_APP_AUTOMATE,
        );
      } else if (
        framework === SDKSupportedBrowserAutomationFrameworkEnum.selenium
      ) {
        appAutomateData = await getDevicesAndBrowsers(
          BrowserStackProducts.SELENIUM_APP_AUTOMATE,
        );
      } else {
        appAutomateData = await getDevicesAndBrowsers(
          BrowserStackProducts.APP_AUTOMATE,
        );
      }
    }

    for (const env of devices) {
      const discriminator = (env[0] || "").toLowerCase();
      let validatedEnv: ValidatedEnvironment;

      if (discriminator === "windows") {
        const allEntries = liveData.desktop.flatMap((plat: any) =>
          plat.browsers.map((b: any) => ({
            os: plat.os,
            os_version: plat.os_version,
            browser: b.browser,
            browser_version: b.browser_version,
          })),
        );
        validatedEnv = await validateDesktopEnvironment(
          env,
          allEntries,
          "windows",
          DEFAULTS.windows.browser,
        );
      } else if (discriminator === "mac" || discriminator === "macos") {
        const allEntries = liveData.desktop.flatMap((plat: any) =>
          plat.browsers.map((b: any) => ({
            os: plat.os,
            os_version: plat.os_version,
            browser: b.browser,
            browser_version: b.browser_version,
          })),
        );
        validatedEnv = await validateDesktopEnvironment(
          env,
          allEntries,
          "macos",
          DEFAULTS.macos.browser,
        );
      } else if (discriminator === "android") {
        const allEntries = appAutomateData.mobile.flatMap((grp: any) =>
          grp.devices.map((d: any) => ({
            os: grp.os,
            os_version: d.os_version,
            display_name: d.display_name,
            browsers: d.browsers || [
              { browser: d.browser, display_name: d.browser },
            ],
          })),
        );
        validatedEnv = await validateMobileEnvironment(
          env,
          allEntries,
          "android",
          DEFAULTS.android.device,
          DEFAULTS.android.browser,
        );
      } else if (discriminator === "ios") {
        const allEntries = appAutomateData.mobile.flatMap((grp: any) =>
          grp.devices.map((d: any) => ({
            os: grp.os,
            os_version: d.os_version,
            display_name: d.display_name,
            browsers: d.browsers || [
              { browser: d.browser, display_name: d.browser },
            ],
          })),
        );
        validatedEnv = await validateMobileEnvironment(
          env,
          allEntries,
          "ios",
          DEFAULTS.ios.device,
          DEFAULTS.ios.browser,
        );
      } else {
        throw new Error(`Unsupported platform: ${discriminator}`);
      }

      validatedEnvironments.push(validatedEnv);
    }
  } catch (error) {
    throw new Error(
      `Failed to fetch device data: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return validatedEnvironments;
}

/**
 * Validates mobile device strings for App Automate against real BrowserStack device data
 * Device strings should be in format: "Device Name-OS Version" (e.g., "Samsung Galaxy S20-10.0")
 * This prevents hallucination by checking against actual available devices
 * Throws errors directly if validation fails
 */
export async function validateAppAutomateDevices(
  deviceStrings: string[],
): Promise<ValidatedEnvironment[]> {
  const validatedDevices: ValidatedEnvironment[] = [];

  if (!deviceStrings || deviceStrings.length === 0) {
    // Default fallback - no validation needed
    return [
      {
        platform: "android",
        osVersion: "latest",
        deviceName: "Samsung Galaxy S24",
      },
    ];
  }

  try {
    // Fetch app automate device data
    const appAutomateData = await getDevicesAndBrowsers(
      BrowserStackProducts.APP_AUTOMATE,
    );

    for (const deviceString of deviceStrings) {
      // Parse device string in format "Device Name-OS Version"
      const parts = deviceString.split("-");
      if (parts.length < 2) {
        throw new Error(
          `Invalid device format: "${deviceString}". Expected format: "Device Name-OS Version" (e.g., "Samsung Galaxy S20-10.0")`,
        );
      }

      const deviceName = parts.slice(0, -1).join("-"); // Handle device names with hyphens
      const osVersion = parts[parts.length - 1];

      // Find matching device in the data
      let validatedDevice: ValidatedEnvironment | null = null;

      for (const platformGroup of appAutomateData.mobile) {
        const platformDevices = platformGroup.devices;

        // Find exact device name match (case-insensitive)
        const exactMatch = platformDevices.find(
          (d: any) => d.display_name.toLowerCase() === deviceName.toLowerCase(),
        );

        if (exactMatch) {
          // Check if the OS version is available for this device
          const deviceVersions = platformDevices
            .filter((d: any) => d.display_name === exactMatch.display_name)
            .map((d: any) => d.os_version);

          const validatedOSVersion = resolveVersion(osVersion, deviceVersions);

          if (!deviceVersions.includes(validatedOSVersion)) {
            throw new Error(
              `OS version "${osVersion}" not available for device "${deviceName}". Available versions: ${deviceVersions.join(", ")}`,
            );
          }

          validatedDevice = {
            platform: platformGroup.os,
            osVersion: validatedOSVersion,
            deviceName: exactMatch.display_name,
          };
          break;
        }
      }

      if (!validatedDevice) {
        // If no exact match found, suggest similar devices
        const allDevices = appAutomateData.mobile.flatMap((grp: any) =>
          grp.devices.map((d: any) => ({
            ...d,
            platform: grp.os,
          })),
        );

        const deviceMatches = customFuzzySearch(
          allDevices,
          ["display_name"],
          deviceName,
          5,
        );

        const suggestions = deviceMatches
          .map((m) => `${m.display_name}`)
          .join(", ");

        throw new Error(
          `Device "${deviceName}" not found.\nAvailable similar devices: ${suggestions}\nPlease use the exact device name with format: "Device Name-OS Version"`,
        );
      }

      validatedDevices.push(validatedDevice);
    }
  } catch (error) {
    throw new Error(
      `Failed to validate devices: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return validatedDevices;
}

// Unified desktop validation helper
async function validateDesktopEnvironment(
  env: string[],
  entries: any[],
  platform: "windows" | "macos",
  defaultBrowser: string,
): Promise<ValidatedEnvironment> {
  const [, osVersion, browser, browserVersion] = env;

  const platformEntries = entries.filter((e) =>
    platform === "windows" ? e.os === "Windows" : e.os === "OS X",
  );

  if (platformEntries.length === 0) {
    throw new Error(`No ${platform} devices available`);
  }

  const availableOSVersions = [
    ...new Set(platformEntries.map((e) => e.os_version)),
  ] as string[];

  const validatedOSVersion =
    platform === "macos"
      ? validateMacOSVersion(osVersion || "latest", availableOSVersions)
      : resolveVersion(osVersion || "latest", availableOSVersions);

  const osFiltered = platformEntries.filter(
    (e) => e.os_version === validatedOSVersion,
  );

  const availableBrowsers = [
    ...new Set(osFiltered.map((e) => e.browser)),
  ] as string[];
  const validatedBrowser = validateBrowser(
    browser || defaultBrowser,
    availableBrowsers,
  );

  const browserFiltered = osFiltered.filter(
    (e) => e.browser === validatedBrowser,
  );

  const availableBrowserVersions = [
    ...new Set(browserFiltered.map((e) => e.browser_version)),
  ] as string[];
  const validatedBrowserVersion = resolveVersion(
    browserVersion || "latest",
    availableBrowserVersions,
  );

  return {
    platform,
    osVersion: validatedOSVersion,
    browser: validatedBrowser,
    browserVersion: validatedBrowserVersion,
  };
}

// Unified mobile validation helper
async function validateMobileEnvironment(
  env: string[],
  entries: any[],
  platform: "android" | "ios",
  defaultDevice: string,
  defaultBrowser: string,
): Promise<ValidatedEnvironment> {
  const [, deviceName, osVersion, browser] = env;

  const platformEntries = entries.filter((e) => e.os === platform);
  if (platformEntries.length === 0) {
    throw new Error(`No ${platform} devices available`);
  }

  const deviceMatches = customFuzzySearch(
    platformEntries,
    ["display_name"],
    deviceName || defaultDevice,
    5,
  );
  if (deviceMatches.length === 0) {
    throw new Error(`No ${platform} devices matching "${deviceName}"`);
  }

  const exactMatch = deviceMatches.find(
    (m) => m.display_name.toLowerCase() === (deviceName || "").toLowerCase(),
  );
  if (!exactMatch) {
    const suggestions = deviceMatches.map((m) => m.display_name).join(", ");
    throw new Error(
      `Error Device "${deviceName}" not found for ${platform}.\nAvailable options: ${suggestions}\nPlease correct these issues and try again.`,
    );
  }

  const deviceFiltered = platformEntries.filter(
    (d) => d.display_name === exactMatch.display_name,
  );

  const availableOSVersions = [
    ...new Set(deviceFiltered.map((d) => d.os_version)),
  ] as string[];
  const validatedOSVersion = resolveVersion(
    osVersion || "latest",
    availableOSVersions,
  );

  // Filter by OS version
  const osFiltered = deviceFiltered.filter(
    (d) => d.os_version === validatedOSVersion,
  );

  // Validate browser if provided
  let validatedBrowser = browser || defaultBrowser;
  if (browser && osFiltered.length > 0) {
    const availableBrowsers = [
      ...new Set(
        osFiltered.flatMap((d) => d.browsers?.map((b: any) => b.browser) || []),
      ),
    ] as string[];

    if (availableBrowsers.length > 0) {
      validatedBrowser = validateBrowser(browser, availableBrowsers);
    } else {
      // If no browsers available for this device/OS combination, throw error
      throw new Error(
        `Browser "${browser}" not available for ${platform} device "${exactMatch.display_name}" on OS version "${validatedOSVersion}". No browsers found for this configuration.`,
      );
    }
  }

  return {
    platform,
    osVersion: validatedOSVersion,
    deviceName: exactMatch.display_name,
    browser: validatedBrowser,
  };
}

function validateBrowser(
  requestedBrowser: string,
  availableBrowsers: string[],
): string {
  const exactMatch = availableBrowsers.find(
    (b) => b.toLowerCase() === requestedBrowser.toLowerCase(),
  );
  if (exactMatch) {
    return exactMatch;
  }

  const fuzzyMatches = customFuzzySearch(
    availableBrowsers.map((b) => ({ browser: b })),
    ["browser"],
    requestedBrowser,
    1,
  );

  if (fuzzyMatches.length > 0) {
    return fuzzyMatches[0].browser;
  }

  throw new Error(
    `Browser "${requestedBrowser}" not found. Available options: ${availableBrowsers.join(", ")}`,
  );
}

function validateMacOSVersion(requested: string, available: string[]): string {
  if (requested === "latest") {
    return available[available.length - 1];
  } else if (requested === "oldest") {
    return available[0];
  } else {
    const fuzzy = customFuzzySearch(
      available.map((v) => ({ os_version: v })),
      ["os_version"],
      requested,
      1,
    );
    const matched = fuzzy.length ? fuzzy[0].os_version : requested;

    if (available.includes(matched)) {
      return matched;
    } else {
      throw new Error(
        `macOS version "${requested}" not found. Available options: ${available.join(", ")}`,
      );
    }
  }
}
