import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { getBookRoot } from "@/lib/content/book-path";
import {
  cinematicChapterAccess,
  CINEMATIC_FREE_CHAPTER_IDS,
  FREE_CHAPTER_COUNT,
  isCinematicReaderPath,
} from "../cinematic-public-contract";

test("only Chapter 1 is part of the public sample", () => {
  assert.equal(FREE_CHAPTER_COUNT, 1);
  assert.deepEqual(CINEMATIC_FREE_CHAPTER_IDS, ["01-the-house-that-leaned"]);
  assert.equal(cinematicChapterAccess(1), "free");
  for (let number = 2; number <= 32; number++)
    assert.equal(cinematicChapterAccess(number), "paid");
});

test("invalid chapter numbers never become free content", () => {
  for (const number of [-1, 0, 0.5, 1.5, NaN, Infinity])
    assert.equal(cinematicChapterAccess(number), "paid");
});

test("manuscript access metadata agrees with the server sample policy", async () => {
  const directory = join(
    getBookRoot(),
    "chronicles-of-arcanea",
    "book-01-the-three-academies",
    "cinematic-edition",
    "chapters",
  );
  const filenames = (await readdir(directory)).filter((filename) =>
    /^chapter-\d+-.+\.md$/.test(filename),
  );
  assert.equal(filenames.length, 32);
  for (const filename of filenames) {
    const { data } = matter(await readFile(join(directory, filename), "utf8"));
    assert.equal(typeof data.chapter, "number", filename);
    assert.equal(data.access, cinematicChapterAccess(data.chapter), filename);
  }
});

test("reader chrome exclusions are edition-specific, not a site-wide books exclusion", () => {
  for (const path of [
    "/books/the-last-free-path/01-the-house-that-leaned",
    "/books/the-last-free-path/02-the-voice-removed-from-rain/",
    "/de/books/the-last-free-path/01-the-house-that-leaned",
  ])
    assert.equal(isCinematicReaderPath(path), true);
  for (const path of [
    "/books",
    "/books/the-last-free-path",
    "/books/the-last-free-path/ledger",
    "/books/the-last-free-path/confirmed",
    "/books/another-book/01-opening",
    "/books/the-last-free-path/01-opening/extra",
    "/chat",
  ])
    assert.equal(isCinematicReaderPath(path), false);
});
