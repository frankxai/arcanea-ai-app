import type { User } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/server';

function sanitizeUsername(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
}

function buildUsername(user: User) {
  const metadataName =
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    '';
  const emailLocal = user.email?.split('@')[0] ?? 'creator';
  const base = sanitizeUsername(metadataName || emailLocal) || 'creator';
  return `${base}_${user.id.slice(0, 6)}`;
}

export async function ensureProfileForUser(user: User) {
  try {
    const admin = createAdminClient();

    const payload = {
      id: user.id,
      username: buildUsername(user),
      display_name:
        (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
        (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
        null,
      avatar_url:
        (typeof user.user_metadata?.avatar_url === 'string' && user.user_metadata.avatar_url) ||
        null,
      bio: null,
      academy_id: null,
    };

    const { error } = await (admin.from('profiles') as any).upsert(payload, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (error) {
      console.error('Profile bootstrap failed:', error.message);
    }
  } catch (error) {
    console.error('Profile bootstrap unexpected error:', error);
  }
}
