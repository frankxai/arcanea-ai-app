/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Supabase Middleware for Next.js
 *
 * Handles auth session refresh only on routes that require it.
 * Public pages bypass Supabase entirely for instant response.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

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

/** Preserve only the approved world draft return destination on auth pages. */
export function authenticatedRedirectUrl(
  request: NextRequest,
  fallback = "/chat",
) {
  const url = request.nextUrl.clone();
  const resumeWorld =
    url.searchParams.get("next") === "/worlds/create?resume=1";
  url.pathname = resumeWorld ? "/worlds/create" : fallback;
  url.search = resumeWorld ? "?resume=1" : "";
  return url;
}

/** Wraps getUser() with a timeout so slow Supabase responses degrade gracefully. */
async function getUserWithTimeout(
  supabase: ReturnType<typeof createServerClient>,
  timeoutMs = 4500
) {
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('getUser timeout')), timeoutMs)
      ),
    ]);
    return result.data.user;
  } catch {
    return null;
  }
}

export async function updateSession(
  request: NextRequest,
  options: UpdateSessionOptions = {},
) {
  // --- Route classification first (no network calls) ---
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = matchesPrefix(pathname, options.protectedPrefixes);
  const isAuthRoute = matchesPrefix(pathname, options.authPrefixes);
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApi = isApiRoute && matchesPrefix(pathname, options.publicApiPrefixes);

  // If the route doesn't need auth, skip Supabase entirely
  const needsAuth = isProtectedRoute || isAuthRoute || (isApiRoute && !isPublicApi);

  if (!needsAuth) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // --- Auth-required routes: create Supabase client ---
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabaseEnv();

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

  // Refresh session with timeout — degrades to unauthenticated on failure
  const user = await getUserWithTimeout(supabase);

  const loginPath = options.loginPath ?? "/auth/login";
  const authenticatedRedirectPath = options.authenticatedRedirectPath ?? '/chat';

  // API route auth: block unauthenticated access to protected API routes
  if (isApiRoute && !user) {
    const isProtectedApi = matchesPrefix(pathname, options.protectedApiPrefixes);

    // If explicitly protected, or if it's an API route not explicitly public → block
    if (isProtectedApi || !isPublicApi) {
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
    return NextResponse.redirect(
      authenticatedRedirectUrl(request, authenticatedRedirectPath),
    );
  }

  return response;
}
