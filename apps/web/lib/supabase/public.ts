import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database/types/supabase';
import { getPublicSupabaseBinding } from '@/lib/supabase/env';

/**
 * Stateless client for public Data API reads.
 *
 * It carries only the publishable/anon credential, never a service-role key,
 * and deliberately has no browser session or request-cookie coupling. RLS is
 * the authorization boundary.
 */
export function createPublicClient() {
  const { url, anonKey, source, projectRef } = getPublicSupabaseBinding();

  const client = createSupabaseClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return {
    client,
    binding: { source, projectRef },
  };
}
