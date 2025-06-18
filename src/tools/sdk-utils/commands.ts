// Utility to get the language-dependent prefix command for BrowserStack SDK setup
import { SDKSupportedLanguage } from "./types.js";

// Framework mapping for Java Maven archetype generation
const JAVA_FRAMEWORK_MAP: Record<string, string> = {
  testng: "testng",
  junit: "junit5", // Map generic junit to junit5 as default
  cucumber: "cucumber-testng", // Map generic cucumber to cucumber-testng as default
};

export function getSDKPrefixCommand(
  language: SDKSupportedLanguage,
  framework: string,
): string {
  switch (language) {
    case "nodejs":
      return `Install BrowserStack Node SDK\nusing command | npm i -D browserstack-node-sdk@latest\n| and then run following command to setup browserstack sdk:\n npx setup --username ${process.env.BROWSERSTACK_USERNAME} --key ${process.env.BROWSERSTACK_ACCESS_KEY}\n\n`;

    case "java": {
      const mavenFramework = getJavaFrameworkForMaven(framework);
      return `Install BrowserStack Java SDK

**Maven command for ${framework}:**
mvn archetype:generate -B -DarchetypeGroupId=com.browserstack \\
-DarchetypeArtifactId=browserstack-sdk-archetype-integrate -DarchetypeVersion=1.0 \\
-DgroupId=com.browserstack -DartifactId=browserstack-sdk-archetype-integrate -Dversion=1.0 \\
-DBROWSERSTACK_USERNAME=${process.env.BROWSERSTACK_USERNAME} -DBROWSERSTACK_ACCESS_KEY=${process.env.BROWSERSTACK_ACCESS_KEY} \\
-DBROWSERSTACK_FRAMEWORK=${mavenFramework}

**For Gradle setup:**
1. Add browserstack-java-sdk to dependencies:
   compileOnly 'com.browserstack:browserstack-java-sdk:latest.release'

2. Add browserstackSDK path variable:
   def browserstackSDKArtifact = configurations.compileClasspath.resolvedConfiguration.resolvedArtifacts.find { it.name == 'browserstack-java-sdk' }

3. Add javaagent to gradle tasks:
   jvmArgs "-javaagent:\${browserstackSDKArtifact.file}"
`;
    }

    // Add more languages as needed
    default:
      return "";
  }
}

export function getJavaFrameworkForMaven(framework: string): string {
  return JAVA_FRAMEWORK_MAP[framework] || framework;
}
