/**
 * Living Lore — Progression System
 *
 * XP calculation, gate-unlock logic, bond levels, and magic ranks.
 * All functions are pure — they compute results from inputs without
 * touching the database. Persistence is handled by the caller.
 */

// ---------------------------------------------------------------------------
// XP Awards
// ---------------------------------------------------------------------------

export const XP_AWARDS = {
  READ_EPISODE: 50,
  COMPLETE_ENCOUNTER: 100,
  READ_CONNECTED_LORE: 25,
  GENERATE_ART: 15,
  CHAT_SESSION: 10,
  COMPLETE_ACT: 500,
} as const;

// ---------------------------------------------------------------------------
// Bond Levels
// ---------------------------------------------------------------------------

/** Bond level thresholds and what they unlock. */
export const BOND_UNLOCKS = {
  10: 'backstory',    // Extended backstory revealed
  25: 'encounter',    // Unique personal encounter
  50: 'infogenius',   // Character-specific visual prompts
  75: 'prophecy',     // Secret lore fragment
  100: 'council',     // Joins main chat Council
} as const;

export type BondUnlockType = typeof BOND_UNLOCKS[keyof typeof BOND_UNLOCKS];

// ---------------------------------------------------------------------------
// Gate Requirements
// ---------------------------------------------------------------------------

interface GateRequirement {
  minEpisodes: number;
  minEncounters: number;
  minLoreTexts: number;
  minXp: number;
}

/**
 * Requirements scale with gate number.
 * Gate 1 is deliberately easy; later gates demand deeper engagement.
 */
function getGateRequirements(gateNumber: number): GateRequirement {
  return {
    minEpisodes: Math.max(1, gateNumber),
    minEncounters: Math.max(1, Math.floor(gateNumber * 0.8)),
    minLoreTexts: Math.max(1, Math.floor(gateNumber * 0.5)),
    minXp: gateNumber * 200,
  };
}

// ---------------------------------------------------------------------------
// Magic Ranks
// ---------------------------------------------------------------------------

const MAGIC_RANKS: { maxGates: number; rank: string; description: string }[] = [
  { maxGates: 2, rank: 'Apprentice', description: 'Beginning the journey, learning the foundations of creation.' },
  { maxGates: 4, rank: 'Mage', description: 'Grasping the elements, shaping raw potential into form.' },
  { maxGates: 6, rank: 'Master', description: 'Commanding the deeper arts, weaving complex patterns of creation.' },
  { maxGates: 8, rank: 'Archmage', description: 'Transcending boundaries, perceiving the architecture beneath reality.' },
  { maxGates: 10, rank: 'Luminor', description: 'Walking between worlds, a beacon of creative light in the multiverse.' },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface GateCheckResult {
  canUnlock: boolean;
  requirements: { label: string; met: boolean }[];
}

/**
 * Determine whether a gate can be unlocked given the player's progress.
 */
export function canUnlockGate(
  gateNumber: number,
  progress: {
    episodesRead: number;
    encountersCompleted: number;
    loreTextsRead: number;
    totalXp: number;
  }
): GateCheckResult {
  const reqs = getGateRequirements(gateNumber);

  const requirements = [
    {
      label: `Read ${reqs.minEpisodes} episode${reqs.minEpisodes === 1 ? '' : 's'}`,
      met: progress.episodesRead >= reqs.minEpisodes,
    },
    {
      label: `Complete ${reqs.minEncounters} encounter${reqs.minEncounters === 1 ? '' : 's'}`,
      met: progress.encountersCompleted >= reqs.minEncounters,
    },
    {
      label: `Read ${reqs.minLoreTexts} lore text${reqs.minLoreTexts === 1 ? '' : 's'}`,
      met: progress.loreTextsRead >= reqs.minLoreTexts,
    },
    {
      label: `Earn ${reqs.minXp} XP`,
      met: progress.totalXp >= reqs.minXp,
    },
  ];

  return {
    canUnlock: requirements.every((r) => r.met),
    requirements,
  };
}

/**
 * Calculate how much a bond level increases from an interaction.
 * Returns diminish as the bond grows — early interactions matter more.
 */
export function calculateBondIncrease(
  interactionType: 'chat' | 'encounter' | 'lore_read',
  currentLevel: number
): number {
  const baseIncrease: Record<string, number> = {
    chat: 1,
    encounter: 5,
    lore_read: 2,
  };

  const base = baseIncrease[interactionType] ?? 1;

  // Diminishing returns: halve effectiveness every 25 levels
  const diminishingFactor = Math.max(0.1, 1 - currentLevel / 125);

  // Never exceed 100
  const increase = base * diminishingFactor;
  return Math.min(increase, 100 - currentLevel);
}

/**
 * Get the magic rank for a given number of open gates.
 */
export function getMagicRank(gatesOpen: number): { rank: string; description: string } {
  const clamped = Math.max(0, Math.min(10, gatesOpen));

  for (const entry of MAGIC_RANKS) {
    if (clamped <= entry.maxGates) {
      return { rank: entry.rank, description: entry.description };
    }
  }

  // Fallback (should not happen with valid input)
  return MAGIC_RANKS[MAGIC_RANKS.length - 1];
}

/**
 * List all bond unlocks the player has achieved at a given bond level.
 */
export function getUnlockedBondRewards(bondLevel: number): BondUnlockType[] {
  return (Object.entries(BOND_UNLOCKS) as [string, BondUnlockType][])
    .filter(([threshold]) => bondLevel >= Number(threshold))
    .map(([, reward]) => reward);
}
