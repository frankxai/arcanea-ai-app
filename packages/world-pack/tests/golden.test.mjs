// Golden-file test. The exported pack format is a contract other layers read;
// if this diff moves, the format moved, and that must be a deliberate edit.
//
// Regenerate deliberately: node tests/golden.test.mjs --write

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { loadCanonIndex } from "../src/canon-index.mjs";
import { createWorldSeed, addNode, addRelationship, commit, exportPack, verifyExport, deterministicId } from "../src/pack.mjs";
import { detectConflicts } from "../src/conflict.mjs";
import { validatePack } from "../src/validate.mjs";
import { withGuardianRoles } from "../src/guardians.mjs";
import * as apl from "../src/apl.mjs";
import { goodCharacter, goodLocation } from "../fixtures/model-answers.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CANON_PATH = resolve(here, "../../../.arcanea/lore/CANON_LOCKED.md");
const GOLDEN = resolve(here, "../fixtures/slow-chart.worldpack.json");
const AT = "2026-09-02T00:00:00.000Z";

export async function buildFixture() {
  const canon = await loadCanonIndex(CANON_PATH);
  let pack = createWorldSeed({
    name: "The Slow Chart",
    premise: "A cartographers' guild that maps corridors before they drift.",
    creator: { handle: "frankx", displayName: "Frank" },
    canonSourceHash: canon.sourceHash,
    createdAt: AT,
  });
  const worldGov = pack.nodes.find((n) => n.type === "World").governance;

  const compiled = apl.compile(
    "character.constrained.v1",
    { role: "corridor cartographer", gate: 6, gatesOpen: 3, element: "Void", house: "Synthesis", originClass: "Arcans" },
    { canon, pack },
  );
  pack = addNode(
    pack,
    apl.materialize(compiled, goodCharacter, {
      id: deterministicId("chr", "sennaris"),
      layer: "generated",
      governance: { ...worldGov, canonStatus: "draft" },
    }),
  );

  const locationCompiled = apl.compile("location.constrained.v1", { kind: "archive", element: "Void" }, { canon, pack });
  pack = addNode(
    pack,
    apl.materialize(locationCompiled, goodLocation, {
      id: deterministicId("loc", "chart-room"),
      layer: "generated",
      governance: { ...worldGov, canonStatus: "draft" },
    }),
  );

  pack = addRelationship(pack, {
    id: deterministicId("rel", "sennaris:located_at:chart-room"),
    kind: "located_at",
    from: deterministicId("chr", "sennaris"),
    to: deterministicId("loc", "chart-room"),
  });

  pack = commit(withGuardianRoles(pack), { message: "first cast and its room", by: pack.world.creatorRef, at: AT });
  return { canon, exported: exportPack(pack, { exportedAt: AT }) };
}

test("the exported fixture matches the golden file byte for byte", async () => {
  const { exported } = await buildFixture();
  const golden = JSON.parse(await readFile(GOLDEN, "utf8"));
  assert.deepEqual(exported, golden, "export format drifted; regenerate the golden file only if the change is intended");
});

test("the golden fixture is structurally valid, canon-clean, and untampered", async () => {
  const { canon } = await buildFixture();
  const golden = JSON.parse(await readFile(GOLDEN, "utf8"));
  assert.deepEqual(validatePack(golden).errors, []);
  assert.deepEqual(detectConflicts(golden, canon).findings, []);
  assert.equal(verifyExport(golden).valid, true);
  assert.equal(golden.agentRoles.length, 10);
  assert.equal(golden.counts.Character, 1);
  assert.equal(golden.counts.Location, 1);
});

test("the signature covers the ownership ledger, not just the nodes", async () => {
  const golden = JSON.parse(await readFile(GOLDEN, "utf8"));
  const edits = {
    "provenance.versions[].createdBy": (g) => ({ ...g, provenance: { ...g.provenance, versions: g.provenance.versions.map((v) => ({ ...v, createdBy: "attacker" })) } }),
    "provenance.sources[].citation": (g) => ({ ...g, provenance: { ...g.provenance, sources: g.provenance.sources.map((s) => ({ ...s, citation: "forged" })) } }),
    "provenance.branches[].head": (g) => ({ ...g, provenance: { ...g.provenance, branches: g.provenance.branches.map((b) => ({ ...b, head: "ver_forged" })) } }),
    "provenance.head": (g) => ({ ...g, provenance: { ...g.provenance, head: "ver_forged" } }),
    agentRoles: (g) => ({ ...g, agentRoles: g.agentRoles.slice(1) }),
    counts: (g) => ({ ...g, counts: { ...g.counts, Character: 9999 } }),
    "canon.sourceHash": (g) => ({ ...g, canon: { ...g.canon, sourceHash: `sha256:${"0".repeat(64)}` } }),
  };
  for (const [what, edit] of Object.entries(edits)) {
    assert.equal(verifyExport(edit(golden)).valid, false, `${what} is outside the signature`);
  }
});

if (process.argv.includes("--write")) {
  const { exported } = await buildFixture();
  await writeFile(GOLDEN, `${JSON.stringify(exported, null, 2)}\n`, "utf8");
  console.log(`wrote ${GOLDEN}`);
}
