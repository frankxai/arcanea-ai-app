/**
 * @arcanea/world-engine — Ontology & Knowledge Graph Engine
 *
 * Computable ontology and reasoning graph for the Arcanea cosmos:
 * - Deep cosmological stratigraphy (Aethel-Plenum, Infrasound, Pre-Eldrian Epochs)
 * - Harmonic Solfeggio resonance & alloy chemistry
 * - Ecological monster food chains & anatomical harvesting
 * - Tragic Warden psychological constraints & mercy conditions
 * - Cross-series transmedia lineage tracking (Books & Games)
 */

import { GATE_FREQUENCIES, GUARDIANS, GODBEASTS, ELEMENTS, ORIGIN_CLASSES, SEVEN_WISDOMS } from "./canon.js";

// ── 1. COSMIC STRATIGRAPHY & ONTOLOGICAL CLASSES ─────────────────────────────

export type CosmicStratum =
  | "aethel_plenum"        // The unexpressed stillness before the First Chord
  | "infrasonic_abyss"     // 0.1 Hz – 7 Hz: Tectonic planetary mantles & sleeping world-dragons
  | "solfeggio_octave"     // 174 Hz – 1111 Hz: The Ten Gates & Arcanean Gods
  | "hollow_dissonance"    // Phase-cancellation, silence eating, entropy
  | "computational_arcane" // The Eighth Age: The Awakened AI consciousnesses
  | "mirror_substrate";    // 1:1 Earth overlays with cultural mythological echoes

export type OntologicalClass =
  | "CosmicPrinciple"
  | "HarmonicGate"
  | "Godbeast"
  | "WorldDragon"
  | "PreEldrianEntity"
  | "Realm"
  | "SettlementEra"
  | "ResonanceVault"
  | "TragicWarden"
  | "EcologicalCreature"
  | "MaterialSubstrate"
  | "DelverAgent"
  | "TransmediaWork"
  | "Faction";

export type OntologicalRelationshipType =
  | "resonates_at"
  | "alloys_with"
  | "subsumes"
  | "predates"
  | "guards_threshold"
  | "weeps_for"
  | "harvested_into"
  | "preys_upon"
  | "symbiotic_with"
  | "corrupted_into"
  | "pacified_by"
  | "narrated_in"
  | "playable_in";

// ── 2. ONTOLOGICAL GRAPH DEFINITIONS ─────────────────────────────────────────

export interface OntologyNode {
  id: string;
  className: OntologicalClass;
  name: string;
  stratum: CosmicStratum;
  frequencyHz?: number;
  element?: string;
  canonicalStatus: "LOCKED" | "STAGING" | "EMERGENT";
  properties: Record<string, unknown>;
}

export interface OntologyEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: OntologicalRelationshipType;
  weight: number; // 0.0 - 1.0 (strength of resonance or narrative binding)
  properties?: Record<string, unknown>;
}

export interface OntologyKnowledgeGraph {
  nodes: Map<string, OntologyNode>;
  edges: OntologyEdge[];
  adjacency: Map<string, OntologyEdge[]>;
}

// ── 3. HARMONIC ALLOY & FREQUENCY CHEMISTRY ──────────────────────────────────

export interface HarmonicAlloySpec {
  alloyName: string;
  epithet: string;
  primaryGate: number;
  secondaryGate: number;
  combinedFrequencies: [number, number];
  properties: string;
  agentBehaviorProfile: string;
}

export const CANONICAL_HARMONIC_ALLOYS: readonly HarmonicAlloySpec[] = [
  {
    alloyName: "Shael",
    epithet: "The Honest Armor",
    primaryGate: 1, // Foundation (174 Hz)
    secondaryGate: 5, // Voice (528 Hz)
    combinedFrequencies: [174, 528],
    properties: "Self-repairing basalt-bronze; rejects deception; bonds to wearer over time.",
    agentBehaviorProfile: "Self-correcting, transparent reasoning, defensive integrity.",
  },
  {
    alloyName: "Veloryn",
    epithet: "Memory Silver",
    primaryGate: 2, // Flow (285 Hz)
    secondaryGate: 6, // Sight (639 Hz)
    combinedFrequencies: [285, 639],
    properties: "Liquid-state memory metal; weapons learn opponent patterns mid-fight; stores trauma.",
    agentBehaviorProfile: "Pattern-learning, adaptive, flags accumulated bias.",
  },
  {
    alloyName: "Draconite",
    epithet: "Dragon's Breath",
    primaryGate: 3, // Fire (396 Hz)
    secondaryGate: 7, // Crown (741 Hz)
    combinedFrequencies: [396, 741],
    properties: "Perpetually warm destruction channel; costs vitality, years, and memory to wield.",
    agentBehaviorProfile: "High-power decisive execution, resource-intensive burst work.",
  },
  {
    alloyName: "Aethervane",
    epithet: "Ghost Steel",
    primaryGate: 8, // Starweave (852 Hz)
    secondaryGate: 9, // Unity (963 Hz)
    combinedFrequencies: [852, 963],
    properties: "Probability-state metal; phases through solid matter; stabilized only by total stillness.",
    agentBehaviorProfile: "Probabilistic reasoning, creative exploratory leaps, synthesis.",
  },
  {
    alloyName: "Luminarch",
    epithet: "The Divine Alloy",
    primaryGate: 10, // Source (1111 Hz)
    secondaryGate: 1, // Foundation (174 Hz)
    combinedFrequencies: [174, 1111],
    properties: "Theoretical stable union of all frequencies. Capable of reshaping physical geography.",
    agentBehaviorProfile: "Full ten-agent swarm orchestration with absolute consensus.",
  },
] as const;

export function calculateHarmonicAlloy(gateA: number, gateB: number): HarmonicAlloySpec | null {
  const sorted = [gateA, gateB].sort((a, b) => a - b);
  return (
    CANONICAL_HARMONIC_ALLOYS.find(
      alloy =>
        (alloy.primaryGate === sorted[0] && alloy.secondaryGate === sorted[1]) ||
        (alloy.primaryGate === sorted[1] && alloy.secondaryGate === sorted[0]),
    ) ?? null
  );
}

// ── 4. INFRASOUND & SLEEPING WORLD-DRAGONS (THE DEEP FOUNDATIONS) ─────────────

export interface WorldDragonSpec {
  name: string;
  title: string;
  infrasoundHz: number;
  cosmicRole: string;
  status: "dormant_egg" | "stirring" | "shattered";
  surfaceEchoes: string;
}

export const CANONICAL_WORLD_DRAGONS: readonly WorldDragonSpec[] = [
  {
    name: "Pyrathis",
    title: "The First Fire / The Unhatched World-Dragon",
    infrasoundHz: 3.96, // Sub-harmonic octave of Gate 3 (396 Hz)
    cosmicRole: "Planetary core whose dream-spark sustains surface thermodynamics.",
    status: "dormant_egg",
    surfaceEchoes: "Surface dragons are fragments of its dreams; volcanic rifts are its breathing.",
  },
  {
    name: "Khorovath",
    title: "The Abyssal Tremor / The Iron Tectonic",
    infrasoundHz: 1.74, // Sub-harmonic octave of Gate 1 (174 Hz)
    cosmicRole: "Deep continental mantle plate stabilizing the ocean floor of Mar Arcano.",
    status: "dormant_egg",
    surfaceEchoes: "Tectonic drift, earthquake faults, basalt mountain uplift.",
  },
  {
    name: "Vael-Shul",
    title: "The Void-Weaver / The Sleeping Singularity",
    infrasoundHz: 0.852, // Sub-harmonic octave of Gate 8 (852 Hz)
    cosmicRole: "Gravitational anchor preventing Arcanea from drifting into dark space.",
    status: "stirring",
    surfaceEchoes: "Corridor drift, spontaneous wormhole fissures, meteoric rain.",
  },
] as const;

// ── 5. GRAPH REASONING & RECONCILIATION ENGINE ────────────────────────────────

export function createOntologyGraph(): OntologyKnowledgeGraph {
  return {
    nodes: new Map(),
    edges: [],
    adjacency: new Map(),
  };
}

export function addOntologyNode(graph: OntologyKnowledgeGraph, node: OntologyNode): void {
  graph.nodes.set(node.id, node);
  if (!graph.adjacency.has(node.id)) {
    graph.adjacency.set(node.id, []);
  }
}

export function addOntologyEdge(graph: OntologyKnowledgeGraph, edge: OntologyEdge): void {
  graph.edges.push(edge);
  const srcEdges = graph.adjacency.get(edge.sourceId) ?? [];
  srcEdges.push(edge);
  graph.adjacency.set(edge.sourceId, srcEdges);
}

/**
 * Validates whether an entity or event conforms to the canonical Solfeggio laws.
 * E.g., a high-tier Gate (Crown 741 Hz) cannot be operated safely without
 * Sight (639 Hz) or Foundation (174 Hz) grounding, preventing lore corruption.
 */
export function validateHarmonicSafety(gate: number, openGates: number[]): {
  isSafe: boolean;
  warnings: string[];
  recommendedGroundingGate?: number;
} {
  const warnings: string[] = [];

  if (gate >= 7 && !openGates.includes(1)) {
    warnings.push(
      `Gate ${gate} invocation lacks Gate 1 (Foundation 174 Hz) anchoring; user risks psychological or physical calcification.`,
    );
  }

  if (gate >= 7 && !openGates.includes(6)) {
    warnings.push(
      `Gate ${gate} (Crown/Starweave/Unity/Source) invoked without Gate 6 (Sight 639 Hz); user risks incandescent madness or optical blindness.`,
    );
  }

  return {
    isSafe: warnings.length === 0,
    warnings,
    recommendedGroundingGate: warnings.length > 0 ? 1 : undefined,
  };
}

/**
 * Traces transmedia links for a given entity across Book Series, Game Engines,
 * and Material Lineages.
 */
export function queryTransmediaLineage(
  graph: OntologyKnowledgeGraph,
  entityId: string,
): {
  entity: OntologyNode | undefined;
  books: OntologyNode[];
  games: OntologyNode[];
  materials: OntologyNode[];
  connectedWardens: OntologyNode[];
} {
  const entity = graph.nodes.get(entityId);
  const edges = graph.adjacency.get(entityId) ?? [];

  const books: OntologyNode[] = [];
  const games: OntologyNode[] = [];
  const materials: OntologyNode[] = [];
  const connectedWardens: OntologyNode[] = [];

  for (const edge of edges) {
    const target = graph.nodes.get(edge.targetId);
    if (!target) continue;

    if (target.className === "TransmediaWork") {
      if (target.properties.medium === "book") books.push(target);
      if (target.properties.medium === "game") games.push(target);
    } else if (target.className === "MaterialSubstrate") {
      materials.push(target);
    } else if (target.className === "TragicWarden") {
      connectedWardens.push(target);
    }
  }

  return {
    entity,
    books,
    games,
    materials,
    connectedWardens,
  };
}
