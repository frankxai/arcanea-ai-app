// Read/write a world as a folder on disk. The folder IS the source of truth.

import { constants, promises as fs } from "node:fs";
import path from "node:path";
import { MANIFEST_FILE } from "./manifest.mjs";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".turbo", ".next"]);

/** Minimal frontmatter reader — only the fields the standard cares about. */
export function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
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
  await writeFiles(dir, [
    { path: MANIFEST_FILE, bytes: JSON.stringify(manifest, null, 2) + "\n" },
  ]);
}

function pathError(message) {
  return Object.assign(new Error(message), { code: "ERR_ARCANEA_WORLD_PATH" });
}

function safeRelative(value) {
  if (
    typeof value !== "string" ||
    !value ||
    /[\x00-\x1f\x7f<>:"|?*\\]/.test(value) ||
    value
      .split("/")
      .some(
        (part) =>
          !part ||
          part === "." ||
          part === ".." ||
          /[. ]$/.test(part) ||
          /^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(part),
      )
  ) {
    throw pathError(
      "Use a portable relative world-file path without traversal or device names.",
    );
  }
  return value;
}

async function existing(file) {
  try {
    return await fs.lstat(file);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return null;
  }
}

function directory(entry) {
  if (entry.isSymbolicLink() || !entry.isDirectory()) {
    throw pathError(
      "World writes cannot follow a symbolic link/junction or use a file as a directory.",
    );
  }
}

function regularFile(entry) {
  if (entry.isSymbolicLink() || !entry.isFile() || entry.nlink !== 1) {
    throw pathError(
      "World writes require a regular file with no symbolic or additional hard links.",
    );
  }
}

async function destination(root, relative, makeParents = false) {
  directory(await fs.lstat(root));
  const parts = relative.split("/");
  let current = root;
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    let entry = await existing(current);
    if (i === parts.length - 1) {
      if (entry) regularFile(entry);
      return { file: current, entry };
    }
    if (!entry) {
      if (!makeParents) return { file: path.join(root, ...parts), entry: null };
      try {
        await fs.mkdir(current);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
      entry = await fs.lstat(current);
    }
    directory(entry);
  }
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
