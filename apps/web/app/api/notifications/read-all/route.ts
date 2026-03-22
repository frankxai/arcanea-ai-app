/**
 * Notifications Read-All API
 *
 * POST /api/notifications/read-all
 *
 * Marks all notifications as read for the current user
 * via the mark_all_notifications_read() RPC.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markAllAsRead } from '@/lib/database/services/notification-service';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await markAllAsRead(supabase, user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
