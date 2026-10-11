import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import {
  chapterIdFromFilename,
  chapterTitleFromMarkdown,
  countChapterWords,
  isChapterMarkdown,
} from "../chapter-files";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

function main() {
  test("real chapter titles take precedence over the manuscript heading", () => {
    const raw = readFileSync(
      new URL(
        "../../../../../book/heart-of-pyrathis/chapters/01-the-cold-season.md",
        import.meta.url,
      ),
      "utf8",
    );
    assert.equal(
      chapterTitleFromMarkdown(raw, "the-cold-season"),
      "The Cold Season",
    );
    const prologue = readFileSync(
      new URL(
        "../../../../../book/forge-of-ruin/chapters/00-prologue.md",
        import.meta.url,
      ),
      "utf8",
    );
    assert.equal(
      chapterTitleFromMarkdown(prologue, "prologue"),
      "Prologue: The Chronicle of Erivar Skaldson, Final Entry",
    );
  });

  test("chapter titles recognize English, German and Spanish prefixes", () => {
    for (const heading of [
      "## Chapter Two: Arrival",
      "## Kapitel 2: Arrival",
      "## Capítulo 2: Arrival",
      "# Chapter Two: Arrival",
    ]) {
      assert.equal(
        chapterTitleFromMarkdown("# The Book\n\n" + heading, "chapter-2"),
        "Arrival",
      );
    }
  });

  test("frontmatter titles take precedence and invalid title types are ignored", () => {
    assert.equal(
      chapterTitleFromMarkdown(
        "---\ntitle: '  Arrival  '\n---\n## Chapter One: Wrong",
        "fallback",
      ),
      "Arrival",
    );
    assert.equal(
      chapterTitleFromMarkdown(
        "---\ntitle: 7\n---\n## Chapter One: Arrival",
        "fallback",
      ),
      "Arrival",
    );
    assert.equal(
      chapterTitleFromMarkdown(
        "---\ntitle: ' '\n---\n## Chapter One: Arrival",
        "fallback",
      ),
      "Arrival",
    );
  });

  test("chapter title fallback retains plain headings and humanizes a slug", () => {
    assert.equal(
      chapterTitleFromMarkdown("## The Crossing", "fallback"),
      "The Crossing",
    );
    assert.equal(
      chapterTitleFromMarkdown("# The Crossing", "fallback"),
      "The Crossing",
    );
    assert.equal(
      chapterTitleFromMarkdown("Plain prose", "the-crossing"),
      "The Crossing",
    );
  });

  test("HTML IDs strip leading numbers while preserving names and case", () => {
    assert.equal(chapterIdFromFilename("01-subject-7.md"), "subject-7");
    assert.equal(chapterIdFromFilename("00-prologue.md"), "prologue");
    assert.equal(
      chapterIdFromFilename("chapter-01-the-bond.md"),
      "chapter-01-the-bond",
    );
    assert.equal(chapterIdFromFilename("01-The-Arrival.md"), "The-Arrival");
  });

  test("chapter policy includes numbered chapters and real prologues", () => {
    for (const filename of [
      "01-arrival.md",
      "01-bible.md",
      "01-outline.md",
      "chapter-01-before-the-name.md",
      "00-prolog.md",
      "00-prologue.md",
      "00-prologo-de-luz.md",
    ]) {
      assert.equal(isChapterMarkdown(filename), true, filename);
    }
  });

  test("chapter policy excludes companion and non-chapter markdown", () => {
    for (const filename of [
      "README.md",
      "PITCH.md",
      "CLAUDE.md",
      "AUTHORS_NOTE.md",
      "GLOSSARY.md",
      "BIBLE.md",
      "OUTLINE.md",
      "Bible.md",
      "outline.md",
      "00-outline.md",
      "cover.png",
    ]) {
      assert.equal(isChapterMarkdown(filename), false, filename);
    }
  });

  test("chapter policy rejects uppercase extensions the routes cannot strip", () => {
    assert.equal(isChapterMarkdown("CHAPTER-02.MD"), false);
  });

  test("word counts ignore YAML frontmatter", () => {
    const body = "One two\n\nthree four.";
    const withFrontmatter = [
      "---",
      "title: A title that must not change the count",
      "gate: All Ten",
      "---",
      body,
    ].join("\n");

    assert.equal(countChapterWords(body), 4);
    assert.equal(countChapterWords(withFrontmatter), 4);
  });

  test("frontmatter-only documents contain no chapter words", () => {
    assert.equal(countChapterWords("---\ntitle: Empty\n---\n"), 0);
  });

  if (failed > 0) {
    console.error(`\n${failed} chapter file policy test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} chapter file policy test(s) passed`);
}

main();
