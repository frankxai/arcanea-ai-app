/**
 * Fail-closed gate for the legacy Stripe subscription route.
 *
 * Polar is Arcanea's billing rail and opens only when ARCANEA_BILLING_ENABLED
 * is "true" (see billingReadiness in ./catalog). The Stripe route predates it
 * and used to need nothing but STRIPE_SECRET_KEY, so adding that one key would
 * have opened a second, unreviewed way to charge customers. It now needs the
 * same go-live switch plus a tier status that a PR has set to "for sale".
 */

export type StripeTier = "creator" | "studio";

const PURCHASABLE_STATUS_PREFIX = "for sale";

/** Flipping a status is a reviewed go-live edit, never an env change. */
export const STRIPE_TIER_STATUS: Record<StripeTier, string> = {
  creator: "pre-stage (not for sale)",
  studio: "pre-stage (not for sale)",
};

const PRICE_ENV: Record<StripeTier, string> = {
  creator: "STRIPE_PRICE_CREATOR",
  studio: "STRIPE_PRICE_STUDIO",
};

export function isStripeTier(tier: unknown): tier is StripeTier {
  return tier === "creator" || tier === "studio";
}

export type StripeGateResult =
  | { ok: true; secretKey: string; priceId: string }
  | { ok: false; status: 400 | 503; refusal: string; error: string };

export function stripeCheckoutGate(
  tier: unknown,
  env: Record<string, string | undefined> = process.env,
  statuses: Record<StripeTier, string> = STRIPE_TIER_STATUS,
): StripeGateResult {
  if (!isStripeTier(tier)) {
    return { ok: false, status: 400, refusal: "invalid_tier", error: "Invalid tier" };
  }
  if (env.ARCANEA_BILLING_ENABLED !== "true") {
    return { ok: false, status: 503, refusal: "billing_disabled", error: "Payments are not open yet." };
  }
  if (!statuses[tier].trim().toLowerCase().startsWith(PURCHASABLE_STATUS_PREFIX)) {
    return { ok: false, status: 503, refusal: "checkout_gated", error: "This plan is not available for purchase yet." };
  }
  const secretKey = env.STRIPE_SECRET_KEY?.trim();
  const priceId = env[PRICE_ENV[tier]]?.trim();
  if (!secretKey || !priceId) {
    return { ok: false, status: 503, refusal: "checkout_unconfigured", error: "This plan is not configured for purchase." };
  }
  return { ok: true, secretKey, priceId };
}
