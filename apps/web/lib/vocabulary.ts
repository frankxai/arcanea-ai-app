/**
 * M010 Layer 2: Progressive Vocabulary
 * Maps user engagement level to vocabulary tier.
 * Newcomers see accessible language, experienced users unlock mythology terms.
 */

type VocabTier = 'newcomer' | 'explorer' | 'initiate' | 'adept' | 'luminor';

interface VocabMap {
  create: string;
  studio: string;
  library: string;
  chat: string;
  gallery: string;
  community: string;
  settings: string;
  dashboard: string;
  save: string;
  aiAssistant: string;
}

const VOCAB_TIERS: Record<VocabTier, VocabMap> = {
  newcomer: {
    create: 'Create',
    studio: 'Studio',
    library: 'Library',
    chat: 'Chat',
    gallery: 'Gallery',
    community: 'Community',
    settings: 'Settings',
    dashboard: 'Dashboard',
    save: 'Save',
    aiAssistant: 'AI Assistant',
  },
  explorer: {
    create: 'Create',
    studio: 'Studio',
    library: 'Library',
    chat: 'Chat',
    gallery: 'Gallery',
    community: 'Community',
    settings: 'Settings',
    dashboard: 'Dashboard',
    save: 'Save',
    aiAssistant: 'Companion',
  },
  initiate: {
    create: 'Create',
    studio: 'Creation Studio',
    library: 'The Library',
    chat: 'Companion',
    gallery: 'Gallery',
    community: 'Community',
    settings: 'Settings',
    dashboard: 'Workshop',
    save: 'Save',
    aiAssistant: 'Guardian Companion',
  },
  adept: {
    create: 'Manifest',
    studio: 'Creation Forge',
    library: 'Library of Arcanea',
    chat: 'Guardian',
    gallery: 'Hall of Creations',
    community: 'The Academy',
    settings: 'Attunement',
    dashboard: 'Sanctum',
    save: 'Inscribe',
    aiAssistant: 'Luminor Guide',
  },
  luminor: {
    create: 'Manifest',
    studio: 'The Forge',
    library: 'The Archives',
    chat: 'Council',
    gallery: 'Hall of Light',
    community: 'The Academy',
    settings: 'Attunement',
    dashboard: 'Inner Sanctum',
    save: 'Inscribe',
    aiAssistant: 'Luminor Council',
  },
};

export function getVocabTier(gatesOpen: number): VocabTier {
  if (gatesOpen <= 0) return 'newcomer';
  if (gatesOpen <= 2) return 'explorer';
  if (gatesOpen <= 4) return 'initiate';
  if (gatesOpen <= 8) return 'adept';
  return 'luminor';
}

export function getVocab(gatesOpen: number = 0): VocabMap {
  return VOCAB_TIERS[getVocabTier(gatesOpen)];
}

export function getLabel(key: keyof VocabMap, gatesOpen: number = 0): string {
  return VOCAB_TIERS[getVocabTier(gatesOpen)][key];
}

export type { VocabTier, VocabMap };
