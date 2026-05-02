#!/usr/bin/env node
/**
 * Generate NB2 cover variants for "Das Mädchen, das drei Sprachen hörte"
 * Brief: docs/design-briefs/2026-05-02-das-maedchen-drei-sprachen-cover.md
 *
 * Usage:
 *   GEMINI_API_KEY=ya29... node scripts/gen-mila-cover.mjs
 *   GEMINI_API_KEY=ya29... node scripts/gen-mila-cover.mjs v2  # single variant
 *
 * Get key: https://aistudio.google.com/apikey
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY. Get one at https://aistudio.google.com/apikey");
  process.exit(1);
}

const MODEL = "gemini-3.1-flash-image-preview"; // NB2 default per skill
const OUT_DIR = "apps/web/public/images/books";
const SLUG = "das-maedchen-drei-sprachen";

const ANTI = [
  "no Pixar eyes, no anime eyes, no glossy plastic skin",
  "no Disney mouth shapes, no smiling-tooth grin, no posed cheer",
  "no glitter, no sparkle particles, no lens flares, no bokeh dots, no fairy dust",
  "no rainbow gradients, no magenta/cyan duotone, no neon, no saturated sky",
  "no digital airbrush smoothness, no render-engine lighting, no 3D depth-of-field",
  "no bougainvillea cliché, no white-and-blue Greek-island palette, no Venetian gondolas",
  "no magical-girl tropes, no wand, no tiara, no swirling sleeves, no kawaii sidekicks",
  "no invented plants — must read as real Helichrysum italicum (small clustered papery yellow florets, narrow grey-green leaves, woody base)",
  "no symmetrical centred portrait, no eye-contact-with-camera, no hero-pose",
  "no fantasy script title font, no gold-foil-stamp effect, no drop shadow on type",
].join("; ");

const SHARED_HEAD = `Generate an image: literary children's picture-book cover, portrait orientation, 2:3 ratio.

STYLE REFERENCES: Beatrice Alemagna, Sydney Smith, Komako Sakai, Tomi Ungerer, Carson Ellis. Studio Ghibli backgrounds (Kazuo Oga). Gouache and coloured pencil on warm cream paper. Visible brush texture and pencil grain. Slightly imperfect by hand. Matte, hand-painted, restrained.

PALETTE: three hues only — warm limestone cream (#f0e3cb), dirty smilje gold (#d8a73a), dusty Adriatic teal (#a8c4c0). One gold accent for the lit smilje. One cool accent (Luna's black plus the sea slip). No third hue. No gradient sky — sky is a single dusty wash.

LIGHTING: golden-hour from upper left, raking across limestone. One smilje cluster lit one stop hotter than the rest — like firefly light, not fairy dust.

TYPOGRAPHY: leave the lower-third clear and uncluttered for title type to be applied later. Do NOT generate any text or letters in the image.

MOOD: bittersweet wonder. Quiet displacement turning into quiet belonging. Janosch warmth meets Astrid Lindgren's Saltkrokan island stillness meets Cornelia Funke's Adriatic gravity. The pause before a word is spoken.

TECHNICAL: book cover composition, hand-painted gouache surface, restrained value range, narrow midtone band, no AI-render artifacts.

ANTI-PATTERNS: ${ANTI}.`;

const VARIANTS = {
  v1: {
    file: `${SLUG}-cover-v1.png`,
    label: "balanced — knee-level Mila + Luna composition (closest to brief)",
    scene: `SCENE: A six-year-old girl named Mila in a simple linen dress kneels at a low Croatian drystone limestone wall on Mali Lošinj. She is in three-quarter profile, her face partly turned away. Her right hand reaches slowly toward a cluster of real smilje (Helichrysum italicum) growing from a crack in the limestone — hand near, not touching, the moment before naming. A small black harbour cat with a single round white moon-mark over its left eye sits on the wall to her right, tail curled, watching the wall. Behind: a thin dusty-teal slip of Adriatic, far horizon a tiny single dolphin curve breaching, readable only on second look.

COMPOSITION: Mila on left third, Luna on right third, smilje cluster centre on the wall ridge. Lower third deliberately empty for title type. Foreground: limestone wall with smilje. Mid-ground: Mila + Luna. Background: dusty-teal Adriatic slip with tiny dolphin curve.`,
  },
  v2: {
    file: `${SLUG}-cover-v2.png`,
    label: "intimate — tight on the hand-and-smilje moment, Mila's face partially out of frame",
    scene: `SCENE: Close intimate framing of a six-year-old girl's small hand reaching slowly toward a cluster of real smilje (Helichrysum italicum, small papery yellow florets, narrow grey-green leaves) growing from a crack in a sun-warm Croatian limestone drystone wall on Mali Lošinj. Hand near, not touching — the moment before naming. The girl's linen-dress sleeve, shoulder, and chin are visible at the upper edge of frame, face mostly out of frame. A black harbour cat with a single white moon-mark over its left eye sits on the wall behind the smilje, watching, slightly out of focus. Beyond the wall: a thin slip of dusty-teal Adriatic.

COMPOSITION: hand and smilje cluster on rule-of-thirds intersection. Foreground: limestone surface texture. Mid-ground: hand + smilje + cat. Background: soft Adriatic slip. Lower third deliberately empty for title type.`,
  },
  v3: {
    file: `${SLUG}-cover-v3.png`,
    label: "wider — Mali Lošinj wall recedes, more Adriatic and dolphin curve, Luna foregrounded",
    scene: `SCENE: Wider framing showing the Croatian drystone limestone wall receding into the middle distance on a Mali Lošinj hillside. A six-year-old girl named Mila in a simple linen dress is small in the frame, kneeling at the wall in three-quarter profile, her hand reaching toward a cluster of smilje (Helichrysum italicum). A black harbour cat with a single white moon-mark over its left eye sits foregrounded on a closer stone, watching the girl, larger in frame than her. Beyond the wall and the headland: a generous expanse of dusty-teal Adriatic, with two tiny dolphin curves breaching at far horizon. A single Aleppo pine silhouette to the right edge.

COMPOSITION: Luna foreground left, Mila + wall middle distance, sea + horizon expanding right. The lit smilje cluster catches the only hot light. Lower third deliberately empty for title type.`,
  },
};

async function generate(name, variant) {
  const prompt = `${SHARED_HEAD}\n\n${variant.scene}`;

  console.log(`\n[${name}] ${variant.label}`);
  console.log(`[${name}] calling ${MODEL}...`);

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
    console.error(`[${name}] FAIL ${res.status}: ${err.slice(0, 400)}`);
    return false;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];

  let saved = false;
  for (const p of parts) {
    if (p.inlineData?.data) {
      const buf = Buffer.from(p.inlineData.data, "base64");
      mkdirSync(OUT_DIR, { recursive: true });
      const out = join(OUT_DIR, variant.file);
      writeFileSync(out, buf);
      console.log(`[${name}] OK ${(buf.length / 1024).toFixed(0)}KB → ${out}`);
      saved = true;
    } else if (p.text) {
      console.log(`[${name}] text: ${p.text.slice(0, 200)}`);
    }
  }

  if (!saved) {
    console.error(`[${name}] no image data in response`);
    return false;
  }
  return true;
}

const which = process.argv[2];
const targets = which ? [which] : ["v1", "v2", "v3"];
const results = {};
for (const t of targets) {
  if (!VARIANTS[t]) {
    console.error(`unknown variant ${t} (have: ${Object.keys(VARIANTS).join(", ")})`);
    continue;
  }
  results[t] = await generate(t, VARIANTS[t]);
}

console.log("\n=== summary ===");
for (const [t, ok] of Object.entries(results)) {
  console.log(`${t}: ${ok ? "OK" : "FAILED"}`);
}
console.log(`\nNext: review images, pick best, then run /design-generator to wire the page hero.`);
