// Fault injection: every attack an adversarial review reproduced against this
// engine, as a test that failed before the fix. Each block names its finding.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { loadCanonIndex } from "../src/canon-index.mjs";
import { createWorldSeed, addNode } from "../src/pack.mjs";
import { detectConflicts } from "../src/conflict.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CANON_PATH = resolve(here, "../../../.arcanea/lore/CANON_LOCKED.md");
const AT = "2026-09-02T00:00:00.000Z";

async function seed() {
  const canon = await loadCanonIndex(CANON_PATH);
  const pack = createWorldSeed({
    name: "The Slow Chart",
    creator: { handle: "frankx" },
    canonSourceHash: canon.sourceHash,
    createdAt: AT,
  });
  return { canon, pack };
}

const worldGov = (pack) =>
  pack.nodes.find((n) => n.type === "World").governance;
const rulesOf = (report) => report.findings.map((f) => f.ruleId);

function canonClaim(pack, overrides) {
  return {
    id: "chr_claim",
    type: "Character",
    name: "Lyria",
    layer: "canon",
    attributes: {},
    ...overrides,
    governance: {
      ...worldGov(pack),
      owner: "arcanea",
      visibility: "public",
      canonStatus: "locked",
      rights: {
        state: "arcanea-owned",
        spdx: null,
        commercial: false,
        attribution: true,
      },
      evalRule: "canon-immutable",
    },
  };
}

// ── P1-1 canon self-grant ─────────────────────────────────────────────────────

test("P1-1 an id that names canon does not attest an invented name", async () => {
  const { canon, pack } = await seed();
  const forged = canonClaim(pack, {
    id: "lyria",
    name: "Veyra Coldwater",
    attributes: { aliases: ["Nero", "Malachar"] },
  });
  const report = detectConflicts(addNode(pack, forged), canon);
  const rules = rulesOf(report);
  assert.ok(rules.includes("canon.layer-claim"), rules.join(", "));
  const aliasHits = report.findings
    .filter((f) => f.ruleId === "canon.alias-of-locked-name")
    .map((f) => f.evidence.canonName);
  assert.deepEqual(aliasHits.sort(), ["Malachar", "Nero"]);
  assert.equal(report.clean, false);
});

test("P1-1 a real canon node cannot smuggle other canon names in as aliases", async () => {
  const { canon, pack } = await seed();
  const report = detectConflicts(
    addNode(pack, canonClaim(pack, { attributes: { aliases: ["Nero"] } })),
    canon,
  );
  const rules = rulesOf(report);
  assert.ok(rules.includes("canon.layer-claim"), rules.join(", "));
  assert.ok(rules.includes("canon.alias-of-locked-name"), rules.join(", "));
});

test("P1-1 canon identity is rebuilt from canon: type and attributes must match", async () => {
  const { canon, pack } = await seed();
  const asPlace = detectConflicts(
    addNode(pack, canonClaim(pack, { type: "Location" })),
    canon,
  );
  assert.ok(
    rulesOf(asPlace).includes("canon.layer-claim"),
    "a God is not a Location",
  );

  const wrongGate = detectConflicts(
    addNode(pack, canonClaim(pack, { attributes: { gate: 3 } })),
    canon,
  );
  assert.ok(
    rulesOf(wrongGate).includes("canon.layer-claim"),
    "Lyria keeps Gate 6, not Gate 3",
  );

  const wrongBeast = detectConflicts(
    addNode(pack, canonClaim(pack, { attributes: { godbeast: "Kaelith" } })),
    canon,
  );
  assert.ok(
    rulesOf(wrongBeast).includes("canon.layer-claim"),
    "Lyria is bonded to Yumiko",
  );

  const honest = detectConflicts(
    addNode(
      pack,
      canonClaim(pack, {
        attributes: { gate: 6, godbeast: "Yumiko", frequencyHz: 639 },
      }),
    ),
    canon,
  );
  assert.deepEqual(
    rulesOf(honest),
    [],
    "the real Lyria, described as canon describes her, stays clean",
  );
});
