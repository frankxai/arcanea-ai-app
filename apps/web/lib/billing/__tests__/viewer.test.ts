import assert from "node:assert/strict";
import { test } from "node:test";
import { CREDIT_PACKS, ENTITLEMENTS, PLANS, type PlanId } from "../catalog";
import type { BillingAccount } from "../ledger";
import {
  DUNNING_GRACE_DAYS,
  VIEWER_SCHEMA,
  buildViewer,
  effectivePlanId,
} from "../viewer";

const now = new Date("2026-11-07T12:00:00.000Z");
const user = { id: "user-1", email: "creator@example.com" };
const purchasable = {
  plans: PLANS.filter((plan) => plan.priceCents > 0).map((plan) => plan.id),
  packs: CREDIT_PACKS.map((pack) => pack.id),
};
const dunningGraceMs = DUNNING_GRACE_DAYS * 24 * 60 * 60 * 1000;

function account(overrides: Partial<BillingAccount> = {}): BillingAccount {
  return {
    userId: user.id,
    plan: "creator",
    planStatus: "active",
    balance: 1200,
    reserved: 50,
    currentPeriodEnd: "2026-12-07T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    polarCustomerId: "cus_1",
    polarSubscriptionId: "sub_1",
    ...overrides,
  };
}

test("active paid plans keep their catalog entitlements", () => {
  const viewer = buildViewer({ user, account: account(), purchasable, now });
  assert.equal(viewer.schema, VIEWER_SCHEMA);
  assert.equal(viewer.plan.id, "creator");
  assert.deepEqual(viewer.plan.name, "Creator");
  assert.deepEqual(viewer.entitlements.hostedWorlds, ENTITLEMENTS.creator.hostedWorlds);
  assert.equal(viewer.entitlements.credits.balance, 1200);
  assert.equal(viewer.entitlements.credits.reserved, 50);
});

test("trialing keeps the plan; past_due keeps it only through the dunning grace", () => {
  assert.equal(effectivePlanId("studio", "trialing"), "studio");
  const withinGrace = new Date(now.getTime() + dunningGraceMs - 60_000).toISOString();
  assert.equal(
    effectivePlanId("creator", "past_due", {
      currentPeriodEnd: withinGrace,
      now,
    }),
    "creator",
  );
  const beyondGrace = new Date(now.getTime() - dunningGraceMs - 60_000).toISOString();
  assert.equal(
    effectivePlanId("creator", "past_due", {
      currentPeriodEnd: beyondGrace,
      now,
    }),
    "spark",
  );
  assert.equal(
    effectivePlanId("creator", "past_due", { currentPeriodEnd: null, now }),
    "spark",
  );
});

test("a period-end cancellation keeps paid access until the paid period ends", () => {
  // Polar sends cancellation while the subscription is still status active and
  // only revokes at period end, so the date must end access, not the status.
  const activeCancelling = buildViewer({
    user,
    account: account({
      plan: "studio",
      planStatus: "active",
      cancelAtPeriodEnd: true,
      currentPeriodEnd: "2026-12-07T00:00:00.000Z",
    }),
    purchasable,
    now,
  });
  assert.equal(activeCancelling.plan.id, "studio");
  assert.deepEqual(
    activeCancelling.entitlements.hostedWorlds,
    ENTITLEMENTS.studio.hostedWorlds,
  );

  const canceledFuture = buildViewer({
    user,
    account: account({
      plan: "studio",
      planStatus: "canceled",
      cancelAtPeriodEnd: true,
      currentPeriodEnd: "2026-12-07T00:00:00.000Z",
    }),
    purchasable,
    now,
  });
  assert.equal(canceledFuture.plan.id, "studio");
  assert.equal(canceledFuture.plan.status, "canceled");
});

test("a period-end cancellation stops at currentPeriodEnd even if the row says active", () => {
  for (const status of ["active", "canceled"] as const) {
    const viewer = buildViewer({
      user,
      account: account({
        plan: "studio",
        planStatus: status,
        cancelAtPeriodEnd: true,
        currentPeriodEnd: "2026-01-01T00:00:00.000Z",
      }),
      purchasable,
      now,
    });
    assert.equal(viewer.plan.id, "spark", status);
    assert.deepEqual(viewer.entitlements.hostedWorlds, ENTITLEMENTS.spark.hostedWorlds);
    assert.equal(viewer.entitlements.apiKeys, false, status);
  }
});

test("revocation, pause and none resolve to Spark", () => {
  for (const status of ["revoked", "paused", "none"] as const) {
    const viewer = buildViewer({
      user,
      account: account({ plan: "studio", planStatus: status }),
      purchasable,
      now,
    });
    assert.equal(viewer.plan.id, "spark", status);
    assert.equal(viewer.entitlements.apiKeys, false, status);
  }
});

test("an unknown plan never inherits paid entitlements", () => {
  const viewer = buildViewer({
    user,
    account: account({ plan: "enterprise" as never, planStatus: "active" }),
    purchasable,
    now,
  });
  assert.equal(viewer.plan.id, "spark");
  assert.equal(viewer.entitlements.apiKeys, false);
});

test("offers are upgrades only, and only when checkout would accept them", () => {
  const creator = buildViewer({ user, account: account(), purchasable, now });
  assert.deepEqual(
    creator.offers.filter((offer) => offer.kind === "plan").map((offer) => offer.id),
    ["studio"],
  );
  assert.deepEqual(creator.nextOffer, creator.offers[0]);

  const studio = buildViewer({
    user,
    account: account({ plan: "studio" }),
    purchasable,
    now,
  });
  assert.equal(
    studio.offers.some((offer) => offer.kind === "plan"),
    false,
    "Studio has no higher plan to offer",
  );

  const spark = buildViewer({
    user,
    account: account({ plan: "spark", planStatus: "none" }),
    purchasable,
    now,
  });
  assert.deepEqual(
    spark.offers.filter((offer) => offer.kind === "plan").map((offer) => offer.id),
    ["creator", "studio"],
  );
});

test("billing closed means no actionable offer, not a dead checkout target", () => {
  const closed = buildViewer({ user, account: account(), now });
  assert.deepEqual(closed.offers, []);
  assert.equal(closed.nextOffer, null);

  const noPacks = buildViewer({
    user,
    account: account(),
    purchasable: { plans: purchasable.plans, packs: [] },
    now,
  });
  assert.equal(noPacks.offers.some((offer) => offer.kind === "credit_pack"), false);
});

test("only plans the caller marks purchasable are offered", () => {
  const limited = buildViewer({
    user,
    account: account(),
    purchasable: { plans: ["studio"], packs: [] },
    now,
  });
  assert.deepEqual(
    limited.offers.map((offer) => offer.id),
    ["studio"],
  );
  const empty = buildViewer({
    user,
    account: account(),
    purchasable: { plans: [] as PlanId[], packs: [] },
    now,
  });
  assert.equal(empty.nextOffer, null);
});

test("status and cancellation state are reported without being inferred away", () => {
  const viewer = buildViewer({
    user,
    account: account({ cancelAtPeriodEnd: true }),
    purchasable,
    now,
  });
  assert.equal(viewer.plan.cancelAtPeriodEnd, true);
  assert.equal(viewer.plan.currentPeriodEnd, "2026-12-07T00:00:00.000Z");
  assert.equal(viewer.generatedAt, now.toISOString());
});

test("the contract carries a nullable email and does not invent one", () => {
  const viewer = buildViewer({
    user: { id: user.id, email: null },
    account: account(),
    purchasable,
    now,
  });
  assert.deepEqual(viewer.user, { id: user.id, email: null });
  assert.equal(viewer.member, true);
});
