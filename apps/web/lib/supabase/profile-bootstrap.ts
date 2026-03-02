import type { User } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Ensure a profile exists for the given user.
 * Called from the auth callback route as a safety net.
 * The DB trigger `on_auth_user_created` handles most cases,
 * but OAuth sign-ins may race — this upsert catches any gaps.
 */
export async function ensureProfileForUser(user: User) {
  try {
    const admin = createAdminClient();

    const displayName =
      (typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name) ||
      (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
      (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
      user.email?.split('@')[0] ||
      'Creator';

    const avatarUrl =
      (typeof user.user_metadata?.avatar_url === 'string' && user.user_metadata.avatar_url) ||
      null;

    const { error } = await admin.from('profiles').upsert(
      {
        id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        gates_open: 0,
        magic_rank: 'Apprentice',
        streak_days: 0,
        xp: 0,
        level: 1,
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    );

    if (error) {
      console.error('Profile bootstrap failed:', error.message);
    }
  } catch (error) {
    console.error('Profile bootstrap unexpected error:', error);
  }
}
