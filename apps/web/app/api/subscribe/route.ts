/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

const SUBSCRIBE_RATE_LIMIT = { maxRequests: 3, windowMs: 60_000 };

// A green response must mean the email is stored; placeholder config gets the
// no-op mock client in lib/supabase/server.ts, which resolves as success.
function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.length > 0 && !url.includes('example.supabase.co');
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(req), SUBSCRIBE_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email required' },
        { status: 400 },
      );
    }

    if (!supabaseConfigured()) {
      console.error('[subscribe] Supabase not configured; refusing capture');
      return NextResponse.json(
        { success: false, error: 'Subscriptions are temporarily unavailable. Please try again shortly.' },
        { status: 503 },
      );
    }

    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);
    const sanitizedSource = (source || 'footer').slice(0, 50);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    // Upsert into subscribers table — ignore duplicates
    const { error } = await supabase
      .from('subscribers')
      .upsert(
        { email: sanitizedEmail, source: sanitizedSource },
        { onConflict: 'email', ignoreDuplicates: true },
      );

    if (error) {
      console.error('[subscribe] Supabase upsert failed:', error.message);
      return NextResponse.json(
        { success: false, error: 'Subscriptions are temporarily unavailable. Please try again shortly.' },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
