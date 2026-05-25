/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
