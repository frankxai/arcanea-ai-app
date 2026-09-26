import assert from "node:assert/strict";
import test from "node:test";
import { needsLockfileChange } from "../lockfile-drift.mjs";

const base = {
  name: "@arcanea/mcp-server",
  version: "1.0.0",
  description: "old",
  scripts: { build: "tsc" },
  dependencies: { zod: "^4.0.0" },
  devDependencies: { typescript: "^5.4.0" },
};

test("metadata and script edits never require a lockfile change", () => {
  const after = {
    ...base,
    version: "1.1.0",
    description: "new",
    scripts: { build: "tsc", test: "node --test" },
    keywords: ["mcp"],
  };
  assert.equal(needsLockfileChange(base, after), false);
});

test("reordering dependencies is not a change", () => {
  const before = { ...base, dependencies: { a: "1", b: "2" } };
  const after = { ...base, dependencies: { b: "2", a: "1" } };
  assert.equal(needsLockfileChange(before, after), false);
});

test("any dependency field change requires a lockfile change", () => {
  for (const field of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
    "peerDependenciesMeta",
    "dependenciesMeta",
    "bundledDependencies",
    "overrides",
    "resolutions",
    "pnpm",
  ]) {
    const after = {
      ...base,
      [field]: { ...(base[field] ?? {}), added: "1.0.0" },
    };
    assert.equal(needsLockfileChange(base, after), true, field);
  }
});

test("adding or removing a workspace package requires a lockfile change", () => {
  assert.equal(needsLockfileChange(null, base), true);
  assert.equal(needsLockfileChange(base, null), true);
});

test("the change PR #388 made (description + scripts) passes", () => {
  const before = { ...base, scripts: { prepublishOnly: "pnpm run build" } };
  const after = {
    ...base,
    description: "Local Arcanea worldbuilding MCP tools",
    scripts: {
      test: "node --test tests/*.test.mjs",
      prepack: "tsc",
      prepublishOnly: "tsc",
    },
  };
  assert.equal(needsLockfileChange(before, after), false);
});
