// Shared portable paths and inode checks. Requires a creator-owned, stable tree.
import { promises as fs } from "node:fs";
import path from "node:path";

export function pathError(message) {
  return Object.assign(new Error(message), { code: "ERR_ARCANEA_WORLD_PATH" });
}

export function safeRelative(value) {
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
  )
    throw pathError(
      "Use a portable relative world-file path without traversal or device names.",
    );
  return value;
}

export async function existing(file) {
  try {
    return await fs.lstat(file);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return null;
  }
}

export function directory(entry) {
  if (entry.isSymbolicLink() || !entry.isDirectory()) {
    throw pathError(
      "World I/O cannot follow a symbolic link/junction or use a file as a directory.",
    );
  }
}

export function regularFile(entry) {
  if (entry.isSymbolicLink() || !entry.isFile() || entry.nlink !== 1) {
    throw pathError(
      "World I/O requires a regular file with no symbolic or additional hard links.",
    );
  }
}

export async function destination(
  root,
  relative,
  makeParents = false,
  kind = "file",
) {
  directory(await fs.lstat(root));
  const parts = relative.split("/");
  let current = root;
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    let entry = await existing(current);
    if (i === parts.length - 1) {
      if (entry) {
        if (kind === "directory" || (kind === "any" && entry.isDirectory()))
          directory(entry);
        else regularFile(entry);
      }
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
