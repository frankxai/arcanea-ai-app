// ── Creator types and demo data for community components ───────────────────

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  element: string;
  gateLevel: number;
  gateName: string;
  house?: string;
  creationCount: number;
  followerCount: number;
  rank: string;
  featured?: boolean;
  recentCreation?: string;
}

export const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Earth: '#22c55e',
  Wind: '#e2e8f0',
  Void: '#8b5cf6',
  Spirit: '#fbbf24',
};

export const RANK_COLORS: Record<string, string> = {
  Apprentice: '#94a3b8',
  Mage: '#3b82f6',
  Master: '#8b5cf6',
  Archmage: '#ffd700',
  Luminor: '#7fffd4',
};

/** Demo creators shown when the API returns empty results or is not configured */
export const DEMO_CREATORS: Creator[] = [
  {
    id: 'c1', username: 'resonance_mage', displayName: 'Resonance Mage',
    bio: 'Voice Gate practitioner. Writing ritual texts and guided meditations through the Arcanean mythos.',
    element: 'Water', gateLevel: 5, gateName: 'Voice', house: 'Aqualis',
    creationCount: 47, followerCount: 312, rank: 'Master', featured: true,
    recentCreation: 'The Dungeon of Silence',
  },
  {
    id: 'c2', username: 'archive_walker', displayName: 'Archive Walker',
    bio: 'Visual chronicler of the Godbeasts. Mapping territories through AI-guided illustration.',
    element: 'Void', gateLevel: 6, gateName: 'Sight', house: 'Nero',
    creationCount: 83, followerCount: 567, rank: 'Master', featured: true,
    recentCreation: 'Godbeast Field Studies',
  },
  {
    id: 'c3', username: 'solfeggio_wanderer', displayName: 'The Solfeggio Wanderer',
    bio: 'Composing frequency-aligned music for each Gate. Sound as a path to creation.',
    element: 'Earth', gateLevel: 2, gateName: 'Foundation', house: 'Terra',
    creationCount: 22, followerCount: 189, rank: 'Apprentice',
    recentCreation: 'Frequency Compositions: 174 Hz',
  },
  {
    id: 'c4', username: 'flame_weaver', displayName: 'Flame Weaver',
    bio: 'Code and fire. Building tools that channel Draconia\'s transformative energy into creation.',
    element: 'Fire', gateLevel: 7, gateName: 'Crown', house: 'Pyros',
    creationCount: 156, followerCount: 892, rank: 'Archmage', featured: true,
    recentCreation: 'Arcanea CLI Toolkit v2',
  },
  {
    id: 'c5', username: 'crystal_singer', displayName: 'Crystal Singer',
    bio: 'Transmuting words into worlds. Library texts, prophecies, and song lyrics.',
    element: 'Water', gateLevel: 4, gateName: 'Heart', house: 'Aqualis',
    creationCount: 38, followerCount: 245, rank: 'Mage',
    recentCreation: 'Hymn of the Heart Gate',
  },
  {
    id: 'c6', username: 'void_weaver', displayName: 'Void Weaver',
    bio: 'Exploring the space between creation and dissolution. Dark ambient and experimental audio.',
    element: 'Void', gateLevel: 8, gateName: 'Starweave', house: 'Nero',
    creationCount: 91, followerCount: 678, rank: 'Archmage',
    recentCreation: 'Malachar: The Fallen Symphony',
  },
  {
    id: 'c7', username: 'terra_sculptor', displayName: 'Terra Sculptor',
    bio: 'Grounding visions in form. 3D environments and character design rooted in Earth element.',
    element: 'Earth', gateLevel: 3, gateName: 'Fire', house: 'Terra',
    creationCount: 29, followerCount: 134, rank: 'Mage',
    recentCreation: 'Kaelith Habitat Study',
  },
  {
    id: 'c8', username: 'wind_caller', displayName: 'Wind Caller',
    bio: 'Speed and change. Rapid prototyping skills and tools for the creator community.',
    element: 'Wind', gateLevel: 5, gateName: 'Voice', house: 'Ventus',
    creationCount: 64, followerCount: 421, rank: 'Master',
    recentCreation: 'Prompt Craft Accelerator',
  },
  {
    id: 'c9', username: 'lumina_scribe', displayName: 'Lumina Scribe',
    bio: 'Keeper of the canonical texts. Contributing to the Library of Arcanea with devotion and precision.',
    element: 'Spirit', gateLevel: 9, gateName: 'Unity', house: 'Lumina',
    creationCount: 203, followerCount: 1247, rank: 'Luminor', featured: true,
    recentCreation: 'The Codex of Shared Dreaming',
  },
];
