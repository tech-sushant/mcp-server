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
