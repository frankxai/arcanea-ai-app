/**
 * viewer.v1 for Arcanea.
 *
 * The canonical account contract shared with GenCreator: identity, plan,
 * entitlements, actionable offers. This module is pure so the money-adjacent
 * mapping is testable without Next.js, Supabase or Polar.
 *
 * Fail-closed rule: a plan is only honoured while the subscription status can
 * still pay for it. `active`, `trialing` and `past_due` keep the plan (dunning
 * window); `none`, `canceled`, `revoked` and `paused` resolve to Spark. The
 * catalog remains the source of prices and features; this module only decides
 * which plan applies to this viewer.
 */

import {
  CREDIT_PACKS,
  ENTITLEMENTS,
  PLANS,
  getPlan,
  type PlanId,
} from "./catalog";
import type { BillingAccount } from "./ledger";

export const VIEWER_SCHEMA = "viewer.v1" as const;

export type BillingStatus = BillingAccount["planStatus"];

export type ViewerOffer = {
  id: string;
  kind: "plan" | "credit_pack";
  label: string;
  included: boolean;
};

export type Viewer = {
  schema: typeof VIEWER_SCHEMA;
  user: { id: string; email: string | null };
  member: boolean;
  /** True only when the effective plan is a paid catalog plan. `member` means
   * an account exists; `paid` is the access-relevant signal. */
  paid: boolean;
  plan: {
    id: PlanId;
    name: string;
    status: BillingStatus;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  };
  entitlements: (typeof ENTITLEMENTS)[PlanId] & {
    credits: { balance: number; reserved: number };
  };
  offers: ViewerOffer[];
  nextOffer: ViewerOffer | null;
  generatedAt: string;
};

const PAYING_STATUSES: readonly BillingStatus[] = ["active", "trialing"];

/** A paid period that just ended may need a moment for the renewal or
 * revocation event to land. This is a webhook-latency allowance, not a dunning
 * grace: past_due is not granted paid access because the ledger does not store
 * `past_due_at`, so no defensible grace window can be computed. */
export const PERIOD_END_GRACE_HOURS = 24;

const PLAN_ORDER: readonly PlanId[] = ["spark", "creator", "studio"];

function timestamp(value: string | null | undefined): number {
  if (!value) return Number.NaN;
  return new Date(value).getTime();
}

/** The plan the viewer can actually use right now.
 *
 * Fail-closed rules:
 * - active/trialing: paid until currentPeriodEnd plus a 24-hour event-latency
 *   allowance. A missing period end grants nothing.
 * - cancel-at-period-end: paid until currentPeriodEnd, then Spark, for both
 *   `active` and `canceled` rows. Polar sends cancellation while status is
 *   still active and revokes at period end, so the date ends access.
 * - past_due: Spark. The ledger has no `past_due_at`, so a grace window would
 *   be invented and could cover a whole unpaid cycle.
 * - revoked/paused/none/unknown: Spark.
 */
export function effectivePlanId(
  plan: PlanId,
  status: BillingStatus,
  options: {
    cancelAtPeriodEnd?: boolean;
    currentPeriodEnd?: string | null;
    now?: Date;
  } = {},
): PlanId {
  if (!getPlan(plan)) return "spark";

  const now = (options.now ?? new Date()).getTime();
  const periodEnd = timestamp(options.currentPeriodEnd);
  const hasPeriodEnd = Number.isFinite(periodEnd);

  if (status === "past_due") return "spark";

  // Paused, revoked and none lose access immediately, even if a stale
  // cancel-at-period-end flag is still on the row.
  if (status === "revoked" || status === "paused" || status === "none") {
    return "spark";
  }

  if (options.cancelAtPeriodEnd === true) {
    return hasPeriodEnd && periodEnd > now ? plan : "spark";
  }

  if (PAYING_STATUSES.includes(status)) {
    if (!hasPeriodEnd) return "spark";
    const graceEnd = periodEnd + PERIOD_END_GRACE_HOURS * 60 * 60 * 1000;
    return graceEnd > now ? plan : "spark";
  }

  return "spark";
}

export function buildViewer(input: {
  user: { id: string; email: string | null };
  account: BillingAccount;
  /** SKUs the checkout route would accept right now. Empty means no offer is
   * actionable, which is the safe default when billing is closed. */
  purchasable?: { plans?: PlanId[]; packs?: string[] };
  now?: Date;
}): Viewer {
  const now = input.now ?? new Date();
  const planId = effectivePlanId(input.account.plan, input.account.planStatus, {
    cancelAtPeriodEnd: input.account.cancelAtPeriodEnd,
    currentPeriodEnd: input.account.currentPeriodEnd,
    now,
  });
  const plan = getPlan(planId);
  const entitlements = ENTITLEMENTS[planId];

  const purchasablePlans = input.purchasable?.plans ?? [];
  const purchasablePacks = input.purchasable?.packs ?? [];
  const currentRank = PLAN_ORDER.indexOf(planId);

  const offers: ViewerOffer[] = [
    ...PLANS.filter(
      (candidate) =>
        candidate.priceCents > 0 &&
        PLAN_ORDER.indexOf(candidate.id) > currentRank &&
        purchasablePlans.includes(candidate.id),
    ).map((candidate) => ({
      id: candidate.id,
      kind: "plan" as const,
      label: candidate.name,
      included: false,
    })),
    ...CREDIT_PACKS.filter((pack) => purchasablePacks.includes(pack.id)).map(
      (pack) => ({
        id: pack.id,
        kind: "credit_pack" as const,
        label: `${pack.credits.toLocaleString("en-US")} credits`,
        included: false,
      }),
    ),
  ];

  return {
    schema: VIEWER_SCHEMA,
    user: input.user,
    member: true,
    paid: (plan?.priceCents ?? 0) > 0,
    plan: {
      id: planId,
      name: plan?.name ?? planId,
      status: input.account.planStatus,
      currentPeriodEnd: input.account.currentPeriodEnd,
      cancelAtPeriodEnd: input.account.cancelAtPeriodEnd,
    },
    entitlements: {
      ...entitlements,
      credits: {
        balance: input.account.balance,
        reserved: input.account.reserved,
      },
    },
    offers,
    nextOffer: offers[0] ?? null,
    generatedAt: now.toISOString(),
  };
}
