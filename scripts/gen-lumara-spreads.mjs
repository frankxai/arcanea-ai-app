#!/usr/bin/env node
/**
 * Generate 10 NB2 chapter spreads for "Lumara — el valle donde las chispas crecen como flores"
 *
 * One spread per chapter. Same Lumara style bible as the cover. Locked character
 * consistency for Lila and Conejito across all 10 images — Aurelia consistent
 * across Ch9-10. Same nocturnal three-hue palette. Same anti-AI-slop rules.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/gen-lumara-spreads.mjs        # all ten
 *   GEMINI_API_KEY=... node scripts/gen-lumara-spreads.mjs ch03   # one only
 *
 * Get key: https://aistudio.google.com/apikey
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const MODEL = "gemini-3.1-flash-image-preview"; // NB2
const OUT_DIR = "apps/web/public/images/books";
const SLUG = "lumara-valle-de-las-chispas";

const ANTI = [
  "no Pixar eyes, no anime eyes, no glossy plastic skin, no Disney mouth shapes",
  "no smiling-tooth grin, no posed cheer, no hero-pose, no eye-contact-with-camera",
  "no glitter, no sparkle particles, no fairy dust, no lens flares, no bloom",
  "no rainbow gradients, no neon, no magenta/cyan duotone, no unicorn palette",
  "no digital airbrush, no render-engine lighting, no 3D depth-of-field",
  "no magical-girl tropes, no wands, no tiaras, no kawaii sidekicks, no chibi",
  "no text, no letters, no numbers anywhere in the image",
  "no AI-render artifacts, no plastic surface",
].join("; ");

const SHARED_HEAD = `Generate an image: literary children's picture-book interior spread, landscape orientation, 4:3 ratio.

STYLE: gouache and coloured pencil on warm cream paper, with selective metallic-ink touches on the florchispas only. Visible brush texture and pencil grain. Slightly imperfect by hand. In the tradition of Issa Watanabe (Migrantes), Komako Sakai (The Lonely Cat, Emily's Balloon), Beatrice Alemagna, Lisbeth Zwerger, and Studio Ghibli backgrounds at night (Kazuo Oga's nocturnes for My Neighbor Totoro and Princess Mononoke). Matte, hand-painted, restrained — never Disney render, never anime cel, never fantasy concept art.

PALETTE — STRICT THREE HUES:
  • deep dusty plum-violet (#2a1f4a) — Lumara sky and ambient ground
  • florchispa gold-silver (#e4c074) — the only glow accent, used sparingly
  • warm cream linen (#f3e8d4) — Lila's skin, nightgown, moonlight wash
One rare warm honey accent (#f0c876) ONLY for the farolito flame when present.
No additional colors. No gradient sky — a single dusty plum wash with tiny pencil-point stars.

LIGHTING: only sources are the florchispas (soft pulsing gold-silver, one stop above ambient), the creature being greeted (sometimes itself glowing softly), and an occasional cool cream moon wash from upper-left or upper-right. No fairy dust. The glow is felt, not blown out.

LILA (consistent across every image):
  • six years old, real child proportions, NOT chibi
  • light brown slightly wavy shoulder-length hair
  • plain cream linen nightgown to the knees
  • bare feet or rabbit-shaped slippers
  • calm attentive face — eyes normal-sized for a real child, NEVER anime-wide
  • always carrying Conejito (small off-white handmade-style stuffed bunny, long floppy ears, one slightly drooped, slight loved-look wear)

AURELIA (only when SCENE specifies):
  • six years old, dark hair in a single long braid down her back
  • ONE florchispa woven into the braid (glows gold-silver)
  • plain white-silver shift dress
  • barefoot, calm, watchful

FLORCHISPAS:
  • five-petalled pentagonal flowers, silver edges, gold heart
  • no larger than a child's fingernail unless SCENE specifies
  • each glows ONE stop hotter than ambient, soft never glaring

TYPOGRAPHY: leave breathing room on one side for caption text to be applied later. Do NOT generate any text or letters in the image.

MOOD: wondrous, hushed, bedtime-sacred. The pause before a child understands. Studio Ghibli at night meets Beatrice Alemagna's children's gravity meets Saint-Exupéry.

ANTI-PATTERNS: ${ANTI}.`;

// ─── PER-CHAPTER SPREADS ────────────────────────────────────────────────────
const SPREADS = {
  ch01: {
    label: "the threshold and the firefly",
    file: `${SLUG}-ch01.png`,
    scene: `SCENE: Interior of Lila's small old-fashioned bedroom at night. On the wooden windowsill: a small worn-bronze oil lamp (the farolito) whose honey-coloured flame has just split into a slow loose cloud of tiny gold-silver chispas (sparks the size of apple seeds) drifting outward toward the open window. Lila, in plain cream linen nightgown, has just slipped off the edge of her bed and stands beside the sill in three-quarter profile, Conejito tucked under one arm, her small free hand half-raised in soft astonishment. Through the open window: a deep dusty plum-violet night sky with two stars between which a faint moonlight rectangle is just beginning to brighten — the doorway, suggested not declared.

COMPOSITION: Lila on right-third, farolito at sill centre, the rising chispa-cloud forms a soft diagonal from flame through window. Bed corner foreground left. The two stars and faint doorway upper-left.

LIGHTING: farolito honey flame is the only warm pool; rest of room cool plum-violet shadow.`,
  },

  ch02: {
    label: "Lila stepping into the river of crystal",
    file: `${SLUG}-ch02.png`,
    scene: `SCENE: A wide nocturnal river of perfectly transparent water flowing slowly between pale rose-pink limestone stones (one large round boulder upper-left). Lila stands ankle-deep at the near shore in three-quarter profile, having just stepped in — her cream linen nightgown hem brushing the water, her bare feet visible through the clear water as pale shapes. Just under the surface near her ankle: a small luminous fish (pez de luz) the size of her little finger, made entirely of soft cool cream-white-blue light, swimming a slow tight figure-eight around her ankle. Conejito sits patiently on the dry shore behind her, watching. A scatter of florchispas grows between the shore stones, each soft gold-silver.

COMPOSITION: Lila left-third, fish at her ankle centre, Conejito small right-foreground on shore. River fills lower two-thirds; deep plum-violet sky upper-third with one tiny rose-pink river-boulder cresting.

LIGHTING: ambient plum-violet, with the pez de luz glowing cool cream-blue around Lila's ankle — the brightest point in the image. Florchispas as quiet gold satellites.`,
  },

  ch03: {
    label: "Lila and the hummingbird who sings colors",
    file: `${SLUG}-ch03.png`,
    scene: `SCENE: A nocturnal meadow of taller florchispas, the size of small tulips. Lila in cream linen nightgown stands quietly with her right index finger extended toward a tiny hummingbird (colibrí) hovering inches from her fingertip. The colibrí's wings are blurred soft, plumage suggested in iridescent green-violet-gold strokes. From the colibrí's tiny open beak, a single short rose-pink stroke of pure colour extends into the air between bird and finger — the visible note. Earlier notes hang fading in the air as faint pastel ghosts: a yellow stroke, a deep blue stroke, both barely visible. Conejito tucked under Lila's other arm. Florchispas softly glowing all around.

COMPOSITION: Lila left of centre, colibrí mid-air right-of-centre, the rose-pink colour-stroke connecting them on the rule-of-thirds horizontal. Florchispas as soft gold field foreground and midground.

LIGHTING: ambient plum, with the soft gold florchispa field providing scattered glow. The colour-strokes from the colibrí are the only saturated marks in the otherwise restrained palette — kept small, single brushstrokes, never shouting.`,
  },

  ch04: {
    label: "the snail with a galaxy inside",
    file: `${SLUG}-ch04.png`,
    scene: `SCENE: Close intimate framing — Lila lying belly-down on a warm pale rose flat limestone slab, her chin propped on the back of her two hands, calm focused face in three-quarter profile, looking close at something tiny. In front of her, life-sized to her gaze: a small snail emerging from a crevice in the rock, its shell no larger than her fingernail. The shell visibly contains a tiny swirling galaxy — a faint pink-mauve spiral nebula at its centre, tiny pencil-point stars rendered with metallic-ink touches. The snail's two antennae raised toward Lila. Conejito beside her elbow on the rock. A few small florchispas growing between rock cracks, soft gold.

COMPOSITION: Lila's face and crossed hands fill the left two-thirds, the snail and its tiny galaxy-shell at right-third rule-of-thirds intersection. Most of the frame is the warm rose-limestone surface — patient, quiet, slow.

LIGHTING: cool cream moon wash from upper-left across the rock; the snail's galaxy-shell glows from within in a faint mauve, the brightest soft point in the frame.`,
  },

  ch05: {
    label: "Lila offering a florchispa to the silver fox",
    file: `${SLUG}-ch05.png`,
    scene: `SCENE: A grove of slender silver-leafed trees at night, leaves rendered as fine pencil strokes. Lila kneels on one knee in three-quarter profile, her right palm outstretched flat with a single freshly-picked florchispa lying on it — five petals, silver-edged, glowing gold heart. A small silver-blue fox (zorrito) stands a few steps away, partially behind a slender tree trunk, head out, peering, one paw lifted in suspended curiosity, fluffy tail with the brightest tip. Their eyes meet quietly across the small distance. Conejito sits in Lila's lap. Florchispas grow softly between the silver trees.

COMPOSITION: Lila on left-third kneeling, the fox emerging from behind a tree on right-third at the same eye-line, the offered florchispa exactly centred between them at the lower-third axis. Silver-leaf branches arching softly across the top.

LIGHTING: cool moon wash through silver leaves, dappling the ground. The florchispa on Lila's palm and the fox's tail-tip are the two warm anchors — small, soft, never glaring.`,
  },

  ch06: {
    label: "Lila and the butterfly painting the air",
    file: `${SLUG}-ch06.png`,
    scene: `SCENE: A floating island-garden suspended in deep night sky — the island itself a small platform of soft plum-violet earth with large florchispas (the size of Lila's hand) growing along its edges. Below the island and above it: the deep plum-violet Lumara sky with tiny pencil-point stars on all sides (no horizon line visible). Lila stands at the centre of the island, Conejito under one arm, mouth softly parted in quiet wonder. A small black-winged butterfly (mariposa) hovers near her face, its wings tinted matte ink-black. In the air around the butterfly: short trailing brushstrokes of pure colour left by recent wingbeats — a gold curve, a violet arc, a green-water swoosh — fading into the dark like pencil ghosts. From Lila's softly-parted lips: a single faint cream-coloured stroke of her own response, just emerging into the air.

COMPOSITION: island fills the lower third with its florchispa-rim, Lila centre on the island, butterfly hovering rule-of-thirds right of her face. The colour-strokes scatter the upper two-thirds — sparse, never busy.

LIGHTING: only the island's florchispas glow, casting soft gold up onto Lila and onto the butterfly's underside. The colour-strokes are the only saturated marks; everything else stays in the restrained palette.`,
  },

  ch07: {
    label: "the owl and the long silence",
    file: `${SLUG}-ch07.png`,
    scene: `SCENE: An ancient old-growth forest at night. Massive dark tree trunks recede into deep plum. On a low thick branch in the middle distance: a large old owl (lechuza) with luna-pale plumage, two enormous amber eyes calmly fixed forward. Below the owl, on a raised tree root at the forest floor: Lila sitting cross-legged, Conejito in her lap, in three-quarter profile, her small face turned up toward the owl in mirror stillness — patient, quiet, waiting together. A scant few small florchispas grow shy between the roots, their glow muted.

COMPOSITION: owl on upper-right rule-of-thirds, Lila on lower-left rule-of-thirds, a long diagonal of attention between them. The vast dark forest fills the rest. Negative space dominates.

LIGHTING: very dim, almost monochrome plum-violet, with only the owl's amber eyes and the few small florchispas providing tiny warm accents. This image is the quietest of all ten — the value range deliberately narrow.`,
  },

  ch08: {
    label: "the candle-antlered deer and the gift of flame",
    file: `${SLUG}-ch08.png`,
    scene: `SCENE: A high plateau-meadow under a vast plum-violet sky, hand-tall florchispas glowing in scattered constellation across the ground. Lila kneels in three-quarter profile in the foreground, both small hands cupped open in front of her, Conejito sitting beside her bare knee. A large stately deer (ciervo) — coat the colour of warm hazel — stands close, head lowered toward her cupped hands; on each branch tip of its wide antlered crown, a tiny warm honey-coloured candle flame burns calmly (count: about ten candles, soft). From one antler-tip candle a single small flame has just detached and floats slowly downward toward Lila's open palms — a gift in mid-air.

COMPOSITION: Lila bottom-left, the deer's lowered head and antlered crown filling upper-right two-thirds. The descending flame at the rule-of-thirds intersection above her hands. A soft silver mist curls around the deer's hooves and Lila's knees.

LIGHTING: the antler-tip candles are the dominant warm light, washing soft honey onto Lila's upturned face and onto the deer's lowered head; the rest of the meadow holds the cool plum-violet ambient with scattered florchispa gold.`,
  },

  ch09: {
    label: "Lila and Aurelia, two florchispas glowing as one",
    file: `${SLUG}-ch09.png`,
    scene: `SCENE: A small round clearing in a young silver-leaf grove at night. At the centre, under a single graceful tree with a milk-cream trunk and soft drooping branches: Lila (cream linen nightgown, Conejito by her side) and Aurelia (white-silver shift dress, single long dark braid with ONE glowing florchispa woven in) sit cross-legged facing each other, knees almost touching, holding both each other's small hands. Their faces are calm and serious — the gravity of meeting another child like yourself. Between them, on the ground, two florchispa flowers (one closer to Lila, one closer to Aurelia) both pulse gold-silver in synchrony — clearly the brightest paired light source in the image. The grove's silver florchispas form a soft glowing ring around the two girls.

COMPOSITION: the two girls form a near-symmetrical pair at the rule-of-thirds horizontal centre, but the milk-cream tree trunk behind them is offset slightly left to break symmetry. The ring of florchispas frames them softly.

LIGHTING: the paired florchispas between them are the dominant light, casting soft gold onto both girls' faces equally. Aurelia's braid-florchispa is a smaller third anchor. Cool moon wash from upper-right across the silver leaves.`,
  },

  ch10: {
    label: "el árbol de los nombres — Lila gives her name back",
    file: `${SLUG}-ch10.png`,
    scene: `SCENE: The heart of Lumara. An enormous ancient tree fills the upper two-thirds of the frame, its trunk wide as a small house, bark the colour of warm farolito honey-light, branches spreading wide and high in all directions. Instead of leaves, the tree carries thousands upon thousands of florchispas across every branch — a soft constellation of gold-silver points against the deep dusty plum-violet sky. Lila, small in the lower-left foreground, stands with her bare hand pressed flat against the warm trunk; her face is in three-quarter profile, calm, two tiny silver tear-tracks just barely visible on her cheek. Where her hand touches: a fresh new florchispa has just bloomed on the bark, glowing gold-violet in its centre, brighter than the rest. Aurelia stands a few quiet steps behind, smiling softly with her eyes. Conejito at Lila's feet on the soft ground.

COMPOSITION: Lila lower-left rule-of-thirds, her hand and the new florchispa-on-bark at the focal point. The tree's massive trunk anchors centre, its glowing crown spreading across the top two-thirds. Aurelia smaller behind right. The sky between branches scattered with tiny pencil-point stars.

LIGHTING: the tree's florchispa-crown casts the dominant soft gold-silver ambient wash across the whole foreground. The new florchispa under Lila's palm is the single hottest point. No moon needed — the tree itself is the light source.`,
  },
};

// ─── GENERATE ───────────────────────────────────────────────────────────────
async function generate(name, spread) {
  const prompt = `${SHARED_HEAD}\n\n${spread.scene}\n\nTECHNICAL: 4:3 landscape, picture-book interior spread, hand-painted gouache surface, restrained value range, NO text or letters anywhere.`;

  console.log(`\n[${name}] ${spread.label}`);
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
      const out = join(OUT_DIR, spread.file);
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
const targets = which ? [which] : Object.keys(SPREADS);
const results = {};
for (const t of targets) {
  if (!SPREADS[t]) {
    console.error(`unknown ${t}; have ${Object.keys(SPREADS).join(", ")}`);
    continue;
  }
  results[t] = await generate(t, SPREADS[t]);
}

console.log("\n=== summary ===");
for (const [t, ok] of Object.entries(results)) console.log(`${t}: ${ok ? "OK" : "FAILED"}`);
const okCount = Object.values(results).filter(Boolean).length;
console.log(`\n${okCount}/${Object.keys(results).length} spreads generated → ${OUT_DIR}/`);
