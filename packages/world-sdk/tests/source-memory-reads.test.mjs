import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { buildManifest } from "../src/manifest.mjs";
import { readWorld } from "../src/fs-world.mjs";
import * as hashes from "../src/contenthash.mjs";
import { buildIndex } from "../src/index-build.mjs";
import { listMemories, recordMemory, remember } from "../src/evolution.mjs";
import { claimWorldProof, computeProof } from "../src/proof.mjs";

const exec = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));
const memory = {
  ts: "2026-10-12T00:00:00.000Z",
  characterId: "mara",
  content: "She waited for the tide.",
  salience: 0.8,
  meaningImpact: null,
};
async function fixture(t, additions = {}) {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-source-reads-"),
  );
  t.after(async () => {
    const target = path.resolve(root);
    assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
    assert.ok(path.basename(target).startsWith("arcanea-source-reads-"));
    await fs.rm(target, { recursive: true, force: true });
  });
  const dir = path.join(root, "world");
  await fs.mkdir(dir);
  const manifest = buildManifest({
    name: "The Tide Ledger",
    idSeed: "reads-fixture",
    ...additions,
  });
  await fs.writeFile(
    path.join(dir, "world.arcanea.json"),
    JSON.stringify(manifest),
  );
  await fs.mkdir(path.join(dir, "canon"));
  await fs.writeFile(
    path.join(dir, "canon/rules.md"),
    "# Rules\nThe tide rises at sunset.\n",
  );
  return { root, dir, manifest };
}
async function publicState(dir) {
  const world = await readWorld(dir);
  return {
    hash: hashes.contentHash(world.files, world.manifest),
    index: buildIndex(world),
    paths: world.files.map((f) => f.path),
  };
}
async function memoryFile(dir, bytes, name = "legacy-event.json") {
  await fs.mkdir(path.join(dir, ".arcanea/memories"), { recursive: true });
  await fs.writeFile(path.join(dir, ".arcanea/memories", name), bytes);
}
const pathDenied = { code: "ERR_ARCANEA_WORLD_PATH" };

test("undeclared notes do not enter reads, hashes or indexes, including direct file arrays", async (t) => {
  const { dir } = await fixture(t);
  const before = await publicState(dir);
  await fs.writeFile(
    path.join(dir, "working-note.md"),
    "Private working note.",
  );
  await fs.writeFile(path.join(dir, ".env"), "private placeholder");
  assert.deepEqual(await publicState(dir), before);
  const world = await readWorld(dir);
  const injected = { path: "working-note.md", bytes: "Private working note." };
  assert.equal(
    hashes.contentHash([...world.files, injected], world.manifest),
    before.hash,
  );
  assert.deepEqual(
    buildIndex({ ...world, files: [...world.files, injected] }),
    before.index,
  );
});

test("declared sources work without Git, and a real source edit changes the hash", async (t) => {
  const { dir } = await fixture(t);
  const before = await publicState(dir);
  await fs.writeFile(
    path.join(dir, "canon/rules.md"),
    "# Rules\nThe tide rises at dawn.\n",
  );
  assert.notEqual((await publicState(dir)).hash, before.hash);
  assert.ok(
    (await readWorld(dir)).files.some((f) => f.path === "canon/rules.md"),
  );
});

test("custom declarations, README and local policy/media pointers form the selected sources", async (t) => {
  const { dir } = await fixture(t, {
    content: { canon: "lore/", characters: "people/" },
    cover: "art/cover.svg",
    theme: { audio: "sound/theme.txt" },
    license: { spdx: "LicenseRef-Creator", pointer: "policies/license.md" },
    royalty: { policy: "policies/royalty.json" },
  });
  for (const folder of ["lore", "people", "art", "sound", "policies"])
    await fs.mkdir(path.join(dir, folder));
  for (const [file, bytes] of Object.entries({
    "README.md": "# World",
    "lore/rules.md": "# Rules",
    "people/mara.md": "# Mara",
    "art/cover.svg": "<svg/>",
    "sound/theme.txt": "tide",
    "policies/license.md": "Creator terms",
    "policies/royalty.json": "{}",
    "unselected.md": "working note",
  }))
    await fs.writeFile(path.join(dir, file), bytes);
  const world = await readWorld(dir);
  assert.deepEqual(world.files.map((f) => f.path).sort(), [
    "README.md",
    "art/cover.svg",
    "lore/rules.md",
    "people/mara.md",
    "policies/license.md",
    "policies/royalty.json",
    "sound/theme.txt",
  ]);
  assert.ok(
    buildIndex(world).nodes.some(
      (n) => n.type === "character" && n.id === "people/mara.md",
    ),
  );
});

test("unsafe or private/tooling declarations refuse rather than scan elsewhere", async (t) => {
  const { dir, manifest } = await fixture(t);
  for (const declared of [
    "../outside/",
    "/outside/",
    "C:/outside",
    "canon\\",
    ".arcanea/",
    "build/",
    "",
    "canon//",
  ]) {
    await fs.writeFile(
      path.join(dir, "world.arcanea.json"),
      JSON.stringify({ ...manifest, content: { canon: declared } }),
    );
    await assert.rejects(readWorld(dir), pathDenied);
  }
});

test("hidden and tooling files inside a declared directory are excluded", async (t) => {
  const { dir } = await fixture(t);
  const before = await publicState(dir);
  for (const name of [".private", "node_modules", "build"]) {
    await fs.mkdir(path.join(dir, "canon", name));
    await fs.writeFile(
      path.join(dir, "canon", name, "note.md"),
      "Working material.",
    );
  }
  assert.deepEqual(await publicState(dir), before);
});

test("declared directory redirects refuse", async (t) => {
  const { dir, root } = await fixture(t);
  const outside = path.join(root, "outside");
  await fs.mkdir(outside);
  await fs.writeFile(path.join(outside, "secret.md"), "outside sentinel");
  await fs.symlink(
    outside,
    path.join(dir, "characters"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(readWorld(dir), pathDenied);
});

test("world roots and redirected ancestors refuse for world and memory reads", async (t) => {
  const { dir, root } = await fixture(t);
  const alias = path.join(root, "alias");
  await fs.symlink(
    dir,
    alias,
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(readWorld(alias), pathDenied);
  await assert.rejects(listMemories(alias), pathDenied);
  const parentAlias = path.join(root, "parent-alias");
  const child = path.join(dir, "child");
  await fs.mkdir(child);
  await fs.writeFile(
    path.join(child, "world.arcanea.json"),
    JSON.stringify(buildManifest({ name: "Child" })),
  );
  await fs.symlink(
    dir,
    parentAlias,
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(readWorld(path.join(parentAlias, "child")), pathDenied);
  await assert.rejects(
    listMemories(path.join(parentAlias, "child")),
    pathDenied,
  );
});

test("source and memory additional hard links refuse", async (t) => {
  const { dir, root } = await fixture(t);
  const source = path.join(root, "source.md");
  await fs.writeFile(source, "outside sentinel");
  await fs.link(source, path.join(dir, "canon/linked.md"));
  await assert.rejects(readWorld(dir), pathDenied);
  await fs.mkdir(path.join(dir, ".arcanea/memories"), { recursive: true });
  const event = path.join(root, "event.json");
  await fs.writeFile(event, JSON.stringify(memory));
  await fs.link(event, path.join(dir, ".arcanea/memories/linked.json"));
  await assert.rejects(listMemories(dir), pathDenied);
});

test("source and memory file symlinks refuse", async (t) => {
  const { dir, root } = await fixture(t);
  const source = path.join(root, "source.md");
  await fs.writeFile(source, "outside sentinel");
  try {
    await fs.symlink(source, path.join(dir, "canon/linked.md"), "file");
  } catch (error) {
    if (process.platform === "win32" && error.code === "EPERM")
      return t.skip("Windows denied file-symlink fixture creation");
    throw error;
  }
  await assert.rejects(readWorld(dir), pathDenied);
  await fs.mkdir(path.join(dir, ".arcanea/memories"), { recursive: true });
  const event = path.join(root, "event.json");
  await fs.writeFile(event, JSON.stringify(memory));
  await fs.symlink(
    event,
    path.join(dir, ".arcanea/memories/linked.json"),
    "file",
  );
  await assert.rejects(listMemories(dir), pathDenied);
});

test("private memory directory and ancestor redirects refuse", async (t) => {
  for (const relative of [".arcanea", ".arcanea/memories"]) {
    const { dir, root } = await fixture(t);
    const outside = path.join(root, "outside");
    await fs.mkdir(outside);
    if (relative === ".arcanea") await fs.mkdir(path.join(outside, "memories"));
    else await fs.mkdir(path.join(dir, ".arcanea"));
    await fs.writeFile(
      path.join(
        outside,
        relative === ".arcanea" ? "memories/event.json" : "event.json",
      ),
      JSON.stringify(memory),
    );
    await fs.symlink(
      outside,
      path.join(dir, relative),
      process.platform === "win32" ? "junction" : "dir",
    );
    await assert.rejects(listMemories(dir), pathDenied);
  }
});

test("missing memory directory is empty; legacy filenames and equal timestamps remain readable", async (t) => {
  const { dir } = await fixture(t);
  assert.deepEqual(await listMemories(dir), []);
  await memoryFile(dir, JSON.stringify(memory), "old-event.json");
  await recordMemory(dir, { ...memory, content: "Second event." });
  const memories = await listMemories(dir);
  assert.equal(memories.length, 2);
  assert.ok(memories.some((m) => m.content === memory.content));
  assert.ok(memories.some((m) => m.content === "Second event."));
});

test("corrupt or invalid memories report a sanitized error and recover after a creator repair", async (t) => {
  const { dir } = await fixture(t);
  for (const bytes of [
    "private malformed sentinel {",
    "null",
    JSON.stringify({ ...memory, ts: 12 }),
    JSON.stringify({ ...memory, content: [] }),
  ]) {
    await memoryFile(dir, bytes);
    await assert.rejects(listMemories(dir), (error) => {
      assert.equal(error.code, "ERR_ARCANEA_MEMORY_INVALID");
      assert.ok(!error.message.includes("sentinel"));
      return true;
    });
  }
  await memoryFile(dir, JSON.stringify(memory));
  assert.deepEqual(await listMemories(dir), [memory]);
});

test("invalid memory input refuses before creating a record", async (t) => {
  const { dir } = await fixture(t);
  for (const bad of [
    { ...memory, ts: "not a timestamp" },
    { ...memory, ts: 0 },
    { ...memory, content: 0 },
    { ...memory, content: 3 },
    { ...memory, salience: NaN },
    { ...memory, characterId: {} },
  ]) {
    await assert.rejects(recordMemory(dir, bad), {
      code: "ERR_ARCANEA_MEMORY_INVALID",
    });
    assert.deepEqual(await listMemories(dir), []);
  }
});

test("remember refuses corrupt existing memory before appending, then retries after creator repair", async (t) => {
  const { dir } = await fixture(t);
  await memoryFile(dir, "private malformed sentinel {");
  const names = await fs.readdir(path.join(dir, ".arcanea/memories"));
  await assert.rejects(remember(dir, "New event."), {
    code: "ERR_ARCANEA_MEMORY_INVALID",
  });
  assert.deepEqual(
    await fs.readdir(path.join(dir, ".arcanea/memories")),
    names,
  );
  await memoryFile(dir, JSON.stringify(memory));
  const result = await remember(dir, "New event.");
  assert.equal(result.record.record.content, "New event.");
  const events = await listMemories(dir);
  assert.equal(events.length, 2);
  assert.equal(
    events.filter((event) => event.content === "New event.").length,
    1,
  );
});

test("private, unlisted and candidate frontmatter stays out of public hash/index with BOM and CRLF", async (t) => {
  const { dir } = await fixture(t);
  const before = await publicState(dir);
  for (const fields of [
    "visibility: private",
    "visibility: unlisted",
    "status: CANDIDATE",
    "status: STAGING",
    "status: DRAFT",
  ]) {
    await fs.writeFile(
      path.join(dir, "canon/pending.md"),
      "\uFEFF\uFEFF---\r\n" + fields + "\r\n---\r\nprivate sentinel",
    );
    const after = await publicState(dir);
    assert.equal(after.hash, before.hash);
    assert.deepEqual(after.index, before.index);
  }
});

test("ambiguous source frontmatter refuses instead of assuming public", async (t) => {
  const { dir } = await fixture(t);
  for (const fields of [
    "visibility: private\nvisibility: public",
    "visibility: typo",
    "visibility: >\n  private",
    "defaults: &secret private\n<<: *secret",
    "name: test\n  visibility: private",
    'name: "unterminated',
  ]) {
    await fs.writeFile(
      path.join(dir, "canon/pending.md"),
      "---\n" + fields + "\n---\nprivate sentinel",
    );
    await assert.rejects(readWorld(dir), {
      code: "ERR_ARCANEA_SOURCE_METADATA",
    });
  }
});

test("manifest corruption, additional links and invalid memory directory kinds refuse without mutation", async (t) => {
  const { dir, root } = await fixture(t);
  const manifestPath = path.join(dir, "world.arcanea.json");
  const saved = await fs.readFile(manifestPath);
  await fs.writeFile(manifestPath, "private malformed manifest sentinel {");
  await assert.rejects(
    readWorld(dir),
    (error) =>
      error.code === "ERR_ARCANEA_WORLD_MANIFEST" &&
      !error.message.includes("sentinel"),
  );
  await fs.writeFile(manifestPath, saved);
  const linked = path.join(root, "linked-manifest.json");
  await fs.link(manifestPath, linked);
  await assert.rejects(readWorld(dir), pathDenied);
  await fs.unlink(linked);
  assert.ok((await readWorld(dir)).files.length);
  await fs.mkdir(path.join(dir, ".arcanea"));
  await fs.writeFile(path.join(dir, ".arcanea/memories"), "retained file");
  await assert.rejects(listMemories(dir), pathDenied);
  assert.equal(
    await fs.readFile(path.join(dir, ".arcanea/memories"), "utf8"),
    "retained file",
  );
  await assert.rejects(listMemories(path.join(root, "missing-world")), {
    code: "ENOENT",
  });
});

test("public flat headers accept quoted keys/comments and strip BOM/CRLF/fence spacing from index prose", async (t) => {
  const { dir } = await fixture(t);
  await fs.writeFile(
    path.join(dir, "canon/public.md"),
    '\uFEFF--- \r\n"visibility": "public" # creator choice\r\nstatus: APPROVED\r\n--- \r\n# Public\r\nThe tide returned.',
  );
  const index = buildIndex(await readWorld(dir));
  const chunks = index.chunks.filter(
    (chunk) => chunk.path === "canon/public.md",
  );
  assert.ok(chunks.length);
  assert.ok(chunks.some((chunk) => chunk.text.includes("The tide returned.")));
  assert.ok(
    chunks.every(
      (chunk) =>
        !chunk.text.includes("visibility") && !chunk.text.includes("APPROVED"),
    ),
  );
});

test("private worlds cannot publish a hash or index, even through direct arrays", async (t) => {
  const { dir } = await fixture(t, { visibility: "private" });
  const world = await readWorld(dir);
  assert.throws(() => hashes.contentHash(world.files, world.manifest), {
    code: "WORLD_NOT_PUBLIC",
  });
  assert.throws(() => buildIndex(world), { code: "WORLD_NOT_PUBLIC" });
});

test("declared-public-v1 has a fixed independent hash vector and rejects path aliases", () => {
  const manifest = {
    schemaVersion: "1.0.0",
    id: "wld_FIXTURE",
    name: "Fixture",
    content: { canon: "canon/" },
    visibility: "public",
  };
  const files = [
    { path: "canon/rules.md", bytes: "# Rules\r\nThe tide rises.\r\n" },
  ];
  assert.equal(
    hashes.CONTENT_HASH_PROFILE,
    "arcanea-world-sdk/declared-public-v1",
  );
  // Independently calculated with Python hashlib and sorted compact JSON.
  assert.equal(
    hashes.contentHash(files, manifest),
    "sha256:0e4573efefb002213977470ee379f1bd58050ef75f361192af4b149bf0b7136a",
  );
  assert.throws(
    () =>
      hashes.contentHash(
        [...files, { ...files[0], path: "canon/Rules.md" }],
        manifest,
      ),
    pathDenied,
  );
  assert.throws(
    () =>
      hashes.contentHash(
        [{ path: "../outside.md", bytes: "outside" }],
        manifest,
      ),
    pathDenied,
  );
});

test("profile claims refuse before adapters, options or provenance writes; local proposals are tagged", async (t) => {
  const { dir } = await fixture(t);
  const manifestBefore = await fs.readFile(
    path.join(dir, "world.arcanea.json"),
  );
  let called = false;
  await assert.rejects(
    claimWorldProof({
      dir,
      adapter: {
        async getOrCreateWallet() {
          called = true;
          throw Error("adapter must not run");
        },
      },
    }),
    { code: "WORLD_HASH_PROFILE_REQUIRES_REVIEW" },
  );
  assert.equal(called, false);
  await assert.rejects(
    claimWorldProof(
      new Proxy(
        {},
        {
          get() {
            throw Error("options must not be read");
          },
        },
      ),
    ),
    { code: "WORLD_HASH_PROFILE_REQUIRES_REVIEW" },
  );
  assert.deepEqual(
    await fs.readFile(path.join(dir, "world.arcanea.json")),
    manifestBefore,
  );
  assert.equal(
    computeProof({
      manifest: buildManifest({ name: "Local proposal" }),
      hash: "sha256:fixture",
    }).hashProfile,
    "arcanea-world-sdk/declared-public-v1",
  );
});

test("actual CLI hash stays stable for unrelated notes and memory redirects/claims exit unsuccessfully", async (t) => {
  const { dir, root } = await fixture(t);
  const before = (await exec(process.execPath, [cli, "hash", dir])).stdout;
  await fs.writeFile(
    path.join(dir, "working-note.md"),
    "Private working note.",
  );
  assert.equal(
    (await exec(process.execPath, [cli, "hash", dir])).stdout,
    before,
  );
  const outside = path.join(root, "outside");
  await fs.mkdir(outside);
  await fs.writeFile(path.join(outside, "event.json"), JSON.stringify(memory));
  await fs.mkdir(path.join(dir, ".arcanea"));
  await fs.symlink(
    outside,
    path.join(dir, ".arcanea/memories"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    exec(process.execPath, [cli, "memories", dir]),
    (error) => error.code === 1 && !error.stdout.includes(memory.content),
  );
  await assert.rejects(
    exec(process.execPath, [cli, "claim", dir]),
    (error) =>
      error.code === 1 &&
      error.stderr.includes("WORLD_HASH_PROFILE_REQUIRES_REVIEW"),
  );
});
