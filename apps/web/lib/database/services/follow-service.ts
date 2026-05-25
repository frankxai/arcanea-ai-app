/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// Follow Service — uses actual Supabase follows table
import type { SupabaseClient } from '@supabase/supabase-js'

export async function toggleFollow(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<{ following: boolean }> {
  if (followerId === followingId) return { following: false }

  const isFollowing = await getFollowStatus(supabase, followerId, followingId)

  if (isFollowing) {
    await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
  } else {
    await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId })
  }

  return { following: !isFollowing }
}

export async function getFollowStatus(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle()

  return !!data
}

export async function getFollowers(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('following_id', userId)

  return (data || []).map(row => row.follower_id)
}

export async function getFollowing(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId)

  return (data || []).map(row => row.following_id)
}

export async function getFollowersCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from('follows')
    .select('follower_id', { count: 'exact', head: true })
    .eq('following_id', userId)

  return count ?? 0
}

export async function getFollowingCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from('follows')
    .select('following_id', { count: 'exact', head: true })
    .eq('follower_id', userId)

  return count ?? 0
}
