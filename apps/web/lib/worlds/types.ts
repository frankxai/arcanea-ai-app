/**
 * World Graph Types
 *
 * Service-layer type definitions derived from the live Supabase schema.
 * The canonical DB types live in @/lib/database/types/world-graph-types.ts.
 * This file re-exports those plus adds generation / analysis types
 * used only by the service layer.
 */

import type { Json } from '@/lib/database/types/supabase';
import type {
  WorldRow,
  WorldInsert,
  WorldUpdate,
  WorldCharacterRow,
  WorldCharacterInsert,
  WorldFactionRow,
  WorldLocationRow,
  WorldEventRow,
  WorldCreationRow,
  WorldWithGraph as DbWorldWithGraph,
} from '@/lib/database/types/world-graph-types';

// ── Re-exports (use these in the service layer) ──────────────────────

export type World = WorldRow;
export type WorldInsert_ = WorldInsert;
export type WorldUpdate_ = WorldUpdate;
export type WorldCharacter = WorldCharacterRow;
export type WorldCharacterInsert_ = WorldCharacterInsert;
export type WorldFaction = WorldFactionRow;
export type WorldLocation = WorldLocationRow;
export type WorldEvent = WorldEventRow;
export type WorldCreation = WorldCreationRow;

// ── Composite / Hydrated ────────────────────────────────────────────

export interface WorldWithGraph extends WorldRow {
  characters: WorldCharacterRow[];
  factions: WorldFactionRow[];
  locations: WorldLocationRow[];
  events: WorldEventRow[];
  creations: WorldCreationRow[];
}

// ── Generation Inputs / Outputs ────────────────────────────────────

export interface GenerateWorldInput {
  description: string;
  tone?: string;
  elements?: string[];
}

export interface GeneratedWorld {
  name: string;
  tagline: string;
  description: string;
  elements: string[];
  tone: string;
  characters: Array<{
    name: string;
    primary_element: string | null;
    gates_open: number;
    rank: string | null;
    house: string | null;
    archetype: string | null;
    backstory: string | null;
    traits: string[];
    abilities: string[];
    patron_guardian: string | null;
    metadata: Record<string, unknown> | null;
  }>;
  locations: Array<{
    name: string;
    location_type: string | null;
    dominant_element: string | null;
    alignment: 'light' | 'dark' | 'balanced';
    description: string | null;
    features: string[];
    metadata: Record<string, unknown> | null;
  }>;
  firstEvent: {
    title: string;
    description: string;
    event_type: string;
  };
}

export interface GenerateCharacterInput {
  worldSlug: string;
  prompt: string;
  element?: string;
  archetype?: string;
}

export interface WorldAnalysis {
  health: number;
  grade: string;
  strengths: string[];
  gaps: Array<{
    type: string;
    severity: 'critical' | 'important' | 'nice_to_have';
    description: string;
    suggestion: string;
  }>;
  nextActions: Array<{ priority: number; action: string }>;
  narrativePotential: string;
}

export interface ConflictSeed {
  title: string;
  type: string;
  aggressors: string[];
  defenders: string[];
  stakes: string;
  rootCause: string;
  escalation: string[];
  possibleResolutions: string[];
  moralComplexity: string;
}

// ── Agent Memory Types ──────────────────────────────────────────────

export interface CharacterAgentConfig {
  agentId: string;
  characterName: string;
  worldSlug: string;
  systemPrompt: string;
}

export interface CharacterMemoryEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ── List / Query Options ────────────────────────────────────────────

export interface ListWorldsOptions {
  page?: number;
  limit?: number;
  search?: string;
  element?: string;
  sortBy?: 'created_at' | 'star_count' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type { Json };
