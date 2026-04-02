#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { validateSisWriteInput } from "./sis-schema.mjs";

const sisRoot = process.env.STARLIGHT_HOME || join(homedir(), ".starlight");

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function getTimestamp() {
  return new Date().toISOString();
}

function slugPart(value, fallback = "entry") {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || fallback;
}

function ensureSisLayout(root) {
  mkdirSync(join(root, "vaults"), { recursive: true });
  mkdirSync(join(root, "evals", "sessions"), { recursive: true });
  mkdirSync(join(root, "graph"), { recursive: true });
}

function buildEntry({ vault, content, tags = [], category, source = "manual", confidence = "medium", author, context, entryType = "generic", metadata = {} }) {
  const timestamp = getTimestamp();
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

function usage() {
  console.error("Usage: node scripts/sis-write.mjs --vault <vault> --content <text> [--entry-type type] [--metadata '{\"key\":\"value\"}'] [--project name] [--routine name] [--state name] [--pack-name name] [--asset-name name] [--tags a,b] [--category x] [--source x] [--confidence low|medium|high] [--author name] [--context text]");
}

const args = parseArgs(process.argv.slice(2));
const validation = validateSisWriteInput({
  vault: args.vault,
  content: args.content,
  tags: args.tags,
  category: args.category,
  source: args.source,
  confidence: args.confidence,
  author: args.author,
  context: args.context,
  entryType: args["entry-type"] || args.entryType,
  metadata: args.metadata,
  project: args.project,
  routine: args.routine,
  state: args.state,
  packName: args["pack-name"] || args.packName,
  assetName: args["asset-name"] || args.assetName,
});

if (!validation.valid) {
  usage();
  for (const error of validation.errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

ensureSisLayout(sisRoot);

const entry = buildEntry({
  ...validation.normalized,
});

const path = join(sisRoot, "vaults", `${validation.normalized.vault}.jsonl`);
appendJsonl(path, entry);

console.log(
  JSON.stringify(
    {
      ok: true,
      sisRoot,
      vault: validation.normalized.vault,
      path,
      warnings: validation.warnings,
      entry,
    },
    null,
    2,
  ),
);
