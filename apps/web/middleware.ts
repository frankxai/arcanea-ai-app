import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
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
