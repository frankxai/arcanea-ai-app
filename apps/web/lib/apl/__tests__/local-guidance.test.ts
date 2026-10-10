import assert from "node:assert/strict";
import { test } from "node:test";
import { buildLocalGuidance } from "../local-guidance";

test("local guidance retains the prompt without inventing a model rewrite", () => {
  const result = buildLocalGuidance("Make a quiet harbor", [
    "Add a detail only this harbor has.",
    "Name one sound from the shore.",
  ]);
  assert.ok(result.enhanced.startsWith("Make a quiet harbor\n"));
  assert.match(result.enhanced, /Creative direction/);
  assert.match(result.enhanced, /Name one sound/);
  assert.equal(result.guidance.length, 2);
});

test("local guidance is bounded and leaves a complete prompt alone", () => {
  assert.equal(
    buildLocalGuidance("A specific prompt", []).enhanced,
    "A specific prompt",
  );
  assert.equal(buildLocalGuidance("p", Array(20).fill("n")).guidance.length, 5);
});
