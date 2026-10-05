/**
 * POST /api/billing/portal — customer portal link (invoices, payment method, plan).
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { billingReadiness } from "@/lib/billing/catalog";
import {
  createPortalSession,
  PolarNotConfiguredError,
} from "@/lib/billing/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!billingReadiness().hasToken) {
    return NextResponse.json(
      { error: "Billing is not configured", reason: "billing_not_configured" },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to continue" }, { status: 401 });
  }

  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ??
      request.nextUrl.origin;
    const session = await createPortalSession({
      userId: user.id,
      returnUrl: `${origin}/settings/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof PolarNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[billing/portal]", error);
    return NextResponse.json(
      { error: "Portal could not be opened" },
      { status: 502 },
    );
  }
}
