"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const meta = require("../index.js");
const manifest = require("../package.json");

test("published entrypoint reports the actual bundle and package version", () => {
  const actual = fs.readdirSync(path.join(__dirname, "../skills")).sort();
  assert.equal(meta.version, manifest.version);
  assert.deepEqual(meta.skills, actual);
  assert.equal(meta.skillCount, actual.length);
  assert.equal(meta.bundledCount, actual.length);
  assert.deepEqual(
    Object.values(meta.categories)
      .flatMap((category) => category.skills)
      .sort(),
    actual,
  );
  for (const skill of actual)
    assert.ok(
      fs.statSync(path.join(meta.getSkillPath(skill), "SKILL.md")).isFile(),
    );
});

test("category results cannot mutate later lookups and prototype keys are rejected", () => {
  const first = meta.getByCategory("creative");
  first.length = 0;
  assert.ok(meta.getByCategory("creative").length > 0);
  for (const name of ["__proto__", "constructor", "missing"])
    assert.throws(() => meta.getByCategory(name), /Unknown category/);
  for (const name of ["../index.js", "missing", "__proto__"])
    assert.throws(() => meta.getSkillPath(name), /Unknown bundled skill/);
});
