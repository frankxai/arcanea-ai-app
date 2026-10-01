import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import test from "node:test";
import {
  auditSnapshot,
  auditResources,
  skillName,
} from "./audit-skill-sources.mjs";

test("reads one scalar name; flags missing, duplicate and complex YAML names", () => {
  assert.equal(
    skillName('---\r\nname: "world-build"\r\ndescription: x\r\n---\r\n'),
    "world-build",
  );
  for (const text of [
    "name: world-build",
    "---\nname: |\n  world-build\n---\n",
    "---\nname: one\nname: two\n---\n",
  ])
    assert.equal(skillName(text), null);
});

test("committed inventory ignores working edits and untracked files, and exposes variants", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "arcanea-skill-audit-"));
  t.after(() => {
    assert.ok(
      relative(resolve(tmpdir()), resolve(cwd)).startsWith(
        "arcanea-skill-audit-",
      ),
    );
    rmSync(cwd, { recursive: true, force: true });
  });
  const git = (args) => execFileSync("git", args, { cwd, encoding: "utf8" });
  git(["init", "-q"]);
  const put = (path, text) => {
    mkdirSync(join(cwd, path, ".."), { recursive: true });
    writeFileSync(join(cwd, path), text);
  };
  const original =
    "---\nname: world-build\ndescription: 世界\n---\nWorld instructions\n";
  put("skills/world-build/SKILL.md", original);
  put(".claude/skills/world-build/SKILL.md", original);
  put("oss/skills/world-build/SKILL.md", `${original}Different instructions\n`);
  put("LICENSE", "Root rights evidence");
  put("oss/LICENSE.md", "Nested rights evidence");
  put("examples/nameless/SKILL.md", "No frontmatter");
  git(["add", "--", "skills", ".claude", "oss", "LICENSE", "examples"]);
  git([
    "-c",
    "user.name=Audit test",
    "-c",
    "user.email=audit@example.invalid",
    "commit",
    "-qm",
    "fixture",
  ]);
  const first = auditSnapshot({ cwd });
  assert.equal(first.files, 4);
  assert.equal(first.uniqueNames, 1);
  assert.equal(first.duplicates[0].identicalSkillText, false);
  assert.equal(first.duplicates[0].paths.length, 3);
  assert.deepEqual(first.rootLicenseFiles, ["LICENSE"]);
  assert.deepEqual(
    first.entries.find((row) => row.root === "oss/skills").ancestorLicenseFiles,
    ["LICENSE", "oss/LICENSE.md"],
  );
  put("skills/world-build/SKILL.md", "Working edit");
  put("skills/untracked/SKILL.md", original);
  assert.deepEqual(auditSnapshot({ cwd }), first);
  const scoped = auditSnapshot({ cwd, root: "skills" });
  assert.equal(scoped.files, 1);
  assert.equal(scoped.entries[0].name, "world-build");
  assert.equal(scoped.duplicates.length, 0);
  assert.equal(
    auditSnapshot({ cwd, root: "skills", ref: first.commit }).commit,
    first.commit,
  );
  assert.throws(() => auditSnapshot({ cwd, root: "../skills" }), /relative/);
  assert.throws(
    () => auditSnapshot({ cwd, root: "missing" }),
    /does not exist/,
  );
  assert.throws(() => auditSnapshot({ cwd, ref: "--output=bad" }));
  put("oss/skills/world-build/SKILL.md", original);
  git(["add", "--", "oss/skills/world-build/SKILL.md"]);
  git([
    "-c",
    "user.name=Audit test",
    "-c",
    "user.email=audit@example.invalid",
    "commit",
    "-qm",
    "identical fixture",
  ]);
  assert.equal(auditSnapshot({ cwd }).duplicates[0].identicalSkillText, true);
  assert.deepEqual(auditSnapshot({ cwd, ref: first.commit }), first);
});

test("resource inventory preserves shared references, cycles and support files at immutable bytes", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "arcanea-resource-audit-"));
  t.after(() => {
    assert.ok(
      relative(resolve(tmpdir()), resolve(cwd)).startsWith(
        "arcanea-resource-audit-",
      ),
    );
    rmSync(cwd, { recursive: true, force: true });
  });
  const git = (args, options = {}) =>
    execFileSync("git", args, { cwd, encoding: "utf8", ...options });
  git(["init", "-q"]);
  const put = (path, text) => {
    mkdirSync(join(cwd, path, ".."), { recursive: true });
    writeFileSync(join(cwd, path), text);
  };
  put(
    "skills/world/SKILL.md",
    "Read `../../references/shared.md`. [Missing](missing.md) [Escape](../../../outside.md) [Link](linked.md) [Outside](https://example.invalid)",
  );
  put("skills/world/example.md", "Support\n");
  put(
    "references/shared.md",
    "[Cycle](../skills/world/SKILL.md) [Template](../templates/%E4%B8%96%E7%95%8C.md)",
  );
  put("templates/世界.md", "Original template bytes\n");
  git(["add", "--", "skills", "references", "templates"]);
  const linkBlob = git(["hash-object", "-w", "--stdin"], {
    input: "../../private.md",
  }).trim();
  git([
    "update-index",
    "--add",
    "--cacheinfo",
    `120000,${linkBlob},skills/world/linked.md`,
  ]);
  git([
    "-c",
    "user.name=Audit test",
    "-c",
    "user.email=audit@example.invalid",
    "commit",
    "-qm",
    "resources",
  ]);
  const report = auditResources({ cwd, paths: ["skills/world/SKILL.md"] });
  const row = report.entries[0];
  assert.deepEqual(
    row.files.map((file) => file.path),
    [
      "references/shared.md",
      "skills/world/SKILL.md",
      "skills/world/example.md",
      "templates/世界.md",
    ],
  );
  assert.equal(row.files.filter((file) => file.outsideSkill).length, 2);
  assert.deepEqual(
    new Set(row.issues.map((issue) => issue.issue)),
    new Set([
      "unresolved-file-reference",
      "outside-repository",
      "nonregular-resource",
    ]),
  );
  assert.ok(row.files.every((file) => /^[a-f0-9]{64}$/.test(file.sha256)));
  assert.equal(
    row.files.find((file) => file.path === "templates/世界.md").sha256,
    createHash("sha256").update("Original template bytes\n").digest("hex"),
  );
  put("references/shared.md", "Uncommitted loss of template reference");
  put("skills/world/untracked.md", "Must stay excluded");
  assert.deepEqual(
    auditResources({ cwd, paths: ["skills/world/SKILL.md"] }),
    report,
  );
  assert.throws(
    () => auditResources({ cwd, paths: ["../skills/world/SKILL.md"] }),
    /Invalid skill entry/,
  );
  assert.throws(
    () => auditResources({ cwd, paths: ["missing/SKILL.md"] }),
    /Invalid skill entry/,
  );
});
