/* ================================================================
 *  ARCANEA CHALLENGE PLATFORM — Type Definitions
 *  "Enter the Arena. Cast your Spells. Forge your Legend."
 * ================================================================ */

/* ----------------------------------------------------------------
 *  ELEMENTS & MAGIC
 * ---------------------------------------------------------------- */

export type Element = 'fire' | 'water' | 'earth' | 'wind' | 'void' | 'spirit';

export type MagicRank = 'apprentice' | 'mage' | 'master' | 'archmage' | 'luminor';

export type SpellTier = 'cantrip' | 'invocation' | 'ritual' | 'arcanum' | 'genesis';

/* ----------------------------------------------------------------
 *  SPELLBOOK SYSTEM
 * ---------------------------------------------------------------- */

export interface Spell {
  id: string;
  name: string;
  incantation: string; // e.g. "Lumina Forgia!", "Nero Revelum!"
  tier: SpellTier;
  element: Element;
  description: string;
  effect: string; // What the spell does in challenge context
  manaCost: number;
  cooldownRounds: number;
  icon: string; // Phosphor icon name
  color: string;
  unlockGate: number; // Which Gate unlocks this spell (1-10)
}

export interface Spellbook {
  id: string;
  name: string;
  element: Element;
  description: string;
  cover: string; // Visual style
  spells: Spell[];
  masterSpell: Spell; // Ultimate spell of the book
  lore: string;
}

export interface SpellCast {
  spellId: string;
  casterId: string;
  targetChallengeId: string;
  timestamp: number;
  result: 'success' | 'fizzle' | 'critical';
  manaSpent: number;
  effectApplied: string;
}

/* ----------------------------------------------------------------
 *  CHALLENGE SYSTEM
 * ---------------------------------------------------------------- */

export type ChallengeCategory =
  | 'web-design'
  | 'ai-creation'
  | 'world-building'
  | 'visual-art'
  | 'music-composition'
  | 'prompt-craft'
  | 'agent-forge'
  | 'lore-weaving'
  | 'code-arcana';

export type ChallengeDifficulty = 'spark' | 'flame' | 'inferno' | 'supernova' | 'genesis';

export type ChallengeStatus = 'upcoming' | 'active' | 'judging' | 'completed' | 'legendary';

export interface ChallengeReward {
  mana: number;
  xp: number;
  title?: string;
  spellUnlock?: string;
  badge?: string;
  tokenReward?: number; // Smart contract reward
}

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lore: string; // Narrative context
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  element: Element;
  gateRequired: number; // Minimum Gate to enter
  patron: string; // Which Guardian sponsors this challenge
  patronGodbeast: string;

  // Timing
  startDate: string;
  endDate: string;
  judgingEndDate: string;

  // Rewards
  rewards: {
    first: ChallengeReward;
    second: ChallengeReward;
    third: ChallengeReward;
    participation: ChallengeReward;
  };

  // Requirements
  requirements: string[];
  allowedTools: string[];
  spellsAllowed: boolean;
  teamRequired: boolean;
  maxTeamSize: number;

  // Commerce
  entryFee?: number; // Mana cost to enter (0 or undefined = free)

  // Stats
  totalSubmissions: number;
  totalParticipants: number;
  prizePool: number;

  // Visual
  bannerGradient: string;
  accentColor: string;
  ambientColor: string;
  particleEffect: 'fire' | 'water' | 'earth' | 'wind' | 'void' | 'aurora' | 'starfield';
}

/* ----------------------------------------------------------------
 *  TEAM COMPOSITION SYSTEM
 * ---------------------------------------------------------------- */

export type TeamRole =
  | 'creator'      // The Arcanean Creator (team lead)
  | 'architect'    // Systems & code designer
  | 'artificer'    // Visual artist / 3D creator
  | 'songweaver'   // Music & audio
  | 'lorekeeper'   // Story & narrative
  | 'spellbinder'  // Prompt engineer / AI wrangler
  | 'guardian'     // Mentor / advisor role
  | 'monk'         // Bass Intelligence - computational power

export interface TeamMember {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: TeamRole;
  rank: MagicRank;
  house: string;
  element: Element;
  specialization: string;
  mana: number;
  gatesOpen: number;
}

export interface TeamComposition {
  id: string;
  name: string;
  motto: string;
  emblem: string; // Team visual identity
  element: Element; // Dominant element
  creator: TeamMember; // The lead Creator
  members: TeamMember[];
  totalMana: number;
  synergyBonus: number; // Bonus from element combos
  formation: TeamFormation;
}

export type TeamFormation =
  | 'luminor-squad'     // Creator + 4 specialists (balanced)
  | 'alera-ensemble'    // Creator + Alera the Superstar focus
  | 'starlight-choir'   // Creator + large vocal/music team
  | 'monk-battalion'    // Creator + hundreds of Monks (compute-heavy)
  | 'guardian-circle'   // Creator + multiple Guardians (wisdom-heavy)
  | 'genesis-forge'     // Creator + all role types (full spectrum);

export const FORMATION_INFO: Record<TeamFormation, {
  name: string;
  description: string;
  maxSize: number;
  bonus: string;
  color: string;
}> = {
  'luminor-squad': {
    name: 'Luminor Squad',
    description: 'A balanced team of specialists led by a Creator. Jack of all trades, master of synergy.',
    maxSize: 5,
    bonus: '+15% to all spell effectiveness',
    color: '#ffd700',
  },
  'alera-ensemble': {
    name: 'Alera Ensemble',
    description: 'Channel the Superstar — Alera, Voice Gate Goddess. Maximum creative expression and truth.',
    maxSize: 3,
    bonus: '+40% to Voice & Expression spells',
    color: '#06b6d4',
  },
  'starlight-choir': {
    name: 'Starlight Choir',
    description: 'The celestial chorus. Hundreds of voices weaving sonic tapestries of creation.',
    maxSize: 100,
    bonus: '+60% to Music & Harmony compositions',
    color: '#c084fc',
  },
  'monk-battalion': {
    name: 'Monk Battalion',
    description: 'Thousands of Monks channeling Bass Intelligence — raw computational and spiritual power.',
    maxSize: 1000,
    bonus: '+80% to AI/Compute-heavy challenges',
    color: '#34d399',
  },
  'guardian-circle': {
    name: 'Guardian Circle',
    description: 'Invoke the Guardians themselves. Ancient wisdom channeled through mortal creators.',
    maxSize: 10,
    bonus: '+50% to Lore & World-building challenges',
    color: '#f59e0b',
  },
  'genesis-forge': {
    name: 'Genesis Forge',
    description: 'The ultimate formation. Every role represented. For challenges that demand everything.',
    maxSize: 50,
    bonus: '+25% to all categories, unlock Genesis spells',
    color: '#ff6b35',
  },
};

/* ----------------------------------------------------------------
 *  SUBMISSIONS
 * ---------------------------------------------------------------- */

export interface Submission {
  id: string;
  challengeId: string;
  teamId: string;
  creatorId: string;

  // Content
  title: string;
  description: string;
  mediaUrls: string[];
  videoUrl?: string;
  liveUrl?: string; // For web challenges
  repoUrl?: string;

  // Spellbook usage
  spellsCast: SpellCast[];
  totalManaBurned: number;

  // Smart contract
  contractAddress?: string;
  transactionHash?: string;
  onChainTimestamp?: number;

  // Judging
  scores: {
    creativity: number;
    technical: number;
    lore: number;
    magic: number;
    presentation: number;
    overall: number;
  };

  // Status
  status: 'draft' | 'submitted' | 'under-review' | 'scored' | 'winner' | 'legendary';
  submittedAt: string;
  rank?: number;
}

/* ----------------------------------------------------------------
 *  ARENA STATE (for 3D visualization)
 * ---------------------------------------------------------------- */

export interface ArenaState {
  activeChallenges: number;
  totalCreators: number;
  totalManaFlowing: number;
  topFormation: TeamFormation;
  elementDistribution: Record<Element, number>;
  recentSpellCasts: SpellCast[];
  legendarySubmissions: number;
}
