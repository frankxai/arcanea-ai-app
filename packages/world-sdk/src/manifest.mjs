// Manifest primitives for the Arcanea World Repo Standard.
// See arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md + schemas/world.arcanea.schema.json.

import { createHash } from "node:crypto";

export const SCHEMA_VERSION = "1.0.0";
export const MANIFEST_FILE = "world.arcanea.json";
export const SCHEMA_URL = "https://arcanea.ai/schemas/world.arcanea.schema.json";

// Crockford base32 (no I, L, O, U) — matches the ULID alphabet the schema id pattern expects.
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Deterministic ULID-shaped world id derived from a seed (so scaffolds are reproducible). */
export function worldId(seed) {
  const digest = createHash("sha256").update(String(seed)).digest();
  let out = "";
  for (let i = 0; i < 26; i++) out += CROCKFORD[digest[i] & 31];
  return `wld_${out}`;
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "world";
}

export const DEFAULT_CONTENT = {
  canon: "canon/",
  characters: "characters/",
  locations: "locations/",
  quests: "quests/",
  books: "books/",
  media: "media/",
  agents: "agents/",
};

/** Build a full manifest object from a partial spec, filling standard defaults. */
export function buildManifest(spec) {
  const name = spec.name || "Untitled World";
  const seed = spec.idSeed || spec.genesisPrompt || name;
  return {
    $schema: SCHEMA_URL,
    schemaVersion: SCHEMA_VERSION,
    id: spec.id || worldId(seed),
    slug: spec.slug || slugify(name),
    name,
    tagline: spec.tagline || "",
    genesisPrompt: spec.genesisPrompt || "",
    premise: spec.premise || "",
    laws: spec.laws || [],
    mood: spec.mood || "fantasy",
    visualDna: spec.visualDna || { palette: [], style: "", motifs: [] },
    theme: spec.theme || { audio: "", prompt: "" },
    cover: spec.cover || "",
    creator: spec.creator || { handle: "anon" },
    license: spec.license || {
      spdx: "CC-BY-4.0",
      pointer: "licenses/LICENSE.md",
      commercial: true,
      remix: "allow-attribution",
    },
    royalty: spec.royalty || {
      policy: "licenses/royalty.json",
      splits: [
        { to: "creator", bps: 9000 },
        { to: "arcanea", bps: 1000 },
      ],
    },
    content: { ...DEFAULT_CONTENT, ...(spec.content || {}) },
    agents: spec.agents || [],
    index: spec.index || { embeddingModel: "gemini-text-embedding-004", dim: 768 },
    provenance: spec.provenance || [],
    visibility: spec.visibility || "public",
    hosting: spec.hosting || "repo",
    snapshot: spec.snapshot || {},
  };
}

/** Fields excluded from the content hash because they mutate after content is fixed. */
export const VOLATILE_MANIFEST_KEYS = ["provenance", "snapshot"];

/** A canonical manifest copy for hashing — volatile + claim-time fields stripped. */
export function canonicalManifestForHash(manifest) {
  const m = structuredClone(manifest);
  for (const k of VOLATILE_MANIFEST_KEYS) delete m[k];
  if (m.creator) delete m.creator.wallet; // filled invisibly at claim time
  return m;
}
