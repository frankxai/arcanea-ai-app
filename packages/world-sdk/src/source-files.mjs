// One declared-source boundary for reads, hashes and public indexes.
import { relativePath, uniquePaths, boundaryError } from "./world-paths.mjs";
import { publicFile } from "./frontmatter.mjs";
import { MANIFEST_FILE } from "./manifest.mjs";

export function sourcePath(p) {
  return (
    !p
      .split("/")
      .some(
        (s) =>
          s.startsWith(".") ||
          ["node_modules", "dist", "build", "coverage"].includes(
            s.toLowerCase(),
          ),
      ) && p !== MANIFEST_FILE
  );
}

export function declarations(manifest) {
  if (
    !manifest?.content ||
    typeof manifest.content !== "object" ||
    Array.isArray(manifest.content)
  )
    throw boundaryError("World content declarations are required.");
  const result = Object.entries(manifest.content).map(([section, value]) => ({
    path: relativePath(value, { directory: true }),
    section,
    required: false,
  }));
  result.push({ path: "README.md", section: "other", required: false });
  for (const value of [
    manifest.license?.pointer,
    manifest.royalty?.policy,
    manifest.cover,
    manifest.theme?.audio,
  ]) {
    if (value == null || value === "") continue;
    if (typeof value === "string" && /^https?:\/\//i.test(value)) continue;
    result.push({
      path: relativePath(value),
      section: "other",
      required: true,
    });
  }
  if (result.some((d) => !sourcePath(d.path)))
    throw boundaryError(
      "Private tooling cannot be declared as a public source.",
    );
  return result;
}

export function assertPublicWorld(manifest) {
  if ((manifest.visibility ?? "public") !== "public") {
    const error = new Error(
      "Public hashing and indexing require a public world.",
    );
    error.code = "WORLD_NOT_PUBLIC";
    throw error;
  }
}

export function sectionOf(p, declared) {
  return (
    [...declared]
      .sort((a, b) => b.path.length - a.path.length)
      .find((d) => p === d.path || p.startsWith(d.path + "/"))?.section ??
    "other"
  );
}

export function publicSources(files, manifest) {
  assertPublicWorld(manifest);
  const declared = declarations(manifest);
  if (!Array.isArray(files))
    throw boundaryError("World sources must be a file array.");
  uniquePaths(files.map((f) => f.path));
  return files.filter(
    (f) =>
      sourcePath(f.path) &&
      declared.some(
        (d) => f.path === d.path || f.path.startsWith(d.path + "/"),
      ) &&
      publicFile(f),
  );
}
