#!/usr/bin/env node

import { createInterface } from "node:readline";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

const sisRoot = process.env.STARLIGHT_HOME || join(homedir(), ".starlight");
const repoRoot = process.cwd();

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
  const createdAt = entry.createdAt ?? entry.created_at ?? entry.timestamp ?? entry.date ?? null;
  return {
    vault,
    id: entry.id ?? null,
    createdAt,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    content: String(content),
    raw: entry,
  };
}

function vaultEntries(vault) {
  return parseJsonl(join(sisRoot, "vaults", `${vault}.jsonl`)).map((entry) => normalizeEntry(vault, entry));
}

function scoreMatch(entry, query) {
  const haystack = `${entry.content} ${(entry.tags || []).join(" ")} ${JSON.stringify(entry.raw)}`.toLowerCase();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
}

function classifyVault(content, guardian) {
  if (guardian === "Shinkami") return "strategic";
  if (guardian === "Lyssandria" || guardian === "Draconia") return "technical";
  if (guardian === "Leyla" || guardian === "Maylinn") return "creative";
  if (guardian === "Alera" || guardian === "Ino") return "operational";
  if (guardian === "Aiyami" || guardian === "Elara") return "wisdom";
  if (guardian === "Lyria") return "horizon";

  const lower = String(content).toLowerCase();
  const keywordMap = {
    strategic: ["decision", "strategy", "roadmap", "priority", "market", "moat", "plan"],
    technical: ["code", "api", "bug", "fix", "build", "deploy", "database", "typescript"],
    creative: ["design", "voice", "style", "music", "lore", "story", "creative"],
    operational: ["workflow", "process", "session", "ops", "release", "integration"],
    wisdom: ["lesson", "pattern", "insight", "principle", "wisdom", "learn"],
  };

  let bestVault = "operational";
  let bestScore = -1;
  for (const [vault, keywords] of Object.entries(keywordMap)) {
    const score = keywords.reduce((sum, keyword) => sum + (lower.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestVault = vault;
    }
  }
  return bestVault;
}

function runSisWrite(args) {
  const result = spawnSync(process.execPath, ["scripts/sis-write.mjs", ...args], {
    cwd: repoRoot,
    env: { ...process.env, STARLIGHT_HOME: sisRoot },
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "sis-write failed");
  }
  return JSON.parse(result.stdout);
}

function runLegacyExport() {
  const result = spawnSync(process.execPath, ["scripts/sis-legacy-export.mjs"], {
    cwd: repoRoot,
    env: { ...process.env, STARLIGHT_HOME: sisRoot },
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "sis-legacy-export failed");
  }
  return JSON.parse(result.stdout);
}

const tools = [
  {
    name: "vault_remember",
    description: "Store a memory using the legacy Arcanea memory MCP interface, backed by canonical SIS.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string" },
        vault: { type: "string", enum: vaultNames },
        guardian: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: ["content"],
    },
  },
  {
    name: "vault_recall",
    description: "Search across canonical SIS vaults using the legacy Arcanea memory MCP interface.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        vault: { type: "string", enum: vaultNames },
        guardian: { type: "string" },
        limit: { type: "number" },
      },
      required: ["query"],
    },
  },
  {
    name: "vault_recent",
    description: "Get recent canonical SIS entries using the legacy Arcanea memory MCP interface.",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string", enum: vaultNames },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "vault_stats",
    description: "Get SIS-backed memory stats using the legacy Arcanea memory MCP interface.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "horizon_append",
    description: "Append a Horizon entry using canonical SIS storage.",
    inputSchema: {
      type: "object",
      properties: {
        wish: { type: "string" },
        context: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: ["wish", "context"],
    },
  },
  {
    name: "horizon_read",
    description: "Read Horizon entries using canonical SIS storage.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number" },
        search: { type: "string" },
      },
    },
  },
  {
    name: "vault_classify",
    description: "Classify content into the likely vault without writing it.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string" },
        guardian: { type: "string" },
      },
      required: ["content"],
    },
  },
  {
    name: "memory_sync",
    description: "Export canonical SIS into legacy .arcanea/memory compatibility files.",
    inputSchema: { type: "object", properties: {} },
  },
];

async function callTool(name, args = {}) {
  if (name === "vault_remember") {
    const content = String(args.content || "").trim();
    if (!content) throw new Error("content is required");
    const explicitVault = args.vault ? String(args.vault).toLowerCase() : null;
    const guardian = args.guardian ? String(args.guardian) : null;
    const tags = Array.isArray(args.tags) ? args.tags : [];
    const vault = explicitVault || classifyVault(content, guardian);
    const writeArgs = [
      "--vault",
      vault,
      "--content",
      content,
      "--source",
      "arcanea-memory-compat",
    ];
    if (tags.length) writeArgs.push("--tags", tags.join(","));
    if (guardian) writeArgs.push("--category", `guardian:${guardian}`);
    const result = runSisWrite(writeArgs);
    return {
      id: result.entry.id,
      vault,
      guardian,
      tags,
      createdAt: result.entry.createdAt,
      preview: content.slice(0, 100) + (content.length > 100 ? "..." : ""),
      message: `Stored in ${vault} vault`,
    };
  }

  if (name === "vault_recall") {
    const query = String(args.query || "").trim();
    const chosenVault = args.vault ? String(args.vault).toLowerCase() : null;
    const guardian = args.guardian ? String(args.guardian) : null;
    const limit = Number(args.limit || 10);
    const targets = chosenVault ? [chosenVault] : vaultNames;
    let entries = targets.flatMap((vault) => vaultEntries(vault));
    if (guardian) {
      entries = entries.filter((entry) => {
        const rawGuardian = entry.raw.guardian ?? entry.raw.category ?? "";
        return String(rawGuardian).toLowerCase().includes(String(guardian).toLowerCase());
      });
    }
    return entries
      .map((entry) => ({ entry, score: scoreMatch(entry, query) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ entry, score }) => ({
        id: entry.id,
        vault: entry.vault,
        guardian: entry.raw.guardian ?? null,
        score,
        content: entry.content.slice(0, 200) + (entry.content.length > 200 ? "..." : ""),
        tags: entry.tags,
        createdAt: entry.createdAt,
      }));
  }

  if (name === "vault_recent") {
    const chosenVault = args.vault ? String(args.vault).toLowerCase() : null;
    const limit = Number(args.limit || 10);
    const targets = chosenVault ? [chosenVault] : vaultNames;
    return targets
      .flatMap((vault) => vaultEntries(vault))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, limit)
      .map((entry) => ({
        id: entry.id,
        vault: entry.vault,
        guardian: entry.raw.guardian ?? null,
        content: entry.content.slice(0, 150) + (entry.content.length > 150 ? "..." : ""),
        tags: entry.tags,
        createdAt: entry.createdAt,
      }));
  }

  if (name === "vault_stats") {
    const vaults = Object.fromEntries(vaultNames.map((vault) => [vault, vaultEntries(vault).length]));
    const patternCount = parseJsonl(join(sisRoot, "evals", "patterns.jsonl")).length;
    const sessionsDir = join(sisRoot, "evals", "sessions");
    const sessionCount = existsSync(sessionsDir) ? readdirSync(sessionsDir).filter((name) => name.endsWith(".json")).length : 0;
    return { sisRoot, vaults, patternCount, sessionCount };
  }

  if (name === "horizon_append") {
    const wish = String(args.wish || "").trim();
    const context = String(args.context || "").trim();
    const tags = Array.isArray(args.tags) ? args.tags : [];
    if (!wish || !context) throw new Error("wish and context are required");
    const content = context ? `${wish}\n\nContext: ${context}` : wish;
    const result = runSisWrite([
      "--vault",
      "horizon",
      "--content",
      wish,
      "--context",
      context,
      "--author",
      "arcanea-memory-compat",
      "--tags",
      tags.join(","),
    ]);
    return {
      id: result.entry.id,
      vault: "horizon",
      tags,
      createdAt: result.entry.createdAt,
      preview: content.slice(0, 100) + (content.length > 100 ? "..." : ""),
      message: "Permanently appended to the Horizon Vault.",
    };
  }

  if (name === "horizon_read") {
    const limit = Number(args.limit || 10);
    const search = args.search ? String(args.search).trim().toLowerCase() : "";
    let entries = parseJsonl(join(sisRoot, "vaults", "horizon.jsonl"));
    if (search) {
      entries = entries.filter((entry) => JSON.stringify(entry).toLowerCase().includes(search));
    }
    return entries
      .slice(-limit)
      .reverse()
      .map((entry) => ({
        id: entry.id ?? null,
        wish: entry.wish ?? entry.content ?? "",
        context: entry.context ?? null,
        author: entry.author ?? null,
        tags: Array.isArray(entry.tags) ? entry.tags : [],
        createdAt: entry.createdAt ?? null,
      }));
  }

  if (name === "vault_classify") {
    const content = String(args.content || "").trim();
    const guardian = args.guardian ? String(args.guardian) : null;
    if (!content) throw new Error("content is required");
    const vault = classifyVault(content, guardian);
    return {
      vault,
      confidence: 0.6,
      reasoning: guardian ? `Guardian ${guardian} biases routing toward ${vault}` : `Keyword heuristic routed content toward ${vault}`,
      alternateVault: vault === "operational" ? "wisdom" : "operational",
    };
  }

  if (name === "memory_sync") {
    return runLegacyExport();
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
            capabilities: { tools: {} },
            serverInfo: { name: "arcanea-memory-compat", version: "0.1.0" },
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
          result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] },
        });
        return;
      }
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
        code: -32000,
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const request = JSON.parse(trimmed);
    await handle(request);
  } catch (error) {
    send({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
});

process.stderr.write(`[arcanea-memory-compat] serving legacy memory tools from canonical SIS at ${sisRoot}\n`);
