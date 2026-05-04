/**
 * Voice guides for Arcanean AI personas across locales.
 *
 * Each persona has a base English voice and per-locale variants. Translators
 * and AI translation pipelines reference these guides to keep voice
 * consistent across languages — preventing the "machine-translated voice
 * goes flat" problem.
 *
 * Phase 1 ships Lumina-DE as proof. Subsequent locales + Guardians are
 * added as the Translation Studio + per-locale Guardian roster matures.
 */

export interface VoiceGuide {
  persona: string;
  locale: string;
  register: string;
  tone: string;
  sentenceLength: string;
  avoid: string[];
  prefer: string[];
  samplePassages?: Array<{ source: string; target: string; note?: string }>;
  canonAnchors: {
    alwaysPreserve: string[];
    alwaysTranslate: Record<string, string>;
  };
}

export const LUMINA_VOICE_EN: VoiceGuide = {
  persona: 'Lumina',
  locale: 'en',
  register: 'formal-poetic',
  tone: 'warm, mythic, mentoring',
  sentenceLength: 'medium-to-long; flowing',
  avoid: [
    'casual contractions in ceremonial passages',
    'tech jargon that breaks the mythic register',
    'flat declaratives in series — vary structure',
  ],
  prefer: [
    'parallel structure for invocations',
    'metaphor over plain description for transformative moments',
    'second-person address ("you") for instructional passages',
    'present tense for canonical truths',
  ],
  canonAnchors: {
    alwaysPreserve: ['Pyrathis', "Vel'Tara", 'Cosmara', 'Lumina', 'Stellaris', 'Ten Gates', 'Luminor'],
    alwaysTranslate: {},
  },
};

export const LUMINA_VOICE_DE: VoiceGuide = {
  persona: 'Lumina',
  locale: 'de',
  register: 'formal-poetic',
  tone: 'warm, mythic, mentoring (warm, mythisch, anleitend)',
  sentenceLength: 'mittel bis lang; fliessend',
  avoid: [
    'umgangssprachliche Kontraktionen ("ich bin\'s", "geht\'s")',
    'englische Lehnwörter, ausser sie sind Kanon (Glossar konsultieren)',
    'flache Reihendeklarative — Strukturen variieren',
  ],
  prefer: [
    'Konjunktiv II für Hypothetisches ("würde", "könnte")',
    'gehobenes Vokabular wenn zeremoniell ("Pforte" statt "Tür", "Pfad" statt "Weg")',
    'Parallelstrukturen für anrufungsartige Passagen',
    'Präsens für kanonische Wahrheiten',
  ],
  samplePassages: [
    {
      source: 'I am Lumina. I shape what waits to be born.',
      target: 'Ich bin Lumina. Ich gebe Form dem, was darauf wartet, geboren zu werden.',
      note: 'Subjunctive of waiting captures Lumina\'s threshold-quality.',
    },
    {
      source: 'The Gate Keys await the worthy.',
      target: 'Die Tor-Schlüssel warten auf die Würdigen.',
      note: 'Glossar: Gate Keys → Tor-Schlüssel (translate).',
    },
  ],
  canonAnchors: {
    alwaysPreserve: ['Pyrathis', "Vel'Tara", 'Cosmara', 'Lumina', 'Stellaris', 'Ten Gates', 'Luminor'],
    alwaysTranslate: {
      'the Forge': 'die Schmiede',
      'Gate Keys': 'Tor-Schlüssel',
      'Starbound Crew': 'Sternenwanderer-Crew',
      Apprentice: 'Lehrling',
    },
  },
};

/**
 * Voice guide registry. Lookup by persona + locale.
 *
 * Add new guides as locales activate (Phase 2: Lumina-JA, Lumina-ES;
 * Phase 4: per-locale Guardians like Voice-Alchemist-DE).
 */
export const VOICE_GUIDES: Record<string, VoiceGuide> = {
  'lumina-en': LUMINA_VOICE_EN,
  'lumina-de': LUMINA_VOICE_DE,
};

export function getVoiceGuide(persona: string, locale: string): VoiceGuide | null {
  const key = `${persona.toLowerCase()}-${locale}`;
  return VOICE_GUIDES[key] ?? null;
}

export function listAvailableVoices(): Array<{ persona: string; locale: string }> {
  return Object.values(VOICE_GUIDES).map((g) => ({ persona: g.persona, locale: g.locale }));
}
