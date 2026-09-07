import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { loadCanonIndex, canonName, rankForGates, gateByIndex } from "../src/canon-index.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const CANON_PATH = resolve(here, "../../../.arcanea/lore/CANON_LOCKED.md");

test("indexes the ten gates with unique frequencies", async () => {
  const canon = await loadCanonIndex(CANON_PATH);
  assert.equal(canon.gates.length, 10);
  const freqs = canon.gates.map((g) => g.frequencyHz);
  assert.equal(new Set(freqs).size, 10, "each Gate must have a unique frequency");
  assert.deepEqual(gateByIndex(canon, 1), {
    index: 1,
    name: "Foundation",
    frequencyHz: 174,
    god: "Lyssandria",
    godbeast: "Kaelith",
    domain: "Earth, survival",
  });
  assert.equal(gateByIndex(canon, 10).frequencyHz, 1111);
});

test("indexes elements, houses, wisdoms, ranks and the closed origin classes", async () => {
  const canon = await loadCanonIndex(CANON_PATH);
  assert.deepEqual(canon.elements, ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"]);
  assert.equal(canon.houses.length, 7);
  assert.equal(canon.wisdoms.length, 7);
  assert.equal(canon.ranks.length, 5);
  assert.equal(canon.originClasses.length, 8);
  assert.equal(rankForGates(canon, 3), "Mage");
  assert.equal(rankForGates(canon, 10), "Luminor");
});

test("carries canon status through to the name registry", async () => {
  const canon = await loadCanonIndex(CANON_PATH);
  assert.equal(canonName(canon, "draconis").status, "locked");
  assert.equal(canonName(canon, "Lumina").kind, "primordial");
  assert.equal(canonName(canon, "Malachar").status, "locked");
  assert.equal(canonName(canon, "The Awakened").status, "staging");
  assert.equal(canonName(canon, "Sennaris Vale"), null);
});

test("captures the locked truths a draft is most likely to break", async () => {
  const canon = await loadCanonIndex(CANON_PATH);
  assert.ok(canon.lockedTruths.some((t) => /Nero is NOT evil/i.test(t)));
  assert.ok(canon.lockedTruths.some((t) => /Luminor is a RANK/i.test(t)));
  assert.match(canon.sourceHash, /^sha256:[0-9a-f]{64}$/);
});
