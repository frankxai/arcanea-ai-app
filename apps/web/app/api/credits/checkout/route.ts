/**
 * Credits Checkout API
 *
 * Creates a Stripe Checkout session for purchasing a credit pack.
 * Uses one-time payment mode (not subscription) since credit packs
 * are single purchases.
 *
 * TODO: Configure STRIPE_SECRET_KEY and STRIPE_PRICE_PACK_* env vars,
 *       then uncomment the Stripe session creation below.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CREDIT_PACKS } from "@/lib/types/credits";

/** Derive valid pack IDs from the canonical CREDIT_PACKS array */
const VALID_PACK_IDS = CREDIT_PACKS.map((p) => p.id) as [string, ...string[]];

const checkoutSchema = z.object({
  packId: z.enum(VALID_PACK_IDS),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

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
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
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

    // ── Stripe checkout ────────────────────────────────────────────────────
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey || !pack.stripePriceId) {
      // Stripe not configured yet — return informational response
      return NextResponse.json({
        message: "Stripe integration pending — API key needed",
        pack: {
          id: pack.id,
          credits: pack.credits,
          priceUsd: pack.priceUsd,
          unitPrice: pack.unitPrice,
        },
        // url: stripeSession.url // uncomment when Stripe configured
      });
    }

    // TODO: Uncomment once STRIPE_SECRET_KEY and stripePriceIds are set
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://arcanea.ai";

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: pack.stripePriceId, quantity: 1 }],
      success_url:
        successUrl || `${siteUrl}/studio?payment=success&pack=${packId}`,
      cancel_url:
        cancelUrl || `${siteUrl}/pricing?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        pack_id: packId,
        credits: String(pack.credits),
      },
    });

    // Credit granting happens in the Stripe webhook handler
    // (checkout.session.completed) after payment is confirmed.

    return NextResponse.json({
      url: session.url,
      packId: pack.id,
      credits: pack.credits,
      amountUsd: pack.priceUsd,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    console.error("Credits checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
