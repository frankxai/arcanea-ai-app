/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Registry Supabase Client
 *
 * The Database type generated from the current schema doesn't yet include
 * the registry tables (marketplace_agents, platforms, creators, deployments,
 * usage_events, attribution_events, skill_registry, platform_api_keys).
 *
 * This client uses an untyped escape hatch — the registry is still type-safe
 * via the interfaces in @/lib/registry/queries.ts, we just skip the generated
 * table types until the Database type is regenerated.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv, getSupabaseServiceRoleKey } from '@/lib/supabase/env';

/**
 * Public registry client for read-only discovery surfaces.
 * Uses the publishable/anon key so Postgres grants and RLS remain authoritative.
 */
export function createRegistryPublicClient() {
  const { url, anonKey } = getSupabaseEnv();

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Untyped admin client for registry operations.
 * Bypasses RLS for read/write. Use only in server-side write contexts;
 * public discovery must use createRegistryPublicClient, and the absence of a
 * service-role credential in a public deployment is a valid secure state.
 */
export function createRegistryAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
