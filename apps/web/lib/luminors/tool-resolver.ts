/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Per-Luminor executor tool resolver.
 *
 * Adapter over the canonical `buildLuminorTools()` factory. Preserves the
 * original `resolveToolsForLuminor(ctx)` signature used by
 * `app/api/agents/[id]/execute/route.ts`.
 *
 * New callers should prefer `buildLuminorTools()` directly.
 *
 * Reference: Luminor Kernel Spec v1.0 §5 (Runtime Protocol)
 */

import { buildLuminorTools, teamToDomain as teamToDomainImpl } from './tools';
import type { LuminorToolSet, ResolverContext } from './tools/types';

 
export type { LuminorToolSet };

export function resolveToolsForLuminor(ctx: ResolverContext): LuminorToolSet {
  return buildLuminorTools({
    luminorId: ctx.luminorId,
    domain: ctx.domain,
    userId: ctx.userId ?? null,
    authenticated: ctx.authenticated,
    // The executor path doesn't have a Supabase client injected; vault tools
    // gate on `supabaseClient` so they'll simply be absent here — which
    // matches the previous behavior.
    supabaseClient: null,
  });
}

/** Map team names (from config.ts) to domain strings. */
export const teamToDomain = teamToDomainImpl;
