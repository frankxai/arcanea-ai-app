/**
 * Canonical types for the Luminor tool factory.
 *
 * Every tool the system exposes (chat, per-Luminor executor, swarm) is built
 * through `buildLuminorTools()` with one of these contexts. The shape stays
 * backward-compatible with the old `createChatTools()` (chat route) and
 * `resolveToolsForLuminor()` (executor route) call sites.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LuminorToolSet = Record<string, any>;

/** Tools every authenticated Luminor may carry. */
export const UNIVERSAL_TOOL_NAMES = [
  'handoff_to_luminor',
  'search_vault',
  'save_to_vault',
  'memory_store',
  'update_memory',
  'web_search',
  'deep_research',
  'image_generate',
] as const;

export type UniversalToolName = (typeof UNIVERSAL_TOOL_NAMES)[number];

/** The complete context a Luminor tool factory needs. */
export interface LuminorToolContext {
  /** Luminor identity for tools that scope per-Luminor (e.g. Letta memory block). */
  luminorId?: string;

  /** Domain string (from teamToDomain()) drives domain-specific tool selection. */
  domain?: string;

  /** Authenticated user id — enables persistence-backed tools. */
  userId?: string | null;

  /** True if the caller has a verified Supabase session. */
  authenticated?: boolean;

  /** Supabase client scoped to the user — required for vault + memory writes. */
  supabaseClient?: SupabaseClient | null;

  /** User-provided search API key (Tavily/Brave) when server has none. */
  searchApiKey?: string;

  /**
   * Subset of tool names to include. When omitted, all tools appropriate
   * for the context are returned. Used by the chat route to let creators
   * opt in (enabledTools: ['image', 'handoff', 'research']).
   */
  include?: UniversalToolName[] | 'all';
}

/** Legacy shape kept for resolveToolsForLuminor() compatibility. */
export interface ResolverContext {
  luminorId: string;
  domain: string;
  userId?: string | null;
  authenticated: boolean;
}
