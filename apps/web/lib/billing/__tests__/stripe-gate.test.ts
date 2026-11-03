import assert from "node:assert/strict";
import { test } from "node:test";
import { stripeCheckoutGate, STRIPE_TIER_STATUS } from "../stripe-gate";

const configured = {
  STRIPE_SECRET_KEY: "sk_test_x",
  STRIPE_PRICE_CREATOR: "price_creator",
  STRIPE_PRICE_STUDIO: "price_studio",
};
const forSale = { creator: "for sale", studio: "for sale" } as const;

test("a Stripe key alone does not open checkout", () => {
  const result = stripeCheckoutGate("creator", configured);
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.refusal, "billing_disabled");
});

test("billing switch on but tier not marked for sale stays gated", () => {
  const result = stripeCheckoutGate("studio", {
    ...configured,
    ARCANEA_BILLING_ENABLED: "true",
  });
  assert.equal(!result.ok && result.refusal, "checkout_gated");
});

test("shipped tier statuses are all closed", () => {
  for (const status of Object.values(STRIPE_TIER_STATUS)) {
    assert.ok(!status.toLowerCase().startsWith("for sale"), status);
  }
});

test("for sale but missing price id is unconfigured, not a Stripe call", () => {
  const env = {
    ARCANEA_BILLING_ENABLED: "true",
    STRIPE_SECRET_KEY: "sk_test_x",
  };
  const result = stripeCheckoutGate("creator", env, forSale);
  assert.equal(!result.ok && result.refusal, "checkout_unconfigured");
});

test("unknown tier is a 400", () => {
  const result = stripeCheckoutGate("enterprise", configured, forSale);
  assert.equal(!result.ok && result.status, 400);
});

test("all gates pass only with switch, for-sale status, key and price", () => {
  const result = stripeCheckoutGate(
    "creator",
    { ...configured, ARCANEA_BILLING_ENABLED: "true" },
    forSale,
  );
  assert.deepEqual(result, {
    ok: true,
    secretKey: "sk_test_x",
    priceId: "price_creator",
  });
});
