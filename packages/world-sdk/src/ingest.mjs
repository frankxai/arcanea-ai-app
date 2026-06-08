// Ingest — the external-tool (ChatGPT/Midjourney/…) → canon gate.
// Loose character JSON + an image become a conforming characters/ doc plus a
// content-addressed asset, validated against the world's own manifest.

import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { slugify } from "./manifest.mjs";
import { writeFiles } from "./fs-world.mjs";
import { validateManifest } from "./validate.mjs";
import { MANIFEST_FILE } from "./manifest.mjs";
import { commitWorld } from "./harness.mjs";

const PERSONA_KEYS = ["persona", "description", "bio", "about", "summary"];
const BACKSTORY_KEYS = ["backstory", "history", "origin"];

function firstOf(input, keys) {
  for (const k of keys) {
    const v = input[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/** Map a loose/arbitrary character object to the standard character shape. */
export function normalizeCharacter(input) {
  if (!input || typeof input !== "object") throw new Error("ingest: character input must be an object");
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) throw new Error("ingest: character requires a 'name'");
  return {
    name,
    role: typeof input.role === "string" && input.role.trim() ? input.role.trim() : undefined,
    element: typeof input.element === "string" && input.element.trim() ? input.element.trim() : undefined,
    persona: firstOf(input, PERSONA_KEYS),
    backstory: firstOf(input, BACKSTORY_KEYS),
  };
}

async function readImageBytes(image) {
  if (Buffer.isBuffer(image) || image instanceof Uint8Array) return Buffer.from(image);
  if (typeof image === "string") {
    try {
      return await fs.readFile(image);
    } catch {
      return Buffer.from(image, "utf8"); // treat as raw string bytes
    }
  }
  throw new Error("ingest: image must be a Buffer, Uint8Array, or filepath/string");
}

function characterDoc(c) {
  return `---
name: ${c.name}
role: ${c.role || "inhabitant"}
${c.element ? `element: ${c.element}\n` : ""}${c.portrait ? `portrait: ${c.portrait}\n` : ""}visibility: public
canonLevel: 1
---

# ${c.name}

${c.persona || ""}

## Backstory
${c.backstory || ""}
`;
}

/**
 * Conform a loose character + optional image into the world, validate against canon.
 * @param {{dir:string, input:object, image?:Buffer|Uint8Array|string, imageName?:string, commit?:boolean}} opts
 * @returns {Promise<{characterFile:string, assetFile:string|null, warnings:string[], character:object}>}
 */
export async function ingestCharacter({ dir, input, image, imageName, commit = false }) {
  const character = normalizeCharacter(input);
  const slug = slugify(character.name);
  const warnings = [];

  const characterFile = `characters/${slug}.md`;
  let existed = false;
  try {
    await fs.access(path.join(dir, characterFile));
    existed = true;
  } catch {}
  if (existed) warnings.push(`character '${slug}' already exists — overwriting ${characterFile}`);

  let assetFile = null;
  if (image != null) {
    const bytes = await readImageBytes(image);
    const hash8 = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
    const ext = (imageName && path.extname(imageName)) || ".png";
    assetFile = `assets/characters/${slug}-${hash8}${ext}`;
    character.portrait = assetFile;
    await writeFiles(dir, [{ path: assetFile, bytes }]);
  }

  await writeFiles(dir, [{ path: characterFile, bytes: characterDoc(character) }]);

  const manifestPath = path.join(dir, MANIFEST_FILE);
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {
    throw new Error(`ingest: no ${MANIFEST_FILE} found in ${dir} — not a world repo`);
  }
  const { valid, errors } = validateManifest(manifest);
  if (!valid) throw new Error("ingest: world manifest invalid:\n - " + errors.join("\n - "));

  if (commit) await commitWorld(dir, `ingest: ${character.name}`);

  return { characterFile, assetFile, warnings, character };
}
