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

  const frameworkLine = testingFramework
    ? `framework: ${testingFramework}\n`
    : "";

  return `---STEP---
Update browserstack.yml file with App Automate configuration:

Create or update the browserstack.yml file in your project root with the following content:

\`\`\`yaml
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
    case "nodejs":
      return getNodejsAppInstructions(testingFramework);
    case "python":
      return getPythonAppInstructions(testingFramework);
    case "ruby":
      return getRubyAppInstructions(testingFramework);
    case "csharp":
      return getCSharpAppInstructions(testingFramework);
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
  } else if (testingFramework === "jbehave") {
    return `${baseString}
**JBehave Prerequisites:**
- An existing automated test suite
- JBehave is installed
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
  }
  return baseString;
}

function getCSharpAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  const isWindows = process.platform === "win32";
  const isMac = process.platform === "darwin";
  const isAppleSilicon = isMac && process.arch === "arm64";

  const platformLabel = isWindows
    ? "Windows"
    : isMac
      ? "macOS Intel"
      : "macOS Apple silicon";

  let runCommand = "";
  if (isWindows) {
    runCommand = `\`\`\`cmd
dotnet build
dotnet test --filter <EXPRESSION> [other_args]
\`\`\``;
  } else if (isAppleSilicon) {
    runCommand = `\`\`\`bash
dotnet build
dotnet test --filter <EXPRESSION> [other_args]
\`\`\`

**Did not set the alias?**
Use the absolute path to the dotnet installation to run your tests on Mac computers with Apple silicon chips:
\`\`\`bash
</absolute/path/to/location/of/dotnet/>/dotnet test
\`\`\``;
  } else {
    runCommand = `\`\`\`bash
dotnet build
dotnet test --filter <EXPRESSION> [other_args]
\`\`\``;
  }

  const baseString = `---STEP---
Run your C# test suite:

**${platformLabel}:**
${runCommand}

**Debug Guidelines:**
If you encounter the error: java.lang.IllegalArgumentException: Multiple entries with the same key,
__Resolution:__
- The app capability should only be set in one place: browserstack.yml.
- Remove or comment out any code or configuration in your test setup (e.g., step definitions, runners, or capabilities setup) that sets the app path directly.
`;

  if (testingFramework === "nunit") {
    return `${baseString}

**NUnit Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- BrowserStack does not support .NET version 9 and above
- Looking for a starter project? Get started with our NUnit sample project`;
  } else if (testingFramework === "mstest") {
    return `${baseString}

**MSTest Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- BrowserStack does not support .NET version 9 and above
- Looking for a starter project? Get started with our MSTest sample project`;
  } else if (testingFramework === "xunit") {
    return `${baseString}

**XUnit Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- BrowserStack does not support .NET version 9 and above
- Looking for a starter project? Get started with our XUnit sample project`;
  } else if (testingFramework === "specflow") {
    return `${baseString}

**⚠️ IMPORTANT: SpecFlow End of Life Notice**
BrowserStack no longer actively supports SpecFlow following its end of life (EOL) on December 31, 2024. Fixes or upgrades for SpecFlow are not planned.

**SpecFlow Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- BrowserStack does not support .NET version 9 and above
- The Mac commands work only with the NUnit runner. They do not work with the MSTest or xUnit runners
- Looking for a starter project? Get started with our SpecFlow sample project`;
  } else if (testingFramework === "reqnroll") {
    return `${baseString}

**Reqnroll Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- BrowserStack does not support .NET version 9 and above
- The Mac commands work only with the NUnit runner. They do not work with the MSTest or xUnit runners
- Looking for a starter project? Get started with our Reqnroll sample project`;
  }

  return baseString;
}

// Node.js instructions for webdriverio and nightwatch
function getNodejsAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  if (testingFramework === "webdriverio") {
    return `---STEP---
Your test suite is now ready to run on BrowserStack. Use the commands defined in your package.json file to run the tests
`;
  }
  if (testingFramework === "nightwatch") {
    return `---STEP---
Run your App Automate test suite:
For Android:
\`\`\`bash
  npx nightwatch <path to tests> --env browserstack.android 
\`\`\`
For iOS:
\`\`\`bash
  npx nightwatch <path to tests> --env browserstack.ios
\`\`\`
`;
  }
  if (testingFramework === "jest") {
    return `---STEP---
    Run your App Automate test suite with Jest:

    npm run [your-test-script-name]
`;
  }
  if (testingFramework === "mocha") {
    return `---STEP---
    Run your App Automate test suite with Jest:

    npm run [your-test-script-name]
`;
  }
  if (testingFramework === "cucumber-js") {
    return `---STEP---
Run your App Automate test suite with CucumberJS:

\`\`\`bash
npm run [your-test-script-name]
\`\`\`
`;
  }
  return "";
}

function getPythonAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  if (testingFramework === "robot") {
    return `---STEP---
Run your App Automate test suite with Robot Framework:

\`\`\`bash
browserstack-sdk robot <path-to-test-files>
\`\`\`
`;
  }
  if (testingFramework === "pytest") {
    return `---STEP---
Run your App Automate test suite with Pytest:

\`\`\`bash
browserstack-sdk pytest -s <file-name.py>
\`\`\`
`;
  }
  if (testingFramework === "behave") {
    return `---STEP---
Run your App Automate test suite with Behave:

\`\`\`bash
browserstack-sdk behave <path-to-test-files>
\`\`\`
`;
  }
  if (testingFramework === "lettuce") {
    return `---STEP---
# Run using paver
paver run first_test
\`\`\`
`;
  }
  return "";
}

function getRubyAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  if (testingFramework === "cucumber-ruby") {
    return `---STEP---
Create/Update the config file (config.yml) as follows:

\`\`\`yaml
server: "hub-cloud.browserstack.com"

common_caps:
  "project": "First Cucumber Android Project"
  "build": "Cucumber Android"
  "browserstack.debug": true

browser_caps:
  -
    "device": "Google Pixel 3"
    "os_version": "9.0"
    "app": "bs://<app-id>"
    "name": "first_test"
\`\`\`

---STEP---
Create/Update your support/env.rb file:

\`\`\`ruby
require 'rubygems'
require 'appium_lib'

# Load configuration from config.yml
caps = Appium.load_appium_txt file: File.expand_path('./../config.yml', __FILE__)

# Create desired capabilities
desired_caps = {
  caps: caps,
  appium_lib: {
    server_url: "https://hub-cloud.browserstack.com/wd/hub"
  }
}

# Initialize Appium driver
begin
  $appium_driver = Appium::Driver.new(desired_caps, true)
  $driver = $appium_driver.start_driver
rescue Exception => e
  puts e.message
  Process.exit(0)
end

# Add cleanup hook
at_exit do
  $driver.quit if $driver
end
\`\`\`

---STEP---
Run the test:

\`\`\`bash
bundle exec cucumber
\`\`\`
`;
  }

  if (testingFramework === "rspec") {
    return `---STEP---
Create/Update your spec_helper.rb file:

\`\`\`ruby
require 'rubygems'
require 'appium_lib'

RSpec.configure do |config|
  config.before(:all) do
    # Define desired capabilities
    desired_caps = {
      'platformName' => 'Android',
      'platformVersion' => '9.0',
      'deviceName' => 'Google Pixel 3',
      'app' => 'bs://<app-id>',
      'project' => 'First RSpec Android Project',
      'build' => 'RSpec Android',
      'name' => 'first_test',
      'browserstack.debug' => true
    }

    # Initialize Appium driver
    begin
      $appium_driver = Appium::Driver.new({
        caps: desired_caps,
        appium_lib: {
          server_url: "https://hub-cloud.browserstack.com/wd/hub"
        }
      }, true)
      $driver = $appium_driver.start_driver
    rescue Exception => e
      puts e.message
      Process.exit(0)
    end
  end

  config.after(:all) do
    $driver.quit if $driver
  end
end
\`\`\`

---STEP---
Create your test file (e.g., spec/app_spec.rb):

\`\`\`ruby
require 'spec_helper'

describe 'App Test' do
  it 'should launch the app successfully' do
    # Your test code here
    expect($driver).not_to be_nil
  end
end
\`\`\`

---STEP---
Run the test:

\`\`\`bash
bundle exec rspec
\`\`\`
`;
  }
  
  return "";
}

// Utility function to format instructions with step numbers
export function formatAppInstructionsWithNumbers(instructions: string): string {
  const steps = instructions.split("---STEP---").filter((step) => step.trim());

  return steps
    .map((step, index) => `**Step ${index + 1}:**\n${step.trim()}`)
    .join("\n\n");
}
