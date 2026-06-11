// Harness adapter — how coding agents (claude/codex/gemini/antigravity-arcanea) build a world.
// An agent reads its assignment from the world's own manifest, writes into canonical folders,
// and commits. Each harness wraps this with its own runtime.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { slugify } from "./manifest.mjs";
import { writeFiles } from "./fs-world.mjs";

const exec = promisify(execFile);

/** The agents in this world assigned to a given harness ('any' matches all). */
export function assignmentsFor(manifest, harness) {
  return (manifest.agents || []).filter((a) => a.harness === harness || a.harness === "any");
}

export async function addCharacter(dir, character) {
  const body = `---
name: ${character.name}
role: ${character.role || "inhabitant"}
visibility: ${character.visibility || "public"}
canonLevel: ${character.canonLevel || 1}
---

# ${character.name}

${character.persona || ""}

## Backstory
${character.backstory || ""}
`;
  await writeFiles(dir, [{ path: `characters/${slugify(character.name)}.md`, bytes: body }]);
  return `characters/${slugify(character.name)}.md`;
}

export async function appendLore(dir, { title, body, canonLevel = 2 }) {
  const file = `canon/${slugify(title)}.md`;
  const doc = `---\nvisibility: public\ncanonLevel: ${canonLevel}\n---\n\n# ${title}\n\n${body}\n`;
  await writeFiles(dir, [{ path: file, bytes: doc }]);
  return file;
}

export async function addQuest(dir, { title, body }) {
  const file = `quests/${slugify(title)}.md`;
  await writeFiles(dir, [{ path: file, bytes: `---\nvisibility: public\n---\n\n# ${title}\n\n${body}\n` }]);
  return file;
}

/** Best-effort git commit so an agent's contribution lands in the world's history. */
export async function commitWorld(dir, message) {
  try {
    await exec("git", ["-C", dir, "add", "-A"]);
    await exec("git", ["-C", dir, "commit", "-m", message]);
    const { stdout } = await exec("git", ["-C", dir, "rev-parse", "HEAD"]);
    return { sha: stdout.trim() };
  } catch {
    return null; // not a git repo / nothing to commit — fine for hosted-tier worlds
  }
}

/** A bound context an agent runtime can hand to its tools. */
export function harnessContext({ dir, harness, manifest }) {
  return {
    harness,
    assignments: assignmentsFor(manifest, harness),
    addCharacter: (c) => addCharacter(dir, c),
    appendLore: (l) => appendLore(dir, l),
    addQuest: (q) => addQuest(dir, q),
    commit: (msg) => commitWorld(dir, `[${harness}] ${msg}`),
  };
}
