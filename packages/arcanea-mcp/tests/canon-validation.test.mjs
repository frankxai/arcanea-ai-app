import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Hosted checks also execute these cases against the emitted package module.
const moduleUrl = process.env.ARCANEA_CANON_MODULE
  ? pathToFileURL(resolve(process.env.ARCANEA_CANON_MODULE))
  : new URL("../src/tools/validate.ts", import.meta.url);
const { validateCanon } = await import(moduleUrl.href);
const screen = async (content) =>
  JSON.parse((await validateCanon(content)).content[0].text);

test("all ten canonical Guardian/Gate declarations pass the actual checker", async () => {
  const guardians = [
    "Lyssandria",
    "Leyla",
    "Draconia",
    "Maylinn",
    "Alera",
    "Lyria",
    "Aiyami",
    "Elara",
    "Ino",
    "Shinkami",
  ];
  for (const [index, guardian] of guardians.entries()) {
    const result = await screen(
      `${guardian} is Guardian of Gate ${index + 1}.`,
    );
    assert.equal(result.valid, true, guardian);
    assert.equal(result.issueCount, 0, guardian);
    assert.equal(result.checkedAssociations, 1, guardian);
  }
});

test("Gate 10 is not mistaken for Gate 1", async () => {
  const result = await screen("Shinkami is Guardian of Gate 10.");
  assert.equal(result.valid, true);
  assert.deepEqual(result.issues, []);
});

test("nearby correct declarations do not transfer one Guardian's Gate to another", async () => {
  const result = await screen(
    "Lyssandria is Guardian of Gate 1. Shinkami is Guardian of Gate 10.",
  );
  assert.equal(result.valid, true);
  assert.equal(result.checkedAssociations, 2);
});

test("a later incorrect declaration is checked and points to the actual span", async () => {
  const content =
    "Shinkami is Guardian of Gate 10. Shinkami is Guardian of Gate 1.";
  const result = await screen(content);
  assert.equal(result.valid, false);
  assert.equal(result.checkedAssociations, 2);
  assert.equal(result.issues.length, 1);
  assert.equal(
    result.issues[0].evidence.start,
    content.lastIndexOf("Shinkami"),
  );
  assert.equal(
    content.slice(
      result.issues[0].evidence.start,
      result.issues[0].evidence.end,
    ),
    "Shinkami is Guardian of Gate 1",
  );
});

test("ordinal declarations check first, second and tenth Gates", async () => {
  assert.equal(
    (
      await screen(
        "Lyssandria is Guardian of the 1st Gate. Leyla is Guardian of the 2nd Gate. Shinkami is Guardian of the 10th Gate.",
      )
    ).valid,
    true,
  );
  assert.equal(
    (await screen("Shinkami is Guardian of the 1st Gate.")).valid,
    false,
  );
});

test("reverse declarations preserve Guardian ownership", async () => {
  assert.equal(
    (
      await screen(
        "Gate 10 is guarded by Shinkami. Gate 1 is guarded by Lyssandria.",
      )
    ).valid,
    true,
  );
  assert.equal((await screen("Gate 1 is guarded by Shinkami.")).valid, false);
});

test("active guards declarations retain the existing checker contract", async () => {
  const correct = await screen("Lyssandria guards Gate 1. Shinkami guards Gate 10.");
  assert.equal(correct.valid, true);
  assert.equal(correct.checkedAssociations, 2);
  const wrong = await screen("Lyssandria guards Gate 5 with great power.");
  assert.equal(wrong.valid, false);
  assert.equal(wrong.issues.length, 1);
});

test("visiting another Gate is not a declaration of its guardianship", async () => {
  const result = await screen("Shinkami rests beside Gate 1.");
  assert.equal(result.valid, true);
  assert.equal(result.checkedAssociations, 0);
});

test("negated and substring names do not assert positive guardianship", async () => {
  const result = await screen(
    "Shinkami is not Guardian of Gate 1. FakeShinkami is Guardian of Gate 1.",
  );
  assert.equal(result.valid, true);
  assert.equal(result.checkedAssociations, 0);
});

test("an explicit wrong Gate is reported without numeric prefix matching", async () => {
  const result = await screen("Lyssandria is Guardian of Gate 11.");
  assert.equal(result.valid, false);
  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0].message, /Gate 11/);
});

test("Nero and another character's villainy do not create a Nero violation", async () => {
  assert.equal(
    (await screen("Nero is balanced. Malachar is evil.")).valid,
    true,
  );
  assert.equal((await screen("Nero is not evil.")).valid, true);
  assert.equal((await screen("Nero is the evil villain.")).valid, false);
});

test("case and line breaks preserve explicit associations", async () => {
  const result = await screen("SHINKAMI\nis the Guardian of\nGate 10.");
  assert.equal(result.valid, true);
  assert.equal(result.checkedAssociations, 1);
});

test("existing configured term warnings remain warnings", async () => {
  const result = await screen("A light element appears.");
  assert.equal(result.valid, true);
  assert.equal(result.issues[0].type, "warning");
});

test("a clean screen cannot issue canon or manuscript approval", async () => {
  const result = await screen("The entirely new character rewrites the world.");
  assert.equal(result.valid, true);
  assert.equal(result.checkedAssociations, 0);
  assert.equal(
    result.validationScope,
    "configured-term-and-explicit-association-heuristics",
  );
  assert.equal(result.canonApproval, false);
  assert.equal(result.humanReviewRequired, true);
  assert.doesNotMatch(result.summary, /canon-compliant|canon violations/i);
});
