/**
 * Supabase Browser Client
 *
 * Use this ONLY in Client Components (marked with 'use client')
 * Handles auth sessions via browser cookies
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database/types/supabase';
import { getSupabaseEnv } from '@/lib/supabase/env';

/**
 * Create Supabase client for client-side usage
 * Automatically handles session refresh and persistence
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();

  return createBrowserClient<Database>(
    url,
    anonKey
  );
}

/**
 * Type exports for convenience
 */
export type { Database };
export type SupabaseClient = ReturnType<typeof createClient>;
