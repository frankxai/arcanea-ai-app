import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FREE_TIER,
  idOf,
  primaryItem,
  resolveEntitlement,
  tierForPriceId,
  toCustomerRow,
  toPriceRow,
  toProductRow,
  toSubscriptionRow,
  unixToIso,
} from "../stripe-mirror";

const env = {
  STRIPE_PRICE_CREATOR: "price_creator",
  STRIPE_PRICE_STUDIO: "price_studio",
};

const subscription = {
  id: "sub_1",
  customer: "cus_1",
  status: "active",
  cancel_at_period_end: false,
  cancel_at: null,
  canceled_at: null,
  ended_at: null,
  trial_start: null,
  trial_end: null,
  metadata: { user_id: "user-1" },
  items: {
    data: [
      {
        price: { id: "price_creator", product: "prod_1" },
        current_period_start: 1_760_000_000,
        current_period_end: 1_762_678_400,
        quantity: 1,
      },
    ],
  },
};

test("entitlement is granted only for active and trialing", () => {
  assert.equal(resolveEntitlement({ status: "active", mappedTier: "creator" }), "creator");
  assert.equal(resolveEntitlement({ status: "trialing", mappedTier: "studio" }), "studio");
});

test("a granting status without a mapped price never upgrades", () => {
  // A price the app was not configured to sell maps to null, so an active
  // subscription on it changes nothing rather than picking a tier.
  assert.equal(resolveEntitlement({ status: "active", mappedTier: null }), null);
  assert.equal(tierForPriceId("price_unknown", env), null);
});

test("terminal states revoke to the free tier", () => {
  for (const status of ["canceled", "unpaid", "incomplete_expired", "paused"]) {
    assert.equal(
      resolveEntitlement({ status, mappedTier: "studio" }),
      FREE_TIER,
      status,
    );
  }
});

test("dunning and unknown statuses leave the current tier untouched", () => {
  for (const status of ["past_due", "incomplete", "some_future_status"]) {
    assert.equal(resolveEntitlement({ status, mappedTier: "creator" }), null, status);
  }
});

test("price mapping uses the same env vars as the checkout gate", () => {
  assert.equal(tierForPriceId("price_creator", env), "creator");
  assert.equal(tierForPriceId("price_studio", env), "studio");
  assert.equal(tierForPriceId(null, env), null);
  assert.equal(tierForPriceId("price_creator", {}), null);
});

test("subscription rows read period bounds from the item, not the root", () => {
  const row = toSubscriptionRow(subscription);
  assert.equal(row.price_id, "price_creator");
  assert.equal(row.customer_id, "cus_1");
  assert.equal(row.quantity, 1);
  assert.equal(row.current_period_start, unixToIso(1_760_000_000));
  assert.equal(row.current_period_end, unixToIso(1_762_678_400));
  assert.equal(row.cancel_at_period_end, false);
});

test("a subscription without items still mirrors without inventing a price", () => {
  const row = toSubscriptionRow({ ...subscription, items: { data: [] } });
  assert.equal(row.price_id, null);
  assert.equal(row.current_period_start, null);
  assert.equal(row.quantity, 1);
  assert.equal(primaryItem({ ...subscription, items: null }), null);
});

test("optional quantity is never forced into the row as null", () => {
  const row = toSubscriptionRow({
    ...subscription,
    items: {
      data: [{ price: { id: "price_creator" }, current_period_start: 1, current_period_end: 2 }],
    },
  });
  assert.equal(row.quantity, 1);
});

test("unix seconds convert to ISO and never fabricate epoch zero", () => {
  assert.equal(unixToIso(0), new Date(0).toISOString());
  assert.equal(unixToIso(null), null);
  assert.equal(unixToIso(undefined), null);
  assert.equal(unixToIso(Number.NaN), null);
});

test("expanded objects and id strings resolve to the same id", () => {
  assert.equal(idOf("cus_1"), "cus_1");
  assert.equal(idOf({ id: "cus_1" }), "cus_1");
  assert.equal(idOf(null), null);
});

test("price rows keep Stripe's minor-unit amount and interval", () => {
  const row = toPriceRow({
    id: "price_creator",
    product: { id: "prod_1" },
    active: true,
    currency: "eur",
    type: "recurring",
    unit_amount: 2900,
    recurring: { interval: "month", interval_count: 1 },
  });
  assert.equal(row.product_id, "prod_1");
  assert.equal(row.unit_amount, 2900);
  assert.equal(row.recurring_interval, "month");
  assert.equal(row.recurring_interval_count, 1);
});

test("a deleted price event that arrives unexpanded still mirrors", () => {
  const row = toPriceRow({ id: "price_x", product: "prod_x" });
  assert.equal(row.product_id, "prod_x");
  assert.equal(row.unit_amount, null);
  assert.equal(row.active, true);
});

test("product and customer rows normalize optional fields", () => {
  const product = toProductRow({ id: "prod_1", name: "Creator" });
  assert.equal(product.active, true);
  assert.equal(product.description, null);

  const customer = toCustomerRow({ id: "cus_1", email: "a@example.com" }, "user-1");
  assert.equal(customer.user_id, "user-1");
  assert.equal(customer.email, "a@example.com");

  const anonymous = toCustomerRow({ id: "cus_2" });
  assert.equal(anonymous.user_id, null);
});
