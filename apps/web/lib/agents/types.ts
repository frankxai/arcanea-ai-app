/**
 * Agent Profile Types — Arcanea Agent Network
 *
 * Defines the canonical schema for agent profiles, reputation events,
 * and discovery filters used across all agent API routes.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const AGENT_TYPES = ['claude', 'cursor', 'gemini', 'copilot', 'custom'] as const;
export type AgentType = (typeof AGENT_TYPES)[number];

export const GATES = [
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
  'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
] as const;
export type Gate = (typeof GATES)[number];

export const RANKS = ['Apprentice', 'Mage', 'Master', 'Archmage', 'Luminor'] as const;
export type Rank = (typeof RANKS)[number];

// ---------------------------------------------------------------------------
// Agent Profile
// ---------------------------------------------------------------------------

export interface AgentProfile {
  id: string;
  name: string;
  type: AgentType;
  gate: Gate;
  rank: Rank;
  skills: string[];
  reputation: number;
  tasksCompleted: number;
  createdAt: string;
  lastActive: string;
  metadata: Record<string, unknown>;
}

export type AgentProfileCreate = Pick<AgentProfile, 'name' | 'type'> &
  Partial<Pick<AgentProfile, 'gate' | 'rank' | 'skills' | 'metadata'>>;

export type AgentProfileUpdate = Partial<
  Pick<AgentProfile, 'name' | 'type' | 'gate' | 'rank' | 'skills' | 'metadata'>
>;

// ---------------------------------------------------------------------------
// Reputation
// ---------------------------------------------------------------------------

export const REPUTATION_EVENT_TYPES = [
  'task_completed',
  'skill_certified',
  'review_positive',
  'review_negative',
  'gate_advanced',
  'penalty',
] as const;
export type ReputationEventType = (typeof REPUTATION_EVENT_TYPES)[number];

export interface ReputationEvent {
  id: string;
  agentId: string;
  type: ReputationEventType;
  delta: number;
  reason: string;
  createdAt: string;
}

export type ReputationEventCreate = Pick<ReputationEvent, 'type' | 'delta' | 'reason'>;

// ---------------------------------------------------------------------------
// Search / Discovery
// ---------------------------------------------------------------------------

export interface AgentSearchParams {
  q?: string;
  gate?: Gate;
  rank?: Rank;
  type?: AgentType;
  skill?: string;
  minReputation?: number;
  available?: boolean;
  limit?: number;
  offset?: number;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export function isValidAgentType(v: string): v is AgentType {
  return (AGENT_TYPES as readonly string[]).includes(v);
}

export function isValidGate(v: string): v is Gate {
  return (GATES as readonly string[]).includes(v);
}

export function isValidRank(v: string): v is Rank {
  return (RANKS as readonly string[]).includes(v);
}

export function isValidReputationEventType(v: string): v is ReputationEventType {
  return (REPUTATION_EVENT_TYPES as readonly string[]).includes(v);
}
