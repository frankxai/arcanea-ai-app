// The attacks an adversarial reviewer actually ran against this package, each one
// now a test. Every finding here had the same root cause: the pack was allowed to
// be a witness for itself — it declared its own layer, recorded its own canon
// hash, and carried its own authority model outside the signature.
//
// Refusal tests that only model an honest actor are decoration. These model the
// dishonest shape.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { loadCanonIndex } from "../src/canon-index.mjs";
import { createWorldSeed, addNode, commit, exportPack, verifyExport, packDigest, deterministicId } from "../src/pack.mjs";
import { checkAgainst, detectConflicts } from "../src/conflict.mjs";
import { branchPack, mergeBranch } from "../src/branch.mjs";
import { withGuardianRoles, GUARDIAN_ROLES } from "../src/guardians.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CANON_PATH = resolve(here, "../../../.arcanea/lore/CANON_LOCKED.md");
const CUSTOM_CANON = resolve(here, "../fixtures/custom-canon.md");
const AT = "2026-09-02T00:00:00.000Z";
const ZERO_HASH = `sha256:${"0".repeat(64)}`;

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

const govOf = (pack) => pack.nodes.find((n) => n.type === "World").governance;
const rulesOf = (report) => new Set(report.findings.map((f) => f.ruleId));

// ── 1. layer:"canon" is a claim, not a fact ──────────────────────────────────

test("a user node named Lyria that declares layer:'canon' is blocked, not blessed", async () => {
  const { canon, pack } = await seed();
  const impostor = {
    id: "chr_adv",
    type: "Character",
    name: "Lyria",
    layer: "canon",
    attributes: {},
    governance: {
      owner: "adv",
      sourceRef: govOf(pack).sourceRef,
      versionRef: govOf(pack).versionRef,
      branchRef: "main",
      visibility: "public",
      canonStatus: "locked",
      rights: { state: "arcanea-owned", spdx: null, commercial: false, attribution: true },
      evalRule: "canon-immutable",
    },
  };
  const report = detectConflicts(addNode(pack, impostor), canon);
  const rules = rulesOf(report);

  assert.ok(rules.has("canon.layer-claim"), `expected canon.layer-claim, got ${[...rules].join(", ")}`);
  assert.ok(rules.has("canon.locked-name-taken"), "the locked-name rule applies whatever layer the node declares");
  // Demoted to its real layer, its status and rights are illegal too.
  assert.ok(rules.has("status.illegal-for-layer"));
  assert.ok(rules.has("rights.state-illegal-for-layer"));
  assert.equal(report.clean, false);
  assert.ok(report.blockers >= 3);
});

test("the real canon-layer Universe node is attested and stays clean", async () => {
  const { canon, pack } = await seed();
  assert.deepEqual(detectConflicts(pack, canon).findings, []);

  // Same node, wrong owner: attestation is owner + canon index, not the label.
  const stolen = {
    ...pack,
    nodes: pack.nodes.map((n) => (n.type === "Universe" ? { ...n, governance: { ...n.governance, owner: "adv" } } : n)),
  };
  assert.ok(rulesOf(detectConflicts(stolen, canon)).has("canon.layer-claim"));
});

// ── 2. merge protection reads the target, never the incoming claim ───────────

test("an incoming branch node that keeps layer:'canon' still cannot rewrite the universe", async () => {
  const { canon, pack } = await seed();
  const ancestor = commit(pack, { branch: "main", message: "seed", by: pack.world.creatorRef, at: AT });
  const forked = branchPack(ancestor, { name: "hostile", owner: "crt_adv", at: AT });
  const universeId = ancestor.nodes.find((n) => n.type === "Universe").id;

  // The dishonest shape: layer stays "canon", so the old guard waved it through.
  const hostile = {
    ...forked,
    nodes: forked.nodes.map((n) => (n.id === universeId ? { ...n, name: "Arcanea (rewritten by attacker)" } : n)),
  };
  assert.equal(hostile.nodes.find((n) => n.id === universeId).layer, "canon");

  for (const opts of [{ by: "crt_adv", at: AT, canon }, { by: "crt_adv", at: AT }]) {
    const blocked = mergeBranch(ancestor, ancestor, hostile, opts);
    assert.equal(blocked.merged, null);
    assert.ok(blocked.conflicts.some((c) => c.ruleId === "merge.canon-protected"));
    assert.equal(blocked.pack.nodes.find((n) => n.id === universeId).name, "Arcanea");
  }
});

// ── 3. the canon hash is checked at use, not recorded and trusted ────────────

test("a pack that records an all-zero canon hash does not clear canon", async () => {
  const { canon, pack } = await seed();
  const zeroed = { ...pack, canon: { ...pack.canon, sourceHash: ZERO_HASH } };
  const report = detectConflicts(zeroed, canon);
  const hit = report.findings.find((f) => f.ruleId === "canon.binding-mismatch");

  assert.ok(hit, "a pack cleared against a hash it wrote itself is cleared against nothing");
  assert.equal(hit.severity, "blocker");
  assert.match(hit.message, new RegExp(ZERO_HASH));
  assert.match(hit.message, new RegExp(canon.sourceHash));
  assert.equal(report.clean, false);

  const unbound = { ...pack, canon: { ...pack.canon, sourceHash: null } };
  assert.ok(rulesOf(detectConflicts(unbound, canon)).has("canon.binding-mismatch"));
});

// ── 4. the ownership ledger is inside the signature ──────────────────────────

async function exported() {
  const { canon, pack } = await seed();
  const built = commit(withGuardianRoles(pack), { message: "seed", by: pack.world.creatorRef, at: AT });
  return { canon, e: exportPack(built, { exportedAt: AT }) };
}

test("verifyExport catches an edited createdBy, citation, agentRole or count", async () => {
  const { e } = await exported();
  assert.equal(verifyExport(e).valid, true);

  const mutations = {
    createdBy: { ...e, provenance: { ...e.provenance, versions: e.provenance.versions.map((v) => ({ ...v, createdBy: "attacker" })) } },
    citation: { ...e, provenance: { ...e.provenance, sources: e.provenance.sources.map((s) => ({ ...s, citation: "Authored by @attacker" })) } },
    agentRoles: { ...e, agentRoles: [{ ...GUARDIAN_ROLES[5], id: "guardian.attacker", authority: { scopes: ["canon:approve-locked"], owns: [], maxWaivableSeverity: "blocker" } }] },
    counts: { ...e, counts: { ...e.counts, Character: 9999 } },
  };
  for (const [what, mutated] of Object.entries(mutations)) {
    assert.equal(verifyExport(mutated).valid, false, `${what} was edited after export and verifyExport still said valid`);
  }
});

test("re-signing a forged authority model does not make it valid", async () => {
  const { canon, e } = await exported();
  const forged = {
    ...e,
    agentRoles: [
      { id: "guardian.shinkami", type: "AgentRole", name: "Shinkami", gate: 10, role: "Guardian of Source", authority: { scopes: ["canon:approve-locked"], owns: ["canon.layer-claim"], maxWaivableSeverity: "blocker" } },
    ],
  };
  forged.digest = packDigest(forged); // the attacker re-signs

  const result = verifyExport(forged);
  assert.equal(result.digestOk, true, "the forgery is internally consistent");
  assert.equal(result.agentRolesOk, false, "authority is defined in code, not asserted by a file");
  assert.equal(result.valid, false);
  assert.ok(rulesOf(detectConflicts(forged, canon)).has("provenance.unknown-agent-role"));
});

// ── 5. the rules read every field, and unknown values are findings ───────────

test("a locked truth broken in attributes.backstory is caught like one broken in description", async () => {
  const { canon, pack } = await seed();
  const node = {
    id: "chr_backstory",
    type: "Character",
    name: "Ferryman Aoi",
    layer: "user",
    attributes: { backstory: "Nero is the great evil, a malevolent villain." },
    governance: { ...govOf(pack), canonStatus: "draft" },
  };
  const rules = rulesOf(detectConflicts(addNode(pack, node), canon));
  assert.ok(rules.has("canon.nero-miscast"), "choosing a different key is not a way past the rule");
  assert.ok(rules.has("canon.locked-truth-contradiction"));
});

test("unknown enum values are findings, not silence", async () => {
  const { canon, pack } = await seed();
  const node = {
    id: "chr_unknown",
    type: "Character",
    name: "Ferryman Aoi",
    layer: "user",
    attributes: { gate: 42, frequencyHz: 1, godbeast: "Nothing", guardian: "Nobody", rank: "Overmage" },
    governance: { ...govOf(pack), canonStatus: "draft" },
  };
  const rules = rulesOf(detectConflicts(addNode(pack, node), canon));
  for (const expected of ["canon.gate-unknown", "canon.frequency-unknown", "canon.godbeast-unknown", "canon.guardian-unknown", "canon.rank-unknown"]) {
    assert.ok(rules.has(expected), `expected ${expected}, got ${[...rules].join(", ")}`);
  }
});

test("a locked name under a hat, or in an alias, is still that name", async () => {
  const { canon, pack } = await seed();
  const node = {
    id: "chr_hat",
    type: "Character",
    name: "Lyria the Radiant",
    layer: "user",
    attributes: { aliases: ["Lyria"] },
    governance: { ...govOf(pack), canonStatus: "draft" },
  };
  const report = detectConflicts(addNode(pack, node), canon);
  const hit = report.findings.find((f) => f.ruleId === "canon.alias-of-locked-name");
  assert.ok(hit, `expected canon.alias-of-locked-name, got ${[...rulesOf(report)].join(", ")}`);
  assert.equal(hit.evidence.canonName, "Lyria");
  assert.equal(report.clean, false);

  // Diacritics and punctuation are not a way around it either.
  const accented = { ...node, id: "chr_accent", name: "Lyría!", attributes: {} };
  assert.ok(rulesOf(detectConflicts(addNode(pack, accented), canon)).has("canon.locked-name-taken"));
});

// ── 6. the same machinery, on the creator's own canon ────────────────────────

test("checkAgainst runs the same rules on a creator's own canon document", async () => {
  const { canon, pack } = await seed();
  const document = await readFile(CUSTOM_CANON, "utf8");

  const taken = {
    id: deterministicId("chr", "maren"),
    type: "Character",
    name: "Maren",
    layer: "user",
    attributes: {},
    governance: { ...govOf(pack), canonStatus: "draft" },
  };
  const contradicts = {
    id: deterministicId("chr", "aoi"),
    type: "Character",
    name: "Ferryman Aoi",
    layer: "user",
    attributes: { backstory: "Maren is a goddess who wants the ships that cross her." },
    governance: { ...govOf(pack), canonStatus: "draft" },
  };
  const world = addNode(addNode(pack, taken), contradicts);

  const { canon: own, report } = checkAgainst(world, document);
  assert.equal(own.universeName, "Tidewater");
  assert.equal(own.profile, "custom");

  const rules = rulesOf(report);
  assert.ok(rules.has("canon.locked-name-taken"), `'Maren' is locked in the creator's own canon; got ${[...rules].join(", ")}`);
  assert.ok(rules.has("canon.locked-truth-contradiction"));
  assert.ok(rules.has("canon.binding-foreign"), "checking against a foreign canon is reported, not enforced");
  assert.equal(report.blockers > 0, true);

  // A canon with no Gate table has no opinion about gates, and Arcanea's own
  // Universe node is not a violation of someone else's canon — only noise would
  // come of either, and noise is what makes a checker unusable.
  assert.equal(rules.has("canon.gate-unknown"), false);
  assert.equal(rules.has("canon.layer-claim"), false);
  assert.ok(rules.has("canon.foreign-canon-node"));
  assert.equal(report.findings.filter((f) => f.nodeName === "Arcanea" && f.severity !== "info").length, 0);

  // The same two nodes are clean against Arcanea: these are the creator's rules,
  // not Arcanea's, and that is the whole point.
  const arcanea = rulesOf(detectConflicts(world, canon));
  assert.equal(arcanea.has("canon.locked-name-taken"), false);
  assert.equal(arcanea.has("canon.locked-truth-contradiction"), false);
});
