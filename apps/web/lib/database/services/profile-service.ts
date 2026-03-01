// Profile Service — matches actual Supabase schema
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile, ProfileStats } from '../types/api-responses'

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return mapProfile(data)
}

export async function getProfileStats(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileStats> {
  const [creations, followers, following, userCreations] = await Promise.all([
    supabase.from('creations').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', userId),
    supabase.from('creations').select('id').eq('user_id', userId),
  ])

  let likesCount = 0
  const creationIds = (userCreations.data ?? []).map((c: { id: string }) => c.id)
  if (creationIds.length > 0) {
    const likes = await supabase
      .from('likes')
      .select('user_id', { count: 'exact', head: true })
      .in('creation_id', creationIds)
    likesCount = likes.count ?? 0
  }

  return {
    creationsCount: creations.count ?? 0,
    followersCount: followers.count ?? 0,
    followingCount: following.count ?? 0,
    likesReceived: likesCount,
    totalViews: 0,
  }
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const payload: Record<string, unknown> = {}
  if (updates.displayName !== undefined) payload.display_name = updates.displayName
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl
  if (updates.bio !== undefined) payload.bio = updates.bio
  if (updates.activeGate !== undefined) payload.active_gate = updates.activeGate
  if (updates.guardian !== undefined) payload.guardian = updates.guardian
  if (updates.academyHouse !== undefined) payload.academy_house = updates.academyHouse
  if (updates.metadata !== undefined) payload.metadata = updates.metadata

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error || !data) return null

  return mapProfile(data)
}

export async function getProfileWithStats(
  supabase: SupabaseClient,
  userId: string
): Promise<(Profile & { stats: ProfileStats }) | null> {
  const profile = await getProfile(supabase, userId)
  if (!profile) return null

  const stats = await getProfileStats(supabase, userId)
  return { ...profile, stats }
}

function mapProfile(data: Record<string, unknown>): Profile {
  return {
    id: data.id as string,
    displayName: data.display_name as string,
    avatarUrl: data.avatar_url as string | null,
    bio: data.bio as string | null,
    magicRank: (data.magic_rank || 'Apprentice') as Profile['magicRank'],
    gatesOpen: (data.gates_open || 0) as number,
    activeGate: data.active_gate as Profile['activeGate'],
    guardian: data.guardian as Profile['guardian'],
    academyHouse: data.academy_house as Profile['academyHouse'],
    xp: (data.xp || 0) as number,
    level: (data.level || 1) as number,
    streakDays: (data.streak_days || 0) as number,
    lastActiveAt: data.last_active_at as string | null,
    metadata: data.metadata as Record<string, unknown> | null,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}
