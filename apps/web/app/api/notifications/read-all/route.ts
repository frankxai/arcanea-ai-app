/**
 * Notifications Read-All API
 *
 * POST /api/notifications/read-all
 *
 * Marks all notifications as read for the current user.
 * Notifications system is not yet implemented — returns success stub.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  // Notifications system not yet implemented
  return NextResponse.json({ success: true });
}
