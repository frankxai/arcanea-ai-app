/**
 * GET /api/studio/drive/list
 *
 * List the current user's Google Drive files (defaults to Google Docs).
 * Requires the user to have signed in via the Google provider with the
 * drive.readonly scope (see /api/studio/drive/connect).
 *
 * Query params:
 *   q         — substring match on file name
 *   pageToken — pagination continuation
 *   pageSize  — 1..100, default 25
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDriveAccessToken, listDriveFiles } from '@/lib/studio/drive';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  const token = await getDriveAccessToken(supabase);
  if (!token) {
    return NextResponse.json(
      {
        error: 'Google Drive not connected. Sign in with Google and grant drive.readonly.',
        connect: '/api/studio/drive/connect',
      },
      { status: 412 },
    );
  }

  const { searchParams } = request.nextUrl;

  try {
    const result = await listDriveFiles(token, {
      query: searchParams.get('q') ?? undefined,
      pageToken: searchParams.get('pageToken') ?? undefined,
      pageSize: searchParams.has('pageSize')
        ? Number(searchParams.get('pageSize'))
        : undefined,
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    // If Google returned 401, token is stale — instruct re-auth
    if (msg.includes('401')) {
      return NextResponse.json(
        { error: 'Google token expired. Reconnect Drive.', connect: '/api/studio/drive/connect' },
        { status: 412 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
