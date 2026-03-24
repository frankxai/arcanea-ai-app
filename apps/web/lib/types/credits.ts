/**
 * Credits System Architecture
 *
 * Arcanea uses a unified credits system for all creation operations.
 * Three pricing tiers: Free (The Library), Credits (Pay Per Creation), Forge (Unlimited).
 *
 * Credit costs are intentionally uniform (1 credit = 1 creation) to keep the
 * mental model simple. Backend cost differences are absorbed into pack pricing.
 */

// ─── Pricing Tiers ──────────────────────────────────────────────────────────

export type PricingTierId = "free" | "credits" | "forge";

export interface PricingTier {
  id: PricingTierId;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number | null; // null for free and credits (one-time)
  features: string[];
}

// ─── Credit Packs ────────────────────────────────────────────────────────────

export interface CreditPack {
  id: string;
  credits: number;
  priceUsd: number;
  /** Price per credit in USD */
  unitPrice: number;
  /** Stripe Price ID for checkout */
  stripePriceId: string;
  /** Whether this pack is highlighted as the best value */
  popular: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack-50",
    credits: 50,
    priceUsd: 5,
    unitPrice: 0.1,
    stripePriceId: "", // Set in env/config
    popular: false,
  },
  {
    id: "pack-250",
    credits: 250,
    priceUsd: 19,
    unitPrice: 0.076,
    stripePriceId: "",
    popular: true,
  },
  {
    id: "pack-750",
    credits: 750,
    priceUsd: 49,
    unitPrice: 0.065,
    stripePriceId: "",
    popular: false,
  },
];

// ─── Creation Types & Costs ──────────────────────────────────────────────────

export type CreationType = "image" | "music" | "story" | "character" | "world" | "lore";

export interface CreationCost {
  type: CreationType;
  credits: number;
  label: string;
  description: string;
}

/**
 * All creation types cost 1 credit. This is a deliberate design decision
 * to keep the model simple for users. Cost differences between generation
 * types (GPU-heavy image vs text-based story) are absorbed in the credit
 * pack pricing and Forge subscription margin.
 */
export const CREATION_COSTS: CreationCost[] = [
  { type: "image", credits: 1, label: "Image", description: "Generate one original image from a prompt" },
  { type: "music", credits: 1, label: "Music", description: "Compose one original music track" },
  { type: "story", credits: 1, label: "Story", description: "Generate one story chapter or lore entry" },
  { type: "character", credits: 1, label: "Character", description: "Create a character with art and backstory" },
  { type: "world", credits: 1, label: "World", description: "Generate a world blueprint with lore" },
  { type: "lore", credits: 1, label: "Lore", description: "Generate a lore article or codex entry" },
];

// ─── User Credit Balance ─────────────────────────────────────────────────────

export interface CreditBalance {
  userId: string;
  /** Total purchased credits remaining */
  purchased: number;
  /** Daily free credits remaining (resets at midnight UTC) */
  daily: number;
  /** Maximum daily free credits */
  dailyMax: number;
  /** When daily credits next reset (ISO 8601) */
  dailyResetAt: string;
  /** Whether user has active Forge subscription */
  isForge: boolean;
  /** Forge subscription expiry (ISO 8601), null if not subscribed */
  forgeExpiresAt: string | null;
}

export const FREE_DAILY_CREDITS = 5;

// ─── Transactions ────────────────────────────────────────────────────────────

export type TransactionType =
  | "purchase"       // Bought a credit pack
  | "daily_grant"    // Daily free credits granted
  | "creation"       // Used credits to create something
  | "refund"         // Refunded for a failed creation
  | "admin_grant"    // Manually granted by admin
  | "promo";         // Promotional credits

export interface CreditTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  /** Positive for credits added, negative for credits spent */
  amount: number;
  /** Running balance after this transaction */
  balanceAfter: number;
  /** For creation transactions: the type of content created */
  creationType?: CreationType;
  /** For creation transactions: the ID of the resulting creation */
  creationId?: string;
  /** For purchase transactions: Stripe payment intent ID */
  stripePaymentId?: string;
  /** For purchase transactions: the pack that was bought */
  packId?: string;
  /** Human-readable description */
  description: string;
  createdAt: string;
}

// ─── Entitlement Check ───────────────────────────────────────────────────────

export interface EntitlementResult {
  allowed: boolean;
  reason?: "ok" | "no_credits" | "daily_limit" | "rate_limited";
  /** Which source will be debited: forge (unlimited), daily, or purchased */
  source?: "forge" | "daily" | "purchased";
  /** Credits remaining after this creation (null for forge) */
  remainingAfter?: number | null;
}

// ─── Checkout ────────────────────────────────────────────────────────────────

export interface CheckoutRequest {
  packId: string;
  /** URL to redirect to on success */
  successUrl: string;
  /** URL to redirect to on cancellation */
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  packId: string;
  credits: number;
  amountUsd: number;
}

// ─── Forge Subscription ──────────────────────────────────────────────────────

export type ForgeStatus = "active" | "past_due" | "canceled" | "trialing";

export interface ForgeSubscription {
  id: string;
  userId: string;
  status: ForgeStatus;
  stripeSubscriptionId: string;
  /** Current billing period start (ISO 8601) */
  currentPeriodStart: string;
  /** Current billing period end (ISO 8601) */
  currentPeriodEnd: string;
  /** Whether the subscription will cancel at period end */
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface CreditBalanceResponse {
  balance: CreditBalance;
}

export interface CreditTransactionListResponse {
  transactions: CreditTransaction[];
  total: number;
  hasMore: boolean;
}

export interface SpendCreditRequest {
  creationType: CreationType;
  /** Optional metadata for the creation (prompt text, settings, etc.) */
  metadata?: Record<string, unknown>;
}

export interface SpendCreditResponse {
  success: boolean;
  transaction: CreditTransaction;
  balance: CreditBalance;
  /** The entitlement source that was debited */
  source: "forge" | "daily" | "purchased";
}

// ─── Database Schema (Supabase) ──────────────────────────────────────────────
//
// Tables needed:
//
//   credit_balances
//     id            uuid  PK default gen_random_uuid()
//     user_id       uuid  FK -> auth.users(id) UNIQUE
//     purchased     int   default 0
//     daily_used    int   default 0
//     daily_reset   timestamptz
//     created_at    timestamptz default now()
//     updated_at    timestamptz default now()
//
//   credit_transactions
//     id            uuid  PK default gen_random_uuid()
//     user_id       uuid  FK -> auth.users(id)
//     type          text  CHECK (type IN ('purchase','daily_grant','creation','refund','admin_grant','promo'))
//     amount        int   NOT NULL
//     balance_after int   NOT NULL
//     creation_type text  nullable
//     creation_id   uuid  nullable
//     stripe_payment_id text nullable
//     pack_id       text  nullable
//     description   text  NOT NULL
//     created_at    timestamptz default now()
//
//   forge_subscriptions
//     id                    uuid  PK default gen_random_uuid()
//     user_id               uuid  FK -> auth.users(id) UNIQUE
//     status                text  CHECK (status IN ('active','past_due','canceled','trialing'))
//     stripe_subscription_id text UNIQUE
//     current_period_start  timestamptz
//     current_period_end    timestamptz
//     cancel_at_period_end  boolean default false
//     created_at            timestamptz default now()
//     updated_at            timestamptz default now()
//
// RLS Policies:
//   - Users can read their own balance and transactions
//   - Only server (service_role) can insert/update balances and transactions
//   - Forge subscription status readable by the owning user
//
// Edge Functions:
//   - spend-credit: Atomic debit with row-level locking
//   - daily-reset: Cron job to reset daily_used at midnight UTC
//   - stripe-webhook: Handle checkout.session.completed, invoice.paid, subscription updates
