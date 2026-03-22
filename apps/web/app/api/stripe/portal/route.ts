/**
 * Stripe Customer Portal
 *
 * Redirects authenticated users to their Stripe billing portal
 * for managing subscriptions, payment methods, and invoices.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stripe customer ID from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id' as any)
      .eq('id', user.id)
      .single();

    if (!(profile as any)?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found. Visit /pricing to subscribe.' },
        { status: 404 }
      );
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: (profile as any).stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arcanea.ai'}/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Portal creation failed';
    console.error('Stripe portal error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
