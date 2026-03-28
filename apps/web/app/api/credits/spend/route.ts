/**
 * Spend Credit API
 *
 * Debits 1 credit for a creation. Checks entitlement in priority order:
 *   1. Forge subscription (unlimited) -- no debit needed
 *   2. Daily free credits
 *   3. Purchased credits
 *
 * Note: credit_balances and credit_transactions tables are not yet in the
 * generated Supabase types. The admin client is cast to `any` for `.from()`
 * calls until types are regenerated. For true atomicity at scale, migrate
 * the debit logic to a Supabase Edge Function with row-level locking.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  CREATION_COSTS,
  FREE_DAILY_CREDITS,
  type CreationType,
  type CreditBalance,
  type CreditTransaction,
  type EntitlementResult,
  type SpendCreditResponse,
} from "@/lib/types/credits";

/** Derive valid creation types from the canonical CREATION_COSTS array */
const VALID_CREATION_TYPES = CREATION_COSTS.map((c) => c.type) as [
  CreationType,
  ...CreationType[],
];

const spendSchema = z.object({
  creationType: z.enum(VALID_CREATION_TYPES),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Determine which credit source to debit and whether the user is allowed.
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }
    const parsed = spendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { creationType } = parsed.data;

    // Verify creation type exists in our cost table
    const cost = CREATION_COSTS.find((c) => c.type === creationType);
    if (!cost) {
      return NextResponse.json(
        { error: `Unknown creation type: ${creationType}` },
        { status: 400 },
      );
    }

    // ── Fetch real balance from Supabase ──────────────────────────────────
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
    nextMidnight.setUTCHours(0, 0, 0, 0);

    let currentPurchased = 0;
    let currentDailyUsed = 0;
    let currentIsForge = false;
    let forgeExpiresAt: string | null = null;

    try {
      // Cast to any: credit tables not yet in generated Database type
      const admin = createAdminClient() as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      // Fetch balance row
      const { data: balanceRow } = await admin
        .from("credit_balances")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (balanceRow) {
        currentPurchased = balanceRow.purchased ?? 0;
        currentDailyUsed = balanceRow.daily_used ?? 0;

        // Auto-reset daily credits if the stored reset timestamp is in the past
        const dailyReset = balanceRow.daily_reset
          ? new Date(balanceRow.daily_reset)
          : null;
        if (dailyReset && dailyReset <= now) {
          currentDailyUsed = 0;
        }

        if (balanceRow.is_forge) {
          currentIsForge = true;
          forgeExpiresAt = balanceRow.forge_expires_at ?? null;
        }
      }

      // Also check forge subscription (source of truth)
      const { data: forgeSub } = await admin
        .from("forge_subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (forgeSub) {
        currentIsForge = true;
        forgeExpiresAt = forgeSub.current_period_end ?? null;
      }
    } catch (dbError) {
      // If DB is unavailable, fall back to free-tier defaults so the
      // user can still create with daily credits
      console.warn(
        "Credits spend: DB query failed, using defaults:",
        dbError instanceof Error ? dbError.message : dbError,
      );
    }

    const dailyRemaining = Math.max(0, FREE_DAILY_CREDITS - currentDailyUsed);
    const entitlement = checkEntitlement(currentIsForge, dailyRemaining, currentPurchased);

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

    // ── Debit the credit via Supabase ─────────────────────────────────────
    let transactionId = crypto.randomUUID();

    try {
      // Cast to any: credit tables not yet in generated Database type
      const admin = createAdminClient() as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (entitlement.source === "daily") {
        const newDailyUsed = currentDailyUsed + 1;
        await admin
          .from("credit_balances")
          .upsert(
            {
              user_id: user.id,
              daily_used: newDailyUsed,
              daily_reset: nextMidnight.toISOString(),
              updated_at: now.toISOString(),
            },
            { onConflict: "user_id" },
          );
      } else if (entitlement.source === "purchased") {
        const newPurchased = Math.max(0, currentPurchased - cost.credits);
        await admin
          .from("credit_balances")
          .upsert(
            {
              user_id: user.id,
              purchased: newPurchased,
              updated_at: now.toISOString(),
            },
            { onConflict: "user_id" },
          );
      }
      // For forge: no debit needed

      // Log the transaction
      const balanceAfter =
        entitlement.source === "daily"
          ? dailyRemaining - 1
          : entitlement.source === "purchased"
            ? currentPurchased - cost.credits
            : 0;

      const { data: txRow } = await admin
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          type: "creation",
          amount: -cost.credits,
          balance_after: balanceAfter,
          creation_type: creationType,
          description: `Created ${cost.label.toLowerCase()}`,
        })
        .select("id")
        .single();

      if (txRow?.id) {
        transactionId = txRow.id;
      }
    } catch (dbError) {
      // Log but don't fail the creation -- the user experience takes priority.
      // A reconciliation job can fix balance discrepancies later.
      console.error(
        "Credits spend: DB debit failed:",
        dbError instanceof Error ? dbError.message : dbError,
      );
    }

    // Build response with post-debit balance
    const transaction: CreditTransaction = {
      id: transactionId,
      userId: user.id,
      type: "creation",
      amount: -cost.credits,
      balanceAfter:
        entitlement.source === "daily"
          ? dailyRemaining - 1
          : entitlement.source === "purchased"
            ? currentPurchased - cost.credits
            : 0,
      creationType: creationType as CreationType,
      description: `Created ${cost.label.toLowerCase()}`,
      createdAt: now.toISOString(),
    };

    const balance: CreditBalance = {
      userId: user.id,
      purchased:
        entitlement.source === "purchased"
          ? Math.max(0, currentPurchased - cost.credits)
          : currentPurchased,
      daily:
        entitlement.source === "daily"
          ? dailyRemaining - 1
          : dailyRemaining,
      dailyMax: FREE_DAILY_CREDITS,
      dailyResetAt: nextMidnight.toISOString(),
      isForge: currentIsForge,
      forgeExpiresAt,
    };

    const response: SpendCreditResponse = {
      success: true,
      transaction,
      balance,
      source: entitlement.source as "forge" | "daily" | "purchased",
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to spend credit";
    console.error("Credits spend error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
