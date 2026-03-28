/**
 * Credits Balance API
 *
 * Returns the authenticated user's credit balance including purchased credits,
 * daily free credits, and Forge subscription status.
 *
 * Note: credit_balances, credit_transactions, and forge_subscriptions tables
 * are not yet in the generated Supabase types. The admin client is cast to
 * `any` for `.from()` calls until types are regenerated.
 */

import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  FREE_DAILY_CREDITS,
  type CreditBalance,
  type CreditBalanceResponse,
} from "@/lib/types/credits";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate next midnight UTC for daily reset
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
    nextMidnight.setUTCHours(0, 0, 0, 0);

    // Default balance for users with no row yet (first visit)
    let purchased = 0;
    let dailyUsed = 0;
    let isForge = false;
    let forgeExpiresAt: string | null = null;

    try {
      // Cast to any: credit tables not yet in generated Database type
      const admin = createAdminClient() as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      // Query credit_balances table for purchased credits and daily usage
      const { data: balanceRow } = await admin
        .from("credit_balances")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (balanceRow) {
        purchased = balanceRow.purchased ?? 0;
        dailyUsed = balanceRow.daily_used ?? 0;

        // Auto-reset daily credits if the stored reset timestamp is in the past
        const dailyReset = balanceRow.daily_reset
          ? new Date(balanceRow.daily_reset)
          : null;
        if (dailyReset && dailyReset <= now) {
          dailyUsed = 0;
          // Reset daily_used in the background (best effort)
          admin
            .from("credit_balances")
            .update({
              daily_used: 0,
              daily_reset: nextMidnight.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq("user_id", user.id)
            .then(() => {});
        }

        // Check forge status from the balance row itself
        if (balanceRow.is_forge) {
          isForge = true;
          forgeExpiresAt = balanceRow.forge_expires_at ?? null;
        }
      }

      // Also verify forge subscription status (source of truth)
      const { data: forgeSub } = await admin
        .from("forge_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (forgeSub) {
        isForge = true;
        forgeExpiresAt = forgeSub.current_period_end ?? null;
      }
    } catch (dbError) {
      // If Supabase service role key is missing or tables don't exist yet,
      // fall back gracefully to defaults (free tier experience)
      console.warn(
        "Credits balance: DB query failed, using defaults:",
        dbError instanceof Error ? dbError.message : dbError,
      );
    }

    const dailyRemaining = Math.max(0, FREE_DAILY_CREDITS - dailyUsed);

    const balance: CreditBalance = {
      userId: user.id,
      purchased,
      daily: dailyRemaining,
      dailyMax: FREE_DAILY_CREDITS,
      dailyResetAt: nextMidnight.toISOString(),
      isForge,
      forgeExpiresAt,
    };

    const response: CreditBalanceResponse = { balance };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch credit balance";
    console.error("Credits balance error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
