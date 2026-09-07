// WorldPack.v1 — the typed vocabulary.
//
// 21 addressable kinds, resolved into four families so nothing is both an
// enum and a node at once:
//   14 entity nodes  — Universe World Era Location Faction Character Creature
//                      Object Law Power Event Scene Artifact Creator
//    1 edge           — Relationship
//    4 governance     — Branch Version Source AgentRole
//    2 enums          — RightsState CanonStatus
//
// Every entity node carries a governance envelope: owner, provenance (Source),
// version, branch, visibility, canonStatus, rights, and an evaluation rule.

export const PACK_FORMAT = "WorldPack.v1";
export const PACK_VERSION = "1.0.0";

/** Interop with @arcanea/world-sdk's world.arcanea.json standard. Explicit, versioned, not forked. */
export const WORLD_SDK_INTEROP = {
  standard: "world.arcanea.json",
  schemaVersion: "1.0.0",
  contentHashFormat: "sha256:<hex>",
  idPrefixes: { world: "wld_" },
};

export const ENTITY_TYPES = Object.freeze([
  "Universe",
  "World",
  "Era",
  "Location",
  "Faction",
  "Character",
  "Creature",
  "Object",
  "Law",
  "Power",
  "Event",
  "Scene",
  "Artifact",
  "Creator",
]);

export const EDGE_TYPES = Object.freeze(["Relationship"]);
export const GOVERNANCE_TYPES = Object.freeze(["Branch", "Version", "Source", "AgentRole"]);
export const ENUM_TYPES = Object.freeze(["RightsState", "CanonStatus"]);

/** All 21 kinds the format addresses. */
export const NODE_KINDS = Object.freeze([
  ...ENTITY_TYPES,
  ...EDGE_TYPES,
  ...GOVERNANCE_TYPES,
  ...ENUM_TYPES,
]);

/**
 * Ownership layers. These are the separation the product depends on: Arcanea's
 * own canon can never be silently rewritten by a user world, a licensed asset
 * can never be re-licensed downstream, and a model draft is never canon.
 */
export const LAYERS = Object.freeze([
  "canon", // Arcanea-owned, sourced from CANON_LOCKED.md
  "user", // creator-owned world content
  "licensed", // inbound asset used under a named licence
  "generated", // model output, not yet reviewed by a human
  "contributed", // public contribution, rights assigned on accept
]);

export const RIGHTS_STATES = Object.freeze([
  "arcanea-owned",
  "creator-owned",
  "licensed",
  "community-contributed",
  "unresolved",
]);

/** Mirrors the ✅ / ⏳ / 🔧 vocabulary CANON_LOCKED.md already uses. */
export const CANON_STATUSES = Object.freeze([
  "locked",
  "staging",
  "evolving",
  "draft",
  "non-canon",
  "rejected",
]);

export const VISIBILITIES = Object.freeze(["public", "unlisted", "private"]);

export const RELATIONSHIP_KINDS = Object.freeze([
  "part_of",
  "located_at",
  "member_of",
  "bonded_to",
  "guards",
  "opposes",
  "allies_with",
  "wields",
  "created_by",
  "derived_from",
  "occurs_in",
  "precedes",
  "governed_by",
  "echoes", // Mirror-Realm resonance (Tier 11), not identity
]);

/** Which layer→canonStatus pairs are legal. A user world cannot mint locked canon. */
export const LAYER_STATUS_MATRIX = Object.freeze({
  canon: ["locked", "staging", "evolving"],
  user: ["draft", "non-canon", "evolving"],
  licensed: ["non-canon", "draft"],
  generated: ["draft"],
  contributed: ["draft", "non-canon", "rejected"],
});

/** Rights states a layer may legally claim. */
export const LAYER_RIGHTS_MATRIX = Object.freeze({
  canon: ["arcanea-owned"],
  user: ["creator-owned"],
  licensed: ["licensed"],
  generated: ["creator-owned", "unresolved"],
  contributed: ["community-contributed", "unresolved"],
});

export function isEntityType(t) {
  return ENTITY_TYPES.includes(t);
}

/** Stable JSON: sorted keys, so a content hash means something. */
export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value === undefined ? null : value);
}
