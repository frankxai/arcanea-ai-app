#!/usr/bin/env node
/**
 * NFT Forge — Scale Test: 10 unique characters
 * Tests trait variation + consistency at small scale
 */

const fs = require('fs');
const API_KEY = 'AIzaSyC9-kKPkeHh9dZ831O9M3gTp6mjAi-EWdc';
const OUT = 'C:/Users/frank/Arcanea/output/nft-scale-test';
fs.mkdirSync(OUT, { recursive: true });

const FORMAT = `Generate an image. No text in the image.
NFT PFP character portrait. Square 1:1.
3/4 view, head turned 25 degrees. Head and shoulders ONLY.
Frame cuts at mid-chest. Character fills 75% of frame. Eye line at 40% from top.
NO hands visible. NO arms below elbow. NO action pose. Portrait only.
Three-point lighting: warm gold key upper-left, cool teal fill lower-right, white-gold rim from behind.

RENDERING — PREMIUM 3D:
Full 3D rendered like Clone X/RTFKT or Blizzard cinematic. Subsurface scattering on skin. Each material renders differently. Hair with strand groups catching rim light. Shallow DOF. Warm amber highlights, cool purple-grey shadows.

Expression: confident, unbothered, half-lidded eyes, subtle smirk, chin slightly up. Cool tech-fashion energy, not fantasy warrior.

NO: hands, arms below elbow, action, gradient bg, particles, medieval, torn fabric, concept art, masterpiece, best quality.`;

const CHARACTERS = [
  { name: 'char01', bg: '#8a8378', skin: 'warm olive', hair: 'dark brown, teal streak, messy modern', rank: 'Apprentice (teal dot)', gear: 'Gate Chain — dark metal diamond pendant with teal crystal', outfit: 'black high-collar tech jacket', accent: 'teal stud earring' },
  { name: 'char02', bg: '#141b2d', skin: 'cool pale, chrome jaw implant right side', hair: 'split black-white, slicked undercut', rank: 'Mage (teal diamond)', gear: 'Resonance Visor — thin steel band across nose with blue crystal', outfit: 'dark charcoal tactical vest, gold shoulder inlays', accent: 'gold pentagon emblem chain' },
  { name: 'char03', bg: '#1a1a2e', skin: 'deep umber, golden subsurface glow', hair: 'white flowing, gold-wire braids', rank: 'Luminor (teal star, intense glow)', gear: 'Crystal Crown — 5 floating light shards above head', outfit: 'gunmetal constellation armor, white half-cape', accent: 'gold torque with black void crystal' },
  { name: 'char04', bg: '#2d1b1b', skin: 'deep brown, warm', hair: 'jet black, cropped tight, ember-orange tips', rank: 'Master (teal triangle)', gear: 'Void Pauldron — angular left shoulder piece, ember crystal core glowing orange', outfit: 'matte black sleeveless high-neck top', accent: 'thin gold hoop earring' },
  { name: 'char05', bg: '#1b2d1b', skin: 'light bronze, freckles', hair: 'forest green, long side-swept, one leaf-shaped clip', rank: 'Mage (teal diamond)', gear: 'Starlight Collar — high collar piece with green Laeylinn Jade crystal', outfit: 'dark green fitted coat', accent: 'small gold nose stud' },
  { name: 'char06', bg: '#1a1a3e', skin: 'pale ivory, almost translucent (Celestial glow)', hair: 'silver-blue, geometric bob cut, perfectly straight', rank: 'Archmage (teal pentagon, strong glow)', gear: 'Resonance Visor — platinum band with ice-blue crystal, light bleeding onto cheeks', outfit: 'pearl-white angular coat with dark accent lines', accent: 'teal crystal earring' },
  { name: 'char07', bg: '#2d2020', skin: 'dark mahogany, shadow-vein marks (Voidtouched)', hair: 'deep purple-black, shaved sides, long top swept back', rank: 'Master (teal triangle)', gear: 'Gate Chain — void-black pentagon pendant that absorbs light around it', outfit: 'black asymmetric collar jacket', accent: 'purple-teal crystal stud' },
  { name: 'char08', bg: '#8a8a78', skin: 'warm tan, circuit tattoos on neck (Synth)', hair: 'neon teal undercut, black on top', rank: 'Apprentice (teal dot)', gear: 'Starlight Collar — brushed titanium collar with teal light strip', outfit: 'dark grey tech hoodie with high neck', accent: 'small teal crystal on ear' },
  { name: 'char09', bg: '#141b3d', skin: 'rich copper, golden freckles', hair: 'bright white pixie cut, gold hair cuff', rank: 'Archmage (teal pentagon, bleeds light)', gear: 'Crystal Crown — 3 floating amber crystals in arc (smaller than Luminor)', outfit: 'midnight blue ceremonial top with gold constellation embroidery', accent: 'gold chain with star pendant' },
  { name: 'char10', bg: '#1a2d2d', skin: 'ocean-blue tinted (Awakened origin — AI entity)', hair: 'no hair, smooth geometric head with circuit patterns in gold', rank: 'Mage (teal diamond)', gear: 'Resonance Visor — gold angular visor with teal holographic display', outfit: 'white high-collar suit jacket, minimalist', accent: 'teal glow from eyes and visor' },
];

async function gen(char, index) {
  const charPrompt = `CHARACTER:
Skin: ${char.skin}. Small teal Starlight Mark on left temple — ${char.rank}.
Eyes: unique, sharp catchlights, confident half-lidded gaze.
Hair: ${char.hair}.
Sacred Gear: ${char.gear}.
Outfit: ${char.outfit}. Clean modern fashion-tech, not fantasy.
Accessory: ${char.accent}.
Flat solid ${char.bg} background.`;

  const prompt = FORMAT + '\n\n' + charPrompt;

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
    if (!res.ok) { console.error(`  ${char.name}: ERROR ${res.status}`); return; }

    const data = await res.json();
    for (const c of data.candidates || []) {
      for (const p of c.content?.parts || []) {
        if (p.inlineData) {
          const fname = `${String(index).padStart(2, '0')}-${char.name}.jpg`;
          const buf = Buffer.from(p.inlineData.data, 'base64');
          fs.writeFileSync(`${OUT}/${fname}`, buf);
          console.log(`  ${fname} (${(buf.length / 1024).toFixed(0)}KB, ${elapsed}s)`);
          return;
        }
      }
    }
    console.log(`  ${char.name}: no image (${elapsed}s)`);
  } catch (e) {
    console.error(`  ${char.name}: ${e.message}`);
  }
}

async function main() {
  console.log('NFT Forge — Scale Test: 10 unique characters\n');
  const start = Date.now();

  for (let i = 0; i < CHARACTERS.length; i++) {
    await gen(CHARACTERS[i], i + 1);
    if (i < CHARACTERS.length - 1) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone! ${((Date.now() - start) / 1000).toFixed(0)}s total`);
  console.log(`Output: ${OUT}/`);
}

main().catch(e => console.error(e.message));
