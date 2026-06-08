// Render a world repo to a manuscript. A book is a RENDER TARGET of the world,
// not a separate pipeline. Source of truth is the repo: books/<slug>/ if present,
// else a "world primer" compiled from canon/ + characters/.
// Zero external deps — node builtins only (fs, path, zlib for the PDF stream).

import { promises as fs } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { MANIFEST_FILE } from "./manifest.mjs";
import { parseFrontmatter } from "./fs-world.mjs";

function bodyTitle(text, fallback) {
  const { data, body } = parseFrontmatter(text);
  if (data.name) return data.name;
  const h = /^#\s+(.+)$/m.exec(body);
  return h ? h[1].trim() : fallback;
}

function stripBody(text) {
  return parseFrontmatter(text).body.trim();
}

async function listMd(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && /\.md$/i.test(e.name))
    .map((e) => e.name)
    .sort();
}

async function readManifest(dir) {
  const raw = await fs.readFile(path.join(dir, MANIFEST_FILE), "utf8");
  return JSON.parse(raw);
}

async function chaptersFromBookJson(booksDir, slug) {
  const bookJsonPath = path.join(booksDir, slug, "book.json");
  let spec;
  try {
    spec = JSON.parse(await fs.readFile(bookJsonPath, "utf8"));
  } catch {
    return null;
  }
  const base = path.join(booksDir, slug);
  const chapters = [];
  for (const file of spec.chapters || []) {
    const text = await fs.readFile(path.join(base, file), "utf8");
    chapters.push({ title: bodyTitle(text, path.basename(file, path.extname(file))), body: stripBody(text) });
  }
  return { title: spec.title, author: spec.author, chapters };
}

async function chaptersFromMdFolder(booksDir, slug) {
  const base = path.join(booksDir, slug);
  const files = await listMd(base);
  if (!files.length) return null;
  const chapters = [];
  for (const file of files) {
    const text = await fs.readFile(path.join(base, file), "utf8");
    chapters.push({ title: bodyTitle(text, path.basename(file, ".md")), body: stripBody(text) });
  }
  return { chapters };
}

async function chaptersFromCanon(dir, manifest) {
  const canonDir = path.join(dir, "canon");
  const canonFiles = await listMd(canonDir);
  const chapters = [];
  for (const file of canonFiles) {
    const text = await fs.readFile(path.join(canonDir, file), "utf8");
    chapters.push({ title: bodyTitle(text, path.basename(file, ".md")), body: stripBody(text) });
  }

  const charsDir = path.join(dir, "characters");
  const charFiles = await listMd(charsDir);
  if (charFiles.length) {
    const parts = [];
    for (const file of charFiles) {
      const text = await fs.readFile(path.join(charsDir, file), "utf8");
      const name = bodyTitle(text, path.basename(file, ".md"));
      const body = stripBody(text).replace(/^#\s+.+\n?/, "").trim();
      parts.push(`## ${name}\n\n${body}`);
    }
    chapters.push({ title: "Inhabitants", body: parts.join("\n\n") });
  }
  return { title: manifest.name, chapters };
}

function titlePage(manifest, title) {
  const lines = [`# ${title}`];
  if (manifest.tagline) lines.push("", `> ${manifest.tagline}`);
  const handle = manifest.creator?.handle;
  if (handle) lines.push("", `*A world by ${handle}*`);
  if (manifest.license?.spdx) lines.push("", `License: ${manifest.license.spdx}`);
  return lines.join("\n");
}

function toMarkdown(manifest, title, chapters) {
  const parts = [titlePage(manifest, title)];
  for (const ch of chapters) {
    parts.push(`# ${ch.title}\n\n${ch.body}`.trim());
  }
  return parts.join("\n\n---\n\n") + "\n";
}

/**
 * Compile a world repo into a manuscript model.
 * @param {{dir:string, bookSlug?:string}} args
 * @returns {Promise<{title:string, frontmatter:object, chapters:{title:string,body:string}[], markdown:string}>}
 */
export async function compileManuscript({ dir, bookSlug }) {
  const manifest = await readManifest(dir);
  const slug = bookSlug || manifest.slug || "world-primer";
  const booksDir = path.join(dir, "books");

  let resolved =
    (await chaptersFromBookJson(booksDir, slug)) ||
    (await chaptersFromMdFolder(booksDir, slug)) ||
    (await chaptersFromCanon(dir, manifest));

  const title = resolved.title || manifest.name;
  const chapters = resolved.chapters;
  const frontmatter = {
    title,
    author: resolved.author || manifest.creator?.handle || "anon",
    world: manifest.name,
    worldId: manifest.id,
    license: manifest.license?.spdx || "CC-BY-4.0",
  };
  const markdown = toMarkdown(manifest, title, chapters);
  return { title, frontmatter, chapters, markdown };
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Tiny markdown -> HTML (headings, hr, paragraphs, blockquotes, emphasis). Enough for print.
function markdownToHtml(md) {
  const out = [];
  for (const block of md.split(/\n{2,}/)) {
    const b = block.trim();
    if (!b) continue;
    if (b === "---") {
      out.push('<hr class="page" />');
      continue;
    }
    const h = /^(#{1,6})\s+(.+)$/.exec(b);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${escapeHtml(h[2])}</h${level}>`);
      continue;
    }
    if (b.startsWith(">")) {
      const inner = b.replace(/^>\s?/gm, "");
      out.push(`<blockquote>${inlineHtml(escapeHtml(inner))}</blockquote>`);
      continue;
    }
    out.push(`<p>${inlineHtml(escapeHtml(b)).replace(/\n/g, "<br />")}</p>`);
  }
  return out.join("\n");
}

function inlineHtml(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function manuscriptHtml(title, md) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  html { font-family: Georgia, "Times New Roman", serif; color: #111; line-height: 1.6; }
  body { max-width: 38rem; margin: 4rem auto; padding: 0 1.25rem; }
  h1 { font-size: 1.9rem; margin: 2.5rem 0 1rem; }
  h2 { font-size: 1.4rem; margin: 2rem 0 .75rem; }
  blockquote { font-style: italic; color: #444; border-left: 3px solid #ccc; margin: 1rem 0; padding-left: 1rem; }
  hr.page { border: 0; border-top: 1px solid #ddd; margin: 2.5rem 0; }
  p { margin: 0 0 1rem; text-align: justify; }
  @media print {
    @page { size: letter; margin: 1in; }
    body { max-width: none; margin: 0; }
    h1 { page-break-before: always; }
    h1:first-of-type { page-break-before: avoid; }
    hr.page { page-break-after: always; border: 0; margin: 0; }
  }
</style>
</head>
<body>
${markdownToHtml(md)}
</body>
</html>
`;
}

// ── Hand-rolled minimal PDF writer ────────────────────────────────────────────
// Plain-text manuscript, Helvetica (standard-14, no embedding), Letter size.

const PAGE_W = 612; // 8.5in * 72
const PAGE_H = 792; // 11in * 72
const MARGIN = 54;
const FONT_SIZE = 11;
const LEADING = 14;
const WRAP = 90;
const LINES_PER_PAGE = 50;

function wrapLine(line, width) {
  if (line.length <= width) return [line];
  const words = line.split(/\s+/);
  const out = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + " " + w).length <= width) {
      cur += " " + w;
    } else {
      out.push(cur);
      cur = w;
    }
    while (cur.length > width) {
      out.push(cur.slice(0, width));
      cur = cur.slice(width);
    }
  }
  if (cur) out.push(cur);
  return out;
}

function manuscriptToLines(md) {
  const lines = [];
  for (const raw of md.split("\n")) {
    const line = raw.replace(/\t/g, "    ");
    if (line.trim() === "---") {
      lines.push("");
      lines.push("* * *");
      lines.push("");
      continue;
    }
    if (line === "") {
      lines.push("");
      continue;
    }
    for (const w of wrapLine(line, WRAP)) lines.push(w);
  }
  return lines;
}

function paginate(lines) {
  const pages = [];
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push(lines.slice(i, i + LINES_PER_PAGE));
  }
  return pages.length ? pages : [[""]];
}

function pdfEscape(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7e]/g, "?");
}

function contentStream(pageLines) {
  const startY = PAGE_H - MARGIN;
  let body = `BT\n/F1 ${FONT_SIZE} Tf\n${LEADING} TL\n${MARGIN} ${startY} Td\n`;
  pageLines.forEach((line, i) => {
    if (i === 0) body += `(${pdfEscape(line)}) Tj\n`;
    else body += `T*\n(${pdfEscape(line)}) Tj\n`;
  });
  body += "ET\n";
  return Buffer.from(body, "latin1");
}

function buildPdf(md) {
  const pages = paginate(manuscriptToLines(md));

  // Object layout: 1=Catalog, 2=Pages, 3=Font, then per page: Page + Content.
  const objects = []; // index -> Buffer (body only, without "N 0 obj")
  const FONT_OBJ = 3;
  const firstPageObj = 4;
  const pageObjNums = pages.map((_, i) => firstPageObj + i * 2);
  const contentObjNums = pages.map((_, i) => firstPageObj + i * 2 + 1);

  objects[1] = Buffer.from("<< /Type /Catalog /Pages 2 0 R >>", "latin1");
  objects[2] = Buffer.from(
    `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    "latin1",
  );
  objects[FONT_OBJ] = Buffer.from(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "latin1",
  );

  pages.forEach((pageLines, i) => {
    const raw = contentStream(pageLines);
    const stream = zlib.deflateSync(raw);
    const head = Buffer.from(`<< /Length ${stream.length} /Filter /FlateDecode >>\nstream\n`, "latin1");
    const tail = Buffer.from("\nendstream", "latin1");
    objects[pageObjNums[i]] = Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /Font << /F1 ${FONT_OBJ} 0 R >> >> /Contents ${contentObjNums[i]} 0 R >>`,
      "latin1",
    );
    objects[contentObjNums[i]] = Buffer.concat([head, stream, tail]);
  });

  const total = objects.length - 1; // objects are 1-indexed
  const chunks = [];
  const offsets = new Array(total + 1).fill(0);
  let pos = 0;
  const push = (buf) => {
    chunks.push(buf);
    pos += buf.length;
  };

  const header = Buffer.from("%PDF-1.7\n%\xe2\xe3\xcf\xd3\n", "latin1");
  push(header);

  for (let n = 1; n <= total; n++) {
    offsets[n] = pos;
    push(Buffer.concat([Buffer.from(`${n} 0 obj\n`, "latin1"), objects[n], Buffer.from("\nendobj\n", "latin1")]));
  }

  const xrefPos = pos;
  let xref = `xref\n0 ${total + 1}\n0000000000 65535 f \n`;
  for (let n = 1; n <= total; n++) {
    xref += String(offsets[n]).padStart(10, "0") + " 00000 n \n";
  }
  push(Buffer.from(xref, "latin1"));
  push(Buffer.from(`trailer\n<< /Size ${total + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`, "latin1"));

  return Buffer.concat(chunks);
}

/**
 * Render a world repo's manuscript to a file.
 * @param {{dir:string, bookSlug?:string, target?:string, converter?:(md:string,target:string)=>Promise<Buffer>}} opts
 * @returns {Promise<{outFile:string, target:string, bytes:number}>}
 */
export async function renderBook({ dir, bookSlug, target = "md", converter } = {}) {
  const { title, markdown } = await compileManuscript({ dir, bookSlug });
  const slug = bookSlug || (await readManifest(dir)).slug || "world-primer";
  const distDir = path.join(dir, "dist");
  await fs.mkdir(distDir, { recursive: true });

  let outFile;
  let data;

  if (target === "md") {
    outFile = path.join(distDir, `${slug}.manuscript.md`);
    data = Buffer.from(markdown, "utf8");
  } else if (target === "html") {
    outFile = path.join(distDir, `${slug}.html`);
    data = Buffer.from(manuscriptHtml(title, markdown), "utf8");
  } else if (target === "pdf") {
    outFile = path.join(distDir, `${slug}.pdf`);
    data = buildPdf(markdown);
  } else {
    // Unknown/"docx" → delegate to a pluggable converter when injected.
    if (typeof converter !== "function") {
      throw new Error(`render target "${target}" needs an injected converter (opts.converter)`);
    }
    data = await converter(markdown, target);
    outFile = path.join(distDir, `${slug}.${target}`);
  }

  await fs.writeFile(outFile, data);
  return { outFile, target, bytes: data.length };
}
