// Confined reads use one checked open handle; ancestor swaps still require OS isolation.
import { constants, promises as fs } from "node:fs";
import path from "node:path";
import {
  pathError,
  safeRelative,
  directory,
  regularFile,
  destination,
} from "./world-paths.mjs";

export async function readRoot(dir) {
  if (typeof dir !== "string" || !dir.trim())
    throw pathError("Select a nonempty world directory.");
  const selected = path.resolve(dir);
  const ancestors = [];
  for (let current = selected; ; current = path.dirname(current)) {
    ancestors.push(current);
    if (path.dirname(current) === current) break;
  }
  for (const current of ancestors.reverse()) directory(await fs.lstat(current));
  return fs.realpath(selected);
}

function sameEntry(before, after) {
  if (
    !before ||
    !after ||
    before.dev !== after.dev ||
    before.ino !== after.ino
  ) {
    throw pathError(
      "World source changed while opening; reopen the world and retry.",
    );
  }
}

export async function readFile(root, relative) {
  safeRelative(relative);
  const checked = await destination(root, relative);
  if (!checked.entry)
    throw Object.assign(new Error("Selected world file is missing."), {
      code: "ENOENT",
    });
  const handle = await fs.open(
    checked.file,
    constants.O_RDONLY | (constants.O_NOFOLLOW || 0),
  );
  try {
    const opened = await handle.stat();
    regularFile(opened);
    sameEntry(checked.entry, opened);
    const current = await destination(root, relative);
    sameEntry(current.entry, opened);
    return await handle.readFile();
  } finally {
    await handle.close();
  }
}

export async function readDirectory(root, relative) {
  safeRelative(relative);
  const checked = await destination(root, relative, false, "directory");
  if (!checked.entry) return [];
  const names = await fs.readdir(checked.file);
  const current = await destination(root, relative, false, "directory");
  sameEntry(checked.entry, current.entry);
  return names.sort();
}
