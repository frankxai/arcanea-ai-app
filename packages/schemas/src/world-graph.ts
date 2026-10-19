import { z } from "zod";
import { EntityTypeSchema } from "./entities.js";

// ============================================================================
// LIVING WORLD GRAPH (PERSISTENT MULTIVERSE STATE)
// ============================================================================

export const GraphRelationshipTypeSchema = z.enum([
  "allies_with",
  "opposes",
  "mentors",
  "sworn_to_protect",
  "blood_relative",
  "wields_artifact",
  "inhabits_location",
  "guards_threshold",
  "betrayed_by",
  "descendant_of",
  "shares_gate_resonance",
]);

export type GraphRelationshipType = z.infer<typeof GraphRelationshipTypeSchema>;

export const WorldGraphNodeSchema = z.object({
  id: z.string().uuid(),
  entityType: EntityTypeSchema,
  label: z.string(),
  subtitle: z.string(),
  gateNumber: z.number().int().min(1).max(10).optional(),
  colorToken: z.string(),
  weight: z.number().min(0).max(1).default(0.5),
  metadata: z.record(z.string(), z.any()).default({}),
});

export type WorldGraphNode = z.infer<typeof WorldGraphNodeSchema>;

export const WorldGraphEdgeSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  targetId: z.string().uuid(),
  relationship: GraphRelationshipTypeSchema,
  tensionOrBond: z.string(), // Qualitative description of the dynamic
  strength: z.number().min(0).max(1).default(0.7),
});

export type WorldGraphEdge = z.infer<typeof WorldGraphEdgeSchema>;

export const LivingWorldGraphSchema = z.object({
  worldId: z.string(),
  name: z.string(),
  creatorHandle: z.string(),
  isForkable: z.boolean().default(true),
  license: z.literal("MIT").default("MIT"),
  nodes: z.array(WorldGraphNodeSchema),
  edges: z.array(WorldGraphEdgeSchema),
  lastSyncedAt: z.string().datetime(),
  version: z.string().default("1.0.0"),
});

export type LivingWorldGraph = z.infer<typeof LivingWorldGraphSchema>;
