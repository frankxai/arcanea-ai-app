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
 * Untyped admin client for registry operations.
 * Bypasses RLS for read/write. Use only in server-side contexts.
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
