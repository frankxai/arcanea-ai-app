// Private world memories and deterministic salience-weighted summaries.
// Legacy evolution entry points reject: a memory is not approval to publish canon.

import { randomUUID } from "node:crypto";
import { writeFiles } from "./fs-world.mjs";
import { readRoot, readDirectory, readFile } from "./world-reads.mjs";

const MEM_DIR = ".arcanea/memories";

function memoryError() {
  return Object.assign(
    new Error(
      "Private memory is invalid; repair or retain the affected record before retrying.",
    ),
    { code: "ERR_ARCANEA_MEMORY_INVALID" },
  );
}
function validMemory(record) {
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record) ||
    typeof record.ts !== "string" ||
    !Number.isFinite(Date.parse(record.ts)) ||
    typeof record.content !== "string" ||
    (record.characterId !== null && typeof record.characterId !== "string") ||
    typeof record.salience !== "number" ||
    !Number.isFinite(record.salience) ||
    record.salience < 0 ||
    record.salience > 1
  )
    throw memoryError();
  return record;
}

export async function recordMemory(dir, mem) {
  if (
    !mem ||
    typeof mem !== "object" ||
    Array.isArray(mem) ||
    (typeof mem.salience === "number" && !Number.isFinite(mem.salience)) ||
    (mem.ts != null &&
      (typeof mem.ts !== "string" || !Number.isFinite(Date.parse(mem.ts)))) ||
    (mem.content != null && typeof mem.content !== "string") ||
    (mem.characterId != null && typeof mem.characterId !== "string")
  )
    throw memoryError();
  const ts = mem.ts || new Date().toISOString();
  const rec = {
    ts,
    characterId: mem.characterId || null,
    content: mem.content || "",
    salience:
      typeof mem.salience === "number"
        ? Math.max(0, Math.min(1, mem.salience))
        : 0.5,
    meaningImpact: mem.meaningImpact || null,
  };
  validMemory(rec);
  // Multiple events can share a timestamp. Keep the timestamp in the record,
  // not in an overwrite-prone filename; exclusive creation preserves each event.
  const fname = `${randomUUID()}.json`;
  await writeFiles(
    dir,
    [
      {
        path: `${MEM_DIR}/${fname}`,
        bytes: JSON.stringify(rec, null, 2) + "\n",
      },
    ],
    { exclusive: true },
  );
  return { path: `${MEM_DIR}/${fname}`, record: rec };
}

export async function listMemories(dir) {
  const root = await readRoot(dir);
  const files = await readDirectory(root, MEM_DIR);
  const out = [];
  for (const file of files.filter((name) => name.endsWith(".json"))) {
    const raw = await readFile(root, `${MEM_DIR}/${file}`);
    let record;
    try {
      record = JSON.parse(raw.toString("utf8").replace(/^\uFEFF/, ""));
    } catch {
      throw memoryError();
    }
    out.push(validMemory(record));
  }
  return out.sort((a, b) => a.ts.localeCompare(b.ts));
}

export function distillOffline(memories, { max = 3 } = {}) {
  if (!memories.length) return "";
  const scored = memories
    .map((m) => ({
      ...m,
      score:
        (m.salience || 0.5) +
        (m.meaningImpact ? 0.2 : 0) +
        (Date.parse(m.ts) ? (Date.now() - Date.parse(m.ts)) / -1e13 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
  return scored.map((m) => m.content).join(" · ");
}

function canonPromotionError() {
  const error = new Error(
    "Legacy evolution is disabled: private memories cannot publish canon. " +
      "Use scene start/revise/export for private drafts; canon promotion requires a separate human-approved workflow.",
  );
  error.code = "ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED";
  return error;
}

/** @deprecated Always rejects before reading arguments or accessing the filesystem. */
export async function evolveCharacter() {
  throw canonPromotionError();
}

export async function remember(dir, content, opts = {}) {
  // Refuse a damaged/redirected store before an append could make a failed retry duplicate an event.
  await listMemories(dir);
  const rec = await recordMemory(dir, { content, ...opts });
  const mems = await listMemories(dir);
  const summary = distillOffline(mems);
  return { record: rec, distilled: summary };
}

/** @deprecated Always rejects; caller-supplied approval flags cannot enable promotion. */
export async function evolve() {
  throw canonPromotionError();
}
