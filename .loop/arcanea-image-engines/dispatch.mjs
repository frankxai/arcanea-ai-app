#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LOOP_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = join(LOOP_DIR, "..", "..");
const QUEUE = join(LOOP_DIR, "briefs", "queue.jsonl");
const PROOFS = join(LOOP_DIR, "proofs");

const LANES = {
  cinematic: { engine: "higgsfield", harness: "claude", invocation: "higgsfield-generate skill (draft-then-4K)" },
  text: { engine: "gpt-image-2", harness: "codex", invocation: "Codex image_gen per .loop/arcanea-image-lab" },
  character: { engine: "nb2", harness: "antigravity", invocation: "NB2 / nb-generate.mjs (GEMINI_API_KEY)" },
  volume: { engine: "grok-imagine", harness: "grok-cli", invocation: "Grok CLI / Hermes agent" },
  routed: { engine: "arcanea-mcp", harness: "claude", invocation: "arcanea_generate_image with TASTE reroll" },
};

const LEDGER_HEADER =
  "id,ts,run,batch,engine,harness,model,request_id,prompt_file,asset_path,use_case,world,characters,canon_refs,gate_30_score,gate_verdict,ship_status,failure_modes,next_improvement";

const dryRun = process.argv.includes("--dry-run");
const runId = process.argv.includes("--run")
  ? process.argv[process.argv.indexOf("--run") + 1]
  : `run-${new Date().toISOString().slice(0, 10)}`;

if (!existsSync(QUEUE)) {
  console.error(`no queue at ${QUEUE}`);
  process.exit(1);
}

const briefs = readFileSync(QUEUE, "utf8")
  .split(/\r?\n/)
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));

const pending = briefs.filter((b) => !b.dispatched);
if (pending.length === 0) {
  console.log("queue empty — nothing to dispatch");
  process.exit(0);
}

const runDir = join(REPO, ".arcanea", "image-lab", runId);
const ledgerPath = join(runDir, "ledger.csv");
const decisions = [];

for (const brief of pending) {
  const lane = LANES[brief.need];
  if (!lane) {
    console.error(`brief ${brief.id}: unknown need '${brief.need}' — must be one of ${Object.keys(LANES).join("|")}`);
    process.exit(1);
  }
  const csvSafe = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const row = [
    brief.id, new Date().toISOString(), runId, brief.batch ?? "b0",
    lane.engine, lane.harness, "", "", brief.prompt_file ?? "",
    "", brief.use_case ?? "", brief.world ?? "",
    (brief.characters ?? []).join("|"), (brief.canon_refs ?? []).join("|"),
    "", "", dryRun ? "queued" : "raw", "", "",
  ].map(csvSafe).join(",");

  if (!dryRun || process.argv.includes("--ledger")) {
    mkdirSync(runDir, { recursive: true });
    if (!existsSync(ledgerPath)) writeFileSync(ledgerPath, LEDGER_HEADER + "\n");
    appendFileSync(ledgerPath, row + "\n");
  }
  decisions.push({ brief: brief.id, need: brief.need, ...lane, run: runId, ledgered: !dryRun || process.argv.includes("--ledger") });
  console.log(`${brief.id} → ${lane.engine} (${lane.harness}) :: ${lane.invocation}`);
}

const ledgered = new Set(decisions.filter((d) => d.ledgered).map((d) => d.brief));
if (ledgered.size) {
  const updated = briefs.map((b) =>
    ledgered.has(b.id) ? { ...b, dispatched: true, dispatched_run: runId, dispatched_ts: new Date().toISOString() } : b
  );
  writeFileSync(QUEUE, updated.map((b) => JSON.stringify(b)).join("\n") + "\n");
}

mkdirSync(PROOFS, { recursive: true });
writeFileSync(
  join(PROOFS, "latest-dispatch.json"),
  JSON.stringify({ ts: new Date().toISOString(), dryRun, run: runId, decisions }, null, 2)
);
console.log(`${decisions.length} brief(s) dispatched${dryRun ? " (dry-run)" : ""} — proof at proofs/latest-dispatch.json`);
