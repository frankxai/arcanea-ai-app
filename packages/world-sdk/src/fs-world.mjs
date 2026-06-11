// Read/write a world as a folder on disk. The folder IS the source of truth.

import { promises as fs } from "node:fs";
import path from "node:path";
import { MANIFEST_FILE } from "./manifest.mjs";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".turbo", ".next"]);

/** Minimal frontmatter reader — only the fields the standard cares about. */
export function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line.trim());
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { data, body: text.slice(m[0].length) };
}

async function walk(root, rel = "") {
  const out = [];
  const dir = path.join(root, rel);
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      out.push(...(await walk(root, path.join(rel, ent.name))));
    } else if (ent.isFile()) {
      out.push(path.join(rel, ent.name).split(path.sep).join("/"));
    }
  }
  return out;
}

/** Read a world dir into { dir, manifest, files:[{path, bytes, isText, visibility}] }. */
export async function readWorld(dir) {
  const manifestRaw = await fs.readFile(path.join(dir, MANIFEST_FILE), "utf8");
  const manifest = JSON.parse(manifestRaw);
  const paths = await walk(dir);
  const files = [];
  for (const p of paths) {
    const bytes = await fs.readFile(path.join(dir, p));
    const isText = /\.(md|mdx|json|txt|ya?ml|mjs|js|ts|csv|svg)$/i.test(p);
    let visibility = "public";
    if (isText && /\.(md|mdx)$/i.test(p)) {
      const { data } = parseFrontmatter(bytes.toString("utf8"));
      if (data.visibility) visibility = data.visibility;
    }
    files.push({ path: p, bytes, isText, visibility });
  }
  return { dir, manifest, files };
}

export async function writeManifest(dir, manifest) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, MANIFEST_FILE), JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

/** Write a set of files (relative paths) under dir, creating folders as needed. */
export async function writeFiles(dir, files) {
  for (const f of files) {
    const abs = path.join(dir, f.path);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    const data = typeof f.bytes === "string" ? f.bytes : Buffer.from(f.bytes);
    await fs.writeFile(abs, data);
  }
}
