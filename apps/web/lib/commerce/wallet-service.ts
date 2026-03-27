/* ================================================================
 *  ARCANE VAULT — Wallet & Mana Transaction Service
 *  "Your Arcane Vault holds what you earn. The Well replenishes daily."
 * ================================================================ */

import { createClient, createAdminClient } from '@/lib/supabase/server';
import type {
  ArcaneWallet,
  ManaTransaction,
  TransactionCategory,
  TransactionStatus,
} from '@/lib/types/commerce';
import { EARNING_RATES, TIER_BENEFITS } from './pricing';

/* ----------------------------------------------------------------
 *  WALLET CRUD
 * ---------------------------------------------------------------- */

/** Create a new Arcane Vault for a user — grants First Light Gift (100 Mana) */
export async function createWallet(userId: string): Promise<ArcaneWallet> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('arcane_wallets')
    .insert({
      user_id: userId,
      mana_balance: EARNING_RATES.signupBonus,
      lifetime_earned: EARNING_RATES.signupBonus,
      tier: 'spark',
      streak: 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create Arcane Vault: ${error.message}`);

  // Log the First Light Gift transaction
  await recordTransaction({
    type: 'credit',
    category: 'system-grant',
    amount: EARNING_RATES.signupBonus,
    fromWalletId: null,
    toWalletId: data.id,
    description: 'Welcome to Arcanea. The First Light illuminates your path.',
    narrativeName: 'First Light Gift',
    status: 'completed',
  });

  return mapWalletRow(data);
}

/** Fetch a user's wallet */
export async function getWallet(userId: string): Promise<ArcaneWallet | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('arcane_wallets')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return mapWalletRow(data);
}

/** Get or create wallet (ensures every user has one) */
export async function getOrCreateWallet(userId: string): Promise<ArcaneWallet> {
  const existing = await getWallet(userId);
  if (existing) return existing;
  return createWallet(userId);
}

/* ----------------------------------------------------------------
 *  MANA OPERATIONS
 * ---------------------------------------------------------------- */

/** Credit Mana to a user's vault */
export async function creditMana(
  toUserId: string,
  amount: number,
  category: TransactionCategory,
  narrativeName: string,
  description: string,
  referenceType?: string,
  referenceId?: string
): Promise<ManaTransaction> {
  if (amount <= 0) throw new Error('Credit amount must be positive');

  const supabase = createAdminClient();
  const wallet = await getOrCreateWallet(toUserId);

  // Update balance
  const { error: updateError } = await supabase
    .from('arcane_wallets')
    .update({
      mana_balance: wallet.manaBalance + amount,
      lifetime_earned: wallet.lifetimeEarned + amount,
    })
    .eq('id', wallet.id);

  if (updateError) throw new Error(`Failed to credit Mana: ${updateError.message}`);

  return recordTransaction({
    type: 'credit',
    category,
    amount,
    fromWalletId: null,
    toWalletId: wallet.id,
    description,
    narrativeName,
    referenceType,
    referenceId,
    status: 'completed',
  });
}

/** Debit Mana from a user's vault */
export async function debitMana(
  fromUserId: string,
  amount: number,
  category: TransactionCategory,
  narrativeName: string,
  description: string,
  referenceType?: string,
  referenceId?: string
): Promise<ManaTransaction> {
  if (amount <= 0) throw new Error('Debit amount must be positive');

  const wallet = await getOrCreateWallet(fromUserId);
  if (wallet.manaBalance < amount) {
    throw new Error(`Insufficient Mana. Required: ${amount}, Available: ${wallet.manaBalance}`);
  }

  const supabase = createAdminClient();

  const { error: updateError } = await supabase
    .from('arcane_wallets')
    .update({
      mana_balance: wallet.manaBalance - amount,
      lifetime_burned: wallet.lifetimeBurned + amount,
    })
    .eq('id', wallet.id);

  if (updateError) throw new Error(`Failed to debit Mana: ${updateError.message}`);

  return recordTransaction({
    type: 'debit',
    category,
    amount,
    fromWalletId: wallet.id,
    toWalletId: wallet.id,
    description,
    narrativeName,
    referenceType,
    referenceId,
    status: 'completed',
  });
}

/** Lock Mana in escrow (Sealed Covenant) */
export async function lockMana(
  userId: string,
  amount: number,
  referenceType: string,
  referenceId: string
): Promise<ManaTransaction> {
  if (amount <= 0) throw new Error('Lock amount must be positive');

  const wallet = await getOrCreateWallet(userId);
  if (wallet.manaBalance < amount) {
    throw new Error(`Insufficient Mana to seal covenant. Required: ${amount}, Available: ${wallet.manaBalance}`);
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('arcane_wallets')
    .update({
      mana_balance: wallet.manaBalance - amount,
      locked_mana: wallet.lockedMana + amount,
    })
    .eq('id', wallet.id);

  if (error) throw new Error(`Failed to seal covenant: ${error.message}`);

  return recordTransaction({
    type: 'debit',
    category: 'escrow-lock',
    amount,
    fromWalletId: wallet.id,
    toWalletId: wallet.id,
    description: 'Mana sealed in covenant until delivery.',
    narrativeName: 'Sealed Covenant',
    referenceType,
    referenceId,
    status: 'completed',
  });
}

/** Release escrow to recipient */
export async function releaseMana(
  escrowTransactionId: string,
  toUserId: string
): Promise<ManaTransaction> {
  const supabase = createAdminClient();

  // Find the escrow transaction
  const { data: escrow, error: findError } = await supabase
    .from('mana_transactions')
    .select()
    .eq('id', escrowTransactionId)
    .eq('category', 'escrow-lock')
    .single();

  if (findError || !escrow) throw new Error('Escrow transaction not found');

  const fromWalletId = escrow.from_wallet_id;
  const amount = escrow.amount;

  // Reduce locked_mana on the sender's wallet
  const { data: senderWallet } = await supabase
    .from('arcane_wallets')
    .select()
    .eq('id', fromWalletId)
    .single();

  if (senderWallet) {
    await supabase
      .from('arcane_wallets')
      .update({ locked_mana: Math.max(0, senderWallet.locked_mana - amount) })
      .eq('id', fromWalletId);
  }

  // Credit recipient
  const recipientWallet = await getOrCreateWallet(toUserId);
  await supabase
    .from('arcane_wallets')
    .update({
      mana_balance: recipientWallet.manaBalance + amount,
      lifetime_earned: recipientWallet.lifetimeEarned + amount,
    })
    .eq('id', recipientWallet.id);

  return recordTransaction({
    type: 'credit',
    category: 'escrow-release',
    amount,
    fromWalletId,
    toWalletId: recipientWallet.id,
    description: 'Covenant fulfilled. Mana released to recipient.',
    narrativeName: 'Covenant Fulfilled',
    referenceType: escrow.reference_type,
    referenceId: escrow.reference_id,
    status: 'completed',
  });
}

/** Refund escrow back to sender */
export async function refundMana(escrowTransactionId: string): Promise<ManaTransaction> {
  const supabase = createAdminClient();

  const { data: escrow, error: findError } = await supabase
    .from('mana_transactions')
    .select()
    .eq('id', escrowTransactionId)
    .eq('category', 'escrow-lock')
    .single();

  if (findError || !escrow) throw new Error('Escrow transaction not found');

  const walletId = escrow.from_wallet_id;
  const amount = escrow.amount;

  const { data: wallet } = await supabase
    .from('arcane_wallets')
    .select()
    .eq('id', walletId)
    .single();

  if (wallet) {
    await supabase
      .from('arcane_wallets')
      .update({
        mana_balance: wallet.mana_balance + amount,
        locked_mana: Math.max(0, wallet.locked_mana - amount),
      })
      .eq('id', walletId);
  }

  return recordTransaction({
    type: 'credit',
    category: 'escrow-release',
    amount,
    fromWalletId: null,
    toWalletId: walletId!,
    description: 'Covenant broken. Mana returned to vault.',
    narrativeName: 'Covenant Refund',
    referenceType: escrow.reference_type,
    referenceId: escrow.reference_id,
    status: 'completed',
  });
}

/* ----------------------------------------------------------------
 *  THE WELL (Daily login reward)
 * ---------------------------------------------------------------- */

/** Claim daily Mana from The Well */
export async function claimDailyWell(userId: string): Promise<{ mana: number; streak: number }> {
  const wallet = await getOrCreateWallet(userId);

  // Check if already claimed today
  if (wallet.lastDailyClaimAt) {
    const lastClaim = new Date(wallet.lastDailyClaimAt);
    const now = new Date();
    if (
      lastClaim.getUTCFullYear() === now.getUTCFullYear() &&
      lastClaim.getUTCMonth() === now.getUTCMonth() &&
      lastClaim.getUTCDate() === now.getUTCDate()
    ) {
      throw new Error('You have already drawn from The Well today. Return tomorrow.');
    }
  }

  // Calculate streak
  let newStreak = 1;
  if (wallet.lastDailyClaimAt) {
    const lastClaim = new Date(wallet.lastDailyClaimAt);
    const now = new Date();
    const diffMs = now.getTime() - lastClaim.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = Math.min(wallet.streak + 1, EARNING_RATES.maxStreakDays);
    }
    // diffDays > 1 means streak resets to 1
  }

  // Calculate Mana earned
  const tierMultiplier = TIER_BENEFITS[wallet.tier].dailyWellMultiplier;
  const streakBonus = Math.min(newStreak, EARNING_RATES.maxStreakDays) * EARNING_RATES.streakBonusPerDay;
  const totalMana = Math.round((EARNING_RATES.dailyWell + streakBonus) * tierMultiplier);

  const supabase = createAdminClient();

  await supabase
    .from('arcane_wallets')
    .update({
      mana_balance: wallet.manaBalance + totalMana,
      lifetime_earned: wallet.lifetimeEarned + totalMana,
      streak: newStreak,
      last_daily_claim_at: new Date().toISOString(),
    })
    .eq('id', wallet.id);

  await recordTransaction({
    type: 'credit',
    category: 'daily-well',
    amount: totalMana,
    fromWalletId: null,
    toWalletId: wallet.id,
    description: `Day ${newStreak} streak. The Well flows with ${totalMana} Mana.`,
    narrativeName: 'The Well',
    status: 'completed',
  });

  return { mana: totalMana, streak: newStreak };
}

/* ----------------------------------------------------------------
 *  TRANSACTION HISTORY
 * ---------------------------------------------------------------- */

export async function getTransactionHistory(
  userId: string,
  options?: {
    category?: TransactionCategory;
    limit?: number;
    offset?: number;
  }
): Promise<ManaTransaction[]> {
  const wallet = await getWallet(userId);
  if (!wallet) return [];

  const supabase = await createClient();
  let query = supabase
    .from('mana_transactions')
    .select()
    .or(`from_wallet_id.eq.${wallet.id},to_wallet_id.eq.${wallet.id}`)
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);

  return (data || []).map(mapTransactionRow);
}

/* ----------------------------------------------------------------
 *  INTERNAL HELPERS
 * ---------------------------------------------------------------- */

async function recordTransaction(params: {
  type: 'credit' | 'debit';
  category: TransactionCategory;
  amount: number;
  fromWalletId: string | null;
  toWalletId: string;
  description: string;
  narrativeName: string;
  referenceType?: string;
  referenceId?: string;
  status: TransactionStatus;
}): Promise<ManaTransaction> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('mana_transactions')
    .insert({
      type: params.type,
      category: params.category,
      amount: params.amount,
      from_wallet_id: params.fromWalletId,
      to_wallet_id: params.toWalletId,
      description: params.description,
      narrative_name: params.narrativeName,
      reference_type: params.referenceType,
      reference_id: params.referenceId,
      status: params.status,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to record transaction: ${error.message}`);
  return mapTransactionRow(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWalletRow(row: any): ArcaneWallet {
  return {
    id: row.id,
    userId: row.user_id,
    manaBalance: row.mana_balance,
    lockedMana: row.locked_mana,
    lifetimeEarned: row.lifetime_earned,
    lifetimeBurned: row.lifetime_burned,
    tier: row.tier,
    streak: row.streak,
    lastDailyClaimAt: row.last_daily_claim_at,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTransactionRow(row: any): ManaTransaction {
  return {
    id: row.id,
    type: row.type,
    category: row.category,
    amount: row.amount,
    fromWalletId: row.from_wallet_id,
    toWalletId: row.to_wallet_id,
    description: row.description,
    narrativeName: row.narrative_name,
    referenceType: row.reference_type,
    referenceId: row.reference_id,
    metadata: row.metadata,
    status: row.status,
    createdAt: row.created_at,
  };
}
