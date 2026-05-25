/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function requireUser(options?: { redirectTo?: string; next?: string }) {
  const user = await getCurrentUser();

  if (!user) {
    const path = options?.redirectTo ?? '/auth/login';
    const search = options?.next ? `?next=${encodeURIComponent(options.next)}` : '';
    redirect(`${path}${search}`);
  }

  return user;
}

export async function getCurrentSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}
