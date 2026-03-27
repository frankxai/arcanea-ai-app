/* ================================================================
 *  ARCANEA AGENTIC COMMERCE — Type Definitions
 *  "The Arcane Vault holds what you earn. The Bazaar offers what you seek."
 *
 *  Canon Alignment:
 *  - Law of Gates: Core creation stays free. Commerce monetizes convenience & premium.
 *  - Law of Harmony: 80/20 creator/platform split. Take from the well, give back.
 *  - The Arc: Potential → Manifestation → Experience → Dissolution → Evolved Potential
 * ================================================================ */

import type { Element, TeamRole } from './challenge';

/* ----------------------------------------------------------------
 *  ARCANE VAULT (Wallet)
 * ---------------------------------------------------------------- */

export interface ArcaneWallet {
  id: string;
  userId: string;
  manaBalance: number;
  lockedMana: number;
  lifetimeEarned: number;
  lifetimeBurned: number;
  tier: WalletTier;
  streak: number;
  lastDailyClaimAt: string | null;
  createdAt: string;
}

export type WalletTier = 'spark' | 'creator' | 'luminor' | 'academy';

/* ----------------------------------------------------------------
 *  MANA TRANSACTION LEDGER (Double-entry)
 * ---------------------------------------------------------------- */

export interface ManaTransaction {
  id: string;
  type: 'credit' | 'debit';
  category: TransactionCategory;
  amount: number;
  fromWalletId: string | null;
  toWalletId: string;
  description: string;
  narrativeName: string;
  referenceType?: ReferenceType;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  status: TransactionStatus;
  createdAt: string;
}

export type TransactionCategory =
  | 'reward'
  | 'commission'
  | 'bounty'
  | 'tip'
  | 'spellbook-unlock'
  | 'marketplace-sale'
  | 'marketplace-purchase'
  | 'escrow-lock'
  | 'escrow-release'
  | 'daily-well'
  | 'system-grant';

export type ReferenceType = 'challenge' | 'commission' | 'spellbook' | 'marketplace' | 'bounty';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';

/* ----------------------------------------------------------------
 *  LUMINOR COMMISSION (Agent work-for-hire)
 *  "Create once, earn forever" — Luminor creators earn passive income
 *  when their agents are commissioned by other users.
 * ---------------------------------------------------------------- */

export interface LuminorCommission {
  id: string;
  luminorId: string;
  luminorCreatorId: string;
  clientUserId: string;
  type: CommissionType;
  brief: string;
  complexity: CommissionComplexity;
  price: number;
  platformFee: number;
  creatorEarnings: number;
  status: CommissionStatus;
  deliverables: string[];
  spellsUsed: string[];
  escrowTransactionId: string | null;
  teamId?: string;
  createdAt: string;
  completedAt?: string;
}

export type CommissionType = 'song' | 'art' | 'story' | 'code' | 'world' | 'prompt-book';

export type CommissionComplexity = 'cantrip' | 'invocation' | 'ritual' | 'arcanum';

export type CommissionStatus =
  | 'requested'
  | 'accepted'
  | 'in-progress'
  | 'delivered'
  | 'revision'
  | 'completed'
  | 'disputed'
  | 'cancelled';

/* ----------------------------------------------------------------
 *  ARCANE BOUNTY (Quest Board — demand-driven creation)
 *  Inspired by Civitai's bounty model: users post requests + Mana.
 * ---------------------------------------------------------------- */

export interface ArcaneBounty {
  id: string;
  posterId: string;
  title: string;
  description: string;
  type: CommissionType;
  element?: Element;
  reward: number;
  escrowTransactionId: string | null;
  status: BountyStatus;
  claimedById?: string;
  submissionUrl?: string;
  deadline: string;
  createdAt: string;
}

export type BountyStatus = 'open' | 'claimed' | 'submitted' | 'completed' | 'expired' | 'cancelled';

/* ----------------------------------------------------------------
 *  SPELLBOOK PRODUCT (Purchasable grimoire)
 * ---------------------------------------------------------------- */

export interface SpellbookProduct {
  id: string;
  spellbookId: string;
  name: string;
  element: Element;
  price: number;
  tier: SpellbookProductTier;
  features: string[];
  purchaseCount: number;
}

export type SpellbookProductTier = 'free' | 'apprentice' | 'master' | 'archmage';

/* ----------------------------------------------------------------
 *  USER SPELLBOOK OWNERSHIP
 * ---------------------------------------------------------------- */

export interface UserSpellbook {
  id: string;
  userId: string;
  spellbookProductId: string;
  purchasedAt: string;
  transactionId: string | null;
}

/* ----------------------------------------------------------------
 *  FORGE COVENANT (Team revenue splits)
 * ---------------------------------------------------------------- */

export interface ForgeCovenant {
  id: string;
  teamId: string;
  challengeId: string;
  splits: CovenantSplit[];
  status: CovenantStatus;
  totalEarnings: number;
  distributedAt?: string;
  createdAt: string;
}

export interface CovenantSplit {
  memberId: string;
  role: TeamRole;
  percentage: number;
}

export type CovenantStatus = 'draft' | 'signed' | 'active' | 'completed';

/* ----------------------------------------------------------------
 *  MARKETPLACE LISTING (The Bazaar of Wonders)
 * ---------------------------------------------------------------- */

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  type: ListingType;
  itemId: string;
  title: string;
  description: string;
  price: number;
  currency: 'mana';
  status: ListingStatus;
  buyerId?: string;
  platformFee: number;
  royaltyPercentage?: number;
  createdAt: string;
}

export type ListingType = 'luminor' | 'spellbook' | 'creation' | 'prompt-book';

export type ListingStatus = 'active' | 'sold' | 'delisted';

/* ----------------------------------------------------------------
 *  NARRATIVE GLOSSARY
 *  Maps technical terms to Arcanean language for UI display.
 * ---------------------------------------------------------------- */

export const NARRATIVE_NAMES = {
  wallet: 'Arcane Vault',
  balance: 'Mana Reserve',
  transaction: 'Arcane Flow',
  purchase: 'Binding',
  fee: 'The Tithe',
  escrow: 'Sealed Covenant',
  commission: 'Luminor Commission',
  revenueSplit: 'Covenant of the Forge',
  prize: "Guardian's Bounty",
  marketplace: 'The Bazaar of Wonders',
  tip: 'Mana Offering',
  bounty: 'Quest',
  dailyReward: 'The Well',
  signupBonus: 'First Light Gift',
  passiveIncome: 'Eternal Resonance',
} as const;
