import assert from "node:assert/strict";
import { test } from "node:test";
import { CREDIT_PACKS, ENTITLEMENTS, PLANS, type PlanId } from "../catalog";
import type { BillingAccount } from "../ledger";
import { VIEWER_SCHEMA, buildViewer, effectivePlanId } from "../viewer";

const now = new Date("2026-11-07T12:00:00.000Z");
const user = { id: "user-1", email: "creator@example.com" };
const purchasable = {
  plans: PLANS.filter((plan) => plan.priceCents > 0).map((plan) => plan.id),
  packs: CREDIT_PACKS.map((pack) => pack.id),
};

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

test("trialing and past_due keep the plan during trial and dunning", () => {
  assert.equal(effectivePlanId("studio", "trialing"), "studio");
  assert.equal(effectivePlanId("creator", "past_due"), "creator");
});

test("a period-end cancellation keeps paid access until the paid period ends", () => {
  // mapPolarEvent keeps the plan and sets status canceled; the viewer must not
  // revoke access mid-period.
  const viewer = buildViewer({
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
  assert.equal(viewer.plan.id, "studio");
  assert.equal(viewer.plan.status, "canceled");
  assert.deepEqual(viewer.entitlements.hostedWorlds, ENTITLEMENTS.studio.hostedWorlds);
});

test("cancellation that is not period-end, or has expired, resolves to Spark", () => {
  const cases: Array<Partial<BillingAccount>> = [
    { planStatus: "canceled", cancelAtPeriodEnd: false },
    {
      planStatus: "canceled",
      cancelAtPeriodEnd: true,
      currentPeriodEnd: "2026-01-01T00:00:00.000Z",
    },
    { planStatus: "revoked", cancelAtPeriodEnd: false },
    { planStatus: "paused", cancelAtPeriodEnd: false },
    { planStatus: "none", cancelAtPeriodEnd: false },
  ];
  for (const overrides of cases) {
    const viewer = buildViewer({
      user,
      account: account({ plan: "studio", ...overrides }),
      purchasable,
      now,
    });
    assert.equal(viewer.plan.id, "spark", JSON.stringify(overrides));
    assert.deepEqual(viewer.entitlements.hostedWorlds, ENTITLEMENTS.spark.hostedWorlds);
    assert.equal(viewer.entitlements.apiKeys, false);
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

test("offers only include purchasable paid plans and configured packs", () => {
  const viewer = buildViewer({ user, account: account(), purchasable, now });
  const planOffers = viewer.offers.filter((offer) => offer.kind === "plan");
  assert.deepEqual(
    planOffers.map((offer) => offer.id),
    ["studio"],
    "spark is not a paid SKU and creator is the active plan",
  );
  const packOffers = viewer.offers.filter((offer) => offer.kind === "credit_pack");
  assert.equal(packOffers.length, CREDIT_PACKS.length);
  assert.ok(viewer.offers.every((offer) => offer.included === false));
  assert.deepEqual(viewer.nextOffer, planOffers[0]);
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
