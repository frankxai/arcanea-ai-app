import test from "node:test";
import assert from "node:assert/strict";
import { loadAuthor, discoverAuthors } from "../dist/authors/index.js";

test("discoverAuthors finds all 10 registered authors", async () => {
  const slugs = await discoverAuthors();
  const expected = ["sanderson", "tolkien", "le-guin", "herbert", "bakker", "erikson", "gaiman", "paolini", "schwartz", "weeks"];
  for (const slug of expected) {
    assert.ok(slugs.has(slug), `missing author: ${slug}`);
  }
});

test("loadAuthor returns a complete AuthorAgent for sanderson", async () => {
  const author = await loadAuthor("sanderson");
  assert.equal(author.slug, "sanderson");
  assert.equal(author.role, "systems");
  assert.ok(author.soul.length > 200, "SOUL.md too thin");
  assert.ok(author.craft.length > 200, "craft.md too thin");
  assert.ok(author.patterns.length > 150, "PATTERNS.md too thin");
  assert.ok(author.sources.length > 100, "sources.md too thin");
  assert.ok(author.systems.length >= 1, "must have ≥1 formalized system");
  assert.ok(Object.keys(author.glossary).length >= 10, "glossary too thin");
  assert.ok(author.voice.signatureMoves.length >= 3, "voice signature moves too thin");
});

test("loadAuthor parses voice.json with valid shape", async () => {
  const author = await loadAuthor("le-guin");
  assert.equal(typeof author.voice.sentenceLength.median, "number");
  assert.ok(["sparse", "moderate", "dense"].includes(author.voice.clauseDensity));
  assert.ok(["patient", "measured", "propulsive"].includes(author.voice.pacing));
});

test("all 10 authors validate cleanly", async () => {
  const slugs = ["sanderson", "tolkien", "le-guin", "herbert", "bakker", "erikson", "gaiman", "paolini", "schwartz", "weeks"];
  for (const slug of slugs) {
    const author = await loadAuthor(slug);
    assert.ok(author.soul.length > 200, `${slug} SOUL too thin`);
    assert.ok(author.craft.length > 200, `${slug} craft too thin`);
    assert.ok(author.sources.length > 50, `${slug} sources too thin`);
  }
});
