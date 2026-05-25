/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
