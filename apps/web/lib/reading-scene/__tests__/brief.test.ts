import assert from "node:assert/strict";
import { test } from "node:test";
import {
  chapterHash,
  imageSource,
  normalizePassage,
  sceneBrief,
} from "../brief";

test("passage briefing preserves source wording and explicitly separates interpretation from canon", () => {
  const passage = "Nero\n  waited beside the river, holding a silver bowl.";
  assert.equal(
    normalizePassage(passage),
    "Nero waited beside the river, holding a silver bowl.",
  );
  const brief = sceneBrief(passage);
  assert.ok(brief.endsWith(normalizePassage(passage)));
  assert.match(brief, /interpretation, not established canon/);
  assert.throws(() => sceneBrief("short"));
  assert.throws(() => sceneBrief("x".repeat(1201)));
  assert.ok(sceneBrief("x".repeat(1200)).length <= 2000);
});

test("source revision changes when the manuscript changes, including whitespace", async () => {
  assert.match(await chapterHash("A chapter."), /^[a-f0-9]{64}$/);
  assert.equal(
    await chapterHash("A chapter."),
    await chapterHash("A chapter."),
  );
  assert.notEqual(
    await chapterHash("A chapter."),
    await chapterHash("A chapter.\n"),
  );
});

test("preview rejects script, SVG, insecure transport and credential-bearing references", () => {
  assert.equal(imageSource({ url: "javascript:alert(1)" }), null);
  assert.equal(
    imageSource({ data: "PHN2Zz4=", mimeType: "image/svg+xml" }),
    null,
  );
  assert.equal(imageSource({ url: "http://provider.invalid/image.png" }), null);
  assert.equal(
    imageSource({ url: "https://secret:token@provider.invalid/image.png" }),
    null,
  );
  assert.equal(
    imageSource({ data: "not base64!", mimeType: "image/png" }),
    null,
  );
  assert.equal(
    imageSource({ data: "aGVsbG8=", mimeType: "image/png" }),
    "data:image/png;base64,aGVsbG8=",
  );
});
