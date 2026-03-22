/**
 * Notification Service - Web App Wrapper
 *
 * Wraps database service for user notifications.
 * Accepts a SupabaseClient to delegate real queries.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getNotifications as dbGetNotifications,
  markAsRead as dbMarkAsRead,
  markAllAsRead as dbMarkAllAsRead,
} from '@/lib/database/services/notification-service';

export interface NotificationOptions {
  page?: number;
  pageSize?: number;
}

export async function getNotifications(supabase: SupabaseClient, userId: string, options: NotificationOptions = {}) {
  const { page = 1, pageSize = 20 } = options;
  const result = await dbGetNotifications(supabase, userId, { page, pageSize });

  return {
    notifications: result.notifications,
    pagination: {
      page,
      pageSize,
      total: result.total,
      hasMore: page * pageSize < result.total,
    },
  };
}

export async function getUserNotifications(supabase: SupabaseClient, userId: string, options: NotificationOptions = {}) {
  return getNotifications(supabase, userId, options);
}

export async function markNotificationAsRead(supabase: SupabaseClient, notificationIds: string[]) {
  await dbMarkAsRead(supabase, notificationIds);
  return { success: true };
}

export async function markAllAsRead(supabase: SupabaseClient, userId: string) {
  await dbMarkAllAsRead(supabase, userId);
  return { success: true };
}
