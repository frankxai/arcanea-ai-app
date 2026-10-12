import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  writeFiles,
  writeManifest,
  recordMemory,
  listMemories,
  addCharacter,
} from "../src/index.mjs";

const denied = (error) => error.code === "ERR_ARCANEA_WORLD_PATH";

async function fixture(t) {
  const parent = await fs.mkdtemp(
    path.join(os.tmpdir(), "arcanea-world-write-"),
  );
  t.after(async () => {
    assert.equal(path.dirname(parent), path.resolve(os.tmpdir()));
    assert.ok(path.basename(parent).startsWith("arcanea-world-write-"));
    await fs.rm(parent, { recursive: true, force: true });
  });
  const world = path.join(parent, "world");
  const outside = path.join(parent, "outside");
  await fs.mkdir(world);
  await fs.mkdir(outside);
  await fs.writeFile(path.join(parent, "sentinel.md"), "outside sentinel\n");
  await fs.writeFile(path.join(outside, "sentinel.md"), "redirect sentinel\n");
  return { parent, world, outside };
}

async function snapshot(root) {
  const out = [];
  async function visit(relative = "") {
    const entries = await fs.readdir(path.join(root, relative));
    for (const name of entries.sort()) {
      const rel = path.join(relative, name);
      const file = path.join(root, rel);
      const stat = await fs.lstat(file);
      if (stat.isSymbolicLink()) {
        out.push([rel, "link", await fs.readlink(file)]);
      } else if (stat.isDirectory()) {
        out.push([rel, "directory"]);
        await visit(rel);
      } else {
        out.push([rel, "file", (await fs.readFile(file)).toString("base64")]);
      }
    }
  }
  await visit();
  return out;
}

const directoryLink = (target, link) =>
  fs.symlink(target, link, process.platform === "win32" ? "junction" : "dir");

test("world writes reject portable traversal and device paths without effects", async (t) => {
  const { parent, world } = await fixture(t);
  const before = await snapshot(parent);
  const invalid = [
    "../sentinel.md",
    "canon/../../sentinel.md",
    "/sentinel.md",
    "C:/sentinel.md",
    "C:sentinel.md",
    "\\\\server\\share\\sentinel.md",
    "canon\\..\\..\\sentinel.md",
    "canon//scene.md",
    "canon/./scene.md",
    "canon/../scene.md",
    "canon/scene.md.",
    "canon/scene.md ",
    "canon/scene.md:stream",
    "NUL.txt",
    "canon/COM1.md",
    "canon/LPT2",
    "canon/\0scene.md",
    "",
    null,
  ];
  for (const unsafe of invalid) {
    await assert.rejects(
      writeFiles(world, [{ path: unsafe, bytes: "must not be written" }]),
      denied,
      String(unsafe),
    );
    assert.deepEqual(await snapshot(parent), before);
  }
});

test("a rejected batch never writes its otherwise valid first file", async (t) => {
  const { parent, world } = await fixture(t);
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(world, [
      { path: "chapters/first.md", bytes: "valid draft" },
      { path: "../sentinel.md", bytes: "escape" },
    ]),
    denied,
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("invalid batches do not create a missing world or draft directories", async (t) => {
  const { parent } = await fixture(t);
  const missing = path.join(parent, "new-world");
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(missing, [
      { path: "chapters/first.md", bytes: "valid draft" },
      { path: "../sentinel.md", bytes: "escape" },
    ]),
    denied,
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("world writes reject directory redirects before any batch mutation", async (t) => {
  const { parent, world, outside } = await fixture(t);
  await directoryLink(outside, path.join(world, "canon"));
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(world, [
      { path: "chapters/first.md", bytes: "valid draft" },
      { path: "canon/sentinel.md", bytes: "redirected write" },
    ]),
    denied,
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("a harness character write cannot follow a directory redirect", async (t) => {
  const { parent, world, outside } = await fixture(t);
  await directoryLink(outside, path.join(world, "characters"));
  const before = await snapshot(parent);
  await assert.rejects(addCharacter(world, { name: "Sentinel" }), denied);
  assert.deepEqual(await snapshot(parent), before);
});

test("world and manifest overwrites refuse multiply linked files", async (t) => {
  const { parent, world, outside } = await fixture(t);
  const sentinel = path.join(outside, "sentinel.md");
  await fs.link(sentinel, path.join(world, "linked.md"));
  await fs.link(sentinel, path.join(world, "world.arcanea.json"));
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(world, [
      { path: "new.md", bytes: "valid draft" },
      { path: "linked.md", bytes: "must not modify the outside inode" },
    ]),
    denied,
  );
  await assert.rejects(writeManifest(world, { name: "replacement" }), denied);
  assert.deepEqual(await snapshot(parent), before);
});

test("world and manifest writes refuse file symlinks", async (t) => {
  const { parent, world, outside } = await fixture(t);
  const sentinel = path.join(outside, "sentinel.md");
  try {
    await fs.symlink(sentinel, path.join(world, "linked.md"), "file");
  } catch (error) {
    if (process.platform !== "win32" || error.code !== "EPERM") throw error;
    t.skip(
      "Windows denied file-symlink creation; this case must run on Linux CI.",
    );
    return;
  }
  await fs.symlink(sentinel, path.join(world, "world.arcanea.json"), "file");
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(world, [{ path: "linked.md", bytes: "redirected write" }]),
    denied,
  );
  await assert.rejects(writeManifest(world, { name: "replacement" }), denied);
  assert.deepEqual(await snapshot(parent), before);
});

test("private memory capture cannot write through an arcanea directory redirect", async (t) => {
  const { parent, world, outside } = await fixture(t);
  await directoryLink(outside, path.join(world, ".arcanea"));
  const before = await snapshot(parent);
  await assert.rejects(
    recordMemory(world, { content: "private memory must stay in this world" }),
    denied,
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("a redirected world root is refused without affecting either tree", async (t) => {
  const { parent, outside } = await fixture(t);
  const rootLink = path.join(parent, "world-link");
  await directoryLink(outside, rootLink);
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(rootLink, [{ path: "sentinel.md", bytes: "root escape" }]),
    denied,
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("invalid bytes or a file used as a parent do not partially write a batch", async (t) => {
  const { parent, world } = await fixture(t);
  await fs.writeFile(path.join(world, "not-a-directory"), "original");
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(world, [
      { path: "new.md", bytes: "valid draft" },
      { path: "nested/bad.md", bytes: null },
    ]),
    TypeError,
  );
  assert.deepEqual(await snapshot(parent), before);
  await assert.rejects(
    writeFiles(world, [
      { path: "new.md", bytes: "valid draft" },
      { path: "not-a-directory/file.md", bytes: "invalid parent" },
    ]),
    denied,
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("ordinary nested writes, overwrites and private memory capture still work", async (t) => {
  const { parent } = await fixture(t);
  const world = path.join(parent, "new-world");
  await writeFiles(world, [
    { path: "chapters/scene.md", bytes: "first draft" },
    { path: "media/sample.bin", bytes: Buffer.from([0, 1, 255]) },
  ]);
  await writeFiles(world, [
    { path: "chapters/scene.md", bytes: "revised draft" },
  ]);
  assert.equal(
    await fs.readFile(path.join(world, "chapters/scene.md"), "utf8"),
    "revised draft",
  );
  assert.deepEqual(
    await fs.readFile(path.join(world, "media/sample.bin")),
    Buffer.from([0, 1, 255]),
  );
  await writeManifest(world, { name: "creator-owned world" });
  assert.deepEqual(
    JSON.parse(
      await fs.readFile(path.join(world, "world.arcanea.json"), "utf8"),
    ),
    { name: "creator-owned world" },
  );
  const memory = await recordMemory(world, {
    content: "a private choice",
    ts: "2026-10-12T00:00:00Z",
  });
  assert.ok(memory.path.startsWith(".arcanea/memories/"));
  assert.equal((await listMemories(world))[0].content, "a private choice");
});

test("exclusive writes never replace an accepted existing file", async (t) => {
  const { parent, world } = await fixture(t);
  await writeFiles(world, [{ path: "accepted.md", bytes: "accepted" }], {
    exclusive: true,
  });
  const before = await snapshot(parent);
  await assert.rejects(
    writeFiles(world, [{ path: "accepted.md", bytes: "replacement" }], {
      exclusive: true,
    }),
    { code: "EEXIST" },
  );
  assert.deepEqual(await snapshot(parent), before);
});

test("empty roots and internal batch conflicts refuse before filesystem effects", async (t) => {
  const { parent, world } = await fixture(t);
  const before = await snapshot(parent);
  await assert.rejects(writeFiles("", []), denied);
  for (const files of [
    [
      { path: "draft.md", bytes: "draft" },
      { path: "draft.md/child.md", bytes: "child" },
    ],
    [
      { path: "draft.md/child.md", bytes: "child" },
      { path: "draft.md", bytes: "draft" },
    ],
  ]) {
    await assert.rejects(writeFiles(world, files), denied);
    assert.deepEqual(await snapshot(parent), before);
  }
  await assert.rejects(
    writeFiles(
      world,
      [
        { path: "draft.md", bytes: "first" },
        { path: "draft.md", bytes: "second" },
      ],
      { exclusive: true },
    ),
    { code: "EEXIST" },
  );
  assert.deepEqual(await snapshot(parent), before);
});
