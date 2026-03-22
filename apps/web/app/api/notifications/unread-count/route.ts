/**
 * Notifications Unread Count API
 *
 * GET /api/notifications/unread-count
 *
 * Returns the number of unread notifications for the current user
 * via the get_unread_notification_count() RPC.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUnreadCount } from '@/lib/database/services/notification-service';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ count: 0 });

    const count = await getUnreadCount(supabase);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
