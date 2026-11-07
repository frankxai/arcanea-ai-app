/**
 * Stripe mirror + entitlement decisions.
 *
 * Pure functions only: the webhook route does I/O, this module decides what the
 * database should say. Kept separate so money-path behaviour is testable with
 * `pnpm test:billing` without a Stripe key, a database, or a Next.js build.
 *
 * Facts pinned against stripe-node v20.4.1 / API 2026-02-25.clover:
 * - `current_period_start` and `current_period_end` live on the subscription
 *   item, not on the subscription root (moved 2025-03-31).
 * - `SubscriptionItem.quantity` is optional; it is never written as NOT NULL.
 * - Statuses: active, trialing, past_due, canceled, unpaid, incomplete,
 *   incomplete_expired, paused.
 */

export const FREE_TIER = "spark";

/** Statuses that grant the mapped paid tier. */
const GRANTING_STATUSES = new Set(["active", "trialing"]);

/** Statuses that revoke a paid tier. `past_due` and `incomplete` keep the
 * current entitlement while dunning runs; a failed retry eventually lands in
 * `canceled`/`unpaid`, which revokes here. */
const REVOKING_STATUSES = new Set([
  "canceled",
  "unpaid",
  "incomplete_expired",
  "paused",
]);

export type StripeSubscriptionItemLike = {
  price?: {
    id: string;
    product?: string | { id: string };
  } | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  quantity?: number | null;
};

export type StripeSubscriptionLike = {
  id: string;
  customer: string | { id: string };
  status: string;
  cancel_at_period_end?: boolean;
  cancel_at?: number | null;
  canceled_at?: number | null;
  ended_at?: number | null;
  trial_start?: number | null;
  trial_end?: number | null;
  metadata?: Record<string, string> | null;
  items?: { data?: StripeSubscriptionItemLike[] } | null;
};

export type StripePriceLike = {
  id: string;
  product: string | { id: string };
  active?: boolean;
  currency?: string | null;
  type?: string | null;
  unit_amount?: number | null;
  recurring?: {
    interval?: string | null;
    interval_count?: number | null;
  } | null;
  metadata?: Record<string, string> | null;
};

export type StripeProductLike = {
  id: string;
  active?: boolean;
  name?: string | null;
  description?: string | null;
  metadata?: Record<string, string> | null;
};

export type StripeCustomerLike = {
  id: string;
  email?: string | null;
  name?: string | null;
  metadata?: Record<string, string> | null;
};

export type IdLike = string | { id: string };

/** Stripe ids arrive as strings, or as expanded objects when the event client
 * expands them. Normalise without trusting the shape. */
export function idOf(value: IdLike | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/** Unix seconds to an ISO timestamp; null stays null rather than epoch zero. */
export function unixToIso(seconds: number | null | undefined): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

/** First subscription item. This app sells one price per subscription; a
 * second item would be a product change, not a silent merge. */
export function primaryItem(
  subscription: StripeSubscriptionLike,
): StripeSubscriptionItemLike | null {
  return subscription.items?.data?.[0] ?? null;
}

/** Map a Stripe price id to a purchasable tier using the same env vars the
 * checkout gate already requires. Unknown prices map to null: never guess an
 * entitlement from a price the app was not configured to sell. */
export function tierForPriceId(
  priceId: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): "creator" | "studio" | null {
  if (!priceId) return null;
  if (env.STRIPE_PRICE_CREATOR && priceId === env.STRIPE_PRICE_CREATOR.trim()) {
    return "creator";
  }
  if (env.STRIPE_PRICE_STUDIO && priceId === env.STRIPE_PRICE_STUDIO.trim()) {
    return "studio";
  }
  return null;
}

/**
 * The tier a profile should hold for a subscription status.
 *
 * `null` means "leave the current tier alone": unknown statuses, `past_due`
 * and `incomplete` never upgrade and never silently downgrade.
 */
export function resolveEntitlement(input: {
  status: string;
  mappedTier: "creator" | "studio" | null;
}): string | null {
  if (GRANTING_STATUSES.has(input.status)) return input.mappedTier;
  if (REVOKING_STATUSES.has(input.status)) return FREE_TIER;
  return null;
}

/** Database row for the subscription mirror. */
export function toSubscriptionRow(subscription: StripeSubscriptionLike) {
  const item = primaryItem(subscription);
  return {
    id: subscription.id,
    customer_id: idOf(subscription.customer),
    status: subscription.status,
    price_id: item?.price?.id ?? null,
    quantity: item?.quantity ?? 1,
    current_period_start: unixToIso(item?.current_period_start),
    current_period_end: unixToIso(item?.current_period_end),
    cancel_at_period_end: subscription.cancel_at_period_end === true,
    cancel_at: unixToIso(subscription.cancel_at),
    canceled_at: unixToIso(subscription.canceled_at),
    ended_at: unixToIso(subscription.ended_at),
    trial_start: unixToIso(subscription.trial_start),
    trial_end: unixToIso(subscription.trial_end),
    metadata: subscription.metadata ?? {},
  };
}

export function toPriceRow(price: StripePriceLike) {
  return {
    id: price.id,
    product_id: idOf(price.product),
    active: price.active !== false,
    currency: price.currency ?? null,
    type: price.type ?? null,
    unit_amount: typeof price.unit_amount === "number" ? price.unit_amount : null,
    recurring_interval: price.recurring?.interval ?? null,
    recurring_interval_count: price.recurring?.interval_count ?? null,
    metadata: price.metadata ?? {},
  };
}

export function toProductRow(product: StripeProductLike) {
  return {
    id: product.id,
    active: product.active !== false,
    name: product.name ?? null,
    description: product.description ?? null,
    metadata: product.metadata ?? {},
  };
}

export function toCustomerRow(
  customer: StripeCustomerLike,
  userId: string | null = null,
) {
  return {
    id: customer.id,
    user_id: userId,
    email: customer.email ?? null,
    name: customer.name ?? null,
    metadata: customer.metadata ?? {},
  };
}
