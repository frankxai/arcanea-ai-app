/**
 * Notifications Unread Count API
 *
 * GET /api/notifications/unread-count
 *
 * Returns the number of unread notifications for the current user.
 * Notifications system is not yet implemented — returns 0 as a stub.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // Notifications system not yet implemented — return 0
  return NextResponse.json({ count: 0 });
}
