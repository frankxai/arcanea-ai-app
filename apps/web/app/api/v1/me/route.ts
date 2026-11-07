/**
 * GET /api/v1/me — viewer.v1 for Arcanea.
 *
 * Same contract as GenCreator: identity, effective plan, entitlements and
 * actionable offers. The session is verified with the cookie-scoped client; the
 * billing ledger is the source of credits and plan. No checkout is created and
 * no price is invented here.
 */

import { NextResponse } from "next/server";
import { BillingError, getAccount } from "@/lib/billing/ledger";
import { buildViewer } from "@/lib/billing/viewer";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
};

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: PRIVATE_HEADERS });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return privateJson({ error: "Unauthorized.", code: "unauthorized" }, 401);
  }

  try {
    const account = await getAccount(user.id);
    return privateJson(
      buildViewer({
        user: { id: user.id, email: user.email ?? null },
        account,
      }),
    );
  } catch (error) {
    if (error instanceof BillingError) {
      return privateJson(
        {
          error: "Account billing is temporarily unavailable.",
          code: "ledger_unavailable",
        },
        503,
      );
    }
    throw error;
  }
}
