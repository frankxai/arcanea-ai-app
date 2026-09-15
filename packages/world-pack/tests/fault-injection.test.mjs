// Fault injection: every attack an adversarial review reproduced against this
// engine, as a test that failed before the fix. Each block names its finding.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { buildCanonIndex, loadCanonIndex } from "../src/canon-index.mjs";
import {
  createWorldSeed,
  addNode,
  exportPack,
  verifyExport,
  packDigest,
} from "../src/pack.mjs";
import { detectConflicts } from "../src/conflict.mjs";
import { validatePack } from "../src/validate.mjs";

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

// ── P1-2 seal bypass through a mixed representation ──────────────────────────

async function sealed() {
  const { pack } = await seed();
  return exportPack(pack);
}

test("P1-2 a top-level ledger shadowing the sealed provenance cannot keep the seal", async () => {
  const p = await sealed();
  assert.equal(verifyExport(p).valid, true, "baseline export verifies");

  p.sources = structuredClone(p.provenance.sources);
  p.provenance.sources[0].citation = "forged after export";
  const result = verifyExport(p);
  assert.equal(
    result.valid,
    false,
    "editing the sealed ledger must break the seal",
  );
  assert.equal(result.representationOk, false);
  assert.equal(validatePack(p).valid, false);
  assert.ok(
    validatePack(p).errors.some((e) => /mix/i.test(e)),
    validatePack(p).errors.join("; "),
  );
});

test("P1-2 every ledger family is covered, and an ambiguous pack is never hashed", async () => {
  for (const ledger of ["sources", "branches", "versions"]) {
    const p = await sealed();
    p[ledger] = structuredClone(p.provenance[ledger]);
    assert.equal(verifyExport(p).valid, false, `${ledger} shadow`);
    assert.throws(
      () => packDigest(p),
      /mix/i,
      `${ledger} shadow must not hash`,
    );
  }
});

// ── P1-3 unicode evasion of locked names ─────────────────────────────────────

function userNode(pack, id, name, attributes = {}) {
  return {
    id,
    type: "Character",
    name,
    layer: "user",
    attributes,
    governance: { ...worldGov(pack) },
  };
}

test("P1-3 zero-width, bidi, full-width and homoglyph spellings are still the locked name", async () => {
  const { canon, pack } = await seed();
  const disguises = {
    "zero-width space": "Ly\u200Bria",
    "zero-width joiner": "Lyr\u200Dia",
    "bidi override": "Ly\u202Eria",
    "full-width": "Ｌｙｒｉａ",
    "cyrillic u": "Lуria",
    "greek alpha + cyrillic i": "Lyrіα",
  };
  for (const [label, name] of Object.entries(disguises)) {
    const report = detectConflicts(
      addNode(pack, userNode(pack, "chr_disguise", name)),
      canon,
    );
    const hit = report.findings.find(
      (f) =>
        f.ruleId === "canon.locked-name-taken" ||
        f.ruleId === "canon.alias-of-locked-name",
    );
    assert.ok(
      hit,
      `${label} (${JSON.stringify(name)}) walked past the locked name`,
    );
    assert.equal(hit.evidence.canonName, "Lyria", label);
  }
});

test("P1-3 a homoglyph alias is caught, and ordinary non-Latin names are left alone", async () => {
  const { canon, pack } = await seed();
  const aliased = detectConflicts(
    addNode(
      pack,
      userNode(pack, "chr_alias", "Veyra Coldwater", {
        aliases: ["Nеrο"],
      }),
    ),
    canon,
  );
  assert.ok(
    aliased.findings.some(
      (f) =>
        f.ruleId === "canon.alias-of-locked-name" &&
        f.evidence.canonName === "Nero",
    ),
    aliased.findings.map((f) => f.ruleId).join(", "),
  );

  const honest = detectConflicts(
    addNode(pack, userNode(pack, "chr_mirea", "Мирея Ольховская")),
    canon,
  );
  assert.deepEqual(
    rulesOf(honest),
    [],
    "a Cyrillic name that is not canon stays clean",
  );
});

test("P1-3 engine and server source carry no invisible or bidi-control characters", async () => {
  const { readdir, readFile } = await import("node:fs/promises");
  const roots = [
    resolve(here, "../src"),
    here,
    resolve(here, "../../arcanea-mcp/src/registrations"),
    resolve(here, "../../arcanea-mcp/src/tools"),
    resolve(here, "../../arcanea-mcp/tests"),
  ];
  const hidden =
    /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0]/;
  const offenders = [];
  for (const root of roots) {
    for (const file of await readdir(root)) {
      if (!/\.(mjs|ts)$/.test(file)) continue;
      const lines = (await readFile(resolve(root, file), "utf8")).split("\n");
      lines.forEach((line, i) => {
        if (hidden.test(line)) offenders.push(`${file}:${i + 1}`);
      });
    }
  }
  assert.deepEqual(offenders, [], "write \\u escapes, never the characters");
});

// ── P1-4 canon lookups are indexed, not nodes x terms ────────────────────────

test("P1-4 1,200 nodes against 3,000 canon terms is checked without a nodes-by-terms scan", async () => {
  const rows = Array.from(
    { length: 3000 },
    (_, i) => `| Tideword${i} Marker | Definition ${i} | LOCKED ✅ |`,
  );
  const canon = buildCanonIndex(
    [
      "# BIG CANON",
      "",
      "| Term | Definition | Status |",
      "| --- | --- | --- |",
      ...rows,
      "",
    ].join("\n"),
  );
  const { pack } = await seed();
  const nodes = [...pack.nodes];
  for (let i = 0; i < 1200; i++)
    nodes.push(
      userNode(
        pack,
        `chr_perf_${i}`,
        `Wandering cartographer number ${i} of the outer drift`,
        {
          aliases: [`drifter of the ${i} corridor`],
          backstory:
            "She mapped corridors that moved every season and never named them.",
        },
      ),
    );
  const big = { ...pack, nodes };
  const started = performance.now();
  detectConflicts(big, canon, { canonBinding: "foreign" });
  const elapsed = performance.now() - started;
  assert.ok(elapsed < 400, `detectConflicts took ${Math.round(elapsed)} ms`);
});
