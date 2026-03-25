/**
 * Living Lore — Lore Connections
 *
 * Maps Living Lore episodes, gates, and crew members to existing
 * Library content in `/book/`, enabling deep cross-referencing
 * between the narrative experience and the reference material.
 */

import { getText, getTextsInCollection } from '../content';
import type { Text } from '../content/types';

// ---------------------------------------------------------------------------
// Gate -> Collection mapping
// ---------------------------------------------------------------------------

const GATE_COLLECTION_MAP: Record<number, string[]> = {
  1: ['legends-of-arcanea', 'academy-handbook'],           // Foundation
  2: ['poesie-of-freedom', 'chronicles-of-luminors'],      // Flow
  3: ['bestiary-of-creation', 'book-of-shadows'],          // Fire
  4: ['parables-of-creation', 'dialogues-of-masters'],     // Heart
  5: ['songs-and-hymns', 'codex-of-collaboration'],        // Voice
  6: ['prophecies', 'meditations-on-elements'],             // Sight
  7: ['laws-of-arcanea', 'wisdom-scrolls'],                // Crown
  8: ['atlas-of-territories', 'tales-of-creators'],        // Starweave
  9: ['codex-of-collaboration', 'dialogues-of-masters'],   // Unity
  10: ['legends-of-arcanea', 'book-of-rituals'],           // Source
};

// ---------------------------------------------------------------------------
// Crew member -> Collection mapping
// ---------------------------------------------------------------------------

const CREW_LORE_MAP: Record<string, string[]> = {
  ren: ['academy-handbook', 'wisdom-scrolls'],
  vesper: ['prophecies', 'meditations-on-elements'],
  kaedra: ['bestiary-of-creation', 'book-of-shadows'],
  thalien: ['legends-of-arcanea', 'chronicles-of-luminors'],
  axiom: ['laws-of-arcanea', 'parables-of-creation'],
  solenne: ['tales-of-creators', 'atlas-of-territories'],
  jinx: ['prophecies', 'bestiary-of-creation'],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve an array of slugs from an episode's `connectedLore` frontmatter
 * into full Text objects. Slugs that cannot be found are silently skipped.
 *
 * @param connectedSlugs - e.g. `['legends-of-arcanea/i-the-first-dawn', 'academy-handbook/i-the-ten-gates']`
 */
export async function getConnectedLore(connectedSlugs: string[]): Promise<Text[]> {
  if (!connectedSlugs.length) return [];

  const results = await Promise.all(
    connectedSlugs.map((slug) => getText(slug))
  );

  return results.filter((text): text is Text => text !== null);
}

/**
 * Get all texts thematically connected to a specific Gate number.
 * Returns texts from the two most relevant collections for that Gate.
 */
export async function getTextsForGate(gateNumber: number): Promise<Text[]> {
  const collections = GATE_COLLECTION_MAP[gateNumber];
  if (!collections) return [];

  const results = await Promise.all(
    collections.map((collectionSlug) => getTextsInCollection(collectionSlug))
  );

  return results.flat();
}

/**
 * Get texts thematically connected to a crew member.
 * Accepts both full ID (`crew-ren`) and short name (`ren`).
 */
export async function getTextsForCrewMember(memberId: string): Promise<Text[]> {
  const shortName = memberId.replace(/^crew-/, '');
  const collections = CREW_LORE_MAP[shortName];
  if (!collections) return [];

  const results = await Promise.all(
    collections.map((collectionSlug) => getTextsInCollection(collectionSlug))
  );

  return results.flat();
}
