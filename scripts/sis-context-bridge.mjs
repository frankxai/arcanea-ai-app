#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const home = homedir();
const sisRoot = process.env.STARLIGHT_HOME || join(home, ".starlight");
const outputDir = process.env.STARLIGHT_BRIDGE_OUT || join(process.cwd(), ".arcanea", "sis");

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

function truncate(value, length = 180) {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

function summarizePattern(pattern) {
  if (typeof pattern === "string") return pattern;
  const pieces = [
    pattern.pattern,
    pattern.learning,
    pattern.summary,
    pattern.insight,
    pattern.name,
  ].filter(Boolean);
  if (pieces.length > 0) return pieces[0];
  return JSON.stringify(pattern);
}

function summarizeSession(data) {
  if (!data || typeof data !== "object") return null;
  const sessionId = data.session_id ?? data.id ?? null;
  const guardian = data.guardian ?? data.agent ?? null;
  const duration = data.duration_hours ?? data.duration ?? null;
  const scorePairs =
    data.scores && typeof data.scores === "object"
      ? Object.entries(data.scores)
          .slice(0, 5)
          .map(([key, value]) => `${key}: ${value}`)
      : [];
  const highlights = [];
  if (sessionId) highlights.push(`session ${sessionId}`);
  if (guardian) highlights.push(`guardian ${guardian}`);
  if (duration) highlights.push(`duration ${duration}h`);
  if (scorePairs.length > 0) highlights.push(`scores ${scorePairs.join(", ")}`);
  return highlights.join(" | ");
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

function latestSessionSummary() {
  const sessionsDir = join(sisRoot, "evals", "sessions");
  if (!existsSync(sessionsDir)) return null;
  const files = readdirSync(sessionsDir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (files.length === 0) return null;
  const latest = files[files.length - 1];
  try {
    return {
      file: latest,
      data: JSON.parse(readFileSync(join(sessionsDir, latest), "utf8")),
    };
  } catch {
    return null;
  }
}

mkdirSync(outputDir, { recursive: true });

const vaults = {};
for (const name of vaultNames) {
  const entries = parseJsonl(join(sisRoot, "vaults", `${name}.jsonl`)).map((entry) =>
    normalizeEntry(name, entry),
  );
  vaults[name] = entries;
}

const patterns = parseJsonl(join(sisRoot, "evals", "patterns.jsonl"));
const latestSession = latestSessionSummary();

const lines = [
  "# SIS Bridge Summary",
  "",
  `- Canonical SIS home: \`${sisRoot}\``,
  `- Generated at: \`${new Date().toISOString()}\``,
  "",
  "## Vault Stats",
  "",
  "| Vault | Entries | Latest |",
  "| --- | ---: | --- |",
];

for (const name of vaultNames) {
  const entries = vaults[name];
  const latest = entries[entries.length - 1]?.createdAt ?? "-";
  lines.push(`| ${name} | ${entries.length} | ${latest} |`);
}

lines.push("");
lines.push("## Latest Highlights");
lines.push("");

for (const name of vaultNames) {
  const entries = vaults[name].slice(-3).reverse();
  if (entries.length === 0) continue;
  lines.push(`### ${name}`);
  lines.push("");
  for (const entry of entries) {
    const tagText = entry.tags.length ? ` [${entry.tags.join(", ")}]` : "";
    const dateText = entry.createdAt ? ` (${entry.createdAt})` : "";
    lines.push(`- ${truncate(entry.content)}${tagText}${dateText}`);
  }
  lines.push("");
}

lines.push("## Pattern Learnings");
lines.push("");
if (patterns.length === 0) {
  lines.push("- No pattern learnings found.");
} else {
  for (const pattern of patterns.slice(-6).reverse()) {
    const text = summarizePattern(pattern);
    lines.push(`- ${truncate(String(text))}`);
  }
}
lines.push("");

lines.push("## Latest Session Eval");
lines.push("");
if (!latestSession) {
  lines.push("- No session eval found.");
} else {
  lines.push(`- File: \`${latestSession.file}\``);
  lines.push(`- Summary: ${truncate(summarizeSession(latestSession.data) ?? JSON.stringify(latestSession.data))}`);
}
lines.push("");

writeFileSync(join(outputDir, "summary.md"), lines.join("\n"), "utf8");
writeFileSync(
  join(outputDir, "snapshot.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sisRoot,
      vaults,
      patterns,
      latestSession,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`SIS bridge summary written to ${join(outputDir, "summary.md")}`);
