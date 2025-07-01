import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("../package.json");
import logger from "./logger.js";
import addSDKTools from "./tools/bstack-sdk.js";
import addAppLiveTools from "./tools/applive.js";
import addBrowserLiveTools from "./tools/live.js";
import addAccessibilityTools from "./tools/accessibility.js";
import addTestManagementTools from "./tools/testmanagement.js";
import addAppAutomationTools from "./tools/appautomate.js";
import addFailureLogsTools from "./tools/getFailureLogs.js";
import addAutomateTools from "./tools/automate.js";
import addSelfHealTools from "./tools/selfheal.js";
import { setupOnInitialized } from "./oninitialized.js";

function registerTools(server: McpServer) {
  addAccessibilityTools(server); //done
  addSDKTools(server); 
//   addAppLiveTools(server); //done
  addBrowserLiveTools(server); //done
  addTestManagementTools(server); //done
  addAppAutomationTools(server); //done
  addFailureLogsTools(server); //done
  addAutomateTools(server); //done
  addSelfHealTools(server); //done
}

export function createMcpServer(): McpServer {
  logger.info(
    "Creating BrowserStack MCP Server, version %s",
    packageJson.version,
  );

  // Create an MCP server
  const server: McpServer = new McpServer({
    name: "BrowserStack MCP Server",
    version: packageJson.version,
  });

  setupOnInitialized(server);
  registerTools(server);

  return server;
}
