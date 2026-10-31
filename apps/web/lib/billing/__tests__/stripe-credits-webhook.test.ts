import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transpileModule, ModuleKind, ScriptTarget } from "typescript";
import * as legacyCredits from "../../types/credits";

type Grant = { userId: string; amount: number; reference: string };

function loadWebhook(grant: (g: Grant) => Promise<{ applied: boolean }>) {
  const source = readFileSync(
    new URL("../../../app/api/credits/webhook/route.ts", import.meta.url),
    "utf8",
  );
  const js = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2022,
    },
  }).outputText;
  const legacyWrites: string[] = [];
  const exports: Record<string, (r: Request) => Promise<Response>> = {};
  runInNewContext(js, {
    exports,
    require: (id: string) => {
      const imports: Record<string, unknown> = {
        "next/server": { NextResponse: Response },
        "next/headers": {
          headers: async () => new Headers({ "stripe-signature": "sig" }),
        },
        "@/lib/types/credits": legacyCredits,
        "@/lib/supabase/server": {
          createAdminClient: () => ({
            from(table: string) {
              legacyWrites.push(table);
              throw Error(
                `legacy table ${table} must not be written for purchases`,
              );
            },
          }),
        },
        "@/lib/billing/ledger": {
          grantPurchasedCredits: (
            userId: string,
            amount: number,
            reference: string,
          ) => grant({ userId, amount, reference }),
        },
        stripe: {
          default: class {
            webhooks = { constructEvent: (body: string) => JSON.parse(body) };
          },
        },
      };
      if (!(id in imports)) throw Error(id);
      return imports[id];
    },
    Request,
    Response,
    Headers,
    process: {
      env: {
        STRIPE_SECRET_KEY: "sk_test",
        STRIPE_WEBHOOK_SECRET: "whsec_test",
      },
    },
    console: { error() {}, warn() {}, log() {} },
  });
  return { POST: exports.POST, legacyWrites };
}

function checkoutEvent(session: Record<string, unknown>) {
  return new Request("https://arcanea.ai/api/credits/webhook", {
    method: "POST",
    body: JSON.stringify({
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          mode: "payment",
          metadata: {
            user_id: "00000000-0000-0000-0000-000000000001",
            pack_id: "pack-250",
            credits: "250",
          },
          ...session,
        },
      },
    }),
  });
}

test("a redelivered checkout event grants once per payment, through the idempotent ledger", async () => {
  const grants: Grant[] = [];
  const applied = new Set<string>();
  const { POST, legacyWrites } = loadWebhook(async (g) => {
    grants.push(g);
    const first = !applied.has(g.reference);
    applied.add(g.reference);
    return { applied: first };
  });

  const first = await POST(checkoutEvent({ payment_intent: "pi_123" }));
  const second = await POST(checkoutEvent({ payment_intent: "pi_123" }));

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.deepEqual(legacyWrites, []);
  assert.equal(grants.length, 2);
  assert.deepEqual(
    grants.map((g) => g.reference),
    ["stripe:pi_123", "stripe:pi_123"],
  );
  assert.equal(grants[0].amount, 250);
  assert.equal(grants[0].userId, "00000000-0000-0000-0000-000000000001");
});

test("a failed grant answers 500 so Stripe retries instead of dropping the credits", async () => {
  const { POST } = loadWebhook(async () => {
    throw Error("billing_grant_credits failed: connection reset");
  });
  const res = await POST(checkoutEvent({ payment_intent: { id: "pi_456" } }));
  assert.equal(res.status, 500);
});

test("without a payment intent the grant is keyed on the checkout session", async () => {
  const grants: Grant[] = [];
  const { POST } = loadWebhook(async (g) => {
    grants.push(g);
    return { applied: true };
  });
  const res = await POST(checkoutEvent({ payment_intent: null }));
  assert.equal(res.status, 200);
  assert.equal(grants[0].reference, "stripe:cs_test_1");
});
