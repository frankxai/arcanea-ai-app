// Requires a caller-owned stable tree: ancestor checks cannot defeat concurrent swaps.
import { promises as fs } from "node:fs";
import path from "node:path";

export function boundaryError(message) {
  const error = new Error(message);
  error.code = "WORLD_PATH_UNSAFE";
  return error;
}

export function relativePath(value, { directory = false } = {}) {
  if (
    typeof value !== "string" ||
    !value ||
    /[\\\x00-\x1f\x7f:*?<>|]/.test(value) ||
    path.posix.isAbsolute(value) ||
    path.win32.isAbsolute(value)
  )
    throw boundaryError("World paths must be portable relative paths.");
  const p = directory ? value.replace(/\/$/, "") : value;
  if (
    p
      .split("/")
      .some(
        (s) =>
          !s ||
          s === "." ||
          s === ".." ||
          /[. ]$/.test(s) ||
          /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(s) ||
          s.toLowerCase() === ".git",
      )
  )
    throw boundaryError("World path contains a reserved or ambiguous segment.");
  return p;
}

export function uniquePaths(paths) {
  const normalized = paths.map((p) => relativePath(p).toLowerCase());
  const names = new Set(normalized);
  if (names.size !== normalized.length)
    throw boundaryError("World destinations alias each other.");
  for (const p of normalized) {
    const parts = p.split("/");
    while (parts.length > 1) {
      parts.pop();
      if (names.has(parts.join("/")))
        throw boundaryError("World destinations overlap each other.");
    }
  }
}

async function statOrMissing(p) {
  try {
    return await fs.lstat(p);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function checkStat(stat, kind) {
  if (
    stat &&
    (stat.isSymbolicLink() ||
      (kind === "directory" ? !stat.isDirectory() : !stat.isFile()) ||
      (stat.isFile() && stat.nlink > 1))
  )
    throw boundaryError(
      "World I/O refuses links, aliases and unexpected file types.",
    );
}

export async function checkedRoot(dir) {
  if (typeof dir !== "string" || !dir)
    throw boundaryError("World root is required.");
  const root = path.resolve(dir);
  const ancestors = [];
  for (let p = root; ; p = path.dirname(p)) {
    ancestors.push(p);
    if (path.dirname(p) === p) break;
  }
  for (const p of ancestors.reverse())
    checkStat(await statOrMissing(p), "directory");
  return root;
}

export async function checkedPath(
  dir,
  value,
  { kind = "file", exclusive = false } = {},
) {
  const root = await checkedRoot(dir);
  const p = relativePath(value, { directory: kind === "directory" });
  const segments = p.split("/");
  let target = root;
  let stat;
  for (let i = 0; i < segments.length; i++) {
    target = path.join(target, segments[i]);
    stat = await statOrMissing(target);
    checkStat(stat, i === segments.length - 1 ? kind : "directory");
  }
  if (exclusive && stat)
    throw boundaryError("World destination already exists.");
  return { root, path: p, target, exists: Boolean(stat) };
}
