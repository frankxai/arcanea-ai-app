/**
 * Credits Consume — Debit credits for an agent task
 *
 * POST /api/credits/consume
 *   Headers: Cookie (Supabase session — required)
 *   Body: { amount: number, agentId: string, description: string }
 *   Returns: { success: boolean, newBalance: number }
 *
 * Used by the execute route and as a client-side pre-check before
 * submitting a task. Validates balance before deducting.
 *
 * Uses Node.js runtime (cookie-based Supabase auth requires next/headers).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const consumeSchema = z.object({
  amount: z.number().int().positive('amount must be a positive integer'),
  agentId: z.string().min(1, 'agentId is required'),
  description: z.string().min(1, 'description is required'),
});

export async function POST(req: NextRequest) {
  try {
    // ── Authenticate ──────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Validate body ─────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = consumeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { amount, agentId, description } = parsed.data;

    // Cast to any: marketplace credit tables not yet in generated Database type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;

    // ── Fetch current balance ─────────────────────────────────────────────
    let currentBalance = 0;

    try {
      const { data: row } = await admin
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      currentBalance = row?.balance ?? 0;
    } catch {
      // Non-fatal: if table doesn't exist yet, treat as 0 balance
    }

    // ── Check sufficiency ─────────────────────────────────────────────────
    if (currentBalance < amount) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: amount,
          balance: currentBalance,
          message: 'Purchase more credits to run this agent.',
        },
        { status: 402 },
      );
    }

    const newBalance = currentBalance - amount;
    const now = new Date().toISOString();

    // ── Debit balance ─────────────────────────────────────────────────────
    try {
      await admin
        .from('credits')
        .upsert(
          { user_id: user.id, balance: newBalance, updated_at: now },
          { onConflict: 'user_id' },
        );
    } catch (dbError) {
      console.error('[POST /api/credits/consume] Failed to update balance:', dbError);
      return NextResponse.json(
        { error: 'Failed to debit credits. Please try again.' },
        { status: 500 },
      );
    }

    // ── Log transaction ───────────────────────────────────────────────────
    try {
      await admin.from('credit_transactions').insert({
        user_id: user.id,
        amount: -amount,
        type: 'consume',
        agent_id: agentId,
        description,
      });
    } catch (dbError) {
      // Non-fatal: balance was already deducted; log failure but don't fail the request
      console.warn('[POST /api/credits/consume] Failed to log transaction:', dbError);
    }

    return NextResponse.json({ success: true, newBalance });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to consume credits';
    console.error('[POST /api/credits/consume] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
