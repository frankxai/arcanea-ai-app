/**
 * Like Service - Web App Wrapper
 *
 * Wraps database service with Supabase client injection
 */

import { createClient } from '@/lib/supabase/server';
import {
  toggleLike,
  getLikeStatus,
} from '@/lib/database/services/like-service';

export async function likeCreation(userId: string, creationId: string) {
  const supabase = await createClient();
  const isLiked = await getLikeStatus(supabase, userId, creationId);

  if (isLiked) {
    return {
      id: `${userId}-${creationId}`,
      userId,
      creationId,
      createdAt: new Date().toISOString(),
    };
  }

  const result = await toggleLike(supabase, userId, creationId);

  if (result.liked) {
    return {
      id: `${userId}-${creationId}`,
      userId,
      creationId,
      createdAt: new Date().toISOString(),
    };
  }

  throw new Error('Failed to like creation');
}

export async function unlikeCreation(userId: string, creationId: string) {
  const supabase = await createClient();
  const isLiked = await getLikeStatus(supabase, userId, creationId);

  if (!isLiked) {
    return { success: true };
  }

  const result = await toggleLike(supabase, userId, creationId);

  if (!result.liked) {
    return { success: true };
  }

  throw new Error('Failed to unlike creation');
}
