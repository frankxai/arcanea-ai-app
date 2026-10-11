import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { writeFiles, writeManifest, readWorld } from "../src/fs-world.mjs";
import { buildManifest } from "../src/manifest.mjs";
import { scaffoldWorld } from "../src/scaffold.mjs";
import { recordMemory } from "../src/evolution.mjs";
import { fixture, authoredWorld } from "./helpers.mjs";

for (const target of [
  "../outside.md",
  "canon/../../outside.md",
  "/absolute.md",
  "C:/absolute.md",
  "canon\\..\\outside.md",
  "canon/./file.md",
  "canon/name:stream",
  ".git/config",
  "canon/CON.md",
  "canon/trailing. ",
]) {
  test(`unsafe write path ${JSON.stringify(target)} fails before any batch writes`, async (t) => {
    const dir = path.join(await fixture(t), "world");
    await assert.rejects(
      writeFiles(dir, [
        { path: "canon/first.md", bytes: "first" },
        { path: target, bytes: "unsafe" },
      ]),
    );
    await assert.rejects(fs.stat(path.join(dir, "canon/first.md")), {
      code: "ENOENT",
    });
  });
}

test("declared content traversal is rejected before manifest or scaffold writes", async (t) => {
  const dir = path.join(await fixture(t), "world");
  await assert.rejects(
    writeManifest(
      dir,
      buildManifest({ name: "Tideglass", content: { canon: "../outside" } }),
    ),
  );
  await assert.rejects(fs.stat(dir), { code: "ENOENT" });
  await assert.rejects(
    scaffoldWorld(
      dir,
      {
        name: "Tideglass",
        agents: [{ id: "../../outside", harness: "any", role: "fixture" }],
      },
      { useWorldEngine: false },
    ),
  );
  await assert.rejects(fs.stat(dir), { code: "ENOENT" });
});

test("duplicate destination aliases and file/directory conflicts fail before mutation", async (t) => {
  for (const paths of [
    ["canon/Foo.md", "canon/foo.md"],
    ["canon/part", "canon/part/chapter.md"],
    ["canon/part", "canon/part-other", "canon/part/chapter.md"],
  ]) {
    const dir = path.join(await fixture(t), "world");
    await assert.rejects(
      writeFiles(
        dir,
        paths.map((p) => ({ path: p, bytes: "fixture" })),
      ),
    );
    await assert.rejects(fs.stat(dir), { code: "ENOENT" });
  }
});

test("world root and child junctions cannot redirect writes", async (t) => {
  const root = await fixture(t);
  const outside = path.join(root, "outside");
  await fs.mkdir(outside);
  const link = path.join(root, "link");
  await fs.symlink(
    outside,
    link,
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    writeManifest(link, buildManifest({ name: "Tideglass" })),
  );
  const dir = path.join(root, "world");
  await fs.mkdir(dir);
  await fs.symlink(
    outside,
    path.join(dir, "canon"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(
    writeFiles(dir, [{ path: "canon/escape.md", bytes: "unsafe" }]),
  );
  assert.deepEqual(await fs.readdir(outside), []);
});

test("hardlinked destinations cannot modify another file", async (t) => {
  const root = await fixture(t);
  const original = path.join(root, "original.md");
  await fs.writeFile(original, "keep");
  const dir = path.join(root, "world");
  await fs.mkdir(dir);
  await fs.link(original, path.join(dir, "alias.md"));
  await assert.rejects(
    writeFiles(dir, [{ path: "alias.md", bytes: "overwrite" }]),
  );
  assert.equal(await fs.readFile(original, "utf8"), "keep");
});

test("declared source links fail reads instead of silently omitting source", async (t) => {
  const root = await fixture(t);
  const dir = path.join(root, "world");
  await authoredWorld(dir);
  const outside = path.join(root, "outside");
  await fs.mkdir(outside);
  await fs.symlink(
    outside,
    path.join(dir, "books"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(readWorld(dir));
});

test("memory storage cannot follow a private-directory junction", async (t) => {
  const root = await fixture(t);
  const outside = path.join(root, "outside");
  await fs.mkdir(outside);
  const dir = path.join(root, "world");
  await fs.mkdir(dir);
  await fs.symlink(
    outside,
    path.join(dir, ".arcanea"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(recordMemory(dir, { content: "fixture" }));
  assert.deepEqual(await fs.readdir(outside), []);
});

test("SDK writes cannot create or replace locked canon", async (t) => {
  const dir = await fixture(t);
  await fs.mkdir(path.join(dir, "characters"));
  const locked =
    "---\nstatus: LOCKED\nvisibility: public\n---\n\nApproved character.\n";
  await fs.writeFile(path.join(dir, "characters/approved.md"), locked);
  await assert.rejects(
    writeFiles(dir, [{ path: "characters/approved.md", bytes: "changed" }]),
  );
  await assert.rejects(
    writeFiles(dir, [{ path: "characters/new.md", bytes: locked }]),
  );
  await assert.rejects(
    writeFiles(dir, [
      { path: ".arcanea/lore/CANON_LOCKED.md", bytes: "changed" },
    ]),
  );
  assert.equal(
    await fs.readFile(path.join(dir, "characters/approved.md"), "utf8"),
    locked,
  );
});

test("scaffolding refuses to overwrite an existing world or source file", async (t) => {
  const dir = await fixture(t);
  await authoredWorld(dir);
  const before = await fs.readFile(path.join(dir, "world.arcanea.json"));
  await assert.rejects(
    scaffoldWorld(dir, { name: "Replacement" }, { useWorldEngine: false }),
  );
  assert.deepEqual(
    await fs.readFile(path.join(dir, "world.arcanea.json")),
    before,
  );
});
