/**
 * Arcanea Publishing House — Billing Types
 *
 * Tier-based licensing for the Publishing Intelligence Layer.
 * Free tier always works without any API keys except ANTHROPIC_API_KEY.
 */

/** Subscription tier names */
export type TierName = 'FREE' | 'PRO' | 'FLEET' | 'ENTERPRISE';

/** All gatable features in the system */
export type FeatureName =
  | 'single-claw'
  | 'fleet-5-claws'
  | 'sqlite-local'
  | 'supabase-cloud'
  | 'quality-gate'
  | 'format-epub-pdf'
  | 'format-all'
  | 'distribute-1-platform'
  | 'distribute-3-platforms'
  | 'distribute-unlimited'
  | 'social-drafts'
  | 'social-campaign'
  | 'translation-3-langs'
  | 'translation-all-langs'
  | 'scout-monitoring'
  | 'analytics'
  | 'all-fleet'
  | 'white-label'
  | 'custom-claws'
  | 'dedicated-support'
  | 'client-portal'
  | 'sla';

/** Tier definition with pricing and feature set */
export interface TierDefinition {
  readonly name: string;
  /** Price in cents (e.g. 2900 = $29). null = custom pricing. */
  readonly price: number | null;
  /** Features included in this tier */
  readonly features: readonly FeatureName[];
}

/** Current license status for a user/org */
export interface LicenseStatus {
  readonly tier: TierName;
  /** ISO 8601 date string — when the current period ends */
  readonly validUntil: string;
  /** Resolved feature list for this license */
  readonly features: readonly FeatureName[];
  /** Stripe customer ID, if applicable */
  readonly customerId?: string;
}

/** Stripe product-to-tier mapping entry */
export interface StripeProductMapping {
  readonly productId: string;
  readonly tier: TierName;
}

/** Error thrown when a feature is not available on the current tier */
export class FeatureGatedError extends Error {
  public readonly requiredTier: TierName;
  public readonly feature: FeatureName;
  public readonly currentTier: TierName;

  constructor(feature: FeatureName, currentTier: TierName, requiredTier: TierName) {
    super(
      `Feature "${feature}" requires ${requiredTier} tier (current: ${currentTier}). ` +
      `Upgrade at https://arcanea.ai/pricing`
    );
    this.name = 'FeatureGatedError';
    this.feature = feature;
    this.currentTier = currentTier;
    this.requiredTier = requiredTier;
  }
}
