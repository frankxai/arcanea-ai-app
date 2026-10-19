// Adapted from draft #499 at 3c82b615: one declared boundary for read/hash/index.
// Uses the accepted writer's path contract, with no dependency or Git requirement.
import { MANIFEST_FILE } from "./manifest.mjs";
import { safeRelative, pathError } from "./world-paths.mjs";

export function sourcePath(value) {
  return (
    value.toLowerCase() !== MANIFEST_FILE.toLowerCase() &&
    !value
      .split("/")
      .some(
        (part) =>
          part.startsWith(".") ||
          ["node_modules", "dist", "build", "coverage"].includes(
            part.toLowerCase(),
          ),
      )
  );
}

export function declarations(manifest) {
  if (
    !manifest?.content ||
    typeof manifest.content !== "object" ||
    Array.isArray(manifest.content)
  ) {
    throw pathError("World content declarations are required.");
  }
  const selected = Object.entries(manifest.content).map(([section, value]) => ({
    path: safeRelative(
      typeof value === "string" ? value.replace(/\/$/, "") : value,
    ),
    section,
  }));
  selected.push({ path: "README.md", section: "other" });
  for (const value of [
    manifest.license?.pointer,
    manifest.royalty?.policy,
    manifest.cover,
    manifest.theme?.audio,
  ]) {
    if (value == null || value === "") continue;
    if (typeof value === "string" && /^https?:\/\//i.test(value)) continue;
    selected.push({ path: safeRelative(value), section: "other" });
  }
  if (selected.some((item) => !sourcePath(item.path)))
    throw pathError("Private/tooling paths cannot be declared world sources.");
  const names = new Map();
  for (const item of selected) {
    const key = item.path.toLowerCase();
    if (names.has(key) && names.get(key) !== item.path)
      throw pathError("World declarations alias each other.");
    names.set(key, item.path);
  }
  return selected;
}

export function uniqueSourcePaths(paths) {
  const names = new Set();
  for (const value of paths) {
    const key = safeRelative(value).toLowerCase();
    if (names.has(key)) throw pathError("World source paths alias each other.");
    names.add(key);
  }
}

export function assertPublicWorld(manifest) {
  if (
    (manifest.visibility === undefined ? "public" : manifest.visibility) !==
    "public"
  ) {
    throw Object.assign(
      new Error("Public hashing and indexing require a public world."),
      { code: "WORLD_NOT_PUBLIC" },
    );
  }
}

function metadataError() {
  return Object.assign(
    new Error(
      "World source frontmatter is ambiguous or unsupported; use flat scalar metadata.",
    ),
    { code: "ERR_ARCANEA_SOURCE_METADATA" },
  );
}

// This profile accepts flat scalar headers, not arbitrary YAML. Complex syntax fails closed.
// Keep parseFrontmatter's existing metadata API separate from publication eligibility.
export function sourceMetadata(file) {
  const result = {
    visibility: file.visibility === undefined ? "public" : file.visibility,
    status: "",
  };
  if (!/\.(md|mdx)$/i.test(file.path)) return result;
  const text = Buffer.from(file.bytes)
    .toString("utf8")
    .replace(/^\uFEFF+/, "")
    .replace(/\r\n/g, "\n");
  if (!text.startsWith("---")) return result;
  if (!/^---(?:[ \t]*\n|$)/.test(text)) throw metadataError();
  const end = /^---[ \t]*\n([\s\S]*?)^---[ \t]*(?:\n|$)/m.exec(text);
  if (!end || Buffer.byteLength(end[1]) > 65536) throw metadataError();
  const keys = new Set();
  for (const line of end[1].split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match =
      /^(?:([A-Za-z0-9_]+)|"([A-Za-z0-9_]+)"|'([A-Za-z0-9_]+)'):[ \t]*(.*)$/.exec(
        line,
      );
    if (!match) throw metadataError();
    const key = match[1] || match[2] || match[3];
    if (keys.has(key)) throw metadataError();
    keys.add(key);
    const raw = match[4];
    if (/^[&*|>\[{]/.test(raw) || /[\r\u2028\u2029]/.test(raw))
      throw metadataError();
    if (
      (raw.startsWith('"') && !/^"[^"\\]*"(?:[ \t]+#.*)?[ \t]*$/.test(raw)) ||
      (raw.startsWith("'") && !/^'[^']*'(?:[ \t]+#.*)?[ \t]*$/.test(raw))
    )
      throw metadataError();
    if (key !== "visibility" && key !== "status") continue;
    const scalar =
      /^(?:"([A-Za-z_-]+)"|'([A-Za-z_-]+)'|([A-Za-z_-]+))(?:[ \t]+#.*)?[ \t]*$/.exec(
        raw,
      );
    if (!scalar) throw metadataError();
    const value = scalar[1] || scalar[2] || scalar[3];
    if (key === "visibility") {
      if (!["public", "private", "unlisted"].includes(value))
        throw metadataError();
      // An explicit private file descriptor cannot be widened by its frontmatter.
      if (result.visibility === "public") result.visibility = value;
    } else {
      if (
        ![
          "LOCKED",
          "EVOLVING",
          "APPROVED",
          "CANDIDATE",
          "STAGING",
          "DRAFT",
        ].includes(value.toUpperCase())
      )
        throw metadataError();
      result.status = value.toUpperCase();
    }
  }
  return result;
}

export function publicSources(files, manifest) {
  assertPublicWorld(manifest);
  const declared = declarations(manifest);
  if (!Array.isArray(files))
    throw pathError("World sources must be a file array.");
  uniqueSourcePaths(files.map((file) => file.path));
  return files.filter((file) => {
    if (
      !sourcePath(file.path) ||
      !declared.some(
        (item) =>
          file.path === item.path || file.path.startsWith(item.path + "/"),
      )
    )
      return false;
    const metadata = sourceMetadata(file);
    return (
      metadata.visibility === "public" &&
      !["CANDIDATE", "STAGING", "DRAFT"].includes(metadata.status)
    );
  });
}

export function sectionOf(value, declared) {
  return (
    [...declared]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) => value === item.path || value.startsWith(item.path + "/"))
      ?.section ?? "other"
  );
}
