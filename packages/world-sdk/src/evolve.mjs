// Evolution — characters that EVOLVE, not just remember. The moat mechanic.
// Memories accumulate in .arcanea/memories/ (tooling space: excluded from the public
// content hash, never snapshotted). Evolution distills them into a changed character
// and NEW public canon — so the world visibly grows from being lived in.

import { promises as fs } from "node:fs";
import path from "node:path";
import { slugify } from "./manifest.mjs";
import { parseFrontmatter, writeFiles } from "./fs-world.mjs";

const MEM_DIR = ".arcanea/memories";

/** Append one memory for a character. Returns the memory record. */
export async function recordMemory(dir, { character, content, salience = 0.5, actor = "visitor", at }) {
  if (!character || !content) throw new Error("recordMemory needs { character, content }");
  const slug = slugify(character);
  const rec = { character: slug, content, salience, actor, at: at || new Date().toISOString() };
  const file = path.join(dir, MEM_DIR, `${slug}.jsonl`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, JSON.stringify(rec) + "\n", "utf8");
  return rec;
}

export async function loadMemories(dir, character) {
  const file = path.join(dir, MEM_DIR, `${slugify(character)}.jsonl`);
  try {
    const raw = await fs.readFile(file, "utf8");
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

const STOP = new Set(
  "a an the of in on at to and or but is are was were has have had she he they her his their it its with as by for from into that this who whom what when where why how not no never always".split(" "),
);

/** Deterministic distiller: salience-weighted themes + a disposition shift. LLM-pluggable. */
export function distillOffline(memories) {
  const weights = new Map();
  let salienceSum = 0;
  for (const m of memories) {
    salienceSum += m.salience;
    for (const w of (m.content.toLowerCase().match(/[a-z]+/g) || [])) {
      if (w.length > 3 && !STOP.has(w)) weights.set(w, (weights.get(w) || 0) + m.salience);
    }
  }
  const themes = [...weights.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 4).map(([w]) => w);
  const avg = memories.length ? salienceSum / memories.length : 0;
  const disposition = avg > 0.66 ? "transformed" : avg > 0.4 ? "shifting" : "stirring";
  return {
    disposition,
    themes,
    interactions: memories.length,
    summary: `Shaped by ${memories.length} remembered ${memories.length === 1 ? "moment" : "moments"}, drawn toward ${themes.slice(0, 2).join(" and ") || "something unnamed"}.`,
  };
}

function upsertEvolutionSection(body, state) {
  const section = `## Evolution

*${state.disposition}* — ${state.summary}

- Interactions: ${state.interactions}
- Drawn toward: ${state.themes.join(", ") || "—"}
`;
  const re = /## Evolution[\s\S]*?(?=\n## |$)/;
  return re.test(body) ? body.replace(re, section) : body.trimEnd() + "\n\n" + section;
}

function serializeFrontmatter(data) {
  return "---\n" + Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n---\n";
}

/**
 * Distill a character's memories into visible change: an updated character file
 * (frontmatter `evolution` + an Evolution section) and a new emergent canon entry.
 * @param {{dir:string, character:string, distill?:(mem:object[])=>object|Promise<object>, at?:string}} args
 */
export async function evolveCharacter({ dir, character, distill, at }) {
  const slug = slugify(character);
  const memories = await loadMemories(dir, slug);
  if (!memories.length) return { evolved: false, reason: "no memories" };

  let state;
  try {
    state = await (distill || distillOffline)(memories);
  } catch {
    state = distillOffline(memories); // a flaky model never blocks evolution
  }

  const charPath = path.join(dir, "characters", `${slug}.md`);
  const raw = await fs.readFile(charPath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  data.evolution = state.disposition;
  data.evolvedAt = at || new Date().toISOString();
  const next = serializeFrontmatter(data) + "\n" + upsertEvolutionSection(body.trimStart(), state);
  await fs.writeFile(charPath, next, "utf8");

  const generation = memories.length;
  const loreFile = `canon/emergent/${slug}-${String(generation).padStart(3, "0")}.md`;
  const name = data.name || character;
  await writeFiles(dir, [
    {
      path: loreFile,
      bytes: `---\nvisibility: public\ncanonLevel: 2\nsubject: ${name}\n---\n\n# ${name}, ${state.disposition}\n\n${state.summary} The Archive records it: what is lived here is not lost — it becomes canon.\n`,
    },
  ]);

  return { evolved: true, state, characterFile: `characters/${slug}.md`, loreFile };
}

/** Evolve every character that has accumulated memories. */
export async function evolveWorld({ dir, distill, at }) {
  let slugs = [];
  try {
    slugs = (await fs.readdir(path.join(dir, MEM_DIR))).filter((f) => f.endsWith(".jsonl")).map((f) => f.replace(/\.jsonl$/, ""));
  } catch {
    return { evolved: [] };
  }
  const evolved = [];
  for (const slug of slugs) {
    const res = await evolveCharacter({ dir, character: slug, distill, at });
    if (res.evolved) evolved.push({ character: slug, ...res });
  }
  return { evolved };
}
