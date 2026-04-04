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
