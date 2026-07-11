#!/usr/bin/env node
/**
 * check-facts-drift — fails when a public surface hardcodes a platform number
 * instead of importing it from lib/facts.ts (or lib/public-repo-registry.ts).
 *
 * Why: the site once claimed 13, 16, and 7 agents — and 42, 43, 80, 97, and
 * 160 tools/skills — at the same time, on different pages. Numbers drift the
 * moment they are typed twice.
 *
 * Usage: node apps/web/scripts/check-facts-drift.mjs   (run from repo root or apps/web)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const WEB_ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SCAN_DIRS = ["app", "components"].map((d) => join(WEB_ROOT, d));

// Historical/editorial content may cite numbers as of their publish date.
const EXEMPT = [
  ["app", "blog"],
  ["app", "changelog"],
  ["lib"],
  ["app", "api"],
].map((p) => p.join(sep));

// Claim-shaped patterns that must come from FACTS, not literals.
const PATTERNS = [
  { re: /\b\d{1,3}\+?\s+(?:specialist agents?|specialists|configured specialist)\b/gi, hint: "FACTS.luminors" },
  { re: /\b\d{1,3}\s+Luminors\b/g, hint: "FACTS.luminors" },
  { re: /\b\d{1,3}\+?\s+(?:MCP\s+)?tools\b/gi, hint: "FACTS.mcpTools" },
  { re: /\b\d{1,3}\+?\s+(?:creator\s+)?skills\b/gi, hint: "FACTS.skills" },
  { re: /\b\d{1,3}\s+(?:npm\s+)?packages\b/gi, hint: "PUBLIC_REPO_SUMMARY.packages" },
  { re: /\b\d{1,3}\s+(?:public\s+|active\s+)?repos(?:itories)?\b/gi, hint: "PUBLIC_REPO_SUMMARY" },
];

const findings = [];

function scan(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const rel = relative(WEB_ROOT, p);
    if (EXEMPT.some((e) => rel.startsWith(e))) continue;
    const st = statSync(p);
    if (st.isDirectory()) {
      scan(p);
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry) || /\.(test|spec)\./.test(entry)) continue;
    const src = readFileSync(p, "utf-8");
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      // Template-literal interpolations of FACTS/registry values are the fix, not drift.
      if (line.includes("FACTS.") || line.includes("PUBLIC_REPO_SUMMARY")) return;
      // `facts-ok` annotates numbers that are contextually correct (skill-tree nodes, per-request caps).
      if (line.includes("facts-ok")) return;
      if (/^\s*(\/\/|\/?\*)/.test(line)) return; // comments
      for (const { re, hint } of PATTERNS) {
        re.lastIndex = 0;
        const m = re.exec(line);
        if (m) findings.push({ file: rel, line: i + 1, match: m[0], hint });
      }
    });
  }
}

SCAN_DIRS.forEach(scan);

const strict = process.argv.includes("--strict");

if (findings.length) {
  console.error(`\nFacts drift: ${findings.length} hardcoded platform number(s) found.\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  "${f.match}"  → use ${f.hint}`);
  }
  console.error("\nImport the value from lib/facts.ts (or lib/public-repo-registry.ts) instead of typing it.");
  if (strict) process.exit(1);
  console.error("\n(advisory mode — pass --strict to fail the build once the long tail is burned down)");
  process.exit(0);
}
console.log("Facts drift: clean — no hardcoded platform numbers on public surfaces.");
