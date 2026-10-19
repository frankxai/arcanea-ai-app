import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { commitWorld, harnessContext } from "../src/index.mjs";

const exec = promisify(execFile);
async function git(dir, ...args) {
  return (
    await exec("git", ["--literal-pathspecs", "-C", dir, ...args])
  ).stdout.trim();
}
async function fixture(t, { initial = true, repository = true } = {}) {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-world-commit-"),
  );
  t.after(async () => {
    const resolved = path.resolve(root);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith("arcanea-world-commit-"));
    await fs.rm(resolved, { recursive: true, force: true });
  });
  if (repository) {
    await git(root, "init");
    await git(root, "config", "user.name", "SDK fixture");
    await git(root, "config", "user.email", "sdk-fixture@example.invalid");
    // Identity-only fixture value. No fetch, push or network access is used.
    await git(
      root,
      "remote",
      "add",
      "origin",
      "https://github.com/example/arcanea-sdk-fixture.git",
    );
    if (initial) {
      await fs.writeFile(path.join(root, "anchor.md"), "original\n");
      await git(root, "add", "--", "anchor.md");
      // Construct fixture history with Git plumbing. All commits under test
      // still execute ordinary Git commit and the installed security hooks.
      const tree = await git(root, "write-tree");
      const head = await git(
        root,
        "commit-tree",
        tree,
        "-m",
        "fixture baseline",
      );
      await git(root, "update-ref", "HEAD", head);
    }
  }
  return root;
}
const context = (dir) =>
  harnessContext({ dir, harness: "codex", manifest: { agents: [] } });
const character = (slug = "sera") => ({
  slug,
  name: "Sera",
  body: "A patient dragon keeper.",
});
async function staged(dir) {
  return git(dir, "ls-files", "--stage", "-z");
}
async function names(dir) {
  return (
    await git(
      dir,
      "diff-tree",
      "--no-commit-id",
      "--name-only",
      "-r",
      "--root",
      "HEAD",
    )
  ).split("\n");
}

test("a harness commit preserves unrelated staged, modified and untracked work", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, "anchor.md"), "staged revision\n");
  await git(dir, "add", "--", "anchor.md");
  await fs.writeFile(path.join(dir, "anchor.md"), "unstaged next revision\n");
  await fs.writeFile(
    path.join(dir, "private-notes.md"),
    "private working notes\n",
  );
  const before = await staged(dir);
  const ctx = context(dir);
  await ctx.addCharacter(character());
  const result = await ctx.commit("Introduce Sera");
  assert.equal(result.status, "committed");
  assert.deepEqual(result.paths, ["characters/sera.md"]);
  assert.deepEqual(await names(dir), ["characters/sera.md"]);
  assert.equal(await git(dir, "show", "HEAD:anchor.md"), "original");
  assert.equal(await git(dir, "show", ":anchor.md"), "staged revision");
  assert.ok((await staged(dir)).includes(before));
  assert.equal(
    await fs.readFile(path.join(dir, "anchor.md"), "utf8"),
    "unstaged next revision\n",
  );
  assert.equal(await git(dir, "ls-files", "--", "private-notes.md"), "");
});

test("direct commits require an explicit file scope before Git mutation", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, "anchor.md"), "draft\n");
  const head = await git(dir, "rev-parse", "HEAD");
  const index = await staged(dir);
  await assert.rejects(commitWorld(dir, "unsafe implicit scope"), {
    code: "ERR_ARCANEA_GIT_SCOPE_REQUIRED",
  });
  assert.equal(await git(dir, "rev-parse", "HEAD"), head);
  assert.equal(await staged(dir), index);
});

test("a context with no writes cannot consume an unrelated staged change", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, "anchor.md"), "foreign staged change\n");
  await git(dir, "add", "--", "anchor.md");
  const before = await staged(dir);
  const head = await git(dir, "rev-parse", "HEAD");
  assert.equal(
    (await context(dir).commit("Nothing authored")).status,
    "unchanged",
  );
  assert.equal(await git(dir, "rev-parse", "HEAD"), head);
  assert.equal(await staged(dir), before);
});

test("brackets and leading dashes in explicit paths are literal", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, "draft[1].md"), "selected\n");
  await fs.writeFile(path.join(dir, "draft1.md"), "unselected\n");
  await fs.writeFile(path.join(dir, "-draft.md"), "also selected\n");
  const result = await commitWorld(dir, "Literal paths", {
    paths: ["draft[1].md", "-draft.md"],
  });
  assert.equal(result.status, "committed");
  assert.deepEqual((await names(dir)).sort(), ["-draft.md", "draft[1].md"]);
  assert.equal(await git(dir, "ls-files", "--", "draft1.md"), "");
});

test("overlapping staged edits refuse without consuming the index or authored bytes", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, "anchor.md"), "foreign staged\n");
  await git(dir, "add", "--", "anchor.md");
  await fs.writeFile(path.join(dir, "anchor.md"), "working draft\n");
  const before = await staged(dir);
  const head = await git(dir, "rev-parse", "HEAD");
  await assert.rejects(
    commitWorld(dir, "Conflicting scope", { paths: ["anchor.md"] }),
    { code: "ERR_ARCANEA_GIT_STAGED_CONFLICT" },
  );
  assert.equal(await staged(dir), before);
  assert.equal(await git(dir, "rev-parse", "HEAD"), head);
  assert.equal(
    await fs.readFile(path.join(dir, "anchor.md"), "utf8"),
    "working draft\n",
  );
});

test("a world nested in a different Git root cannot commit its parent repository", async (t) => {
  const root = await fixture(t);
  const dir = path.join(root, "nested-world");
  await fs.mkdir(dir);
  const ctx = context(dir);
  await ctx.addCharacter(character());
  const before = await staged(root);
  const head = await git(root, "rev-parse", "HEAD");
  await assert.rejects(ctx.commit("Nested world"), {
    code: "ERR_ARCANEA_GIT_ROOT",
  });
  assert.equal(await staged(root), before);
  assert.equal(await git(root, "rev-parse", "HEAD"), head);
});

test("hook rejection is explicit, keeps pending writes and permits a corrected retry", async (t) => {
  const dir = await fixture(t);
  const hook = path.join(dir, ".git", "hooks", "pre-commit");
  let configured;
  try {
    configured = await git(dir, "config", "--get", "core.hooksPath");
  } catch (error) {
    if (error.code !== 1) throw error;
  }
  let inherited = "";
  if (configured) {
    const original = path.resolve(dir, configured, "pre-commit");
    await fs.access(original);
    const quoted =
      "'" + original.replaceAll("\\", "/").replaceAll("'", "'\\''") + "'";
    inherited = `${quoted} "$@" || exit $?\n`;
  }
  // Chain the installed hook before our test rejection; keep secret checks.
  await git(dir, "config", "core.hooksPath", path.dirname(hook));
  await fs.writeFile(hook, `#!/bin/sh\n${inherited}exit 1\n`, { mode: 0o755 });
  const ctx = context(dir);
  await ctx.addCharacter(character());
  const head = await git(dir, "rev-parse", "HEAD");
  await assert.rejects(ctx.commit("Rejected draft"), {
    code: "ERR_ARCANEA_GIT_COMMIT",
  });
  assert.equal(await git(dir, "rev-parse", "HEAD"), head);
  assert.ok(
    (
      await fs.readFile(path.join(dir, "characters", "sera.md"), "utf8")
    ).includes("Sera"),
  );
  // Correct this test-owned hook; the SDK must not bypass it.
  await fs.writeFile(hook, `#!/bin/sh\n${inherited}exit 0\n`, { mode: 0o755 });
  assert.equal((await ctx.commit("Accepted retry")).status, "committed");
  assert.deepEqual(await names(dir), ["characters/sera.md"]);
  assert.equal((await ctx.commit("Already committed")).status, "unchanged");
});

test("a non-Git hosted folder returns an explicit skip and leaves authored files usable", async (t) => {
  const dir = await fixture(t, { repository: false });
  const ctx = context(dir);
  await ctx.addCharacter(character());
  const result = await ctx.commit("Hosted draft");
  assert.equal(result.status, "not-a-repository");
  assert.deepEqual(result.paths, ["characters/sera.md"]);
  assert.ok(
    (
      await fs.readFile(path.join(dir, "characters", "sera.md"), "utf8")
    ).includes("Sera"),
  );
});

test("unsafe paths reject before changing Git state", async (t) => {
  const dir = await fixture(t);
  const head = await git(dir, "rev-parse", "HEAD");
  const before = await staged(dir);
  for (const file of [
    "../escape.md",
    "/absolute.md",
    ".git/config",
    "anchor.md/child.md",
  ]) {
    await assert.rejects(commitWorld(dir, "Unsafe path", { paths: [file] }), {
      code: "ERR_ARCANEA_WORLD_PATH",
    });
    assert.equal(await staged(dir), before);
    assert.equal(await git(dir, "rev-parse", "HEAD"), head);
  }
});

test("failed writes do not enter the context's commit scope", async (t) => {
  const dir = await fixture(t);
  const ctx = context(dir);
  await fs.writeFile(
    path.join(dir, "characters"),
    "test-owned directory collision\n",
  );
  await assert.rejects(ctx.addCharacter(character()), {
    code: "ERR_ARCANEA_WORLD_PATH",
  });
  await fs.unlink(path.join(dir, "characters"));
  await ctx.addCharacter(character());
  await ctx.addQuest({
    slug: "find-the-clutch",
    title: "Find the clutch",
    body: "Follow Sera.",
  });
  const result = await ctx.commit("Successful writes only");
  assert.deepEqual(result.paths, [
    "characters/sera.md",
    "quests/find-the-clutch.md",
  ]);
  assert.deepEqual(await names(dir), result.paths);
});

test("an unborn branch preserves unrelated staged files in its first scoped commit", async (t) => {
  const dir = await fixture(t, { initial: false });
  let hooks;
  try {
    hooks = await git(dir, "config", "--get", "core.hooksPath");
  } catch (error) {
    if (error.code !== 1) throw error;
  }
  if (hooks?.replaceAll("\\", "/").includes("/operations/ops-guard/")) {
    t.skip(
      "The local estate hook requires an existing HEAD before admission; hosted CI must execute the unborn-branch case.",
    );
    return;
  }
  await fs.writeFile(path.join(dir, "foreign.md"), "foreign staged\n");
  await git(dir, "add", "--", "foreign.md");
  const ctx = context(dir);
  await ctx.addCharacter(character());
  assert.equal((await ctx.commit("First authored commit")).status, "committed");
  assert.deepEqual(await names(dir), ["characters/sera.md"]);
  assert.equal(await git(dir, "show", ":foreign.md"), "foreign staged");
  assert.equal(await git(dir, "diff", "--cached", "--name-only"), "foreign.md");
});

test("unchanged selected files do not turn foreign staged work into a commit", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, "foreign.md"), "foreign\n");
  await git(dir, "add", "--", "foreign.md");
  const before = await staged(dir);
  assert.equal(
    (await commitWorld(dir, "No selected change", { paths: ["anchor.md"] }))
      .status,
    "unchanged",
  );
  assert.equal(await staged(dir), before);
});

test("an existing index lock is reported and never removed by the SDK", async (t) => {
  const dir = await fixture(t);
  const lock = path.join(dir, ".git", "index.lock");
  await fs.writeFile(lock, "test-owned lock\n", { flag: "wx" });
  const ctx = context(dir);
  await ctx.addCharacter(character());
  await assert.rejects(ctx.commit("Locked index"), {
    code: "ERR_ARCANEA_GIT_COMMIT",
  });
  assert.equal(await fs.readFile(lock, "utf8"), "test-owned lock\n");
});

test("a redirected file selection cannot stage the outside file", async (t) => {
  const dir = await fixture(t);
  const outside = await fixture(t, { repository: false });
  await fs.writeFile(path.join(outside, "outside.md"), "outside sentinel\n");
  await fs.symlink(
    outside,
    path.join(dir, "redirect"),
    process.platform === "win32" ? "junction" : "dir",
  );
  const before = await staged(dir);
  await assert.rejects(
    commitWorld(dir, "Redirected selection", {
      paths: ["redirect/outside.md"],
    }),
    { code: "ERR_ARCANEA_WORLD_PATH" },
  );
  assert.equal(await staged(dir), before);
  assert.equal(
    await fs.readFile(path.join(outside, "outside.md"), "utf8"),
    "outside sentinel\n",
  );
});

test("an explicitly selected ignored file reports failure without force-adding it", async (t) => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, ".gitignore"), "ignored.md\n");
  await fs.writeFile(path.join(dir, "ignored.md"), "private ignored draft\n");
  const before = await staged(dir);
  await assert.rejects(
    commitWorld(dir, "Ignored draft", { paths: ["ignored.md"] }),
    { code: "ERR_ARCANEA_GIT_COMMIT", operation: "prepare" },
  );
  assert.equal(await staged(dir), before);
  assert.equal(await git(dir, "ls-files", "--", "ignored.md"), "");
});

test("a context serializes concurrent tools across the commit boundary", async (t) => {
  const dir = await fixture(t);
  const ctx = context(dir);
  const firstWrite = ctx.addCharacter(character());
  const firstCommit = ctx.commit("First queued artifact");
  const secondWrite = ctx.addQuest({
    title: "Find the clutch",
    body: "Follow Sera.",
  });
  const secondCommit = ctx.commit("Second queued artifact");
  const [file1, receipt1, file2, receipt2] = await Promise.all([
    firstWrite,
    firstCommit,
    secondWrite,
    secondCommit,
  ]);
  assert.deepEqual(receipt1.paths, [file1]);
  assert.deepEqual(receipt2.paths, [file2]);
  assert.notEqual(receipt1.sha, receipt2.sha);
  assert.deepEqual(await names(dir), [file2]);
  assert.equal(
    await git(dir, "show", "--format=", "--name-only", receipt1.sha),
    file1,
  );
});

test("inherited Git index routing cannot redirect a world commit", async (t) => {
  const dir = await fixture(t);
  const outside = await fixture(t, { repository: false });
  const foreignIndex = path.join(outside, "foreign-index");
  await fs.writeFile(foreignIndex, "outside index sentinel\n");
  await fs.writeFile(path.join(dir, "draft.md"), "selected draft\n");
  const previous = process.env.GIT_INDEX_FILE;
  let receipt;
  try {
    process.env.GIT_INDEX_FILE = foreignIndex;
    receipt = await commitWorld(dir, "Selected world only", {
      paths: ["draft.md"],
    });
  } finally {
    if (previous === undefined) delete process.env.GIT_INDEX_FILE;
    else process.env.GIT_INDEX_FILE = previous;
  }
  assert.equal(receipt.status, "committed");
  assert.deepEqual(await names(dir), ["draft.md"]);
  assert.equal(
    await fs.readFile(foreignIndex, "utf8"),
    "outside index sentinel\n",
  );
});

test("hidden index flags cannot turn an edited file into a successful no-op", async (t) => {
  const dir = await fixture(t);
  const head = await git(dir, "rev-parse", "HEAD");
  for (const flag of ["assume-unchanged", "skip-worktree"]) {
    await git(dir, "update-index", `--${flag}`, "--", "anchor.md");
    await fs.writeFile(
      path.join(dir, "anchor.md"),
      "hidden working revision\n",
    );
    const before = await git(dir, "ls-files", "-v", "--", "anchor.md");
    await assert.rejects(
      commitWorld(dir, "Hidden working file", { paths: ["anchor.md"] }),
      { code: "ERR_ARCANEA_GIT_INDEX_FLAGS" },
    );
    assert.equal(await git(dir, "rev-parse", "HEAD"), head);
    assert.equal(await git(dir, "ls-files", "-v", "--", "anchor.md"), before);
    assert.equal(
      await fs.readFile(path.join(dir, "anchor.md"), "utf8"),
      "hidden working revision\n",
    );
    await git(dir, "update-index", `--no-${flag}`, "--", "anchor.md");
  }
});
