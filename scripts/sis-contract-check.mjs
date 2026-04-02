#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { existsSync } from "node:fs";

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

const checked = [];
const skipped = [];

function withOptionalFile(path, label, fn) {
  if (!existsSync(path)) {
    skipped.push(label);
    return;
  }
  fn(path);
  checked.push(label);
}

function checkMcpConfig() {
  const path = join(repoRoot, ".mcp.json");
  withOptionalFile(path, ".mcp.json", (targetPath) => {
    const data = parseJsonFile(targetPath);
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
  });
}

function checkOpencodeConfig() {
  const path = join(repoRoot, ".opencode", "opencode.json");
  withOptionalFile(path, ".opencode/opencode.json", (targetPath) => {
    const data = parseJsonFile(targetPath);
    const server = data.mcp?.starlight_sis;
    assert(server, ".opencode/opencode.json missing mcp.starlight_sis");
    assert(server.enabled === true, ".opencode/opencode.json starlight_sis must be enabled");
    assert(
      Array.isArray(server.command) && server.command[1] === "C:/Users/frank/Arcanea/scripts/sis-mcp-server.mjs",
      ".opencode/opencode.json starlight_sis command mismatch",
    );
    assert(server.environment?.STARLIGHT_HOME === expectedSisHome, ".opencode/opencode.json STARLIGHT_HOME mismatch");
  });
}

function checkArcaneaCodeConfig() {
  const path = join(repoRoot, "arcanea-code", ".arcanea", "arcanea.jsonc");
  withOptionalFile(path, "arcanea-code/.arcanea/arcanea.jsonc", (targetPath) => {
    const data = parseJsonFile(targetPath, true);
    const server = data.mcp?.starlight_sis;
    assert(server, "arcanea-code/.arcanea/arcanea.jsonc missing mcp.starlight_sis");
    assert(server.enabled === true, "arcanea-code/.arcanea/arcanea.jsonc starlight_sis must be enabled");
    assert(
      Array.isArray(server.command) && server.command[1] === "C:/Users/frank/Arcanea/scripts/sis-mcp-server.mjs",
      "arcanea-code/.arcanea/arcanea.jsonc starlight_sis command mismatch",
    );
    assert(server.environment?.STARLIGHT_HOME === expectedSisHome, "arcanea-code/.arcanea/arcanea.jsonc STARLIGHT_HOME mismatch");
  });
}

function checkLaunchers() {
  const launcherPaths = [
    {
      path: join(repoRoot, ".arcanea", "scripts", "arcanea.ps1"),
      required: ["sis-bootstrap.ps1", "stats-json", "legacy-sync"],
    },
    {
      path: join(repoRoot, ".arcanea", "scripts", "sis-bootstrap.ps1"),
      required: ["sis-context-bridge.mjs", "sis-legacy-export.mjs", "snapshot.json"],
    },
  ];

  for (const launcher of launcherPaths) {
    withOptionalFile(launcher.path, launcher.path.replace(`${repoRoot}\\`, ""), (targetPath) => {
      const raw = readText(targetPath);
      includesAll(raw, launcher.required, targetPath);
    });
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
        checked,
        skipped,
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
