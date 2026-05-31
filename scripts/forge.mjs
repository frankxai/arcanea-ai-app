#!/usr/bin/env node
/**
 * Arcanea image forge — generic.
 *
 * Reads markdown prompt files from a book's `forge/` directory and generates
 * images via the Gemini API. Defaults to Imagen 4 Ultra for finished art;
 * use `--fast` to switch to NB2 (Nano Banana 2) for cheaper iteration.
 *
 * Why markdown? So prompts are editable by anyone — from any markdown editor,
 * including mobile — without touching JavaScript. The script just concatenates
 * the shared style bible with the per-scene brief.
 *
 * Usage:
 *   node scripts/forge.mjs <book-slug> <scene>           # one scene, Imagen 4 Ultra
 *   node scripts/forge.mjs <book-slug> <scene> --fast    # one scene, NB2 (iteration)
 *   node scripts/forge.mjs <book-slug> all               # every scene
 *   node scripts/forge.mjs <book-slug> all --fast        # every scene, NB2
 *
 * Examples:
 *   GEMINI_API_KEY=... node scripts/forge.mjs lumara-valle-de-las-chispas cover-v2
 *   GEMINI_API_KEY=... node scripts/forge.mjs lumara-valle-de-las-chispas spread-ch07 --fast
 *
 * File layout it expects:
 *   book/<slug>/forge/STYLE.md          — shared style bible (one per book)
 *   book/<slug>/forge/<scene>.md        — per-image scene brief
 *
 * Output:
 *   apps/web/public/images/books/<slug>-<scene>.png
 *
 * Get a key: https://aistudio.google.com/apikey (free tier covers daily use)
 */

import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY.");
  console.error("");
  console.error("  Easiest: add it once to your Claude Code env config");
  console.error("  (Settings → Environments → Environment Variables)");
  console.error("  — then it's available in every future web/mobile session.");
  console.error("");
  console.error("  Or locally: export GEMINI_API_KEY=AIza...");
  console.error("  Get a key: https://aistudio.google.com/apikey");
  process.exit(1);
}

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));
const [bookSlug, sceneName] = positional;

if (!bookSlug || !sceneName) {
  console.error("Usage: node scripts/forge.mjs <book-slug> <scene> [--fast]");
  console.error("Example: node scripts/forge.mjs lumara-valle-de-las-chispas cover-v2");
  process.exit(1);
}

const FORGE_DIR = `book/${bookSlug}/forge`;
const OUT_DIR = "apps/web/public/images/books";

if (!existsSync(FORGE_DIR)) {
  console.error(`Forge directory not found: ${FORGE_DIR}`);
  process.exit(1);
}

// ─── Model selection ────────────────────────────────────────────────────────
const USE_FAST = flags.has("--fast");
const MODEL = USE_FAST
  ? "gemini-3.1-flash-image-preview" // NB2, fast iteration
  : "imagen-4.0-ultra-generate-001"; // Imagen 4 Ultra, finished art

// ─── Style bible ────────────────────────────────────────────────────────────
const stylePath = join(FORGE_DIR, "STYLE.md");
if (!existsSync(stylePath)) {
  console.error(`Style bible not found: ${stylePath}`);
  process.exit(1);
}
const style = readFileSync(stylePath, "utf8");

// ─── Which scenes ───────────────────────────────────────────────────────────
const RESERVED = new Set(["STYLE.md", "HOW-TO.md", "README.md"]);
const scenes =
  sceneName === "all"
    ? readdirSync(FORGE_DIR)
        .filter((f) => f.endsWith(".md") && !RESERVED.has(f))
        .map((f) => f.replace(/\.md$/, ""))
        .sort()
    : [sceneName];

console.log(`Forge: ${bookSlug}`);
console.log(`Model: ${MODEL}${USE_FAST ? " (fast iteration)" : " (finished art)"}`);
console.log(`Scenes: ${scenes.join(", ")}`);
console.log("");

const results = {};
for (const scene of scenes) {
  const scenePath = join(FORGE_DIR, `${scene}.md`);
  if (!existsSync(scenePath)) {
    console.error(`[${scene}] scene not found: ${scenePath}`);
    results[scene] = false;
    continue;
  }
  const sceneText = readFileSync(scenePath, "utf8");
  const prompt = `${style}\n\n---\n\n${sceneText}`;
  try {
    results[scene] = await generate(scene, prompt);
  } catch (err) {
    console.error(`[${scene}] unexpected error during generation:`, err);
    results[scene] = false;
  }
}

console.log("\n=== summary ===");
for (const [s, ok] of Object.entries(results)) console.log(`${s}: ${ok ? "OK" : "FAILED"}`);

// ─── Generation paths ───────────────────────────────────────────────────────

async function generate(scene, prompt) {
  console.log(`[${scene}] calling ${MODEL}...`);
  return USE_FAST ? generateNB2(scene, prompt) : generateImagen4Ultra(scene, prompt);
}

async function generateImagen4Ultra(scene, prompt) {
  const aspectRatio = scene.startsWith("cover") ? "3:4" : "4:3";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          // safety / quality on max
        },
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    console.error(`[${scene}] FAIL ${res.status}: ${err.slice(0, 400)}`);
    return false;
  }
  const data = await res.json();
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) {
    console.error(`[${scene}] no image data in response`);
    return false;
  }
  return saveImage(scene, b64);
}

async function generateNB2(scene, prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    console.error(`[${scene}] FAIL ${res.status}: ${err.slice(0, 400)}`);
    return false;
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    if (p.inlineData?.data) return saveImage(scene, p.inlineData.data);
    if (p.text) console.log(`[${scene}] text: ${p.text.slice(0, 200)}`);
  }
  console.error(`[${scene}] no image data in response`);
  return false;
}

function saveImage(scene, b64) {
  const buf = Buffer.from(b64, "base64");
  mkdirSync(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, `${bookSlug}-${scene}.png`);
  writeFileSync(out, buf);
  console.log(`[${scene}] OK ${(buf.length / 1024).toFixed(0)}KB → ${out}`);
  return true;
}
