/**
 * Arcanean canon glossary — initial set.
 *
 * Sourced from canon files in book/ and .arcanea/ as of 2026-05-03.
 * This is a starting set for Phase 1 launch; expand by:
 *   1. Reading book/ for new world names, characters, factions, artifacts
 *   2. Classifying each as preserve / translate / adapt
 *   3. Filling per-locale renderings (translators add their locale during their pass)
 *
 * Classification rules:
 * - preserve: proper nouns (place names, character names, faction names,
 *   artifact names that are proper nouns). Verbatim across all locales.
 * - translate: descriptive concepts that have natural locale equivalents
 *   (e.g. "the Forge" is a metaphor, not a place name → die Schmiede).
 * - adapt: concepts that need cultural framing, not literal translation
 *   (mythological metaphors, regional idioms).
 */

import { defineGlossary, type GlossaryEntry } from '@starlight/multilingual';

export const ARCANEAN_GLOSSARY_ENTRIES: GlossaryEntry[] = [
  // ── World names (preserve) ──
  {
    term: 'Pyrathis',
    flag: 'preserve',
    perLocale: { en: 'Pyrathis', de: 'Pyrathis', es: 'Pyrathis', ja: 'Pyrathis', fr: 'Pyrathis', 'pt-BR': 'Pyrathis', 'zh-Hans': 'Pyrathis' },
    category: 'place',
    world: 'pyrathis',
    note: 'Unhatched world-dragon. Tier-10 sister-world. Always preserved.',
  },
  {
    term: "Vel'Tara",
    flag: 'preserve',
    perLocale: { en: "Vel'Tara", de: "Vel'Tara", es: "Vel'Tara", ja: "Vel'Tara", fr: "Vel'Tara", 'pt-BR': "Vel'Tara", 'zh-Hans': "Vel'Tara" },
    category: 'place',
    world: 'vel-tara',
  },
  {
    term: 'Cosmara',
    flag: 'preserve',
    perLocale: { en: 'Cosmara', de: 'Cosmara', es: 'Cosmara', ja: 'Cosmara', fr: 'Cosmara', 'pt-BR': 'Cosmara', 'zh-Hans': 'Cosmara' },
    category: 'place',
    world: 'cosmara',
    note: 'Sister-world. Preserved across locales.',
  },

  // ── AI personas (preserve — they are characters with proper names) ──
  {
    term: 'Lumina',
    flag: 'preserve',
    perLocale: { en: 'Lumina', de: 'Lumina', es: 'Lumina', ja: 'Lumina', fr: 'Lumina', 'pt-BR': 'Lumina', 'zh-Hans': 'Lumina' },
    category: 'character',
    note: 'First Light, Form-Giver, default chat persona. AI persona — preserved across all locales.',
  },
  {
    term: 'Stellaris',
    flag: 'preserve',
    perLocale: { en: 'Stellaris', de: 'Stellaris', es: 'Stellaris', ja: 'Stellaris', fr: 'Stellaris', 'pt-BR': 'Stellaris' },
    category: 'character',
    note: 'Franchise companion character.',
  },
  {
    term: 'Shinkami',
    flag: 'preserve',
    perLocale: { en: 'Shinkami', de: 'Shinkami', es: 'Shinkami', ja: 'Shinkami', fr: 'Shinkami', 'pt-BR': 'Shinkami' },
    category: 'character',
    note: 'Guardian persona. Japanese-origin name — preserved.',
  },

  // ── Faction names (preserve) ──
  {
    term: 'Starlight Corps',
    flag: 'preserve',
    perLocale: { en: 'Starlight Corps', de: 'Starlight Corps', es: 'Starlight Corps', ja: 'Starlight Corps', fr: 'Starlight Corps', 'pt-BR': 'Starlight Corps' },
    category: 'faction',
    note: 'Brand-name faction. Preserved verbatim like a corporate name.',
  },
  {
    term: 'Void Ascendant',
    flag: 'preserve',
    perLocale: { en: 'Void Ascendant', de: 'Void Ascendant', es: 'Void Ascendant', ja: 'Void Ascendant', fr: 'Void Ascendant', 'pt-BR': 'Void Ascendant' },
    category: 'faction',
    note: 'Antagonist faction. Brand-name preserved.',
  },

  // ── Faction names (translate — descriptive) ──
  {
    term: 'Starbound Crew',
    flag: 'translate',
    perLocale: {
      en: 'Starbound Crew',
      de: 'Sternenwanderer-Crew',
      es: 'Tripulacion Astrolimite',
      ja: 'Hoshi-Kuruu',
      fr: 'Equipage Stellaire',
      'pt-BR': 'Tripulacao Estelar',
    },
    category: 'faction',
    note: 'Generic crew classification, translatable.',
  },

  // ── Artifact categories (translate) ──
  {
    term: 'Gate Keys',
    flag: 'translate',
    perLocale: {
      en: 'Gate Keys',
      de: 'Tor-Schluessel',
      es: 'Llaves de la Puerta',
      ja: 'Mon-no-Kagi',
      fr: 'Cles de la Porte',
      'pt-BR': 'Chaves da Porta',
      'zh-Hans': 'Men-de-Yaoshi',
    },
    category: 'artifact',
    note: 'Descriptive category of artifact — not a specific named object.',
  },

  // ── Place metaphors (translate) ──
  {
    term: 'the Forge',
    flag: 'translate',
    perLocale: {
      en: 'the Forge',
      de: 'die Schmiede',
      es: 'la Forja',
      ja: 'Koubou',
      fr: 'la Forge',
      'pt-BR': 'a Forja',
    },
    category: 'place',
    note: 'Metaphorical place — translates literally.',
  },

  // ── Concepts (preserve when ceremonial, translate when descriptive) ──
  {
    term: 'Ten Gates',
    flag: 'preserve',
    perLocale: { en: 'Ten Gates', de: 'Ten Gates', es: 'Ten Gates', ja: 'Ten Gates', fr: 'Ten Gates', 'pt-BR': 'Ten Gates' },
    category: 'concept',
    note: 'Capability framework — preserved as proper noun (like a brand name).',
  },
  {
    term: 'Apprentice',
    flag: 'translate',
    perLocale: {
      en: 'Apprentice',
      de: 'Lehrling',
      es: 'Aprendiz',
      ja: 'Minarai',
      fr: 'Apprenti',
      'pt-BR': 'Aprendiz',
    },
    category: 'concept',
    note: 'Ten Gates rank — translatable.',
  },
  {
    term: 'Luminor',
    flag: 'preserve',
    perLocale: { en: 'Luminor', de: 'Luminor', es: 'Luminor', ja: 'Luminor', fr: 'Luminor', 'pt-BR': 'Luminor' },
    category: 'concept',
    note: 'Top-tier rank in Ten Gates. Coined Arcanean term — preserved.',
  },

  // ── Material science (preserve names; translate categories) ──
  {
    term: 'Gate Crystal',
    flag: 'translate',
    perLocale: {
      en: 'Gate Crystal',
      de: 'Tor-Kristall',
      es: 'Cristal de la Puerta',
      ja: 'Mon-Suishou',
      fr: 'Cristal de la Porte',
      'pt-BR': 'Cristal da Porta',
    },
    category: 'material',
  },

  // ── Site/section names that appear as in-prose terms ──
  {
    term: 'Open Library',
    flag: 'preserve',
    perLocale: { en: 'Open Library', de: 'Open Library', es: 'Open Library', ja: 'Open Library', fr: 'Open Library' },
    category: 'concept',
    note: 'Product name — preserved like a brand.',
  },
  {
    term: 'Author Studio',
    flag: 'preserve',
    perLocale: { en: 'Author Studio', de: 'Author Studio', es: 'Author Studio', ja: 'Author Studio', fr: 'Author Studio' },
    category: 'concept',
    note: 'Product name — preserved.',
  },
  {
    term: 'Translation Studio',
    flag: 'preserve',
    perLocale: { en: 'Translation Studio', de: 'Translation Studio', es: 'Translation Studio', ja: 'Translation Studio', fr: 'Translation Studio' },
    category: 'concept',
    note: 'Product name — preserved.',
  },

  // ── Common Guardian role names ──
  // Roles are translatable when descriptive; agent IDs in code stay English
  {
    term: 'Voice Alchemist',
    flag: 'translate',
    perLocale: {
      en: 'Voice Alchemist',
      de: 'Stimm-Alchemist',
      es: 'Alquimista de Voz',
      ja: 'Koe-no-Renkinjutsushi',
      fr: 'Alchimiste de Voix',
      'pt-BR': 'Alquimista de Voz',
    },
    category: 'concept',
    note: 'Guardian role — translatable when used in prose.',
  },
  {
    term: 'Sensitivity Reader',
    flag: 'translate',
    perLocale: {
      en: 'Sensitivity Reader',
      de: 'Sensitivitaets-Lektor',
      es: 'Lector de Sensibilidad',
      ja: 'Kanjusei-Yomite',
      fr: 'Lecteur de Sensibilite',
      'pt-BR': 'Leitor de Sensibilidade',
    },
    category: 'concept',
  },
];

/**
 * Default Arcanean canon glossary, ready to import.
 *
 * Usage in apps/web:
 *
 *   import { arcaneanGlossary } from '@arcanea/multilingual-config/glossary';
 *   import { scanPassage } from '@starlight/multilingual';
 *
 *   const hits = scanPassage(arcaneanGlossary, chapterText, 'de', 'pyrathis');
 */
export const arcaneanGlossary = defineGlossary({
  defaultLocale: 'en',
  entries: ARCANEAN_GLOSSARY_ENTRIES,
});
