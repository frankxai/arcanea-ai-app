/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
    protectedPrefixes: [
      '/profile', '/onboarding', '/dashboard', '/settings',
    ],
    protectedApiPrefixes: [
      '/api/conversations/', '/api/creations/',
      '/api/council/', '/api/collections/', '/api/likes', '/api/follows',
      '/api/comments', '/api/bonds/', '/api/feedback', '/api/notifications/',
      '/api/gates/', '/api/analytics/', '/api/storage/',
      '/api/upload', '/api/forge/',
      '/api/create', '/api/command/', '/api/projects/',
      '/api/profile/', '/api/activity/',
    ],
    publicApiPrefixes: [
      '/api/health', '/api/stripe/webhook', '/api/search/',
      '/api/trending', '/api/leaderboard', '/api/gallery',
      '/api/community/stats', '/api/guardians/', '/api/profiles/',
      '/api/v1/',
      // Core creation APIs — must work without auth (keys are client-side)
      '/api/ai', '/api/chat', '/api/imagine', '/api/luminors',
      '/api/media', '/api/arcs', '/api/apl', '/api/studio',
      '/api/genesis',
      // Voice surfaces — /api/voice/cognition probes COGNITION_BRIDGE_URL
      // (returns 503 in cloud where bridge is unset), /api/voice/greeting
      // and /api/voice/classify are room-mounted helpers.
      '/api/voice',
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
