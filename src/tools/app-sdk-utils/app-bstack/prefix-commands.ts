import { AppSDKSupportedLanguage } from "../common/index.js";
import { getCSharpSDKCommand } from "./languages/csharp.js";
import {
  getJavaSDKCommand,
  getJavaAppFrameworkForMaven,
} from "./languages/java.js";
import { getNodejsSDKCommand } from "./languages/nodejs.js";
import { getPythonSDKCommand } from "./languages/python.js";
import { getRubySDKCommand } from "./languages/ruby.js";

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

export { getJavaAppFrameworkForMaven };
