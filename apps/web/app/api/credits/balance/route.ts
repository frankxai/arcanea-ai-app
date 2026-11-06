/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
import { createClient } from "@/lib/supabase/server";
import { BillingError, getAccount } from "@/lib/billing/ledger";
import type { CreditBalance, CreditBalanceResponse } from "@/lib/types/credits";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
    nextMidnight.setUTCHours(0, 0, 0, 0);

    const account = await getAccount(user.id);

    const balance: CreditBalance = {
      userId: user.id,
      purchased: account.balance,
      daily: 0,
      dailyMax: 0,
      dailyResetAt: nextMidnight.toISOString(),
      isForge: false,
      forgeExpiresAt: account.currentPeriodEnd,
    };

    const response: CreditBalanceResponse = { balance };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof BillingError) {
      return NextResponse.json(
        { error: "Billing ledger unavailable", code: "ledger_unavailable" },
        { status: 503 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Failed to fetch credit balance";
    console.error("Credits balance error:", message);
    return NextResponse.json(
      {
        error: "Credit ledger is temporarily unavailable.",
        code: "ledger_unavailable",
      },
      { status: 503 },
    );
  }
}
