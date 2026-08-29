#!/usr/bin/env node
/**
 * Local contract gate for /story — no Next runtime required.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, "../..");
const repoRoot = join(webRoot, "../..");
const page = readFileSync(join(here, "page.tsx"), "utf8");
const content = readFileSync(join(here, "story-content.ts"), "utf8");
const css = readFileSync(join(here, "story.module.css"), "utf8");
const bookIdPage = readFileSync(join(here, "../books/[bookId]/page.tsx"), "utf8");
const chapterPage = readFileSync(join(here, "../books/[bookId]/[chapterId]/page.tsx"), "utf8");

const requiredHrefs = [
  "/books",
  "/books/book1/the-storm-that-remembered",
  "/books/docs/founding-myths",
  "/gallery",
  "/books/song-of-van-linh/01-subject-7",
  "/books/lumara-valle-de-los-destellos/print",
];

const requiredCanon = [
  "Lumina blazed forth not as fire but as form",
  "In the beginning, there was Nero",
  "The sea remembered things the town had forgotten",
];

const banned = ["Coming soon", "lorem ipsum", "8th luminor", "Space Grotesk"];

const stills = [
  join(webRoot, "public/story/first-light.webp"),
  join(webRoot, "public/story/aethermoor-dawn.webp"),
];

const covers = [
  join(webRoot, "public/images/books/lumara-valle-de-los-destellos-cover-v2.png"),
  join(webRoot, "public/images/books/song-of-van-linh-cover.png"),
];

const booksPage = readFileSync(join(here, "../books/page.tsx"), "utf8");
const artbookBlock = content.slice(content.indexOf("export const ARTBOOK"));
const artbookTiles = [...artbookBlock.matchAll(/title:\s*"([^"]+)"\s*,\s*href:\s*"([^"]+)"/g)].map(
  (m) => ({ title: m[1], href: m[2] }),
);

function normTitle(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseCatalog(src) {
  const catalog = new Map();
  const re = /['"]([a-z0-9-]+)['"]:\s*\{\s*title:\s*['"]([^'"]+)['"]/g;
  for (const match of src.matchAll(re)) {
    catalog.set(match[1], match[2]);
  }
  return catalog;
}

const liveBooks = new Map([...parseCatalog(bookIdPage), ...parseCatalog(chapterPage)]);

function chapterFiles(bookId) {
  const dirs = [join(repoRoot, "book", bookId, "chapters"), join(repoRoot, "book", "chapters", bookId)];
  const files = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    files.push(...readdirSync(dir).filter((name) => name.endsWith(".md")));
  }
  return files;
}

function liveRouteFor(href) {
  const parts = href.split("/").filter(Boolean);
  if (parts[0] !== "books" || parts.length < 2) return null;
  const bookId = parts[1];
  const rest = parts.slice(2);
  const staticPage = join(webRoot, "app", ...parts, "page.tsx");
  if (existsSync(staticPage)) {
    return { bookId, kind: "static", rest };
  }
  if (rest.length === 0 && liveBooks.has(bookId)) {
    return { bookId, kind: "book", rest };
  }
  if (rest.length === 1 && liveBooks.has(bookId)) {
    const slug = rest[0];
    const files = chapterFiles(bookId);
    const hasChapter = files.some(
      (name) => name === `${slug}.md` || name.startsWith(`${slug}.`) || name.startsWith(`${slug}-`),
    );
    if (hasChapter) return { bookId, kind: "chapter", rest };
  }
  return null;
}

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

for (const href of requiredHrefs) {
  check(`live href ${href}`, content.includes(href) || page.includes(href));
}
for (const phrase of requiredCanon) {
  check(`canon phrase present`, content.includes(phrase), phrase);
}
for (const phrase of banned) {
  const hay = `${page}\n${content}\n${css}`;
  check(`no banned phrase: ${phrase}`, !hay.toLowerCase().includes(phrase.toLowerCase()));
}
for (const file of [...stills, ...covers]) {
  let size = 0;
  try {
    size = statSync(file).size;
  } catch {
    size = 0;
  }
  check(`asset exists (${size}b) ${file.replace(webRoot, "")}`, size > 80_000);
}

check("uses next/image", page.includes('from "next/image"'));
check("reduced-motion gate", css.includes("prefers-reduced-motion"));
check("no navbar edit in this slice", !page.includes("Navbar"));
check("inbound /story from /books", /href=["']\/story["']/.test(booksPage));
check("library index is not a live ARTBOOK route", liveRouteFor("/books") === null && liveRouteFor("/books/") === null);
check("ARTBOOK has at least two live titles", artbookTiles.length >= 2);
for (const tile of artbookTiles) {
  const href = tile.href;
  const notIndex = href.startsWith("/books/") && href !== "/books" && href !== "/books/";
  check(`ARTBOOK href is not library index: ${tile.title} → ${href}`, notIndex);
  const route = notIndex ? liveRouteFor(href) : null;
  check(`ARTBOOK href is a live book route: ${tile.title} → ${href}`, Boolean(route));
  if (!route) continue;
  const catalogTitle = liveBooks.get(route.bookId);
  check(
    `ARTBOOK title maps to catalog ${route.bookId}`,
    Boolean(catalogTitle) && normTitle(tile.title) === normTitle(catalogTitle),
    catalogTitle ? `${tile.title} vs ${catalogTitle}` : "missing catalog title",
  );
  const chapters = chapterFiles(route.bookId);
  check(
    `ARTBOOK book is readable now: ${route.bookId}`,
    chapters.length > 0,
    `${chapters.length} chapter file(s)`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nALL CHECKS PASSED");
