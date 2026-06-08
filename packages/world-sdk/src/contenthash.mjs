// Content addressing — a world is provable before any blockchain touches it.
// contentHash = sha256 over a deterministic manifest of PUBLIC files only.

import { createHash } from "node:crypto";
import { MANIFEST_FILE, canonicalManifestForHash } from "./manifest.mjs";

const TEXT_EXT = new Set([".md", ".mdx", ".json", ".txt", ".yml", ".yaml", ".mjs", ".js", ".ts", ".csv", ".svg"]);

/** Stable JSON: object keys sorted recursively, so the hash is reproducible across machines. */
export function canonicalJson(value) {
  return JSON.stringify(sortDeep(value));
}

function sortDeep(v) {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v)
        .sort()
        .map((k) => [k, sortDeep(v[k])]),
    );
  }
  return v;
}

function sha256hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function isTextPath(p) {
  const dot = p.lastIndexOf(".");
  return dot >= 0 && TEXT_EXT.has(p.slice(dot).toLowerCase());
}

function toBytes(file) {
  const raw = typeof file.bytes === "string" ? Buffer.from(file.bytes, "utf8") : Buffer.from(file.bytes);
  if (isTextPath(file.path)) {
    return Buffer.from(raw.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
  }
  return raw;
}

function isExcluded(p) {
  return (
    p === MANIFEST_FILE ||
    p.startsWith(".arcanea/") ||
    p.includes("node_modules/") ||
    p.startsWith(".git/") ||
    p.startsWith("dist/")
  );
}

/**
 * @param {{path:string, bytes:Buffer|Uint8Array|string, visibility?:string}[]} files
 * @param {object} manifest
 * @returns {string} "sha256:<hex>"
 */
export function contentHash(files, manifest) {
  const entries = [];
  for (const f of files) {
    if (isExcluded(f.path)) continue;
    if ((f.visibility || "public") !== "public") continue;
    entries.push([f.path, sha256hex(toBytes(f))]);
  }
  // The manifest's stable core participates, minus volatile/claim-time fields.
  entries.push([
    `${MANIFEST_FILE}::canonical`,
    sha256hex(Buffer.from(canonicalJson(canonicalManifestForHash(manifest)), "utf8")),
  ]);
  entries.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return `sha256:${sha256hex(Buffer.from(canonicalJson(entries), "utf8"))}`;
}
