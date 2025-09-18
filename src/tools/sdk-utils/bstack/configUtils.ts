import { ValidatedEnvironment } from "../common/device-validator.js";

export function generateBrowserStackYMLInstructions(
  config: {
    validatedEnvironments?: ValidatedEnvironment[];
    platforms?: string[];
    enablePercy?: boolean;
    projectName: string;
  }
): string {
  const enablePercy = config.enablePercy || false;
  const projectName = config.projectName;

  // Generate platform configurations using the utility function
  const platformConfigs = generatePlatformConfigs(config);

  // Determine build name and step title
  const buildName = config.validatedEnvironments && config.validatedEnvironments.length > 0
    ? `${projectName}-Build`
    : "Sample-Build";

  const stepTitle = config.validatedEnvironments && config.validatedEnvironments.length > 0
    ? "Create a browserstack.yml file in the project root with your validated device configurations:"
    : "Create a browserstack.yml file in the project root. The file should be in the following format:";

  let ymlContent = `
# ======================
# BrowserStack Reporting
# ======================
projectName: ${projectName}
buildName: ${buildName}

# =======================================
# Platforms (Browsers / Devices to test)
# =======================================`;

  if (config.validatedEnvironments && config.validatedEnvironments.length > 0) {
    ymlContent += `
# Auto-generated from validated device configurations
platforms:
${platformConfigs}`;
  } else {
    ymlContent += `
# Platforms object contains all the browser / device combinations you want to test on.
# Generate this on the basis of the following platforms requested by the user:
# Requested platforms: ${config.platforms || []}
platforms:
${platformConfigs}`;
  }

  ymlContent += `

# =======================
# Parallels per Platform
# =======================
# The number of parallel threads to be used for each platform set.
# BrowserStack's SDK runner will select the best strategy based on the configured value
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
${stepTitle}

\`\`\`yaml${ymlContent}
\`\`\`
\n`;
}

function generatePlatformConfigs(config: {
  validatedEnvironments?: ValidatedEnvironment[];
  platforms?: string[];
}): string {
  if (config.validatedEnvironments && config.validatedEnvironments.length > 0) {
    // Generate platforms array from validated environments
    const platforms = config.validatedEnvironments.map((env) => {
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
    return platforms
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
  } else if (config.platforms && config.platforms.length > 0) {
    // Fallback to default platforms configuration
    return `  - os: Windows
    osVersion: 11
    browserName: chrome
    browserVersion: latest`;
  }
  
  return "";
}
