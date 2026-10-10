import { readFile, readdir, realpath } from "fs/promises";
import { resolve, sep } from "path";

/** Resolve symlinks as well as traversal before any author context read. */
export async function readAuthorBookFile(root: string, candidate: string) {
  const base = await realpath(root);
  const file = await realpath(resolve(root, candidate));
  if (!file.startsWith(base + sep))
    throw new Error("Book path is outside its root.");
  return readFile(file, "utf-8");
}

export async function listAuthorBookFiles(root: string, candidate: string) {
  const base = await realpath(root);
  const directory = await realpath(resolve(root, candidate));
  if (directory !== base && !directory.startsWith(base + sep))
    throw new Error("Book path is outside its root.");
  return readdir(directory);
}
