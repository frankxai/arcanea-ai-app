/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Supabase Server Client
 *
 * Use this in Server Components, Server Actions, and Route Handlers
 * Properly handles cookies for auth session management
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database/types/supabase';
import { getSupabaseEnv, getSupabaseServiceRoleKey } from '@/lib/supabase/env';

function getMockClient() {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        };
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: async () => ({ data: null, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
          }),
        };
      }

      if (
        prop === 'toJSON' ||
        prop === 'toString' ||
        prop === 'inspect' ||
        typeof prop === 'symbol'
      ) {
        return undefined;
      }

      const chain = () => {};
      const proxyChain: any = new Proxy(chain, {
        apply(target, thisArg, argumentsList) {
          return proxyChain;
        },
        get(target, key) {
          if (key === 'then') {
            return (resolve: any) => resolve({ data: null, error: null });
          }
          if (key === 'catch') {
            return (reject: any) => {};
          }
          if (
            key === 'toJSON' ||
            key === 'toString' ||
            key === 'inspect' ||
            typeof key === 'symbol'
          ) {
            return undefined;
          }
          return proxyChain;
        }
      });

      return proxyChain;
    }
  };
  return new Proxy({}, handler);
}

/**
 * Create Supabase client for server-side usage
 * Respects RLS policies and user sessions via cookies
 *
 * Note: This is async because cookies() returns a Promise in Next.js 15+
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  if (url.includes('example.supabase.co')) {
    return getMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component context - cannot set cookies
            // This is expected in initial render, cookies are set via middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Server Component context - cannot remove cookies
          }
        },
      },
    }
  );
}

/**
 * Create Supabase admin client for server-side usage
 *
 * WARNING: This client BYPASSES Row Level Security
 * Only use for admin operations that require elevated permissions
 * NEVER expose this client to the browser
 *
 * @throws {Error} If SUPABASE_SERVICE_ROLE_KEY is not set
 */
export function createAdminClient() {
  const { url } = getSupabaseEnv();
  if (url.includes('example.supabase.co')) {
    return getMockClient();
  }

  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createServerClient<Database>(
    url,
    serviceRoleKey,
    {
      cookies: {
        get() { return undefined; },
        set() { },
        remove() { },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

/**
 * Type exports for convenience
 */
export type { Database };
export type SupabaseClient = ReturnType<typeof createClient>;
export type SupabaseAdminClient = ReturnType<typeof createAdminClient>;
