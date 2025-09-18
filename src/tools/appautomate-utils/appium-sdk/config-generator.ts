// Configuration utilities for BrowserStack App SDK
import {
  APP_DEVICE_CONFIGS,
  AppSDKSupportedTestingFrameworkEnum,
  DEFAULT_APP_PATH,
  createStep,
} from "./index.js";
import { ValidatedEnvironment } from "../../sdk-utils/common/device-validator.js";

export function generateAppBrowserStackYMLInstructions(
  platforms: string[],
  username: string,
  accessKey: string,
  appPath: string = DEFAULT_APP_PATH,
  testingFramework: string,
): string {
  if (
    testingFramework === AppSDKSupportedTestingFrameworkEnum.nightwatch ||
    testingFramework === AppSDKSupportedTestingFrameworkEnum.webdriverio ||
    testingFramework === AppSDKSupportedTestingFrameworkEnum.cucumberRuby
  ) {
    return "";
  }

  // Generate platform and device configurations
  const platformConfigs = platforms
    .map((platform) => {
      const devices =
        APP_DEVICE_CONFIGS[platform as keyof typeof APP_DEVICE_CONFIGS];
      if (!devices) return "";

      return devices
        .map(
          (device) => `  - platformName: ${platform}
    deviceName: ${device.deviceName}
    platformVersion: "${device.platformVersion}"`,
        )
        .join("\n");
    })
    .filter(Boolean)
    .join("\n");

  // Construct YAML content
  const configContent = `\`\`\`yaml
userName: ${username}
accessKey: ${accessKey}
app: ${appPath}
platforms:
${platformConfigs}
parallelsPerPlatform: 1
browserstackLocal: true
buildName: bstack-demo
projectName: BrowserStack Sample
debug: true
networkLogs: true
percy: false
percyCaptureMode: auto
accessibility: false
\`\`\`

**Important notes:**
- Replace \`app: ${appPath}\` with the path to your actual app file (e.g., \`./SampleApp.apk\` for Android or \`./SampleApp.ipa\` for iOS)
- You can upload your app using BrowserStack's App Upload API or manually through the dashboard
- Set \`browserstackLocal: true\` if you need to test with local/staging servers
- Adjust \`parallelsPerPlatform\` based on your subscription limits`;

  // Return formatted step for instructions
  return createStep(
    "Update browserstack.yml file with App Automate configuration:",
    `Create or update the browserstack.yml file in your project root with the following content:

${configContent}`,
  );
}

/**
 * Generate App Automate browserstack.yml from validated device configurations
 */
export function generateAppAutomateYML(
  validatedEnvironments: ValidatedEnvironment[],
  username: string,
  accessKey: string,
  appPath: string = DEFAULT_APP_PATH,
  projectName: string,
): string {
  // Generate platform configurations from validated environments
  const platformConfigs = validatedEnvironments
    .filter((env) => env.platform === "android" || env.platform === "ios")
    .map((env) => {
      return `  - platformName: ${env.platform}
    deviceName: "${env.deviceName}"
    platformVersion: "${env.osVersion}"`;
    })
    .join("\n");

  // Construct YAML content with validated data
  const configContent = `\`\`\`yaml
userName: ${username}
accessKey: ${accessKey}
app: ${appPath}
platforms:
${platformConfigs}
parallelsPerPlatform: 1
browserstackLocal: true
buildName: ${projectName}-AppAutomate-Build
projectName: ${projectName}
debug: true
networkLogs: true
percy: false
percyCaptureMode: auto
accessibility: false
\`\`\`

**Important notes:**
- Replace \`app: ${appPath}\` with the path to your actual app file (e.g., \`./SampleApp.apk\` for Android or \`./SampleApp.ipa\` for iOS)
- You can upload your app using BrowserStack's App Upload API or manually through the dashboard
- Set \`browserstackLocal: true\` if you need to test with local/staging servers
- Adjust \`parallelsPerPlatform\` based on your subscription limits`;

  // Return formatted step for instructions
  return createStep(
    "Update browserstack.yml file with validated App Automate configuration:",
    `Create or update the browserstack.yml file in your project root with your validated device configurations:

${configContent}`,
  );
}
