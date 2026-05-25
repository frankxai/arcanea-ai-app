/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Cached Supabase Auth Helper
 *
 * Wraps getUser() in React's cache() so that multiple Server Components
 * calling getCachedUser() within the same request share a single round-trip
 * to Supabase rather than each making an independent network call.
 *
 * Usage:
 *   import { getCachedUser } from '@/lib/supabase/cached-auth';
 *   const user = await getCachedUser();
 */

import { cache } from 'react';
import { createClient } from './server';

export const getCachedUser = cache(async () => {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
});
