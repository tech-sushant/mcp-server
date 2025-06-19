import { ConfigMapping } from "./types.js";
import config from "../../config.js";

/**
 * ---------- PYTHON INSTRUCTIONS ----------
 */

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
const pytestInstructions = generatePythonFrameworkInstructions("pytest");

/**
 * ---------- JAVA INSTRUCTIONS ----------
 */

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

/**
 * ---------- CSharp INSTRUCTIONS ----------
 */

const csharpCommonInstructions = `
1. Install BrowserStack TestAdapter NuGet package  
   Add the package to your project:
   \`\`\`bash
   dotnet add package BrowserStack.TestAdapter
   \`\`\`

2. Build the project  
   \`\`\`bash
   dotnet build
   \`\`\`

3. Set up BrowserStack SDK  
   Replace the placeholders with your actual BrowserStack credentials:
   \`\`\`bash
   dotnet browserstack-sdk setup --userName "${config.browserstackUsername}" --accessKey "${config.browserstackAccessKey}"
   \`\`\`

4. Detect if you are running on Apple Silicon (macOS only)  
   Run this check to determine if Apple Silicon-specific setup is required:
   \`\`\`bash
   ARCH="$(uname -m)"
   if [ "$ARCH" = "arm64" ]; then
     echo "Detected arm64 architecture - running Apple-Silicon flow"
   fi
   \`\`\`

5. macOS (Apple Silicon) setup (required only if arm64 detected)  
   Install the x64 version of .NET for BrowserStack compatibility.

   - Check your current .NET version:
     \`\`\`bash
     dotnet --version
     \`\`\`

   - Create the target path if it doesn't exist, then run:
     \`\`\`bash
     sudo dotnet browserstack-sdk setup-dotnet --dotnet-path "<your-chosen-path>" --dotnet-version "<your-dotnet-version>"
     \`\`\`
     Common paths: /usr/local/share/dotnet, ~/dotnet-x64, or /opt/dotnet-x64

6. Run the tests  
   - For macOS (Apple Silicon), use the full path:
     \`\`\`bash
     <your-chosen-path>/dotnet browserstack-sdk
     \`\`\`
   - For Windows, Intel Macs, or if dotnet alias is configured:
     \`\`\`bash
     dotnet test
     \`\`\`
`;


const csharpPlaywrightNunitInstructions = `
1. Install BrowserStack TestAdapter NuGet package  
   Run the following command:
   \`\`\`bash
   dotnet add package BrowserStack.TestAdapter
   \`\`\`

2. Build the project  
   \`\`\`bash
   dotnet build
   \`\`\`

3. Set up BrowserStack SDK  
   Replace the placeholders with your actual credentials:
   \`\`\`bash
   dotnet browserstack-sdk setup --userName "${config.browserstackUsername}" --accessKey "${config.browserstackAccessKey}"
   \`\`\`

4. Supported browsers  
   Use exactly one of the following (case-sensitive):  
   \`chrome\`, \`edge\`, \`playwright-chromium\`, \`playwright-webkit\`, \`playwright-firefox\`

5. Detect if you are running on Apple Silicon (macOS only)  
   Run this check to determine if Apple Silicon-specific setup is required:
   \`\`\`bash
   ARCH="$(uname -m)"
   if [ "$ARCH" = "arm64" ]; then
     echo "Detected arm64 architecture - running Apple-Silicon flow"
   fi
   \`\`\`

6. macOS (Apple Silicon) setup (required only if arm64 detected)  
   Install the x64 version of .NET for compatibility with BrowserStack.

   - Check your .NET version:
     \`\`\`bash
     dotnet --version
     \`\`\`

   - Ensure the path exists and run setup:
     \`\`\`bash
     sudo dotnet browserstack-sdk setup-dotnet --dotnet-path "<your-chosen-path>" --dotnet-version "<your-dotnet-version>"
     \`\`\`
     Common paths: /usr/local/share/dotnet, ~/dotnet-x64, or /opt/dotnet-x64

7. Fix for Playwright architecture (macOS only)  
   If the folder exists:  
   \`<project-folder>/bin/Debug/net8.0/.playwright/node/darwin-arm64\`  
   Rename \`darwin-arm64\` to \`darwin-x64\`

8. Run the tests  
   - For macOS (Apple Silicon), use the full path:
     \`\`\`bash
     <your-chosen-path>/dotnet browserstack-sdk
     \`\`\`
   - For Windows, Intel Macs, or if dotnet alias is configured:
     \`\`\`bash
     dotnet test
     \`\`\`
`;

/**
 * ---------- NODEJS INSTRUCTIONS ----------
 */

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

/**
 * ---------- EXPORT CONFIG ----------
 */

export const SUPPORTED_CONFIGURATIONS: ConfigMapping = {
  python: {
    playwright: {
      pytest: { instructions: pythonInstructions },
    },
    selenium: {
      pytest: { instructions: pytestInstructions },
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
      xunit: { instructions: csharpCommonInstructions },
      nunit: { instructions: csharpCommonInstructions },
      mstest: { instructions: csharpCommonInstructions },
    },
  },
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
};
