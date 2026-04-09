/**
 * Arcanea Publishing House — License Gate
 *
 * Checks Stripe subscription status and gates premium features.
 * Graceful degradation: no STRIPE_API_KEY = FREE tier (always works).
 * Free tier never requires any API keys except ANTHROPIC_API_KEY.
 */

import type {
  TierName,
  FeatureName,
  LicenseStatus,
  StripeProductMapping,
} from './types.js';
import { FeatureGatedError } from './types.js';
import { hasFeature, getTierForFeature, resolveFeatures } from './tiers.js';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Map Stripe product IDs to tiers. Configure via env or extend here. */
const STRIPE_PRODUCT_MAP: readonly StripeProductMapping[] = [
  { productId: process.env.STRIPE_PRODUCT_PRO ?? 'prod_pro', tier: 'PRO' },
  { productId: process.env.STRIPE_PRODUCT_FLEET ?? 'prod_fleet', tier: 'FLEET' },
  { productId: process.env.STRIPE_PRODUCT_ENTERPRISE ?? 'prod_enterprise', tier: 'ENTERPRISE' },
];

/** Cache TTL in milliseconds (5 minutes) */
const CACHE_TTL_MS = 5 * 60 * 1000;

// ---------------------------------------------------------------------------
// Internal cache
// ---------------------------------------------------------------------------

interface CachedLicense {
  status: LicenseStatus;
  fetchedAt: number;
}

let cachedLicense: CachedLicense | null = null;

// ---------------------------------------------------------------------------
// Free tier fallback — always available
// ---------------------------------------------------------------------------

function freeTierStatus(): LicenseStatus {
  // Free tier is valid indefinitely
  const farFuture = new Date('2099-12-31T23:59:59Z').toISOString();
  return {
    tier: 'FREE',
    validUntil: farFuture,
    features: resolveFeatures('FREE'),
  };
}

// ---------------------------------------------------------------------------
// Stripe integration
// ---------------------------------------------------------------------------

interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        product: string;
      };
    }>;
  };
  customer: string;
}

interface StripeListResponse {
  data: StripeSubscription[];
}

/**
 * Fetch active subscription from Stripe.
 * Returns null if no active subscription found.
 */
async function fetchStripeSubscription(
  apiKey: string
): Promise<{ tier: TierName; validUntil: string; customerId: string } | null> {
  const url = 'https://api.stripe.com/v1/subscriptions?status=active&limit=10';

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    console.warn(
      `[publishing-house/license] Stripe API error ${response.status}: falling back to FREE tier`
    );
    return null;
  }

  const body = (await response.json()) as StripeListResponse;

  if (!body.data || body.data.length === 0) {
    return null;
  }

  // Find the highest-tier active subscription
  const tierOrder: TierName[] = ['FREE', 'PRO', 'FLEET', 'ENTERPRISE'];
  let bestTier: TierName = 'FREE';
  let bestEnd = 0;
  let customerId = '';

  for (const sub of body.data) {
    if (sub.status !== 'active') continue;

    for (const item of sub.items.data) {
      const productId = item.price.product;
      const mapping = STRIPE_PRODUCT_MAP.find((m) => m.productId === productId);

      if (mapping) {
        const mappedIdx = tierOrder.indexOf(mapping.tier);
        const currentIdx = tierOrder.indexOf(bestTier);

        if (mappedIdx > currentIdx) {
          bestTier = mapping.tier;
          bestEnd = sub.current_period_end;
          customerId = typeof sub.customer === 'string' ? sub.customer : '';
        }
      }
    }
  }

  if (bestTier === 'FREE') return null;

  return {
    tier: bestTier,
    validUntil: new Date(bestEnd * 1000).toISOString(),
    customerId,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check the current license status.
 *
 * - No STRIPE_API_KEY → FREE tier (no network call)
 * - STRIPE_API_KEY set → fetch subscription, map to tier
 * - On Stripe error → graceful fallback to FREE tier
 *
 * @param apiKey - Optional override; defaults to process.env.STRIPE_API_KEY
 */
export async function checkLicense(apiKey?: string): Promise<LicenseStatus> {
  const stripeKey = apiKey ?? process.env.STRIPE_API_KEY;

  // No Stripe key = free tier, always works
  if (!stripeKey) {
    return freeTierStatus();
  }

  const subscription = await fetchStripeSubscription(stripeKey);

  if (!subscription) {
    return freeTierStatus();
  }

  return {
    tier: subscription.tier,
    validUntil: subscription.validUntil,
    features: resolveFeatures(subscription.tier),
    customerId: subscription.customerId,
  };
}

/**
 * Get cached license status. Re-fetches if cache is stale (5 min TTL).
 * Use this for hot-path checks to avoid repeated Stripe calls.
 */
export async function getLicenseStatus(): Promise<LicenseStatus> {
  const now = Date.now();

  if (cachedLicense && now - cachedLicense.fetchedAt < CACHE_TTL_MS) {
    return cachedLicense.status;
  }

  const status = await checkLicense();
  cachedLicense = { status, fetchedAt: now };
  return status;
}

/**
 * Enforce that a feature is available on the current license.
 * Throws FeatureGatedError if the feature requires a higher tier.
 *
 * Free tier features are NEVER blocked — they work without any keys.
 */
export function enforceFeature(feature: FeatureName, license: LicenseStatus): void {
  if (hasFeature(license.tier, feature)) {
    return;
  }

  const requiredTier = getTierForFeature(feature);
  throw new FeatureGatedError(feature, license.tier, requiredTier);
}

/**
 * Clear the license cache. Useful after a subscription change.
 */
export function clearLicenseCache(): void {
  cachedLicense = null;
}
