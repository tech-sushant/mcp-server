/**
 * Utilities for generating BrowserStack configuration files.
 */
import { ValidatedEnvironment } from "../common/device-validator.js";

export function generateBrowserStackYMLInstructions(
  desiredPlatforms: string[],
  enablePercy: boolean = false,
  projectName: string,
) {
  let ymlContent = `
# ======================
# BrowserStack Reporting
# ======================
# A single name for your project to organize all your tests. This is required for Percy.
projectName: ${projectName}
# TODO: Replace these sample values with your actual project details
buildName: Sample-Build

# =======================================
# Platforms (Browsers / Devices to test)
# =======================================
# Platforms object contains all the browser / device combinations you want to test on.
# Generate this on the basis of the following platforms requested by the user:
# Requested platforms: ${desiredPlatforms}
platforms:
  - os: Windows
    osVersion: 11
    browserName: chrome
    browserVersion: latest
  
# =======================
# Parallels per Platform
# =======================
# The number of parallel threads to be used for each platform set.
# BrowserStack's SDK runner will select the best strategy based on the configured value
#
# Example 1 - If you have configured 3 platforms and set \`parallelsPerPlatform\` as 2, a total of 6 (2 * 3) parallel threads will be used on BrowserStack
#
# Example 2 - If you have configured 1 platform and set \`parallelsPerPlatform\` as 5, a total of 5 (1 * 5) parallel threads will be used on BrowserStack
parallelsPerPlatform: 1

# =================
# Local Testing
# =================
# Set to true to test local
browserstackLocal: true

# ===================
# Debugging features
# ===================
debug: true # Visual logs, text logs, etc.
testObservability: true # For Test Observability`;

  if (enablePercy) {
    ymlContent += `

# =====================
# Percy Visual Testing
# =====================
# Set percy to true to enable visual testing.
# Set percyCaptureMode to 'manual' to control when screenshots are taken.
percy: true
percyCaptureMode: manual`;
  }
  return `
---STEP---
Create a browserstack.yml file in the project root. The file should be in the following format:

\`\`\`yaml${ymlContent}
\`\`\`
\n`;
}

/**
 * Generate browserstack.yml content from validated device configurations
 */
export function generateBrowserStackYMLFromValidatedEnvironments(
  validatedEnvironments: ValidatedEnvironment[],
  enablePercy: boolean = false,
  projectName: string,
) {
  // Generate platforms array from validated environments
  const platforms = validatedEnvironments.map((env) => {
    if (env.platform === "windows" || env.platform === "macos") {
      // Desktop configuration
      return {
        os: env.platform === "windows" ? "Windows" : "OS X",
        osVersion: env.osVersion,
        browserName: env.browser,
        browserVersion: env.browserVersion || "latest",
      };
    } else {
      // Mobile configuration (android/ios)
      return {
        deviceName: env.deviceName,
        osVersion: env.osVersion,
        browserName: env.browser,
      };
    }
  });

  // Convert platforms to YAML format
  const platformsYAML = platforms
    .map((platform) => {
      if (platform.deviceName) {
        // Mobile platform
        return `  - deviceName: "${platform.deviceName}"
    osVersion: "${platform.osVersion}"
    browserName: ${platform.browserName}`;
      } else {
        // Desktop platform
        return `  - os: ${platform.os}
    osVersion: "${platform.osVersion}"
    browserName: ${platform.browserName}
    browserVersion: ${platform.browserVersion}`;
      }
    })
    .join("\n");

  let ymlContent = `
# ======================
# BrowserStack Reporting
# ======================
projectName: ${projectName}
buildName: ${projectName}-Build

# =======================================
# Platforms (Browsers / Devices to test)
# =======================================
# Auto-generated from validated device configurations
platforms:
${platformsYAML}

# =======================
# Parallels per Platform
# =======================
parallelsPerPlatform: 1

# =================
# Local Testing
# =================
browserstackLocal: true

# ===================
# Debugging features
# ===================
debug: true
testObservability: true`;

  if (enablePercy) {
    ymlContent += `

# =====================
# Percy Visual Testing
# =====================
percy: true
percyCaptureMode: manual`;
  }

  return `
---STEP---
Create a browserstack.yml file in the project root with your validated device configurations:

\`\`\`yaml${ymlContent}
\`\`\`
\n`;
}
