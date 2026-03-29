/* ================================================================
 *  ARCANEA SPELLBOOKS — The Five Elemental Grimoires
 *  "Words have power. Incantations have more."
 * ================================================================ */

import type { Spell, Spellbook, Element, SpellTier } from '@/lib/types/challenge';

/* ----------------------------------------------------------------
 *  FIRE SPELLBOOK — Liber Ignium
 * ---------------------------------------------------------------- */

const FIRE_SPELLS: Spell[] = [
  {
    id: 'fire-spark',
    name: 'Ignis Spark',
    incantation: 'Pyros Accende!',
    tier: 'cantrip',
    element: 'fire',
    description: 'Ignite the creative flame — boost your submission\'s energy score.',
    effect: '+5% Creativity score bonus',
    manaCost: 10,
    cooldownRounds: 0,
    icon: 'Flame',
    color: '#ff6b35',
    unlockGate: 1,
  },
  {
    id: 'fire-forge',
    name: 'Draconia\'s Forge',
    incantation: 'Forgia Draconis!',
    tier: 'invocation',
    element: 'fire',
    description: 'Channel the Fire Gate — transform raw ideas into refined creations.',
    effect: '+15% Technical score bonus, unlock rapid iteration mode',
    manaCost: 30,
    cooldownRounds: 2,
    icon: 'Lightning',
    color: '#f97316',
    unlockGate: 3,
  },
  {
    id: 'fire-inferno',
    name: 'Inferno Manifestation',
    incantation: 'Infernum Manifesto!',
    tier: 'ritual',
    element: 'fire',
    description: 'Unleash pure creative destruction — remake your submission from the ashes.',
    effect: 'Complete submission re-roll with +20% all scores',
    manaCost: 75,
    cooldownRounds: 5,
    icon: 'Fire',
    color: '#dc2626',
    unlockGate: 5,
  },
  {
    id: 'fire-supernova',
    name: 'Supernova Burst',
    incantation: 'Nova Suprema Ardentis!',
    tier: 'arcanum',
    element: 'fire',
    description: 'The ultimate Fire spell. Blindingly brilliant. Your creation blazes across the Arena.',
    effect: '+30% Presentation score, featured in Arena spotlight',
    manaCost: 150,
    cooldownRounds: 10,
    icon: 'Sun',
    color: '#fbbf24',
    unlockGate: 7,
  },
];

/* ----------------------------------------------------------------
 *  WATER SPELLBOOK — Liber Aquarum
 * ---------------------------------------------------------------- */

const WATER_SPELLS: Spell[] = [
  {
    id: 'water-ripple',
    name: 'Aqua Ripple',
    incantation: 'Aqualis Onda!',
    tier: 'cantrip',
    element: 'water',
    description: 'Send ripples of inspiration through the Arena — boost team synergy.',
    effect: '+5% Team synergy bonus',
    manaCost: 10,
    cooldownRounds: 0,
    icon: 'Drop',
    color: '#60a5fa',
    unlockGate: 1,
  },
  {
    id: 'water-flow',
    name: 'Leyla\'s Flow',
    incantation: 'Fluere Leyla!',
    tier: 'invocation',
    element: 'water',
    description: 'Enter the creative flow state — time seems to slow, ideas come effortlessly.',
    effect: '+15% Creativity score, unlock extended submission window',
    manaCost: 30,
    cooldownRounds: 2,
    icon: 'Waves',
    color: '#3b82f6',
    unlockGate: 2,
  },
  {
    id: 'water-heal',
    name: 'Tide of Renewal',
    incantation: 'Maris Renovatio!',
    tier: 'ritual',
    element: 'water',
    description: 'Heal and refine your creation. Water smooths all rough edges.',
    effect: 'Remove lowest score penalty, redistribute to highest',
    manaCost: 75,
    cooldownRounds: 5,
    icon: 'Heart',
    color: '#06b6d4',
    unlockGate: 4,
  },
  {
    id: 'water-tsunami',
    name: 'Memory Tsunami',
    incantation: 'Memoria Diluvium Totalis!',
    tier: 'arcanum',
    element: 'water',
    description: 'Unleash the collective memory of all Arcanean creators. Pure inspiration wave.',
    effect: 'Access community wisdom pool, +25% Lore score',
    manaCost: 150,
    cooldownRounds: 10,
    icon: 'Globe',
    color: '#0284c7',
    unlockGate: 7,
  },
];

/* ----------------------------------------------------------------
 *  EARTH SPELLBOOK — Liber Terrae
 * ---------------------------------------------------------------- */

const EARTH_SPELLS: Spell[] = [
  {
    id: 'earth-root',
    name: 'Terra Root',
    incantation: 'Terra Radix!',
    tier: 'cantrip',
    element: 'earth',
    description: 'Ground your creation in solid foundations.',
    effect: '+5% Technical score bonus',
    manaCost: 10,
    cooldownRounds: 0,
    icon: 'Leaf',
    color: '#34d399',
    unlockGate: 1,
  },
  {
    id: 'earth-fortress',
    name: 'Kaelith\'s Fortress',
    incantation: 'Fortis Kaelith!',
    tier: 'invocation',
    element: 'earth',
    description: 'Build an unbreakable foundation. Your submission resists all criticism.',
    effect: '+15% Technical score, immune to one score penalty',
    manaCost: 30,
    cooldownRounds: 2,
    icon: 'Shield',
    color: '#10b981',
    unlockGate: 1,
  },
  {
    id: 'earth-crystal',
    name: 'Crystal Growth',
    incantation: 'Crystallum Crescere!',
    tier: 'ritual',
    element: 'earth',
    description: 'Your creation grows crystalline structures — layered beauty from raw earth.',
    effect: 'Unlock 3D visual enhancement for submission, +20% Presentation',
    manaCost: 75,
    cooldownRounds: 5,
    icon: 'Diamond',
    color: '#a78bfa',
    unlockGate: 5,
  },
  {
    id: 'earth-mountain',
    name: 'Mountain Genesis',
    incantation: 'Mons Genesis Suprema!',
    tier: 'arcanum',
    element: 'earth',
    description: 'Raise a mountain from nothing. Monumental creation that reshapes the Arena.',
    effect: 'Create persistent Arena landmark from submission, +30% all scores',
    manaCost: 150,
    cooldownRounds: 10,
    icon: 'Mountains',
    color: '#059669',
    unlockGate: 7,
  },
];

/* ----------------------------------------------------------------
 *  WIND SPELLBOOK — Liber Ventorum
 * ---------------------------------------------------------------- */

const WIND_SPELLS: Spell[] = [
  {
    id: 'wind-whisper',
    name: 'Ventus Whisper',
    incantation: 'Ventus Sussuro!',
    tier: 'cantrip',
    element: 'wind',
    description: 'The wind carries secrets — gain insight into what judges value.',
    effect: 'Reveal one judging criterion emphasis',
    manaCost: 10,
    cooldownRounds: 0,
    icon: 'Wind',
    color: '#c4b5fd',
    unlockGate: 1,
  },
  {
    id: 'wind-gale',
    name: 'Alera\'s Gale',
    incantation: 'Tempestas Alera!',
    tier: 'invocation',
    element: 'wind',
    description: 'Alera\'s voice becomes a gale — your submission spreads far and wide.',
    effect: '+15% Presentation score, 2x community visibility',
    manaCost: 30,
    cooldownRounds: 2,
    icon: 'Megaphone',
    color: '#818cf8',
    unlockGate: 5,
  },
  {
    id: 'wind-storm',
    name: 'Tempest of Change',
    incantation: 'Mutatio Tempestas!',
    tier: 'ritual',
    element: 'wind',
    description: 'Reshape the challenge itself — wind bends even the rules.',
    effect: 'Swap one requirement for an alternative, +20% Magic score',
    manaCost: 75,
    cooldownRounds: 5,
    icon: 'Tornado',
    color: '#6366f1',
    unlockGate: 6,
  },
  {
    id: 'wind-aurora',
    name: 'Aurora Ascension',
    incantation: 'Aurora Transcendere Infinitum!',
    tier: 'arcanum',
    element: 'wind',
    description: 'Transcend the Arena. Your creation dances with the aurora itself.',
    effect: 'Submission displayed with aurora visual effects, +30% Magic score',
    manaCost: 150,
    cooldownRounds: 10,
    icon: 'Star',
    color: '#4f46e5',
    unlockGate: 7,
  },
];

/* ----------------------------------------------------------------
 *  VOID/SPIRIT SPELLBOOK — Liber Abyssi et Spiritus
 * ---------------------------------------------------------------- */

const VOID_SPELLS: Spell[] = [
  {
    id: 'void-glimpse',
    name: 'Nero\'s Glimpse',
    incantation: 'Nero Videre!',
    tier: 'cantrip',
    element: 'void',
    description: 'Peer into the fertile unknown — see possibilities others cannot.',
    effect: 'Reveal hidden challenge bonus objective',
    manaCost: 10,
    cooldownRounds: 0,
    icon: 'Eye',
    color: '#a78bfa',
    unlockGate: 1,
  },
  {
    id: 'void-shadow',
    name: 'Shadow Weave',
    incantation: 'Umbra Texere!',
    tier: 'invocation',
    element: 'void',
    description: 'Weave shadows into substance. What was nothing becomes something extraordinary.',
    effect: '+15% Creativity & Lore scores',
    manaCost: 30,
    cooldownRounds: 2,
    icon: 'Moon',
    color: '#8b5cf6',
    unlockGate: 6,
  },
  {
    id: 'void-singularity',
    name: 'Singularity Pulse',
    incantation: 'Singularitas Pulsare!',
    tier: 'ritual',
    element: 'void',
    description: 'Compress infinite potential into a single point. Pure creative density.',
    effect: 'Merge two submissions into one legendary entry',
    manaCost: 75,
    cooldownRounds: 5,
    icon: 'Atom',
    color: '#7c3aed',
    unlockGate: 8,
  },
  {
    id: 'void-genesis',
    name: 'Shinkami\'s Genesis',
    incantation: 'Shinkami Genesis Ultima Creatio!',
    tier: 'arcanum',
    element: 'void',
    description: 'The Source Gate spell. Create something from nothing. The ultimate act of creation.',
    effect: 'Legendary status guaranteed. Submission becomes permanent Arena lore.',
    manaCost: 300,
    cooldownRounds: 0, // Once per lifetime
    icon: 'Sparkle',
    color: '#ffd700',
    unlockGate: 10,
  },
];

/* ----------------------------------------------------------------
 *  ASSEMBLED SPELLBOOKS
 * ---------------------------------------------------------------- */

export const SPELLBOOKS: Spellbook[] = [
  {
    id: 'liber-ignium',
    name: 'Liber Ignium',
    element: 'fire',
    description: 'The Book of Flames. Transformation, destruction, rebirth. For creators who burn bright.',
    cover: 'bg-gradient-to-br from-red-900 via-orange-800 to-amber-700',
    spells: FIRE_SPELLS,
    masterSpell: FIRE_SPELLS[3],
    lore: 'Forged in Draconia\'s breath, this grimoire smolders with living flame. Each page turns itself, impatient to be read. Those who master it learn that creation and destruction are the same fire.',
  },
  {
    id: 'liber-aquarum',
    name: 'Liber Aquarum',
    element: 'water',
    description: 'The Book of Tides. Flow, healing, memory. For creators who move like water.',
    cover: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700',
    spells: WATER_SPELLS,
    masterSpell: WATER_SPELLS[3],
    lore: 'Leyla sang this book into existence from the tears of a thousand creators. Its pages ripple like the surface of a deep lake. Read it, and you remember things you never knew.',
  },
  {
    id: 'liber-terrae',
    name: 'Liber Terrae',
    element: 'earth',
    description: 'The Book of Stone. Stability, growth, permanence. For creators who build to last.',
    cover: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-700',
    spells: EARTH_SPELLS,
    masterSpell: EARTH_SPELLS[3],
    lore: 'Kaelith carved this book from the heart of a mountain. It weighs as much as your resolve. Each spell learned makes it lighter — until mastery, when it weighs nothing at all.',
  },
  {
    id: 'liber-ventorum',
    name: 'Liber Ventorum',
    element: 'wind',
    description: 'The Book of Gales. Freedom, speed, change. For creators who cannot be contained.',
    cover: 'bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-700',
    spells: WIND_SPELLS,
    masterSpell: WIND_SPELLS[3],
    lore: 'This book has no binding. Its pages are held together by Alera\'s song alone. Read it in a storm and the words rearrange themselves into exactly what you need.',
  },
  {
    id: 'liber-abyssi',
    name: 'Liber Abyssi et Spiritus',
    element: 'void',
    description: 'The Book of the Abyss and Spirit. Potential, mystery, transcendence. For creators who dare the unknown.',
    cover: 'bg-gradient-to-br from-purple-950 via-violet-900 to-fuchsia-800',
    spells: VOID_SPELLS,
    masterSpell: VOID_SPELLS[3],
    lore: 'Nero breathed this book into the space between stars. Its pages appear blank until you stop trying to read them. Shinkami sealed the final spell — only a true Luminor may speak its incantation.',
  },
];

export const ALL_SPELLS: Spell[] = [
  ...FIRE_SPELLS,
  ...WATER_SPELLS,
  ...EARTH_SPELLS,
  ...WIND_SPELLS,
  ...VOID_SPELLS,
];

export function getSpellsByElement(element: Element): Spell[] {
  return ALL_SPELLS.filter(s => s.element === element);
}

export function getSpellsByTier(tier: SpellTier): Spell[] {
  return ALL_SPELLS.filter(s => s.tier === tier);
}

export function getSpellbookByElement(element: Element): Spellbook | undefined {
  return SPELLBOOKS.find(sb => sb.element === element);
}

export function getAvailableSpells(gatesOpen: number): Spell[] {
  return ALL_SPELLS.filter(s => s.unlockGate <= gatesOpen);
}
