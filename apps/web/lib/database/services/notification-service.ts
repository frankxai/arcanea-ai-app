/**
 * Notification Service — Supabase Implementation
 *
 * Queries the public.notifications table and related RPCs.
 * Auto-joins actor profile for display_name / avatar_url.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export interface Notification {
  id: string
  userId: string
  type: 'like' | 'follow' | 'comment' | 'mention' | 'achievement' | 'system' | 'council' | 'gate_unlock'
  title: string
  body: string | null
  link: string | null
  actorId: string | null
  actorName?: string
  actorAvatar?: string
  entityType: string | null
  entityId: string | null
  read: boolean
  createdAt: string
}

export async function getNotifications(
  supabase: SupabaseClient,
  userId: string,
  options: { page?: number; pageSize?: number } = {}
): Promise<{ notifications: Notification[]; total: number }> {
  const page = options.page ?? 1
  const pageSize = options.pageSize ?? 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('notifications')
    .select(`
      *,
      actor:profiles!notifications_actor_id_fkey(display_name, avatar_url)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    notifications: (data ?? []).map(mapNotification),
    total: count ?? 0,
  }
}

export async function getUnreadCount(supabase: SupabaseClient): Promise<number> {
  const { data, error } = await supabase.rpc('get_unread_notification_count')
  if (error) return 0
  return data ?? 0
}

export async function markAsRead(supabase: SupabaseClient, notificationIds: string[]): Promise<void> {
  const { error } = await supabase.rpc('mark_notifications_read', { notification_ids: notificationIds })
  if (error) throw error
}

export async function markAllAsRead(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_all_notifications_read')
  if (error) throw error
}

function mapNotification(data: Record<string, unknown>): Notification {
  const actor = data.actor as Record<string, unknown> | null
  return {
    id: data.id as string,
    userId: data.user_id as string,
    type: data.type as Notification['type'],
    title: data.title as string,
    body: data.body as string | null,
    link: data.link as string | null,
    actorId: data.actor_id as string | null,
    actorName: actor?.display_name as string | undefined,
    actorAvatar: actor?.avatar_url as string | undefined,
    entityType: data.entity_type as string | null,
    entityId: data.entity_id as string | null,
    read: data.read as boolean,
    createdAt: data.created_at as string,
  }
}
