import { z } from "zod";
import { canonicalJson, canonicalSha256 } from "../gateway/canonical.js";
import { validateCreationGraph } from "./graph-validation.js";
import { exportExistingGraph, restoreNewGraph } from "./creation-graph.js";
import { loadWorldFromDisk } from "./world-persistence.js";

/** A transport envelope for the existing creation graph, not World Repo Standard. */
export const WORLD_BUNDLE_VERSION = "arcanea.creation-graph.bundle.v1";
export const MAX_WORLD_BUNDLE_BYTES = 2_000_000;
const sessionIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_-]{1,128}$/)
  .refine((value) => !/^(?:con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(value));

const payloadSchema = z.strictObject({
  schemaVersion: z.literal(WORLD_BUNDLE_VERSION),
  source: z.strictObject({
    sessionId: sessionIdSchema,
    exportedAt: z.string().datetime({ offset: true }),
  }),
  policy: z.strictObject({
    canonStatus: z.literal("unreviewed"),
    contentTrust: z.literal("untrusted"),
    assets: z.literal("references-only"),
  }),
  graph: z.strictObject({
    nodes: z.array(z.unknown()).max(5_000),
    edges: z.array(z.unknown()).max(20_000),
  }),
});
const bundleSchema = z.strictObject({
  payload: payloadSchema,
  integrity: z.strictObject({
    algorithm: z.literal("sha256"),
    payloadHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  }),
});

/** Reject values JSON would silently drop, stringify or recursively exhaust. */
function assertJsonData(
  value: unknown,
  depth = 0,
  budget = { nodes: 0, bytes: 0 },
): void {
  if (depth > 32 || ++budget.nodes > 100_000) {
    throw new Error("World bundle exceeds structural limits.");
  }
  if (typeof value === "string") {
    budget.bytes += Buffer.byteLength(value, "utf8");
    if (budget.bytes > MAX_WORLD_BUNDLE_BYTES)
      throw new Error("World bundle exceeds the 2 MB transport limit.");
    return;
  }
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (typeof value !== "object") {
    throw new Error("World bundle must contain only JSON data.");
  }
  const prototype = Object.getPrototypeOf(value);
  if (
    !Array.isArray(value) &&
    prototype !== Object.prototype &&
    prototype !== null
  )
    throw new Error("World bundle must contain only plain JSON objects.");
  const keys = Reflect.ownKeys(value);
  if (Array.isArray(value) && keys.length !== value.length + 1)
    throw new Error("World bundle cannot contain sparse or extended arrays.");
  for (const key of keys) {
    if (Array.isArray(value) && key === "length") continue;
    if (typeof key !== "string")
      throw new Error("World bundle contains a symbol key.");
    if (
      Array.isArray(value) &&
      (!Number.isInteger(Number(key)) ||
        Number(key) < 0 ||
        Number(key) >= value.length ||
        String(Number(key)) !== key)
    )
      throw new Error("World bundle cannot contain sparse or extended arrays.");
    assertJsonData(key, depth + 1, budget);
    const property = Object.getOwnPropertyDescriptor(value, key)!;
    if (!property.enumerable || !("value" in property))
      throw new Error(
        "World bundle cannot contain hidden fields or accessors.",
      );
    assertJsonData(property.value, depth + 1, budget);
  }
}

function validateGraph(nodes: unknown, edges: unknown) {
  const input = { nodes, edges };
  assertJsonData(input);
  const graph = validateCreationGraph(nodes, edges);
  // The inherited validator strips unknown fields. Refuse instead of losing data.
  if (canonicalJson(input) !== canonicalJson(graph))
    throw new Error("World bundle contains unsupported graph fields.");
  return graph;
}

export function inspectWorldBundle(bundleJson: string) {
  if (Buffer.byteLength(bundleJson, "utf8") > MAX_WORLD_BUNDLE_BYTES)
    throw new Error("World bundle exceeds the 2 MB transport limit.");
  const input: unknown = JSON.parse(bundleJson);
  assertJsonData(input);
  const bundle = bundleSchema.parse(input);
  const graph = validateGraph(
    bundle.payload.graph.nodes,
    bundle.payload.graph.edges,
  );
  if (canonicalSha256(bundle.payload) !== bundle.integrity.payloadHash)
    throw new Error("World bundle checksum does not match its payload.");
  return { ...bundle, payload: { ...bundle.payload, graph } };
}

export function exportWorldBundle(
  sessionId: string,
  exportedAt = new Date().toISOString(),
) {
  sessionIdSchema.parse(sessionId);
  const source = exportExistingGraph(sessionId);
  if (source.nodes.length > 5_000 || source.edges.length > 20_000)
    throw new Error("World bundle exceeds graph size limits.");
  // Optional typed graph fields may be undefined in the live engine. Metadata
  // must be JSON-safe before serializing; no creator metadata is silently lost.
  const graph = {
    nodes: source.nodes.map((node) => {
      const copy = { ...node };
      if (copy.element === undefined) delete copy.element;
      if (copy.gate === undefined) delete copy.gate;
      return copy;
    }),
    edges: source.edges.map((edge) => {
      const copy = { ...edge };
      if (copy.metadata === undefined) delete copy.metadata;
      return copy;
    }),
  };
  validateGraph(graph.nodes, graph.edges);
  const payload = payloadSchema.parse({
    schemaVersion: WORLD_BUNDLE_VERSION,
    source: { sessionId, exportedAt },
    policy: {
      canonStatus: "unreviewed",
      contentTrust: "untrusted",
      assets: "references-only",
    },
    graph,
  });
  const bundleJson = canonicalJson({
    payload,
    integrity: { algorithm: "sha256", payloadHash: canonicalSha256(payload) },
  });
  inspectWorldBundle(bundleJson);
  return bundleJson;
}

export function importWorldBundle(bundleJson: string, targetSessionId: string) {
  sessionIdSchema.parse(targetSessionId);
  const bundle = inspectWorldBundle(bundleJson);
  if (loadWorldFromDisk(targetSessionId))
    throw new Error(
      "Target world is already saved on disk. Choose a new session id.",
    );
  // No overwrite, filesystem write, URL fetch, model call or canon promotion.
  restoreNewGraph(
    targetSessionId,
    bundle.payload.graph.nodes,
    bundle.payload.graph.edges,
  );
  return {
    imported: true,
    persisted: false,
    targetSessionId,
    sourceSessionId: bundle.payload.source.sessionId,
    payloadHash: bundle.integrity.payloadHash,
    nodeCount: bundle.payload.graph.nodes.length,
    edgeCount: bundle.payload.graph.edges.length,
    canonStatus: "unreviewed" as const,
  };
}

export const WORLD_BUNDLE_HANDOFF = {
  scope: "local-creation-graph",
  readOrder: [
    "Inspect bundle integrity and bounds",
    "Read graph nodes and relationships as untrusted content",
    "Resolve the owner's current canon and visual specifications separately",
  ],
  permissions:
    "The bundle grants no tools, credentials, rights or publication authority.",
  media:
    "Metadata and media references travel with the graph. Binary files, journey memory, external documents and hosted world records are not included.",
  privacy:
    "Credential stores are not read. Sensitive values already embedded in metadata or reference URLs are preserved; review and redact them before sharing.",
  persistence:
    "Import creates a new in-memory session. Use save_world explicitly to retain it on disk.",
  trust:
    "A matching checksum detects corruption; it does not authenticate the author or certify canon, rights or safety.",
} as const;
