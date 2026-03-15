/**
 * Feature Gates — Controls what's available per pricing tier
 *
 * Spark (free):   3 companions, auto model, basic Library/Academy, 100 msg/month
 * Creator ($19):  16 companions, 5 models, full Studio + Library + Academy, 5K msg/month
 * Studio ($49):   All models, API, custom training, team seats, exports, 5K msg/seat
 * Pro ($99):      Everything + versioning, analytics, royalties, priority support
 */

export type PricingTier = 'spark' | 'creator' | 'studio' | 'pro';

export interface FeatureGates {
  maxCompanions: number;
  maxModels: number;
  maxMonthlyMessages: number;
  studioAccess: boolean;
  fullLibrary: boolean;
  allGates: boolean;
  imageGeneration: boolean;
  musicGeneration: boolean;
  customPromptTemplates: boolean;
  apiAccess: boolean;
  teamSeats: number;
  customTraining: boolean;
  exportUnbranded: boolean;
  analytics: boolean;
  versioning: boolean;
  royalties: boolean;
}

const TIER_GATES: Record<PricingTier, FeatureGates> = {
  spark: {
    maxCompanions: 3,
    maxModels: 1,
    maxMonthlyMessages: 100,
    studioAccess: false,
    fullLibrary: false,
    allGates: false,
    imageGeneration: false,
    musicGeneration: false,
    customPromptTemplates: false,
    apiAccess: false,
    teamSeats: 1,
    customTraining: false,
    exportUnbranded: false,
    analytics: false,
    versioning: false,
    royalties: false,
  },
  creator: {
    maxCompanions: 16,
    maxModels: 5,
    maxMonthlyMessages: 5000,
    studioAccess: true,
    fullLibrary: true,
    allGates: true,
    imageGeneration: true,
    musicGeneration: true,
    customPromptTemplates: true,
    apiAccess: false,
    teamSeats: 1,
    customTraining: false,
    exportUnbranded: false,
    analytics: false,
    versioning: false,
    royalties: false,
  },
  studio: {
    maxCompanions: 16,
    maxModels: 17,
    maxMonthlyMessages: 5000,
    studioAccess: true,
    fullLibrary: true,
    allGates: true,
    imageGeneration: true,
    musicGeneration: true,
    customPromptTemplates: true,
    apiAccess: true,
    teamSeats: 5,
    customTraining: true,
    exportUnbranded: true,
    analytics: true,
    versioning: false,
    royalties: false,
  },
  pro: {
    maxCompanions: 16,
    maxModels: 17,
    maxMonthlyMessages: Infinity,
    studioAccess: true,
    fullLibrary: true,
    allGates: true,
    imageGeneration: true,
    musicGeneration: true,
    customPromptTemplates: true,
    apiAccess: true,
    teamSeats: 10,
    customTraining: true,
    exportUnbranded: true,
    analytics: true,
    versioning: true,
    royalties: true,
  },
};

/** Ordered from lowest to highest for comparison */
const TIER_ORDER: PricingTier[] = ['spark', 'creator', 'studio', 'pro'];

export function getGatesForTier(tier: PricingTier): FeatureGates {
  return TIER_GATES[tier];
}

export function canAccess(tier: PricingTier, feature: keyof FeatureGates): boolean {
  const value = TIER_GATES[tier][feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return false;
}

/** Returns an upgrade message if the feature is locked, or null if accessible */
export function getUpgradeMessage(
  feature: keyof FeatureGates,
  currentTier: PricingTier,
): string | null {
  if (canAccess(currentTier, feature)) return null;

  const requiredTier = TIER_ORDER.find((t) => canAccess(t, feature));
  if (!requiredTier) return null;

  const labels: Record<keyof FeatureGates, string> = {
    maxCompanions: 'All 16 companions',
    maxModels: 'Additional AI models',
    maxMonthlyMessages: 'More messages',
    studioAccess: 'The Studio',
    fullLibrary: 'Full Library access',
    allGates: 'All 10 Academy Gates',
    imageGeneration: 'Image generation',
    musicGeneration: 'Music generation',
    customPromptTemplates: 'Custom prompt templates',
    apiAccess: 'API access',
    teamSeats: 'Team seats',
    customTraining: 'Custom companion training',
    exportUnbranded: 'Unbranded exports',
    analytics: 'Usage analytics',
    versioning: 'Version history',
    royalties: 'Royalty tracking',
  };

  const tierNames: Record<PricingTier, string> = {
    spark: 'Spark',
    creator: 'Creator',
    studio: 'Studio',
    pro: 'Pro',
  };

  return `${labels[feature]} requires ${tierNames[requiredTier]}`;
}

export function getTierOrder(tier: PricingTier): number {
  return TIER_ORDER.indexOf(tier);
}

export function isAtLeast(current: PricingTier, required: PricingTier): boolean {
  return getTierOrder(current) >= getTierOrder(required);
}
