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

const PAYING_STATUSES: readonly BillingStatus[] = [
  "active",
  "trialing",
  "past_due",
];

/** Days after currentPeriodEnd that a past_due row may keep paid access while
 * dunning runs. Polar's `unpaid` maps to `past_due` in this repo, so without a
 * deadline a terminal dunning row would keep paid access forever. */
export const DUNNING_GRACE_DAYS = 7;

const PLAN_ORDER: readonly PlanId[] = ["spark", "creator", "studio"];

function timestamp(value: string | null | undefined): number {
  if (!value) return Number.NaN;
  return new Date(value).getTime();
}

/** The plan the viewer can actually use right now.
 *
 * - active/trialing: paid.
 * - active/canceled with cancelAtPeriodEnd: paid until currentPeriodEnd, then
 *   Spark. Polar sends cancellation while status is still active and only
 *   revokes at period end, so the date, not the status, ends access.
 * - past_due: paid until currentPeriodEnd plus the dunning grace.
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

  if (
    options.cancelAtPeriodEnd === true &&
    hasPeriodEnd &&
    periodEnd <= now
  ) {
    return "spark";
  }

  if (status === "past_due") {
    if (!hasPeriodEnd) return "spark";
    const graceEnd = periodEnd + DUNNING_GRACE_DAYS * 24 * 60 * 60 * 1000;
    return graceEnd > now ? plan : "spark";
  }

  if (PAYING_STATUSES.includes(status)) return plan;

  const stillPaid =
    status === "canceled" &&
    options.cancelAtPeriodEnd === true &&
    hasPeriodEnd &&
    periodEnd > now;

  return stillPaid ? plan : "spark";
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
