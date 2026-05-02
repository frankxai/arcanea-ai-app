#!/usr/bin/env node
/**
 * Generate 10 NB2 chapter spreads for "Das Mädchen, das drei Sprachen hörte"
 * Per-chapter illustration brief locked by the German children's lit Author Council
 * (commit 5af94ca2). Same gouache-and-pencil register as the cover.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/gen-mila-spreads.mjs
 *   GEMINI_API_KEY=... node scripts/gen-mila-spreads.mjs ch03  # one only
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const MODEL = "gemini-3.1-flash-image-preview";
const OUT_DIR = "apps/web/public/images/books";
const SLUG = "das-maedchen-drei-sprachen";

const ANTI = [
  "no Pixar eyes, no anime eyes, no glossy plastic skin",
  "no Disney mouth shapes, no smiling-tooth grin, no posed cheer",
  "no glitter, no sparkle particles, no lens flares, no fairy dust",
  "no rainbow gradients, no magenta/cyan duotone, no neon, no saturated sky",
  "no digital airbrush smoothness, no render-engine lighting, no 3D depth-of-field",
  "no bougainvillea cliché, no white-and-blue Greek-island palette, no Venetian gondolas",
  "no magical-girl tropes, no kawaii sidekicks",
  "no invented plants — must read as real Helichrysum italicum where present",
  "no symmetrical centred portrait, no eye-contact-with-camera, no hero-pose",
  "no text or letters anywhere in the image",
].join("; ");

const SHARED_HEAD = `Generate an image: literary children's picture-book interior spread, landscape orientation, 4:3 ratio.

STYLE: gouache and coloured pencil on warm cream paper, visible brush texture, visible pencil grain, slightly imperfect by hand. In the tradition of Beatrice Alemagna, Sydney Smith, Komako Sakai, Tomi Ungerer, Carson Ellis. Studio Ghibli backgrounds (Kazuo Oga) for landscape mood. Matte, hand-painted, restrained.

PALETTE: three hues only — warm limestone cream (#f0e3cb), dirty smilje gold (#d8a73a), dusty Adriatic teal (#a8c4c0). One gold accent for any lit smilje. One cool accent (Luna's black plus the sea slip). No gradient sky — sky is a single dusty wash.

MOOD: bittersweet wonder, quiet displacement turning into quiet belonging. Janosch warmth meets Astrid Lindgren's Saltkrokan island stillness meets Cornelia Funke's Adriatic gravity. The pause before a word is spoken.

ANTI-PATTERNS: ${ANTI}.`;

const SPREADS = {
  ch01: {
    label: "the moment before arrival",
    file: `${SLUG}-ch01.png`,
    scene: `SCENE: Interior of a dusty family car at the end of a long drive. A six-year-old German girl named Mila in three-quarter profile, pressing her nose flat against a warm sun-lit car window, her breath fogging the glass slightly. Through the window: a thin slip of pale Adriatic teal visible between two warm limestone houses with green wooden shutters. Late afternoon golden light raking across the dashboard. Beside her on the back seat, a sleeping three-year-old brother with an oversized stuffed rabbit on his lap, eyes closed, peaceful. The moment of arrival, just before the car door opens.

LIGHTING: warm late-afternoon sun from outside the window, raking across Mila's profile.

COMPOSITION: Mila in left-third foreground, sleeping Theo in right-third middle distance, the slip of sea framed dead centre between two houses outside the window.`,
  },

  ch02: {
    label: "eye-to-eye across species",
    file: `${SLUG}-ch02.png`,
    scene: `SCENE: A small Turkish gecko (Hemidactylus turcicus, beige, with large unblinking black eyes and tiny hand-like toes) clinging perfectly still to a cool white plastered Croatian bedroom wall. Below it on a narrow bed: a small German girl's partial face — only her eye and the bridge of her nose visible at the lower edge of frame — looking back at the gecko in stillness. A warm yellow bedside lamp casts a single pool of light on the wall around the gecko. The two looking at each other across species. The whole rest of the room blurs out into deep slate.

LIGHTING: a single warm yellow bedside lamp; rest of room in cool blue-grey shadow.

COMPOSITION: gecko centred slightly upper-third on the wall (rule of thirds); the eye watching from below at lower-third; the warm pool of lamp light isolating both. Most of the frame is cool dark wall — the magic is the small spotlight.`,
  },

  ch03: {
    label: "the first pulse",
    file: `${SLUG}-ch03.png`,
    scene: `SCENE: A close composition on a sun-warm Croatian limestone drystone wall on Mali Lošinj. A six-year-old girl's small hand reaching slowly toward a single lit cluster of real smilje (Helichrysum italicum, small papery yellow florets, narrow grey-green leaves, woody base) growing from a wall crack — hand near, not touching, the moment before naming. A small Dalmatian wall lizard sun-warming on the limestone right beside the smilje cluster, calm, head turned, watching the hand. In the upper-right corner of the frame: a peeking child's face just barely visible above the wall on the other side (Rela), only her dark curly forelock and her two eyes showing above the stone, watching silently. Golden-hour rake-light from upper left. The lit smilje glows one stop hotter than the rest — like a firefly, not fairy dust.

LIGHTING: low golden hour sun from upper left, raking across the limestone surface, picking out the smilje cluster.

COMPOSITION: hand and smilje cluster at lower-left rule-of-thirds intersection; lizard tucked in close; Rela's eyes peeking upper-right.`,
  },

  ch04: {
    label: "the choosing",
    file: `${SLUG}-ch04.png`,
    scene: `SCENE: A wide sun-warm Croatian harbour stone quay at midday. Two six-year-old girls kneeling in mirror posture facing the camera at low angle — Mila (German, light brown hair, simple linen dress) on the left, Rela (Croatian, dark curly hair, yellow dress, no shoes) on the right. Between and slightly forward, a small black harbour cat (Luna) with a single round white moon-mark over her left eye, seated calmly with her bottom resting directly on Mila's left bare foot. A small three-year-old boy in pyjamas (Theo) standing behind them, mouth open in surprise, both small hands frozen mid-clap, an ice-cream stain on his pyjama front. Behind: a soft slip of harbour blue, a moored fishing boat, a coil of rope.

LIGHTING: high midday Mediterranean light, warm and even, no harsh shadows.

COMPOSITION: Mila left, Rela right, Luna centre on Mila's foot — the focal point. Theo upper third behind, slightly out of focus.`,
  },

  ch05: {
    label: "the kindness exchange",
    file: `${SLUG}-ch05.png`,
    scene: `SCENE: Early-morning Croatian fish market on Mali Lošinj. A long blue-tiled table at the edge of the harbour. A bearded fishmonger in a blue cotton apron laying a grey common octopus (Octopus vulgaris, eight arms) down onto a flat ice tray with both hands — gentle, careful, almost ceremonial, like setting down a sleeping child. To his side: a six-year-old German girl named Mila watching, her small hand still held tight in her mother's adult hand at the edge of frame. In the middle distance: one or two old fishermen with caps slightly lifted by the bura wind, talking. Behind: harbour boat masts swaying. Cool morning silver-blue light dominates, with one warm fish-scale flash.

LIGHTING: cool early-morning light from upper left, silver tones, narrow value range.

COMPOSITION: octopus and fishmonger's hands centred — the central image is the gentleness. Mila watching from left, hand-in-mother visible only to wrist.`,
  },

  ch06: {
    label: "two creatures meeting through water",
    file: `${SLUG}-ch06.png`,
    scene: `SCENE: A small blue-painted wooden fishing boat (Ribica) on the open Adriatic sea, viewed from a low water-level angle. The bow of the boat fills the upper third. A six-year-old German girl named Mila is bent over the gunwale, looking straight down into the water — visible from the camera's low position as her shoulders and bent head from below. Just inches under the water surface: a young Adriatic bottlenose dolphin (Tursiops truncatus), turned sideways underwater, his pale belly facing up, his dark eye looking up at her. The curve of his body mirrors the curve of her bent back. Soft sun-glints on the water. The boat's blue paint chipped. The dolphin's pale skin in dappled refracted light.

LIGHTING: high noon overhead, refracting through water onto the dolphin's back.

COMPOSITION: water surface as horizontal divider mid-frame; girl's curved back above; dolphin's curved body below; the two curves rhyme.`,
  },

  ch07: {
    label: "the shared page",
    file: `${SLUG}-ch07.png`,
    scene: `SCENE: Top-down overhead view of a small weathered wooden harbour pier in late afternoon. An open softcover notebook lies on the wood at the centre of the frame, two facing pages visible. On the right-hand page: three handwritten sentences in three different children's hands, each in a different ink — visible as gentle pencil-and-ink marks, blurred enough that the actual letters cannot be deciphered (no readable text). At the edges of the frame: three pairs of bare or sandalled children's feet visible — Mila (left, light skin, small bare feet), Rela (top, no shoes, dirt under nails), Oli (right, sandals with sand on them) — sitting around the notebook. A small black cat tail with one white moon-mark on the cat's distant face, the tail crossing diagonally over a lower corner of the notebook page. A short yellow wooden pencil rolled aside. Late afternoon raking sunlight from one side, warm.

LIGHTING: low warm late-afternoon sun raking from one side, long soft shadows.

COMPOSITION: top-down flat-lay; notebook centred; three pairs of feet at three edges (triangular); cat tail crossing one corner.`,
  },

  ch08: {
    label: "the impossible mauer",
    file: `${SLUG}-ch08.png`,
    scene: `SCENE: A magical-realist dream image. A long pale Croatian drystone limestone wall stretches from the foreground at lower-left into the middle distance, then continues impossibly straight into the sea horizon and disappears beneath the water surface. On the wall: a small black cat (Luna) walking ahead, tail high like a flag, the small white moon-mark on her face visible. Behind her, a barefoot six-year-old girl in a simple linen nightdress walking. Behind the girl, a small three-year-old boy mounted on a calm small donkey, holding an oversized stuffed rabbit. Smilje flowers grow from the wall and pulse softly gold under their feet — drawn in fine pencil-line gold strokes overlaid on gouache stone. The sky is a single dusty wash, almost cream. The whole image floats in dream-time, calm, gentle, Komako-Sakai dream register, no horizon line interruption.

LIGHTING: dreamlike even diffuse light, no specific source, very soft shadows.

COMPOSITION: diagonal wall leading into vanishing point at upper-right horizon-into-sea; figures spaced rhythmically along the wall; the smilje glow as scattered pencil-gold marks.`,
  },

  ch09: {
    label: "the found old woman",
    file: `${SLUG}-ch09.png`,
    scene: `SCENE: Twilight under an ancient Mediterranean olive tree, the trunk knotted and hollow, real bark texture, weathered. At the base of the tree, in a small stone hollow between exposed roots: an elderly Croatian woman (Nona Marica, blue cotton apron, white hair pinned back, calm face) seated against the trunk. A small three-year-old boy's head resting trustingly on her lap. A six-year-old German girl crouched in front of them, her small face lit only by the soft cool blue-white light of a small phone screen she is holding low — the rest of the world in twilight. On the highest stone above the hollow: a small black cat sitting sentinel (Luna), the white moon-mark on her face visible against the dusk sky. The waxing August moon rising in the upper-right of the frame.

LIGHTING: twilight blue ambient; one cool blue-white phone-screen accent on Mila's face; the rising moon in upper-right.

COMPOSITION: olive tree as vertical anchor left-third; Nona and Theo in stone hollow at base; Mila crouched centre; Luna sentinel upper third; rising moon balancing right.`,
  },

  ch10: {
    label: "the two homes in one frame",
    file: `${SLUG}-ch10.png`,
    scene: `SCENE: A composed double image like a children's-book end-paper. Foreground (lower two-thirds of frame): a simple wooden kitchen table with a folded handwritten letter (visible as paper folds, no readable text) and a single sprig of dried smilje (Helichrysum italicum, gold papery flower clusters, narrow grey-green leaves) laid across the letter. A short yellow pencil. A simple white ceramic mug with the last warmth of coffee. Through an open doorway in the middle-distance background (upper third of frame): a six-year-old German girl named Mila kneeling at a sun-warm Croatian limestone wall in the garden, her small hand near a wall lizard. A three-year-old brother (Theo) holding an oversized stuffed rabbit, standing close to her. The two scenes — one inside, one outside — held in one frame. Soft September afternoon light coming through the doorway from outside.

LIGHTING: warm afternoon golden light from the open doorway, picking out the smilje on the letter; interior in slightly cooler tones.

COMPOSITION: classic two-thirds split — interior table foreground, exterior garden through doorway in upper third like a small painting hanging in the world.`,
  },
};

async function generate(name, spread) {
  const prompt = `${SHARED_HEAD}\n\n${spread.scene}\n\nTECHNICAL: 4:3 landscape, picture-book interior spread, hand-painted gouache surface, NO text or letters anywhere.`;

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
console.log(`\n${okCount}/${Object.keys(results).length} spreads generated`);
