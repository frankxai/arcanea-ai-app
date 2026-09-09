import { z } from "zod";

const metadata = z.record(z.string(), z.unknown());
const node = z.object({
  id: z.string().min(1),
  type: z.enum([
    "character",
    "location",
    "creature",
    "artifact",
    "magic",
    "story",
  ]),
  name: z.string(),
  element: z.string().optional(),
  gate: z.number().int().min(0).max(10).optional(),
  createdAt: z.string().datetime({ offset: true }),
  metadata,
});
const edge = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  relationship: z.enum([
    "created_by",
    "mentored_by",
    "located_at",
    "wields",
    "inhabits",
    "guards",
    "opposes",
    "allies_with",
    "transforms_into",
    "derived_from",
    "part_of",
    "same_element",
    "same_house",
    "same_gate",
  ]),
  strength: z.number().min(0).max(1),
  metadata: metadata.optional(),
});
const graph = z.object({ nodes: z.array(node), edges: z.array(edge) });

/** Parse completely before replacing live state or a saved file. */
export function validateCreationGraph(nodes: unknown, edges: unknown) {
  const parsed = graph.parse({ nodes, edges });
  const nodeIds = new Set(parsed.nodes.map((item) => item.id));
  const edgeIds = new Set(parsed.edges.map((item) => item.id));
  if (
    nodeIds.size !== parsed.nodes.length ||
    edgeIds.size !== parsed.edges.length
  ) {
    throw new Error("World graph contains duplicate ids.");
  }
  if (
    parsed.edges.some(
      (item) => !nodeIds.has(item.sourceId) || !nodeIds.has(item.targetId),
    )
  ) {
    throw new Error(
      "World graph contains a relationship to a missing creation.",
    );
  }
  return parsed;
}
