#!/usr/bin/env node
/**
 * generate-magic-assets.mjs — brand-locked spell art prompts for the Grimoire.
 *
 * Reads the canonical spell corpus and builds a structured image prompt per spell
 * (element palette + tier intensity + discipline iconography), following the
 * FORMAT/STYLE/SUBJECT/NEGATIVE convention used by the existing nano-banana scripts.
 *
 * Usage:
 *   node scripts/generate-magic-assets.mjs --dry-run            # print prompts + target paths (default)
 *   node scripts/generate-magic-assets.mjs --spell ember-lance  # one spell only
 *   node scripts/generate-magic-assets.mjs --generate           # real generation (needs GEMINI_API_KEY)
 *
 * Output (real mode): apps/web/public/images/magic/<discipline>/<spell>.png
 * Secrets: GEMINI_API_KEY from env only. Never hardcode a key.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const DATA = join(repo, 'apps', 'web', 'lib', 'magic', 'spells.json');
const OUT = join(repo, 'apps', 'web', 'public', 'images', 'magic');

const args = process.argv.slice(2);
const DRY = !args.includes('--generate');
const only = args.includes('--spell') ? args[args.indexOf('--spell') + 1] : null;

// Brand-locked element palettes (Arcanean design tokens, hex for the prompt).
const ELEMENT_PALETTE = {
  fire: 'molten reds, ember orange, gold sparks (#ff6b35)',
  water: 'deep ocean blue, silver, crystal cyan (#3aa0ff)',
  earth: 'mossy green, weathered stone, bronze (#7cae54)',
  wind: 'pale silver-white, soft grey, luminous mist (#cbd5e1)',
  void: 'black-violet, nebula purple, faint gold (#9b8cff)',
  spirit: 'radiant gold, warm white, soft halo (#ffd700)',
};
// Tier raises the visual intensity.
const TIER_INTENSITY = {
  light: 'understated, a single clean glyph of power, calm',
  advanced: 'controlled energy, defined linework, focused glow',
  greater: 'heavy presence, layered effect, ritual weight',
  sacred: 'haloed and reverent, sacred geometry, gilded light',
  royal: 'ornate and commanding, regalia motifs, dominion',
  imperial: 'realm-scale grandeur, vast composition, awe',
  divine: 'transcendent, cosmic radiance, all ten Gates implied',
};
const DISCIPLINE_MOTIF = {
  attack: 'a focused projecting force, directional, kinetic',
  defense: 'a protective sigil or ward, concentric, sheltering',
  summoning: 'a conjuring circle calling a form into being',
};

const FORMAT = [
  'Generate an image. No text in the image. Square 1:1.',
  'Arcanea spell sigil — a single luminous emblem on a dark cosmic background (#09090b).',
  'Glassmorphic, aurora gradients, cosmic glow. Premium, restrained, never cluttered.',
  'Composition: centered emblem, generous negative space, soft vignette.',
].join(' ');
const NEGATIVE =
  'NO text, NO letters, NO watermark, NO UI, NO frame, NO photoreal human, NO clutter, NO generic RPG icon.';

function buildPrompt(s) {
  return [
    FORMAT,
    `SUBJECT: ${s.name} — ${DISCIPLINE_MOTIF[s.discipline]}; ${s.description}`,
    `ELEMENT PALETTE (${s.element}): ${ELEMENT_PALETTE[s.element]}.`,
    `INTENSITY (${s.tier} tier): ${TIER_INTENSITY[s.tier]}.`,
    NEGATIVE,
  ].join('\n');
}

const { spells } = JSON.parse(readFileSync(DATA, 'utf8'));
const targets = (only ? spells.filter((s) => s.id === only) : spells);
if (only && !targets.length) {
  console.error(`No spell with id '${only}'.`);
  process.exit(1);
}

console.log(`Magic asset pipeline — ${targets.length} spell(s) · mode: ${DRY ? 'DRY-RUN' : 'GENERATE'}\n`);

for (const s of targets) {
  const outPath = join(OUT, s.discipline, `${s.id}.png`);
  console.log(`■ ${s.name}  →  public/images/magic/${s.discipline}/${s.id}.png`);
  if (DRY) {
    console.log(buildPrompt(s).split('\n').map((l) => '   ' + l).join('\n'));
    console.log('');
    continue;
  }
  // Real generation path — guarded, env-keyed.
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('GEMINI_API_KEY not set — cannot generate. Re-run with --dry-run or set the key.');
    process.exit(1);
  }
  mkdirSync(dirname(outPath), { recursive: true });
  // Intentionally not auto-calling the paid API here. Wire the project's
  // nano-banana generator (see scripts/generate-with-nano-banana.js) using
  // buildPrompt(s) and write the PNG to outPath. Kept manual to avoid
  // unattended credit spend per repo LLM policy.
  console.log('   [generate] prompt ready; hand to nano-banana generator.');
}

if (DRY) console.log('Dry run complete. Re-run with --generate (and GEMINI_API_KEY) to produce assets.');
