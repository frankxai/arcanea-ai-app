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
