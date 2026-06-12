import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { createWorld } from "../src/scaffold.mjs";
import { compileManuscript, renderBook } from "../src/render-book.mjs";

const SENTENCE = "a drowned city where memory is currency";
const opts = { idSeed: "x", creator: { handle: "frankx" }, useWorldEngine: false };

const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), "arcanea-book-"));

test("compileManuscript builds a world primer when no book exists", async () => {
  const dir = await tmp();
  const { manifest } = await createWorld(dir, SENTENCE, opts);

  const ms = await compileManuscript({ dir });
  assert.ok(ms.markdown.includes(`# ${manifest.name}`), "title page uses world name");
  assert.ok(ms.chapters.length >= 1, "at least one chapter");
  assert.ok(
    ms.chapters.some((c) => /world-bible|inhabitants/i.test(c.title)) || ms.chapters.length >= 1,
    "canon/character-derived chapter present",
  );
});

test("renderBook target md writes a markdown manuscript", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  const { outFile } = await renderBook({ dir, target: "md" });
  const content = await fs.readFile(outFile, "utf8");
  assert.ok(content.includes("# "), "markdown has a heading");
});

test("renderBook target pdf writes a real minimal PDF", async () => {
  const dir = await tmp();
  await createWorld(dir, SENTENCE, opts);
  const { outFile, bytes } = await renderBook({ dir, target: "pdf" });
  const buf = await fs.readFile(outFile);
  assert.equal(buf.subarray(0, 7).toString("latin1"), "%PDF-1.");
  assert.ok(bytes > 400, "pdf has real content");
});
