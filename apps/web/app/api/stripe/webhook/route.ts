/**
 * Stripe Webhook Handler
 *
 * Hardened 2026-11-07. The route now maintains a local Stripe mirror, grants
 * entitlement from the subscription's real status and price, and deduplicates
 * deliveries. Behaviour:
 *
 * - Verify the signature over the raw body, always.
 * - Skip an event id that already finished processing.
 * - Mirror customers, products, prices and subscriptions (upserts, so replays
 *   are harmless).
 * - Grant a paid tier only for `active`/`trialing` on a configured price;
 *   revoke to the free tier on terminal states; leave `past_due` and unknown
 *   statuses untouched.
 * - Write the processed-event row only after the writes succeed, so a failed
 *   delivery is retried by Stripe instead of being swallowed.
 * - Return 200 for verified but unhandled event types.
 *
 * This route never creates charges, sessions or refunds. Checkout stays behind
 * lib/billing/stripe-gate.ts.
 *
 * Requires: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
 * NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and the
 * 20261107000001_payments_mirror migration applied.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import {
  idOf,
  resolveEntitlement,
  tierForPriceId,
  toCustomerRow,
  toPriceRow,
  toProductRow,
  toSubscriptionRow,
} from "@/lib/billing/stripe-mirror";
import { getStripeServer, getStripeWebhookSecret } from "@/lib/stripe/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Db = SupabaseClient;

function serviceDb(): Db | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function check(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`);
}

async function upsertRow(
  db: Db,
  table: string,
  row: Record<string, unknown>,
  onConflict: string = "id",
): Promise<void> {
  const { error } = await db.from(table).upsert(
    { ...row, updated_at: new Date().toISOString() },
    { onConflict },
  );
  check(error, `upsert ${table}`);
}

async function updateProfile(
  db: Db,
  userId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await db
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", userId);
  check(error, "update profile");
}

async function linkCustomerToUser(
  db: Db,
  customerId: string,
  userId: string,
): Promise<void> {
  const { error } = await db
    .from("stripe_customers")
    .upsert(
      { id: customerId, user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  check(error, "link stripe customer to user");
}

/** Mirror the Stripe customer, optionally proving the owning account. A null
 * userId never clears an existing link. */
async function syncCustomer(
  stripe: Stripe,
  db: Db,
  customerId: string,
  userId: string | null,
): Promise<void> {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return;
  const row = userId
    ? toCustomerRow(customer, userId)
    : toCustomerRow(customer);
  await upsertRow(db, "stripe_customers", row);
  if (userId) await updateProfile(db, userId, { stripe_customer_id: customerId });
}

/** Resolve the Arcanea user behind a Stripe customer, backfilling the mirror
 * when the link is only known through profiles.stripe_customer_id. */
async function resolveUserIdForCustomer(
  db: Db,
  customerId: string | null,
): Promise<string | null> {
  if (!customerId) return null;

  const mirror = await db
    .from("stripe_customers")
    .select("user_id")
    .eq("id", customerId)
    .maybeSingle();
  check(mirror.error, "read stripe_customers");
  if (mirror.data?.user_id) return mirror.data.user_id as string;

  const profile = await db
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  check(profile.error, "read profiles by stripe_customer_id");
  if (!profile.data?.id) return null;

  const userId = profile.data.id as string;
  await linkCustomerToUser(db, customerId, userId);
  return userId;
}

/** Apply the subscription's entitlement to the profile, if this event is
 * allowed to decide one. `past_due`/`incomplete`/unknown statuses return null
 * and change nothing. */
async function applyEntitlement(
  db: Db,
  userId: string,
  subscription: { status: string; priceId: string | null },
): Promise<void> {
  const tier = resolveEntitlement({
    status: subscription.status,
    mappedTier: tierForPriceId(subscription.priceId),
  });
  if (!tier) return;
  await updateProfile(db, userId, { subscription_tier: tier });
}

async function syncSubscription(
  db: Db,
  subscription: Stripe.Subscription,
  knownUserId: string | null,
): Promise<void> {
  const row = toSubscriptionRow(subscription);
  await upsertRow(db, "stripe_subscriptions", row);

  // Keep the customer mirror usable for later subscription events even when the
  // customer event has not arrived yet. `checkout.session.completed` fills in
  // the email and the user link.
  if (row.customer_id) {
    const { error } = await db
      .from("stripe_customers")
      .upsert(
        { id: row.customer_id, updated_at: new Date().toISOString() },
        { onConflict: "id", ignoreDuplicates: true },
      );
    check(error, "ensure stripe customer stub");
  }

  const userId =
    knownUserId ??
    (subscription.metadata?.user_id || null) ??
    (await resolveUserIdForCustomer(db, row.customer_id));
  if (!userId) {
    console.warn(
      "Stripe webhook: subscription has no Arcanea user yet",
      subscription.id,
    );
    return;
  }

  await applyEntitlement(db, userId, {
    status: subscription.status,
    priceId: row.price_id,
  });
}

async function handleEvent(
  stripe: Stripe,
  db: Db,
  event: Stripe.Event,
): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") return;

      const subscriptionId = idOf(session.subscription);
      const customerId = idOf(session.customer);
      const userId = session.metadata?.user_id ?? null;

      if (customerId) {
        await syncCustomer(stripe, db, customerId, userId);
      }
      if (!subscriptionId) return;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await syncSubscription(db, subscription, userId);
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(db, event.data.object as Stripe.Subscription, null);
      return;
    }

    case "customer.created":
    case "customer.updated": {
      const customer = event.data.object as
        | Stripe.Customer
        | Stripe.DeletedCustomer;
      if ("deleted" in customer && customer.deleted) return;
      await upsertRow(db, "stripe_customers", toCustomerRow(customer));
      return;
    }

    case "product.created":
    case "product.updated": {
      await upsertRow(db, "stripe_products", toProductRow(event.data.object as Stripe.Product));
      return;
    }

    case "price.created":
    case "price.updated": {
      await upsertRow(db, "stripe_prices", toPriceRow(event.data.object as Stripe.Price));
      return;
    }

    default:
      // Verified and unhandled: acknowledge so Stripe stops retrying.
      return;
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = getStripeWebhookSecret();
  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const db = serviceDb();
  if (!db) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let stripe: Stripe;
  try {
    stripe = await getStripeServer();
  } catch {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const seen = await db
      .from("stripe_processed_events")
      .select("id")
      .eq("id", event.id)
      .maybeSingle();
    check(seen.error, "read stripe_processed_events");
    if (seen.data) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    await handleEvent(stripe, db, event);

    const marker = await db.from("stripe_processed_events").insert({
      id: event.id,
      type: event.type,
      livemode: event.livemode,
      api_version: event.api_version ?? null,
    });
    if (marker.error) {
      // A concurrent delivery may have won the race. The mirror writes are
      // upserts, so this is a duplicate marker, not a lost event.
      console.warn("Stripe webhook: event marker not written", marker.error.message);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    // No marker was written, so Stripe retries and the upserts re-run safely.
    // Details stay in our logs; the response does not echo table or driver text.
    console.error("Stripe webhook error:", message);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
