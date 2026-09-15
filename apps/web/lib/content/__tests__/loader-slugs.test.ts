import assert from "node:assert/strict";
import test from "node:test";
import { getText, getTextsInCollection } from "../loader";

test("chapter texts get two-segment slugs that /library/[collection]/[text] can serve", async () => {
  const texts = await getTextsInCollection("creator-principles");
  const chapter = texts.find((text) =>
    text.filename.includes("01-partnership-principle"),
  );

  assert.ok(chapter, "the first chapter is listed in its collection");
  assert.equal(chapter.slug, "creator-principles/01-partnership-principle");
  assert.equal(
    chapter.frontmatter.title,
    "Scroll I: The Partnership Principle",
  );
  for (const text of texts) {
    assert.equal(
      text.slug.split("/").length,
      2,
      `${text.slug} must fit the two-segment route`,
    );
  }

  const resolved = await getText(chapter.slug);
  assert.equal(
    resolved?.filename,
    chapter.filename,
    "the listed slug resolves back to the same chapter",
  );
});

test("agent instruction files and readmes are not reachable as library texts", async () => {
  for (const slug of [
    "creator-principles/claude",
    "creator-principles/readme",
    "chronicles-of-luminors/claude",
  ]) {
    assert.equal(await getText(slug), null, `${slug} must not resolve`);
  }
});
