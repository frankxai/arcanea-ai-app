// Read/write a world as a folder on disk. The folder IS the source of truth.

import { constants, promises as fs } from "node:fs";
import path from "node:path";
import { MANIFEST_FILE } from "./manifest.mjs";

import {
  pathError,
  safeRelative,
  existing,
  directory,
  regularFile,
  destination,
} from "./world-paths.mjs";
import { readRoot, readFile, readDirectory } from "./world-reads.mjs";
import {
  declarations,
  sourcePath,
  sourceMetadata,
  uniqueSourcePaths,
} from "./source-files.mjs";

/** Minimal frontmatter reader — only the fields the standard cares about. */
export function parseFrontmatter(text) {
  text = text.replace(/^\uFEFF+/, "").replace(/\r\n/g, "\n");
  const m = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split("\n")) {
    const trimmed = line.trim();
    const colon = trimmed.indexOf(":");
    const key = trimmed.slice(0, colon);
    if (colon < 1 || !/^[A-Za-z0-9_]+$/.test(key)) continue;
    // Split once: overlapping whitespace/value regexes can backtrack quadratically.
    const value = trimmed.slice(colon + 1).trimStart();
    if (/[\r\u2028\u2029]/.test(value)) continue;
    data[key] = value.replace(/^["']|["']$/g, "");
  }
  return { data, body: text.slice(m[0].length) };
}

async function declaredFiles(root, relative) {
  safeRelative(relative);
  const checked = await destination(root, relative, false, "any");
  if (!checked.entry) return [];
  if (checked.entry.isFile()) return [relative];
  const out = [];
  for (const name of await readDirectory(root, relative)) {
    const child = `${relative}/${name}`;
    if (!sourcePath(child)) continue;
    out.push(...(await declaredFiles(root, child)));
  }
  return out;
}

/** Read only declared creator sources, without Git or private tooling traversal. */
export async function readWorld(dir) {
  const root = await readRoot(dir);
  const manifestRaw = await readFile(root, MANIFEST_FILE);
  let manifest;
  try {
    manifest = JSON.parse(manifestRaw.toString("utf8").replace(/^\uFEFF/, ""));
  } catch {
    throw Object.assign(new Error("World manifest is not valid JSON."), {
      code: "ERR_ARCANEA_WORLD_MANIFEST",
    });
  }
  const paths = new Set();
  for (const selected of declarations(manifest)) {
    for (const file of await declaredFiles(root, selected.path))
      paths.add(file);
  }
  const selected = [...paths].sort();
  uniqueSourcePaths(selected);
  const files = [];
  for (const relative of selected) {
    const bytes = await readFile(root, relative);
    const file = {
      path: relative,
      bytes,
      isText: /\.(md|mdx|json|txt|ya?ml|mjs|js|ts|csv|svg)$/i.test(relative),
    };
    const metadata = sourceMetadata(file);
    files.push({ ...file, visibility: metadata.visibility });
  }
  return { dir: root, manifest, files };
}

export async function writeManifest(dir, manifest) {
  await writeFiles(dir, [
    { path: MANIFEST_FILE, bytes: JSON.stringify(manifest, null, 2) + "\n" },
  ]);
}

function alreadyExists() {
  return Object.assign(
    new Error("Exclusive world write cannot replace an existing file."),
    { code: "EEXIST" },
  );
}

/** Check existing regular files without creating directories or changing bytes. */
export async function checkWorldFiles(dir, paths) {
  if (typeof dir !== "string" || !dir.trim()) {
    throw pathError("Select a nonempty world directory.");
  }
  if (!Array.isArray(paths)) throw new TypeError("paths must be an array.");
  const selectedPaths = [...new Set(paths.map(safeRelative))];
  if (
    selectedPaths.some((file) =>
      file.split("/").some((part) => part.toLowerCase() === ".git"),
    )
  ) {
    throw pathError("Git metadata cannot be selected as world content.");
  }
  const selected = path.resolve(dir);
  directory(await fs.lstat(selected));
  const root = await fs.realpath(selected);
  for (const file of selectedPaths) {
    const checked = await destination(root, file);
    if (!checked.entry)
      throw pathError("Select an existing regular world file.");
  }
  return { dir: root, paths: selectedPaths };
}

/** Confined writes in a creator-owned, single-writer folder; not an OS sandbox. */
export async function writeFiles(dir, files, { exclusive = false } = {}) {
  if (typeof dir !== "string" || !dir.trim()) {
    throw pathError("Select a nonempty world directory.");
  }
  if (typeof exclusive !== "boolean")
    throw new TypeError("exclusive must be boolean.");
  // Prepare every path and byte payload before creating directories or changing files.
  const plan = files.map((file) => ({
    path: safeRelative(file.path),
    bytes:
      typeof file.bytes === "string" ? file.bytes : Buffer.from(file.bytes),
  }));
  const names = new Set();
  const parents = new Set();
  for (const file of plan) {
    const key =
      process.platform === "win32" ? file.path.toLowerCase() : file.path;
    if (parents.has(key))
      throw pathError(
        "A batch file cannot also be another file's parent directory.",
      );
    if (exclusive && names.has(key)) throw alreadyExists();
    const parts = key.split("/");
    for (let i = 1; i < parts.length; i++) {
      const parent = parts.slice(0, i).join("/");
      if (names.has(parent))
        throw pathError(
          "A batch file cannot also be another file's parent directory.",
        );
      parents.add(parent);
    }
    names.add(key);
  }

  const selected = path.resolve(dir);
  const rootEntry = await existing(selected);
  let root;
  if (rootEntry) {
    directory(rootEntry);
    root = await fs.realpath(selected);
    for (const file of plan) {
      const checked = await destination(root, file.path);
      if (exclusive && checked.entry) throw alreadyExists();
    }
  } else {
    if (!plan.length) return;
    await fs.mkdir(selected, { recursive: true });
    directory(await fs.lstat(selected));
    root = await fs.realpath(selected);
  }

  for (const file of plan) {
    const checked = await destination(root, file.path, true);
    const flags =
      constants.O_WRONLY |
      (constants.O_NOFOLLOW || 0) |
      (!checked.entry || exclusive ? constants.O_CREAT | constants.O_EXCL : 0);
    const handle = await fs.open(checked.file, flags);
    try {
      // Do not truncate an existing inode until both the handle and path are checked.
      const opened = await handle.stat();
      regularFile(opened);
      const current = await destination(root, file.path);
      if (
        !current.entry ||
        current.entry.dev !== opened.dev ||
        current.entry.ino !== opened.ino
      ) {
        throw pathError(
          "World file changed while opening; reopen the world and retry.",
        );
      }
      await handle.truncate(0);
      await handle.writeFile(file.bytes);
    } finally {
      await handle.close();
    }
  }
}
