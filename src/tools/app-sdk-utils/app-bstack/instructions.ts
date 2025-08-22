/**
 * Language-specific App SDK instructions are now organized in separate files under ./languages/
 * This allows for better maintainability and separation of concerns.
 */

export { getJavaAppInstructions } from "./languages/java.js";
export { getCSharpAppInstructions } from "./languages/csharp.js";
export { getNodejsAppInstructions } from "./languages/nodejs.js";
export { getPythonAppInstructions } from "./languages/python.js";
export { getRubyAppInstructions } from "./languages/ruby.js";
