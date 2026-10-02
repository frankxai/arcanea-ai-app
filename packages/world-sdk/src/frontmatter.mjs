import { createRequire } from "node:module";
const { parseDocument, stringify } = createRequire(import.meta.url)("yaml");

function invalid() {
  const error = new Error("World frontmatter is malformed or ambiguous.");
  error.code = "WORLD_FRONTMATTER_INVALID";
  return error;
}

export function parseFrontmatter(text) {
  const normalized = String(text)
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
  if (!/^---(?:\n|$)/.test(normalized)) return { data: {}, body: normalized };
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(normalized);
  if (!match || Buffer.byteLength(match[1]) > 65536) throw invalid();
  let data;
  try {
    const doc = parseDocument(match[1], {
      uniqueKeys: true,
      prettyErrors: false,
      strict: true,
      stringKeys: true,
    });
    if (doc.errors.length || doc.warnings.length) throw invalid();
    data = doc.toJS({ maxAliasCount: 0 }) ?? {};
  } catch {
    throw invalid();
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw invalid();
  if (
    data.visibility !== undefined &&
    !["public", "private", "unlisted"].includes(data.visibility)
  )
    throw invalid();
  if (
    data.status !== undefined &&
    (typeof data.status !== "string" ||
      ![
        "LOCKED",
        "EVOLVING",
        "APPROVED",
        "CANDIDATE",
        "STAGING",
        "DRAFT",
      ].includes(data.status.toUpperCase()))
  )
    throw invalid();
  return { data, body: normalized.slice(match[0].length) };
}

export function documentWithMetadata(data, body) {
  return `---\n${stringify(data)}---\n\n${body}\n`;
}

export function metadataForFile(file) {
  return /\.(md|mdx)$/i.test(file.path)
    ? parseFrontmatter(Buffer.from(file.bytes).toString("utf8")).data
    : {};
}

export function publicFile(file) {
  const data = metadataForFile(file);
  return (
    (file.visibility ?? "public") === "public" &&
    (data.visibility ?? "public") === "public" &&
    !["STAGING", "CANDIDATE", "DRAFT"].includes(data.status?.toUpperCase())
  );
}
