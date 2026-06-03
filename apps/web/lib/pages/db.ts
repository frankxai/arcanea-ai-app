/**
 * Service-role Supabase client scoped to the `pages` table.
 *
 * The `pages` table is not yet part of the generated Database types, so this
 * client is intentionally untyped (no Database generic) to allow `.from('pages')`
 * without type errors — mirroring how api/ai/chat creates an ad-hoc client for
 * custom tables. It uses the service role key and therefore BYPASSES RLS, so
 * every caller MUST enforce ownership explicitly (see api/pages routes).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv, getSupabaseServiceRoleKey } from '@/lib/supabase/env';

let cached: SupabaseClient | null = null;

export function pagesServiceClient(): SupabaseClient {
  if (cached) return cached;
  const { url } = getSupabaseEnv();
  cached = createClient(url, getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export const PAGES_TABLE = 'pages' as const;
