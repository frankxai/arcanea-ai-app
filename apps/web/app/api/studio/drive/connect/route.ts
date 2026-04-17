/**
 * GET /api/studio/drive/connect
 *
 * Informational endpoint — returns the Google OAuth scope + redirect URL
 * the client should use to (re)authenticate with drive.readonly.
 *
 * The actual OAuth flow runs client-side via:
 *   supabase.auth.signInWithOAuth({
 *     provider: 'google',
 *     options: {
 *       scopes: 'https://www.googleapis.com/auth/drive.readonly',
 *       redirectTo: '/auth/callback?next=/studio/vault'
 *     }
 *   })
 *
 * This route exists so the server can surface the exact scope + redirect
 * so the UI stays DRY.
 */

import { NextResponse } from 'next/server';
import { GOOGLE_DRIVE_SCOPE } from '@/lib/studio/drive';

export async function GET() {
  return NextResponse.json({
    provider: 'google',
    scope: GOOGLE_DRIVE_SCOPE,
    suggestedRedirect: '/auth/callback?next=/studio/vault',
    instructions:
      "Call supabase.auth.signInWithOAuth({ provider: 'google', options: { scopes: '<scope>', redirectTo: '<redirect>' } }) on the client. After callback, /api/studio/drive/list will have an access token.",
    note: 'provider_token is only available during the live session immediately after OAuth. For background sync (future), tokens should be persisted to user_oauth_tokens via a dedicated callback handler.',
  });
}
