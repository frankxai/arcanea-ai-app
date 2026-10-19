import {
  DocumentMediaError,
  documentMediaUrl,
  mediaDigest,
  parseDocumentMediaClaim,
  type DocumentMediaScope,
  type DocumentMediaRecord,
} from "./media";

const MAX_EXPORT_MEDIA_BYTES = 40 * 1024 * 1024;
const MAX_EXPORT_IMAGES = 32;
interface ExportNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string }[];
  content?: ExportNode[];
}
export interface PortableDocumentInput {
  title: string;
  content_json: Record<string, unknown>;
  content_text: string;
  confirmed_revision: number;
  pending_operation: unknown;
}
export interface PortableMedia {
  asset: DocumentMediaRecord;
  bytes: Uint8Array;
}
function escape(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}
function base64(bytes: Uint8Array): string {
  // Small chunks avoid argument-count/stack limits without Node-only imports.
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
}
/** Return a complete offline artifact or fail without modifying the source draft. */
export async function buildPortableDocumentExport(
  input: PortableDocumentInput,
  scope: DocumentMediaScope,
  read: (assetId: string) => Promise<PortableMedia>,
  current: () => boolean,
): Promise<{ html: string; mediaCount: number; mediaBytes: number }> {
  const assertCurrent = () => {
    if (!current())
      throw new DocumentMediaError(
        409,
        "The account or document changed. Export was stopped; your draft is unchanged.",
      );
  };
  assertCurrent();
  // Bound traversal and output before any media reads or network authority.
  const serialized = JSON.stringify(input);
  if (new TextEncoder().encode(serialized).length > 1024 * 1024)
    throw new DocumentMediaError(
      413,
      "This draft exceeds the portable export limit. Download the draft JSON instead.",
    );
  const root = input.content_json as ExportNode;
  const images = new Map<string, string>();
  let nodes = 0;
  function collect(node: ExportNode, depth: number) {
    if (++nodes > 10000 || depth > 64)
      throw new DocumentMediaError(
        413,
        "This document is too complex for portable export. Download the draft JSON instead.",
      );
    if (!node || typeof node !== "object" || Array.isArray(node))
      throw new DocumentMediaError(
        400,
        "The document structure could not be exported.",
      );
    if (node.type === "image") {
      const source = node.attrs?.src;
      if (typeof source !== "string")
        throw new DocumentMediaError(
          400,
          "An image has no saved source. Keep the draft and original file.",
        );
      const match =
        /^\/api\/projects\/([a-f0-9-]{36})\/docs\/([a-f0-9-]{36})\/media\/([a-f0-9-]{36})$/.exec(
          source,
        );
      if (!match || source !== documentMediaUrl(scope, match[3]))
        throw new DocumentMediaError(
          400,
          "An image is not saved privately in this document. Portable export stopped; download the draft JSON and keep its original image.",
        );
      images.set(source, match[3]);
      if (images.size > MAX_EXPORT_IMAGES)
        throw new DocumentMediaError(
          413,
          "Portable export supports up to 32 distinct images. Download the draft JSON and originals instead.",
        );
    }
    if (node.content !== undefined && !Array.isArray(node.content))
      throw new DocumentMediaError(
        400,
        "The document structure could not be exported.",
      );
    if (
      node.marks !== undefined &&
      (!Array.isArray(node.marks) ||
        node.marks.some((mark) => !mark || typeof mark !== "object"))
    )
      throw new DocumentMediaError(
        400,
        "The document formatting could not be exported.",
      );
    for (const child of node.content ?? []) collect(child, depth + 1);
  }
  collect(root, 0);
  const assets: Record<string, DocumentMediaRecord & { imageData: string }> =
    {};
  const embedded = new Map<string, string>();
  let total = 0;
  for (const [source, id] of images) {
    assertCurrent();
    const { asset, bytes } = await read(id);
    assertCurrent();
    const claim = await parseDocumentMediaClaim(asset, scope);
    if (
      asset.assetId !== id ||
      asset.status !== "ready" ||
      asset.fingerprint !== claim.fingerprint ||
      asset.sourceStatus !== "creator_supplied_unverified" ||
      asset.rightsStatus !== "unverified" ||
      bytes.length !== claim.byteSize ||
      (await mediaDigest(bytes)) !== claim.sha256
    )
      throw new DocumentMediaError(
        409,
        "An image could not be verified. No incomplete export was downloaded; your draft is unchanged.",
      );
    total += bytes.length;
    if (total > MAX_EXPORT_MEDIA_BYTES)
      throw new DocumentMediaError(
        413,
        "Images exceed the 40 MiB portable export limit. Download the draft JSON and originals instead.",
      );
    const imageData = base64(bytes);
    assets[id] = { ...asset, imageData };
    embedded.set(source, `data:${claim.mimeType};base64,${imageData}`);
  }
  function render(node: ExportNode): string {
    if (node.type === "text") {
      let text = escape(typeof node.text === "string" ? node.text : "");
      const markTags: Record<string, string> = {
        bold: "strong",
        italic: "em",
        strike: "s",
        underline: "u",
        code: "code",
      };
      for (const mark of node.marks ?? []) {
        const tag = markTags[mark.type ?? ""];
        if (tag) text = `<${tag}>${text}</${tag}>`;
      }
      return text;
    }
    if (node.type === "image") {
      const uri = embedded.get(String(node.attrs?.src));
      if (!uri)
        throw new DocumentMediaError(
          409,
          "An image is missing from the export.",
        );
      const record = assets[images.get(String(node.attrs?.src))!];
      return `<img src="${uri}" alt="${escape(String(node.attrs?.alt || record.alt))}" style="max-width:100%;height:auto">`;
    }
    if (node.type === "hardBreak") return "<br>";
    if (node.type === "horizontalRule") return "<hr>";
    const content = (node.content ?? []).map(render).join("");
    if (node.type === "heading") {
      const level = [1, 2, 3, 4, 5, 6].includes(Number(node.attrs?.level))
        ? Number(node.attrs?.level)
        : 2;
      return `<h${level}>${content}</h${level}>`;
    }
    const tags: Record<string, string> = {
      paragraph: "p",
      bulletList: "ul",
      orderedList: "ol",
      listItem: "li",
      taskList: "ul",
      taskItem: "li",
      blockquote: "blockquote",
      codeBlock: "pre",
    };
    const tag = tags[node.type ?? ""];
    return tag ? `<${tag}>${content}</${tag}>` : content;
  }
  const manifest = JSON.stringify({
    format: "arcanea-project-document-portable-v1",
    doc_id: scope.docId,
    project_id: scope.projectId,
    ...input,
    assets,
    source_status: "creator_supplied_unverified",
    rights_status: "unverified",
  }).replace(/</g, "\\u003c");
  assertCurrent();
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escape(input.title)}</title></head><body><h1>${escape(input.title)}</h1>${render(root)}<script type="application/json" id="arcanea-document">${manifest}</script></body></html>`;
  return { html, mediaCount: images.size, mediaBytes: total };
}
