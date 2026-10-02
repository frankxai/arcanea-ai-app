import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { readWorld, parseFrontmatter } from "../src/fs-world.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { claimWorldProof } from "../src/proof.mjs";
import { scaffoldWorld } from "../src/scaffold.mjs";
import { fixture, authoredWorld } from "./helpers.mjs";

test("only declared source paths are read, hashed and indexed", async (t) => {
  const dir = await fixture(t);
  await authoredWorld(dir);
  const before = await readWorld(dir);
  const h0 = contentHash(before.files, before.manifest);
  await fs.writeFile(path.join(dir, ".env"), "PRIVATE_TEST_DATA");
  await fs.writeFile(
    path.join(dir, "undeclared.md"),
    "# Unselected\n\nDo not export.\n",
  );
  await fs.mkdir(path.join(dir, ".arcanea/memories"), { recursive: true });
  await fs.writeFile(path.join(dir, ".arcanea/memories/local.json"), "{}");
  const after = await readWorld(dir);
  assert.equal(
    after.files.some((f) =>
      [".env", "undeclared.md", ".arcanea/memories/local.json"].includes(
        f.path,
      ),
    ),
    false,
  );
  assert.equal(contentHash(after.files, after.manifest), h0);
  const supplied = [
    ...before.files,
    { path: "undeclared.md", bytes: "Do not export." },
    { path: ".env", bytes: "PRIVATE_TEST_DATA" },
  ];
  assert.equal(contentHash(supplied, before.manifest), h0);
  assert.equal(
    buildIndex({ ...before, files: supplied }).chunks.some(
      (c) => c.path === "undeclared.md",
    ),
    false,
  );
});

test("declared custom roots and policy files participate while undeclared files do not", async (t) => {
  const dir = await fixture(t);
  const manifest = await authoredWorld(dir, {
    content: { canon: "lore", characters: "cast" },
    license: { spdx: "PROPRIETARY", pointer: "rights/terms.md" },
  });
  await fs.mkdir(path.join(dir, "lore"));
  await fs.mkdir(path.join(dir, "cast"));
  await fs.mkdir(path.join(dir, "rights"));
  await fs.writeFile(path.join(dir, "lore/law.md"), "# Law\n\nLow tide.\n");
  await fs.writeFile(
    path.join(dir, "cast/mira.md"),
    "# Mira\n\nCannot grow glass.\n",
  );
  await fs.writeFile(
    path.join(dir, "rights/terms.md"),
    "Fixture declaration.\n",
  );
  const first = await readWorld(dir);
  assert.equal(
    first.files.some((f) => f.path === "canon/bridge.md"),
    false,
  );
  const index = buildIndex(first);
  assert.ok(
    index.nodes.some((n) => n.type === "character" && n.id === "cast/mira.md"),
  );
  const h0 = contentHash(first.files, manifest);
  await fs.writeFile(
    path.join(dir, "rights/terms.md"),
    "Changed fixture declaration.\n",
  );
  const next = await readWorld(dir);
  assert.notEqual(contentHash(next.files, next.manifest), h0);
});

test("frontmatter supports CRLF and excludes private/candidate content despite supplied public flags", () => {
  const manifest = {
    schemaVersion: "1.0.0",
    id: "wld_" + "0".repeat(26),
    name: "Tideglass",
    creator: { handle: "fixture" },
    content: { canon: "canon/" },
  };
  const baseline = contentHash([], manifest);
  for (const metadata of [
    "visibility: private",
    "visibility: unlisted",
    "status: CANDIDATE",
    "status: STAGING",
  ]) {
    const bytes = `---\r\n${metadata}\r\n---\r\n\r\n# Secret\r\n\r\nDo not export.\r\n`;
    assert.ok(Object.keys(parseFrontmatter(bytes).data).length);
    const files = [{ path: "canon/private.md", bytes, visibility: "public" }];
    assert.equal(contentHash(files, manifest), baseline);
    assert.equal(buildIndex({ manifest, files }).chunks.length, 0);
  }
});

for (const header of [
  "visibility: private\nvisibility: public",
  "visibility: [public]",
  "visibility: unexpected",
  "visibility: private\n  malformed: yes",
]) {
  test(`ambiguous visibility declaration fails closed: ${JSON.stringify(header)}`, () => {
    const manifest = {
      schemaVersion: "1.0.0",
      id: "wld_" + "0".repeat(26),
      name: "Tideglass",
      creator: { handle: "fixture" },
      content: { canon: "canon/" },
    };
    const files = [
      {
        path: "canon/private.md",
        bytes: `---\n${header}\n---\n\nPrivate fixture.`,
      },
    ];
    assert.throws(() => contentHash(files, manifest));
    assert.throws(() => buildIndex({ manifest, files }));
  });
}

test("duplicates and unsafe supplied source paths cannot produce a hash", () => {
  const manifest = {
    schemaVersion: "1.0.0",
    id: "wld_" + "0".repeat(26),
    name: "Tideglass",
    creator: { handle: "fixture" },
    content: { canon: "canon/" },
  };
  assert.throws(() =>
    contentHash([{ path: "../canon/escape.md", bytes: "fixture" }], manifest),
  );
  assert.throws(() =>
    contentHash(
      [
        { path: "canon/a.md", bytes: "first" },
        { path: "canon/a.md", bytes: "second" },
      ],
      manifest,
    ),
  );
});

test("non-public worlds cannot build a public hash/index or invoke proof adapters", async (t) => {
  const dir = await fixture(t);
  await authoredWorld(dir, { visibility: "private" });
  const world = await readWorld(dir);
  assert.throws(() => contentHash(world.files, world.manifest));
  assert.throws(() => buildIndex(world));
  let calls = 0;
  const adapter = {
    chain: "other",
    async getOrCreateWallet() {
      calls++;
      return { pubkey: "fixture" };
    },
    async mint() {
      calls++;
      return { ref: "fixture", standard: "fixture" };
    },
  };
  await assert.rejects(claimWorldProof({ dir, adapter }));
  assert.equal(calls, 0);
});

test("scaffolding uses declared custom content folders", async (t) => {
  const dir = await fixture(t);
  await scaffoldWorld(
    dir,
    {
      name: "Tideglass",
      content: { canon: "lore", characters: "cast" },
      characters: [{ name: "Mira: Tidekeeper" }],
    },
    { useWorldEngine: false },
  );
  const world = await readWorld(dir);
  assert.ok(world.files.some((f) => f.path === "lore/world-bible.md"));
  assert.ok(
    buildIndex(world).nodes.some(
      (n) => n.type === "character" && n.title === "Mira: Tidekeeper",
    ),
  );
  await assert.rejects(fs.stat(path.join(dir, "canon")), { code: "ENOENT" });
});

test("private tooling declarations and missing explicit policy files fail closed", async (t) => {
  const dir = await fixture(t);
  const manifest = await authoredWorld(dir);
  for (const content of [
    { canon: ".arcanea" },
    { canon: "node_modules" },
    { canon: "canon/../outside" },
  ]) {
    assert.throws(() => contentHash([], { ...manifest, content }));
  }
  await fs.writeFile(
    path.join(dir, "world.arcanea.json"),
    JSON.stringify({
      ...manifest,
      license: { spdx: "PROPRIETARY", pointer: "rights/missing.md" },
    }),
  );
  await assert.rejects(readWorld(dir), { code: "ENOENT" });
});
