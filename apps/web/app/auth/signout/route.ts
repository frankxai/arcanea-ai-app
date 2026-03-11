import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function signOutAndRedirect(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next');
  const redirectPath = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign-out failed:', error);
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}

export async function GET(request: NextRequest) {
  return signOutAndRedirect(request);
}

export async function POST(request: NextRequest) {
  return signOutAndRedirect(request);
}
