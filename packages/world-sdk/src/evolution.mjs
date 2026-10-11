// Private world memories and deterministic salience-weighted summaries.
// Legacy evolution entry points reject: a memory is not approval to publish canon.

import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

const MEM_DIR = ".arcanea/memories";

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true });
}

export async function recordMemory(dir, mem) {
  await ensureDir(path.join(dir, MEM_DIR));
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
  // Multiple events can share a timestamp. Keep the timestamp in the record,
  // not in an overwrite-prone filename; exclusive creation preserves each event.
  const fname = `${randomUUID()}.json`;
  await fs.writeFile(
    path.join(dir, MEM_DIR, fname),
    JSON.stringify(rec, null, 2) + "\n",
    { flag: "wx" },
  );
  return { path: `${MEM_DIR}/${fname}`, record: rec };
}

export async function listMemories(dir) {
  const p = path.join(dir, MEM_DIR);
  try {
    const files = await fs.readdir(p);
    const out = [];
    for (const f of files.filter((f) => f.endsWith(".json"))) {
      const raw = await fs.readFile(path.join(p, f), "utf8");
      out.push(JSON.parse(raw));
    }
    return out.sort((a, b) => a.ts.localeCompare(b.ts));
  } catch {
    return [];
  }
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
  const rec = await recordMemory(dir, { content, ...opts });
  const mems = await listMemories(dir);
  const summary = distillOffline(mems);
  return { record: rec, distilled: summary };
}

/** @deprecated Always rejects; caller-supplied approval flags cannot enable promotion. */
export async function evolve() {
  throw canonPromotionError();
}
