import { ConfigMapping } from "./types.js";
import * as constants from "./constants.js";

export const SUPPORTED_CONFIGURATIONS: ConfigMapping = {
  python: {
    selenium: { instructions: constants.pythonInstructions },
    playwright: { instructions: constants.pythonPlaywrightInstructions },
  },
  javascript: {
    selenium: { instructions: constants.nodejsInstructions },
    playwright: { instructions: constants.jsPlaywrightInstructions },
  },
  java: {
    selenium: { instructions: constants.javaInstructions },
    playwright: { instructions: constants.javaPlaywrightInstructions },
  },
  ruby: {
    selenium: { instructions: constants.rubyInstructions },
  },
  csharp: {
    selenium: { instructions: constants.csharpInstructions },
    playwright: { instructions: constants.csharpPlaywrightInstructions },
  },
};
