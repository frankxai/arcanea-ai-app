import { readFile, readdir, realpath } from "fs/promises";
import { resolve, sep } from "path";

/** Manuscript files often repeat the book heading above their chapter heading. */
export function getChapterTitle(content: string, fallback: string): string {
  return (
    content
      .match(
        /^#{1,2}\s+((?:chapter|prologue|epilogue|interlude)\b[^\n]*)/im,
      )?.[1]
      ?.trim() ||
    content.match(/^#\s+([^\n]+)/m)?.[1]?.trim() ||
    fallback
  );
}

/** Resolve symlinks as well as traversal before any author context read. */
export async function readBookContextFile(root: string, candidate: string) {
  const base = await realpath(root);
  const lexicalRoot = resolve(root);
  const lexicalFile = resolve(root, candidate);
  if (!lexicalFile.startsWith(lexicalRoot + sep))
    throw new Error("Book path is outside its root.");
  const file = await realpath(lexicalFile);
  if (!file.startsWith(base + sep))
    throw new Error("Book path is outside its root.");
  return readFile(file, "utf-8");
}

export async function listBookContextFiles(root: string, candidate: string) {
  const base = await realpath(root);
  const lexicalRoot = resolve(root);
  const lexicalDirectory = resolve(root, candidate);
  if (!lexicalDirectory.startsWith(lexicalRoot + sep))
    throw new Error("Book path is outside its root.");
  const directory = await realpath(lexicalDirectory);
  if (!directory.startsWith(base + sep))
    throw new Error("Book path is outside its root.");
  return readdir(directory);
}
