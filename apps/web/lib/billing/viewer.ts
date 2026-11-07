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

/** The plan the viewer can actually use right now. A period-end cancellation
 * keeps the paid plan until the paid period expires, matching mapPolarEvent
 * (which keeps `plan` and sets `status: "canceled"`). */
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
  if (PAYING_STATUSES.includes(status)) return plan;

  const periodEnd = options.currentPeriodEnd
    ? new Date(options.currentPeriodEnd).getTime()
    : Number.NaN;
  const stillPaid =
    status === "canceled" &&
    options.cancelAtPeriodEnd === true &&
    Number.isFinite(periodEnd) &&
    periodEnd > (options.now ?? new Date()).getTime();

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

  const offers: ViewerOffer[] = [
    ...PLANS.filter(
      (candidate) =>
        candidate.priceCents > 0 &&
        candidate.id !== planId &&
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
