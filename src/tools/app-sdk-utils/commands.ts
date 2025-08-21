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

    default:
      return "";
  }
}

export function getJavaAppFrameworkForMaven(framework: string): string {
  return JAVA_APP_FRAMEWORK_MAP[framework] || framework;
}
