/**
 * POST /api/billing/checkout  { sku: "creator" | "studio" | "pack-500" | ... }
 *
 * Returns a hosted Polar checkout URL for the signed-in user. Fails closed with
 * 503 when billing is not configured so the UI can fall back to the waitlist
 * instead of pretending a purchase happened.
 */

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { billingReadiness, isPaidSku } from "@/lib/billing/catalog";
import { createCheckout, PolarNotConfiguredError } from "@/lib/billing/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ sku: z.string().min(1).max(32) });

function siteOrigin(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "sku is required" }, { status: 400 });
  }
  const { sku } = parsed.data;
  if (!isPaidSku(sku)) {
    return NextResponse.json({ error: `Unknown sku ${sku}` }, { status: 400 });
  }

  const readiness = billingReadiness();
  if (!readiness.hasToken) {
    return NextResponse.json(
      { error: "Checkout is not open yet", reason: "billing_not_configured" },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to continue", reason: "unauthenticated" },
      { status: 401 },
    );
  }

  try {
    const origin = siteOrigin(request);
    const checkout = await createCheckout({
      sku,
      userId: user.id,
      email: user.email,
      successUrl: `${origin}/settings/billing?checkout=success&sku=${encodeURIComponent(sku)}`,
    });
    return NextResponse.json({
      url: checkout.url,
      id: checkout.id,
      sandbox: readiness.sandbox,
    });
  } catch (error) {
    if (error instanceof PolarNotConfiguredError) {
      return NextResponse.json(
        {
          error: "This plan is not available yet",
          reason: "sku_not_configured",
        },
        { status: 503 },
      );
    }
    console.error("[billing/checkout]", error);
    return NextResponse.json(
      { error: "Checkout could not be started" },
      { status: 502 },
    );
  }
}
