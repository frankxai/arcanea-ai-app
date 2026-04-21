import test from "node:test";
import assert from "node:assert/strict";
import { routeQuestion, QUESTION_TAXONOMY } from "../dist/router/index.js";

test("router picks preferred authors when they intersect roster", () => {
  const decision = routeQuestion(
    { kind: "magic-system", content: "draft" },
    { roster: ["sanderson", "le-guin", "tolkien", "weeks", "herbert"], maxAuthors: 3 },
  );
  assert.deepEqual(decision.selectedAuthors.slice(0, 3), ["sanderson", "le-guin", "weeks"]);
});

test("router fills from roster when preferred are absent", () => {
  const decision = routeQuestion(
    { kind: "magic-system", content: "draft" },
    { roster: ["tolkien", "gaiman", "bakker"], maxAuthors: 3, minAuthors: 3 },
  );
  assert.equal(decision.selectedAuthors.length, 3);
});

test("router honors preferAuthors override", () => {
  const decision = routeQuestion(
    { kind: "magic-system", content: "draft", preferAuthors: ["gaiman", "bakker"] },
    { roster: ["sanderson", "le-guin", "tolkien", "weeks", "herbert", "gaiman", "bakker"], maxAuthors: 3 },
  );
  assert.deepEqual(decision.selectedAuthors, ["gaiman", "bakker"]);
});

test("QUESTION_TAXONOMY covers all expected kinds", () => {
  const expected = ["magic-system", "plot", "prose", "chapter", "glossary", "naming", "worldbuilding", "theology", "progression", "style-transfer", "general"];
  for (const kind of expected) {
    assert.ok(Array.isArray(QUESTION_TAXONOMY[kind]), `missing taxonomy for ${kind}`);
  }
});
