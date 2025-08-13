import {
  AppSDKSupportedLanguage,
  AppSDKSupportedFramework,
  AppSDKSupportedTestingFramework,
} from "./types.js";

// App Automate specific device configurations
const APP_DEVICE_CONFIGS = {
  android: [
    { deviceName: "Samsung Galaxy S22 Ultra", platformVersion: "12.0" },
    { deviceName: "Google Pixel 7 Pro", platformVersion: "13.0" },
    { deviceName: "OnePlus 9", platformVersion: "11.0" },
  ],
  ios: [
    { deviceName: "iPhone 14", platformVersion: "16" },
    { deviceName: "iPhone 13", platformVersion: "15" },
    { deviceName: "iPad Air 4", platformVersion: "14" },
  ],
};

export function generateAppBrowserStackYMLInstructions(
  platforms: string[],
  username: string,
  accessKey: string,
  appPath: string = "bs://sample.app",
  framework: string = "testng",
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

  return `---STEP---
Update browserstack.yml file with App Automate configuration:

Create or update the browserstack.yml file in your project root with the following content:

\`\`\`yaml
userName: ${username}
accessKey: ${accessKey}
framework: ${framework}
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
- Adjust \`parallelsPerPlatform\` based on your subscription limits
`;
}

export function getAppInstructionsForProjectConfiguration(
  framework: AppSDKSupportedFramework,
  testingFramework: AppSDKSupportedTestingFramework,
  language: AppSDKSupportedLanguage,
): string {
  if (!framework || !testingFramework || !language) {
    return "";
  }
  switch (language) {
    case "java":
      return getJavaAppInstructions(testingFramework);
    default:
      return "";
  }
}

function getJavaAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  const baseString = `---STEP---
Run your App Automate test suite:

\`\`\`bash
mvn test
\`\`\``;

  if (testingFramework === "junit5") {
    return `${baseString}
**JUnit 5 Prerequisites:**
- An existing automated test suite
- JUnit 5 is installed
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
  } else if (testingFramework === "testng") {
    return `${baseString}
**TestNG Prerequisites:**
- An existing automated test suite
- TestNG is installed
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
  } else if (testingFramework === "selenide") {
    return `${baseString}
**Selenide Prerequisites:**
- An existing Appium-based automated test suite
- Selenide framework is installed
- Ensure you're using Java v8+ (Java v9+ required for Gradle)
- Maven is installed and configured in your system PATH
- Looking for a starter project? Get started with our Selenide sample project`;
  }
  return baseString;
}

// Utility function to format instructions with step numbers
export function formatAppInstructionsWithNumbers(instructions: string): string {
  const steps = instructions.split("---STEP---").filter((step) => step.trim());

  return steps
    .map((step, index) => `**Step ${index + 1}:**\n${step.trim()}`)
    .join("\n\n");
}
