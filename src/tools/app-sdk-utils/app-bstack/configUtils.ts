// Configuration utilities for BrowserStack App SDK
import {
  APP_DEVICE_CONFIGS,
  DEFAULT_APP_PATH,
  createStep,
} from "../common/index.js";

export function generateAppBrowserStackYMLInstructions(
  platforms: string[],
  username: string,
  accessKey: string,
  appPath: string = DEFAULT_APP_PATH,
  testingFramework?: string,
): string {
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

  const configContent = `\`\`\`yaml
userName: ${username}
accessKey: ${accessKey}
framework: ${testingFramework}
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

  return createStep(
    "Update browserstack.yml file with App Automate configuration:",
    `Create or update the browserstack.yml file in your project root with the following content:

${configContent}`,
  );
}

export function generateDeviceConfig(
  platform: "android" | "ios",
  customDevices?: Array<{ deviceName: string; platformVersion: string }>,
): string {
  const devices = customDevices || APP_DEVICE_CONFIGS[platform];

  return devices
    .map(
      (device) => `  - platformName: ${platform}
    deviceName: ${device.deviceName}
    platformVersion: "${device.platformVersion}"`,
    )
    .join("\n");
}

export function generateBrowserStackConfig(
  username: string,
  accessKey: string,
  options: {
    framework?: string;
    appPath?: string;
    platforms?: Array<{
      platformName: string;
      deviceName: string;
      platformVersion: string;
    }>;
    buildName?: string;
    projectName?: string;
    parallelsPerPlatform?: number;
    browserstackLocal?: boolean;
    debug?: boolean;
    networkLogs?: boolean;
    percy?: boolean;
    percyCaptureMode?: string;
    accessibility?: boolean;
  } = {},
) {
  const config = {
    userName: username,
    accessKey: accessKey,
    framework: options.framework,
    app: options.appPath || DEFAULT_APP_PATH,
    platforms: options.platforms || [
      ...APP_DEVICE_CONFIGS.android.map((device) => ({
        platformName: "android",
        deviceName: device.deviceName,
        platformVersion: device.platformVersion,
      })),
      ...APP_DEVICE_CONFIGS.ios.map((device) => ({
        platformName: "ios",
        deviceName: device.deviceName,
        platformVersion: device.platformVersion,
      })),
    ],
    parallelsPerPlatform: options.parallelsPerPlatform || 1,
    browserstackLocal: options.browserstackLocal ?? true,
    buildName: options.buildName || "bstack-demo",
    projectName: options.projectName || "BrowserStack Sample",
    debug: options.debug ?? true,
    networkLogs: options.networkLogs ?? true,
    percy: options.percy ?? false,
    percyCaptureMode: options.percyCaptureMode || "auto",
    accessibility: options.accessibility ?? false,
  };

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(config).filter(([, value]) => value !== undefined),
  );
}
