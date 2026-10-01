import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

let fixtureRoot: string;
let originalCwd: string;
let loader: typeof import("../loader");

async function file(path: string, body: string) {
  const fullPath = join(fixtureRoot, "book", path);
  await mkdir(join(fullPath, ".."), { recursive: true });
  await writeFile(fullPath, body, "utf8");
}

before(async () => {
  originalCwd = process.cwd();
  fixtureRoot = await mkdtemp(join(tmpdir(), "arcanea-reader-entry-"));
  await mkdir(join(fixtureRoot, "book"));

  for (const work of [
    "forge-of-ruin",
    "heart-of-pyrathis",
    "tides-of-silence",
  ]) {
    await file(`${work}/AUTHORS_NOTE.md`, "# Author note\nNot a chapter.");
    await file(`${work}/BIBLE.md`, "# Story bible\nNot a chapter.");
    await mkdir(join(fixtureRoot, "book", work, "chapters"));
  }
  await file(
    "forge-of-ruin/chapters/00-prologue.md",
    "---\ntitle: Long metadata must not count as prose\n---\nOne two",
  );
  await file(
    "forge-of-ruin/chapters/01-the-forty-seven-names.md",
    "Three four five",
  );
  await file("forge-of-ruin/chapters/02-the-grate.md", "Six");
  await file("forge-of-ruin/chapters/00-outline.md", "Excluded outline words");
  await file(
    "forge-of-ruin/chapters/AUTHORS_NOTE.md",
    "Excluded author note words",
  );
  await file(
    "heart-of-pyrathis/chapters/01-the-cold-season.md",
    "One two three",
  );
  await file(
    "heart-of-pyrathis/chapters/02-the-last-light-on-the-spine.md",
    "Four five six",
  );

  for (const support of [
    "README",
    "PITCH",
    "CLAUDE",
    "AUTHORS_NOTE",
    "GLOSSARY",
    "00-outline",
  ]) {
    await file(`companions/${support}.md`, "Support file only");
    await file(`dragonborne/book-01-bond/${support}.md`, "Support file only");
    await file(`chapters/book1/${support}.md`, "Support file only");
  }
  await file("dragonborne/book-01-bond/00-prologue.md", "One two");
  await file("dragonborne/book-01-bond/chapter-01-the-bond.md", "Three four");
  await file("chapters/book1/00-prologue.md", "One two");
  await file(
    "chapters/book1/01-arrival.md",
    "---\ntitle: Metadata is not body text\n---\nThree four",
  );

  process.chdir(fixtureRoot);
  // BOOK_DIR is captured at module load. A fresh test process binds it to this
  // isolated tree, never the repository's manuscripts or publication manifests.
  loader = await import("../loader");
});

after(async () => {
  process.chdir(originalCwd);
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

test("Forge entry uses nested prose, keeps its real prologue and excludes support metadata", async () => {
  const series = (await loader.getAllSeries()).find(
    (item) => item.id === "forge-of-ruin",
  );
  assert.ok(series);
  assert.equal(series.books[0].firstChapterSlug, "prologue");
  assert.equal(series.totalChapters, 3);
  assert.equal(series.totalWordCount, 6);
});

test("Heart entry uses the same numbered-filename ID accepted by the reader", async () => {
  const series = (await loader.getAllSeries()).find(
    (item) => item.id === "heart-of-pyrathis",
  );
  assert.ok(series);
  assert.equal(series.books[0].firstChapterSlug, "the-cold-season");
  assert.equal(series.totalChapters, 2);
  assert.equal(series.totalWordCount, 6);
});

test("a work with root notes but no chapters has no read entry", async () => {
  const series = (await loader.getAllSeries()).find(
    (item) => item.id === "tides-of-silence",
  );
  assert.ok(series);
  assert.equal(series.books[0].firstChapterSlug, null);
  assert.equal(series.totalChapters, 0);
  assert.equal(series.totalWordCount, 0);
});

test("flat support-only content does not become a chapter or a read entry", async () => {
  const series = (await loader.getAllSeries()).find(
    (item) => item.id === "companions",
  );
  assert.ok(series);
  assert.equal(series.books[0].firstChapterSlug, null);
  assert.equal(series.totalChapters, 0);
});

test("multi-book series share the reader file policy and preserve real prologues", async () => {
  const series = (await loader.getAllSeries()).find(
    (item) => item.id === "dragonborne",
  );
  assert.ok(series);
  assert.equal(series.books[0].firstChapterSlug, "prologue");
  assert.equal(series.totalChapters, 2);
  assert.equal(series.totalWordCount, 4);
});

test("main saga chapter counts exclude support files and frontmatter", async () => {
  const book = await loader.getSagaBook("book1");
  assert.ok(book);
  assert.equal(book.chapterCount, 2);
  assert.equal(book.wordCount, 4);
  // API chapter slugs retain their existing numbering; HTML entry IDs are a
  // separate contract. This repair must not break existing saga API clients.
  assert.ok(book.chapters.some((chapter) => chapter.slug === "01-arrival"));
});

test("chapter loading rejects support files while retaining existing API slugs", async () => {
  assert.equal(await loader.getSagaChapter("book1", "authors_note"), null);
  const chapter = await loader.getSagaChapter("book1", "01-arrival");
  assert.ok(chapter);
  assert.equal(chapter.wordCount, 2);
});
