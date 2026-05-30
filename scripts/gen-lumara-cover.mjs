#!/usr/bin/env node
/**
 * Generate NB2 cover variants for "Lumara — el valle donde las chispas crecen como flores"
 *
 * Three cover variants capturing three different beats of the book:
 *   v1 — the threshold (Ch 1): Lila at the windowsill, farolito flame splitting into sparks
 *   v2 — the meadow (Ch 3): Lila kneeling in the florchispa pradera at night
 *   v3 — the great tree (Ch 10): Lila + Aurelia hand in hand before el árbol de los nombres
 *
 * Mirrors the architecture of gen-mila-cover.mjs (commit 5af94ca2). Same NB2 model.
 * Same lower-third-clear-for-type rule. Same anti-AI-slop discipline.
 * Different visual register: nocturnal, glow-of-attention, Ghibli-at-night meets
 * Komako Sakai meets Issa Watanabe — NOT Disney render, NOT anime cel.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/gen-lumara-cover.mjs        # all three
 *   GEMINI_API_KEY=... node scripts/gen-lumara-cover.mjs v1     # one only
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

const MODEL = "gemini-3.1-flash-image-preview"; // NB2
const OUT_DIR = "apps/web/public/images/books";
const SLUG = "lumara-valle-de-las-chispas";

// ─── ANTI-PATTERNS ──────────────────────────────────────────────────────────
const ANTI = [
  "no Pixar eyes, no anime eyes, no glossy plastic skin, no Disney mouth shapes",
  "no smiling-tooth grin, no posed cheer, no hero-pose, no eye-contact-with-camera",
  "no glitter, no sparkle particles, no fairy dust, no lens flares, no bloom, no bokeh dots",
  "no rainbow gradients, no neon palette, no magenta/cyan duotone, no saturated unicorn sky",
  "no digital airbrush smoothness, no render-engine lighting, no 3D depth-of-field",
  "no magical-girl tropes, no wands, no tiaras, no kawaii sidekicks, no chibi proportions",
  "no fantasy-script title font, no gold-foil-stamp effect, no drop shadow on type",
  "no text, no letters, no numbers anywhere in the image",
  "no AI-render artifacts, no plastic surface, no over-rendered background",
  "no symmetrical centred hero portrait — always slight rule-of-thirds asymmetry",
].join("; ");

// ─── SHARED STYLE BIBLE ─────────────────────────────────────────────────────
const SHARED_HEAD = `Generate an image: literary children's picture-book cover, portrait orientation, 2:3 ratio.

STYLE: gouache and coloured pencil on warm cream paper, with selective metallic-ink touches on the florchispa flowers only. Visible brush texture and pencil grain. Slightly imperfect by hand. In the tradition of Issa Watanabe (Migrantes), Komako Sakai (The Lonely Cat, Emily's Balloon), Beatrice Alemagna, Lisbeth Zwerger, and Studio Ghibli backgrounds at night (Kazuo Oga's My Neighbor Totoro and Princess Mononoke forest nocturnes). Matte, hand-painted, restrained. Nighttime literary register — never Disney render, never anime cel, never fantasy-concept-art polish.

PALETTE — STRICT THREE HUES:
  • deep dusty plum-violet (#2a1f4a) — the Lumara sky and the ambient ground
  • florchispa gold-silver (#e4c074) — the only glow source, used sparingly
  • warm cream linen (#f3e8d4) — Lila's skin, her nightgown, the moonlight wash
One single rare warm honey accent (#f0c876) ONLY for the farolito flame when present.
No additional colors. No gradient sky — the sky is a single dusty plum wash with a few tiny stars rendered as individual pencil-point dots.

LIGHTING: the only light sources are the florchispas (soft pulsing gold-silver, like firefly light at the edge of focus, never brighter than one stop above ambient) and a single cool cream moon wash from upper-left or upper-right. NO fairy dust. NO sparkle particles. NO lens flare. The glow is felt, not exploded.

CHARACTER — LILA (must read consistent across all images):
  • six years old, real child proportions, NOT stylized chibi
  • light brown slightly-wavy shoulder-length hair
  • plain cream linen nightgown to the knees
  • bare feet or rabbit-shaped slippers
  • calm attentive face — eyes normal-sized for a real child, NEVER anime-wide
  • always carrying Conejito: a small handmade-style stuffed bunny, off-white, long floppy ears, one ear slightly drooped, slight loved-look wear

CHARACTER — AURELIA (only if scene specifies):
  • six years old, dark hair in a single long braid down her back
  • ONE florchispa woven into the braid (glows gold-silver)
  • plain white-silver shift dress
  • barefoot, calm, watchful

FLORCHISPAS (the magic flower):
  • five petals in pentagonal symmetry
  • silver-edged with a gold heart
  • no larger than a child's fingernail unless scene specifies otherwise
  • each glows ONE STOP HOTTER than ambient, soft never glaring
  • drawn with selective metallic-ink highlights on the gold centre

TYPOGRAPHY: leave the lower-third clear and uncluttered for title type to be applied later. Do NOT generate any text or letters in the image.

MOOD: wondrous, hushed, bedtime-sacred. The deep quiet of being shown something true. Studio Ghibli at night meets Beatrice Alemagna's children's gravity meets Saint-Exupéry's Petit Prince. The pause before a child understands.

TECHNICAL: book cover composition, hand-painted gouache surface, restrained value range, narrow midtone band, no AI-render artifacts.

ANTI-PATTERNS: ${ANTI}.`;

// ─── COVER VARIANTS ─────────────────────────────────────────────────────────
const VARIANTS = {
  v1: {
    file: `${SLUG}-cover-v1.png`,
    label: "threshold — Lila at the windowsill, farolito flame splitting (Ch 1 moment)",
    scene: `SCENE: A six-year-old girl named Lila in a plain cream linen nightgown sits on the wooden windowsill of an old room, three-quarter profile facing right toward an open window. On the sill before her: a small worn-bronze oil lamp (the farolito) with a single honey-coloured flame in the process of softly splitting into a cloud of tiny gold-silver chispas (sparks) the size of apple seeds. The chispas drift outward from the flame, forming a slow loose path that exits through the open window into the night. Through the window: a deep dusty plum-violet night sky with two stars between which a faint moonlight doorway is just beginning to open — read it as a slightly lighter rectangle of sky, no harsh edge. Lila holds Conejito (small off-white handmade-style stuffed bunny, long floppy ears, one slightly drooped) loosely under one arm.

COMPOSITION: Lila in the right two-thirds, foreground; the farolito and rising spark-cloud at centre on the sill; the open window framing the doorway-of-moonlight in the upper-left third; lower third deliberately empty for title type. Diagonal of sparks leading the eye from the flame out through the window.

LIGHTING: the only warm light is the farolito's honey flame, casting a small soft pool on Lila's hands and the sill. Cool plum-violet from outside the window dominates the rest. The chispas glow gold-silver, one stop above ambient.`,
  },

  v2: {
    file: `${SLUG}-cover-v2.png`,
    label: "meadow — Lila kneeling in the florchispa pradera at night (iconic single-image)",
    scene: `SCENE: A six-year-old girl named Lila in a plain cream linen nightgown kneels in three-quarter profile in a wide nocturnal meadow of florchispas (five-petalled silver-edged flowers with glowing gold centres), no taller than her hand. Her small hand reaches slowly toward a single brighter florchispa cluster — hand near, not touching, the moment before greeting. On a tall florchispa nearby, a tiny luciérnaga (firefly) rests, its small glow exactly one stop hotter than the surrounding florchispas. Conejito (small off-white handmade-style stuffed bunny, long floppy ears, one slightly drooped) sits on the grass beside Lila's bare knee, watching. Above and behind: the deep dusty plum-violet Lumara sky scattered with tiny pencil-point stars.

COMPOSITION: Lila on left third, the lit florchispa-and-firefly at the centre-right rule-of-thirds intersection, Conejito grounded between them. The meadow recedes softly into deeper plum at the upper edge. Lower third deliberately empty for title type. The reaching hand draws the eye toward the firefly.

LIGHTING: ambient deep plum-violet across the meadow. Florchispas glow soft gold-silver in scattered constellation, the lit cluster Lila reaches toward burning ONE stop hotter. The firefly is the single hottest point in the image — a quiet anchor, not an explosion.`,
  },

  v3: {
    file: `${SLUG}-cover-v3.png`,
    label: "great tree — Lila + Aurelia approaching el árbol de los nombres (Ch 10 finale)",
    scene: `SCENE: Two six-year-old girls walking hand in hand, seen from slightly behind and below, toward an enormous ancient tree in the deep middle distance. Left girl: Lila in plain cream linen nightgown, light brown wavy shoulder-length hair, Conejito tucked under her free arm (small off-white handmade-style stuffed bunny, long floppy ears). Right girl: Aurelia in plain white-silver shift dress, single long dark braid down her back with one glowing florchispa woven in. Both barefoot on a soft plum-violet ground scattered with florchispas. The great tree fills the upper two-thirds of the frame: bark the colour of warm farolito light, branches spreading wide and high, every branch holding thousands of glowing florchispas instead of leaves — a calm constellation of soft gold-silver points against the deep dusty plum-violet Lumara sky.

COMPOSITION: the two girls' small silhouettes lower-third centre-left, walking toward the tree. Tree centred upper-two-thirds, its glowing canopy a slow lattice of starlight-like flower-points. Lower third deliberately empty for title type. The hand-holding is the single emotional anchor.

LIGHTING: the tree's florchispas are the only glow source, scattered softly across the canopy like a dim constellation. The girls catch a faint reflected gold-silver wash on their hair and on the cream linen. No moon needed — the tree is the moon.`,
  },
};

// ─── GENERATE ───────────────────────────────────────────────────────────────
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
  if (!saved) console.error(`[${name}] no image data in response`);
  return saved;
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
for (const [t, ok] of Object.entries(results)) console.log(`${t}: ${ok ? "OK" : "FAILED"}`);
console.log(`\nNext: review images in ${OUT_DIR}/, pick the favourite, then run gen-lumara-spreads.mjs.`);
