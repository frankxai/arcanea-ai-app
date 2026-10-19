import { z } from "zod";
import {
  GateIdSchema,
  GateFrequencySchema,
  ElementSchema,
} from "./universe.js";

// ============================================================================
// SETTLEMENT ERAS (DEEP TIME CHRONOLOGY)
// ============================================================================

export const SettlementEraSchema = z.enum([
  "heartland", // Settled before the First War; carries deep-time wound memory
  "first_settling", // Founded in immediate aftermath of Malachar's sealing
  "second_settling", // Settled 400 years post-sealing; clear, transparent arcane flow
  "frontier", // Reached in last 2-3 generations; volatile, fast-evolving
  "fallen", // Extinct or closed realm; dormant arcane signature
]);

export type SettlementEra = z.infer<typeof SettlementEraSchema>;

// ============================================================================
// LINGUISTIC MATRIX & PHONOLOGY
// ============================================================================

export const LinguisticFamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  dominantGate: GateIdSchema,
  harmonicFrequencyHz: GateFrequencySchema,
  phonology: z.object({
    preferredConsonants: z.array(z.string()),
    vowelHarmony: z.array(z.string()),
    prohibitedClusters: z.array(z.string()),
    cadencePattern: z.string(), // e.g. "Dactylic with resonant caesuras"
    sensoryTone: z.string(), // e.g. "Gravel and struck iron", "Silver flute over water"
  }),
  etymologicalRoots: z.record(z.string(), z.string()), // prefix/root -> meaning
  namingPatterns: z.object({
    masculineSuffixes: z.array(z.string()),
    feminineSuffixes: z.array(z.string()),
    neutralSuffixes: z.array(z.string()),
    toponymPrefixes: z.array(z.string()), // prefixes for places/cities
  }),
});

export type LinguisticFamily = z.infer<typeof LinguisticFamilySchema>;

// ============================================================================
// REALM & CORRIDOR TOPOLOGY
// ============================================================================

export const CorridorConnectionSchema = z.object({
  targetRealmId: z.string(),
  resonanceHarmonicDelta: z.number().int().min(0), // Abs frequency diff (0 = perfect harmonic lock)
  stabilityIndex: z.number().min(0).max(1), // 1.0 = permanent, 0.1 = imminent drift/closure
  travelDaysByCorridor: z.number().positive(),
  travelDaysBySurface: z.number().positive(),
  isAquifer: z.boolean().default(false), // Deep aquifer corridors do not move across geological time
  status: z.enum(["open", "drifting", "closed"]),
});

export type CorridorConnection = z.infer<typeof CorridorConnectionSchema>;

export const RealmDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  settlementEra: SettlementEraSchema,
  dominantGate: GateIdSchema,
  frequencyHz: GateFrequencySchema,
  primaryElement: ElementSchema,
  linguisticFamilyId: z.string(),
  geography: z.object({
    terrain: z.string(),
    soilResonance: z.string(), // Physical and acoustic property of the earth
    weatherPhenomena: z.string(),
  }),
  corridors: z.array(CorridorConnectionSchema),
  canonicalLoreFile: z.string(),
  isLockedCanon: z.boolean().default(false),
});

export type RealmDefinition = z.infer<typeof RealmDefinitionSchema>;

// ============================================================================
// TEMPORAL MULTIVERSE PROVENANCE ENGINE
// ============================================================================

export const TemporalEpochSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int(),
  timeframeDescription: z.string(),
  cosmicEvents: z.array(z.string()),
  arcaneEntropyRate: z.number().min(0).max(1),
});

export type TemporalEpoch = z.infer<typeof TemporalEpochSchema>;

export const MultiverseProvenanceRecordSchema = z.object({
  entityId: z.string().uuid(),
  entityName: z.string(),
  originRealmId: z.string(),
  originEpochId: z.string(),
  primaryGate: GateIdSchema,
  resonanceHz: GateFrequencySchema,
  linguisticRoot: z.object({
    language: z.string(),
    etymologicalSource: z.string(),
    literalMeaning: z.string(),
  }),
  temporalCausalityPath: z.array(
    z.object({
      epochId: z.string(),
      locationRealmId: z.string(),
      eventSummary: z.string(),
      physicalModification: z.string().optional(), // Scars, reforging, weathering
    }),
  ),
  humanCostSummary: z.string(), // Physical price paid for its existence/creation
});

export type MultiverseProvenanceRecord = z.infer<
  typeof MultiverseProvenanceRecordSchema
>;
