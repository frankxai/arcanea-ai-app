/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

const SUBSCRIBE_RATE_LIMIT = { maxRequests: 3, windowMs: 60_000 };

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
      // Respond success to the user regardless (don't block signup UX on
      // infra issues), but log loudly — this means the email was dropped.
      console.error('[subscribe] LOST EMAIL — Supabase upsert failed:', error.message, {
        email: sanitizedEmail,
        source: sanitizedSource,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
