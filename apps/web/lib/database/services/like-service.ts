// Like Service — uses actual Supabase likes table
import type { SupabaseClient } from '@supabase/supabase-js'

export async function toggleLike(
  supabase: SupabaseClient,
  userId: string,
  creationId: string
): Promise<{ liked: boolean; count: number }> {
  const existing = await getLikeStatus(supabase, userId, creationId)

  if (existing) {
    await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('creation_id', creationId)
  } else {
    await supabase
      .from('likes')
      .insert({ user_id: userId, creation_id: creationId })
  }

  const count = await getLikesCount(supabase, creationId)
  return { liked: !existing, count }
}

export async function getLikeStatus(
  supabase: SupabaseClient,
  userId: string,
  creationId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('likes')
    .select('user_id')
    .eq('user_id', userId)
    .eq('creation_id', creationId)
    .maybeSingle()

  return !!data
}

export async function getLikesCount(
  supabase: SupabaseClient,
  creationId: string
): Promise<number> {
  const { count } = await supabase
    .from('likes')
    .select('user_id', { count: 'exact', head: true })
    .eq('creation_id', creationId)

  return count ?? 0
}

export async function getUserLikedCreations(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from('likes')
    .select('creation_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (data || []).map(row => row.creation_id)
}
