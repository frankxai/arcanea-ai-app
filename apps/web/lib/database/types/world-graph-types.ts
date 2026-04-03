/**
 * World Graph TypeScript Types
 *
 * Convenience type aliases for the 12 World Graph tables.
 * Derived from the Supabase-generated Database type — always in sync.
 *
 * Usage:
 *   import type { World, WorldInsert, WorldCharacterRow } from '@/lib/database/types/world-graph-types';
 */

import type { Database, Json } from './supabase';

// ---------------------------------------------------------------------------
// Helper: extract Row / Insert / Update from a table name
// ---------------------------------------------------------------------------
type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
type TableInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// ---------------------------------------------------------------------------
// worlds
// ---------------------------------------------------------------------------
export type WorldRow = TableRow<'worlds'>;
export type WorldInsert = TableInsert<'worlds'>;
export type WorldUpdate = TableUpdate<'worlds'>;

/** Alias — the most commonly used world type */
export type World = WorldRow;

// ---------------------------------------------------------------------------
// world_characters
// ---------------------------------------------------------------------------
export type WorldCharacterRow = TableRow<'world_characters'>;
export type WorldCharacterInsert = TableInsert<'world_characters'>;
export type WorldCharacterUpdate = TableUpdate<'world_characters'>;

// ---------------------------------------------------------------------------
// world_factions
// ---------------------------------------------------------------------------
export type WorldFactionRow = TableRow<'world_factions'>;
export type WorldFactionInsert = TableInsert<'world_factions'>;
export type WorldFactionUpdate = TableUpdate<'world_factions'>;

// ---------------------------------------------------------------------------
// world_locations
// ---------------------------------------------------------------------------
export type WorldLocationRow = TableRow<'world_locations'>;
export type WorldLocationInsert = TableInsert<'world_locations'>;
export type WorldLocationUpdate = TableUpdate<'world_locations'>;

// ---------------------------------------------------------------------------
// world_events
// ---------------------------------------------------------------------------
export type WorldEventRow = TableRow<'world_events'>;
export type WorldEventInsert = TableInsert<'world_events'>;
export type WorldEventUpdate = TableUpdate<'world_events'>;

// ---------------------------------------------------------------------------
// world_creations
// ---------------------------------------------------------------------------
export type WorldCreationRow = TableRow<'world_creations'>;
export type WorldCreationInsert = TableInsert<'world_creations'>;
export type WorldCreationUpdate = TableUpdate<'world_creations'>;

// ---------------------------------------------------------------------------
// world_stars
// ---------------------------------------------------------------------------
export type WorldStarRow = TableRow<'world_stars'>;
export type WorldStarInsert = TableInsert<'world_stars'>;
export type WorldStarUpdate = TableUpdate<'world_stars'>;

// ---------------------------------------------------------------------------
// world_forks
// ---------------------------------------------------------------------------
export type WorldForkRow = TableRow<'world_forks'>;
export type WorldForkInsert = TableInsert<'world_forks'>;
export type WorldForkUpdate = TableUpdate<'world_forks'>;

// ---------------------------------------------------------------------------
// world_collaborators
// ---------------------------------------------------------------------------
export type WorldCollaboratorRow = TableRow<'world_collaborators'>;
export type WorldCollaboratorInsert = TableInsert<'world_collaborators'>;
export type WorldCollaboratorUpdate = TableUpdate<'world_collaborators'>;

// ---------------------------------------------------------------------------
// user_credits
// ---------------------------------------------------------------------------
export type UserCreditRow = TableRow<'user_credits'>;
export type UserCreditInsert = TableInsert<'user_credits'>;
export type UserCreditUpdate = TableUpdate<'user_credits'>;

// ---------------------------------------------------------------------------
// credit_transactions
// ---------------------------------------------------------------------------
export type CreditTransactionRow = TableRow<'credit_transactions'>;
export type CreditTransactionInsert = TableInsert<'credit_transactions'>;
export type CreditTransactionUpdate = TableUpdate<'credit_transactions'>;

// ---------------------------------------------------------------------------
// user_progression
// ---------------------------------------------------------------------------
export type UserProgressionRow = TableRow<'user_progression'>;
export type UserProgressionInsert = TableInsert<'user_progression'>;
export type UserProgressionUpdate = TableUpdate<'user_progression'>;

// ---------------------------------------------------------------------------
// Composite / enriched types used by API routes
// ---------------------------------------------------------------------------

/** A world with its related entities loaded (GET /api/worlds/[slug]) */
export interface WorldWithGraph extends WorldRow {
  characters: WorldCharacterRow[];
  factions: WorldFactionRow[];
  locations: WorldLocationRow[];
  events: WorldEventRow[];
}

/** Gemini response part (used in generate-image route) */
export interface GeminiResponsePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

/** Re-export Json for convenience */
export type { Json };
