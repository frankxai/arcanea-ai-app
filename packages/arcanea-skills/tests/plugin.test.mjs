import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import test from "node:test";

const require = createRequire(import.meta.url);
const { loadCatalog, validateSources } = require("../scripts/catalog.cjs");
const { preparePlugin, materializePlugin } = require("../scripts/plugin.cjs");
const source = fileURLToPath(new URL("../", import.meta.url));

function fixture(t, ready = true) {
  const dir = mkdtempSync(join(tmpdir(), "arcanea-plugin-"));
  t.after(() => {
    const rel = relative(resolve(tmpdir()), resolve(dir));
    assert.ok(rel && !rel.startsWith("..") && !rel.includes(":"));
    rmSync(dir, { recursive: true, force: true });
  });
  const repo = join(dir, "repo");
  const pkg = join(repo, "packages/arcanea-skills");
  mkdirSync(pkg, { recursive: true });
  cpSync(join(source, "skills"), join(pkg, "skills"), { recursive: true });
  cpSync(join(source, "catalog.json"), join(pkg, "catalog.json"));
  const catalog = loadCatalog(pkg);
  if (ready) {
    const files = validateSources(pkg, catalog)[0].files;
    const skillFile = join(pkg, "skills/world-build/SKILL.md");
    writeFileSync(
      skillFile,
      readFileSync(skillFile, "utf8").replace(
        "internal: true",
        "internal: false",
      ),
    );
    const hash = createHash("sha256");
    for (const file of files)
      hash.update(
        `${file}\0${createHash("sha256")
          .update(readFileSync(join(pkg, "skills/world-build", file)))
          .digest("hex")}\n`,
      );
    const sha = hash.digest("hex");
    Object.assign(catalog.skills[0], {
      status: "ready",
      contentSha256: sha,
      rights: {
        status: "cleared",
        license: "TEST-ONLY",
        evidence: "synthetic fixture",
      },
      evaluation: {
        status: "passed",
        contentSha256: sha,
        evidence: "synthetic fixture",
      },
      review: {
        status: "passed",
        contentSha256: sha,
        evidence: "synthetic fixture",
        maker: "fixture-maker",
        reviewer: "fixture-reviewer",
      },
    });
    writeFileSync(join(pkg, "catalog.json"), JSON.stringify(catalog));
  }
  const git = (...args) =>
    execFileSync("git", ["-C", repo, ...args], {
      encoding: "utf8",
      timeout: 10000,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "--quiet");
  git("config", "user.name", "Arcanea test fixture");
  git("config", "user.email", "fixture@example.invalid");
  git(
    "remote",
    "add",
    "origin",
    "https://github.com/frankxai/arcanea-ai-app.git",
  );
  git(
    "add",
    "packages/arcanea-skills/catalog.json",
    "packages/arcanea-skills/skills",
  );
  git(
    "commit",
    "--quiet",
    "-m",
    "Synthetic test fixture; no release authorization",
  );
  const commit = git("rev-parse", "HEAD");
  const output = join(dir, "output");
  return { dir, repo, pkg, git, commit, output };
}

test("zero-ready public plugin refuses before creating output", (t) => {
  const { pkg, commit, output } = fixture(t, false);
  assert.throws(
    () => preparePlugin(pkg, commit),
    (error) => error.exitCode === 2,
  );
  assert.equal(existsSync(output), false);
});

test("plugin includes exact ready bytes/resources, excludes candidate and development components", (t) => {
  const { repo, pkg, commit, output } = fixture(t);
  for (const file of [
    ".claude/skills/operator/SKILL.md",
    ".claude/commands/operator.md",
    ".mcp.json",
    "hooks/hooks.json",
  ]) {
    mkdirSync(dirname(join(repo, file)), { recursive: true });
    writeFileSync(join(repo, file), "developer sentinel");
  }
  mkdirSync(join(pkg, "skills/undeclared"));
  writeFileSync(join(pkg, "skills/undeclared/SKILL.md"), "undeclared sentinel");
  const before = readFileSync(join(pkg, "catalog.json"));
  const plan = preparePlugin(pkg, commit);
  const dry = materializePlugin(plan, output, { dryRun: true });
  assert.equal(dry.written, false);
  assert.equal(existsSync(output), false);
  const result = materializePlugin(plan, output);
  assert.deepEqual(readdirSync(join(result.pluginRoot, "skills")), [
    "world-build",
  ]);
  assert.deepEqual(readdirSync(result.pluginRoot).sort(), [
    ".claude-plugin",
    "release.json",
    "skills",
  ]);
  for (const file of ["SKILL.md", "references/example.md"])
    assert.deepEqual(
      readFileSync(join(result.pluginRoot, "skills/world-build", file)),
      readFileSync(join(pkg, "skills/world-build", file)),
    );
  const manifest = JSON.parse(
    readFileSync(join(result.pluginRoot, ".claude-plugin/plugin.json")),
  );
  for (const field of [
    "commands",
    "agents",
    "skills",
    "hooks",
    "mcpServers",
    "license",
  ])
    assert.equal(Object.hasOwn(manifest, field), false);
  assert.equal(
    JSON.parse(readFileSync(join(result.pluginRoot, "release.json"))).source
      .commit,
    commit,
  );
  assert.deepEqual(readFileSync(join(pkg, "catalog.json")), before);
  assert.equal(existsSync(join(output, ".staging")), false);
});

test("wrong commit, origin, abbreviated or movable refs cannot claim pinned provenance", (t) => {
  const { pkg, commit, git } = fixture(t);
  for (const ref of [
    "main",
    "HEAD",
    commit.slice(0, 12),
    "f".repeat(40),
    "A".repeat(40),
  ])
    assert.throws(() => preparePlugin(pkg, ref), /commit/i);
  git("remote", "set-url", "origin", "https://github.com/frankxai/arcanea.git");
  assert.throws(() => preparePlugin(pkg, commit), /origin/i);
});

test("staged catalog changes and untracked support files cannot impersonate committed inputs", (t) => {
  const { pkg, commit, git } = fixture(t);
  const catalogFile = join(pkg, "catalog.json");
  const before = readFileSync(catalogFile);
  const catalog = JSON.parse(before);
  catalog.skills[0].rights.evidence = "different evidence";
  writeFileSync(catalogFile, JSON.stringify(catalog));
  git("add", "packages/arcanea-skills/catalog.json");
  assert.throws(() => preparePlugin(pkg, commit), /pinned commit/i);
  writeFileSync(catalogFile, before);
  writeFileSync(join(pkg, "skills/world-build/new-support.txt"), "unreviewed");
  assert.throws(() => preparePlugin(pkg, commit), /reviewed content changed/i);
});

test("materialization uses immutable planned bytes after source changes", (t) => {
  const { pkg, commit, output } = fixture(t);
  const plan = preparePlugin(pkg, commit);
  const file = join(pkg, "skills/world-build/SKILL.md");
  const before = readFileSync(file);
  writeFileSync(file, "post-plan changed content");
  const result = materializePlugin(plan, output);
  assert.deepEqual(
    readFileSync(join(result.pluginRoot, "skills/world-build/SKILL.md")),
    before,
  );
});

test("existing output and linked destination parent preserve creator data", (t) => {
  const { dir, pkg, commit, output } = fixture(t);
  const plan = preparePlugin(pkg, commit);
  mkdirSync(output);
  writeFileSync(join(output, "creator-note.txt"), "preserve");
  assert.throws(() => materializePlugin(plan, output), /already exists/i);
  assert.equal(
    readFileSync(join(output, "creator-note.txt"), "utf8"),
    "preserve",
  );
  const external = join(dir, "external");
  mkdirSync(external);
  symlinkSync(external, join(dir, "linked"), "junction");
  assert.throws(
    () => materializePlugin(plan, join(dir, "linked/new")),
    /unsafe output parent/i,
  );
  assert.deepEqual(readdirSync(external), []);
});

test("partial write failure keeps final plugin absent and requires a fresh retry", (t) => {
  const { pkg, commit, output, dir } = fixture(t);
  const plan = preparePlugin(pkg, commit);
  const first = plan.files[0];
  const broken = { ...plan, files: [first, first] };
  assert.throws(() => materializePlugin(broken, output), /EEXIST/i);
  assert.equal(existsSync(join(output, "plugin")), false);
  assert.equal(existsSync(join(output, ".staging")), true);
  assert.throws(() => materializePlugin(plan, output), /already exists/i);
  assert.equal(materializePlugin(plan, join(dir, "retry")).written, true);
});

test("two plans for identical input are byte-identical and do not alter repository state", (t) => {
  const { pkg, commit, git } = fixture(t);
  const before = git("status", "--porcelain");
  const a = preparePlugin(pkg, commit);
  const b = preparePlugin(pkg, commit);
  assert.deepEqual(a, b);
  assert.equal(git("status", "--porcelain"), before);
});

test("CLI refuses typo, repeated option or missing output without invoking home installation", () => {
  for (const args of [
    ["--commmit"],
    ["--commit", "a".repeat(40)],
    ["--output"],
    ["--dry-run", "--dry-run"],
  ]) {
    const run = spawnSync(
      process.execPath,
      [join(source, "bin/plugin.js"), ...args],
      { encoding: "utf8", timeout: 10000 },
    );
    assert.equal(run.status, 1, run.stderr);
    assert.match(run.stderr, /option|value|require/i);
  }
});

test(
  "native Claude validator accepts isolated synthetic transport manifest",
  { skip: !process.env.ARCANEA_PLUGIN_VALIDATOR },
  (t) => {
    const { pkg, commit, output } = fixture(t);
    const result = materializePlugin(preparePlugin(pkg, commit), output);
    const validation = spawnSync(
      process.env.ARCANEA_PLUGIN_VALIDATOR,
      ["plugin", "validate", result.pluginRoot, "--strict", "--json"],
      { encoding: "utf8", timeout: 15000 },
    );
    assert.equal(validation.status, 0, validation.stdout + validation.stderr);
    t.diagnostic(
      JSON.stringify({
        scope:
          "Synthetic fixture manifest only; no native discovery, install or skill promotion",
        commit,
        nativeValidation: JSON.parse(validation.stdout),
      }),
    );
  },
);
