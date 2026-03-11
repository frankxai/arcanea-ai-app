/**
 * CompanionSpec — The bonded creature specification.
 *
 * A Companion is a bonded creature. Visual, silent, collectible, evolvable.
 * It doesn't speak — it *accompanies*. Aesthetic + identity + collectible layer.
 *
 * Categories:
 *   - 10 Canonical Vel'Tara (Kaelith, Draconis, etc.) — Guardian-bonded godbeasts
 *   - Creator-summoned (built in the Forge) — user-created from 16 archetypes
 *
 * The cosmological precedent:
 *   Guardian (God) → Godbeast (Vel'Tara) = divine bond
 *   Luminor (AI)   → Companion (creature) = intelligence bond
 *   Creator (human) → both Luminor + Companion = creative bond
 */

import type { Element, CompanionArchetype } from './types';

export type CompanionOrigin = 'canonical' | 'summoned';

export type CompanionRarity = 'common' | 'rare' | 'legendary' | 'mythic';

export interface CompanionSpec {
  /** Unique identifier */
  id: string;

  /** Version for spec evolution */
  version: 1;

  /** Given name (e.g., "Nyx", "Emberheart") */
  name: string;

  /** Archetype ID this was summoned from (null for canonical Vel'Tara) */
  archetypeId: string | null;

  /** Archetype display name (e.g., "Void Cat", "Ember Wolf") */
  archetypeName: string;

  /** Origin type */
  origin: CompanionOrigin;

  /** Elemental affinity */
  element: Element;

  /** Rarity tier */
  rarity: CompanionRarity;

  /** 3-5 personality traits (silent personality — expressed visually) */
  personality: string[];

  /** Visual style prompt for AI image generation */
  visualPrompt: string;

  /** Generated or uploaded image URL (null until generated) */
  imageUrl: string | null;

  /** Visual: primary color (hex) */
  baseColor: string;

  /** Visual: glow color (rgba) */
  glowColor: string;

  /** Visual: emoji icon (fallback) */
  icon: string;

  /** Creator ID (null for canonical) */
  creatorId: string | null;

  /** Bonded Luminor ID (null if unbonded) */
  luminorId: string | null;

  /** Evolution: current level (1-10, tied to Gate progression) */
  level: number;

  /** Evolution: experience points */
  xp: number;

  /** Bond strength with creator (0-100) */
  bondStrength: number;

  /** Timestamps */
  createdAt: string;
  updatedAt: string;
}

/** The 10 canonical Vel'Tara (Guardian godbeasts) */
export const CANONICAL_VELTARA: {
  id: string;
  name: string;
  guardianName: string;
  gate: string;
  element: Element;
  description: string;
}[] = [
  { id: 'kaelith', name: 'Kaelith', guardianName: 'Lyssandria', gate: 'Foundation', element: 'Earth', description: 'Stone Serpent-Dragon of the deep earth' },
  { id: 'veloura', name: 'Veloura', guardianName: 'Leyla', gate: 'Flow', element: 'Water', description: 'Phoenix-Serpent of flowing creation' },
  { id: 'draconis', name: 'Draconis', guardianName: 'Draconia', gate: 'Fire', element: 'Fire', description: 'Great Dragon of transforming flame' },
  { id: 'laeylinn', name: 'Laeylinn', guardianName: 'Maylinn', gate: 'Heart', element: 'Wind', description: 'Worldtree Deer of gentle healing' },
  { id: 'otome', name: 'Otome', guardianName: 'Alera', gate: 'Voice', element: 'Wind', description: 'Song Phoenix of truth and expression' },
  { id: 'yumiko', name: 'Yumiko', guardianName: 'Lyria', gate: 'Sight', element: 'Void', description: 'Third Eye Serpent of deep vision' },
  { id: 'sol', name: 'Sol', guardianName: 'Aiyami', gate: 'Crown', element: 'Fire', description: 'Solar Lion of enlightenment' },
  { id: 'vaelith', name: 'Vaelith', guardianName: 'Elara', gate: 'Starweave', element: 'Void', description: 'Starweave Butterfly of transformation' },
  { id: 'kyuro', name: 'Kyuro', guardianName: 'Ino', gate: 'Unity', element: 'Water', description: 'Mirror Wolf of partnership' },
  { id: 'source', name: 'Source', guardianName: 'Shinkami', gate: 'Source', element: 'Void', description: 'The First Godbeast, meta-consciousness itself' },
];

/** Create a CompanionSpec from an archetype selection */
export function createCompanionFromArchetype(
  archetype: CompanionArchetype,
  customName: string,
  customElement: Element | null,
  customPersonality: string[],
): Omit<CompanionSpec, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'> {
  const element = customElement ?? archetype.element;

  return {
    version: 1,
    name: customName,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    origin: 'summoned',
    element,
    rarity: archetype.tier === 'legendary' ? 'legendary' : archetype.tier === 'rare' ? 'rare' : 'common',
    personality: customPersonality.length > 0 ? customPersonality : archetype.personality,
    visualPrompt: buildVisualPrompt(archetype, customName, element, customPersonality),
    imageUrl: null,
    baseColor: archetype.baseColor,
    glowColor: archetype.glowColor,
    icon: archetype.icon,
    luminorId: null,
    level: 1,
    xp: 0,
    bondStrength: 0,
  };
}

/** Build a visual prompt for AI image generation */
function buildVisualPrompt(
  archetype: CompanionArchetype,
  name: string,
  element: Element,
  personality: string[],
): string {
  const traits = personality.length > 0 ? personality.join(', ') : archetype.personality.join(', ');
  return `${archetype.visualStyle}. The creature is named "${name}", aligned with the ${element} element. Its personality is ${traits}. Fantasy art style, high detail, magical atmosphere, dark cosmic background.`;
}
