#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const expectedSisHome = "C:/Users/frank/.starlight";

function readText(path) {
  return readFileSync(path, "utf8");
}

function stripJsonComments(raw) {
  return raw
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

function parseJsonFile(path, allowComments = false) {
  const raw = readText(path);
  return JSON.parse(allowComments ? stripJsonComments(raw) : raw);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(text, required, label) {
  for (const value of required) {
    assert(text.includes(value), `${label} is missing: ${value}`);
  }
}

function checkMcpConfig() {
  const path = join(repoRoot, ".mcp.json");
  const data = parseJsonFile(path);
  const compatServer = data.mcpServers?.["arcanea-memory"];
  assert(compatServer, ".mcp.json missing mcpServers.arcanea-memory");
  assert(compatServer.command === "node", ".mcp.json arcanea-memory command must be node");
  assert(
    Array.isArray(compatServer.args) && compatServer.args.includes("C:/Users/frank/Arcanea/scripts/arcanea-memory-compat-mcp.mjs"),
    ".mcp.json arcanea-memory args missing compatibility MCP server",
  );
  assert(compatServer.env?.STARLIGHT_HOME === expectedSisHome, ".mcp.json arcanea-memory STARLIGHT_HOME mismatch");
  assert(
    compatServer.env?.LEGACY_MEMORY_OUT === "C:/Users/frank/Arcanea/.arcanea/memory",
    ".mcp.json arcanea-memory LEGACY_MEMORY_OUT mismatch",
  );

  const server = data.mcpServers?.["starlight-sis"];
  assert(server, ".mcp.json missing mcpServers.starlight-sis");
  assert(server.command === "node", ".mcp.json starlight-sis command must be node");
  assert(
    Array.isArray(server.args) && server.args.includes("C:/Users/frank/Arcanea/scripts/sis-mcp-server.mjs"),
    ".mcp.json starlight-sis args missing sis-mcp-server.mjs",
  );
  assert(server.env?.STARLIGHT_HOME === expectedSisHome, ".mcp.json STARLIGHT_HOME mismatch");
}

function checkOpencodeConfig() {
  const path = join(repoRoot, ".opencode", "opencode.json");
  const data = parseJsonFile(path);
  const server = data.mcp?.starlight_sis;
  assert(server, ".opencode/opencode.json missing mcp.starlight_sis");
  assert(server.enabled === true, ".opencode/opencode.json starlight_sis must be enabled");
  assert(
    Array.isArray(server.command) && server.command[1] === "C:/Users/frank/Arcanea/scripts/sis-mcp-server.mjs",
    ".opencode/opencode.json starlight_sis command mismatch",
  );
  assert(server.environment?.STARLIGHT_HOME === expectedSisHome, ".opencode/opencode.json STARLIGHT_HOME mismatch");
}

function checkArcaneaCodeConfig() {
  const path = join(repoRoot, "arcanea-code", ".arcanea", "arcanea.jsonc");
  const data = parseJsonFile(path, true);
  const server = data.mcp?.starlight_sis;
  assert(server, "arcanea-code/.arcanea/arcanea.jsonc missing mcp.starlight_sis");
  assert(server.enabled === true, "arcanea-code/.arcanea/arcanea.jsonc starlight_sis must be enabled");
  assert(
    Array.isArray(server.command) && server.command[1] === "C:/Users/frank/Arcanea/scripts/sis-mcp-server.mjs",
    "arcanea-code/.arcanea/arcanea.jsonc starlight_sis command mismatch",
  );
  assert(server.environment?.STARLIGHT_HOME === expectedSisHome, "arcanea-code/.arcanea/arcanea.jsonc STARLIGHT_HOME mismatch");
}

function checkLaunchers() {
  const launcherPaths = [
    join(repoRoot, ".arcanea", "scripts", "opencode.ps1"),
    join(repoRoot, ".arcanea", "scripts", "opencode-dev.ps1"),
    join(repoRoot, ".arcanea", "scripts", "oh-my-arcanea.ps1"),
    join(repoRoot, ".arcanea", "scripts", "claude-launcher.ps1"),
  ];

  for (const path of launcherPaths) {
    const raw = readText(path);
    includesAll(raw, ["STARLIGHT_HOME", "C:\\Users\\frank\\.starlight", "sis-bootstrap.ps1"], path);
  }
}

try {
  checkMcpConfig();
  checkOpencodeConfig();
  checkArcaneaCodeConfig();
  checkLaunchers();
  console.log("SIS contract check passed.");
  console.log(
    JSON.stringify(
      {
        sisHome: expectedSisHome,
        checked: [
          ".mcp.json",
          "mcpServers.arcanea-memory",
          ".opencode/opencode.json",
          "arcanea-code/.arcanea/arcanea.jsonc",
          ".arcanea/scripts/opencode.ps1",
          ".arcanea/scripts/opencode-dev.ps1",
          ".arcanea/scripts/oh-my-arcanea.ps1",
          ".arcanea/scripts/claude-launcher.ps1",
        ],
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error("SIS contract check failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
