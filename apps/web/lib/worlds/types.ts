/**
 * World Graph Types
 *
 * Unified type definitions for the World service layer.
 * Maps to Supabase tables: worlds, world_characters, world_factions,
 * world_locations, world_events, world_creations.
 */

import type { Json } from '@/lib/database/types/supabase';

// ── Core Entities ───────────────────────────────────────────────────

export interface World {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_image_url: string | null;
  elements: string[];
  tone: string | null;
  is_public: boolean;
  is_template: boolean;
  forked_from: string | null;
  star_count: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  metadata: Json | null;
}

export interface WorldCharacter {
  id: string;
  world_id: string;
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
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface WorldFaction {
  id: string;
  world_id: string;
  name: string;
  element: string | null;
  alignment: 'light' | 'dark' | 'balanced' | 'neutral';
  description: string | null;
  territory: string | null;
  leader_character_id: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface WorldLocation {
  id: string;
  world_id: string;
  name: string;
  location_type: string | null;
  dominant_element: string | null;
  alignment: 'light' | 'dark' | 'balanced';
  description: string | null;
  features: string[];
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface WorldEvent {
  id: string;
  world_id: string;
  title: string;
  event_type: string | null;
  description: string | null;
  involved_character_ids: string[];
  involved_location_id: string | null;
  sequence_order: number;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface WorldCreation {
  id: string;
  world_id: string;
  creation_type: 'artifact' | 'creature' | 'magic' | 'custom';
  name: string;
  element: string | null;
  description: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

// ── Composite / Hydrated ────────────────────────────────────────────

export interface WorldWithGraph extends World {
  characters: WorldCharacter[];
  factions: WorldFaction[];
  locations: WorldLocation[];
  events: WorldEvent[];
  creations: WorldCreation[];
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
  characters: Omit<WorldCharacter, 'id' | 'world_id' | 'created_at' | 'updated_at'>[];
  locations: Omit<WorldLocation, 'id' | 'world_id' | 'created_at' | 'updated_at'>[];
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
