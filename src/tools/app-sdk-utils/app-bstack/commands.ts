// Command generation utilities for BrowserStack App SDK
import {
  AppSDKSupportedLanguage,
  JAVA_APP_FRAMEWORK_MAP,
  GRADLE_APP_SETUP_INSTRUCTIONS,
  PLATFORM_UTILS,
  formatEnvCommands,
  createStep,
  combineInstructions,
  formatMultiLineCommand,
} from "../common/index.js";

/**
 * Get the language-dependent prefix command for BrowserStack App Automate SDK setup
 */
export function getAppSDKPrefixCommand(
  language: AppSDKSupportedLanguage,
  framework: string,
  username: string,
  accessKey: string,
  appPath?: string,
): string {
  switch (language) {
    case "csharp":
      return getCSharpSDKCommand(username, accessKey);
    case "java":
      return getJavaSDKCommand(framework, username, accessKey, appPath);
    case "nodejs":
      return getNodejsSDKCommand(framework, username, accessKey);
    case "python":
      return getPythonSDKCommand(framework, username, accessKey);
    case "ruby":
      return getRubySDKCommand(framework, username, accessKey);
    default:
      return "";
  }
}

/**
 * Get framework mapping for Java Maven archetype
 */
export function getJavaAppFrameworkForMaven(framework: string): string {
  return JAVA_APP_FRAMEWORK_MAP[framework] || framework;
}

function getCSharpSDKCommand(username: string, accessKey: string): string {
  const { isWindows, isAppleSilicon, getPlatformLabel } = PLATFORM_UTILS;

  const envStep = createStep(
    "Set BrowserStack credentials as environment variables:",
    `**${getPlatformLabel()}:**
${formatEnvCommands(username, accessKey, isWindows)}`,
  );

  const installCommands = isWindows
    ? `\`\`\`cmd
dotnet add package BrowserStack.TestAdapter
dotnet build
dotnet browserstack-sdk setup --userName "${username}" --accessKey "${accessKey}"
\`\`\``
    : `\`\`\`bash
dotnet add package BrowserStack.TestAdapter
dotnet build
dotnet browserstack-sdk setup --userName "${username}" --accessKey "${accessKey}"
\`\`\``;

  const installStep = createStep(
    "Install BrowserStack SDK",
    `Run the following command to install the BrowserStack SDK and create a browserstack.yml file in the root directory of your project:

**${getPlatformLabel()}:**
${installCommands}`,
  );

  const appleSiliconNote = isAppleSilicon
    ? createStep(
        "[Only for Macs with Apple silicon] Install dotnet x64 on MacOS",
        `If you are using a Mac computer with Apple silicon chip (M1 or M2) architecture, use the given command:

\`\`\`bash
cd #(project folder Android or iOS)
dotnet browserstack-sdk setup-dotnet --dotnet-path "<path>" --dotnet-version "<version>"
\`\`\`

- \`<path>\` - Mention the absolute path to the directory where you want to save dotnet x64
- \`<version>\` - Mention the dotnet version which you want to use to run tests

This command performs the following functions:
- Installs dotnet x64
- Installs the required version of dotnet x64 at an appropriate path
- Sets alias for the dotnet installation location on confirmation (enter y option)`,
      )
    : "";

  return combineInstructions(envStep, installStep, appleSiliconNote);
}

function getJavaSDKCommand(
  framework: string,
  username: string,
  accessKey: string,
  appPath?: string,
): string {
  const { isWindows, getPlatformLabel } = PLATFORM_UTILS;
  const mavenFramework = getJavaAppFrameworkForMaven(framework);

  const frameworkParam = `-DBROWSERSTACK_FRAMEWORK="${framework}"`;
  const appParam = appPath ? `-DBROWSERSTACK_APP="${appPath}"` : "";

  const mavenCommand = isWindows
    ? `mvn archetype:generate -B -DarchetypeGroupId="com.browserstack" -DarchetypeArtifactId="${mavenFramework}" -DarchetypeVersion="1.0" -DgroupId="com.browserstack" -DartifactId="junit-archetype-integrate" -Dversion="1.0" -DBROWSERSTACK_USERNAME="${username}" -DBROWSERSTACK_ACCESS_KEY="${accessKey}" ${frameworkParam} ${appParam}`.trim()
    : formatMultiLineCommand(
        `mvn archetype:generate -B -DarchetypeGroupId=com.browserstack \\
-DarchetypeArtifactId=${mavenFramework} -DarchetypeVersion=1.0 \\
-DgroupId=com.browserstack -DartifactId=junit-archetype-integrate -Dversion=1.0 \\
-DBROWSERSTACK_USERNAME="${username}" \\
-DBROWSERSTACK_ACCESS_KEY="${accessKey}" \\
${frameworkParam} ${
          appParam
            ? `\\
${appParam}`
            : ""
        }`.trim(),
      );

  const envStep = createStep(
    "Set BrowserStack credentials as environment variables:",
    `**${getPlatformLabel()}:**
${formatEnvCommands(username, accessKey, isWindows)}`,
  );

  const mavenStep = createStep(
    "Install BrowserStack SDK using Maven Archetype for App Automate",
    `**Maven command for ${framework} (${getPlatformLabel()}):**
\`\`\`bash
${mavenCommand}
\`\`\`

Alternative setup for Gradle users:
${GRADLE_APP_SETUP_INSTRUCTIONS}`,
  );

  return combineInstructions(envStep, mavenStep);
}

function getNodejsSDKCommand(
  framework: string,
  username: string,
  accessKey: string,
): string {
  switch (framework) {
    case "webdriverio":
      return getWebDriverIOCommand(username, accessKey);
    case "nightwatch":
      return getNightwatchCommand(username, accessKey);
    case "jest":
      return getJestCommand(username, accessKey);
    case "mocha":
      return getMochaCommand(username, accessKey);
  case "cucumberJs":
      return getCucumberJSCommand(username, accessKey);
    default:
      return "";
  }
}

function getWebDriverIOCommand(username: string, accessKey: string): string {
  const envStep = createStep(
    "Set your BrowserStack credentials as environment variables:",
    `\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``,
  );

  const installStep = createStep(
    "Install BrowserStack WDIO service:",
    `\`\`\`bash
npm install @wdio/browserstack-service --save-dev
\`\`\``,
  );

  const configStep = createStep(
    "Update your WebdriverIO config file (e.g., \\`wdio.conf.js\\`) to add the BrowserStack service and capabilities:",
    `\`\`\`js
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || '${username}',
  key: process.env.BROWSERSTACK_ACCESS_KEY || '${accessKey}',
  hostname: 'hub.browserstack.com',
  services: [
    [
      'browserstack',
      {
        app: 'bs://sample.app',
        browserstackLocal: true,
        accessibility: false,
        testObservabilityOptions: {
          buildName: "bstack-demo",
          projectName: "BrowserStack Sample",
          buildTag: 'Any build tag goes here. For e.g. ["Tag1","Tag2"]'
        },
      },
    ]
  ],
  capabilities: [{
    'bstack:options': {
      deviceName: 'Samsung Galaxy S22 Ultra',
      platformVersion: '12.0',
      platformName: 'android',
    }
  }],
  commonCapabilities: {
    'bstack:options': {
      debug: true,
      networkLogs: true,
      percy: false,
      percyCaptureMode: 'auto'
    }
  },
  maxInstances: 10,
  // ...other config
};
\`\`\``,
  );

  return combineInstructions(envStep, installStep, configStep);
}

function getNightwatchCommand(username: string, accessKey: string): string {
  const envStep = createStep(
    "Set your BrowserStack credentials as environment variables:",
    `\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``,
  );

  const installStep = createStep(
    "Install Nightwatch and BrowserStack integration:",
    `\`\`\`bash
npm install nightwatch nightwatch-browserstack --save-dev
\`\`\``,
  );

  const configStep = createStep(
    "Update your Nightwatch config file (e.g., \\`nightwatch.conf.js\\`) to add the BrowserStack settings and capabilities:",
    `\`\`\`js

    test_settings:{
    ...
    browserstack: {
      selenium: {
        host: 'hub.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
       'bstack:options': {
          userName: '',
          accessKey: '',
          appiumVersion: '2.0.0'
        }
      },
      disable_error_log: false,
      webdriver: {
        timeout_options: {
          timeout: 60000,
          retry_attempts: 3
        },
        keep_alive: true,
        start_process: false
      }
    },
    'browserstack.android': {
      extends: 'browserstack',
      'desiredCapabilities': {
        browserName: null,
        'appium:options': {
          automationName: 'UiAutomator2',
          app: 'wikipedia-sample-app',// custom-id of the uploaded app
          appPackage: 'org.wikipedia',
          appActivity: 'org.wikipedia.main.MainActivity',
          appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity',
          platformVersion: '11.0',
          deviceName: 'Google Pixel 5'
        },
        appUploadUrl: 'https://raw.githubusercontent.com/priyansh3133/wikipedia/main/wikipedia.apk',// URL of the app to be uploaded to BrowserStack before starting the test
        // appUploadPath: '/path/to/app_name.apk' // if the app needs to be uploaded to BrowserStack from a local system
      }
    },
    'browserstack.ios': {
      extends: 'browserstack',
      'desiredCapabilities': {
        browserName: null,
        platformName: 'ios',
        'appium:options': {
          automationName: 'XCUITest',
          app: 'BStackSampleApp',
          platformVersion: '16',
          deviceName: 'iPhone 14'
        },
        appUploadUrl: 'https://www.browserstack.com/app-automate/sample-apps/ios/BStackSampleApp.ipa',
        // appUploadPath: '/path/to/app_name.ipa'
      }
    ...
  }
\`\`\``,
  );

  return combineInstructions(envStep, installStep, configStep);
}

function getJestCommand(username: string, accessKey: string): string {
  const envStep = createStep(
    "Set your BrowserStack credentials as environment variables:",
    `\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``,
  );

  const installStep = createStep(
    "Install Jest and BrowserStack SDK:",
    `\`\`\`bash
npm install --save-dev jest @browserstack/sdk
\`\`\``,
  );

  return combineInstructions(envStep, installStep);
}

function getMochaCommand(username: string, accessKey: string): string {
  const envStep = createStep(
    "Set your BrowserStack credentials as environment variables:",
    `\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``,
  );

  const installStep = createStep(
    "Install Mocha and BrowserStack SDK:",
    `\`\`\`bash
npm install --save-dev mocha @browserstack/sdk
\`\`\``,
  );

  const configStep = createStep(
    "Create a \\`browserstack.yml\\` file at the root of your project with the following content:",
    `\`\`\`yaml
userName: ${username}
accessKey: ${accessKey}
app: bs://sample.app
platforms:
  - platformName: android
    deviceName: Samsung Galaxy S22 Ultra
    platformVersion: '12.0'
  - platformName: android
    deviceName: Google Pixel 7 Pro
    platformVersion: '13.0'
  - platformName: android
    deviceName: OnePlus 9
    platformVersion: '11.0'
parallelsPerPlatform: 1
browserstackLocal: true
buildName: bstack-demo
projectName: BrowserStack Sample
CUSTOM_TAG_1: "You can set a custom Build Tag here"
debug: true
networkLogs: true
percy: false
percyCaptureMode: auto
\`\`\``,
  );

  return combineInstructions(envStep, installStep, configStep);
}

function getCucumberJSCommand(username: string, accessKey: string): string {
  return createStep(
    "Set your BrowserStack credentials as environment variables:",
    `\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``,
  );
}

function getPythonSDKCommand(
  framework: string,
  username: string,
  accessKey: string,
): string {
  const { isWindows, getPlatformLabel } = PLATFORM_UTILS;

  switch (framework) {
    case "robot":
    case "pytest":
    case "behave":
      return getPythonCommonSDKCommand(
        username,
        accessKey,
        isWindows,
        getPlatformLabel(),
      );
    case "lettuce":
      return getLettuceCommand(
        username,
        accessKey,
        isWindows,
        getPlatformLabel(),
      );
    default:
      return "";
  }
}

function getPythonCommonSDKCommand(
  username: string,
  accessKey: string,
  isWindows: boolean,
  platformLabel: string,
): string {
  const envStep = createStep(
    "Set your BrowserStack credentials as environment variables:",
    `**${platformLabel}:**
${formatEnvCommands(username, accessKey, isWindows)}`,
  );

  const installStep = createStep(
    "Install BrowserStack Python SDK:",
    `\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\``,
  );

  const setupStep = createStep(
    "Set up BrowserStack SDK:",
    `\`\`\`bash
browserstack-sdk setup --username "${username}" --key "${accessKey}"
\`\`\``,
  );

  return combineInstructions(envStep, installStep, setupStep);
}

function getLettuceCommand(
  username: string,
  accessKey: string,
  isWindows: boolean,
  platformLabel: string,
): string {
  const envStep = createStep(
    "Set your BrowserStack credentials as environment variables:",
    `**${platformLabel}:**
${formatEnvCommands(username, accessKey, isWindows)}`,
  );

  const configStep = createStep(
    "Configure Appium's desired capabilities in config.json:",
    `**Android example:**
\`\`\`json
{
    "capabilities": {
      "browserstack.user" : "${username}",
      "browserstack.key" : "${accessKey}",
      "project": "First Lettuce Android Project",
      "build": "Lettuce Android",
      "name": "first_test",
      "browserstack.debug": true,
      "app": "bs://<app-id>",
      "device": "Google Pixel 3",
      "os_version": "9.0"
    }
}
\`\`\``,
  );

  const initStep = createStep(
    "Initialize remote WebDriver in terrain.py:",
    `\`\`\`python
# Initialize the remote Webdriver using BrowserStack remote URL
# and desired capabilities defined above
context.browser = webdriver.Remote(
    desired_capabilities=desired_capabilities,
    command_executor="https://hub-cloud.browserstack.com/wd/hub"
)
\`\`\``,
  );

  return combineInstructions(envStep, configStep, initStep);
}

function getRubySDKCommand(
  framework: string,
  username: string,
  accessKey: string,
): string {
  const { isWindows, getPlatformLabel } = PLATFORM_UTILS;

  if (framework === "rspec" || framework === "cucumberRuby") {
    const envStep = createStep(
      "Set your BrowserStack credentials as environment variables:",
      `**${getPlatformLabel()}:**
${formatEnvCommands(username, accessKey, isWindows)}`,
    );

    const installStep = createStep(
      "Install required Ruby gems:",
      `\`\`\`bash
# Install Bundler if not already installed
gem install bundler

# Install Appium Ruby client library
gem install appium_lib

# For Cucumber projects, also install cucumber
${framework === "cucumberRuby" ? "gem install cucumber" : ""}

# For RSpec projects, also install rspec
${framework === "rspec" ? "gem install rspec" : ""}
\`\`\``,
    );

    const gemfileStep = createStep(
      "Create a Gemfile for dependency management:",
      `\`\`\`ruby
# Gemfile
source 'https://rubygems.org'

gem 'appium_lib'
${framework === "cucumberRuby" ? "gem 'cucumber'" : ""}
${framework === "rspec" ? "gem 'rspec'" : ""}
\`\`\`

Then run:
\`\`\`bash
bundle install
\`\`\``,
    );

    return combineInstructions(envStep, installStep, gemfileStep);
  }

  return "";
}
