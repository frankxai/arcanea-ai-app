// Evolution engine — the lived-in moat. Memories (tooling, .arcanea/) accumulate privately.
// Distill produces salience-weighted summary (deterministic core; LLM optional for prose).
// Evolve writes character delta + new public canonLevel-2 lore so the world visibly changes and contentHash moves.

import { promises as fs } from "node:fs";
import path from "node:path";
import { readWorld, writeFiles, parseFrontmatter } from "./fs-world.mjs";
import { slugify } from "./manifest.mjs";

const MEM_DIR = ".arcanea/memories";

async function ensureDir(d) { await fs.mkdir(d, { recursive: true }); }

export async function recordMemory(dir, mem) {
  await ensureDir(path.join(dir, MEM_DIR));
  const ts = mem.ts || new Date().toISOString();
  const rec = {
    ts,
    characterId: mem.characterId || null,
    content: mem.content || "",
    salience: typeof mem.salience === "number" ? Math.max(0, Math.min(1, mem.salience)) : 0.5,
    meaningImpact: mem.meaningImpact || null,
  };
  const fname = `${ts.replace(/[:.]/g, "-")}.json`;
  await fs.writeFile(path.join(dir, MEM_DIR, fname), JSON.stringify(rec, null, 2) + "\n");
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
  } catch { return []; }
}

export function distillOffline(memories, { max = 3 } = {}) {
  if (!memories.length) return "";
  const scored = memories
    .map((m) => ({ ...m, score: (m.salience || 0.5) + (m.meaningImpact ? 0.2 : 0) + (Date.parse(m.ts) ? (Date.now() - Date.parse(m.ts)) / -1e13 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
  return scored.map((m) => m.content).join(" · ");
}

export async function evolveCharacter(dir, characterSlug, { summary, ts = new Date().toISOString() } = {}) {
  const charPath = `characters/${characterSlug}.md`;
  const full = path.join(dir, charPath);
  let body = "";
  try { body = await fs.readFile(full, "utf8"); } catch { body = `---\nname: ${characterSlug}\n---\n\n# ${characterSlug}\n`; }
  const { data, body: rest } = parseFrontmatter(body);
  const evoBlock = `\n\n## Evolution\n\n**Transformed by lived moments** (${ts.slice(0,10)})\n\n${summary || "The world changed them."}\n`;
  const updated = body.trimEnd() + evoBlock;
  await writeFiles(dir, [{ path: charPath, bytes: updated }]);

  const loreTitle = `Echoes of ${data.name || characterSlug}`;
  const loreBody = `---\nvisibility: public\ncanonLevel: 2\n---\n\n# ${loreTitle}\n\n${summary || "What was lived became canon."}\n\n*Written by no one. Earned by everyone.*\n`;
  const lorePath = `canon/${slugify(loreTitle)}.md`;
  await writeFiles(dir, [{ path: lorePath, bytes: loreBody }]);

  return { character: charPath, lore: lorePath };
}

export async function remember(dir, content, opts = {}) {
  const rec = await recordMemory(dir, { content, ...opts });
  const mems = await listMemories(dir);
  const summary = distillOffline(mems);
  return { record: rec, distilled: summary };
}

export async function evolve(dir, characterSlug, opts = {}) {
  const mems = await listMemories(dir);
  const summary = opts.summary || distillOffline(mems, { max: 4 }) || "Moments accumulated and the character shifted.";
  const res = await evolveCharacter(dir, characterSlug, { summary, ts: opts.ts });
  const w = await readWorld(dir);
  return { ...res, summary, newHashWillDiffer: true, world: { id: w.manifest.id, name: w.manifest.name } };
}
