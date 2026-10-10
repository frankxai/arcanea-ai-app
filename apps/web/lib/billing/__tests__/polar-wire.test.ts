import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { mapPolarEvent } from "../polar";

test("signed Polar wire payload is normalized by the installed SDK before credit mapping", () => {
  const date = "2026-10-10T00:00:00Z";
  const body = JSON.stringify({
    type: "order.paid",
    timestamp: date,
    data: {
      id: "wire-order",
      created_at: date,
      modified_at: null,
      status: "paid",
      paid: true,
      subtotal_amount: 500,
      discount_amount: 0,
      net_amount: 500,
      tax_amount: 0,
      total_amount: 500,
      applied_balance_amount: 0,
      due_amount: 0,
      refunded_amount: 0,
      refunded_tax_amount: 0,
      currency: "eur",
      billing_reason: "purchase",
      billing_name: null,
      billing_address: null,
      invoice_number: null,
      is_invoice_generated: false,
      receipt_number: null,
      customer_id: "wire-customer",
      product_id: "wire-product",
      discount_id: null,
      subscription_id: null,
      checkout_id: null,
      metadata: {},
      platform_fee_amount: 0,
      platform_fee_currency: null,
      product: null,
      discount: null,
      subscription: null,
      items: [],
      description: "Fixture credits",
      refundable_amount: 500,
      refundable_tax_amount: 0,
      customer: {
        id: "wire-customer",
        created_at: date,
        modified_at: null,
        metadata: {},
        external_id: "00000000-0000-0000-0000-000000000001",
        email_verified: false,
        type: "individual",
        name: null,
        billing_name: null,
        billing_address: null,
        tax_id: null,
        organization_id: "fixture-org",
        deleted_at: null,
        avatar_url: null,
      },
    },
  });
  const secret = "fixture-only-secret";
  const timestamp = String(Math.floor(Date.now() / 1000));
  const id = "wire-delivery";
  const signature = createHmac("sha256", secret)
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");
  const headers = {
    "webhook-id": id,
    "webhook-timestamp": timestamp,
    "webhook-signature": `v1,${signature}`,
  };
  const event = validateEvent(body, headers, secret);
  const intents = mapPolarEvent(event, {
    POLAR_PRODUCT_PACK_500: "wire-product",
  });
  assert.equal(intents.length, 1);
  assert.equal(intents[0].userId, "00000000-0000-0000-0000-000000000001");
  assert.equal(intents[0].kind === "grant" && intents[0].amount, 500);
  assert.throws(
    () => validateEvent(body + " ", headers, secret),
    WebhookVerificationError,
  );
});
