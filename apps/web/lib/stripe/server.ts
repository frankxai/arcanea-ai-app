/**
 * Pinned Stripe server client for Arcanea.
 *
 * The SDK default is the version it ships with; we pin it explicitly so an SDK
 * upgrade cannot silently move the whole app across an API version during a
 * billing change. Checkout keeps its own dynamic import because its gate
 * (`lib/billing/stripe-gate.ts`) must stay the only way a session is created.
 */

import type Stripe from "stripe";

/** stripe-node v20.4.1 bundles this API version (types/apiVersion.d.ts). */
export const STRIPE_API_VERSION = "2026-02-25.clover" as const;

export type StripeEnv = Record<string, string | undefined>;

/** Server-only. Never import from a client component. */
export async function getStripeServer(
  env: StripeEnv = process.env,
): Promise<Stripe> {
  const secretKey = env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  const { default: StripeClient } = await import("stripe");
  return new StripeClient(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
    appInfo: { name: "arcanea-web" },
  });
}

export function getStripeWebhookSecret(env: StripeEnv = process.env): string | null {
  return env.STRIPE_WEBHOOK_SECRET?.trim() || null;
}
