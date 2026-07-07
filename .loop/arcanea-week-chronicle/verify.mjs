#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LOOP_DIR = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(LOOP_DIR, "..", "..", "..", "..", "queen", "reports");
const dateStr = new Date().toISOString().slice(0, 10);
const failures = [];

const jsonPath = join(REPORTS_DIR, `arcanea-week-${dateStr}.json`);
const htmlPath = join(REPORTS_DIR, `arcanea-week-${dateStr}.html`);

if (!existsSync(jsonPath)) failures.push(`missing ${jsonPath}`);
if (!existsSync(htmlPath)) failures.push(`missing ${htmlPath}`);

if (existsSync(jsonPath)) {
  const report = JSON.parse(readFileSync(jsonPath, "utf8"));
  const TRACKED = ["arcanea-ai-app", "arcanea-ecosystem", "arcanea-mcp", "arcanea-onchain",
    "arcanea-studio", "arcanea-agent-skills", "arcanea-orchestrator", "arcanea-claw", "AnimeLegends"];
  const covered = new Set((report.repos ?? []).map((r) => r.repo));
  for (const t of TRACKED) if (!covered.has(t)) failures.push(`repo not covered: ${t}`);
  if (typeof report.totals?.commits !== "number") failures.push("totals.commits missing");
  const quiet = report.totals?.quiet_repos;
  if (!Array.isArray(quiet)) failures.push("quiet repos not listed explicitly");
}
if (existsSync(htmlPath) && readFileSync(htmlPath, "utf8").length < 1000) failures.push("html suspiciously small");

if (failures.length) {
  console.error(`GATE FAIL (${failures.length}):`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log("GATE PASS — weekly chronicle exists, all tracked repos covered, quiet repos explicit");
