import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, delimiter } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(
  new URL("../check-changed-format.sh", import.meta.url),
);

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "arcanea-format-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "-q");
  const commit = () => {
    git("add", "--all");
    git(
      "-c",
      "user.name=Format test",
      "-c",
      "user.email=format@example.invalid",
      "commit",
      "-qm",
      "fixture",
    );
    return git("rev-parse", "HEAD");
  };
  writeFileSync(join(root, "original.md"), "original\n");
  const base = commit();
  const bin = join(root, "fake-bin");
  mkdirSync(bin);
  writeFileSync(
    join(bin, "pnpm"),
    '#!/usr/bin/env bash\nprintf \'%s\\0\' "$@" > "$FORMAT_TEST_ARGS"\nexit "${FORMAT_TEST_EXIT:-0}"\n',
    { mode: 0o755 },
  );
  const argsFile = join(root, "formatter-args");
  const run = (from, to, extra = {}) =>
    spawnSync("bash", [script, from, to], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: bin + delimiter + process.env.PATH,
        FORMAT_TEST_ARGS: argsFile,
        ...extra,
      },
    });
  return { root, git, commit, base, run, argsFile };
}

test("changed paths preserve spaces, newlines, and option-like names", (t) => {
  const f = fixture(t);
  for (const name of ["two words.md", "two\nlines.ts", "--config.json"]) {
    writeFileSync(join(f.root, name), "changed\n");
  }
  const result = f.run(f.base, f.commit());
  assert.equal(result.status, 0, result.stderr);
  const args = readFileSync(f.argsFile, "utf8").split("\0").filter(Boolean);
  assert.deepEqual(args.slice(0, 5), [
    "exec",
    "prettier",
    "--check",
    "--ignore-unknown",
    "--",
  ]);
  assert.deepEqual(
    args.slice(5).sort(),
    ["two words.md", "two\nlines.ts", "--config.json"].sort(),
  );
});

test("an unavailable base fails instead of claiming no changed files", (t) => {
  const f = fixture(t);
  const result = f.run("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", f.base);
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stdout, /No changed files/);
});

test("a formatter failure is returned to CI", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.root, "original.md"), "changed\n");
  const result = f.run(f.base, f.commit(), { FORMAT_TEST_EXIT: "7" });
  assert.equal(result.status, 7, result.stderr);
});

test("a git diff process failure cannot become an empty successful check", (t) => {
  const f = fixture(t);
  const realGit = execFileSync("bash", ["-c", "command -v git"], {
    encoding: "utf8",
  }).trim();
  writeFileSync(
    join(f.root, "fake-bin", "git"),
    '#!/usr/bin/env bash\nif [ "$1" = diff ]; then exit 42; fi\nexec "$FORMAT_REAL_GIT" "$@"\n',
    { mode: 0o755 },
  );
  const result = f.run(f.base, f.base, { FORMAT_REAL_GIT: realGit });
  assert.equal(result.status, 42, result.stderr);
  assert.doesNotMatch(result.stdout, /No changed files/);
});

test("deleted files and unsupported formats do not reach Prettier", (t) => {
  const f = fixture(t);
  f.git("rm", "original.md");
  writeFileSync(join(f.root, "image.png"), "fixture");
  const result = f.run(f.base, f.commit());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No changed files/);
});

test("a renamed document is checked under its current path", (t) => {
  const f = fixture(t);
  f.git("mv", "original.md", "renamed.md");
  const result = f.run(f.base, f.commit());
  assert.equal(result.status, 0, result.stderr);
  assert.match(readFileSync(f.argsFile, "utf8"), /renamed.md/);
  assert.doesNotMatch(readFileSync(f.argsFile, "utf8"), /original.md/);
});
