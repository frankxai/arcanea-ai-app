/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { User } from '@supabase/supabase-js';
import { createAdminClient, type createClient } from '@/lib/supabase/server';

type SessionSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export type ProfileBootstrapResult =
  | { ok: true; via: 'session' | 'admin' }
  | { ok: false; reason: string };

function buildProfileRow(user: User) {
  const displayName =
    (typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    user.email?.split('@')[0] ||
    'Creator';

  const avatarUrl =
    (typeof user.user_metadata?.avatar_url === 'string' && user.user_metadata.avatar_url) ||
    null;

  return {
    id: user.id,
    display_name: displayName,
    avatar_url: avatarUrl,
    gates_open: 0,
    magic_rank: 'Apprentice',
    streak_days: 0,
    xp: 0,
    level: 1,
  };
}

async function insertProfileIfMissing(
  client: SessionSupabaseClient | ReturnType<typeof createAdminClient>,
  user: User,
): Promise<string | null> {
  // INSERT ... ON CONFLICT (id) DO NOTHING — never overwrites an existing profile.
  const { error } = await client
    .from('profiles')
    .upsert(buildProfileRow(user), { onConflict: 'id', ignoreDuplicates: true });
  return error ? error.message : null;
}

function warn(event: string, user: User, detail: Record<string, unknown>) {
  console.warn(
    JSON.stringify({
      level: 'warn',
      event,
      scope: 'auth.profile_bootstrap',
      userId: user.id,
      ...detail,
    }),
  );
}

/**
 * Ensure a profile exists for the given user.
 * Called from the auth callback route as a safety net.
 * The DB trigger `on_auth_user_created` handles most cases,
 * but OAuth sign-ins may race — this insert catches any gaps.
 *
 * Uses the caller's authenticated session client: RLS policy
 * "Users can insert own profile" (WITH CHECK auth.uid() = id) permits a user
 * to create their own row, so no service-role key is required. Only if that
 * fails AND a service-role key is configured do we retry with the admin client.
 *
 * Never throws — sign-in must not fail because of profile bootstrap.
 */
export async function ensureProfileForUser(
  user: User,
  sessionClient: SessionSupabaseClient,
): Promise<ProfileBootstrapResult> {
  let sessionError: string | null;
  try {
    sessionError = await insertProfileIfMissing(sessionClient, user);
  } catch (error) {
    sessionError = error instanceof Error ? error.message : String(error);
  }

  if (!sessionError) return { ok: true, via: 'session' };

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    warn('profile_bootstrap_skipped', user, {
      reason: 'session_insert_failed_and_no_service_role_key',
      sessionError,
    });
    return { ok: false, reason: sessionError };
  }

  try {
    const adminError = await insertProfileIfMissing(createAdminClient(), user);
    if (!adminError) return { ok: true, via: 'admin' };
    warn('profile_bootstrap_failed', user, { sessionError, adminError });
    return { ok: false, reason: adminError };
  } catch (error) {
    const adminError = error instanceof Error ? error.message : String(error);
    warn('profile_bootstrap_failed', user, { sessionError, adminError });
    return { ok: false, reason: adminError };
  }
}
