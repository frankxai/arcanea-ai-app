/**
 * Cookie-free Supabase client for public, read-only server surfaces.
 *
 * The publishable/anon key does not bypass Postgres privileges or RLS. This
 * avoids initializing Next.js request cookies for pages whose first read is
 * intentionally public; authenticated/private paths must still use server.ts.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/types/supabase";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();

  // Build-only placeholders are valid for compilation, never runtime I/O.
  if (
    /^https:\/\/(example|placeholder)\.supabase\.co\/?$/i.test(url) ||
    /^(preview-build-)?placeholder(?:-key)?$/i.test(anonKey)
  ) {
    return null;
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
