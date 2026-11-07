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
  generatedAt: string;
};

const PAYING_STATUSES: readonly BillingStatus[] = [
  "active",
  "trialing",
  "past_due",
];

/** The plan the viewer can actually use right now. */
export function effectivePlanId(plan: PlanId, status: BillingStatus): PlanId {
  if (!getPlan(plan)) return "spark";
  return PAYING_STATUSES.includes(status) ? plan : "spark";
}

export function buildViewer(input: {
  user: { id: string; email: string | null };
  account: BillingAccount;
  now?: Date;
}): Viewer {
  const planId = effectivePlanId(input.account.plan, input.account.planStatus);
  const plan = getPlan(planId);
  const entitlements = ENTITLEMENTS[planId];

  const offers: ViewerOffer[] = [
    ...PLANS.filter((candidate) => candidate.id !== planId).map((candidate) => ({
      id: candidate.id,
      kind: "plan" as const,
      label: candidate.name,
      included: false,
    })),
    ...CREDIT_PACKS.map((pack) => ({
      id: pack.id,
      kind: "credit_pack" as const,
      label: `${pack.credits.toLocaleString("en-US")} credits`,
      included: false,
    })),
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
    generatedAt: (input.now ?? new Date()).toISOString(),
  };
}
