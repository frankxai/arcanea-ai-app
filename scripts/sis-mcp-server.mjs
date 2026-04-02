#!/usr/bin/env node

import { createInterface } from "node:readline";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const home = homedir();
const sisRoot = process.env.STARLIGHT_HOME || join(home, ".starlight");
const vaultNames = ["strategic", "technical", "creative", "operational", "wisdom", "horizon"];

function safeRead(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function parseJsonl(path) {
  const raw = safeRead(path).trim();
  if (!raw) return [];
  return raw
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
}

function normalizeEntry(vault, entry) {
  const content =
    entry.content ??
    entry.insight ??
    entry.learning ??
    entry.text ??
    entry.value ??
    entry.wish ??
    entry.pattern ??
    entry.summary ??
    JSON.stringify(entry);
  const createdAt =
    entry.createdAt ??
    entry.created_at ??
    entry.timestamp ??
    entry.date ??
    null;
  const tags = Array.isArray(entry.tags) ? entry.tags : [];
  return {
    vault,
    id: entry.id ?? null,
    createdAt,
    tags,
    content: String(content),
    raw: entry,
  };
}

function vaultEntries(vault) {
  return parseJsonl(join(sisRoot, "vaults", `${vault}.jsonl`)).map((entry) =>
    normalizeEntry(vault, entry),
  );
}

function resourceForVault(vault) {
  const entries = vaultEntries(vault);
  return {
    uri: `starlight://vaults/${vault}`,
    name: `SIS ${vault} vault`,
    description: `Canonical SIS vault from ${sisRoot}`,
    mimeType: "application/json",
    text: JSON.stringify({ vault, entries }, null, 2),
  };
}

function latestSession() {
  const sessionsDir = join(sisRoot, "evals", "sessions");
  if (!existsSync(sessionsDir)) return null;
  const files = readdirSync(sessionsDir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (files.length === 0) return null;
  const latest = files[files.length - 1];
  return {
    uri: "starlight://evals/latest-session",
    name: "SIS latest eval session",
    description: `Latest eval session from ${sisRoot}`,
    mimeType: "application/json",
    text: safeRead(join(sessionsDir, latest)),
  };
}

function patternResource() {
  return {
    uri: "starlight://evals/patterns",
    name: "SIS pattern learnings",
    description: `Pattern learnings from ${sisRoot}`,
    mimeType: "application/json",
    text: JSON.stringify(parseJsonl(join(sisRoot, "evals", "patterns.jsonl")), null, 2),
  };
}

const tools = [
  {
    name: "sis_vault_search",
    description: "Search canonical SIS vaults in ~/.starlight by free-text query.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        vault: { type: "string", enum: [...vaultNames, "all"] },
        limit: { type: "number" },
      },
      required: ["query"],
    },
  },
  {
    name: "sis_recent_entries",
    description: "Get the most recent entries from SIS vaults.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string", enum: [...vaultNames, "all"] },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "sis_stats",
    description: "Get canonical SIS vault counts and eval counts.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

function scoreMatch(entry, query) {
  const haystack = `${entry.content} ${(entry.tags || []).join(" ")} ${JSON.stringify(entry.raw)}`.toLowerCase();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
}

async function callTool(name, args = {}) {
  if (name === "sis_vault_search") {
    const query = String(args.query || "").trim();
    const limit = Number(args.limit || 10);
    const chosenVault = String(args.vault || "all");
    const targets = chosenVault === "all" ? vaultNames : [chosenVault];
    const results = targets
      .flatMap((vault) => vaultEntries(vault))
      .map((entry) => ({ entry, score: scoreMatch(entry, query) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ entry, score }) => ({
        vault: entry.vault,
        id: entry.id,
        createdAt: entry.createdAt,
        tags: entry.tags,
        score,
        content: entry.content,
      }));
    return { query, count: results.length, results };
  }

  if (name === "sis_recent_entries") {
    const limit = Number(args.limit || 10);
    const chosenVault = String(args.vault || "all");
    const targets = chosenVault === "all" ? vaultNames : [chosenVault];
    const entries = targets
      .flatMap((vault) => vaultEntries(vault))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, limit)
      .map((entry) => ({
        vault: entry.vault,
        id: entry.id,
        createdAt: entry.createdAt,
        tags: entry.tags,
        content: entry.content,
      }));
    return { count: entries.length, entries };
  }

  if (name === "sis_stats") {
    const vaults = Object.fromEntries(vaultNames.map((vault) => [vault, vaultEntries(vault).length]));
    const patternCount = parseJsonl(join(sisRoot, "evals", "patterns.jsonl")).length;
    const sessionsDir = join(sisRoot, "evals", "sessions");
    const sessionCount = existsSync(sessionsDir)
      ? readdirSync(sessionsDir).filter((name) => name.endsWith(".json")).length
      : 0;
    return { sisRoot, vaults, patternCount, sessionCount };
  }

  throw new Error(`Unknown tool: ${name}`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handle(request) {
  try {
    switch (request.method) {
      case "initialize":
        send({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
              resources: {},
            },
            serverInfo: {
              name: "starlight-sis",
              version: "0.1.0",
            },
          },
        });
        return;
      case "tools/list":
        send({ jsonrpc: "2.0", id: request.id, result: { tools } });
        return;
      case "tools/call": {
        const result = await callTool(request.params?.name, request.params?.arguments || {});
        send({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          },
        });
        return;
      }
      case "resources/list": {
        const resources = [
          ...vaultNames.map((vault) => ({
            uri: `starlight://vaults/${vault}`,
            name: `SIS ${vault} vault`,
            description: `Canonical SIS vault from ${sisRoot}`,
            mimeType: "application/json",
          })),
          {
            uri: "starlight://evals/patterns",
            name: "SIS pattern learnings",
            description: `Pattern learnings from ${sisRoot}`,
            mimeType: "application/json",
          },
          {
            uri: "starlight://evals/latest-session",
            name: "SIS latest eval session",
            description: `Latest eval session from ${sisRoot}`,
            mimeType: "application/json",
          },
        ];
        send({ jsonrpc: "2.0", id: request.id, result: { resources } });
        return;
      }
      case "resources/read": {
        const uri = String(request.params?.uri || "");
        let resource;
        if (uri.startsWith("starlight://vaults/")) {
          resource = resourceForVault(uri.split("/").pop());
        } else if (uri === "starlight://evals/patterns") {
          resource = patternResource();
        } else if (uri === "starlight://evals/latest-session") {
          resource = latestSession() || patternResource();
        } else {
          throw new Error(`Unknown resource: ${uri}`);
        }
        send({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            contents: [
              {
                uri: resource.uri,
                mimeType: resource.mimeType,
                text: resource.text,
              },
            ],
          },
        });
        return;
      }
      case "notifications/initialized":
        return;
      default:
        send({
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32601, message: `Method not found: ${request.method}` },
        });
    }
  } catch (error) {
    send({
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : "Internal server error",
      },
    });
  }
}

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    handle(JSON.parse(trimmed));
  } catch {
    // Ignore malformed input from non-MCP callers.
  }
});

process.stderr.write(`[starlight-sis] serving canonical SIS from ${sisRoot}\n`);
