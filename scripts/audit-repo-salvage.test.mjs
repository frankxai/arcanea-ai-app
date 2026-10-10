import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  compareTrees,
  parseArgs,
  parseTree,
  readSnapshot,
} from "./audit-repo-salvage.mjs";

const object = "a".repeat(40);
const other = "b".repeat(40);
const row = (path, id = object, mode = "100644", type = "blob") => ({
  path,
  object: id,
  mode,
  type,
});

test("repeated absent objects never become false retained matches", () => {
  const report = compareTrees([row("old/a"), row("old/b")], []);
  assert.equal(report.counts["path-only-object-absent"], 2);
  assert.equal(report.counts["path-only-object-elsewhere"], 0);
  assert.equal(report.sourceObjectsAbsentFromTarget, 1);
  assert.equal(report.sourcePathsWithAbsentObjects, 2);
  assert.ok(
    report.entries.every((entry) => !entry.identicalObjectTargets.length),
  );
});

test("renames are found by actual object matches, with target modes retained", () => {
  const report = compareTrees([row("old/a")], [row("new/a", object, "100755")]);
  assert.equal(report.counts["path-only-object-elsewhere"], 1);
  assert.deepEqual(report.entries[0].identicalObjectTargets, [
    { path: "new/a", mode: "100755" },
  ]);
  assert.equal(report.sourceObjectsAbsentFromTarget, 0);
});

test("same-path divergence remains visible when old bytes are elsewhere", () => {
  const report = compareTrees(
    [row("a")],
    [row("a", other), row("backup", object)],
  );
  assert.equal(report.counts["same-path-diverged"], 1);
  assert.equal(report.entries[0].targetSamePath.object, other);
  assert.equal(report.entries[0].identicalObjectTargets[0].path, "backup");
  assert.equal(report.sourceObjectsAbsentFromTarget, 0);
});

test("same-path mode changes and Gitlinks are not ordinary exact matches", () => {
  const source = [
    row("script"),
    row("link", object, "120000"),
    row("module", other, "160000", "commit"),
  ];
  const report = compareTrees(source, [
    row("script", object, "100755"),
    row("link"),
    row("module", other),
  ]);
  assert.equal(report.counts["same-path-diverged"], 3);
  assert.equal(report.specialSourceEntries, 2);
  assert.equal(report.sourceObjectsAbsentFromTarget, 1);
  assert.deepEqual(
    report.entries.find((entry) => entry.path === "module")
      .identicalObjectTargets,
    [],
  );
});

test("NUL tree parsing preserves tabs, newlines, spaces and Unicode", () => {
  const path = "Arcanea World Building/é\tline\nfile.arc";
  assert.deepEqual(parseTree(Buffer.from(`100644 blob ${object}\t${path}\0`)), [
    row(path),
  ]);
  assert.throws(
    () => parseTree(Buffer.from(`100644 blob ${object}\ta`)),
    /Incomplete/,
  );
  assert.throws(() => parseTree(Buffer.from([255, 0])), /encoded data/);
});

test("malformed and duplicate tree records refuse without partial output", () => {
  const line = `100644 blob ${object}\ta\0`;
  assert.throws(() => parseTree(Buffer.from(line + line)), /duplicate/);
  assert.throws(
    () => parseTree(Buffer.from(`100644 tree ${object}\ta\0`)),
    /Invalid/,
  );
  assert.throws(() => compareTrees([row("../escape")], []), /Invalid/);
  assert.throws(
    () => compareTrees([], [row("a"), row("a", other)]),
    /duplicate/,
  );
});

test("counts partition every source path and results do not depend on order", () => {
  const source = [
    row("a"),
    row("b", other),
    row("c"),
    row("d", "c".repeat(40)),
  ];
  const target = [row("a"), row("b"), row("e"), row("only-target", other)];
  const report = compareTrees(source, target);
  assert.equal(
    Object.values(report.counts).reduce((a, b) => a + b, 0),
    source.length,
  );
  assert.equal(report.targetOnlyPaths, 2);
  assert.deepEqual(
    compareTrees(source.toReversed(), target.toReversed()),
    report,
  );
});

test("CLI requires explicit unambiguous inputs", () => {
  const args = [
    "--source-repo",
    ".",
    "--source-ref",
    object,
    "--target-repo",
    ".",
    "--target-ref",
    other,
  ];
  assert.equal(parseArgs(args).targetRef, other);
  assert.throws(() => parseArgs([]), /required/);
  assert.throws(
    () => parseArgs([...args, "--source-ref", other]),
    /exactly once/,
  );
  assert.throws(
    () => parseArgs([...args, "--unexpected", "x"]),
    /exactly once/,
  );
  assert.throws(() => readSnapshot(".", "HEAD"), /full/);
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("./audit-repo-salvage.mjs", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /refused/);
});

test("native snapshot reads the immutable commit without changing index or worktree", () => {
  const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const git = (args) => execFileSync("git", args, { cwd, encoding: "utf8" });
  const before = git(["status", "--porcelain=v1", "-z"]);
  const commit = git(["rev-parse", "HEAD"]).trim();
  const first = readSnapshot(cwd, commit);
  assert.equal(first.commit, commit);
  assert.ok(first.entries.length > 0);
  assert.deepEqual(readSnapshot(cwd, commit), first);
  assert.equal(git(["status", "--porcelain=v1", "-z"]), before);
});
