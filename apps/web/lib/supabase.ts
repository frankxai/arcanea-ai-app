/**
 * Supabase Client Configuration — LEGACY COMPATIBILITY SHIM
 *
 * All consumers have been migrated to:
 *   - Server Components, API Routes: @/lib/supabase/server → createClient(), createAdminClient()
 *   - Client Components:             @/lib/supabase/client → createClient()
 *
 * This file is kept to avoid breaking any remaining indirect consumers.
 * Do NOT add new imports from this file. Migrate to the above paths instead.
 *
 * @deprecated Use @/lib/supabase/server or @/lib/supabase/client
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database/types/supabase';

// Environment variables - use placeholders during build if not set
// This allows the build to complete; runtime will fail if not properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Warn during development if env vars are missing
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('[supabase.ts] NEXT_PUBLIC_SUPABASE_URL is not set — using placeholder. Migrate to @/lib/supabase/server.');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('[supabase.ts] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — using placeholder. Migrate to @/lib/supabase/server.');
  }
}

/**
 * @deprecated Use createClient() from @/lib/supabase/client in Client Components
 */
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * @deprecated Use createAdminClient() from @/lib/supabase/server in Server Components / API Routes
 */
export function getSupabaseAdmin() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations require service role key.');
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * @deprecated Use createClient() from @/lib/supabase/server in Server Components / API Routes
 */
export const supabaseServer = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * @deprecated Use createClient() from @/lib/supabase/server and call supabase.auth.getUser()
 */
export async function getUserFromRequest(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

/**
 * Type exports for use throughout the application
 */
export type { Database };
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
