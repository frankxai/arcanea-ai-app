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

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const loginPath = options.loginPath ?? '/auth/login';
  const authenticatedRedirectPath = options.authenticatedRedirectPath ?? '/chat';
  const isProtectedRoute = matchesPrefix(pathname, options.protectedPrefixes);
  const isAuthRoute = matchesPrefix(pathname, options.authPrefixes);

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
