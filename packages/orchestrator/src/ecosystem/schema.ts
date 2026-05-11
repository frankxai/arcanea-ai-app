/**
 * Zod schemas for the Arcanea ecosystem graph.
 * - ManifestNodeSchema: curated source-of-truth (hand-edited YAML).
 * - EcosystemNodeSchema: post-generator hydrated record (status/consumedBy/lastVerifiedAt populated).
 */
import { z } from 'zod';

export const GATES = ['source', 'form', 'pattern', 'voice', 'vision', 'story', 'world', 'soul', 'unity', 'mastery'] as const;
export const LAYERS = ['substrate', 'product', 'surface'] as const;
export const HEMISPHERES = ['arc', 'nea', 'seam'] as const;
export const STATUSES = ['built', 'shipped', 'wip', 'orphan', 'sunset', 'external'] as const;

export const GateSchema = z.enum(GATES);
export const LayerSchema = z.enum(LAYERS);
export const HemisphereSchema = z.enum(HEMISPHERES);
export const StatusSchema = z.enum(STATUSES);

export const EcosystemNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  layer: LayerSchema,
  gate: GateSchema,
  hemisphere: HemisphereSchema,
  status: StatusSchema,
  repo: z.string().optional(),
  github: z.string().url().optional(),
  publicUrl: z.string().url().optional(),
  packageVersion: z.string().optional(),
  lastCommitAt: z.string().optional(),
  lastVerifiedAt: z.string(),
  consumes: z.array(z.string()),
  consumedBy: z.array(z.string()),
  isExternal: z.boolean(),
  owner: z.string().optional(),
  links: z.record(z.string(), z.union([z.string().url(), z.string().regex(/^\//)])),
});

export type EcosystemNode = z.infer<typeof EcosystemNodeSchema>;

export const EcosystemEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  kind: z.enum(['consumes', 'bridges', 'routes', 'references']),
});

export type EcosystemEdge = z.infer<typeof EcosystemEdgeSchema>;

export const ManifestNodeSchema = EcosystemNodeSchema
  .partial({ status: true, lastVerifiedAt: true, consumedBy: true })
  .extend({
    last_curated: z.string().optional(),
    status_override: StatusSchema.optional(),
  });

export const ManifestSchema = z.object({
  nodes: z.array(ManifestNodeSchema),
});

export type Manifest = z.infer<typeof ManifestSchema>;
