/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
 * Create Supabase client for client-side usage
 * Automatically handles session refresh and persistence
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  if (url.includes('example.supabase.co')) {
    return getMockClient();
  }

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
