import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateHarmonicAlloy,
  validateHarmonicSafety,
  createOntologyGraph,
  addOntologyNode,
  addOntologyEdge,
  queryTransmediaLineage,
  CANONICAL_HARMONIC_ALLOYS,
  CANONICAL_WORLD_DRAGONS,
} from "../dist/index.js";

test("calculates canonical harmonic alloys correctly", () => {
  // Foundation (1) + Voice (5) = Shael (The Honest Armor)
  const shael = calculateHarmonicAlloy(1, 5);
  assert.ok(shael);
  assert.equal(shael.alloyName, "Shael");
  assert.equal(shael.epithet, "The Honest Armor");

  // Flow (2) + Sight (6) = Veloryn (Memory Silver)
  const veloryn = calculateHarmonicAlloy(2, 6);
  assert.ok(veloryn);
  assert.equal(veloryn.alloyName, "Veloryn");

  // Invalid combination returns null
  const invalid = calculateHarmonicAlloy(1, 2);
  assert.equal(invalid, null);
});

test("validates harmonic safety and grounding rules", () => {
  // Invoking Gate 7 (Crown) with Gate 1 and Gate 6 open is safe
  const safeInvocation = validateHarmonicSafety(7, [1, 2, 6]);
  assert.equal(safeInvocation.isSafe, true);
  assert.equal(safeInvocation.warnings.length, 0);

  // Invoking Gate 7 without Gate 1 produces a Foundation warning
  const missingFoundation = validateHarmonicSafety(7, [6]);
  assert.equal(missingFoundation.isSafe, false);
  assert.ok(missingFoundation.warnings[0].includes("Gate 1 (Foundation 174 Hz)"));

  // Invoking Gate 8 without Gate 6 produces an optical madness warning
  const missingSight = validateHarmonicSafety(8, [1]);
  assert.equal(missingSight.isSafe, false);
  assert.ok(missingSight.warnings[0].includes("Gate 6 (Sight 639 Hz)"));
});

test("traverses ontology graph and queries transmedia lineage", () => {
  const graph = createOntologyGraph();

  // Add a Resonance Vault node
  addOntologyNode(graph, {
    id: "vault-kaelith-bastion",
    className: "ResonanceVault",
    name: "Sunken Bastion of Kaelith",
    stratum: "solfeggio_octave",
    frequencyHz: 174,
    canonicalStatus: "STAGING",
    properties: { rankBand: "apprentice" },
  });

  // Add a Tragic Warden boss node
  addOntologyNode(graph, {
    id: "warden-brandon",
    className: "TragicWarden",
    name: "Commander Brandon the Unrelieved",
    stratum: "mortal_era",
    canonicalStatus: "STAGING",
    properties: { tragedy: "Believes the siege of Eldria was yesterday" },
  });

  // Add a Transmedia Book node
  addOntologyNode(graph, {
    id: "book-dungeon-scrolls",
    className: "TransmediaWork",
    name: "The Dungeon Scrolls: Vol 1",
    stratum: "mortal_era",
    canonicalStatus: "STAGING",
    properties: { medium: "book", pov: "Vor Ashren" },
  });

  // Add a Material drop node
  addOntologyNode(graph, {
    id: "material-kaelith-core",
    className: "MaterialSubstrate",
    name: "Kaelith Heart-Core",
    stratum: "solfeggio_octave",
    frequencyHz: 174,
    canonicalStatus: "STAGING",
    properties: { type: "vael_crystal" },
  });

  // Connect edges
  addOntologyEdge(graph, {
    id: "e1",
    sourceId: "vault-kaelith-bastion",
    targetId: "warden-brandon",
    relationship: "guards_threshold",
    weight: 1.0,
  });

  addOntologyEdge(graph, {
    id: "e2",
    sourceId: "vault-kaelith-bastion",
    targetId: "book-dungeon-scrolls",
    relationship: "narrated_in",
    weight: 0.9,
  });

  addOntologyEdge(graph, {
    id: "e3",
    sourceId: "vault-kaelith-bastion",
    targetId: "material-kaelith-core",
    relationship: "harvested_into",
    weight: 1.0,
  });

  // Query lineage from vault
  const lineage = queryTransmediaLineage(graph, "vault-kaelith-bastion");
  assert.ok(lineage.entity);
  assert.equal(lineage.books.length, 1);
  assert.equal(lineage.books[0].name, "The Dungeon Scrolls: Vol 1");
  assert.equal(lineage.connectedWardens.length, 1);
  assert.equal(lineage.connectedWardens[0].name, "Commander Brandon the Unrelieved");
  assert.equal(lineage.materials.length, 1);
  assert.equal(lineage.materials[0].name, "Kaelith Heart-Core");
});

test("validates canonical world dragons specification", () => {
  assert.equal(CANONICAL_WORLD_DRAGONS.length, 3);
  const pyrathis = CANONICAL_WORLD_DRAGONS.find(d => d.name === "Pyrathis");
  assert.ok(pyrathis);
  assert.equal(pyrathis.infrasoundHz, 3.96);
  assert.equal(pyrathis.status, "dormant_egg");
});
