import { z } from "zod";

const identifier = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/);
const entityTypeIdentifier = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9][A-Za-z0-9:_-]{0,63}$/);
const sha256 = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const worldContextWorldIdSchema = z.string().uuid();
const strictTimestamp = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/,
  )
  .refine((value) => {
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
  }, "Timestamp must be a real strict UTC instant");

export const WORLD_CONTEXT_STATES = [
  "source",
  "accepted",
  "proposal",
  "inference",
  "conflict",
  "rejected",
] as const;
export const WORLD_CONTEXT_ENTITY_STATES = [
  "source",
  "accepted",
  "proposal",
  "inference",
  "rejected",
] as const;
export const WORLD_CONTEXT_VISIBILITIES = [
  "private",
  "restricted",
  "public",
] as const;
export const WORLD_CONTEXT_ROLES = [
  "owner",
  "editor",
  "reviewer",
  "canon-steward",
  "publisher",
] as const;
export const WORLD_CONTEXT_PURPOSES = [
  "creator-question",
  "world-proof",
  "story-proof",
  "visual-proof",
  "canon-review",
  "release-review",
] as const;

function uniqueArray<T extends z.ZodTypeAny>(item: T, maximum: number) {
  return z
    .array(item)
    .max(maximum)
    .refine(
      (items) => new Set(items).size === items.length,
      "Items must be unique",
    );
}

export const worldContextFiltersSchema = z
  .object({
    entityTypes: uniqueArray(entityTypeIdentifier, 16),
    entityIds: uniqueArray(identifier, 32),
    sourceIds: uniqueArray(identifier, 32),
  })
  .strict();

const worldContextIncludeStatesSchema = uniqueArray(
  z.enum(WORLD_CONTEXT_STATES),
  6,
).min(1);

export const worldContextInputSchema = z
  .object({
    worldId: worldContextWorldIdSchema,
    query: z.string().min(1).max(1000),
    queryMode: z.literal("relevant-context"),
    purpose: z.enum(WORLD_CONTEXT_PURPOSES),
    filters: worldContextFiltersSchema,
    includeStates: worldContextIncludeStatesSchema.default([
      "source",
      "accepted",
    ]),
    maxEntities: z.number().int().min(1).max(100).default(40),
    visibilityScope: z.enum(["authorized", "public-only"]),
  })
  .strict();

/**
 * The public contract keeps source+accepted as its long-term default. The
 * compatibility adapter can prove only source coverage, so its advertised MCP
 * schema uses an honest source-only default without weakening the core schema.
 */
export const worldContextCompatibilityInputSchema =
  worldContextInputSchema.extend({
    includeStates: worldContextIncludeStatesSchema.default(["source"]),
  });

export const worldContextFactSchema = z
  .object({
    key: z.string().min(1).max(96),
    value: z.string().max(2000),
  })
  .strict();

export const worldContextPayloadSchema = z
  .object({
    summary: z.string().max(8000),
    facts: z.array(worldContextFactSchema).max(32),
    relationIds: uniqueArray(identifier, 64),
  })
  .strict();

export const snapshotEntitySchema = z
  .object({
    entityId: identifier,
    entityType: entityTypeIdentifier,
    name: z.string().max(300).optional(),
    state: z.enum(WORLD_CONTEXT_ENTITY_STATES),
    visibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
    payload: worldContextPayloadSchema,
    sourceIds: uniqueArray(identifier, 32).min(1),
  })
  .strict();

export const worldContextEntitySchema = snapshotEntitySchema.extend({
  relevanceScore: z.number().min(0).max(1),
});

export const worldContextConflictSchema = z
  .object({
    conflictId: identifier,
    kind: z.string().min(1).max(128),
    severity: z.enum(["info", "warning", "blocking"]),
    summary: z.string().min(1).max(4000),
    entityIds: uniqueArray(identifier, 64).min(1),
    sourceIds: uniqueArray(identifier, 64).min(1),
    state: z.literal("conflict"),
    visibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
  })
  .strict();

export const worldContextProvenanceSchema = z
  .object({
    sourceId: identifier,
    entityId: identifier,
    sourceKind: z.enum([
      "creator-source",
      "accepted-canon",
      "generated-proposal",
      "import",
      "system-derived",
    ]),
    visibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
    sourceRecordId: identifier,
    sourceHash: sha256,
    capturedAt: strictTimestamp,
    generator: z.string().max(256).optional(),
  })
  .strict();

export const authorizedWorldSnapshotSchema = z
  .object({
    schemaVersion: z.literal("arcanea.world-context-snapshot.v1"),
    worldId: worldContextWorldIdSchema,
    worldVisibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
    effectiveVisibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
    role: z.enum(WORLD_CONTEXT_ROLES),
    grantId: identifier,
    scope: z.enum(["authorized", "public-only"]),
    availableStates: uniqueArray(z.enum(WORLD_CONTEXT_STATES), 6),
    entities: z.array(snapshotEntitySchema).max(10000),
    conflicts: z.array(worldContextConflictSchema).max(10000),
    provenance: z.array(worldContextProvenanceSchema).max(320000),
  })
  .strict();

export const worldContextOutputSchema = z
  .object({
    revision: sha256,
    snapshotHash: sha256,
    access: z
      .object({
        worldId: worldContextWorldIdSchema,
        worldVisibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
        effectiveVisibility: z.enum(WORLD_CONTEXT_VISIBILITIES),
        role: z.enum(WORLD_CONTEXT_ROLES),
        grantId: identifier,
        scope: z.enum(["authorized", "public-only"]),
      })
      .strict(),
    entities: z.array(worldContextEntitySchema).max(100),
    conflicts: z.array(worldContextConflictSchema).max(100),
    provenance: z.array(worldContextProvenanceSchema).max(3200),
    coverage: z
      .object({
        requestedStates: uniqueArray(z.enum(WORLD_CONTEXT_STATES), 6),
        availableStates: uniqueArray(z.enum(WORLD_CONTEXT_STATES), 6),
        unavailableStates: uniqueArray(z.enum(WORLD_CONTEXT_STATES), 6),
        returnedStates: uniqueArray(z.enum(WORLD_CONTEXT_STATES), 6),
        visibilityScope: z.enum(["authorized", "public-only"]),
        returnedVisibilities: uniqueArray(
          z.enum(WORLD_CONTEXT_VISIBILITIES),
          3,
        ),
        maxEntitiesApplied: z.number().int().min(1).max(100),
        returnedEntities: z.number().int().min(0).max(100),
        returnedConflicts: z.number().int().min(0).max(100),
        returnedProvenance: z.number().int().min(0).max(3200),
        truncated: z.boolean(),
      })
      .strict(),
    queryReceipt: z
      .object({
        schemaVersion: z.literal("arcanea.world-context-query.v1"),
        queryMode: z.literal("relevant-context"),
        purpose: z.enum(WORLD_CONTEXT_PURPOSES),
        normalizedQueryHash: sha256,
        filtersHash: sha256,
        contextRequestHash: sha256,
      })
      .strict(),
  })
  .strict();

export type WorldContextInput = z.infer<typeof worldContextInputSchema>;
export type WorldContextOutput = z.infer<typeof worldContextOutputSchema>;
export type WorldContextState = (typeof WORLD_CONTEXT_STATES)[number];
export type WorldContextVisibility =
  (typeof WORLD_CONTEXT_VISIBILITIES)[number];
export type WorldContextRole = (typeof WORLD_CONTEXT_ROLES)[number];
export type AuthorizedWorldSnapshot = z.infer<
  typeof authorizedWorldSnapshotSchema
>;
export type SnapshotEntity = z.infer<typeof snapshotEntitySchema>;
export type WorldContextConflict = z.infer<typeof worldContextConflictSchema>;
export type WorldContextProvenance = z.infer<
  typeof worldContextProvenanceSchema
>;
