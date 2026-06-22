#!/usr/bin/env node
/**
 * forge-spell-cards.mjs — ERC-721 metadata for Arcanea Spell Card NFTs.
 *
 * Turns each spell in the canonical corpus into token metadata (OpenSea-style),
 * with discipline / tier / element / gate / rank as on-chain attributes and the
 * generated art/animation as image / animation_url. Following the NFT pipeline
 * documented in .arcanea/projects/ARCHITECTURE_NFT_SYSTEM.md.
 *
 * Usage:
 *   node scripts/forge-spell-cards.mjs --dry-run     # print one sample + summary (default)
 *   node scripts/forge-spell-cards.mjs --write       # write metadata/*.json to disk
 *
 * This NEVER mints or touches a chain. It only produces metadata files.
 * Mint/contract steps are a separate, human-approved action.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const DATA = join(repo, 'apps', 'web', 'lib', 'magic', 'spells.json');
const OUT = join(repo, 'apps', 'web', 'public', 'nft', 'spell-cards');
const IMAGE_BASE = 'ipfs://REPLACE_WITH_CID'; // set at mint time; placeholder by design

const WRITE = process.argv.includes('--write');

const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);

function toMetadata(s) {
  return {
    name: `${s.name} — Arcanea Spell Card`,
    description: `${s.description}\n\nIncantation: "${s.incantation}"\nEffect: ${s.effect}`,
    image: `${IMAGE_BASE}/images/magic/${s.discipline}/${s.id}.png`,
    animation_url: s.assets?.video ? `${IMAGE_BASE}/videos/magic/${s.id}.mp4` : undefined,
    external_url: `https://arcanea.ai/lore/grimoire/spell/${s.id}`,
    attributes: [
      { trait_type: 'Discipline', value: cap(s.discipline) },
      { trait_type: 'Tier', value: cap(s.tier) },
      { trait_type: 'Element', value: cap(s.element) },
      { trait_type: 'Gate', value: s.gate },
      { trait_type: 'Rank', value: cap(s.rank) },
      { display_type: 'number', trait_type: 'Mana Cost', value: s.manaCost },
      ...(s.guardian ? [{ trait_type: 'Witness', value: s.guardian }] : []),
    ],
    properties: { attestation: 'Built on SIP', incantation: s.incantation },
  };
}

const { spells } = JSON.parse(readFileSync(DATA, 'utf8'));
console.log(`Spell Card forge — ${spells.length} cards · mode: ${WRITE ? 'WRITE' : 'DRY-RUN'}\n`);

if (!WRITE) {
  console.log('Sample metadata (ember-lance):');
  console.log(JSON.stringify(toMetadata(spells.find((s) => s.id === 'ember-lance')), null, 2));
  console.log(`\n${spells.length} cards ready. Re-run with --write to emit metadata/*.json.`);
  console.log('Note: image base is an ipfs:// placeholder — set the CID at mint time. No chain writes here.');
} else {
  mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const [i, s] of spells.entries()) {
    writeFileSync(join(OUT, `${i + 1}.json`), JSON.stringify(toMetadata(s), null, 2));
    n++;
  }
  console.log(`Wrote ${n} metadata files to public/nft/spell-cards/. No chain writes performed.`);
}
