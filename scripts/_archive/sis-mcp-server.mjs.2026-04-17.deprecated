#!/usr/bin/env node

import { createInterface } from "node:readline";
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { normalizeSisReadEntry, validateSisWriteInput, SIS_ENTRY_TYPES, SIS_VAULT_NAMES } from "./sis-schema.mjs";

const home = homedir();
const sisRoot = process.env.STARLIGHT_HOME || join(home, ".starlight");
const vaultNames = SIS_VAULT_NAMES;

function ensureSisLayout() {
  mkdirSync(join(sisRoot, "vaults"), { recursive: true });
  mkdirSync(join(sisRoot, "evals", "sessions"), { recursive: true });
  mkdirSync(join(sisRoot, "graph"), { recursive: true });
}

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
  return normalizeSisReadEntry(vault, entry);
}

function vaultEntries(vault) {
  return parseJsonl(join(sisRoot, "vaults", `${vault}.jsonl`)).map((entry) =>
    normalizeEntry(vault, entry),
  );
}

function slugPart(value, fallback = "entry") {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || fallback;
}

function parseTags(value) {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildEntry({ vault, content, tags = [], category, source = "mcp", confidence = "medium", author, context, entryType = "generic", metadata = {} }) {
  const timestamp = new Date().toISOString();
  const prefix = vault === "operational" ? "ops" : vault.slice(0, 5);
  const id = `${prefix}_${timestamp.replace(/[-:TZ.]/g, "").slice(0, 14)}_${slugPart(category || content, "entry").slice(0, 12)}`;

  if (vault === "horizon") {
    return {
      id,
      wish: content,
      context: context || null,
      author: author || "Frank",
      coAuthored: false,
      tags,
      entryType,
      metadata: {
        ...metadata,
        entryType,
      },
      createdAt: timestamp,
    };
  }

  return {
    id,
    insight: content,
    category: category || "general",
    confidence,
    source,
    tags,
    entryType,
    metadata: {
      ...metadata,
      entryType,
    },
    createdAt: timestamp,
  };
}

function appendJsonl(path, entry) {
  const line = `${JSON.stringify(entry)}\n`;
  if (!existsSync(path)) {
    writeFileSync(path, line, "utf8");
    return;
  }
  const existing = readFileSync(path, "utf8");
  const prefix = existing.endsWith("\n") ? "" : "\n";
  writeFileSync(path, `${existing}${prefix}${line}`, "utf8");
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
  {
    name: "sis_append_entry",
    description: "Append a structured entry into a canonical SIS vault in ~/.starlight.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string", enum: vaultNames },
        content: { type: "string" },
        entryType: { type: "string", enum: Object.keys(SIS_ENTRY_TYPES) },
        tags: {
          oneOf: [
            { type: "array", items: { type: "string" } },
            { type: "string" },
          ],
        },
        category: { type: "string" },
        source: { type: "string" },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
        author: { type: "string" },
        context: { type: "string" },
        metadata: { type: "object" },
        project: { type: "string" },
        routine: { type: "string" },
        state: { type: "string" },
        packName: { type: "string" },
        assetName: { type: "string" },
      },
      required: ["vault", "content"],
    },
  },
  {
    name: "sis_entry_types",
    description: "List supported SIS entry types and required metadata fields.",
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

  if (name === "sis_append_entry") {
    const validation = validateSisWriteInput({
      vault: args.vault,
      content: args.content,
      tags: args.tags,
      category: args.category,
      source: args.source,
      confidence: args.confidence,
      author: args.author,
      context: args.context,
      entryType: args.entryType,
      metadata: args.metadata,
      project: args.project,
      routine: args.routine,
      state: args.state,
      packName: args.packName,
      assetName: args.assetName,
    });
    if (!validation.valid) {
      throw new Error(validation.errors.join("; "));
    }

    ensureSisLayout();
    const entry = buildEntry({
      ...validation.normalized,
    });
    const path = join(sisRoot, "vaults", `${validation.normalized.vault}.jsonl`);
    appendJsonl(path, entry);
    return { ok: true, sisRoot, vault: validation.normalized.vault, path, warnings: validation.warnings, entry };
  }

  if (name === "sis_entry_types") {
    return {
      entryTypes: Object.entries(SIS_ENTRY_TYPES).map(([name, def]) => ({
        name,
        description: def.description,
        requiredMetadata: def.requiredMetadata,
      })),
    };
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
