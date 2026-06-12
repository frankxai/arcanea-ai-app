// Hand-rolled validator mirroring schemas/world.arcanea.schema.json — zero deps so it
// runs anywhere an agent or the index does. Keep in sync with the JSON Schema.

const ID_RE = /^wld_[0-9A-HJKMNP-TV-Z]{26}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const MOODS = new Set(["fantasy", "sci-fi", "horror", "steampunk", "mythological", "cosmic", "other"]);
const VIS = new Set(["public", "unlisted", "private"]);
const HOSTING = new Set(["repo", "hosted_private", "hosted_public"]);
const HARNESSES = new Set(["claude", "codex", "gemini", "antigravity", "grok", "any"]);

/** @returns {{valid:boolean, errors:string[]}} */
export function validateManifest(m) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(msg); };

  req(m && typeof m === "object", "manifest must be an object");
  if (!m || typeof m !== "object") return { valid: false, errors: e };

  req(SEMVER_RE.test(m.schemaVersion || ""), "schemaVersion must be semver x.y.z");
  req(ID_RE.test(m.id || ""), "id must match wld_<26 Crockford base32>");
  req(typeof m.name === "string" && m.name.length >= 2 && m.name.length <= 80, "name must be 2..80 chars");
  req(m.creator && typeof m.creator.handle === "string", "creator.handle is required");
  req(m.content && typeof m.content === "object", "content (section pointers) is required");

  if (m.slug != null) req(SLUG_RE.test(m.slug), "slug must be kebab-case");
  if (m.mood != null) req(MOODS.has(m.mood), `mood must be one of ${[...MOODS].join(", ")}`);
  if (m.visibility != null) req(VIS.has(m.visibility), "visibility must be public|unlisted|private");
  if (m.hosting != null) req(HOSTING.has(m.hosting), "hosting must be repo|hosted_private|hosted_public");
  if (Array.isArray(m.laws)) req(m.laws.length <= 7, "laws: max 7");

  if (m.license != null) req(typeof m.license.spdx === "string" && m.license.spdx.length > 0, "license.spdx is required when license is present");

  if (m.royalty && Array.isArray(m.royalty.splits) && m.royalty.splits.length) {
    let sum = 0;
    for (const s of m.royalty.splits) {
      req(s && typeof s.to === "string", "royalty split needs a 'to'");
      req(Number.isInteger(s?.bps) && s.bps >= 0 && s.bps <= 10000, "royalty split bps must be 0..10000");
      sum += s?.bps || 0;
    }
    req(sum === 10000, `royalty splits must sum to 10000 bps (got ${sum})`);
  }

  if (Array.isArray(m.agents)) {
    for (const a of m.agents) {
      req(a && typeof a.id === "string", "agent needs id");
      req(a && HARNESSES.has(a.harness), `agent.harness must be one of ${[...HARNESSES].join(", ")}`);
      req(a && typeof a.role === "string", "agent needs role");
    }
  }

  if (Array.isArray(m.provenance)) {
    for (const p of m.provenance) {
      req(/^sha256:[0-9a-f]{64}$/.test(p?.contentHash || ""), "provenance.contentHash must be sha256:<hex>");
      req(["solana", "polygon", "base", "other"].includes(p?.chain), "provenance.chain invalid");
      req(typeof p?.timestamp === "string" && p.timestamp.length > 0, "provenance.timestamp required");
    }
  }

  return { valid: e.length === 0, errors: e };
}
