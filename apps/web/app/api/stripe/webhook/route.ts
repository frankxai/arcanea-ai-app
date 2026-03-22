/**
 * Stripe Webhook Handler
 *
 * Processes subscription events:
 * - checkout.session.completed → activate subscription
 * - customer.subscription.updated → sync tier changes
 * - customer.subscription.deleted → downgrade to free
 *
 * Requires STRIPE_WEBHOOK_SECRET env var.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Use service role for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier || 'creator';

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              stripe_customer_id: session.customer as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Map price ID to tier
        const priceId = subscription.items.data[0]?.price?.id;
        let tier = 'spark';
        if (priceId === process.env.STRIPE_PRICE_CREATOR) tier = 'creator';
        if (priceId === process.env.STRIPE_PRICE_STUDIO) tier = 'studio';

        await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'spark',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook failed';
    console.error('Stripe webhook error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
