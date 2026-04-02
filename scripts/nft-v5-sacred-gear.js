#!/usr/bin/env node
/**
 * NFT Forge v5 — Sacred Gear + Starlight Mark + All 5 Fixes Applied
 *
 * Fixes applied:
 * 1. STRICT CROP: No hands, no arms below elbow, head+shoulders only
 * 2. SIGNATURE ELEMENTS: Starlight Mark + Sacred Gear on every character
 * 3. MAX 7 TRAITS: Reduced from 10-12 to 7 bold traits
 * 4. COOL NOT BEAUTIFUL: Unbothered expression, fashion-forward
 * 5. CULTURAL MODERNITY: Tech-fashion, not fantasy RPG
 */

const fs = require('fs');
const API_KEY = 'AIzaSyC9-kKPkeHh9dZ831O9M3gTp6mjAi-EWdc';
const OUT = 'C:/Users/frank/Arcanea/output/nft-v5';
fs.mkdirSync(OUT, { recursive: true });

// Universal format block — IDENTICAL for every PFP
const FORMAT = `Generate an image. No text in the image.
NFT PFP character portrait. Square 1:1.
3/4 view, head turned 25 degrees. Head and shoulders ONLY.
Frame cuts at mid-chest. Character fills 75% of frame. Eye line at 40% from top.
NO hands visible. NO arms below elbow. NO action pose. Portrait only.
Three-point lighting: warm gold key upper-left, cool teal fill lower-right, white-gold rim from behind.`;

// Premium 3D rendering tier
const TIER = `RENDERING — PREMIUM 3D:
Full 3D rendered like Clone X by RTFKT or Blizzard cinematic character.
Subsurface scattering on skin — light through ear tips, nose bridge, cheekbones.
Each material renders DIFFERENTLY: matte fabric absorbs light, brushed metal shows directional grain, polished gold has sharp specular, crystal glows with internal light.
Hair with strand groups catching rim light.
Shallow depth of field: far shoulder slightly softer than near eye.
Color temperature shift: warm amber highlights, cool purple-grey shadows.`;

// Universal expression + vibe
const VIBE = `Expression: confident and unbothered. Half-lidded eyes. Closed mouth with subtle asymmetric smirk. Chin tilted slightly up. The energy of someone who knows something you don't. NOT fierce, NOT sweet, NOT determined — COOL. Think tech-fashion founder at a Tokyo gallery, not fantasy warrior.`;

// Universal negative
const NEGATIVE_NOTE = `ABSOLUTELY NO: hands, fingers, arms below elbow, action poses, energy effects, magic sparks, fighting stance, medieval armor, leather bracers, torn fabric, fantasy robes, environment, gradient background, particles, full body, concept art composition.`;

const CHARACTERS = [
  {
    name: 'kael-v5',
    desc: `CHARACTER — KAEL (Apprentice, Gate-Touched):
TRAIT 1 — Skin: Olive-tan with visible teal vein-lines on left neck (Gate-Touch mutation). Small teal DOT on left temple (Apprentice Starlight Mark, barely glowing).
TRAIT 2 — Eyes: Left eye dark brown, right eye cracked crystalline amber with fracture lines and faint glow. Sharp white catchlights.
TRAIT 3 — Hair: Dark brown, messy-styled, one bold electric teal streak on left side. Modern textured cut, not fantasy-wild.
TRAIT 4 — Sacred Gear: GATE CHAIN — a small angular pendant on a thin dark chain, geometric diamond shape (his first Gate), brushed dark metal with one tiny teal crystal at center.
TRAIT 5 — Outfit: Fitted black high-collar tech jacket. Clean modern design, matte fabric texture. No patches, no tears — this is fashion, not rags.
TRAIT 6 — Accessory: Single small teal crystal stud in left ear.
TRAIT 7 — Accent: Teal element color in chain crystal, ear stud, hair streak, and neck veins — all same hue.
BACKGROUND: Flat solid dusty warm grey (#8a8378).`,
  },
  {
    name: 'vex-v5',
    desc: `CHARACTER — VEX (Mage, Synth Origin):
TRAIT 1 — Skin: Cool fair with chrome-silver jawline implant on right side (brushed titanium, 3 tiny teal indicator lights). Small teal DIAMOND on left temple (Mage Starlight Mark, soft glow casting slight light on skin).
TRAIT 2 — Eyes: Ice blue with hexagonal iris pattern (synthetic enhancement). Dual sharp catchlights.
TRAIT 3 — Hair: Split dye — left half jet black, right half platinum white. Slicked back with precise undercut. Modern barbershop clean.
TRAIT 4 — Sacred Gear: RESONANCE VISOR — thin brushed-steel band across the bridge of the nose, angular geometric design, one embedded pale blue Otome Resonite crystal at center that vibrates with faint light.
TRAIT 5 — Outfit: Dark charcoal tactical vest, high collar, matte ballistic weave texture. One angular brushed-steel shoulder guard on left with gold circuit-line inlays.
TRAIT 6 — Accessory: Gold geometric Arcanea emblem (pentagon with inner star) hanging from thin chain at chest.
TRAIT 7 — Accent: Teal in indicator lights, Starlight Mark. Gold in emblem and shoulder inlays. Ice blue in visor crystal and eyes.
BACKGROUND: Flat solid deep navy (#141b2d).`,
  },
  {
    name: 'solara-v5',
    desc: `CHARACTER — SOLARA (Luminor, Gate 9, Celestial):
TRAIT 1 — Skin: Deep warm umber with golden luminescence beneath (subsurface glow at temples, cheekbones, collarbones — she IS light). Teal MULTI-POINTED STAR on left temple (Luminor Starlight Mark, intensely glowing, casting teal light onto face and hair).
TRAIT 2 — Eyes: Solid white-gold with no visible pupil — radiant like looking into a star. Thin teal ring at outer edge.
TRAIT 3 — Hair: Long flowing white with threads of actual light woven through. Swept back dramatically, two thin braids framing face with gold wire woven in.
TRAIT 4 — Sacred Gear: CRYSTAL CROWN — five small shards of crystallized light floating in an arc above her head (white, gold, amber, rose-gold, platinum). Not a physical crown — they FLOAT and rotate slowly.
TRAIT 5 — Outfit: Star-forged ceremonial chest armor — dark gunmetal with gold constellation-pattern filigree. The metal seems to hold captured starlight within. White-gold half-cape on left shoulder only.
TRAIT 6 — Accessory: Thick gold torque necklace with central Kyuro Void Crystal — perfectly BLACK crystal that absorbs all light around it, set in gold.
TRAIT 7 — Accent: Gold dominant (armor, filigree, necklace, braids). Teal in Starlight Mark and eye ring. Black void crystal as contrast.
BACKGROUND: Flat solid rich dark charcoal (#1a1a2e).`,
  },
];

async function gen(char, index) {
  const prompt = [FORMAT, TIER, char.desc, VIBE, NEGATIVE_NOTE].join('\n\n');

  try {
    const start = Date.now();
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (!res.ok) {
      console.error(`  ${char.name}: ERROR ${res.status} (${elapsed}s)`);
      return null;
    }

    const data = await res.json();
    for (const c of data.candidates || []) {
      for (const p of c.content?.parts || []) {
        if (p.inlineData) {
          const fname = `${String(index).padStart(2, '0')}-${char.name}.jpg`;
          const fpath = `${OUT}/${fname}`;
          const buf = Buffer.from(p.inlineData.data, 'base64');
          fs.writeFileSync(fpath, buf);
          console.log(`  OK: ${fname} (${(buf.length / 1024).toFixed(0)}KB, ${elapsed}s)`);
          return fpath;
        }
      }
    }
    console.log(`  NO IMAGE: ${char.name} (${elapsed}s)`);
  } catch (e) {
    console.error(`  FAIL: ${char.name}: ${e.message}`);
  }
  return null;
}

async function main() {
  console.log('NFT Forge v5 — Sacred Gear + Starlight Mark');
  console.log('Fixes: strict crop, signature elements, 7 traits, cool attitude, modern fashion');
  console.log('Tier: premium3d | Model: gemini-3-pro-image-preview\n');

  const startAll = Date.now();

  for (let i = 0; i < CHARACTERS.length; i++) {
    console.log(`[${CHARACTERS[i].name}]`);
    await gen(CHARACTERS[i], i + 1);
    if (i < CHARACTERS.length - 1) await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone! ${CHARACTERS.length} images in ${((Date.now() - startAll) / 1000).toFixed(0)}s`);
  console.log(`Output: ${OUT}/`);
}

main().catch((e) => console.error(e.message));
