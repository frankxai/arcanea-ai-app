/* ================================================================
 *  ARCANEA COMMERCE — Pricing & Earning Rates
 *  "Transparent math. Every Mana earned is visible, every rate is known."
 *
 *  Anti-OpenAI: No black-box algorithms. Creators see exactly how much
 *  they earn and why. Inspired by ElevenLabs' transparent payout structure.
 * ================================================================ */

import type { CommissionComplexity, CommissionType, WalletTier } from '@/lib/types/commerce';
import type { Element } from '@/lib/types/challenge';

/* ----------------------------------------------------------------
 *  MANA EARNING RATES (The Well — daily activity rewards)
 * ---------------------------------------------------------------- */

export const EARNING_RATES = {
  /** "Drawing from The Well" — daily login */
  dailyWell: 10,
  /** Per message in chat with a Luminor */
  chatMessage: 1,
  /** Publishing a creation to the gallery */
  creationPublished: 50,
  /** Entering a challenge (participation reward on completion) */
  challengeParticipation: 200,
  /** Streak multiplier: streak days * this value, added to daily well */
  streakBonusPerDay: 5,
  /** Max streak bonus (caps at 30 days = 150 extra Mana/day) */
  maxStreakDays: 30,
  /** First Light Gift — new account bonus */
  signupBonus: 100,
} as const;

/* ----------------------------------------------------------------
 *  COMMISSION PRICING (Luminor work-for-hire)
 *  80% to Luminor creator, 20% platform tithe.
 * ---------------------------------------------------------------- */

export const PLATFORM_FEE_PERCENT = 20;
export const CREATOR_SHARE_PERCENT = 80;
export const MARKETPLACE_TITHE_PERCENT = 10;

/** Base Mana cost per complexity tier */
export const COMMISSION_BASE_PRICES: Record<CommissionComplexity, number> = {
  cantrip: 50,
  invocation: 150,
  ritual: 400,
  arcanum: 1000,
};

/** Multiplier per creation type (some types cost more to produce) */
export const COMMISSION_TYPE_MULTIPLIERS: Record<CommissionType, number> = {
  song: 1.5,
  art: 1.2,
  story: 1.0,
  code: 1.8,
  world: 2.0,
  'prompt-book': 0.8,
};

/** Calculate commission price, platform fee, and creator earnings */
export function calculateCommissionPrice(
  type: CommissionType,
  complexity: CommissionComplexity
): { price: number; platformFee: number; creatorEarnings: number } {
  const basePrice = COMMISSION_BASE_PRICES[complexity];
  const multiplier = COMMISSION_TYPE_MULTIPLIERS[type];
  const price = Math.round(basePrice * multiplier);
  const platformFee = Math.round(price * (PLATFORM_FEE_PERCENT / 100));
  const creatorEarnings = price - platformFee;
  return { price, platformFee, creatorEarnings };
}

/* ----------------------------------------------------------------
 *  SPELLBOOK PRICING
 *  Canon: Basic spells (cantrip, Gate 1) are always free.
 *  Advanced grimoires cost Mana. Never gate core creation.
 * ---------------------------------------------------------------- */

export const SPELLBOOK_PRICES: Record<string, { price: number; tier: string }> = {
  'liber-ignium': { price: 0, tier: 'free' },
  'liber-aquarum': { price: 0, tier: 'free' },
  'liber-terrae': { price: 0, tier: 'free' },
  'liber-ventorum': { price: 200, tier: 'apprentice' },
  'liber-abyssi': { price: 500, tier: 'master' },
};

/* ----------------------------------------------------------------
 *  BOUNTY CONSTRAINTS (Quest Board)
 * ---------------------------------------------------------------- */

export const BOUNTY_MIN_REWARD = 50;
export const BOUNTY_MAX_REWARD = 50000;
export const BOUNTY_MAX_DURATION_DAYS = 30;

/* ----------------------------------------------------------------
 *  TIER BENEFITS
 *  Higher subscription tier = better commerce perks.
 * ---------------------------------------------------------------- */

export const TIER_BENEFITS: Record<WalletTier, {
  dailyWellMultiplier: number;
  commissionDiscount: number;
  marketplaceFeeDiscount: number;
  maxActiveBounties: number;
  maxActiveCommissions: number;
}> = {
  spark: {
    dailyWellMultiplier: 1.0,
    commissionDiscount: 0,
    marketplaceFeeDiscount: 0,
    maxActiveBounties: 2,
    maxActiveCommissions: 3,
  },
  creator: {
    dailyWellMultiplier: 1.5,
    commissionDiscount: 5,
    marketplaceFeeDiscount: 2,
    maxActiveBounties: 5,
    maxActiveCommissions: 10,
  },
  luminor: {
    dailyWellMultiplier: 2.0,
    commissionDiscount: 10,
    marketplaceFeeDiscount: 3,
    maxActiveBounties: 10,
    maxActiveCommissions: 25,
  },
  academy: {
    dailyWellMultiplier: 3.0,
    commissionDiscount: 15,
    marketplaceFeeDiscount: 5,
    maxActiveBounties: 20,
    maxActiveCommissions: 50,
  },
};
