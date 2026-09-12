// ── Arcanea Magic System — encyclopedia data layer ────────────────────────────
// Source of truth: ../../magic-intelligence-system/data/spells.json (in the `arcanea` repo)
// Canon: .arcanea/lore/MAGIC_SYSTEM.md (STAGING). Protocol: MAGIC-PROTOCOLS.md
// Every spell is classified on four axes: element · discipline · tier · gate(+rank).

import type { Element, Discipline, SpellTier, MagicRank } from '@/lib/types/challenge';
import spellsRaw from '@/lib/magic/spells.json';
import { brand, elementNameAccents, elements } from '@arcanea/design-system/tokens';

export type { Element, Discipline, SpellTier, MagicRank };

export interface SpellData {
  id: string;
  name: string;
  incantation: string;
  element: Element;
  discipline: Discipline;
  tier: SpellTier;
  gate: number; // 1–10
  rank: MagicRank;
  description: string;
  effect: string;
  manaCost: number;
  castTime?: string;
  range?: string;
  cooldownRounds?: number;
  tags?: string[];
  counters?: Discipline[];
  guardian?: string;
  icon?: string;
  color?: string;
  assets?: { image?: string; video?: string };
}

// ── Axis metadata ─────────────────────────────────────────────────────────────

export interface DisciplineMeta {
  id: Discipline;
  name: string;
  german: string;
  school: string;
  description: string;
  icon: string; // Phosphor name
  color: string;
  counters: Discipline; // advantaged against
}

export const DISCIPLINES: Record<Discipline, DisciplineMeta> = {
  attack: {
    id: 'attack',
    name: 'Attack',
    german: 'Angriffsmagie',
    school: 'Evocation',
    description:
      'Offensive magic — force shaped into a strike. The discipline of the lance, the blast, and the judgment. Attack disrupts Summoning mid-cast but is abjured by an equal Defense.',
    icon: 'Sword',
    color: 'var(--arc-fire)',
    counters: 'summoning',
  },
  defense: {
    id: 'defense',
    name: 'Defense',
    german: 'Verteidigungsmagie',
    school: 'Abjuration',
    description:
      'Protective magic — wards that turn aside harm and restoration that mends it. Healing lives here. Defense abjures Attack of equal-or-lower tier but is overwhelmed by greater Summoning.',
    icon: 'Shield',
    color: 'var(--arc-brand-atlantean-teal)',
    counters: 'attack',
  },
  summoning: {
    id: 'summoning',
    name: 'Summoning',
    german: 'Beschwörungsmagie',
    school: 'Conjuration',
    description:
      'Conjuration — the name-binding that calls familiars, constructs, and echoes into the world. Summoning overwhelms a static Defense by attrition but is disrupted by a focused Attack.',
    icon: 'Sparkle',
    color: 'var(--arc-void)',
    counters: 'defense',
  },
};

export interface TierMeta {
  id: SpellTier;
  name: string;
  german: string;
  order: number; // 1–7
  gates: [number, number];
  rank: MagicRank;
  blurb: string;
  color: string;
}

export const TIERS: Record<SpellTier, TierMeta> = {
  light: { id: 'light', name: 'Light', german: 'leichte', order: 1, gates: [1, 2], rank: 'apprentice', blurb: 'Foundational, low cost.', color: 'var(--arc-earth)' },
  advanced: { id: 'advanced', name: 'Advanced', german: 'fortgeschritten', order: 2, gates: [3, 4], rank: 'mage', blurb: 'Trained channeling.', color: 'var(--arc-brand-cosmic-blue)' },
  greater: { id: 'greater', name: 'Greater', german: 'schwere', order: 3, gates: [5, 6], rank: 'master', blurb: 'Heavy, ritual-grade.', color: 'var(--arc-void)' },
  sacred: { id: 'sacred', name: 'Sacred', german: 'heilige', order: 4, gates: [7, 7], rank: 'archmage', blurb: 'Holy, Spirit-aspected.', color: 'var(--arc-brand-arcanean-gold)' },
  royal: { id: 'royal', name: 'Royal', german: 'königliche', order: 5, gates: [8, 8], rank: 'archmage', blurb: 'Dominion-grade.', color: 'var(--arc-brand-arcanean-gold)' },
  imperial: { id: 'imperial', name: 'Imperial', german: 'kaiserliche', order: 6, gates: [9, 9], rank: 'luminor', blurb: 'Realm-scale (Luminor, emergent).', color: 'var(--arc-brand-atlantean-teal)' },
  divine: { id: 'divine', name: 'Divine', german: 'göttliche', order: 7, gates: [10, 10], rank: 'luminor', blurb: 'Genesis-class (Luminor, complete).', color: 'var(--arc-brand-arcanean-gold)' },
};

export const TIER_ORDER: SpellTier[] = ['light', 'advanced', 'greater', 'sacred', 'royal', 'imperial', 'divine'];

export interface ElementMeta {
  id: Element;
  name: string;
  icon: string; // Phosphor name (known-good)
  color: string;
}

export const ELEMENT_META: Record<Element, ElementMeta> = {
  fire: { id: 'fire', name: 'Fire', icon: 'Fire', color: elements.fire.base },
  water: { id: 'water', name: 'Water', icon: 'Drop', color: elements.water.base },
  earth: { id: 'earth', name: 'Earth', icon: 'Mountains', color: elements.earth.base },
  wind: { id: 'wind', name: 'Wind', icon: 'Wind', color: elementNameAccents.Wind },
  void: { id: 'void', name: 'Void', icon: 'Circle', color: elements.void.base },
  spirit: { id: 'spirit', name: 'Spirit', icon: 'Sparkle', color: brand.arcaneanGold },
};

// ── The canonical corpus (mirror of magic-intelligence-system/data/spells.json) ──

// The corpus is loaded from lib/magic/spells.json (mirror of
// magic-intelligence-system/data/spells.json in the `arcanea` repo).
export const SPELLS: SpellData[] = (spellsRaw as { spells: unknown[] }).spells as unknown as SpellData[];

// ── Query helpers ─────────────────────────────────────────────────────────────

export const getAllSpells = (): SpellData[] => SPELLS;
export const getSpell = (id: string): SpellData | undefined => SPELLS.find((s) => s.id === id);
export const getSpellsByDiscipline = (d: Discipline): SpellData[] =>
  SPELLS.filter((s) => s.discipline === d).sort((a, b) => TIERS[a.tier].order - TIERS[b.tier].order);
export const getSpellsByTier = (t: SpellTier): SpellData[] => SPELLS.filter((s) => s.tier === t);
export const getSpellsByElement = (e: Element): SpellData[] => SPELLS.filter((s) => s.element === e);

/** discipline → tier → spells, for matrix rendering */
export function getMatrix(d: Discipline): Record<SpellTier, SpellData[]> {
  const out = {} as Record<SpellTier, SpellData[]>;
  for (const t of TIER_ORDER) out[t] = SPELLS.filter((s) => s.discipline === d && s.tier === t);
  return out;
}
