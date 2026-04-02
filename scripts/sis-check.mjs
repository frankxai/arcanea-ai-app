#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const contract = spawnSync(process.execPath, ["scripts/sis-contract-check.mjs"], {
  stdio: "inherit",
});

if (contract.status !== 0) {
  process.exit(contract.status ?? 1);
}

const schema = spawnSync(process.execPath, ["scripts/sis-schema-check.mjs"], {
  stdio: "inherit",
});

if (schema.status !== 0) {
  process.exit(schema.status ?? 1);
}

const tempSisHome = mkdtempSync(join(tmpdir(), "arcanea-sis-check-"));

const appendCheck = spawnSync(
  process.execPath,
  [
    "scripts/sis-write.mjs",
    "--vault",
    "operational",
    "--content",
    "sis automated write check",
    "--category",
    "testing",
    "--source",
    "sis-check",
    "--confidence",
    "high",
  ],
  {
    stdio: "pipe",
    encoding: "utf8",
    env: {
      ...process.env,
      STARLIGHT_HOME: tempSisHome,
    },
  },
);

if (appendCheck.status !== 0) {
  console.error("SIS write-path check failed.");
  if (appendCheck.stdout) console.error(appendCheck.stdout.trim());
  if (appendCheck.stderr) console.error(appendCheck.stderr.trim());
  process.exit(appendCheck.status ?? 1);
}

const child = spawn(process.execPath, ["scripts/sis-mcp-server.mjs"], {
  stdio: ["pipe", "pipe", "pipe"],
  env: {
    ...process.env,
    STARLIGHT_HOME: tempSisHome,
  },
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
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "sis_append_entry",
      arguments: {
        vault: "creative",
        content: "sis automated mcp append check",
        category: "testing",
        source: "sis-check-mcp",
        confidence: "high",
        tags: ["test"],
      },
    },
  },
  { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "sis_stats", arguments: {} } },
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
  const appended = lines.find((entry) => entry.id === 2 && entry.result?.content?.[0]?.text);
  const stats = lines.find((entry) => entry.id === 3 && entry.result?.content?.[0]?.text);

  if (!initialized || !appended || !stats) {
    console.error("SIS MCP smoke check failed.");
    if (errorOutput) console.error(errorOutput.trim());
    if (output) console.error(output.trim());
    process.exit(code || 1);
  }

  console.log("SIS MCP smoke check passed.");
  console.log("SIS write-path check passed.");
  console.log(stats.result.content[0].text);
});
