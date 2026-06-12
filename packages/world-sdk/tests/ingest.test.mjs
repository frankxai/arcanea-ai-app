import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { createWorld } from "../src/scaffold.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { validateManifest } from "../src/validate.mjs";
import { ingestCharacter, normalizeCharacter } from "../src/ingest.mjs";

const SENTENCE = "a tide-bound coast where witches barter with the sea";
const opts = { idSeed: "x", creator: { handle: "frankx" }, useWorldEngine: false };

const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), "arcanea-ingest-"));

test("normalizeCharacter maps loose keys and requires a name", () => {
  const c = normalizeCharacter({ name: "Coral Witch", bio: "tide bargainer", history: "the shallows" });
  assert.equal(c.persona, "tide bargainer");
  assert.equal(c.backstory, "the shallows");
  assert.throws(() => normalizeCharacter({ bio: "no name" }), /name/);
});

test("ingest loose JSON + image conforms to canon", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);

  const input = {
    name: "Coral Witch",
    bio: "She bargains with the tide.",
    history: "Born in the shallows.",
  };
  const res = await ingestCharacter({
    dir,
    input,
    image: Buffer.from("PNGDATA"),
    imageName: "coral.png",
  });

  assert.equal(res.characterFile, "characters/coral-witch.md");
  const md = await fs.readFile(path.join(dir, "characters/coral-witch.md"), "utf8");
  assert.match(md, /She bargains with the tide\./, "persona mapped from bio");
  assert.match(md, /Born in the shallows\./, "backstory mapped from history");

  assert.match(res.assetFile, /^assets\/characters\/coral-witch-[0-9a-f]{8}\.png$/);
  const stat = await fs.stat(path.join(dir, res.assetFile));
  assert.ok(stat.isFile(), "asset written");
  assert.match(md, new RegExp(`portrait: ${res.assetFile.replace(/[/.]/g, "\\$&")}`), "portrait pointer set");

  const world = await readWorld(dir);
  assert.ok(validateManifest(world.manifest).valid, "manifest still valid after ingest");

  assert.deepEqual(res.warnings, []);
});

test("ingesting the same name again warns about the duplicate", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  const input = { name: "Coral Witch", bio: "tide" };
  await ingestCharacter({ dir, input });
  const again = await ingestCharacter({ dir, input });
  assert.ok(again.warnings.length > 0, "duplicate produces a warning");
});
