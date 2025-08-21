// Utility to get the language-dependent prefix command for BrowserStack App Automate SDK setup
import { AppSDKSupportedLanguage } from "./types.js";

// Framework mapping for Java Maven archetype generation for App Automate
const JAVA_APP_FRAMEWORK_MAP: Record<string, string> = {
  testng: "browserstack-sdk-archetype-integrate",
  junit5: "browserstack-sdk-archetype-integrate",
  selenide: "selenide-archetype-integrate",
  jbehave: "browserstack-sdk-archetype-integrate",
  "cucumber-testng": "browserstack-sdk-archetype-integrate",
  "cucumber-junit4": "browserstack-sdk-archetype-integrate",
  "cucumber-junit5": "browserstack-sdk-archetype-integrate",
};

// Common Gradle setup instructions for App Automate (platform-independent)
const GRADLE_APP_SETUP_INSTRUCTIONS = `
**For Gradle setup:**
1. Add browserstack-java-sdk to dependencies:
   compileOnly 'com.browserstack:browserstack-java-sdk:latest.release'

2. Add browserstackSDK path variable:
   def browserstackSDKArtifact = configurations.compileClasspath.resolvedConfiguration.resolvedArtifacts.find { it.name == 'browserstack-java-sdk' }

3. Add javaagent to gradle tasks:
   jvmArgs "-javaagent:\${browserstackSDKArtifact.file}"
`;

export function getAppSDKPrefixCommand(
  language: AppSDKSupportedLanguage,
  framework: string,
  username: string,
  accessKey: string,
  appPath?: string,
): string {
  switch (language) {
    case "csharp": {
      const isWindows = process.platform === "win32";
      const isMac = process.platform === "darwin";
      const isAppleSilicon = isMac && process.arch === "arm64";

      const platformLabel = isWindows ? "Windows" : isMac ? "macOS" : "Linux";
      const envSetupCommands = isWindows
        ? `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``
        : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``;

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

      const appleSiliconNote = isAppleSilicon
        ? `

---STEP---
[Only for Macs with Apple silicon] Install dotnet x64 on MacOS

If you are using a Mac computer with Apple silicon chip (M1 or M2) architecture, use the given command:

\`\`\`bash
cd #(project folder Android or iOS)
dotnet browserstack-sdk setup-dotnet --dotnet-path "<path>" --dotnet-version "<version>"
\`\`\`

- \`<path>\` - Mention the absolute path to the directory where you want to save dotnet x64
- \`<version>\` - Mention the dotnet version which you want to use to run tests

This command performs the following functions:
- Installs dotnet x64
- Installs the required version of dotnet x64 at an appropriate path
- Sets alias for the dotnet installation location on confirmation (enter y option)`
        : "";

      return `---STEP---
Set BrowserStack credentials as environment variables:

**${platformLabel}:**
${envSetupCommands}

---STEP---
Install BrowserStack SDK

Run the following command to install the BrowserStack SDK and create a browserstack.yml file in the root directory of your project:

**${platformLabel}:**
${installCommands}${appleSiliconNote}`;
    }

    case "java": {
      const mavenFramework = getJavaAppFrameworkForMaven(framework);
      const isWindows = process.platform === "win32";

      const frameworkParam = `-DBROWSERSTACK_FRAMEWORK="${framework}"`;
      const appParam = appPath ? `-DBROWSERSTACK_APP="${appPath}"` : "";

      const mavenCommand = isWindows
        ? `mvn archetype:generate -B -DarchetypeGroupId="com.browserstack" -DarchetypeArtifactId="${mavenFramework}" -DarchetypeVersion="1.0" -DgroupId="com.browserstack" -DartifactId="junit-archetype-integrate" -Dversion="1.0" -DBROWSERSTACK_USERNAME="${username}" -DBROWSERSTACK_ACCESS_KEY="${accessKey}" ${frameworkParam} ${appParam}`.trim()
        : `mvn archetype:generate -B -DarchetypeGroupId=com.browserstack \\
-DarchetypeArtifactId=${mavenFramework} -DarchetypeVersion=1.0 \\
-DgroupId=com.browserstack -DartifactId=junit-archetype-integrate -Dversion=1.0 \\
-DBROWSERSTACK_USERNAME="${username}" \\
-DBROWSERSTACK_ACCESS_KEY="${accessKey}" \\
${frameworkParam} ${
            appParam
              ? `\\
${appParam}`
              : ""
          }`.trim();

      const platformLabel = isWindows ? "Windows" : "macOS/Linux";

      return `---STEP---
Set BrowserStack credentials as environment variables:

**${platformLabel}:**
${
  isWindows
    ? `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``
    : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``
}

---STEP---
Install BrowserStack SDK using Maven Archetype for App Automate

**Maven command for ${framework} (${platformLabel}):**
\`\`\`bash
${mavenCommand}
\`\`\`

Alternative setup for Gradle users:
${GRADLE_APP_SETUP_INSTRUCTIONS}`;
    }

    case "nodejs": {
      if (framework === "webdriverio") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\`

---STEP---
Install BrowserStack WDIO service:

\`\`\`bash
npm install @wdio/browserstack-service --save-dev
\`\`\`

---STEP---
Update your WebdriverIO config file (e.g., \`wdio.conf.js\`) to add the BrowserStack service and capabilities:

\`\`\`js
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
\`\`\`
`;
      }
      if (framework === "nightwatch") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\`

---STEP---
Install Nightwatch and BrowserStack integration:

\`\`\`bash
npm install nightwatch nightwatch-browserstack --save-dev
\`\`\`

---STEP---
Update your Nightwatch config file (e.g., \`nightwatch.conf.js\`) to add the BrowserStack settings and capabilities:

\`\`\`js

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
`;
      }
      if (framework === "jest") {
        return `---STEP---
        Set your BrowserStack credentials as environment variables:

        \`\`\`bash
        export BROWSERSTACK_USERNAME=${username}
        export BROWSERSTACK_ACCESS_KEY=${accessKey}
        \`\`\`

        ---STEP---
        Install Jest and BrowserStack SDK:

        \`\`\`bash
        npm install --save-dev jest @browserstack/sdk
        \`\`\`
        `;
      }
      if (framework === "mocha") {
        return `---STEP---
        Set your BrowserStack credentials as environment variables:

        \`\`\`bash
        export BROWSERSTACK_USERNAME=${username}
        export BROWSERSTACK_ACCESS_KEY=${accessKey}
        \`\`\`

        ---STEP---
        Install Mocha and BrowserStack SDK:

        \`\`\`bash
        npm install --save-dev mocha @browserstack/sdk
        \`\`\`

        ---STEP---
        Create a \`browserstack.yml\` file at the root of your project with the following content:

        \`\`\`yaml
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
        \`\`\`
        `;
      }
      if (framework === "cucumber-js") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

\`\`\`bash
export BROWSERSTACK_USERNAME=${username}
export BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\`  
`;
      }
      return "";
    }
    case "python": {
      const isWindows = process.platform === "win32";
      const platformLabel = isWindows ? "Windows" : "macOS/Linux";
      if (framework === "robot") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

**${platformLabel}:**
${
  isWindows
    ? `\`\`\`cmd
setx BROWSERSTACK_USERNAME "${username}"
setx BROWSERSTACK_ACCESS_KEY "${accessKey}"
\`\`\``
    : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``
}

---STEP---
Install BrowserStack Robot SDK:

\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\`

---STEP---
Set up BrowserStack SDK:

\`\`\`bash
browserstack-sdk setup --username "${username}" --key "${accessKey}"
\`\`\`
`;
      }
      if (framework === "pytest") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

**${platformLabel}:**
${
  isWindows
    ? `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``
    : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``
}

---STEP---
Install BrowserStack Python SDK:

\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\`

---STEP---
Set up BrowserStack SDK:

\`\`\`bash
browserstack-sdk setup --username "${username}" --key "${accessKey}"
\`\`\`
`;
      }
      if (framework === "behave") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

**${platformLabel}:**
${
  isWindows
    ? `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``
    : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``
}

---STEP---
Install BrowserStack Python SDK:

\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\`

---STEP---
Set up BrowserStack SDK:

\`\`\`bash
browserstack-sdk setup --username "${username}" --key "${accessKey}"
\`\`\`
`;
      }
      if (framework === "lettuce") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

**${platformLabel}:**
${
  isWindows
    ? `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``
    : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``
}

---STEP---
Configure Appium's desired capabilities in config.json:

**Android example:**
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
\`\`\`

---STEP---
Initialize remote WebDriver in terrain.py:

\`\`\`python
# Initialize the remote Webdriver using BrowserStack remote URL
# and desired capabilities defined above
context.browser = webdriver.Remote(
    desired_capabilities=desired_capabilities,
    command_executor="https://hub-cloud.browserstack.com/wd/hub"
)
\`\`\``;
      }
      return "";
    }
    case "ruby": {
      const isWindows = process.platform === "win32";
      const platformLabel = isWindows ? "Windows" : "macOS/Linux";
      
      if (framework === "rspec" || framework === "cucumber-ruby") {
        return `---STEP---
Set your BrowserStack credentials as environment variables:

**${platformLabel}:**
${
  isWindows
    ? `\`\`\`cmd
set BROWSERSTACK_USERNAME=${username}
set BROWSERSTACK_ACCESS_KEY=${accessKey}
\`\`\``
    : `\`\`\`bash
export BROWSERSTACK_USERNAME="${username}"
export BROWSERSTACK_ACCESS_KEY="${accessKey}"
\`\`\``
}

---STEP---
Install required Ruby gems:

\`\`\`bash
# Install Bundler if not already installed
gem install bundler

# Install Appium Ruby client library
gem install appium_lib

# For Cucumber projects, also install cucumber
${framework === "cucumber-ruby" ? "gem install cucumber" : ""}

# For RSpec projects, also install rspec
${framework === "rspec" ? "gem install rspec" : ""}
\`\`\`

---STEP---
Create a Gemfile for dependency management:

\`\`\`ruby
# Gemfile
source 'https://rubygems.org'

gem 'appium_lib'
${framework === "cucumber-ruby" ? "gem 'cucumber'" : ""}
${framework === "rspec" ? "gem 'rspec'" : ""}
\`\`\`

Then run:
\`\`\`bash
bundle install
\`\`\`
`;
  }
      return "";
    }
    default:
      return "";
  }
}

export function getJavaAppFrameworkForMaven(framework: string): string {
  return JAVA_APP_FRAMEWORK_MAP[framework] || framework;
}
