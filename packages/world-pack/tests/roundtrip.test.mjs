// The whole Studio slice, end to end, with no model call and no network:
// seed a world -> compile a constrained request -> materialize the answer ->
// detect canon conflicts -> branch -> merge -> export a verifiable pack.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { loadCanonIndex } from "../src/canon-index.mjs";
import { createWorldSeed, addNode, addRelationship, commit, exportPack, verifyExport, deterministicId } from "../src/pack.mjs";
import { detectConflicts } from "../src/conflict.mjs";
import { branchPack, diffPacks, mergeBranch } from "../src/branch.mjs";
import { withGuardianRoles, guardianById, decide, runGuardianEvals } from "../src/guardians.mjs";
import * as apl from "../src/apl.mjs";
import { goodCharacter, conflictedCharacter, goodLocation } from "../fixtures/model-answers.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CANON_PATH = resolve(here, "../../../.arcanea/lore/CANON_LOCKED.md");
const AT = "2026-09-02T00:00:00.000Z";

async function seed() {
  const canon = await loadCanonIndex(CANON_PATH);
  const pack = createWorldSeed({
    name: "The Slow Chart",
    premise: "A cartographers' guild that maps corridors before they drift.",
    creator: { handle: "frankx", displayName: "Frank" },
    canonSourceHash: canon.sourceHash,
    createdAt: AT,
  });
  return { canon, pack };
}

function governanceOf(pack) {
  return pack.nodes.find((n) => n.type === "World").governance;
}

test("a fresh world seed is canon-clean and structurally complete", async () => {
  const { canon, pack } = await seed();
  assert.equal(pack.format, "WorldPack.v1");
  assert.equal(pack.nodes.length, 3);
  assert.match(pack.world.id, /^wld_[0-9A-HJKMNP-TV-Z]{26}$/);
  const report = detectConflicts(pack, canon);
  assert.deepEqual(report.findings, []);
  assert.ok(report.clean);
});

test("APL compiles a constrained request with canon facts embedded and no model call", async () => {
  const { canon, pack } = await seed();
  const compiled = apl.compile(
    "character.constrained.v1",
    { role: "corridor cartographer", gate: 6, gatesOpen: 3, element: "Void", house: "Synthesis", originClass: "Arcans" },
    { canon, pack },
  );
  assert.match(compiled.prompt, /Gate 6 is Sight, 639 Hz, kept by Lyria, bonded Godbeast Yumiko/);
  assert.match(compiled.prompt, /rank is exactly Mage/);
  assert.match(compiled.prompt, /Nero is not evil/);
  assert.equal(compiled.contract.produces, "Character");
  assert.equal(compiled.contract.attributes.frequencyHz, 639);
  assert.match(compiled.hash, /^sha256:[0-9a-f]{64}$/);

  // Same inputs, same prompt. The compiler is deterministic.
  const again = apl.compile(
    "character.constrained.v1",
    { role: "corridor cartographer", gate: 6, gatesOpen: 3, element: "Void", house: "Synthesis", originClass: "Arcans" },
    { canon, pack },
  );
  assert.equal(again.hash, compiled.hash);
});

test("APL refuses illegal bindings before a prompt is ever built", async () => {
  const { canon, pack } = await seed();
  assert.throws(() => apl.compile("character.constrained.v1", { role: "x", gate: 11, gatesOpen: 1, element: "Void" }, { canon, pack }), apl.AplError);
  assert.throws(() => apl.compile("character.constrained.v1", { role: "x", gate: 1, gatesOpen: 1, element: "Ash" }, { canon, pack }), apl.AplError);
  assert.throws(
    () => apl.compile("character.constrained.v1", { role: "x", gate: 1, gatesOpen: 1, element: "Fire", originClass: "Nullborn" }, { canon, pack }),
    apl.AplError,
  );
  assert.throws(() => apl.compile("character.constrained.v1", { gate: 1, gatesOpen: 1, element: "Fire" }, { canon, pack }), apl.AplError);
});

test("a compliant generated character passes the conflict pass and carries prompt provenance", async () => {
  const { canon, pack } = await seed();
  const compiled = apl.compile(
    "character.constrained.v1",
    { role: "corridor cartographer", gate: 6, gatesOpen: 3, element: "Void", house: "Synthesis", originClass: "Arcans" },
    { canon, pack },
  );
  const node = apl.materialize(compiled, goodCharacter, {
    id: deterministicId("chr", "sennaris"),
    layer: "generated",
    governance: { ...governanceOf(pack), canonStatus: "draft", rights: { state: "creator-owned", spdx: "CC-BY-4.0", commercial: true, attribution: true } },
  });
  const next = addNode(pack, node);
  const report = detectConflicts(next, canon);
  assert.deepEqual(report.findings.map((f) => f.ruleId), []);
  assert.equal(node.attributes.godbeast, "Yumiko");
  assert.equal(node.provenance.promptHash, compiled.hash);
});

test("the detector catches every way a bad draft breaks canon", async () => {
  const { canon, pack } = await seed();
  const bad = {
    id: "chr_bad",
    type: "Character",
    name: conflictedCharacter.name,
    description: conflictedCharacter.description,
    layer: "user",
    attributes: conflictedCharacter.attributes,
    governance: { ...governanceOf(pack), canonStatus: "draft" },
  };
  const report = detectConflicts(addNode(pack, bad, { governanceFrom: pack.world.id }), canon);
  const rules = new Set(report.findings.map((f) => f.ruleId));
  for (const expected of [
    "canon.locked-name-taken",
    "canon.nero-miscast",
    "canon.rank-out-of-band",
    "canon.element-unknown",
    "canon.house-unknown",
    "canon.origin-class-unknown",
  ]) {
    assert.ok(rules.has(expected), `expected finding ${expected}, got ${[...rules].join(", ")}`);
  }
  assert.ok(report.blockers > 0);
  assert.equal(report.clean, false);
});

test("the detector catches rights and provenance holes, not just lore", async () => {
  const { canon, pack } = await seed();
  const leaky = {
    id: "art_leaky",
    type: "Artifact",
    name: "Borrowed Lantern",
    layer: "licensed",
    attributes: {},
    governance: {
      owner: "crt_unknown",
      sourceRef: "src_missing",
      versionRef: null,
      branchRef: "main",
      visibility: "public",
      canonStatus: "locked",
      rights: { state: "licensed", spdx: null, commercial: true, attribution: true },
      evalRule: "canon-conflict-clean",
    },
  };
  const report = detectConflicts(addNode(pack, leaky), canon);
  const rules = new Set(report.findings.map((f) => f.ruleId));
  assert.ok(rules.has("rights.licensed-without-licence"));
  assert.ok(rules.has("provenance.dangling-source"));
  assert.ok(rules.has("status.illegal-for-layer"));
});

test("Guardians adjudicate their own charter and escalate rather than lock canon", async () => {
  const { canon, pack } = await seed();
  const bad = {
    id: "chr_bad",
    type: "Character",
    name: "Draconis",
    description: "Serves Nero, the evil beneath the world.",
    layer: "user",
    attributes: {},
    governance: { ...governanceOf(pack), canonStatus: "draft" },
  };
  const report = detectConflicts(addNode(pack, bad), canon);

  assert.equal(decide(guardianById("guardian.alera"), report).verdict, "reject");
  assert.equal(decide(guardianById("guardian.shinkami"), report).verdict, "escalate");
  assert.equal(decide(guardianById("guardian.lyria"), report).verdict, "approve"); // reports, never adjudicates
  assert.ok(!guardianById("guardian.shinkami").authority.scopes.includes("canon:approve-locked"));

  const evals = runGuardianEvals();
  assert.deepEqual(evals.failed, []);
  assert.equal(evals.passed, 14);
});

test("branch, diff and merge — and canon is structurally protected from a user branch", async () => {
  const { canon, pack } = await seed();
  const ancestor = commit(pack, { branch: "main", message: "seed", by: pack.world.creatorRef, at: AT });

  const forked = branchPack(ancestor, { name: "chartroom", owner: ancestor.world.creatorRef, at: AT });
  const location = {
    id: deterministicId("loc", "chart-room"),
    type: "Location",
    name: goodLocation.name,
    description: goodLocation.description,
    layer: "user",
    attributes: { ...goodLocation.attributes, element: "Void" },
    governance: { ...governanceOf(ancestor), branchRef: "chartroom", canonStatus: "draft" },
  };
  const theirs = addRelationship(addNode(forked, location), {
    id: deterministicId("rel", "chart-room:part_of"),
    kind: "part_of",
    from: location.id,
    to: ancestor.world.id,
  });

  const delta = diffPacks(ancestor, theirs);
  assert.equal(delta.added.length, 1);
  assert.equal(delta.added[0].name, "The Slow Chart Room");
  assert.equal(delta.removed.length, 0);

  const merged = mergeBranch(ancestor, ancestor, theirs, { by: ancestor.world.creatorRef, at: AT });
  assert.deepEqual(merged.conflicts, []);
  assert.equal(merged.merged.nodes.length, 4);
  assert.ok(detectConflicts(merged.merged, canon).clean);

  // A user branch that rewrites the canon-layer Universe node is a conflict, not a merge.
  const universeId = ancestor.nodes.find((n) => n.type === "Universe").id;
  const hostile = {
    ...theirs,
    nodes: theirs.nodes.map((n) => (n.id === universeId ? { ...n, layer: "user", name: "Arcanea (mine now)" } : n)),
  };
  const blocked = mergeBranch(ancestor, ancestor, hostile, { by: "crt_someone", at: AT });
  assert.equal(blocked.merged, null);
  assert.ok(blocked.conflicts.some((c) => c.ruleId === "merge.canon-protected"));
});

test("divergent edits to the same field conflict instead of silently overwriting", async () => {
  const { pack } = await seed();
  const ancestor = commit(pack, { branch: "main", message: "seed", by: pack.world.creatorRef, at: AT });
  const worldId = ancestor.world.id;
  const mutate = (p, premise) => ({
    ...p,
    nodes: p.nodes.map((n) => (n.id === worldId ? { ...n, attributes: { ...n.attributes, premise } } : n)),
  });

  const ours = mutate(ancestor, "Guild of drifting charts");
  const theirs = mutate(ancestor, "Guild of still charts");
  const result = mergeBranch(ancestor, ours, theirs, { by: "crt_x", at: AT });
  assert.equal(result.merged, null);
  assert.ok(result.conflicts.some((c) => c.ruleId === "merge.divergent-field" && c.path === "attributes.premise"));

  // One-sided edits fast-forward cleanly.
  const oneSided = mergeBranch(ancestor, ancestor, theirs, { by: "crt_x", at: AT });
  assert.deepEqual(oneSided.conflicts, []);
  assert.equal(oneSided.merged.nodes.find((n) => n.id === worldId).attributes.premise, "Guild of still charts");
});

test("export is portable, verifiable, and carries its own authority model", async () => {
  const { canon, pack } = await seed();
  const compiled = apl.compile(
    "character.constrained.v1",
    { role: "corridor cartographer", gate: 6, gatesOpen: 3, element: "Void" },
    { canon, pack },
  );
  const node = apl.materialize(compiled, goodCharacter, {
    id: deterministicId("chr", "sennaris"),
    layer: "generated",
    governance: { ...governanceOf(pack), canonStatus: "draft" },
  });
  const built = commit(withGuardianRoles(addNode(pack, node)), { message: "first character", by: pack.world.creatorRef, at: AT });

  const exported = exportPack(built, { exportedAt: AT });
  assert.equal(exported.format, "WorldPack.v1");
  assert.equal(exported.interop.standard, "world.arcanea.json");
  assert.equal(exported.counts.Character, 1);
  assert.equal(exported.agentRoles.length, 10);
  assert.equal(exported.provenance.sources.length, 1);
  assert.equal(exported.provenance.head, built.branches.find((b) => b.id === "main").head);
  assert.ok(exported.provenance.versions.every((v) => v.createdAt && v.branch));

  assert.equal(verifyExport(exported).valid, true);
  const tampered = { ...exported, nodes: exported.nodes.map((n) => (n.type === "Character" ? { ...n, name: "Someone Else" } : n)) };
  assert.equal(verifyExport(tampered).valid, false);

  // Round trip through JSON — the pack is a file, not an object graph.
  const revived = JSON.parse(JSON.stringify(exported));
  assert.equal(verifyExport(revived).valid, true);
  assert.ok(detectConflicts(revived, canon).clean);
});
