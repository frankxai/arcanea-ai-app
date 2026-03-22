/**
 * Stripe Checkout Session API
 *
 * Creates a Stripe Checkout session for upgrading to Creator or Studio tier.
 * Requires STRIPE_SECRET_KEY and STRIPE_PRICE_* env vars.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PRICE_IDS: Record<string, string> = {
  creator: process.env.STRIPE_PRICE_CREATOR || '',
  studio: process.env.STRIPE_PRICE_STUDIO || '',
};

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe not configured. Contact support.' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await req.json();
    const priceId = PRICE_IDS[tier];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Dynamic import to avoid build errors when stripe isn't installed
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcanea.ai'}/settings?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcanea.ai'}/pricing?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    console.error('Stripe checkout error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
