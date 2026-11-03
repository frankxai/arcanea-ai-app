import { z } from "zod";

// A local survey plane, not terrestrial longitude/latitude or a canon claim.
const Id = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9][a-zA-Z0-9:._-]*$/);
const Position = z.tuple([
  z.number().finite().min(0).max(1000),
  z.number().finite().min(0).max(640),
]);
export const AtlasGeometrySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("Point"), coordinates: Position }).strict(),
  z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(Position).min(4).max(128),
    })
    .strict(),
]);
export const AtlasFeatureSchema = z
  .object({
    schemaVersion: z.literal("atlas.feature.v1"),
    worldId: Id,
    kind: z.enum(["region", "settlement"]),
    parentId: Id.nullable(),
    description: z.string().min(1).max(1200),
    geometry: AtlasGeometrySchema,
  })
  .strict()
  .superRefine((feature, ctx) => {
    if ((feature.kind === "region") !== (feature.geometry.type === "Polygon"))
      ctx.addIssue({
        code: "custom",
        message: "Regions require polygons; settlements require points",
      });
  });
export const AtlasTimelineSchema = z
  .object({
    schemaVersion: z.literal("atlas.timeline.v1"),
    worldId: Id,
    from: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    to: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    eras: z
      .array(
        z
          .object({
            moment: z.number().int().nonnegative(),
            label: z.string().min(1).max(120),
          })
          .strict(),
      )
      .min(1)
      .max(24),
  })
  .strict();
export const AtlasAssertionSchema = z
  .object({
    id: Id,
    subjectId: Id,
    predicate: z.string(),
    value: z.unknown(),
    cardinality: z.literal("one"),
    status: z.enum(["STAGING", "CANDIDATE"]),
    confidence: z.number().min(0).max(1),
    validity: z
      .object({
        timelineId: Id,
        from: z.number().int().nonnegative(),
        to: z.number().int().nonnegative().nullable(),
      })
      .strict()
      .nullable(),
    source: z
      .object({
        path: z
          .string()
          .min(1)
          .max(240)
          .regex(
            /^(?!\/)(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)[a-zA-Z0-9._/-]+$/,
          ),
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
        commit: z
          .string()
          .regex(/^[a-f0-9]{40}$/)
          .optional(),
        lineStart: z.number().int().positive().optional(),
        lineEnd: z.number().int().positive().optional(),
      })
      .strict(),
    affectedArtifacts: z.array(Id),
    supersedes: z.array(Id),
  })
  .strict();
export type AtlasGeometry = z.infer<typeof AtlasGeometrySchema>;
export type AtlasFeatureValue = z.infer<typeof AtlasFeatureSchema>;
export type AtlasAssertion = z.infer<typeof AtlasAssertionSchema>;
export type AtlasTimelineValue = z.infer<typeof AtlasTimelineSchema>;
