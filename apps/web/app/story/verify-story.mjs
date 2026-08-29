#!/usr/bin/env node
/**
 * Local contract gate for /story — no Next runtime required.
 */
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, "../..");
const page = readFileSync(join(here, "page.tsx"), "utf8");
const content = readFileSync(join(here, "story-content.ts"), "utf8");
const css = readFileSync(join(here, "story.module.css"), "utf8");

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
  join(webRoot, "public/images/books/las-tierras-de-luz-cover-v2.png"),
  join(webRoot, "public/images/books/song-of-van-linh-cover.png"),
];

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

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nALL CHECKS PASSED");
