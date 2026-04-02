#!/usr/bin/env node

import { spawn } from "node:child_process";

const child = spawn(process.execPath, ["scripts/sis-mcp-server.mjs"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let output = "";
let errorOutput = "";

child.stdout.on("data", (chunk) => {
  output += chunk.toString();
});

child.stderr.on("data", (chunk) => {
  errorOutput += chunk.toString();
});

function send(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

const requests = [
  { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
  { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "sis_stats", arguments: {} } },
];

for (const request of requests) {
  send(request);
}

setTimeout(() => {
  child.stdin.end();
}, 50);

child.on("close", (code) => {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const initialized = lines.find((entry) => entry.id === 1 && entry.result?.serverInfo?.name === "starlight-sis");
  const stats = lines.find((entry) => entry.id === 2 && entry.result?.content?.[0]?.text);

  if (!initialized || !stats) {
    console.error("SIS MCP smoke check failed.");
    if (errorOutput) console.error(errorOutput.trim());
    if (output) console.error(output.trim());
    process.exit(code || 1);
  }

  console.log("SIS MCP smoke check passed.");
  console.log(stats.result.content[0].text);
});
