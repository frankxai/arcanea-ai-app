/**
 * Credits — Balance + Recent Transactions
 *
 * GET /api/credits
 *   Headers: Cookie (Supabase session — required)
 *   Returns: { balance: number, transactions: CreditTransaction[] }
 *
 * If no credit record exists for the user, initializes with 100 free credits.
 *
 * This endpoint is the unified credits view for the agent marketplace.
 * It reads from the `credits` and `credit_transactions` tables defined in
 * the AGENTS_SHIP_SPRINT schema (separate from credit_balances used by the
 * image/music creation system).
 *
 * Uses Node.js runtime (cookie-based Supabase auth requires next/headers).
 */

import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { CreditTransaction } from '@/lib/agents/marketplace/types';

const INITIAL_CREDITS = 100;

export async function GET() {
  try {
    // ── Authenticate ────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cast to any: marketplace credit tables not yet in generated Database type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;

    // ── Fetch or initialize balance ──────────────────────────────────────────
    let balance = 0;

    try {
      const { data: row, error } = await admin
        .from('credits')
        .select('balance, updated_at')
        .eq('user_id', user.id)
        .single();

      if (error || !row) {
        // First visit — bootstrap with 100 free credits
        const { data: newRow } = await admin
          .from('credits')
          .insert({ user_id: user.id, balance: INITIAL_CREDITS, updated_at: new Date().toISOString() })
          .select('balance')
          .single();

        balance = newRow?.balance ?? INITIAL_CREDITS;

        // Log the initial grant
        await admin.from('credit_transactions').insert({
          user_id: user.id,
          amount: INITIAL_CREDITS,
          type: 'bonus',
          agent_id: null,
          description: 'Welcome gift — 100 starter credits',
        });
      } else {
        balance = row.balance ?? 0;
      }
    } catch (dbError) {
      console.warn('[GET /api/credits] DB query failed, using default balance:', dbError);
      balance = INITIAL_CREDITS;
    }

    // ── Fetch recent transactions ────────────────────────────────────────────
    let transactions: CreditTransaction[] = [];

    try {
      const { data: rows } = await admin
        .from('credit_transactions')
        .select('id, user_id, amount, type, agent_id, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (rows) {
        transactions = rows.map(
          (r: {
            id: string;
            user_id: string;
            amount: number;
            type: string;
            agent_id: string | null;
            description: string;
            created_at: string;
          }): CreditTransaction => ({
            id: r.id,
            userId: r.user_id,
            amount: r.amount,
            type: r.type as CreditTransaction['type'],
            agentId: r.agent_id,
            description: r.description,
            createdAt: r.created_at,
          }),
        );
      }
    } catch (dbError) {
      console.warn('[GET /api/credits] Failed to fetch transactions:', dbError);
    }

    return NextResponse.json({ balance, transactions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch credits';
    console.error('[GET /api/credits] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
