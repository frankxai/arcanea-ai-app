/**
 * Spend Credit API
 *
 * Debits 1 credit for a creation. Checks entitlement in priority order:
 *   1. Forge subscription (unlimited) — no debit needed
 *   2. Daily free credits
 *   3. Purchased credits
 *
 * TODO: Replace mock logic with atomic Supabase transaction (or Edge Function)
 *       using row-level locking to prevent race conditions.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  CREATION_COSTS,
  FREE_DAILY_CREDITS,
  type CreationType,
  type CreditBalance,
  type CreditTransaction,
  type EntitlementResult,
  type SpendCreditResponse,
} from "@/lib/types/credits";

const spendSchema = z.object({
  creationType: z.enum(["image", "music", "story", "character", "world", "lore"]),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Determine which credit source to debit and whether the user is allowed.
 *
 * TODO: Replace with real balance data from Supabase.
 */
function checkEntitlement(
  isForge: boolean,
  dailyRemaining: number,
  purchased: number,
): EntitlementResult {
  if (isForge) {
    return { allowed: true, reason: "ok", source: "forge", remainingAfter: null };
  }
  if (dailyRemaining > 0) {
    return {
      allowed: true,
      reason: "ok",
      source: "daily",
      remainingAfter: dailyRemaining - 1,
    };
  }
  if (purchased > 0) {
    return {
      allowed: true,
      reason: "ok",
      source: "purchased",
      remainingAfter: purchased - 1,
    };
  }
  return { allowed: false, reason: "no_credits" };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Validate request body ──────────────────────────────────────────────
    const body = await req.json();
    const parsed = spendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { creationType, metadata } = parsed.data;

    // Verify creation type exists in our cost table
    const cost = CREATION_COSTS.find((c) => c.type === creationType);
    if (!cost) {
      return NextResponse.json(
        { error: `Unknown creation type: ${creationType}` },
        { status: 400 },
      );
    }

    // ── Check entitlement ──────────────────────────────────────────────────
    // TODO: Fetch real balance from credit_balances + forge_subscriptions
    const mockPurchased = 0;
    const mockDailyRemaining = FREE_DAILY_CREDITS; // TODO: FREE_DAILY_CREDITS - daily_used
    const mockIsForge = false;

    const entitlement = checkEntitlement(mockIsForge, mockDailyRemaining, mockPurchased);

    if (!entitlement.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          reason: entitlement.reason,
          message:
            "You have no credits remaining. Purchase a credit pack or subscribe to Forge for unlimited creations.",
        },
        { status: 402 },
      );
    }

    // ── Debit the credit ───────────────────────────────────────────────────
    // TODO: Atomic debit via Supabase Edge Function or transaction:
    //
    //   if (source === 'daily') {
    //     await supabase.from('credit_balances')
    //       .update({ daily_used: daily_used + 1 })
    //       .eq('user_id', user.id);
    //   } else if (source === 'purchased') {
    //     await supabase.from('credit_balances')
    //       .update({ purchased: purchased - cost.credits })
    //       .eq('user_id', user.id);
    //   }
    //
    //   await supabase.from('credit_transactions').insert({ ... });

    // Calculate next midnight UTC
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
    nextMidnight.setUTCHours(0, 0, 0, 0);

    // Mock transaction record
    const transaction: CreditTransaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: "creation",
      amount: -cost.credits,
      balanceAfter:
        entitlement.source === "daily"
          ? mockDailyRemaining - 1
          : mockPurchased - cost.credits,
      creationType: creationType as CreationType,
      description: `Created ${cost.label.toLowerCase()}`,
      createdAt: now.toISOString(),
    };

    // Mock updated balance
    const balance: CreditBalance = {
      userId: user.id,
      purchased:
        entitlement.source === "purchased"
          ? mockPurchased - cost.credits
          : mockPurchased,
      daily:
        entitlement.source === "daily"
          ? mockDailyRemaining - 1
          : mockDailyRemaining,
      dailyMax: FREE_DAILY_CREDITS,
      dailyResetAt: nextMidnight.toISOString(),
      isForge: mockIsForge,
      forgeExpiresAt: null,
    };

    const response: SpendCreditResponse = {
      success: true,
      transaction,
      balance,
      source: entitlement.source!,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to spend credit";
    console.error("Credits spend error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
