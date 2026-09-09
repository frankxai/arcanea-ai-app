"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { installSkills } = require("../lib/installer.js");
const cli = path.join(__dirname, "../bin/install.js");

function fixture(t) {
  const prefix = path.join(os.tmpdir(), "arcanea-install-test-");
  const root = fs.mkdtempSync(prefix);
  assert.ok(
    fs.realpathSync(root).startsWith(fs.realpathSync(os.tmpdir()) + path.sep),
  );
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const sourceRoot = path.join(root, "source");
  for (const name of ["alpha", "beta"]) {
    fs.mkdirSync(path.join(sourceRoot, name, "references"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(sourceRoot, name, "SKILL.md"),
      `---\nname: ${name}\ndescription: Test fixture\n---\n[Read](references/brief.md)\n`,
    );
    fs.writeFileSync(
      path.join(sourceRoot, name, "references/brief.md"),
      `Brief for ${name}\n`,
    );
  }
  return {
    root,
    sourceRoot,
    target: path.join(root, "nested", "target"),
    all: true,
  };
}

test("dry run uses actual files and hashes without creating the registry or parents", (t) => {
  const options = fixture(t);
  const report = installSkills({ ...options, dryRun: true });
  assert.equal(report.mode, "dry-run");
  assert.equal(report.skills.length, 2);
  const file = report.skills[0].files.find(
    (file) => file.path === "references/brief.md",
  );
  assert.equal(
    file.sha256,
    createHash("sha256").update("Brief for alpha\n").digest("hex"),
  );
  assert.equal(fs.existsSync(path.dirname(options.target)), false);
});

test("selected installation keeps references; identical rerun does not rewrite bytes or times", (t) => {
  const options = { ...fixture(t), all: false, skills: ["beta"] };
  const first = installSkills(options);
  assert.equal(first.skills[0].state, "installed");
  assert.equal(fs.existsSync(path.join(options.target, "alpha")), false);
  const entry = path.join(options.target, "beta", "SKILL.md");
  fs.utimesSync(entry, 123456789, 123456789);
  const before = fs.statSync(entry).mtimeMs;
  assert.equal(installSkills(options).skills[0].state, "unchanged");
  assert.equal(fs.statSync(entry).mtimeMs, before);
  assert.equal(
    fs.readFileSync(
      path.join(options.target, "beta/references/brief.md"),
      "utf8",
    ),
    "Brief for beta\n",
  );
});

test("a later conflict aborts the entire plan before earlier skills are installed", (t) => {
  const options = fixture(t);
  fs.mkdirSync(path.join(options.target, "beta"), { recursive: true });
  fs.writeFileSync(
    path.join(options.target, "beta/SKILL.md"),
    "User-owned full skill",
  );
  assert.throws(() => installSkills(options), /differs/);
  assert.equal(fs.existsSync(path.join(options.target, "alpha")), false);
  assert.equal(
    fs.readFileSync(path.join(options.target, "beta/SKILL.md"), "utf8"),
    "User-owned full skill",
  );
});

test("extra destination files are preserved and make the installation a conflict", (t) => {
  const options = fixture(t);
  installSkills(options);
  const extra = path.join(options.target, "alpha/notes.md");
  fs.writeFileSync(extra, "Keep this");
  assert.throws(() => installSkills(options), /differs/);
  assert.equal(fs.readFileSync(extra, "utf8"), "Keep this");
});

test("invalid selections and source/target overlap fail before creating a target", (t) => {
  const options = fixture(t);
  for (const skills of [["../escape"], ["missing"], ["alpha", "alpha"], []]) {
    assert.throws(() => installSkills({ ...options, all: false, skills }));
  }
  assert.throws(
    () => installSkills({ ...options, skills: ["alpha"] }),
    /either/,
  );
  assert.throws(
    () => installSkills({ ...options, target: options.sourceRoot }),
    /overlap/,
  );
  assert.throws(
    () => installSkills({ ...options, target: options.root }),
    /overlap/,
  );
  assert.equal(fs.existsSync(options.target), false);
});

test("an incomplete source skill is an error, not a successful empty install", (t) => {
  const options = fixture(t);
  fs.unlinkSync(path.join(options.sourceRoot, "beta/SKILL.md"));
  assert.throws(() => installSkills(options), /Missing regular SKILL/);
  assert.equal(fs.existsSync(options.target), false);
});

test("directory links and junctions are refused in sources and registry ancestors", (t) => {
  const options = fixture(t);
  const linkedSource = path.join(options.root, "linked-source");
  fs.symlinkSync(
    options.sourceRoot,
    linkedSource,
    process.platform === "win32" ? "junction" : "dir",
  );
  assert.throws(
    () => installSkills({ ...options, sourceRoot: linkedSource }),
    /ordinary directory/,
  );
  const realParent = path.join(options.root, "real-parent");
  fs.mkdirSync(realParent);
  const linkedParent = path.join(options.root, "linked-parent");
  fs.symlinkSync(
    realParent,
    linkedParent,
    process.platform === "win32" ? "junction" : "dir",
  );
  assert.throws(
    () =>
      installSkills({ ...options, target: path.join(linkedParent, "skills") }),
    /ordinary directory/,
  );
  assert.deepEqual(fs.readdirSync(realParent), []);
  fs.symlinkSync(
    realParent,
    path.join(options.sourceRoot, "alpha/references/linked"),
    process.platform === "win32" ? "junction" : "dir",
  );
  assert.throws(() => installSkills(options), /Links and junctions/);
});

test("a destination skill link cannot overwrite another skill tree", (t) => {
  const options = fixture(t);
  fs.mkdirSync(options.target, { recursive: true });
  fs.symlinkSync(
    path.join(options.sourceRoot, "alpha"),
    path.join(options.target, "alpha"),
    process.platform === "win32" ? "junction" : "dir",
  );
  const original = fs.readFileSync(
    path.join(options.sourceRoot, "alpha/SKILL.md"),
  );
  assert.throws(() => installSkills(options), /ordinary directory/);
  assert.deepEqual(
    fs.readFileSync(path.join(options.sourceRoot, "alpha/SKILL.md")),
    original,
  );
});

test("CLI no-argument/help paths do not install, and ambiguous or unknown arguments fail", (t) => {
  const options = fixture(t);
  const env = { ...process.env, HOME: options.root, USERPROFILE: options.root };
  for (const args of [[], ["--help"]]) {
    const run = spawnSync(process.execPath, [cli, ...args], {
      env,
      encoding: "utf8",
      timeout: 10000,
    });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /Install selected skills/);
  }
  for (const args of [
    ["--typo"],
    ["story-weave"],
    ["--target"],
    ["--all", "--skill", "story-weave"],
    ["--list", "--all"],
    ["--target", options.target, "--target", options.target, "--all"],
  ]) {
    const run = spawnSync(process.execPath, [cli, ...args], {
      env,
      encoding: "utf8",
      timeout: 10000,
    });
    assert.notEqual(run.status, 0);
  }
  assert.equal(fs.existsSync(path.join(options.root, ".claude")), false);
  assert.equal(fs.existsSync(options.target), false);
});

test("real CLI dry run and selected install produce verified structured receipts", (t) => {
  const options = fixture(t);
  const args = ["--skill", "story-weave", "--target", options.target, "--json"];
  const preview = spawnSync(process.execPath, [cli, ...args, "--dry-run"], {
    encoding: "utf8",
    timeout: 10000,
  });
  assert.equal(preview.status, 0, preview.stderr);
  assert.equal(JSON.parse(preview.stdout).skills[0].state, "install");
  assert.equal(fs.existsSync(options.target), false);
  const applied = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    timeout: 10000,
  });
  assert.equal(applied.status, 0, applied.stderr);
  const report = JSON.parse(applied.stdout);
  assert.deepEqual(fs.readdirSync(options.target), ["story-weave"]);
  for (const file of report.skills[0].files) {
    const bytes = fs.readFileSync(
      path.join(options.target, "story-weave", file.path),
    );
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
  }
});

test("a write failure rolls back only newly created files and directories", (t) => {
  const options = fixture(t);
  const write = fs.writeFileSync;
  t.mock.method(fs, "writeFileSync", (file, ...args) => {
    if (file === path.join(options.target, "beta/SKILL.md"))
      throw new Error("Simulated disk error");
    return write(file, ...args);
  });
  assert.throws(() => installSkills(options), /Simulated disk error/);
  assert.equal(fs.existsSync(options.target), false);
  assert.equal(
    fs.existsSync(path.join(options.sourceRoot, "alpha/SKILL.md")),
    true,
  );
});

test("a directory arriving after planning is preserved during rollback", (t) => {
  const options = fixture(t);
  const mkdir = fs.mkdirSync;
  const raced = path.join(options.target, "beta");
  t.mock.method(fs, "mkdirSync", (directory, ...args) => {
    if (directory === raced) {
      mkdir(directory);
      fs.writeFileSync(
        path.join(directory, "user-note.md"),
        "Concurrent user content",
      );
    }
    return mkdir(directory, ...args);
  });
  assert.throws(() => installSkills(options), { code: "EEXIST" });
  assert.equal(fs.existsSync(path.join(options.target, "alpha")), false);
  assert.equal(
    fs.readFileSync(path.join(raced, "user-note.md"), "utf8"),
    "Concurrent user content",
  );
});

test("excessive directory depth is bounded before reading or installing the tree", (t) => {
  const options = fixture(t);
  fs.mkdirSync(path.join(options.sourceRoot, "alpha", ...Array(34).fill("a")), {
    recursive: true,
  });
  assert.throws(() => installSkills(options), /bounded limit/);
  assert.equal(fs.existsSync(options.target), false);
});
