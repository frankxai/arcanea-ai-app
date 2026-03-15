/**
 * Activity Service - Web App Wrapper
 *
 * Wraps database service with Supabase client injection
 */

import { createClient } from '@/lib/supabase/server';
import { getActivityFeed as dbGetActivityFeed } from '@/lib/database/services/activity-service';

export interface ActivityFeedOptions {
  page?: number;
  pageSize?: number;
}

export interface PersonalizedFeedResult {
  activities: Array<{
    id: string;
    action: string;
    userId: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt: string;
  }>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

export async function getPersonalizedFeed(
  userId: string,
  options: ActivityFeedOptions = {}
): Promise<PersonalizedFeedResult> {
  const { page = 1, pageSize = 20 } = options;
  const supabase = await createClient();

  const result = await dbGetActivityFeed(supabase, userId, {
    page,
    pageSize,
  });

  return {
    activities: result.activities,
    pagination: {
      page: result.pagination.page,
      pageSize: result.pagination.pageSize,
      total: result.pagination.totalCount,
      hasMore: result.pagination.hasMore,
    },
  };
}
