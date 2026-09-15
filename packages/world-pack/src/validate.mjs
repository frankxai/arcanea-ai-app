// Structural validation, mirroring schema/worldpack.v1.schema.json with zero deps
// so it runs anywhere an agent runs. Same hand-rolled approach as @arcanea/world-sdk.
//
// Structure only. Canon legality is detectConflicts' job, not this one.

import {
  CANON_STATUSES,
  ENTITY_TYPES,
  LAYERS,
  PACK_FORMAT,
  RELATIONSHIP_KINDS,
  RIGHTS_STATES,
  VISIBILITIES,
} from "./model.mjs";

const WORLD_ID_RE = /^wld_[0-9A-HJKMNP-TV-Z]{26}$/;
const HASH_RE = /^sha256:[0-9a-f]{64}$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

export function validatePack(pack) {
  const errors = [];
  const req = (cond, msg) => {
    if (!cond) errors.push(msg);
  };

  req(pack && typeof pack === "object", "pack must be an object");
  if (!pack || typeof pack !== "object") return { valid: false, errors };

  req(pack.format === PACK_FORMAT, `format must be ${PACK_FORMAT}`);
  req(SEMVER_RE.test(pack.packVersion || ""), "packVersion must be semver x.y.z");
  req(pack.world && WORLD_ID_RE.test(pack.world.id || ""), "world.id must match wld_<26 Crockford base32>");
  req(typeof pack.world?.name === "string" && pack.world.name.length >= 2, "world.name must be at least 2 characters");
  req(typeof pack.world?.creatorRef === "string", "world.creatorRef is required");
  req(pack.canon && typeof pack.canon.document === "string", "canon.document is required");
  if (pack.canon?.sourceHash != null) req(HASH_RE.test(pack.canon.sourceHash), "canon.sourceHash must be sha256:<hex>");
  if (pack.digest != null) req(HASH_RE.test(pack.digest), "digest must be sha256:<hex>");

  const prov = pack.provenance || {};
  const branches = pack.branches || prov.branches || [];
  const versions = pack.versions || prov.versions || [];
  const sources = pack.sources || prov.sources || [];

  req(Array.isArray(pack.nodes) && pack.nodes.length > 0, "nodes must be a non-empty array");
  req(Array.isArray(pack.relationships), "relationships must be an array");
  req(branches.length > 0, "a pack must have at least one branch");
  req(versions.length > 0, "a pack must have at least one version");

  const ids = new Set();
  for (const node of pack.nodes || []) {
    const at = `node ${node?.id ?? "<no id>"}`;
    req(typeof node?.id === "string", `${at}: id is required`);
    req(!ids.has(node?.id), `${at}: duplicate id`);
    ids.add(node?.id);
    req(ENTITY_TYPES.includes(node?.type), `${at}: type must be one of ${ENTITY_TYPES.join(", ")}`);
    req(typeof node?.name === "string" && node.name.length > 0, `${at}: name is required`);
    req(LAYERS.includes(node?.layer), `${at}: layer must be one of ${LAYERS.join(", ")}`);
    const g = node?.governance;
    req(g && typeof g === "object", `${at}: governance envelope is required`);
    if (!g) continue;
    req(typeof g.owner === "string" && g.owner.length > 0, `${at}: governance.owner is required`);
    req(VISIBILITIES.includes(g.visibility), `${at}: governance.visibility invalid`);
    req(CANON_STATUSES.includes(g.canonStatus), `${at}: governance.canonStatus invalid`);
    req(RIGHTS_STATES.includes(g.rights?.state), `${at}: governance.rights.state invalid`);
    req(typeof g.evalRule === "string" && g.evalRule.length > 0, `${at}: governance.evalRule is required`);
    if (node.provenance?.promptHash != null) req(HASH_RE.test(node.provenance.promptHash), `${at}: provenance.promptHash must be sha256:<hex>`);
  }

  for (const rel of pack.relationships || []) {
    const at = `relationship ${rel?.id ?? "<no id>"}`;
    req(typeof rel?.id === "string", `${at}: id is required`);
    req(RELATIONSHIP_KINDS.includes(rel?.kind), `${at}: kind must be one of ${RELATIONSHIP_KINDS.join(", ")}`);
    req(typeof rel?.from === "string" && typeof rel?.to === "string", `${at}: from and to are required`);
    if (rel?.strength != null) req(rel.strength >= 0 && rel.strength <= 1, `${at}: strength must be 0..1`);
    req(rel?.governance && typeof rel.governance === "object", `${at}: governance envelope is required`);
  }

  for (const v of versions) {
    const at = `version ${v?.id ?? "<no id>"}`;
    req(typeof v?.branch === "string", `${at}: branch is required`);
    req(Array.isArray(v?.parents), `${at}: parents must be an array`);
    req(typeof v?.createdAt === "string" && v.createdAt.length > 0, `${at}: createdAt is required`);
    if (v?.digest != null) req(HASH_RE.test(v.digest), `${at}: digest must be sha256:<hex>`);
  }

  for (const s of sources) req(typeof s?.id === "string" && typeof s?.kind === "string", `source ${s?.id ?? "<no id>"}: id and kind are required`);
  for (const b of branches) req(typeof b?.id === "string" && typeof b?.name === "string", `branch ${b?.id ?? "<no id>"}: id and name are required`);

  return { valid: errors.length === 0, errors };
}
