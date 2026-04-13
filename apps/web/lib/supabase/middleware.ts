/**
 * Supabase Middleware for Next.js
 *
 * Handles auth session refresh on every request
 * Should be used in proxy.ts at the root of your app (Next.js 16+ convention)
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv } from '@/lib/supabase/env';

interface UpdateSessionOptions {
  protectedPrefixes?: string[];
  protectedApiPrefixes?: string[];
  publicApiPrefixes?: string[];
  authPrefixes?: string[];
  loginPath?: string;
  authenticatedRedirectPath?: string;
}

function matchesPrefix(pathname: string, prefixes: string[] = []) {
  return prefixes.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function updateSession(
  request: NextRequest,
  options: UpdateSessionOptions = {}
) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let url: string;
  let anonKey: string;

  try {
    const env = getSupabaseEnv();
    url = env.url;
    anonKey = env.anonKey;
  } catch {
    return response;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const loginPath = options.loginPath ?? '/auth/login';
  const authenticatedRedirectPath = options.authenticatedRedirectPath ?? '/chat';
  const isProtectedRoute = matchesPrefix(pathname, options.protectedPrefixes);
  const isAuthRoute = matchesPrefix(pathname, options.authPrefixes);
  const isApiRoute = pathname.startsWith('/api/');

  // Fast path: public pages that don't need auth skip the Supabase call entirely.
  // This prevents 504s when Supabase is slow — public pages always load.
  const needsAuth = isProtectedRoute
    || isAuthRoute
    || (isApiRoute && !matchesPrefix(pathname, options.publicApiPrefixes));

  if (!needsAuth) {
    // Still refresh session opportunistically if cookies exist, but with a timeout
    // so public pages never block on Supabase.
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
    if (hasAuthCookie) {
      try {
        await Promise.race([
          supabase.auth.getUser(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ]);
      } catch {
        // Supabase slow or down — public page still loads fine
      }
    }
    return response;
  }

  // Auth-required routes: fetch user (with timeout to prevent infinite hang)
  let user = null;
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('auth_timeout')), 5000)),
    ]);
    user = result.data?.user ?? null;
  } catch {
    // Supabase unreachable — treat as unauthenticated
    user = null;
  }

  // API route auth: block unauthenticated access to protected API routes
  if (isApiRoute && !user) {
    const isProtectedApi = matchesPrefix(pathname, options.protectedApiPrefixes);

    // If explicitly protected, or if it's an API route not explicitly public → block
    if (isProtectedApi || !matchesPrefix(pathname, options.publicApiPrefixes)) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
  }

  // Page route auth: redirect to login
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = loginPath;
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = authenticatedRedirectPath;
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
