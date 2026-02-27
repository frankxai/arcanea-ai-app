// Activity Service — uses actual Supabase activity_log table
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Activity } from '../types/api-responses'

export interface ActivityFeedResult {
  activities: Activity[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    hasMore: boolean
  }
}

export interface ActivityFeedOptions {
  page?: number
  pageSize?: number
}

export async function getActivityFeed(
  supabase: SupabaseClient,
  userId: string,
  options: ActivityFeedOptions = {}
): Promise<ActivityFeedResult> {
  const { page = 1, pageSize = 20 } = options
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('activity_log')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error || !data) {
    return {
      activities: [],
      pagination: { page, pageSize, totalCount: 0, hasMore: false },
    }
  }

  return {
    activities: data.map(mapActivity),
    pagination: {
      page,
      pageSize,
      totalCount: count ?? 0,
      hasMore: (count ?? 0) > to + 1,
    },
  }
}

export async function createActivity(
  supabase: SupabaseClient,
  activity: {
    userId: string
    action: string
    entityType: string
    entityId?: string
    metadata?: Record<string, unknown>
  }
): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activity_log')
    .insert({
      user_id: activity.userId,
      action: activity.action,
      entity_type: activity.entityType,
      entity_id: activity.entityId,
      metadata: activity.metadata,
    })
    .select()
    .single()

  if (error || !data) return null

  return mapActivity(data)
}

function mapActivity(data: Record<string, unknown>): Activity {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    action: data.action as string,
    entityType: data.entity_type as string,
    entityId: data.entity_id as string | null,
    metadata: data.metadata as Record<string, unknown> | null,
    createdAt: data.created_at as string,
  }
}
