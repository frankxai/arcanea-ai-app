/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// Types for Living Lore system

export type CrewElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';

export interface CrewMember {
  id: string;
  name: string;
  species: string;
  title: string; // e.g., "The Human Creator"
  tagline: string; // one-liner
  element: CrewElement;
  guardianAffinity: string; // guardian name from mythology.ts
  luminorMapping: string | null; // luminor id from mythology.ts or null for Ren
  personality: string[];
  voice: string; // description of how they speak
  backstoryHook: string; // one paragraph teaser
  color: string; // hex primary color
  gradient: string; // tailwind gradient
  avatar: string; // emoji
  starters: string[]; // conversation starters
}

export interface Episode {
  slug: string;
  title: string;
  act: number;
  actTitle: string;
  episodeNumber: number;
  excerpt: string;
  gate: number; // which gate this act corresponds to
  perspectives: string[]; // crew member IDs who narrate
  connectedLore: string[]; // slugs from /book/ collections
  content: string; // raw markdown
}

export interface Encounter {
  slug: string;
  title: string;
  episodeSlug: string;
  act: number;
  presentCrew: string[]; // crew member IDs in scene
  openingScript: string; // pre-written narrative opening
  sceneContext: string; // context for AI to continue
  xpReward: number;
}

export interface CrewBond {
  crewMemberId: string;
  bondLevel: number; // 0-100
  conversations: number;
  encountersShared: number;
  lastInteraction: string | null;
}

export interface LivingLoreProgress {
  contentType: 'episode' | 'encounter';
  contentSlug: string;
  actNumber: number;
  startedAt: string;
  completedAt: string | null;
  choices: Record<string, unknown>;
  xpAwarded: number;
}

export interface ActInfo {
  number: number;
  title: string;
  subtitle: string;
  gate: number;
  guardianName: string;
  episodes: EpisodeMeta[];
}

export interface EpisodeMeta {
  slug: string;
  title: string;
  episodeNumber: number;
  perspectives: string[];
  connectedLore: string[];
}

// ---------------------------------------------------------------------------
// Choice System
// ---------------------------------------------------------------------------

export interface StoryChoice {
  id: string;
  encounterId: string;
  prompt: string; // "Who do you sit beside at the campfire?"
  options: ChoiceOption[];
  consequence: string; // What this choice affects
}

export interface ChoiceOption {
  id: string;
  label: string;
  crewMemberId?: string; // If choosing a character
  bondEffect?: { memberId: string; change: number }[];
  description?: string;
}

export interface UserCrewConfig {
  selectedCompanion: string; // Chosen during onboarding
  partyOrder: string[]; // Preferred crew order
  favoriteMembers: string[]; // Most interacted with
}

export const ELEMENT_COLORS: Record<CrewElement, string> = {
  Fire: 'var(--arc-fire)',
  Water: 'var(--arc-brand-cosmic-blue)',
  Earth: 'var(--arc-wind)',
  Wind: 'var(--arc-text-primary)',
  Void: 'var(--arc-void)',
  Spirit: 'var(--arc-brand-arcanean-gold)',
};
