import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "arcanea-catalog-"));
  t.after(() => {
    const rel = relative(resolve(tmpdir()), resolve(dir));
    assert.ok(rel && !rel.startsWith("..") && !rel.includes(":"));
    rmSync(dir, { recursive: true, force: true });
  });
  const pkg = join(dir, "package");
  cpSync(packageRoot, pkg, { recursive: true });
  const home = join(dir, "home");
  mkdirSync(home);
  const run = (args) =>
    spawnSync(process.execPath, [join(pkg, "bin/install.js"), ...args], {
      env: { ...process.env, HOME: home, USERPROFILE: home },
      encoding: "utf8",
      timeout: 10000,
    });
  return { dir, pkg, home, run };
}

test("installer leaves home untouched when no skill is cleared, including undeclared folders", (t) => {
  const { pkg, home, run } = fixture(t);
  mkdirSync(join(pkg, "skills/unreviewed-extra"));
  writeFileSync(
    join(pkg, "skills/unreviewed-extra/SKILL.md"),
    "---\nname: unexpected\n---\n",
  );
  const result = run([]);
  assert.equal(
    existsSync(join(home, ".claude")),
    false,
    `unreviewed material reached home: ${result.stdout}`,
  );
  assert.equal(result.status, 2);
  assert.match(result.stderr, /No skill.*cleared/i);
});

test("ready claims need rights, content and independent evidence; candidates stay visible", () => {
  const { loadCatalog, selectReady } = require("../scripts/catalog.cjs");
  const catalog = loadCatalog(packageRoot);
  assert.equal(catalog.skills.length, 4);
  assert.equal(selectReady(catalog).length, 0);
  for (const field of ["rights", "evaluation", "review"]) {
    const forged = structuredClone(catalog);
    forged.skills[0].status = "ready";
    delete forged.skills[0][field];
    assert.throws(() => selectReady(forged), /ready.*evidence/i);
  }
  const api = require("../index.js");
  assert.deepEqual(api.skills, []);
  assert.equal(api.bundledCount, 0);
  assert.equal(api.candidates.length, 4);
  assert.throws(() => api.getSkillPath("world-build"), /not.*ready/i);
});

test("candidate files validate with portable examples and exact names", () => {
  const { loadCatalog, validateSources } = require("../scripts/catalog.cjs");
  const catalog = loadCatalog(packageRoot);
  const rows = validateSources(packageRoot, catalog);
  assert.equal(rows.length, 4);
  for (const row of rows) {
    assert.match(row.sha256, /^[a-f0-9]{64}$/);
    assert.ok(row.files.includes("SKILL.md"));
    assert.ok(row.files.includes("references/example.md"));
  }
});

test("catalog rejects traversal, duplicate identity, missing source and external links", (t) => {
  const { pkg } = fixture(t);
  const { loadCatalog, validateSources } = require("../scripts/catalog.cjs");
  const catalog = loadCatalog(pkg);
  const badPath = structuredClone(catalog);
  badPath.skills[0].path = "../world-build";
  assert.throws(() => validateSources(pkg, badPath), /path/i);
  const duplicate = structuredClone(catalog);
  duplicate.skills.push(duplicate.skills[0]);
  assert.throws(() => validateSources(pkg, duplicate), /duplicate/i);
  const missing = structuredClone(catalog);
  missing.skills[0].name = "missing";
  missing.skills[0].path = "skills/missing";
  assert.throws(() => validateSources(pkg, missing), /ENOENT/);
  writeFileSync(
    join(pkg, "skills/world-build/references/outside.md"),
    "[Bad](../../../README.md)",
  );
  assert.throws(() => validateSources(pkg, catalog), /reference.*outside/i);
});

function readyFixture(t) {
  const state = fixture(t);
  const { pkg } = state;
  const { loadCatalog, validateSources } = require("../scripts/catalog.cjs");
  const catalog = loadCatalog(pkg);
  const world = catalog.skills[0];
  const row = validateSources(pkg, catalog).find(
    (item) => item.name === world.name,
  );
  const skillFile = join(pkg, world.path, "SKILL.md");
  writeFileSync(
    skillFile,
    readFileSync(skillFile, "utf8").replace(
      "internal: true",
      "internal: false",
    ),
  );
  // Fixture evidence follows the published byte-hash format; it is never release evidence.
  const hash = createHash("sha256");
  for (const file of row.files) {
    hash.update(
      `${file}\0${createHash("sha256")
        .update(readFileSync(join(pkg, world.path, file)))
        .digest("hex")}\n`,
    );
  }
  row.sha256 = hash.digest("hex");
  Object.assign(world, {
    status: "ready",
    contentSha256: row.sha256,
    rights: {
      status: "cleared",
      license: "MIT",
      evidence: "fixture-rights-review",
    },
    evaluation: {
      status: "passed",
      evidence: "fixture-evaluation",
      contentSha256: row.sha256,
    },
    review: {
      status: "passed",
      evidence: "fixture-review",
      maker: "fixture-maker",
      reviewer: "fixture-other-provider",
      contentSha256: row.sha256,
    },
  });
  writeFileSync(join(pkg, "catalog.json"), JSON.stringify(catalog));
  return state;
}

test("ready installation is exact, preserves support files, and refuses overwrites before any write", (t) => {
  const { pkg, home, run } = readyFixture(t);
  const dryRun = run(["--dry-run"]);
  assert.equal(dryRun.status, 0, dryRun.stderr);
  assert.equal(existsSync(join(home, ".claude")), false);
  const result = run([]);
  assert.equal(result.status, 0, result.stderr);
  const dest = join(home, ".claude/skills/world-build");
  assert.equal(
    readFileSync(join(dest, "SKILL.md"), "utf8"),
    readFileSync(join(pkg, "skills/world-build/SKILL.md"), "utf8"),
  );
  assert.ok(existsSync(join(dest, "references/example.md")));
  assert.equal(existsSync(join(home, ".claude/skills/character-forge")), false);
  writeFileSync(join(dest, "creator-note.md"), "Preserve my work");
  const again = run([]);
  assert.equal(again.status, 1);
  assert.match(again.stderr, /already exists/i);
  assert.equal(
    readFileSync(join(dest, "creator-note.md"), "utf8"),
    "Preserve my work",
  );
  const sourceFile = join(pkg, "skills/world-build/SKILL.md");
  writeFileSync(
    sourceFile,
    readFileSync(sourceFile, "utf8") + "\nChanged instructions\n",
  );
  const changed = run(["--dry-run"]);
  assert.equal(changed.status, 1);
  assert.match(changed.stderr, /reviewed content changed/i);
});

test("a complete ready passport fails when rights, review independence or hash binding is removed", (t) => {
  const { pkg } = readyFixture(t);
  const { loadCatalog, selectReady } = require("../scripts/catalog.cjs");
  const catalog = loadCatalog(pkg);
  assert.equal(selectReady(catalog).length, 1);
  for (const field of ["rights", "evaluation", "review"]) {
    const broken = structuredClone(catalog);
    delete broken.skills[0][field];
    assert.throws(() => selectReady(broken), /evidence/i);
  }
  const selfReviewed = structuredClone(catalog);
  selfReviewed.skills[0].review.reviewer = selfReviewed.skills[0].review.maker;
  assert.throws(() => selectReady(selfReviewed), /independent/i);
  const mismatched = structuredClone(catalog);
  mismatched.skills[0].evaluation.contentSha256 = "0".repeat(64);
  assert.throws(() => selectReady(mismatched), /evidence/i);
});

test("source junctions and destination junctions are rejected without writing outside home", (t) => {
  const { dir, pkg, home, run } = readyFixture(t);
  const external = join(dir, "external");
  mkdirSync(external);
  symlinkSync(external, join(home, ".claude"), "junction");
  const destination = run([]);
  assert.equal(destination.status, 1, destination.stderr);
  assert.match(destination.stderr, /unsafe destination/i);
  assert.equal(existsSync(join(external, "skills")), false);
  symlinkSync(external, join(pkg, "skills/world-build/linked"), "junction");
  const source = run(["--dry-run"]);
  assert.equal(source.status, 1);
  assert.match(source.stderr, /unsafe skill source/i);
});

test("unknown CLI flags are rejected without installing anything", (t) => {
  const { home, run } = fixture(t);
  const result = run(["--instal"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown/i);
  assert.equal(existsSync(join(home, ".claude")), false);
});
