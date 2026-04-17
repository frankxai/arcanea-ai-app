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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
