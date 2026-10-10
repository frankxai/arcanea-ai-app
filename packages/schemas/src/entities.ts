import { z } from "zod";
import { ElementSchema, GateIdSchema, MagicRankSchema } from "./universe.js";

// ============================================================================
// ENTITY TYPES
// ============================================================================

export const EntityTypeSchema = z.enum([
  "character",
  "location",
  "artifact",
  "creature",
  "faction",
  "lore_event",
]);

export type EntityType = z.infer<typeof EntityTypeSchema>;

// ============================================================================
// HUMANIZER CHARACTER SCHEMA
// (Enforces human flaws, physical costs, and sensory anchors)
// ============================================================================

export const CharacterEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  titles: z.array(z.string()).default([]),
  worldId: z.string(),
  primaryGate: GateIdSchema,
  element: ElementSchema,
  rank: MagicRankSchema.default("apprentice"),

  // Humanizer Mandates
  flawOrTension: z.string().min(10), // Required psychological flaw or internal conflict
  physicalAnchors: z.array(z.string()).min(3), // 3 tangible, tactile details (e.g. scar, smell of cedar, cracked locket)
  voiceCadence: z.string(), // How this character speaks (blunt, whisper, rapid, lyrical)

  // Narrative Relationships
  bonds: z.record(z.string(), z.string()).default({}), // targetEntityId -> relationship description
  backstorySnippet: z.string(),
  isCanonical: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CharacterEntity = z.infer<typeof CharacterEntitySchema>;

// ============================================================================
// LOCATION & REALM SCHEMA
// ============================================================================

export const LocationEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  worldId: z.string(),
  realm: z.string(),
  dominantGate: GateIdSchema,
  era: z.enum([
    "heartland",
    "first_settling",
    "second_settling",
    "frontier",
    "fallen",
  ]),
  sensoryAtmosphere: z.object({
    soundscape: z.string(),
    weatherAndLight: z.string(),
    scentAndAir: z.string(),
  }),
  corridors: z.array(z.string()).default([]),
  dangerOrFriction: z.string(),
});

export type LocationEntity = z.infer<typeof LocationEntitySchema>;

// ============================================================================
// SACRED RELIC & ARTIFACT SCHEMA
// ============================================================================

export const RelicEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  worldId: z.string(),
  wielderId: z.string().uuid().optional(),
  gateResonance: GateIdSchema,
  physicalMaterial: z.string(), // e.g. "Blackened iron with Lapis veins"
  powerCost: z.string(), // What the wielder pays to invoke it
  currentLocationId: z.string().uuid().optional(),
});

export type RelicEntity = z.infer<typeof RelicEntitySchema>;
