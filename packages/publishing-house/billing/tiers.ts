/**
 * Arcanea Publishing House — Tier Definitions
 *
 * Four tiers: Free (always works), Pro ($29), Fleet ($99), Enterprise (custom).
 * Free tier requires zero API keys beyond ANTHROPIC_API_KEY.
 */

import type { TierName, TierDefinition, FeatureName } from './types.js';

// ---------------------------------------------------------------------------
// Tier registry
// ---------------------------------------------------------------------------

export const TIERS: Readonly<Record<TierName, TierDefinition>> = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'single-claw',
      'sqlite-local',
      'quality-gate',
      'format-epub-pdf',
      'distribute-1-platform',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 2900,
    features: [
      'fleet-5-claws',
      'supabase-cloud',
      'quality-gate',
      'format-all',
      'distribute-3-platforms',
      'social-drafts',
      'translation-3-langs',
    ],
  },
  FLEET: {
    name: 'Fleet',
    price: 9900,
    features: [
      'fleet-5-claws',
      'supabase-cloud',
      'quality-gate',
      'format-all',
      'distribute-unlimited',
      'social-campaign',
      'translation-all-langs',
      'scout-monitoring',
      'analytics',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null,
    features: [
      'all-fleet',
      'white-label',
      'custom-claws',
      'dedicated-support',
      'client-portal',
      'sla',
    ],
  },
} as const;

/** Ordered tier hierarchy for comparison (lowest → highest) */
const TIER_ORDER: readonly TierName[] = ['FREE', 'PRO', 'FLEET', 'ENTERPRISE'];

// ---------------------------------------------------------------------------
// Pre-computed lookup: feature → minimum tier
// ---------------------------------------------------------------------------

const featureToMinTier = new Map<FeatureName, TierName>();

for (const tierName of TIER_ORDER) {
  const tier = TIERS[tierName];
  for (const feature of tier.features) {
    if (!featureToMinTier.has(feature)) {
      featureToMinTier.set(feature, tierName);
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check whether a tier includes a specific feature.
 * Higher tiers inherit all features from lower tiers.
 */
export function hasFeature(tier: TierName, feature: FeatureName): boolean {
  const tierIdx = TIER_ORDER.indexOf(tier);
  const requiredTier = featureToMinTier.get(feature);

  if (!requiredTier) return false;

  // Enterprise 'all-fleet' means it inherits everything from FLEET and below
  if (tier === 'ENTERPRISE') return true;

  const requiredIdx = TIER_ORDER.indexOf(requiredTier);
  return tierIdx >= requiredIdx;
}

/**
 * Returns the minimum tier required for a given feature.
 * Throws if the feature is not recognized.
 */
export function getTierForFeature(feature: FeatureName): TierName {
  const tier = featureToMinTier.get(feature);
  if (!tier) {
    throw new Error(`Unknown feature: "${feature}"`);
  }
  return tier;
}

/**
 * Resolve the full feature list for a tier (including inherited features).
 */
export function resolveFeatures(tier: TierName): FeatureName[] {
  if (tier === 'ENTERPRISE') {
    // Enterprise gets everything
    return [...featureToMinTier.keys()];
  }

  const tierIdx = TIER_ORDER.indexOf(tier);
  const features: FeatureName[] = [];

  for (const [feature, minTier] of featureToMinTier) {
    if (TIER_ORDER.indexOf(minTier) <= tierIdx) {
      features.push(feature);
    }
  }

  return features;
}
