import { ConfigMapping } from "./types.js";
import config from "../../config.js";

const nodejsInstructions = `
- Ensure that \`browserstack-node-sdk\` is present in package.json, use the latest version.
- Add new scripts to package.json for running tests on BrowserStack (use \`npx\` to trigger the sdk):
  \`\`\`json
  "scripts": {
    "test:browserstack": "npx browserstack-node-sdk <framework-specific-test-execution-command>"
  }
  \`\`\`
- Add to dependencies:
  \`\`\`json
  "browserstack-node-sdk": "latest"
  \`\`\`
- Inform user to export BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY as environment variables.
`;

const pythonInstructions = `
Run the following command to install the browserstack-sdk:
\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\`

Run the following command to setup the browserstack-sdk:
\`\`\`bash
browserstack-sdk setup --username "${config.browserstackUsername}" --key "${config.browserstackAccessKey}"
\`\`\`

In order to run tests on BrowserStack, run the following command:
\`\`\`bash
browserstack-sdk python <path-to-test-file>
\`\`\`
`;

// Reusable function to generate Python framework instructions
const generatePythonFrameworkInstructions = (framework: string) => `
Run the following command to install the browserstack-sdk:
\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\`

Run the following command to setup the browserstack-sdk:
\`\`\`bash
browserstack-sdk setup --framework "${framework}" --username "${config.browserstackUsername}" --key "${config.browserstackAccessKey}"
\`\`\`

In order to run tests on BrowserStack, run the following command:
\`\`\`bash
browserstack-sdk ${framework} <path-to-test-files>
\`\`\`
`;

const robotInstructions = generatePythonFrameworkInstructions("robot");
const behaveInstructions = generatePythonFrameworkInstructions("behave");

const argsInstruction =
  '<argLine>-javaagent:"${com.browserstack:browserstack-java-sdk:jar}"</argLine>';

const javaInstructions = `
Strictly Add the following dependencies to your \`pom.xml\`:
\`\`\`xml
<dependency>
    <groupId>com.browserstack</groupId>
    <artifactId>browserstack-java-sdk</artifactId>
    <version>LATEST</version>
    <scope>compile</scope>
</dependency>

${argsInstruction}
\`\`\`

For Gradle projects, add to \`build.gradle\`:
\`\`\`groovy
dependencies {
    implementation 'com.browserstack:browserstack-java-sdk:LATEST'
}
\`\`\`

Inform user to export:
\`\`\`bash
export BROWSERSTACK_USERNAME=${config.browserstackUsername}
export BROWSERSTACK_ACCESS_KEY=${config.browserstackAccessKey}
\`\`\`

Run tests using:
\`\`\`bash
mvn clean test 
\`\`\`

Or for Gradle:
\`\`\`bash
gradle clean test
\`\`\`
`;

// Reusable function to generate JUnit instructions
const generateJUnitInstructions = (framework: string) => `
Set BrowserStack credentials as environment variables:
\`\`\`bash
export BROWSERSTACK_USERNAME="${config.browserstackUsername}"
export BROWSERSTACK_ACCESS_KEY="${config.browserstackAccessKey}"
\`\`\`

For Maven projects, run the following command to add browserstack-java-sdk dependency and browserstack.yml file:
\`\`\`bash
mvn archetype:generate -B -DarchetypeGroupId=com.browserstack \\
-DarchetypeArtifactId=browserstack-sdk-archetype-integrate -DarchetypeVersion=1.0 \\
-DgroupId=com.browserstack -DartifactId=browserstack-sdk-archetype-integrate -Dversion=1.0 \\
-DBROWSERSTACK_USERNAME=${config.browserstackUsername} -DBROWSERSTACK_ACCESS_KEY=${config.browserstackAccessKey} \\
-DBROWSERSTACK_FRAMEWORK=${framework}
\`\`\`

For Gradle projects, add to build.gradle:
\`\`\`groovy
implementation 'com.browserstack:browserstack-java-sdk:latest.release'

def browserstackSDKArtifact = configurations.compileClasspath.resolvedConfiguration.resolvedArtifacts.find { it.name == 'browserstack-java-sdk' }

test {
    jvmArgs "-javaagent:\${browserstackSDKArtifact.file}"
}
\`\`\`

Run tests using:
\`\`\`bash
mvn clean test
\`\`\`

Or for Gradle:
\`\`\`bash
gradle clean test
\`\`\`
`;

const junit4Instructions = generateJUnitInstructions("junit4");
const junit5Instructions = generateJUnitInstructions("junit5");

const pythonPytestInstructions = `
Install BrowserStack Pytest SDK:
\`\`\`bash
python3 -m pip install browserstack-sdk
\`\`\`

Set up your credentials as environment variables:
\`\`\`bash
Inform user to export BROWSERSTACK_USERNAME=${config.browserstackUsername} and 
BROWSERSTACK_ACCESS_KEY=${config.browserstackAccessKey} as environment variables.
\`\`\`

Run your test suite on BrowserStack:
\`\`\`bash
browserstack-sdk pytest <path-to-test-files>
\`\`\`
`;

const csharpInstructions = `
Add the BrowserStack TestAdapter NuGet package to your project:
\`\`\`bash
dotnet add package BrowserStack.TestAdapter
\`\`\`

Build your project:
\`\`\`bash
dotnet build
\`\`\`

Setup BrowserStack SDK with your credentials:
\`\`\`bash
dotnet browserstack-sdk setup --userName "${config.browserstackUsername}" --accessKey "${config.browserstackAccessKey}"
\`\`\`

Run your xUnit tests on BrowserStack:
\`\`\`bash
dotnet test
\`\`\`
`;

const csharpNunitInstructions = `
\`\`\`bash
dotnet add package BrowserStack.TestAdapter
dotnet build
dotnet browserstack-sdk setup --userName "${config.browserstackUsername}" --accessKey "${config.browserstackAccessKey}"
\`\`\`

For macOS (Apple Silicon) - additional setup required:
Install dotnet x64 for BrowserStack compatibility. The automated download may require sudo permissions:
\`\`\`bash
# First, check your current dotnet version and decide on installation path
dotnet --version
# Common paths: /usr/local/share/dotnet, ~/dotnet-x64, or /opt/dotnet-x64

# Run setup with your chosen path and version
sudo dotnet browserstack-sdk setup-dotnet --dotnet-path "<your-chosen-path>" --dotnet-version "<your-dotnet-version>"
\`\`\`

Run tests:
\`\`\`bash
# For macOS with x64 setup (use the path you specified above):
<your-chosen-path>/dotnet test

# For Windows/Intel or if alias was set:
dotnet test
\`\`\`
`;

const csharpPlaywrightNunitInstructions = `
Add the BrowserStack TestAdapter NuGet package to your project:
\`\`\`bash
dotnet add package BrowserStack.TestAdapter
\`\`\`

Build your project:
\`\`\`bash
dotnet build
\`\`\`

Setup BrowserStack SDK with your credentials:
\`\`\`bash
dotnet browserstack-sdk setup --userName "${config.browserstackUsername}" --accessKey "${config.browserstackAccessKey}"
\`\`\`

For macOS (Apple Silicon) - strictly follow these steps:
Install dotnet x64 for BrowserStack compatibility. The automated download may require sudo permissions:
\`\`\`bash
# First, check your current dotnet version and decide on installation path
dotnet --version
# Common paths: /usr/local/share/dotnet, ~/dotnet-x64, or /opt/dotnet-x64

# Run setup with your chosen path and version
sudo <your-chosen-path>/dotnet browserstack-sdk setup-dotnet --dotnet-path "<your-chosen-path>" --dotnet-version "<your-dotnet-version>"
\`\`\`

Run your Playwright NUnit tests on BrowserStack:
\`\`\`bash
# For macOS with x64 setup (use the path you specified above):
<your-chosen-path>/dotnet browserstack-sdk

# For Windows/Intel or if alias was set:
dotnet test
\`\`\`
`;

export const SUPPORTED_CONFIGURATIONS: ConfigMapping = {
  nodejs: {
    playwright: {
      jest: { instructions: nodejsInstructions },
      codeceptjs: { instructions: nodejsInstructions },
      playwright: { instructions: nodejsInstructions },
    },
    selenium: {
      jest: { instructions: nodejsInstructions },
      webdriverio: { instructions: nodejsInstructions },
      mocha: { instructions: nodejsInstructions },
      cucumber: { instructions: nodejsInstructions },
      nightwatch: { instructions: nodejsInstructions },
      codeceptjs: { instructions: nodejsInstructions },
    },
  },
  python: {
    playwright: {
      pytest: { instructions: pythonInstructions },
    },
    selenium: {
      pytest: { instructions: pythonPytestInstructions },
      robot: { instructions: robotInstructions },
      behave: { instructions: behaveInstructions },
    },
  },
  java: {
    playwright: {},
    selenium: {
      testng: { instructions: javaInstructions },
      cucumber: { instructions: javaInstructions },
      junit4: { instructions: junit4Instructions },
      junit5: { instructions: junit5Instructions },
    },
  },
  csharp: {
    playwright: {
      nunit: { instructions: csharpPlaywrightNunitInstructions },
    },
    selenium: {
      xunit: { instructions: csharpInstructions },
      nunit: { instructions: csharpNunitInstructions },
    },
  },
};
