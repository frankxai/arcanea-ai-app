import assert from "node:assert/strict";
import { test } from "node:test";
import { CREDIT_PACKS, ENTITLEMENTS, PLANS, type PlanId } from "../catalog";
import type { BillingAccount } from "../ledger";
import {
  PERIOD_END_GRACE_HOURS,
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
const graceMs = PERIOD_END_GRACE_HOURS * 60 * 60 * 1000;

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
  assert.deepEqual(
    viewer.entitlements.hostedWorlds,
    ENTITLEMENTS.creator.hostedWorlds,
  );
  assert.equal(viewer.entitlements.credits.balance, 1200);
  assert.equal(viewer.entitlements.credits.reserved, 50);
  assert.equal(viewer.paid, true);
});

test("active and trialing are bounded by currentPeriodEnd plus the latency allowance", () => {
  const future = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();
  assert.equal(
    effectivePlanId("studio", "active", { currentPeriodEnd: future, now }),
    "studio",
  );
  assert.equal(
    effectivePlanId("studio", "trialing", { currentPeriodEnd: future, now }),
    "studio",
  );

  const withinGrace = new Date(now.getTime() - graceMs + 60_000).toISOString();
  assert.equal(
    effectivePlanId("creator", "active", {
      currentPeriodEnd: withinGrace,
      now,
    }),
    "creator",
  );

  const beyondGrace = new Date(now.getTime() - graceMs - 60_000).toISOString();
  assert.equal(
    effectivePlanId("creator", "active", {
      currentPeriodEnd: beyondGrace,
      now,
    }),
    "spark",
  );

  assert.equal(
    effectivePlanId("creator", "active", { currentPeriodEnd: null, now }),
    "spark",
  );
});

test("past_due grants nothing because the ledger has no past_due_at", () => {
  const future = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();
  for (const currentPeriodEnd of [future, null]) {
    const viewer = buildViewer({
      user,
      account: account({
        plan: "studio",
        planStatus: "past_due",
        currentPeriodEnd,
      }),
      purchasable,
      now,
    });
    assert.equal(viewer.plan.id, "spark");
    assert.equal(viewer.entitlements.apiKeys, false);
    assert.equal(viewer.paid, false);
  }
});

test("a period-end cancellation keeps paid access until the paid period ends", () => {
  // Polar sends cancellation while the subscription is still status active and
  // only revokes at period end, so the date must end access, not the status.
  for (const status of ["active", "canceled"] as const) {
    const viewer = buildViewer({
      user,
      account: account({
        plan: "studio",
        planStatus: status,
        cancelAtPeriodEnd: true,
        currentPeriodEnd: "2026-12-07T00:00:00.000Z",
      }),
      purchasable,
      now,
    });
    assert.equal(viewer.plan.id, "studio", status);
    assert.equal(viewer.plan.status, status);
    assert.deepEqual(
      viewer.entitlements.hostedWorlds,
      ENTITLEMENTS.studio.hostedWorlds,
    );
  }
});

test("a period-end cancellation stops at currentPeriodEnd or without a date", () => {
  for (const currentPeriodEnd of ["2026-01-01T00:00:00.000Z", null]) {
    for (const status of ["active", "canceled"] as const) {
      const viewer = buildViewer({
        user,
        account: account({
          plan: "studio",
          planStatus: status,
          cancelAtPeriodEnd: true,
          currentPeriodEnd,
        }),
        purchasable,
        now,
      });
      assert.equal(viewer.plan.id, "spark", `${status}/${currentPeriodEnd}`);
      assert.equal(viewer.entitlements.apiKeys, false);
    }
  }
});

test("revocation, pause and none resolve to Spark even with a stale cancel flag", () => {
  for (const status of ["revoked", "paused", "none"] as const) {
    for (const cancelAtPeriodEnd of [false, true]) {
      const viewer = buildViewer({
        user,
        account: account({
          plan: "studio",
          planStatus: status,
          cancelAtPeriodEnd,
          currentPeriodEnd: "2026-12-07T00:00:00.000Z",
        }),
        purchasable,
        now,
      });
      assert.equal(viewer.plan.id, "spark", `${status}/${cancelAtPeriodEnd}`);
      assert.equal(viewer.entitlements.apiKeys, false, status);
      assert.equal(viewer.paid, false, status);
    }
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
    creator.offers
      .filter((offer) => offer.kind === "plan")
      .map((offer) => offer.id),
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
    spark.offers
      .filter((offer) => offer.kind === "plan")
      .map((offer) => offer.id),
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
  assert.equal(
    noPacks.offers.some((offer) => offer.kind === "credit_pack"),
    false,
  );
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

test("the contract carries a nullable email and distinguishes account from paid", () => {
  const paid = buildViewer({
    user: { id: user.id, email: null },
    account: account(),
    purchasable,
    now,
  });
  assert.deepEqual(paid.user, { id: user.id, email: null });
  assert.equal(paid.member, true);
  assert.equal(paid.paid, true);

  const free = buildViewer({
    user: { id: user.id, email: null },
    account: account({ plan: "spark", planStatus: "none" }),
    purchasable,
    now,
  });
  assert.equal(free.member, true);
  assert.equal(free.paid, false);
});
