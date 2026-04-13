#!/usr/bin/env node
/**
 * Arcanea Publishing House MCP — CLI entry point
 *
 * Starts the MCP server over stdio transport.
 * Usage: npx arcanea-publishing-mcp
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./index.js";

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[arcanea-publishing-mcp] Server started on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
