#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LOOP_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = join(LOOP_DIR, "..", "..");
const LAB = join(REPO, ".arcanea", "image-lab");
const failures = [];

const proofPath = join(LOOP_DIR, "proofs", "latest-dispatch.json");
if (!existsSync(proofPath)) failures.push("no proofs/latest-dispatch.json — dispatcher has not run");

const REQUIRED = ["id", "run", "engine", "harness", "ship_status"];
const VALID_ENGINES = new Set(["higgsfield", "gpt-image-2", "nb2", "grok-imagine", "arcanea-mcp"]);
const VALID_STATUS = new Set(["queued", "raw", "iterate", "approved", "flagship", "killed"]);

const runs = existsSync(LAB)
  ? readdirSync(LAB, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name.startsWith("run-")).map((d) => d.name)
  : [];

for (const run of runs) {
  const ledgerPath = join(LAB, run, "ledger.csv");
  if (!existsSync(ledgerPath)) { failures.push(`${run}: missing ledger.csv`); continue; }
  const lines = readFileSync(ledgerPath, "utf8").split(/\r?\n/).filter((l) => l.trim());
  const header = lines[0].split(",");
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  for (const req of REQUIRED) if (!(req in idx)) failures.push(`${run}: ledger missing column '${req}'`);
  for (const [n, line] of lines.slice(1).entries()) {
    const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replaceAll('""', '"')) ?? [];
    const get = (k) => cells[idx[k]] ?? "";
    if (!VALID_ENGINES.has(get("engine"))) failures.push(`${run} row ${n + 1}: invalid engine '${get("engine")}'`);
    if (!VALID_STATUS.has(get("ship_status"))) failures.push(`${run} row ${n + 1}: invalid ship_status '${get("ship_status")}'`);
    if (["approved", "flagship"].includes(get("ship_status"))) {
      if (!get("gate_30_score")) failures.push(`${run} row ${n + 1}: ${get("ship_status")} without gate_30_score`);
      const asset = get("asset_path").split(/[\\/]/).pop();
      const day = get("ts").slice(0, 10);
      const sidecar = join(LAB, "approved", day, `${asset}.json`);
      if (!asset || !existsSync(sidecar)) failures.push(`${run} row ${n + 1}: ${get("ship_status")} asset missing sidecar at approved/${day}/${asset}.json`);
    }
  }
}

if (failures.length) {
  console.error(`GATE FAIL (${failures.length}):`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`GATE PASS — ${runs.length} run workspace(s) checked, dispatch proof present`);
