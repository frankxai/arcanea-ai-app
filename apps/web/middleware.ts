import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Redirect non-www to www (permanent 308) so all client-side fetches
  // (including streamed POST requests to /api/ai/chat) go directly to
  // the canonical origin without an extra 307 hop.
  if (request.headers.get('host') === 'arcanea.ai') {
    const url = request.nextUrl.clone();
    url.host = 'www.arcanea.ai';
    return NextResponse.redirect(url, 308);
  }

  return updateSession(request, {
    protectedPrefixes: ['/profile', '/studio', '/onboarding', '/dashboard', '/settings'],
    authPrefixes: ['/auth/login', '/auth/signup'],
    loginPath: '/auth/login',
    authenticatedRedirectPath: '/dashboard',
  });
}

export const config = {
  matcher: [
    /*
     * Run on all routes except Next internals and static assets.
     * Supabase recommends middleware for session refresh in SSR apps.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)',
  ],
};
