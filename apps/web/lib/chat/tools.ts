/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Chat route adapter — forwards to the canonical Luminor tool factory.
 *
 * Historical shape preserved: `createChatTools(options)` returns a record of
 * named tools that `streamText()` can consume. All tool logic now lives in
 * `lib/luminors/tools/*`; this file is the chat-route-flavored entry point.
 *
 * Keep this thin. New tools should land in `lib/luminors/tools/` so the
 * swarm engine, per-Luminor executor, and MCP server all share one definition.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  buildLuminorTools,
  LUMINOR_IDS,
  UNIVERSAL_TOOL_NAMES,
  VAULT_CLASSIFICATIONS,
  MEMORY_CATEGORIES,
  type LuminorToolContext,
  type LuminorToolSet,
  type UniversalToolName,
} from '@/lib/luminors/tools';

// Re-export canon for callers that already import these names from here.
export { LUMINOR_IDS, UNIVERSAL_TOOL_NAMES, VAULT_CLASSIFICATIONS, MEMORY_CATEGORIES };
export type { LuminorToolContext, LuminorToolSet, UniversalToolName };

export interface ChatToolOptions {
  supabaseClient?: SupabaseClient;
  userId?: string;
  searchApiKey?: string;
}

/**
 * Build the chat route's tool set. Returns every tool the caller has auth
 * for; the chat route filters further via its own `enabledTools` list.
 *
 * @see lib/luminors/tools/index.ts for the real factory.
 */
export function createChatTools(options?: ChatToolOptions): LuminorToolSet {
  return buildLuminorTools({
    supabaseClient: options?.supabaseClient ?? null,
    userId: options?.userId ?? null,
    authenticated: Boolean(options?.supabaseClient && options?.userId),
    searchApiKey: options?.searchApiKey,
  });
}

/** Backward-compatible default — no persistence-backed tools. */
export const chatTools = createChatTools();
