import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  discoverSkills,
  planProjection,
  applyProjection,
} from "../lib/skill-projection.mjs";

const cli = fileURLToPath(new URL("../sync-claude-codex.mjs", import.meta.url));
const hash = (data) => createHash("sha256").update(data).digest("hex");
function fixture(t) {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "arcanea-projection-test-"),
  );
  assert.ok(
    fs.realpathSync(root).startsWith(fs.realpathSync(os.tmpdir()) + path.sep),
  );
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, "repository with spaces");
  fs.mkdirSync(repo);
  execFileSync("git", ["init", "-q", repo]);
  for (const name of ["alpha", "beta"]) {
    const folder = path.join(repo, ".claude/skills", name);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(
      path.join(folder, "SKILL.md"),
      "---\nname: same-source-name\ndescription: A fixture procedure\n---\nRead [the guide](../shared/guide.md).\n",
    );
  }
  fs.mkdirSync(path.join(repo, ".claude/skills/shared"));
  fs.writeFileSync(
    path.join(repo, ".claude/skills/shared/guide.md"),
    "Complete shared reference",
  );
  fs.writeFileSync(path.join(repo, ".mcp.json"), "DO NOT READ OR CHANGE");
  const target = path.join(root, "registry parent", "skills");
  const receiptDir = path.join(root, "private receipts");
  return { root, repo, target, receiptDir, all: true };
}
function bytes(file) {
  return fs.readFileSync(file, "utf8");
}

test("discovery is bounded to actual skill roots and includes complete source paths", (t) => {
  const options = fixture(t);
  fs.writeFileSync(
    path.join(options.repo, ".claude/skills/root-guide.md"),
    "# Another source skill",
  );
  fs.writeFileSync(
    path.join(options.repo, ".claude/skills/SKILL_ARCHITECTURE.md"),
    "# Not a skill",
  );
  const read = fs.readFileSync;
  t.mock.method(fs, "readFileSync", (file, ...rest) => {
    assert.notEqual(String(file), path.join(options.repo, ".mcp.json"));
    return read(file, ...rest);
  });
  const catalog = discoverSkills(options.repo);
  assert.equal(catalog.entries.length, 3);
  assert.deepEqual(catalog.absent, ["oracle"]);
  assert.deepEqual(catalog.issues, []);
  assert.ok(catalog.entries.every((entry) => fs.existsSync(entry.file)));
  assert.throws(
    () => discoverSkills(path.join(options.repo, ".claude")),
    /exact Git root/,
  );
  assert.equal(fs.existsSync(options.target), false);
});

test("planning creates nothing and two same-name source skills get distinct adapters", (t) => {
  const options = fixture(t);
  const plan = planProjection(options);
  assert.equal(new Set(plan.items.map((item) => item.name)).size, 2);
  assert.ok(
    plan.items.every(
      (item) =>
        item.name.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name),
    ),
  );
  assert.equal(fs.existsSync(path.dirname(options.target)), false);
  assert.equal(fs.existsSync(options.receiptDir), false);
});

test("apply preserves source-relative references and repeated apply writes nothing", (t) => {
  const options = fixture(t);
  const source = path.join(options.repo, ".claude/skills/alpha/SKILL.md");
  const beforeSource = bytes(source);
  const result = applyProjection(options);
  assert.equal(result.mode, "applied");
  assert.equal(bytes(source), beforeSource);
  assert.equal(
    bytes(path.resolve(path.dirname(source), "../shared/guide.md")),
    "Complete shared reference",
  );
  const times = [];
  for (const entry of result.entries) {
    const body = path.join(options.target, entry.name, "SKILL.md");
    assert.match(bytes(body), /Resolve all relative/);
    assert.ok(bytes(body).includes(entry.sourceFile.split(path.sep).join("/")));
    fs.utimesSync(body, 123456789, 123456789);
    times.push([body, fs.statSync(body).mtimeMs]);
  }
  const receipts = fs.readdirSync(options.receiptDir);
  assert.equal(applyProjection(options).mode, "unchanged");
  assert.deepEqual(fs.readdirSync(options.receiptDir), receipts);
  for (const [file, time] of times)
    assert.equal(fs.statSync(file).mtimeMs, time);
  assert.equal(
    bytes(path.join(options.repo, ".mcp.json")),
    "DO NOT READ OR CHANGE",
  );
});

test("only explicit updates replace recognized adapters and preserve exact backups", (t) => {
  const options = fixture(t);
  const installed = applyProjection(options);
  const entry = installed.entries[0];
  const destination = path.join(options.target, entry.name, "SKILL.md");
  const original = bytes(destination);
  fs.appendFileSync(entry.sourceFile, "\nNew source guidance.\n");
  assert.equal(planProjection(options).items[0].state, "update");
  assert.throws(() => applyProjection(options), /--update/);
  assert.equal(bytes(destination), original);
  const updated = applyProjection({ ...options, update: true });
  assert.equal(
    bytes(path.join(path.dirname(updated.receipt), entry.name, "SKILL.md")),
    original,
  );
  assert.notEqual(bytes(destination), original);
  assert.equal(planProjection(options).items[0].state, "unchanged");
});

test("a later full-skill collision prevents any earlier installation or receipt", (t) => {
  const options = fixture(t);
  const plan = planProjection(options);
  const protectedDirectory = plan.items[1].directory;
  fs.mkdirSync(protectedDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(protectedDirectory, "SKILL.md"),
    "User-owned full procedure",
  );
  assert.throws(
    () => applyProjection({ ...options, update: true }),
    /full skill/,
  );
  assert.equal(fs.existsSync(plan.items[0].directory), false);
  assert.equal(fs.existsSync(options.receiptDir), false);
  assert.equal(
    bytes(path.join(protectedDirectory, "SKILL.md")),
    "User-owned full procedure",
  );
});

test("edited adapters, even with recomputed hashes, are preserved", (t) => {
  const options = fixture(t);
  const entry = applyProjection(options).entries[0];
  const directory = path.join(options.target, entry.name);
  const body = path.join(directory, "SKILL.md");
  fs.appendFileSync(body, "\nUser customization");
  assert.throws(
    () => applyProjection({ ...options, update: true }),
    /edited adapter/,
  );
  const manifestPath = path.join(directory, "INSTALL.json");
  const manifest = JSON.parse(bytes(manifestPath));
  manifest.adapterSha256 = hash(fs.readFileSync(body));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  assert.throws(
    () => applyProjection({ ...options, update: true }),
    /Noncanonical adapter/,
  );
  assert.match(bytes(body), /User customization/);
});

test("links, junctions, source escapes and receipt overlap are rejected", (t) => {
  const options = fixture(t);
  const actual = path.join(options.root, "other registry");
  fs.mkdirSync(actual);
  const linked = path.join(options.root, "linked");
  fs.symlinkSync(
    actual,
    linked,
    process.platform === "win32" ? "junction" : "dir",
  );
  assert.throws(
    () => applyProjection({ ...options, target: path.join(linked, "skills") }),
    /Refusing directory link/,
  );
  assert.throws(
    () =>
      applyProjection({
        ...options,
        receiptDir: path.join(options.repo, "receipts"),
      }),
    /Receipt directory must be separate/,
  );
  assert.throws(
    () => planProjection({ ...options, target: options.repo }),
    /may not overlap/,
  );
  assert.throws(
    () =>
      planProjection({ ...options, all: false, skills: ["../../.mcp.json"] }),
    /Unknown source skill/,
  );
  const linkedSource = path.join(options.repo, ".claude/skills/linked");
  fs.symlinkSync(
    actual,
    linkedSource,
    process.platform === "win32" ? "junction" : "dir",
  );
  assert.equal(discoverSkills(options.repo).issues.length, 1);
  assert.throws(() => planProjection(options), /discovery issues/);
  assert.equal(
    planProjection({ ...options, all: false, skills: ["claude/alpha"] }).items
      .length,
    1,
  );
});

test("a target adapter junction is never replaced even with --update", (t) => {
  const options = fixture(t);
  const plan = planProjection(options);
  fs.mkdirSync(options.target, { recursive: true });
  fs.symlinkSync(
    path.join(options.repo, ".claude/skills/alpha"),
    plan.items[0].directory,
    process.platform === "win32" ? "junction" : "dir",
  );
  assert.throws(
    () => applyProjection({ ...options, update: true }),
    /Refusing directory link/,
  );
  assert.equal(fs.lstatSync(plan.items[0].directory).isSymbolicLink(), true);
});

test("write failure leaves a recovery receipt and restores managed state", (t) => {
  const options = fixture(t);
  const installed = applyProjection(options);
  const first = installed.entries[0];
  const body = path.join(options.target, first.name, "SKILL.md");
  const original = bytes(body);
  fs.appendFileSync(first.sourceFile, "\nRevision");
  const write = fs.writeFileSync;
  let failOnce = true;
  t.mock.method(fs, "writeFileSync", (file, ...args) => {
    if (String(file) === body && failOnce) {
      failOnce = false;
      throw new Error("Simulated failure");
    }
    return write(file, ...args);
  });
  assert.throws(
    () => applyProjection({ ...options, update: true }),
    /recovery receipt/,
  );
  assert.equal(bytes(body), original);
  const receipts = fs
    .readdirSync(options.receiptDir)
    .map((name) =>
      JSON.parse(bytes(path.join(options.receiptDir, name, "receipt.json"))),
    );
  assert.ok(receipts.some((receipt) => receipt.mode === "failed"));
  const recovery = receipts.find(
    (receipt) => receipt.mode === "failed",
  ).recovery;
  assert.ok(recovery.some((item) => item.state === "restored"));
  assert.ok(
    recovery.every((item) => ["restored", "original"].includes(item.state)),
  );
  assert.equal(planProjection(options).items[0].state, "update");
});

test("CLI check detects drift and default/help/invalid invocations never install", (t) => {
  const options = fixture(t);
  const call = (args) =>
    spawnSync(process.execPath, [cli, ...args], {
      encoding: "utf8",
      timeout: 10000,
    });
  for (const args of [[], ["--help"]]) assert.equal(call(args).status, 0);
  for (const args of [
    ["--bad"],
    ["--apply", "--check"],
    ["--repo", options.repo, "--repo", options.repo],
    ["--list", "--target", options.target],
    [options.repo],
  ])
    assert.notEqual(call(args).status, 0);
  const selection = [
    "--repo",
    options.repo,
    "--target",
    options.target,
    "--skill",
    "claude/alpha",
    "--json",
  ];
  assert.equal(call([...selection, "--check"]).status, 1);
  assert.equal(call([...selection, "--dry-run"]).status, 0);
  assert.equal(fs.existsSync(options.target), false);
  assert.notEqual(call([...selection, "--apply"]).status, 0);
  const result = call([
    ...selection,
    "--apply",
    "--receipt-dir",
    options.receiptDir,
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).entries.length, 1);
  assert.equal(call([...selection, "--check"]).status, 0);
  fs.appendFileSync(
    path.join(options.repo, ".claude/skills/alpha/SKILL.md"),
    "\nChanged source",
  );
  assert.equal(call([...selection, "--check"]).status, 1);
});

test("recovery preserves unexpected destination bytes and records manual recovery", (t) => {
  const options = fixture(t);
  const plan = planProjection(options);
  const body = path.join(plan.items[0].directory, "SKILL.md");
  const write = fs.writeFileSync;
  t.mock.method(fs, "writeFileSync", (file, ...args) => {
    if (String(file) === body) {
      write(file, "Unexpected partial write");
      throw new Error("Interrupted write");
    }
    return write(file, ...args);
  });
  assert.throws(() => applyProjection(options), /recovery receipt/);
  assert.equal(bytes(body), "Unexpected partial write");
  assert.equal(fs.existsSync(plan.items[1].directory), false);
  const run = fs.readdirSync(options.receiptDir)[0];
  const receipt = JSON.parse(
    bytes(path.join(options.receiptDir, run, "receipt.json")),
  );
  assert.equal(receipt.mode, "failed");
  assert.ok(
    receipt.recovery.some(
      (item) =>
        item.file === "SKILL.md" && item.state === "preserved-unexpected",
    ),
  );
  assert.ok(
    receipt.recovery.some(
      (item) => item.file === "INSTALL.json" && item.state === "removed",
    ),
  );
});

test("Bash compatibility entrypoint forwards quoted paths and performs the real install", (t) => {
  const options = fixture(t);
  const bash =
    process.platform === "win32"
      ? path.join(
          process.env.ProgramFiles ?? "C:/Program Files",
          "Git/bin/bash.exe",
        )
      : "/bin/bash";
  if (!fs.existsSync(bash))
    return t.skip("Bash is not installed; the native Node CLI remains covered");
  const wrapper = fileURLToPath(
    new URL("../sync-claude-codex.sh", import.meta.url),
  );
  const check = spawnSync(bash, ["--noprofile", "--norc", "-n", wrapper], {
    encoding: "utf8",
  });
  assert.equal(check.status, 0, check.stderr);
  const result = spawnSync(
    bash,
    [
      "--noprofile",
      "--norc",
      wrapper,
      "--repo",
      options.repo,
      "--target",
      options.target,
      "--all",
      "--apply",
      "--receipt-dir",
      options.receiptDir,
      "--json",
    ],
    { encoding: "utf8", timeout: 20000 },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).mode, "applied");
  assert.ok(
    planProjection(options).items.every((item) => item.state === "unchanged"),
  );
});

test("oversized sources, deep trees and home-root targets fail before writing", (t) => {
  const options = fixture(t);
  const source = path.join(options.repo, ".claude/skills/alpha/SKILL.md");
  const original = fs.readFileSync(source);
  fs.writeFileSync(source, Buffer.alloc(512 * 1024 + 1, "a"));
  assert.equal(discoverSkills(options.repo).issues.length, 1);
  assert.throws(() => applyProjection(options), /discovery issues/);
  assert.equal(fs.existsSync(options.target), false);
  assert.equal(fs.existsSync(options.receiptDir), false);
  fs.writeFileSync(source, original);
  const home =
    process.platform === "win32" ? os.homedir().toUpperCase() : os.homedir();
  assert.throws(
    () => planProjection({ ...options, target: home }),
    /home root/,
  );
  const deep = path.join(
    options.repo,
    ".claude/skills",
    ...Array(22).fill("deep"),
  );
  fs.mkdirSync(deep, { recursive: true });
  assert.throws(() => discoverSkills(options.repo), /bounded directory limit/);
  assert.equal(fs.existsSync(options.target), false);
});
