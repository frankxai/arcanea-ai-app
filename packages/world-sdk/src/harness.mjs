// Harness adapter — how coding agents (claude/codex/gemini/antigravity/grok-arcanea) build a world.
// Agents read assignments and write append-only local proposals for human review.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { slugify } from "./manifest.mjs";
import { writeFiles } from "./fs-world.mjs";
import {
  checkedRoot,
  checkedPath,
  relativePath,
  uniquePaths,
  boundaryError,
} from "./world-paths.mjs";
import { documentWithMetadata } from "./frontmatter.mjs";

const exec = promisify(execFile);

/** The agents in this world assigned to a given harness ('any' matches all). */
export function assignmentsFor(manifest, harness) {
  return (manifest.agents || []).filter(
    (a) => a.harness === harness || a.harness === "any",
  );
}

export async function addCharacter(dir, character) {
  return candidate(
    dir,
    "characters",
    character.name,
    { name: character.name, role: character.role || "inhabitant" },
    `# ${character.name}\n\n${character.persona || ""}\n\n## Backstory\n${character.backstory || ""}`,
  );
}

export async function appendLore(dir, { title, body }) {
  return candidate(dir, "canon", title, {}, `# ${title}\n\n${body}`);
}

export async function addQuest(dir, { title, body }) {
  return candidate(dir, "quests", title, {}, `# ${title}\n\n${body}`);
}

async function candidate(dir, section, title, metadata, body) {
  const file = `.arcanea/candidates/${section}/${slugify(title)}-${randomUUID()}.md`;
  const bytes = documentWithMetadata(
    { ...metadata, visibility: "private", status: "CANDIDATE" },
    body,
  );
  await writeFiles(dir, [{ path: file, bytes }], { exclusive: true });
  return file;
}

/** Commit named files only; requires a sole Git writer and preserves foreign index edits. */
export async function commitWorld(dir, message, { paths } = {}) {
  if (!Array.isArray(paths) || !paths.length)
    throw boundaryError("Commit requires explicit file paths.");
  uniquePaths(paths);
  if (typeof message !== "string" || !message.trim())
    throw boundaryError("Commit message is required.");
  if (
    [
      "GIT_DIR",
      "GIT_WORK_TREE",
      "GIT_INDEX_FILE",
      "GIT_OBJECT_DIRECTORY",
      "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    ].some((key) => process.env[key])
  )
    throw boundaryError(
      "Commit refuses an externally redirected Git environment.",
    );
  const root = await checkedRoot(dir);
  const git = async (...args) =>
    (await exec("git", ["--literal-pathspecs", "-C", root, ...args])).stdout;
  const repoRoot = (await git("rev-parse", "--show-toplevel")).trim();
  if (path.resolve(repoRoot).toLowerCase() !== root.toLowerCase())
    throw boundaryError("World commit requires the Git repository root.");
  for (const p of paths) {
    relativePath(p);
    const safe = await checkedPath(root, p);
    if (!safe.exists)
      throw boundaryError("Commit path must name an existing regular file.");
  }
  const staged = (await git("diff", "--cached", "--name-only", "-z"))
    .split("\0")
    .filter(Boolean);
  if (staged.some((p) => !paths.includes(p)))
    throw boundaryError("Commit refuses unrelated staged changes.");
  await git("add", "--", ...paths);
  await git("commit", "--only", "-m", message, "--", ...paths);
  return { sha: (await git("rev-parse", "HEAD")).trim() };
}

/** A bound context an agent runtime can hand to its tools. */
export function harnessContext({ dir, harness, manifest }) {
  const pending = new Set();
  const track = async (operation) => {
    const p = await operation;
    pending.add(p);
    return p;
  };
  return {
    harness,
    assignments: assignmentsFor(manifest, harness),
    addCharacter: (c) => track(addCharacter(dir, c)),
    appendLore: (l) => track(appendLore(dir, l)),
    addQuest: (q) => track(addQuest(dir, q)),
    commit: async (msg) => {
      const paths = [...pending];
      const result = await commitWorld(dir, `[${harness}] ${msg}`, { paths });
      for (const p of paths) pending.delete(p);
      return result;
    },
  };
}
