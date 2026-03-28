import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureProfileForUser } from '@/lib/supabase/profile-bootstrap';

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/')) return '/';
  if (next.startsWith('//')) return '/';
  return next;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = getSafeNextPath(requestUrl.searchParams.get('next'));

  // Handle error responses from OAuth providers (e.g. user denied consent)
  const oauthError = requestUrl.searchParams.get('error');
  if (oauthError) {
    const description = requestUrl.searchParams.get('error_description') || oauthError;
    console.error('OAuth callback error:', oauthError, description);
    return NextResponse.redirect(
      new URL(`/auth/login?error=oauth_denied&message=${encodeURIComponent(description)}`, requestUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_code', requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await ensureProfileForUser(user);
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    console.error('Supabase auth callback exchange failed:', error.message);
  } catch (error) {
    console.error('Supabase auth callback unexpected error:', error);
  }

  return NextResponse.redirect(
    new URL('/auth/login?error=callback_failed', requestUrl.origin)
  );
}
