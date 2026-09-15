#!/usr/bin/env node

/**
 * CLI entry point for Arcanea MCP Server.
 *
 * Usage:
 *   node dist/cli.js                          # stdio (default)
 *   node dist/cli.js --transport stdio        # stdio (explicit)
 *   node dist/cli.js --transport http         # HTTP/SSE on port 3100
 *   node dist/cli.js --transport http --port 8080
 */

import { createServer } from "./index.js";
import { runStdio, runHttp } from "./transport.js";

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const transportType = getArg("--transport") ?? "stdio";
const portRaw = getArg("--port");
const port = portRaw ? parseInt(portRaw, 10) : 3100;

if (!["stdio", "http"].includes(transportType)) {
  console.error(`Unknown transport "${transportType}". Use "stdio" or "http".`);
  process.exit(1);
}

if (portRaw && isNaN(port)) {
  console.error(`Invalid port "${portRaw}". Must be a number.`);
  process.exit(1);
}

const server = createServer();

if (transportType === "http") {
  runHttp(server, port).catch((err) => {
    console.error("Failed to start HTTP transport:", err);
    process.exit(1);
  });
} else {
  runStdio(server).catch((err) => {
    console.error("Failed to start stdio transport:", err);
    process.exit(1);
  });
}
