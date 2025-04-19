import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import packageJson from "../package.json";
import "dotenv/config";
import logger from "./logger";
import addSDKTools from "./tools/bstack-sdk";
import addAppLiveTools from "./tools/applive";
import addObservabilityTools from "./tools/observability";

logger.info(
  "Launching BrowserStack MCP server, version %s",
  packageJson.version
);

function registerTools(server: McpServer) {
  addSDKTools(server);
  addAppLiveTools(server);
  addObservabilityTools(server);
}

// Create an MCP server
const server: McpServer = new McpServer({
  name: "BrowserStack MCP Server",
  version: packageJson.version,
});

registerTools(server);

async function main() {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info("MCP server started successfully");
}

main().catch(console.error);
