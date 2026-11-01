/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Stripe Checkout Session API
 *
 * Creates a Stripe Checkout session for upgrading to Creator or Studio tier.
 * Fail-closed: see lib/billing/stripe-gate.ts for the go-live conditions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripeCheckoutGate } from '@/lib/billing/stripe-gate';

export async function POST(req: NextRequest) {
  try {
    const { tier } = await req.json();

    // Fail closed before auth or Stripe: the billing switch, a reviewed
    // for-sale tier status, the key and the price id must all be present.
    const gate = stripeCheckoutGate(tier);
    if (!gate.ok) {
      return NextResponse.json(
        { error: gate.error, code: gate.refusal, refusal: gate.refusal },
        { status: gate.status }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Dynamic import to avoid build errors when stripe isn't installed
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(gate.secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: gate.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcanea.ai'}/settings?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcanea.ai'}/pricing?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        tier,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Checkout session created without a redirect URL.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    console.error('Stripe checkout error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
