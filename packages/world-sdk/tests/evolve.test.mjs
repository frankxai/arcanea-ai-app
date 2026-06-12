import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { createWorld } from "../src/scaffold.mjs";
import { addCharacter } from "../src/harness.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { contentHash } from "../src/contenthash.mjs";
import { recordMemory, loadMemories, distillOffline, evolveCharacter, evolveWorld } from "../src/evolve.mjs";

const SENTENCE = "a drowned city where memory is currency";
const AT = "2026-06-12T00:00:00.000Z";
const opts = { idSeed: SENTENCE, creator: { handle: "frankx" }, useWorldEngine: false };
const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), "arcanea-evolve-"));

async function seededWorld() {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  await addCharacter(dir, { name: "Echo", role: "diver", persona: "A diver who listens.", backstory: "Born below." });
  return dir;
}

test("memories accumulate in tooling space and never move the public content hash", async () => {
  const dir = await seededWorld();
  const before = await readWorld(dir);
  const hashBefore = contentHash(before.files, before.manifest);

  await recordMemory(dir, { character: "Echo", content: "Echo guided a stranger through the Sunken Stacks.", salience: 0.8, at: AT });
  await recordMemory(dir, { character: "Echo", content: "Echo refused to sell the memory of her sister's laugh.", salience: 0.9, at: AT });

  assert.equal((await loadMemories(dir, "Echo")).length, 2);
  const after = await readWorld(dir);
  assert.equal(hashBefore, contentHash(after.files, after.manifest), "memories are pre-canon: hash must not move");
});

test("distillOffline is deterministic and salience-weighted", () => {
  const mems = [
    { content: "She protected the archive from looters", salience: 0.9 },
    { content: "She protected a child from the tide", salience: 0.8 },
    { content: "Bought bread", salience: 0.1 },
  ];
  const a = distillOffline(mems);
  const b = distillOffline(mems);
  assert.deepEqual(a, b);
  assert.equal(a.themes[0], "protected", "highest salience-weighted theme wins");
  assert.equal(a.interactions, 3);
});

test("evolve changes the character AND grows public canon (the moat)", async () => {
  const dir = await seededWorld();
  await recordMemory(dir, { character: "Echo", content: "Echo guarded the drowned bells against thieves.", salience: 0.9, at: AT });
  await recordMemory(dir, { character: "Echo", content: "Echo guarded a sleeping leviathan all night.", salience: 0.8, at: AT });

  const pre = await readWorld(dir);
  const hashPre = contentHash(pre.files, pre.manifest);

  const res = await evolveCharacter({ dir, character: "Echo", at: AT });
  assert.ok(res.evolved);
  assert.equal(res.state.disposition, "transformed");

  const charDoc = await fs.readFile(path.join(dir, "characters", "echo.md"), "utf8");
  assert.match(charDoc, /## Evolution/);
  assert.match(charDoc, /evolution: transformed/);
  assert.match(charDoc, /guarded/);

  const lore = await fs.readFile(path.join(dir, res.loreFile), "utf8");
  assert.match(lore, /canonLevel: 2/);
  assert.match(lore, /Echo, transformed/);

  const post = await readWorld(dir);
  assert.notEqual(hashPre, contentHash(post.files, post.manifest), "evolution writes NEW public canon: hash must move");
});

test("evolveCharacter is idempotent on the Evolution section; evolveWorld sweeps all", async () => {
  const dir = await seededWorld();
  await recordMemory(dir, { character: "Echo", content: "Echo traded a sunrise for a name.", salience: 0.7, at: AT });
  await evolveCharacter({ dir, character: "Echo", at: AT });
  await recordMemory(dir, { character: "Echo", content: "Echo traded nothing ever again.", salience: 0.7, at: AT });
  await evolveCharacter({ dir, character: "Echo", at: AT });

  const charDoc = await fs.readFile(path.join(dir, "characters", "echo.md"), "utf8");
  assert.equal((charDoc.match(/## Evolution/g) || []).length, 1, "one Evolution section, updated in place");

  const { evolved } = await evolveWorld({ dir, at: AT });
  assert.equal(evolved.length, 1);
  assert.equal(evolved[0].character, "echo");

  const noMem = await evolveCharacter({ dir, character: "Ghost", at: AT });
  assert.equal(noMem.evolved, false);
});
