#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { homedir } from "node:os";
import { SIS_VAULT_NAMES, validateSisWriteInput } from "./sis-schema.mjs";

const sisRoot = process.env.STARLIGHT_HOME || join(homedir(), ".starlight");

function ensureLayout() {
  mkdirSync(join(sisRoot, "vaults"), { recursive: true });
  mkdirSync(join(sisRoot, "evals", "sessions"), { recursive: true });
  mkdirSync(join(sisRoot, "graph"), { recursive: true });
}

function slugPart(value, fallback = "entry") {
  return (
    String(value || fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || fallback
  );
}

function buildEntry({
  vault,
  content,
  tags = [],
  category,
  source = "mcp",
  confidence = "medium",
  author,
  context,
  entryType = "generic",
  metadata = {},
}) {
  const createdAt = new Date().toISOString();
  const prefix = vault === "operational" ? "ops" : vault.slice(0, 5);
  const id = `${prefix}_${createdAt.replace(/[-:TZ.]/g, "").slice(0, 14)}_${slugPart(category || content).slice(0, 12)}`;

  if (vault === "horizon") {
    return {
      id,
      wish: content,
      context: context || null,
      author: author || "Frank",
      coAuthored: false,
      tags,
      entryType,
      metadata: { ...metadata, entryType },
      createdAt,
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
    metadata: { ...metadata, entryType },
    createdAt,
  };
}

function appendJsonl(filePath, entry) {
  const line = `${JSON.stringify(entry)}\n`;
  if (!existsSync(filePath)) {
    writeFileSync(filePath, line, "utf8");
    return;
  }
  const existing = readFileSync(filePath, "utf8");
  const prefix = existing.endsWith("\n") ? "" : "\n";
  writeFileSync(filePath, `${existing}${prefix}${line}`, "utf8");
}

function vaultCount(vault) {
  const filePath = join(sisRoot, "vaults", `${vault}.jsonl`);
  if (!existsSync(filePath)) return 0;
  const raw = readFileSync(filePath, "utf8").trim();
  if (!raw) return 0;
  return raw.split(/\r?\n/).filter(Boolean).length;
}

function send(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function sendError(id, message, code = -32000) {
  process.stdout.write(
    `${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}\n`,
  );
}

function toolResult(text) {
  return { content: [{ type: "text", text }] };
}

function handleCall(id, params = {}) {
  const name = params.name;
  const args = params.arguments || {};

  if (name === "sis_append_entry") {
    const validation = validateSisWriteInput(args);
    if (!validation.valid) {
      sendError(id, validation.errors.join("; "), -32602);
      return;
    }
    ensureLayout();
    const entry = buildEntry(validation.normalized);
    const filePath = join(
      sisRoot,
      "vaults",
      `${validation.normalized.vault}.jsonl`,
    );
    appendJsonl(filePath, entry);
    send(
      id,
      toolResult(
        JSON.stringify(
          { ok: true, sisRoot, vault: validation.normalized.vault, entry },
          null,
          2,
        ),
      ),
    );
    return;
  }

  if (name === "sis_stats") {
    ensureLayout();
    const vaultCounts = Object.fromEntries(
      SIS_VAULT_NAMES.map((vault) => [vault, vaultCount(vault)]),
    );
    send(
      id,
      toolResult(JSON.stringify({ ok: true, sisRoot, vaultCounts }, null, 2)),
    );
    return;
  }

  sendError(id, `Unknown tool: ${name}`, -32601);
}

ensureLayout();

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  if (!line.trim()) return;

  let message;
  try {
    message = JSON.parse(line);
  } catch {
    sendError(null, "Invalid JSON", -32700);
    return;
  }

  if (message.method === "initialize") {
    send(message.id, {
      protocolVersion: "2025-06-18",
      serverInfo: { name: "starlight-sis", version: "0.1.0" },
      capabilities: { tools: {} },
    });
    return;
  }

  if (message.method === "tools/list") {
    send(message.id, {
      tools: [
        {
          name: "sis_append_entry",
          description: "Append a canonical SIS memory entry.",
        },
        { name: "sis_stats", description: "Return SIS vault counts." },
      ],
    });
    return;
  }

  if (message.method === "tools/call") {
    handleCall(message.id, message.params);
    return;
  }

  sendError(message.id, `Unknown method: ${message.method}`, -32601);
});
