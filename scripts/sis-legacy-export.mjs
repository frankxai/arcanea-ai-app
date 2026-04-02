#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const sisRoot = process.env.STARLIGHT_HOME || join(homedir(), ".starlight");
const repoRoot = process.cwd();
const outputRoot = process.env.LEGACY_MEMORY_OUT || join(repoRoot, ".arcanea", "memory");
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

  return {
    id: entry.id ?? `${vault}_${Date.now()}`,
    content: String(content),
    vault,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    confidence: entry.confidence ?? "medium",
    guardian: entry.guardian ?? null,
    metadata: {
      category: entry.category ?? null,
      source: entry.source ?? null,
      raw: entry,
    },
    createdAt: Date.parse(entry.createdAt ?? entry.created_at ?? entry.timestamp ?? entry.date ?? new Date().toISOString()),
    updatedAt: Date.parse(entry.createdAt ?? entry.created_at ?? entry.timestamp ?? entry.date ?? new Date().toISOString()),
    source: entry.source ?? "sis-canonical",
  };
}

function toSummaryLine(entry) {
  const preview = entry.content.replace(/\s+/g, " ").slice(0, 120);
  const tags = entry.tags.length ? ` [${entry.tags.join(", ")}]` : "";
  return `- ${preview}${preview.length === 120 ? "..." : ""}${tags}`;
}

mkdirSync(join(outputRoot, "vaults"), { recursive: true });
mkdirSync(join(outputRoot, "horizon"), { recursive: true });

const snapshot = {};
const memoryLines = [
  "# Arcanea Memory - Canonical SIS Export",
  "",
  `- Source: \`${sisRoot}\``,
  `- Exported: \`${new Date().toISOString()}\``,
  "",
];

for (const vault of vaultNames) {
  const sourcePath = join(sisRoot, "vaults", `${vault}.jsonl`);
  const rawEntries = parseJsonl(sourcePath);
  const entries = rawEntries.map((entry) => normalizeEntry(vault, entry));
  snapshot[vault] = entries;

  const legacyFile = join(outputRoot, "vaults", `${vault}.json`);
  const legacyPayload = {
    entries: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
  };
  writeFileSync(legacyFile, JSON.stringify(legacyPayload, null, 2), "utf8");

  if (vault !== "horizon") {
    memoryLines.push(`## ${vault[0].toUpperCase()}${vault.slice(1)} Vault`);
    memoryLines.push("");
    if (entries.length === 0) {
      memoryLines.push("- No entries.");
    } else {
      for (const entry of entries.slice(-5).reverse()) {
        memoryLines.push(toSummaryLine(entry));
      }
    }
    memoryLines.push("");
  }
}

const horizonEntries = parseJsonl(join(sisRoot, "vaults", "horizon.jsonl"));
writeFileSync(
  join(outputRoot, "horizon", "ledger.jsonl"),
  horizonEntries.map((entry) => JSON.stringify(entry)).join("\n") + (horizonEntries.length ? "\n" : ""),
  "utf8",
);

memoryLines.push("## Horizon Vault");
memoryLines.push("");
if (horizonEntries.length === 0) {
  memoryLines.push("- No entries.");
} else {
  for (const entry of horizonEntries.slice(-5).reverse()) {
    memoryLines.push(`- ${String(entry.wish ?? entry.content ?? JSON.stringify(entry)).slice(0, 120)}`);
  }
}
memoryLines.push("");

writeFileSync(join(outputRoot, "MEMORY.md"), memoryLines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      sisRoot,
      outputRoot,
      vaultCounts: Object.fromEntries(vaultNames.map((vault) => [vault, snapshot[vault].length])),
      horizonCount: horizonEntries.length,
    },
    null,
    2,
  ),
);
