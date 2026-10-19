// Harness adapter — how coding agents (claude/codex/gemini/antigravity/grok-arcanea) build a world.
// Agents read assignments from manifest.agents (harness or "any"), write canonical folders (frontmatter + md),
// commit. Grok harness additionally seeds media/ via native Imagine (refs for visualDna coherence, image-to-video).
// Each harness runtime binds harnessContext for its tools.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import { slugify } from "./manifest.mjs";
import { writeFiles, checkWorldFiles } from "./fs-world.mjs";

const exec = promisify(execFile);

/** The agents in this world assigned to a given harness ('any' matches all). */
export function assignmentsFor(manifest, harness) {
  return (manifest.agents || []).filter(
    (a) => a.harness === harness || a.harness === "any",
  );
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
  await writeFiles(dir, [
    { path: `characters/${slugify(character.name)}.md`, bytes: body },
  ]);
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
  await writeFiles(dir, [
    {
      path: file,
      bytes: `---\nvisibility: public\n---\n\n# ${title}\n\n${body}\n`,
    },
  ]);
  return file;
}

function gitFailure(operation, error) {
  // Git/hook stderr and command text can contain private content or credentials.
  return Object.assign(
    new Error(
      `Git ${operation} failed; inspect the local Git error and retry the retained draft.`,
    ),
    {
      code: "ERR_ARCANEA_GIT_COMMIT",
      operation,
      exitCode: typeof error.code === "number" ? error.code : null,
    },
  );
}

async function repositoryAt(root) {
  let current = root;
  while (true) {
    let entry;
    try {
      entry = await fs.lstat(path.join(current, ".git"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (entry) {
      if (
        current !== root ||
        entry.isSymbolicLink() ||
        (!entry.isFile() && !entry.isDirectory())
      ) {
        throw Object.assign(
          new Error(
            "The selected world must be its own Git root with trusted Git metadata.",
          ),
          { code: "ERR_ARCANEA_GIT_ROOT" },
        );
      }
      return true;
    }
    const parent = path.dirname(current);
    if (parent === current) return false;
    current = parent;
  }
}

/** Commit exact existing files in a trusted, single-writer world repository. */
export async function commitWorld(dir, message, options) {
  if (!options || !Array.isArray(options.paths)) {
    throw Object.assign(
      new Error("Provide explicit world-file paths to commit."),
      { code: "ERR_ARCANEA_GIT_SCOPE_REQUIRED" },
    );
  }
  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.includes("\0")
  ) {
    throw new TypeError("A nonempty commit message is required.");
  }
  const selected = await checkWorldFiles(dir, options.paths);
  const result = { paths: selected.paths };
  if (!(await repositoryAt(selected.dir)))
    return { status: "not-a-repository", ...result };
  // Inherited routing variables must not redirect a selected world to another
  // repository/index. Normal Git configuration, signing and hooks remain active.
  const env = { ...process.env };
  for (const key of [
    "GIT_DIR",
    "GIT_WORK_TREE",
    "GIT_COMMON_DIR",
    "GIT_INDEX_FILE",
    "GIT_OBJECT_DIRECTORY",
    "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_NAMESPACE",
    "GIT_PREFIX",
  ])
    delete env[key];
  const run = async (operation, args, quiet = false) => {
    try {
      return await exec(
        "git",
        ["--literal-pathspecs", "-C", selected.dir, ...args],
        { env },
      );
    } catch (error) {
      if (quiet && error.code === 1) return null;
      throw gitFailure(operation, error);
    }
  };
  const { stdout: top } = await run("root-check", [
    "rev-parse",
    "--show-toplevel",
  ]);
  if ((await fs.realpath(top.trim())) !== selected.dir) {
    throw Object.assign(
      new Error("The selected world must be its own Git root."),
      { code: "ERR_ARCANEA_GIT_ROOT" },
    );
  }
  if (!selected.paths.length) return { status: "unchanged", ...result };
  const { stdout: flags } = await run("index-flags-check", [
    "ls-files",
    "-v",
    "-z",
    "--",
    ...selected.paths,
  ]);
  if (
    flags.split("\0").some((entry) => entry[0] === "S" || /^[a-z]/.test(entry))
  ) {
    throw Object.assign(
      new Error(
        "Selected files have skip-worktree or assume-unchanged flags; resolve those flags before committing the draft.",
      ),
      {
        code: "ERR_ARCANEA_GIT_INDEX_FLAGS",
      },
    );
  }
  const cached = await run(
    "staging-check",
    ["diff", "--cached", "--quiet", "--", ...selected.paths],
    true,
  );
  if (!cached) {
    throw Object.assign(
      new Error(
        "Selected files already have staged changes; resolve that staging before committing the draft.",
      ),
      { code: "ERR_ARCANEA_GIT_STAGED_CONFLICT" },
    );
  }
  const working = await run(
    "change-check",
    ["diff", "--quiet", "--", ...selected.paths],
    true,
  );
  const { stdout: untracked } = await run("new-file-check", [
    "ls-files",
    "--others",
    "-z",
    "--",
    ...selected.paths,
  ]);
  if (working && !untracked) return { status: "unchanged", ...result };
  // Intent-to-add makes new paths known to commit --only without staging their
  // bytes. Hook/index/signing failure leaves them retryable and keeps all drafts.
  await run("prepare", ["add", "--intent-to-add", "--", ...selected.paths]);
  await run("commit", [
    "commit",
    "--only",
    "-m",
    message,
    "--",
    ...selected.paths,
  ]);
  const { stdout } = await run("receipt", ["rev-parse", "HEAD"]);
  return { status: "committed", sha: stdout.trim(), ...result };
}

/** A bound context an agent runtime can hand to its tools. */
export function harnessContext({ dir, harness, manifest }) {
  const pending = new Set();
  let tail = Promise.resolve();
  const enqueue = (operation) => {
    const next = tail.then(operation);
    tail = next.catch(() => {});
    return next;
  };
  const write = (operation) =>
    enqueue(async () => {
      const file = await operation();
      pending.add(file);
      return file;
    });
  return {
    harness,
    assignments: assignmentsFor(manifest, harness),
    addCharacter: (c) => write(() => addCharacter(dir, c)),
    appendLore: (l) => write(() => appendLore(dir, l)),
    addQuest: (q) => write(() => addQuest(dir, q)),
    commit: (msg) =>
      enqueue(async () => {
        const result = await commitWorld(dir, `[${harness}] ${msg}`, {
          paths: [...pending],
        });
        if (result.status === "committed" || result.status === "unchanged")
          pending.clear();
        return result;
      }),
  };
}
