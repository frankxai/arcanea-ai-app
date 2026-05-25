/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
