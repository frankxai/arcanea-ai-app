// Read only declared world sources; writes require a caller-owned stable tree.

import { promises as fs } from "node:fs";
import path from "node:path";
import { MANIFEST_FILE } from "./manifest.mjs";
import {
  checkedRoot,
  checkedPath,
  relativePath,
  uniquePaths,
  boundaryError,
} from "./world-paths.mjs";
import { declarations, sourcePath } from "./source-files.mjs";
import { metadataForFile } from "./frontmatter.mjs";
export { parseFrontmatter } from "./frontmatter.mjs";

async function walk(dir, rel, paths) {
  const checked = await checkedPath(dir, rel, { kind: "directory" });
  for (const entry of await fs.readdir(checked.target, {
    withFileTypes: true,
  })) {
    const p = `${rel}/${entry.name}`;
    relativePath(p);
    if (!sourcePath(p)) continue;
    if (entry.isSymbolicLink())
      throw boundaryError("Declared source contains a link.");
    if (entry.isDirectory()) await walk(dir, p, paths);
    else {
      await checkedPath(dir, p);
      paths.add(p);
    }
  }
}

/** Read a world dir into { dir, manifest, files:[{path, bytes, isText, visibility}] }. */
export async function readWorld(dir) {
  const { target } = await checkedPath(dir, MANIFEST_FILE);
  const manifest = JSON.parse(await fs.readFile(target, "utf8"));
  const declared = declarations(manifest);
  const paths = new Set();
  for (const d of declared) {
    const abs = path.join(dir, d.path);
    let stat;
    try {
      stat = await fs.lstat(abs);
    } catch (error) {
      if (error.code === "ENOENT" && !d.required) continue;
      throw error;
    }
    if (stat.isDirectory()) {
      if (d.required) throw boundaryError("File pointer names a directory.");
      await walk(dir, d.path, paths);
    } else {
      await checkedPath(dir, d.path);
      paths.add(d.path);
    }
  }
  const files = [];
  for (const p of [...paths].sort()) {
    const safe = await checkedPath(dir, p);
    const bytes = await fs.readFile(safe.target);
    const isText = /\.(md|mdx|json|txt|ya?ml|mjs|js|ts|csv|svg)$/i.test(p);
    const data = metadataForFile({ path: p, bytes });
    files.push({
      path: p,
      bytes,
      isText,
      visibility: data.visibility ?? "public",
    });
  }
  return { dir, manifest, files };
}

function forbidLocked(file) {
  if (
    path.posix.basename(file.path).toUpperCase() === "CANON_LOCKED.MD" ||
    metadataForFile(file).status?.toUpperCase() === "LOCKED"
  ) {
    const error = new Error(
      "SDK writes cannot create or replace locked canon.",
    );
    error.code = "CANON_PROMOTION_REQUIRES_REVIEW";
    throw error;
  }
}

export async function prepareWrites(dir, files, { exclusive = false } = {}) {
  if (!Array.isArray(files))
    throw boundaryError("World writes must be a file array.");
  uniquePaths(files.map((f) => f.path));
  await checkedRoot(dir);
  const prepared = [];
  for (const f of files) {
    const bytes = typeof f.bytes === "string" ? f.bytes : Buffer.from(f.bytes);
    forbidLocked({ ...f, bytes });
    const safe = await checkedPath(dir, f.path, { exclusive });
    if (safe.exists)
      forbidLocked({ path: f.path, bytes: await fs.readFile(safe.target) });
    prepared.push({ path: f.path, bytes });
  }
  return prepared;
}

export async function writeFiles(dir, files, { exclusive = false } = {}) {
  const prepared = await prepareWrites(dir, files, { exclusive });
  for (const file of prepared) {
    let safe = await checkedPath(dir, file.path, { exclusive });
    await fs.mkdir(path.dirname(safe.target), { recursive: true });
    safe = await checkedPath(dir, file.path, { exclusive });
    if (safe.exists)
      forbidLocked({ path: file.path, bytes: await fs.readFile(safe.target) });
    await fs.writeFile(safe.target, file.bytes, {
      flag: exclusive ? "wx" : "w",
    });
  }
}

export async function writeManifest(dir, manifest, opts = {}) {
  declarations(manifest);
  await writeFiles(
    dir,
    [{ path: MANIFEST_FILE, bytes: JSON.stringify(manifest, null, 2) + "\n" }],
    opts,
  );
}
