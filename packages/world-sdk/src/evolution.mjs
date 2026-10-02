// Evolution engine — the lived-in moat. Memories (tooling, .arcanea/) accumulate privately.
// Distill produces salience-weighted summary (deterministic core; LLM optional for prose).
// Memory does not authorize publication. Legacy evolution APIs are blocked
// until a separate human-reviewed promotion workflow exists (issue #283).

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MEM_DIR = ".arcanea/memories";

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true });
}

export async function recordMemory(dir, mem) {
  const ts = mem.ts ?? new Date().toISOString();
  if (
    typeof ts !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(
      ts,
    ) ||
    !Number.isFinite(Date.parse(ts))
  ) {
    const error = new Error(
      "Memory timestamp must be a parseable ISO date-time.",
    );
    error.code = "INVALID_MEMORY_TIMESTAMP";
    throw error;
  }
  await ensureDir(path.join(dir, MEM_DIR));
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
  // Same-millisecond records are distinct. Exclusive creation prevents an
  // existing destination from being overwritten even on an ID collision.
  const fname = `${new Date(ts).toISOString().replace(/[:.]/g, "-")}-${randomUUID()}.json`;
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

function promotionError() {
  const error = new Error(
    "Memory cannot promote public canon. Keep the proposal separate for human review; the SDK has no promotion-receipt verifier.",
  );
  error.code = "CANON_PROMOTION_REQUIRES_REVIEW";
  return error;
}

export async function evolveCharacter(_dir, _characterSlug, _opts = {}) {
  throw promotionError();
}

export async function remember(dir, content, opts = {}) {
  const rec = await recordMemory(dir, { content, ...opts });
  const mems = await listMemories(dir);
  const summary = distillOffline(mems);
  return { record: rec, distilled: summary };
}

export async function evolve(_dir, _characterSlug, _opts = {}) {
  throw promotionError();
}
