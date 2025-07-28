import { ConfigMapping } from "./types.js";
import * as instructions from "./constants.js";

export const SUPPORTED_CONFIGURATIONS: ConfigMapping = {
  python: {
    pytest: {
      instructions: instructions.pythonPytestPercyAutomateInstructions,
    },
  },
  javascript: {
    cypress: { instructions: instructions.jsCypressPercyAutomateInstructions },
    mocha: { instructions: instructions.mochaPercyAutomateInstructions },
    jest: { instructions: instructions.jestPercyAutomateInstructions },
    webdriverio: {
      instructions: instructions.webdriverioPercyAutomateInstructions,
    },
    testcafe: { instructions: instructions.testcafePercyAutomateInstructions },
  },
  java: {
    testng: { instructions: instructions.testngPercyAutomateInstructions },
  },
};
