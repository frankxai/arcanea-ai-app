// Harness adapter — how coding agents (claude/codex/gemini/antigravity/grok-arcanea) build a world.
// Agents read assignments and write append-only local proposals for human review.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
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
  const hostGitVariables = new Set(["GIT_PAGER", "GIT_LFS_PATH"]);
  if (
    Object.keys(process.env).some(
      (key) => /^GIT_/i.test(key) && !hostGitVariables.has(key.toUpperCase()),
    )
  )
    throw boundaryError(
      "Commit refuses an externally redirected Git environment.",
    );
  const root = await checkedRoot(dir);
  const git = async (...args) =>
    (await exec("git", ["--literal-pathspecs", "-C", root, ...args])).stdout;
  const repoRoot = (await git("rev-parse", "--show-toplevel")).trim();
  if ((await fs.realpath(repoRoot)) !== (await fs.realpath(root)))
    throw boundaryError("World commit requires the Git repository root.");
  for (const p of paths) {
    relativePath(p);
    const safe = await checkedPath(root, p);
    if (!safe.exists)
      throw boundaryError("Commit path must name an existing regular file.");
  }
  const staged = (
    await git(
      "diff",
      "--cached",
      "--no-renames",
      "--ignore-submodules=none",
      "--name-only",
      "-z",
    )
  )
    .split("\0")
    .filter(Boolean);
  if (staged.some((p) => !paths.includes(p)))
    throw boundaryError("Commit refuses unrelated staged changes.");
  const tracked = new Set(
    (await git("ls-files", "-z", "--", ...paths)).split("\0").filter(Boolean),
  );
  const newlyStaged = paths.filter((p) => !tracked.has(p));
  try {
    // --only reads tracked working-tree bytes. Leave prior selected index
    // versions intact until success; only previously untracked files need add.
    if (newlyStaged.length) await git("add", "--", ...newlyStaged);
    await git("commit", "--only", "-m", message, "--", ...paths);
  } catch (failure) {
    if (newlyStaged.length) {
      try {
        await git(
          "rm",
          "--cached",
          "--force",
          "--ignore-unmatch",
          "--",
          ...newlyStaged,
        );
      } catch (cleanup) {
        throw new AggregateError(
          [failure, cleanup],
          "Commit failed and newly staged paths could not be removed; inspect the index before retrying.",
        );
      }
    }
    throw failure;
  }
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
