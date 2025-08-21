// Instruction generation utilities shared across different modules
import {
  AppSDKSupportedLanguage,
  AppSDKSupportedTestingFramework,
  PLATFORM_UTILS,
  createStep,
  combineInstructions,
} from "./index.js";

/**
 * Get project configuration instructions for specific language/framework combinations
 */
export function getAppInstructionsForProjectConfiguration(
  framework: string,
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

/**
 * Generate Java-specific test running instructions
 */
function getJavaAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  const baseRunStep = createStep(
    "Run your App Automate test suite:",
    `\`\`\`bash
mvn test
\`\`\``,
  );

  let prerequisites = "";

  switch (testingFramework) {
    case "junit5":
      prerequisites = `**JUnit 5 Prerequisites:**
- An existing automated test suite
- JUnit 5 is installed
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
      break;
    case "testng":
      prerequisites = `**TestNG Prerequisites:**
- An existing automated test suite
- TestNG is installed
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
      break;
    case "selenide":
      prerequisites = `**Selenide Prerequisites:**
- An existing Appium-based automated test suite
- Selenide framework is installed
- Ensure you're using Java v8+ (Java v9+ required for Gradle)
- Maven is installed and configured in your system PATH
- Looking for a starter project? Get started with our Selenide sample project`;
      break;
    case "jbehave":
      prerequisites = `**JBehave Prerequisites:**
- An existing automated test suite
- JBehave is installed
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
      break;
    default:
      prerequisites = `**Prerequisites:**
- An existing automated test suite
- Ensure you're using Java v8+
- Maven is installed and configured in your system PATH`;
  }

  return `${baseRunStep}
${prerequisites}`;
}

/**
 * Generate C# specific test running instructions
 */
function getCSharpAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  const { isWindows, isAppleSilicon, getPlatformLabel } = PLATFORM_UTILS;

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

  const runStep = createStep(
    "Run your C# test suite:",
    `**${getPlatformLabel()}:**
${runCommand}

**Debug Guidelines:**
If you encounter the error: java.lang.IllegalArgumentException: Multiple entries with the same key,
__Resolution:__
- The app capability should only be set in one place: browserstack.yml.
- Remove or comment out any code or configuration in your test setup (e.g., step definitions, runners, or capabilities setup) that sets the app path directly.`,
  );

  let prerequisites = "";
  const dotnetVersionNote =
    "BrowserStack does not support .NET version 9 and above";

  switch (testingFramework) {
    case "nunit":
      prerequisites = `**NUnit Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- ${dotnetVersionNote}
- Looking for a starter project? Get started with our NUnit sample project`;
      break;
    case "mstest":
      prerequisites = `**MSTest Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- ${dotnetVersionNote}
- Looking for a starter project? Get started with our MSTest sample project`;
      break;
    case "xunit":
      prerequisites = `**XUnit Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- ${dotnetVersionNote}
- Looking for a starter project? Get started with our XUnit sample project`;
      break;
    case "specflow":
      prerequisites = `**⚠️ IMPORTANT: SpecFlow End of Life Notice**
BrowserStack no longer actively supports SpecFlow following its end of life (EOL) on December 31, 2024. Fixes or upgrades for SpecFlow are not planned.

**SpecFlow Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- ${dotnetVersionNote}
- The Mac commands work only with the NUnit runner. They do not work with the MSTest or xUnit runners
- Looking for a starter project? Get started with our SpecFlow sample project`;
      break;
    case "reqnroll":
      prerequisites = `**Reqnroll Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- ${dotnetVersionNote}
- The Mac commands work only with the NUnit runner. They do not work with the MSTest or xUnit runners
- Looking for a starter project? Get started with our Reqnroll sample project`;
      break;
    default:
      prerequisites = `**Prerequisites:**
- An existing automated test suite
- .NET v5.0+ and NUnit v3.0.0+
- ${dotnetVersionNote}`;
  }

  return `${runStep}

${prerequisites}`;
}

/**
 * Generate Node.js specific test running instructions
 */
function getNodejsAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  switch (testingFramework) {
    case "webdriverio":
      return createStep(
        "Run your WebdriverIO test suite:",
        "Your test suite is now ready to run on BrowserStack. Use the commands defined in your package.json file to run the tests",
      );
    case "nightwatch":
      return createStep(
        "Run your App Automate test suite:",
        `For Android:
\`\`\`bash
  npx nightwatch <path to tests> --env browserstack.android 
\`\`\`
For iOS:
\`\`\`bash
  npx nightwatch <path to tests> --env browserstack.ios
\`\`\``,
      );
    case "jest":
      return createStep(
        "Run your App Automate test suite with Jest:",
        "npm run [your-test-script-name]",
      );
    case "mocha":
      return createStep(
        "Run your App Automate test suite with Mocha:",
        "npm run [your-test-script-name]",
      );
    case "cucumber-js":
      return createStep(
        "Run your App Automate test suite with CucumberJS:",
        `\`\`\`bash
npm run [your-test-script-name]
\`\`\``,
      );
    default:
      return "";
  }
}

/**
 * Generate Python specific test running instructions
 */
function getPythonAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  switch (testingFramework) {
    case "robot":
      return createStep(
        "Run your App Automate test suite with Robot Framework:",
        `\`\`\`bash
browserstack-sdk robot <path-to-test-files>
\`\`\``,
      );
    case "pytest":
      return createStep(
        "Run your App Automate test suite with Pytest:",
        `\`\`\`bash
browserstack-sdk pytest -s <file-name.py>
\`\`\``,
      );
    case "behave":
      return createStep(
        "Run your App Automate test suite with Behave:",
        `\`\`\`bash
browserstack-sdk behave <path-to-test-files>
\`\`\``,
      );
    case "lettuce":
      return createStep(
        "Run your test with Lettuce:",
        `\`\`\`bash
# Run using paver
paver run first_test
\`\`\``,
      );
    default:
      return "";
  }
}

/**
 * Generate Ruby specific test running and configuration instructions
 */
function getRubyAppInstructions(
  testingFramework: AppSDKSupportedTestingFramework,
): string {
  if (testingFramework === "cucumber-ruby") {
    return getCucumberRubyInstructions();
  }

  if (testingFramework === "rspec") {
    return getRSpecInstructions();
  }

  return "";
}

function getCucumberRubyInstructions(): string {
  const configStep = createStep(
    "Create/Update the config file (config.yml) as follows:",
    `\`\`\`yaml
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
\`\`\``,
  );

  const envStep = createStep(
    "Create/Update your support/env.rb file:",
    `\`\`\`ruby
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
\`\`\``,
  );

  const runStep = createStep(
    "Run the test:",
    `\`\`\`bash
bundle exec cucumber
\`\`\``,
  );

  return combineInstructions(configStep, envStep, runStep);
}

function getRSpecInstructions(): string {
  const specHelperStep = createStep(
    "Create/Update your spec_helper.rb file:",
    `\`\`\`ruby
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
\`\`\``,
  );

  const testFileStep = createStep(
    "Create your test file (e.g., spec/app_spec.rb):",
    `\`\`\`ruby
require 'spec_helper'

describe 'App Test' do
  it 'should launch the app successfully' do
    # Your test code here
    expect($driver).not_to be_nil
  end
end
\`\`\``,
  );

  const runStep = createStep(
    "Run the test:",
    `\`\`\`bash
bundle exec rspec
\`\`\``,
  );

  return combineInstructions(specHelperStep, testFileStep, runStep);
}
