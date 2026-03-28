import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Redirect non-www to www (permanent 301) so search engines and browsers
  // cache the canonical origin. Using 301 instead of 308 avoids redirect
  // chain issues — 301 is universally cached by browsers and CDNs.
  const host = request.headers.get('host');
  if (host === 'arcanea.ai') {
    const url = request.nextUrl.clone();
    url.host = 'www.arcanea.ai';
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  return updateSession(request, {
    protectedPrefixes: [
      '/profile', '/onboarding', '/dashboard', '/settings',
      '/workspace',
    ],
    protectedApiPrefixes: [
      '/api/conversations/', '/api/creations/',
      '/api/council/', '/api/collections/', '/api/likes', '/api/follows',
      '/api/comments', '/api/bonds/', '/api/feedback', '/api/notifications/',
      '/api/gates/', '/api/analytics/', '/api/storage/',
      '/api/upload', '/api/forge/',
      '/api/create', '/api/command/', '/api/projects/',
      '/api/profile/', '/api/activity/', '/api/memories/',
    ],
    publicApiPrefixes: [
      '/api/health', '/api/stripe/webhook', '/api/search/',
      '/api/trending', '/api/leaderboard', '/api/gallery',
      '/api/community/stats', '/api/guardians/', '/api/profiles/',
      '/api/v1/',
      // Core creation APIs — must work without auth (keys are client-side)
      '/api/ai', '/api/chat', '/api/imagine', '/api/luminors',
      '/api/media', '/api/arcs', '/api/apl', '/api/studio',
    ],
    authPrefixes: ['/auth/login', '/auth/signup'],
    loginPath: '/auth/login',
    authenticatedRedirectPath: '/chat',
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
