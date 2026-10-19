/**
 * GET /api/billing/balance — the signed-in user's plan, credits and entitlements.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ACTION_COSTS,
  ENTITLEMENTS,
  billingReadiness,
  getPlan,
} from "@/lib/billing/catalog";
import { BillingError, getAccount } from "@/lib/billing/ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const account = await getAccount(user.id);
    const plan = getPlan(account.plan);
    return NextResponse.json({
      account,
      plan: plan
        ? { id: plan.id, name: plan.name, monthlyCredits: plan.monthlyCredits }
        : null,
      entitlements: ENTITLEMENTS[account.plan],
      actionCosts: ACTION_COSTS,
      billing: billingReadiness(),
    });
  } catch (error) {
    if (error instanceof BillingError) {
      // Migration not applied yet, or the database is unreachable. Say so.
      return NextResponse.json(
        { error: "Billing ledger unavailable", reason: "ledger_unavailable" },
        { status: 503 },
      );
    }
    throw error;
  }
}
