// Utility to get the language-dependent prefix command for BrowserStack SDK setup
import { SDKSupportedLanguage } from "./types.js";

export function getSDKPrefixCommand(language: SDKSupportedLanguage): string {
  switch (language) {
    case "nodejs":
      return `Install BrowserStack Node SDK\nusing command | npm i -D browserstack-node-sdk@latest\n| and then run following command to setup browserstack sdk:\n npx setup --username ${process.env.BROWSERSTACK_USERNAME} --key ${process.env.BROWSERSTACK_ACCESS_KEY}\n\n`;
    // Add more languages as needed
    default:
      return "";
  }
}
