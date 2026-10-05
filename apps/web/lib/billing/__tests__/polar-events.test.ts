import assert from "node:assert/strict";
import { test } from "node:test";
import { mapPolarEvent } from "../polar";

const env = {
  POLAR_PRODUCT_CREATOR: "prod_creator",
  POLAR_PRODUCT_STUDIO: "prod_studio",
  POLAR_PRODUCT_PACK_500: "prod_500",
  POLAR_PRODUCT_PACK_2500: "prod_2500",
};

const customer = { id: "cus_1", externalId: "user-123" };

test("a paid pack order grants exactly the pack's credits, keyed on the order id", () => {
  const intents = mapPolarEvent(
    {
      type: "order.paid",
      data: { id: "ord_1", paid: true, billingReason: "purchase", productId: "prod_2500", customer },
    },
    env,
  );
  assert.equal(intents.length, 1);
  const grant = intents[0];
  assert.equal(grant.kind, "grant");
  if (grant.kind !== "grant") return;
  assert.equal(grant.userId, "user-123");
  assert.equal(grant.amount, 2500);
  assert.equal(grant.grantKind, "purchase");
  assert.equal(grant.reference, "polar:order:ord_1");
});

test("a subscription order grants the plan's monthly credits on create and on cycle", () => {
  for (const reason of ["subscription_create", "subscription_cycle"]) {
    const intents = mapPolarEvent(
      {
        type: "order.paid",
        data: {
          id: `ord_${reason}`,
          paid: true,
          billingReason: reason,
          productId: "prod_creator",
          subscriptionId: "sub_1",
          customer,
        },
      },
      env,
    );
    assert.equal(intents.length, 1, reason);
    const grant = intents[0];
    if (grant.kind !== "grant") throw new Error("expected grant");
    assert.equal(grant.amount, 1500);
    assert.equal(grant.grantKind, "grant");
    assert.equal(grant.reference, `polar:order:ord_${reason}`);
  }
});

test("orders for unknown products or unknown customers grant nothing", () => {
  assert.deepEqual(
    mapPolarEvent(
      { type: "order.paid", data: { id: "o", paid: true, productId: "prod_mystery", customer } },
      env,
    ),
    [],
  );
  assert.deepEqual(
    mapPolarEvent(
      { type: "order.paid", data: { id: "o", paid: true, productId: "prod_500", customer: { id: "c" } } },
      env,
    ),
    [],
  );
  assert.deepEqual(
    mapPolarEvent(
      { type: "order.paid", data: { id: "o", paid: false, productId: "prod_500", customer } },
      env,
    ),
    [],
  );
});

test("checkout metadata userId is accepted when the customer has no external id", () => {
  const intents = mapPolarEvent(
    {
      type: "order.paid",
      data: {
        id: "ord_meta",
        paid: true,
        productId: "prod_500",
        customer: { id: "cus_x" },
        metadata: { userId: "user-meta" },
      },
    },
    env,
  );
  assert.equal(intents.length, 1);
  assert.equal(intents[0].userId, "user-meta");
});

test("subscription lifecycle maps to plan and status", () => {
  const base = { id: "sub_1", productId: "prod_studio", customer, currentPeriodEnd: "2026-11-05T00:00:00Z" };

  const active = mapPolarEvent({ type: "subscription.active", data: { ...base, status: "active" } }, env);
  assert.equal(active.length, 1);
  const a = active[0];
  if (a.kind !== "setPlan") throw new Error("expected setPlan");
  assert.equal(a.plan, "studio");
  assert.equal(a.status, "active");
  assert.equal(a.polarCustomerId, "cus_1");
  assert.equal(a.polarSubscriptionId, "sub_1");
  assert.ok(a.currentPeriodEnd instanceof Date);

  const canceled = mapPolarEvent(
    { type: "subscription.canceled", data: { ...base, status: "canceled", cancelAtPeriodEnd: true } },
    env,
  )[0];
  if (canceled.kind !== "setPlan") throw new Error("expected setPlan");
  // Canceled keeps access until the period ends; the plan is unchanged.
  assert.equal(canceled.plan, "studio");
  assert.equal(canceled.status, "canceled");
  assert.equal(canceled.cancelAtPeriodEnd, true);

  const revoked = mapPolarEvent(
    { type: "subscription.revoked", data: { ...base, status: "canceled" } },
    env,
  )[0];
  if (revoked.kind !== "setPlan") throw new Error("expected setPlan");
  assert.equal(revoked.plan, "spark");
  assert.equal(revoked.status, "revoked");

  const pastDue = mapPolarEvent(
    { type: "subscription.past_due", data: { ...base, status: "past_due" } },
    env,
  )[0];
  if (pastDue.kind !== "setPlan") throw new Error("expected setPlan");
  assert.equal(pastDue.plan, "studio");
  assert.equal(pastDue.status, "past_due");
});

test("events we do not act on produce no intents", () => {
  assert.deepEqual(mapPolarEvent({ type: "checkout.created", data: { id: "c" } }, env), []);
  assert.deepEqual(mapPolarEvent({ type: "customer.state_changed", data: { id: "c" } }, env), []);
  assert.deepEqual(
    mapPolarEvent({ type: "subscription.active", data: { id: "s", productId: "prod_mystery", customer } }, env),
    [],
  );
});
