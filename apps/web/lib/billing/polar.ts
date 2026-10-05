/**
 * Polar adapter — merchant of record for Arcanea.
 *
 * Polar handles checkout, EU VAT, invoices and the customer portal. We keep two
 * responsibilities: tell Polar which product a user wants, and turn Polar's
 * webhook events into ledger operations. The mapping from an event to ledger
 * intents is a pure function (`mapPolarEvent`) so it is testable without a
 * network or a database.
 */

import { Polar } from "@polar-sh/sdk";
import {
  CREDIT_PACKS,
  PLANS,
  getPack,
  getPlan,
  polarProductForSku,
  skuForPolarProduct,
  type PlanId,
} from "./catalog";

export type PolarServer = "production" | "sandbox";

export function polarServer(
  env: Record<string, string | undefined> = process.env,
): PolarServer {
  return env.POLAR_SERVER === "sandbox" ? "sandbox" : "production";
}

let cached: Polar | null = null;

export function getPolar(): Polar {
  const token = process.env.POLAR_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new PolarNotConfiguredError("POLAR_ACCESS_TOKEN is not set");
  }
  if (!cached) {
    cached = new Polar({ accessToken: token, server: polarServer() });
  }
  return cached;
}

export class PolarNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolarNotConfiguredError";
  }
}

export interface CheckoutInput {
  sku: string;
  userId: string;
  email?: string | null;
  successUrl: string;
}

/** Create a hosted checkout. Throws PolarNotConfiguredError when the SKU has no product id. */
export async function createCheckout(
  input: CheckoutInput,
): Promise<{ url: string; id: string }> {
  const productId = polarProductForSku(input.sku);
  if (!productId) {
    throw new PolarNotConfiguredError(
      `No Polar product configured for sku ${input.sku}`,
    );
  }
  const checkout = await getPolar().checkouts.create({
    products: [productId],
    successUrl: input.successUrl,
    externalCustomerId: input.userId,
    customerEmail: input.email ?? undefined,
    metadata: { sku: input.sku, userId: input.userId },
  });
  return { url: checkout.url, id: checkout.id };
}

/** Customer portal link for invoices, payment method and plan changes. */
export async function createPortalSession(input: {
  userId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const session = await getPolar().customerSessions.create({
    externalCustomerId: input.userId,
    returnUrl: input.returnUrl,
  });
  return { url: session.customerPortalUrl };
}

// ---------------------------------------------------------------------------
// Webhook → ledger intents
// ---------------------------------------------------------------------------

export type LedgerIntent =
  | {
      kind: "grant";
      userId: string;
      amount: number;
      grantKind: "purchase" | "grant";
      reference: string;
      metadata: Record<string, unknown>;
    }
  | {
      kind: "setPlan";
      userId: string;
      plan: PlanId;
      status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "revoked"
        | "paused"
        | "none";
      polarCustomerId: string | null;
      polarSubscriptionId: string | null;
      polarProductId: string | null;
      currentPeriodEnd: Date | null;
      cancelAtPeriodEnd: boolean;
    };

/**
 * Minimal structural view of the Polar payloads we act on. Declared locally so
 * the mapper does not depend on SDK type names that move between versions.
 */
export interface PolarOrderLike {
  id: string;
  paid?: boolean;
  billingReason?: string;
  productId?: string | null;
  subscriptionId?: string | null;
  customerId?: string;
  customer?: { id?: string; externalId?: string | null } | null;
  metadata?: Record<string, unknown> | null;
}

export interface PolarSubscriptionLike {
  id: string;
  status?: string;
  productId?: string | null;
  customerId?: string;
  currentPeriodEnd?: Date | string | null;
  cancelAtPeriodEnd?: boolean | null;
  customer?: { id?: string; externalId?: string | null } | null;
  metadata?: Record<string, unknown> | null;
}

export interface PolarEventLike {
  type: string;
  data: PolarOrderLike | PolarSubscriptionLike | Record<string, unknown>;
}

function resolveUserId(data: {
  customer?: { externalId?: string | null } | null;
  metadata?: Record<string, unknown> | null;
}): string | null {
  const external = data.customer?.externalId;
  if (typeof external === "string" && external.length > 0) return external;
  const fromMeta = data.metadata?.userId;
  return typeof fromMeta === "string" && fromMeta.length > 0 ? fromMeta : null;
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

type PlanStatus = Extract<LedgerIntent, { kind: "setPlan" }>["status"];

function mapSubscriptionStatus(status: string | undefined): PlanStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "canceled";
    case "paused":
      return "paused";
    case "incomplete":
    case "incomplete_expired":
      return "none";
    default:
      return "none";
  }
}

/**
 * Turn one verified Polar event into zero or more ledger intents.
 *
 *  - order.paid / purchase            → grant pack credits (idempotent on order id)
 *  - order.paid / subscription_*      → grant the plan's monthly credits (idempotent on order id)
 *  - subscription.active|updated|…    → set plan + status; revoked/canceled past period → spark
 *
 * Unknown products are ignored on purpose: granting credits for a product we
 * cannot name would be inventing entitlements.
 */
export function mapPolarEvent(
  event: PolarEventLike,
  env: Record<string, string | undefined> = process.env,
): LedgerIntent[] {
  const intents: LedgerIntent[] = [];

  if (event.type === "order.paid") {
    const order = event.data as PolarOrderLike;
    if (order.paid === false) return intents;
    const userId = resolveUserId(order);
    const sku = skuForPolarProduct(order.productId, env);
    if (!userId || !sku) return intents;

    const pack = getPack(sku);
    if (pack) {
      intents.push({
        kind: "grant",
        userId,
        amount: pack.credits,
        grantKind: "purchase",
        reference: `polar:order:${order.id}`,
        metadata: {
          sku,
          productId: order.productId,
          billingReason: order.billingReason,
        },
      });
      return intents;
    }

    const plan = getPlan(sku);
    if (plan && plan.monthlyCredits > 0) {
      intents.push({
        kind: "grant",
        userId,
        amount: plan.monthlyCredits,
        grantKind: "grant",
        reference: `polar:order:${order.id}`,
        metadata: {
          sku,
          productId: order.productId,
          billingReason: order.billingReason,
          subscriptionId: order.subscriptionId ?? null,
        },
      });
    }
    return intents;
  }

  if (event.type.startsWith("subscription.")) {
    const sub = event.data as PolarSubscriptionLike;
    const userId = resolveUserId(sub);
    if (!userId) return intents;
    const sku = skuForPolarProduct(sub.productId, env);
    const plan = sku ? getPlan(sku) : undefined;
    if (!plan) return intents;

    const status = mapSubscriptionStatus(sub.status);
    const revoked = event.type === "subscription.revoked";
    const lostAccess = revoked || status === "none";

    intents.push({
      kind: "setPlan",
      userId,
      plan: lostAccess ? "spark" : plan.id,
      status: revoked ? "revoked" : status,
      polarCustomerId: sub.customer?.id ?? sub.customerId ?? null,
      polarSubscriptionId: sub.id,
      polarProductId: sub.productId ?? null,
      currentPeriodEnd: toDate(sub.currentPeriodEnd),
      cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
    });
  }

  return intents;
}

/** Which catalog entries have a Polar product id. Used by the runbook check. */
export function configuredSkus(
  env: Record<string, string | undefined> = process.env,
) {
  return {
    plans: PLANS.filter((p) => p.polarProductEnv && env[p.polarProductEnv]).map(
      (p) => p.id,
    ),
    packs: CREDIT_PACKS.filter((p) => env[p.polarProductEnv]).map((p) => p.id),
  };
}
