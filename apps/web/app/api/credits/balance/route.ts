/**
 * Credits Balance API
 *
 * Returns the authenticated user's credit balance including purchased credits,
 * daily free credits, and Forge subscription status.
 *
 * TODO: Replace mock data with Supabase queries once credit_balances and
 *       forge_subscriptions tables are created.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    // TODO: Query credit_balances table for purchased credits and daily usage
    // const { data: balanceRow } = await supabase
    //   .from('credit_balances')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .single();

    // TODO: Query forge_subscriptions table for active subscription
    // const { data: forgeSub } = await supabase
    //   .from('forge_subscriptions')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .eq('status', 'active')
    //   .single();

    // Calculate next midnight UTC for daily reset
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
    nextMidnight.setUTCHours(0, 0, 0, 0);

    // Mock data — replace with real queries above
    const balance: CreditBalance = {
      userId: user.id,
      purchased: 0,
      daily: FREE_DAILY_CREDITS,
      dailyMax: FREE_DAILY_CREDITS,
      dailyResetAt: nextMidnight.toISOString(),
      isForge: false,
      forgeExpiresAt: null,
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
