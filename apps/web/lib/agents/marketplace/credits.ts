/**
 * Credit Management — Arcanea Agents Marketplace
 *
 * Manages credit balances and transactions for the agent marketplace.
 * Attempts Supabase operations; falls back to in-memory store when the
 * credits / credit_transactions tables don't exist yet (demo mode).
 *
 * Demo mode is logged once per server start so it's easy to notice during
 * local development without polluting production logs.
 */

import type { CreditBalance, CreditTransaction, CreditTransactionType } from './types';

// ---------------------------------------------------------------------------
// Demo-mode fallback (server memory only — resets on restart)
// ---------------------------------------------------------------------------

const demoBalances = new Map<string, number>();
const demoTransactions: CreditTransaction[] = [];
let demomModeLogged = false;

const DEMO_INITIAL_CREDITS = 100;

function logDemoMode(): void {
  if (!demomModeLogged) {
    console.info(
      '[credits] Demo mode active — credits table not found in Supabase. ' +
        'Balances are in-memory only and will reset on server restart. ' +
        'Run the Supabase migration to persist credits.'
    );
    demomModeLogged = true;
  }
}

function demoGetBalance(userId: string): number {
  return demoBalances.get(userId) ?? DEMO_INITIAL_CREDITS;
}

function demoSetBalance(userId: string, balance: number): void {
  demoBalances.set(userId, balance);
}

function demoAddTransaction(tx: Omit<CreditTransaction, 'id' | 'createdAt'>): void {
  demoTransactions.push({
    ...tx,
    id: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Supabase client (raw, untyped) — the credits / credit_transactions tables
// are new and not yet in the generated Database types. We use the untyped
// client so the compiler doesn't reject the table names. Once the Supabase
// migration is applied and types are regenerated, this can switch to the
// typed server client.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRawSupabaseClient(): Promise<any> {
  const { createServerClient } = await import('@supabase/ssr');
  const { cookies } = await import('next/headers');
  const { getSupabaseEnv } = await import('@/lib/supabase/env');

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the current credit balance for a user.
 * Initializes to DEMO_INITIAL_CREDITS (100) if no record exists.
 */
export async function getCreditBalance(userId: string): Promise<number> {
  try {
    const supabase = await getRawSupabaseClient();
    const { data, error } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Table may not exist yet — fall back to demo mode
      logDemoMode();
      return demoGetBalance(userId);
    }

    return (data as { balance: number } | null)?.balance ?? DEMO_INITIAL_CREDITS;
  } catch {
    logDemoMode();
    return demoGetBalance(userId);
  }
}

/**
 * Deducts credits from the user's balance and records a transaction.
 * Returns true if successful, false if insufficient balance or error.
 */
export async function consumeCredits(
  userId: string,
  amount: number,
  agentId: string,
  description: string
): Promise<boolean> {
  if (amount <= 0) return true;

  try {
    const supabase = await getRawSupabaseClient();

    // Fetch current balance
    const { data: balanceData, error: fetchError } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      logDemoMode();
      const current = demoGetBalance(userId);
      if (current < amount) return false;
      demoSetBalance(userId, current - amount);
      demoAddTransaction({ userId, amount: -amount, type: 'consume', agentId, description });
      return true;
    }

    const current = (balanceData as { balance: number } | null)?.balance ?? 0;
    if (current < amount) return false;

    const newBalance = current - amount;

    // Update balance
    const { error: updateError } = await supabase
      .from('credits')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (updateError) return false;

    // Record transaction (non-fatal if this fails)
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -amount,
      type: 'consume' as CreditTransactionType,
      agent_id: agentId,
      description,
    });

    return true;
  } catch {
    logDemoMode();
    const current = demoGetBalance(userId);
    if (current < amount) return false;
    demoSetBalance(userId, current - amount);
    demoAddTransaction({ userId, amount: -amount, type: 'consume', agentId, description });
    return true;
  }
}

/**
 * Adds credits to a user's balance (purchase or bonus).
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'bonus',
  description: string
): Promise<void> {
  if (amount <= 0) return;

  try {
    const supabase = await getRawSupabaseClient();

    // Upsert balance
    const { data: existing } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    const current = (existing as { balance: number } | null)?.balance ?? 0;
    const newBalance = current + amount;

    await supabase.from('credits').upsert(
      { user_id: userId, balance: newBalance, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

    // Record transaction
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount,
      type,
      agent_id: null,
      description,
    });
  } catch {
    logDemoMode();
    const current = demoGetBalance(userId);
    demoSetBalance(userId, current + amount);
    demoAddTransaction({ userId, amount, type, agentId: null, description });
  }
}

/**
 * Returns the credit transaction history for a user.
 */
export async function getCreditHistory(
  userId: string,
  limit = 20
): Promise<CreditTransaction[]> {
  try {
    const supabase = await getRawSupabaseClient();
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logDemoMode();
      return demoTransactions
        .filter((t) => t.userId === userId)
        .slice(0, limit);
    }

    // Map snake_case DB columns to camelCase interface
    return ((data as Array<Record<string, unknown>>) ?? []).map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      amount: row.amount as number,
      type: row.type as CreditTransactionType,
      agentId: (row.agent_id as string | null) ?? null,
      description: row.description as string,
      createdAt: row.created_at as string,
    }));
  } catch {
    logDemoMode();
    return demoTransactions.filter((t) => t.userId === userId).slice(0, limit);
  }
}

/**
 * Ensures a credit record exists for a user.
 * Grants DEMO_INITIAL_CREDITS (100) free credits on first visit.
 * Safe to call multiple times — only acts if no record exists.
 */
export async function initializeCredits(userId: string): Promise<void> {
  try {
    const supabase = await getRawSupabaseClient();

    const { data: existing } = await supabase
      .from('credits')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (existing) return; // Already initialized

    await supabase.from('credits').insert({
      user_id: userId,
      balance: DEMO_INITIAL_CREDITS,
      updated_at: new Date().toISOString(),
    });

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: DEMO_INITIAL_CREDITS,
      type: 'bonus' as CreditTransactionType,
      agent_id: null,
      description: 'Welcome to Arcanea Agents — 100 free starter credits',
    });
  } catch {
    logDemoMode();
    // Demo mode: only initialize if we haven't seen this user yet
    if (!demoBalances.has(userId)) {
      demoSetBalance(userId, DEMO_INITIAL_CREDITS);
      demoAddTransaction({
        userId,
        amount: DEMO_INITIAL_CREDITS,
        type: 'bonus',
        agentId: null,
        description: 'Welcome to Arcanea Agents — 100 free starter credits (demo)',
      });
    }
  }
}

/**
 * Returns a formatted CreditBalance snapshot for a user.
 */
export async function getCreditBalanceRecord(userId: string): Promise<CreditBalance> {
  const balance = await getCreditBalance(userId);
  return {
    userId,
    balance,
    updatedAt: new Date().toISOString(),
  };
}
