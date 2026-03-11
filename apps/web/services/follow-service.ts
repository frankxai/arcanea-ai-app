/**
 * Follow Service - Web App Wrapper
 *
 * Wraps database service with Supabase client injection
 */

import { createClient } from '@/lib/supabase/server';
import {
  toggleFollow,
  getFollowStatus,
} from '@/lib/database/services/follow-service';

export async function followUser(followerId: string, followingId: string) {
  const supabase = await createClient();
  const isFollowing = await getFollowStatus(supabase, followerId, followingId);

  if (isFollowing) {
    return {
      id: `${followerId}-${followingId}`,
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    };
  }

  const result = await toggleFollow(supabase, followerId, followingId);

  return {
    id: `${followerId}-${followingId}`,
    followerId,
    followingId,
    createdAt: new Date().toISOString(),
    following: result.following,
  };
}

export async function unfollowUser(followerId: string, followingId: string) {
  const supabase = await createClient();
  const isFollowing = await getFollowStatus(supabase, followerId, followingId);

  if (!isFollowing) {
    return { success: true };
  }

  await toggleFollow(supabase, followerId, followingId);
  return { success: true };
}
