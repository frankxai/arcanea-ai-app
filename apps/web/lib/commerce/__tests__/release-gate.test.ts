import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

// Stripe is fully configured here on purpose: the gate must refuse even then.
process.env.STRIPE_SECRET_KEY = "sk_test_gate";
process.env.STRIPE_PRICE_CREATOR = "price_creator";
process.env.STRIPE_PRICE_STUDIO = "price_studio";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

const post = (path: string, body: unknown) =>
  new NextRequest(`https://www.arcanea.ai${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

test("no product in the registry holds a release gate PASS today", async () => {
  const { isReleased } = await import("../release-gate");
  for (const id of [
    "arcanea-subscription",
    "arcanea-mcp",
    "arcanea-credits",
    "unknown",
  ]) {
    assert.equal(isReleased(id), false, id);
  }
});

test("only a PASS gate opens a product", async () => {
  const { isReleased } = await import("../release-gate");
  const registry = {
    products: [
      { id: "a", gate: "PASS 2026-09-20 receipts/a.md" },
      { id: "b", gate: "UNGATED" },
      { id: "c", gate: "UNGATED - PASS pending" },
    ],
  };
  assert.equal(isReleased("a", registry), true);
  assert.equal(isReleased("b", registry), false);
  assert.equal(isReleased("c", registry), false);
});

for (const [path, body] of [
  ["/api/stripe/checkout", { tier: "creator" }],
  ["/api/stripe/checkout", { tier: "studio" }],
  ["/api/credits/checkout", { packId: "starter" }],
] as const) {
  test(`${path} refuses before auth or Stripe while nothing is released`, async (t) => {
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      throw new Error(
        "network forbidden: checkout must not reach Stripe or Supabase",
      );
    });
    const route = path.includes("credits")
      ? await import("../../../app/api/credits/checkout/route")
      : await import("../../../app/api/stripe/checkout/route");
    const res = await route.POST(post(path, body));
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.code, "not_released");
    assert.match(json.error, /not on sale/i);
    assert.equal(calls, 0);
  });
}
