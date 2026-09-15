// WorldPack construction, hashing, and portable export.

import { createHash } from "node:crypto";
import {
  PACK_FORMAT,
  PACK_VERSION,
  WORLD_SDK_INTEROP,
  canonicalize,
  isEntityType,
} from "./model.mjs";
import { verifyAgentRoles } from "./guardians.mjs";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Deterministic, world-sdk-shaped id. Same alphabet, so ids interoperate. */
export function deterministicId(prefix, seed) {
  const digest = createHash("sha256").update(`${prefix}:${seed}`).digest();
  let out = "";
  for (let i = 0; i < 26; i++) out += CROCKFORD[digest[i] & 31];
  return `${prefix}_${out}`;
}

export function contentHash(value) {
  return `sha256:${createHash("sha256").update(canonicalize(value)).digest("hex")}`;
}

export function countNodes(nodes) {
  return (nodes || []).reduce(
    (acc, n) => ({ ...acc, [n.type]: (acc[n.type] || 0) + 1 }),
    {},
  );
}

/**
 * Hash of everything the pack asserts, except its own signature.
 *
 * The ownership ledger is INSIDE the signature: who authored each version, what
 * each source cites, which branch heads exist, which agent roles hold authority,
 * and how many nodes of each type there are. Only `digest` and `exportedAt` sit
 * outside it. A file sold as "every node owned, sourced, versioned" cannot leave
 * the ownership record unsigned.
 *
 * Reads either shape: a working pack keeps its ledgers top level, an exported one
 * nests them under `provenance`.
 */
export function packDigest(pack) {
  const p = pack.provenance || {};
  const branches = pack.branches ?? p.branches ?? [];
  return contentHash({
    format: pack.format ?? null,
    packVersion: pack.packVersion ?? null,
    interop: pack.interop ?? null,
    world: pack.world,
    canon: {
      document: pack.canon?.document ?? null,
      sourceHash: pack.canon?.sourceHash ?? null,
    },
    nodes: pack.nodes,
    relationships: pack.relationships,
    provenance: {
      sources: pack.sources ?? p.sources ?? [],
      branches,
      versions: pack.versions ?? p.versions ?? [],
      head: p.head ?? branches.find((b) => b.id === "main")?.head ?? null,
    },
    agentRoles: pack.agentRoles ?? [],
    counts: pack.counts ?? countNodes(pack.nodes),
  });
}

/**
 * @param {object} spec
 * @param {string} spec.name
 * @param {{id?:string, handle:string, displayName?:string}} spec.creator
 * @param {string} [spec.premise]
 * @param {string} [spec.canonSourceHash] hash of the CANON_LOCKED.md this world binds to
 */
export function createWorldSeed(spec) {
  const now = spec.createdAt || "1970-01-01T00:00:00.000Z";
  const worldId = spec.worldId || deterministicId("wld", spec.name);
  const creatorId =
    spec.creator.id || deterministicId("crt", spec.creator.handle);
  const sourceId = deterministicId("src", `${worldId}:seed`);
  const branchId = "main";
  const versionId = deterministicId("ver", `${worldId}:1`);

  const source = {
    id: sourceId,
    kind: "creator-input",
    uri: null,
    citation: `World seed authored by @${spec.creator.handle}`,
    retrievedAt: now,
  };

  const gov = (nodeSeed) => ({
    owner: creatorId,
    sourceRef: sourceId,
    versionRef: versionId,
    branchRef: branchId,
    visibility: spec.visibility || "private",
    canonStatus: "draft",
    rights: {
      state: "creator-owned",
      spdx: spec.spdx || "CC-BY-4.0",
      commercial: true,
      attribution: true,
    },
    evalRule: nodeSeed.evalRule || "canon-conflict-clean",
  });

  const universe = {
    id: deterministicId("uni", "arcanea"),
    type: "Universe",
    name: "Arcanea",
    layer: "canon",
    attributes: { canonDocument: ".arcanea/lore/CANON_LOCKED.md" },
    governance: {
      owner: "arcanea",
      sourceRef: sourceId,
      versionRef: versionId,
      branchRef: branchId,
      visibility: "public",
      canonStatus: "locked",
      rights: {
        state: "arcanea-owned",
        spdx: null,
        commercial: false,
        attribution: true,
      },
      evalRule: "canon-immutable",
    },
  };

  const world = {
    id: worldId,
    type: "World",
    name: spec.name,
    layer: "user",
    attributes: { premise: spec.premise || "", mood: spec.mood || "fantasy" },
    governance: gov({}),
  };

  const creator = {
    id: creatorId,
    type: "Creator",
    name: spec.creator.displayName || spec.creator.handle,
    layer: "user",
    attributes: { handle: spec.creator.handle },
    governance: gov({}),
  };

  return {
    format: PACK_FORMAT,
    packVersion: PACK_VERSION,
    interop: WORLD_SDK_INTEROP,
    world: {
      id: worldId,
      name: spec.name,
      slug: slugify(spec.name),
      creatorRef: creatorId,
    },
    canon: {
      document: ".arcanea/lore/CANON_LOCKED.md",
      sourceHash: spec.canonSourceHash || null,
    },
    nodes: [universe, world, creator],
    relationships: [
      {
        id: deterministicId("rel", `${worldId}:part_of:${universe.id}`),
        type: "Relationship",
        kind: "part_of",
        from: worldId,
        to: universe.id,
        strength: 1,
        governance: gov({}),
      },
    ],
    branches: [
      {
        id: branchId,
        type: "Branch",
        name: "main",
        parent: null,
        head: versionId,
        owner: creatorId,
        createdAt: now,
      },
    ],
    versions: [
      {
        id: versionId,
        type: "Version",
        branch: branchId,
        parents: [],
        createdAt: now,
        createdBy: creatorId,
        message: "world seed",
        digest: null,
      },
    ],
    sources: [source],
    agentRoles: [],
  };
}

export function slugify(name) {
  return (
    String(name)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "world"
  );
}

/** Insert an entity node, filling the governance envelope from a template node. */
export function addNode(pack, node, { governanceFrom } = {}) {
  if (!isEntityType(node.type))
    throw new TypeError(`unknown entity type: ${node.type}`);
  const template = governanceFrom
    ? pack.nodes.find((n) => n.id === governanceFrom)
    : pack.nodes.find((n) => n.type === "World");
  const governance = node.governance || {
    ...template.governance,
    canonStatus: "draft",
  };
  const next = { ...node, governance };
  return { ...pack, nodes: [...pack.nodes, next] };
}

export function addRelationship(pack, rel) {
  const world = pack.nodes.find((n) => n.type === "World");
  const governance = rel.governance || {
    ...world.governance,
    canonStatus: "draft",
  };
  return {
    ...pack,
    relationships: [
      ...pack.relationships,
      { type: "Relationship", strength: 1, ...rel, governance },
    ],
  };
}

/**
 * Commit the working pack as a new Version on its current branch.
 * Provenance is the point: every version records who, when, from what, and the digest.
 */
export function commit(
  pack,
  { branch = "main", message, by, at = "1970-01-01T00:00:00.000Z" },
) {
  const head = pack.branches.find((b) => b.id === branch);
  if (!head) throw new Error(`no such branch: ${branch}`);
  const versionId = deterministicId(
    "ver",
    `${pack.world.id}:${branch}:${pack.versions.length + 1}`,
  );
  const version = {
    id: versionId,
    type: "Version",
    branch,
    parents: head.head ? [head.head] : [],
    createdAt: at,
    createdBy: by,
    message,
    digest: packDigest(pack),
  };
  return {
    ...pack,
    versions: [...pack.versions, version],
    branches: pack.branches.map((b) =>
      b.id === branch ? { ...b, head: versionId } : b,
    ),
  };
}

/**
 * Portable export. This is the activation artifact: one file a stranger can read
 * and verify — every node owned, sourced, versioned, and rights-stated.
 */
export function exportPack(
  pack,
  { exportedAt = "1970-01-01T00:00:00.000Z" } = {},
) {
  const digest = packDigest(pack);
  const counts = countNodes(pack.nodes);
  return {
    format: PACK_FORMAT,
    packVersion: PACK_VERSION,
    interop: WORLD_SDK_INTEROP,
    exportedAt,
    digest,
    world: pack.world,
    canon: pack.canon,
    provenance: {
      sources: pack.sources,
      branches: pack.branches,
      versions: pack.versions,
      head: pack.branches.find((b) => b.id === "main")?.head ?? null,
    },
    counts,
    nodes: pack.nodes,
    relationships: pack.relationships,
    agentRoles: pack.agentRoles,
  };
}

/**
 * Verify an exported pack has not been edited since export.
 *
 * Three independent checks, because the digest alone is only as honest as what it
 * covers: the signature over the whole pack, the declared counts against the real
 * nodes, and the agent roles against the Guardian definitions in code.
 */
export function verifyExport(exported) {
  const recomputed = packDigest(exported);
  const digestOk = recomputed === exported.digest;
  const counts = countNodes(exported.nodes);
  const countsOk = canonicalize(counts) === canonicalize(exported.counts ?? {});
  const agentRoleProblems = verifyAgentRoles(exported.agentRoles);
  return {
    valid: digestOk && countsOk && agentRoleProblems.length === 0,
    digestOk,
    countsOk,
    agentRolesOk: agentRoleProblems.length === 0,
    expected: exported.digest,
    actual: recomputed,
    countsDeclared: exported.counts ?? null,
    countsActual: counts,
    agentRoleProblems,
  };
}
