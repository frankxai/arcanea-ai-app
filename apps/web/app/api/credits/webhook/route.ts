/**
 * Stripe Webhook Handler
 *
 * Handles payment and subscription lifecycle events from Stripe:
 *   - checkout.session.completed  (one-time credit pack purchase)
 *   - customer.subscription.created / updated / deleted  (Forge subscription)
 *
 * Stripe sends raw body + signature header. We MUST read the raw body
 * before any JSON parsing -- Next.js App Router gives us a Request with
 * an unconsumed body, which is exactly what Stripe needs.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY          -- Stripe API key (sk_live_... or sk_test_...)
 *   STRIPE_WEBHOOK_SECRET      -- Webhook signing secret (whsec_...)
 *
 * Note: credit_balances, credit_transactions, and forge_subscriptions tables
 * are not yet in the generated Supabase types. The admin client is cast to
 * `any` for `.from()` calls until types are regenerated.
 */

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { CREDIT_PACKS } from "@/lib/types/credits";

// ─── Local type shapes for Stripe objects we handle ─────────────────────────
// These match the Stripe SDK shapes we actually use. Replace with
// `import type Stripe from 'stripe'` when stripe types are installed.

interface StripeCheckoutSession {
  mode?: string;
  metadata?: Record<string, string> | null;
  customer?: string | null;
  subscription?: string | null;
  payment_intent?: string | { id: string } | null;
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  metadata?: Record<string, string> | null;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface StripeEvent {
  type: string;
  data: { object: Record<string, unknown> };
}

// ─── Stripe event type subset we care about ─────────────────────────────────

type RelevantEvent =
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted";

const RELEVANT_EVENTS = new Set<string>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error("Stripe webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  // ── Verify Stripe signature ──────────────────────────────────────────────
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: StripeEvent;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    ) as unknown as StripeEvent;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("Stripe webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // ── Ignore irrelevant event types ────────────────────────────────────────
  if (!RELEVANT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    switch (event.type as RelevantEvent) {
      // ────────────────────────────────────────────────────────────────────
      // Credit pack purchase completed
      // ────────────────────────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as unknown as StripeCheckoutSession;

        // Only process one-time payments (not subscription checkouts)
        if (session.mode !== "payment") break;

        const userId = session.metadata?.user_id;
        const packId = session.metadata?.pack_id;
        const creditsStr = session.metadata?.credits;

        if (!userId || !packId) {
          console.error("Stripe webhook: checkout.session.completed missing user_id or pack_id metadata");
          break;
        }

        // Validate pack
        const pack = CREDIT_PACKS.find((p) => p.id === packId);
        const credits = pack?.credits ?? (creditsStr ? parseInt(creditsStr, 10) : 0);

        if (!credits || credits <= 0) {
          console.error(`Stripe webhook: invalid credits for pack ${packId}`);
          break;
        }

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        console.log(
          `Stripe webhook: crediting ${credits} credits to user ${userId} (pack: ${packId}, pi: ${paymentIntentId})`,
        );

        // Credit the user's balance and log transaction
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminCheckout = createAdminClient() as any;

        // 1. Upsert balance row (create if first purchase)
        const { data: existing } = await adminCheckout
          .from("credit_balances")
          .select("purchased")
          .eq("user_id", userId)
          .single();

        const newPurchased = (existing?.purchased ?? 0) + credits;

        await adminCheckout
          .from("credit_balances")
          .upsert(
            {
              user_id: userId,
              purchased: newPurchased,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

        // 2. Log transaction
        await adminCheckout.from("credit_transactions").insert({
          user_id: userId,
          type: "purchase",
          amount: credits,
          balance_after: newPurchased,
          stripe_payment_id: paymentIntentId,
          pack_id: packId,
          description: `Purchased ${credits} credits (${packId})`,
        });

        break;
      }

      // ────────────────────────────────────────────────────────────────────
      // Forge subscription created
      // ────────────────────────────────────────────────────────────────────
      case "customer.subscription.created": {
        const subscription = event.data.object as unknown as StripeSubscription;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error("Stripe webhook: subscription.created missing user_id metadata");
          break;
        }

        console.log(`Stripe webhook: Forge subscription created for user ${userId} (sub: ${subscription.id})`);

        // Create forge_subscriptions row + set is_forge on balance
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminSubCreate = createAdminClient() as any;

        await adminSubCreate.from("forge_subscriptions").upsert(
          {
            user_id: userId,
            status: subscription.status,
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

        await adminSubCreate
          .from("credit_balances")
          .upsert(
            {
              user_id: userId,
              is_forge: true,
              forge_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

        break;
      }

      // ────────────────────────────────────────────────────────────────────
      // Forge subscription updated (renewal, payment method change, etc.)
      // ────────────────────────────────────────────────────────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as StripeSubscription;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error("Stripe webhook: subscription.updated missing user_id metadata");
          break;
        }

        const isActive = ["active", "trialing"].includes(subscription.status);

        console.log(
          `Stripe webhook: Forge subscription updated for user ${userId} — status: ${subscription.status}, active: ${isActive}`,
        );

        // Update forge_subscriptions row + balance flag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminSubUpdate = createAdminClient() as any;

        await adminSubUpdate
          .from("forge_subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        await adminSubUpdate
          .from("credit_balances")
          .update({
            is_forge: isActive,
            forge_expires_at: isActive
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        break;
      }

      // ────────────────────────────────────────────────────────────────────
      // Forge subscription deleted (cancelled, expired, or payment failed)
      // ────────────────────────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as StripeSubscription;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error("Stripe webhook: subscription.deleted missing user_id metadata");
          break;
        }

        console.log(`Stripe webhook: Forge subscription deleted for user ${userId} (sub: ${subscription.id})`);

        // Mark subscription canceled + remove forge flag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminSubDelete = createAdminClient() as any;

        await adminSubDelete
          .from("forge_subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        await adminSubDelete
          .from("credit_balances")
          .update({
            is_forge: false,
            forge_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler error";
    console.error("Stripe webhook processing error:", message);
    return NextResponse.json({ received: true, error: message });
  }
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
