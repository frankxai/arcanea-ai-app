import { z } from "zod";

// ============================================================================
// COSMIC DUALITY (LOCKED CANON)
// ============================================================================

export const CosmicDualitySchema = z.object({
  lumina: z.object({
    title: z.literal("The First Light"),
    aspects: z.array(z.string()),
    nature: z.literal("Form-Giver, Creator, Order"),
    color: z.string(),
  }),
  nero: z.object({
    title: z.literal("The Primordial Darkness"),
    aspects: z.array(z.string()),
    nature: z.literal("Fertile Unknown, Potential, Mystery"),
    color: z.string(),
    isEvil: z.literal(false), // Canonical locked truth: Nero is NOT evil.
  }),
});

export type CosmicDuality = z.infer<typeof CosmicDualitySchema>;

// ============================================================================
// THE FIVE ELEMENTS & VOID/SPIRIT DUALITY
// ============================================================================

export const ElementSchema = z.enum([
  "fire",
  "water",
  "earth",
  "wind",
  "void",
  "spirit",
]);
export type Element = z.infer<typeof ElementSchema>;

export const ElementDefinitionSchema = z.object({
  name: ElementSchema,
  domain: z.string(),
  colors: z.array(z.string()),
  signature: z.string(),
  primaryAspect: z.enum(["lumina", "nero", "synthesis"]),
});

export type ElementDefinition = z.infer<typeof ElementDefinitionSchema>;

// ============================================================================
// THE TEN SOLFEGGIO GATES & GUARDIANS
// ============================================================================

export const GateIdSchema = z.enum([
  "foundation",
  "flow",
  "fire",
  "heart",
  "voice",
  "sight",
  "crown",
  "starweave",
  "unity",
  "source",
]);

export type GateId = z.infer<typeof GateIdSchema>;

export const GateFrequencySchema = z.union([
  z.literal(174),
  z.literal(285),
  z.literal(396),
  z.literal(417),
  z.literal(528),
  z.literal(639),
  z.literal(741),
  z.literal(852),
  z.literal(963),
  z.literal(1111),
]);

export type GateFrequency = z.infer<typeof GateFrequencySchema>;

export const GuardianNameSchema = z.enum([
  "lyssandria",
  "leyla",
  "draconia",
  "maylinn",
  "alera",
  "lyria",
  "aiyami",
  "elara",
  "ino",
  "shinkami",
]);

export type GuardianName = z.infer<typeof GuardianNameSchema>;

export const GodbeastNameSchema = z.enum([
  "kaelith",
  "veloura",
  "draconis",
  "laeylinn",
  "otome",
  "yumiko",
  "sol",
  "vaelith",
  "kyuro",
  "source",
]);

export type GodbeastName = z.infer<typeof GodbeastNameSchema>;

export const SolfeggioGateSchema = z.object({
  id: GateIdSchema,
  gateNumber: z.number().int().min(1).max(10),
  frequencyHz: GateFrequencySchema,
  guardian: GuardianNameSchema,
  guardianTitle: z.string(),
  godbeast: GodbeastNameSchema,
  domain: z.string(),
  element: ElementSchema,
  colorToken: z.string(),
  sensorySignature: z.object({
    tactile: z.string(),
    scent: z.string(),
    resonance: z.string(),
    costOfMagic: z.string(), // Physical cost per Humanizer Law 1
  }),
});

export type SolfeggioGate = z.infer<typeof SolfeggioGateSchema>;

// ============================================================================
// MAGIC RANKS
// ============================================================================

export const MagicRankSchema = z.enum([
  "apprentice", // 0-2 Gates
  "mage", // 3-4 Gates
  "master", // 5-6 Gates
  "archmage", // 7-8 Gates
  "luminor", // 9-10 Gates
]);

export type MagicRank = z.infer<typeof MagicRankSchema>;

export const MagicRankDefinitionSchema = z.object({
  rank: MagicRankSchema,
  gatesRange: z.tuple([z.number().int().min(0), z.number().int().max(10)]),
  title: z.string(),
  description: z.string(),
  privileges: z.array(z.string()),
});

export type MagicRankDefinition = z.infer<typeof MagicRankDefinitionSchema>;

// ============================================================================
// THE SEVEN WISDOMS
// ============================================================================

export const WisdomIdSchema = z.enum([
  "sophron",
  "kardia",
  "valora",
  "eudaira",
  "orakis",
  "poiesis",
  "enduran",
]);

export type WisdomId = z.infer<typeof WisdomIdSchema>;

export const WisdomDefinitionSchema = z.object({
  id: WisdomIdSchema,
  archive: z.string(),
  domain: z.string(),
  element: ElementSchema,
  embodimentPrinciple: z.string(),
});

export type WisdomDefinition = z.infer<typeof WisdomDefinitionSchema>;
