/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Credits Checkout API
 *
 * Creates a Stripe Checkout session for purchasing a credit pack.
 * Uses one-time payment mode (not subscription) since credit packs
 * are single purchases.
 *
 * Fail-closed: missing STRIPE_SECRET_KEY or pack stripePriceId → HTTP 503.
 * Never return 200 "pending" that UI can treat as checkout success.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CREDIT_PACKS } from "@/lib/types/credits";
import { isReleased, notReleasedResponse } from "@/lib/commerce/release-gate";

/** Derive valid pack IDs from the canonical CREDIT_PACKS array */
const VALID_PACK_IDS = CREDIT_PACKS.map((p) => p.id) as [string, ...string[]];

const checkoutSchema = z.object({
  packId: z.enum(VALID_PACK_IDS),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  // Credits have no registry row, so this stays closed until one is added with a gate PASS.
  if (!isReleased("arcanea-credits")) return notReleasedResponse();
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
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { packId, successUrl, cancelUrl } = parsed.data;

    // Look up the pack
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) {
      return NextResponse.json(
        { error: `Unknown pack: ${packId}` },
        { status: 400 },
      );
    }

    // ── Stripe checkout (fail-closed) ─────────────────────────────────────
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json(
        {
          error: "Payments are not configured yet.",
          code: "stripe_not_configured",
          pack: {
            id: pack.id,
            credits: pack.credits,
            priceUsd: pack.priceUsd,
          },
        },
        { status: 503 },
      );
    }

    if (!pack.stripePriceId) {
      return NextResponse.json(
        {
          error: "This credit pack is not available for purchase yet.",
          code: "price_not_configured",
          packId: pack.id,
        },
        { status: 503 },
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arcanea.ai";

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: pack.stripePriceId, quantity: 1 }],
      success_url:
        successUrl || `${siteUrl}/studio?payment=success&pack=${packId}`,
      cancel_url: cancelUrl || `${siteUrl}/pricing?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        pack_id: packId,
        credits: String(pack.credits),
      },
    });

    // Credit granting happens in the Stripe webhook handler
    // (checkout.session.completed) after payment is confirmed.
    // Never invent a local success URL without a live session.

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session created without a redirect URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: session.url,
      packId: pack.id,
      credits: pack.credits,
      amountUsd: pack.priceUsd,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Credits checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
