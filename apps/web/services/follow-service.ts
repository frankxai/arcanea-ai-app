/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
