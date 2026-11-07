import assert from "node:assert/strict";
import { test } from "node:test";
import { CREDIT_PACKS, ENTITLEMENTS, PLANS } from "../catalog";
import type { BillingAccount } from "../ledger";
import { VIEWER_SCHEMA, buildViewer, effectivePlanId } from "../viewer";

const now = new Date("2026-11-07T12:00:00.000Z");
const user = { id: "user-1", email: "creator@example.com" };

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
  const viewer = buildViewer({ user, account: account(), now });
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

test("a plan that cannot pay resolves to Spark entitlements", () => {
  for (const status of ["none", "canceled", "revoked", "paused"] as const) {
    const viewer = buildViewer({
      user,
      account: account({ plan: "studio", planStatus: status }),
      now,
    });
    assert.equal(viewer.plan.id, "spark", status);
    assert.equal(viewer.plan.status, status);
    assert.deepEqual(viewer.entitlements.hostedWorlds, ENTITLEMENTS.spark.hostedWorlds);
    assert.equal(viewer.entitlements.apiKeys, false, status);
  }
});

test("an unknown plan never inherits paid entitlements", () => {
  const viewer = buildViewer({
    user,
    account: account({ plan: "enterprise" as never, planStatus: "active" }),
    now,
  });
  assert.equal(viewer.plan.id, "spark");
  assert.equal(viewer.entitlements.apiKeys, false);
});

test("offers are actionable and never repeat the active plan", () => {
  const viewer = buildViewer({ user, account: account(), now });
  const planOffers = viewer.offers.filter((offer) => offer.kind === "plan");
  assert.deepEqual(
    planOffers.map((offer) => offer.id),
    PLANS.filter((plan) => plan.id !== "creator").map((plan) => plan.id),
  );
  const packOffers = viewer.offers.filter((offer) => offer.kind === "credit_pack");
  assert.equal(packOffers.length, CREDIT_PACKS.length);
  assert.ok(viewer.offers.every((offer) => offer.included === false));
  assert.deepEqual(viewer.nextOffer, planOffers[0]);
});

test("status and cancellation state are reported without being inferred away", () => {
  const viewer = buildViewer({
    user,
    account: account({ cancelAtPeriodEnd: true }),
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
    now,
  });
  assert.deepEqual(viewer.user, { id: user.id, email: null });
  assert.equal(viewer.member, true);
});
