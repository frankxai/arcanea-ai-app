/**
 * Marketplace Types — Arcanea Agents
 *
 * Core type definitions for the agent marketplace: agents, tasks,
 * credits, and transactions. All types are strict, no `any`.
 */

import type { LuminorSpec } from '@/lib/luminors/luminor-spec';

// ---------------------------------------------------------------------------
// Agent Categories
// ---------------------------------------------------------------------------

export type AgentCategory =
  | 'writing'
  | 'creative'
  | 'development'
  | 'knowledge'
  | 'music'
  | 'visual'
  | 'publishing'
  | 'marketing'
  | 'language'
  | 'education';

// ---------------------------------------------------------------------------
// Task Status
// ---------------------------------------------------------------------------

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

// ---------------------------------------------------------------------------
// Marketplace Agent
// ---------------------------------------------------------------------------

export interface MarketplaceAgent {
  /** Unique slug identifier (e.g. "story-writer") */
  id: string;
  /** Display name (e.g. "Quillblade") */
  name: string;
  /** Mythic title (e.g. "The Story Weaver") */
  title: string;
  /** Agent category for filtering */
  category: AgentCategory;
  /** 1-2 sentence pitch shown in the card */
  description: string;
  /** Full capabilities paragraph shown on the detail page */
  longDescription: string;
  /** Credit cost per execution */
  priceCredits: number;
  /** Elemental affinity: Fire | Water | Earth | Wind | Void | Spirit */
  element: string;
  /** Which Guardian Gate this agent is aligned to */
  gateAlignment: string;
  /** Emoji or icon identifier for the card */
  icon: string;
  /** Hex color for card accent border / glow */
  color: string;
  /** CSS gradient string for card background */
  gradient: string;
  /** What this agent can do (3-5 short bullet items) */
  capabilities: string[];
  /** Placeholder text shown inside the task input field */
  inputPlaceholder: string;
  /** 3 example tasks to inspire the user */
  examplePrompts: string[];
  /** Full portable spec — system prompt, model preference, voice, etc. */
  spec: LuminorSpec;
  /** Average rating (0-5) */
  rating: number;
  /** Total number of executions across all users */
  usageCount: number;
  /** Whether this agent appears in the Featured section */
  isFeatured: boolean;
  /** User ID of the creator; null = platform-built agent */
  creatorId: string | null;
}

// ---------------------------------------------------------------------------
// Agent Task (execution history record)
// ---------------------------------------------------------------------------

export interface AgentTask {
  /** UUID primary key */
  id: string;
  /** Supabase auth user ID */
  userId: string;
  /** MarketplaceAgent.id */
  agentId: string;
  /** Raw text input submitted by the user */
  input: string;
  /** Streamed / completed output text; null while running */
  output: string | null;
  /** Current lifecycle state */
  status: TaskStatus;
  /** Credits deducted for this task */
  creditsConsumed: number;
  /** Model label used (e.g. "Sonnet 4.6") */
  modelUsed: string | null;
  /** ISO timestamp when the task was created */
  startedAt: string;
  /** ISO timestamp when the task finished; null while running */
  completedAt: string | null;
}

// ---------------------------------------------------------------------------
// Credit System
// ---------------------------------------------------------------------------

export interface CreditBalance {
  userId: string;
  balance: number;
  updatedAt: string;
}

export type CreditTransactionType = 'purchase' | 'consume' | 'bonus' | 'refund';

export interface CreditTransaction {
  /** UUID primary key */
  id: string;
  /** Supabase auth user ID */
  userId: string;
  /** Positive = credits added; negative = credits consumed */
  amount: number;
  /** Transaction type */
  type: CreditTransactionType;
  /** Which agent triggered this transaction; null for non-agent ops */
  agentId: string | null;
  /** Human-readable description */
  description: string;
  /** ISO timestamp */
  createdAt: string;
}
