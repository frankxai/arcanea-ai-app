import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transpileModule, ModuleKind, ScriptTarget } from "typescript";
import {
  BillingError,
  InsufficientCreditsError,
  OperationPendingError,
  OperationConflictError,
  OperationFailedError,
} from "../operations";
import { costFor } from "../catalog";
function load(path: string, imports: Record<string, unknown>) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const js = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2022,
    },
  }).outputText;
  const exports: Record<string, (r: Request) => Promise<Response>> = {};
  runInNewContext(js, {
    exports,
    require: (id: string) => {
      if (!(id in imports)) throw Error(id);
      return imports[id];
    },
    Request,
    Response,
    URL,
    process: { env: { POLAR_WEBHOOK_SECRET: "test-only" } },
    console: { error() {} },
  });
  return exports;
}
test("anonymous and zero-credit image denial call neither enhancer nor image provider", async () => {
  for (const signedIn of [false, true]) {
    let enhancements = 0,
      images = 0;
    const route = load("../../../app/api/imagine/generate/route.ts", {
      "node:crypto": {
        createHash: () => ({ update: () => ({ digest: () => "fingerprint" }) }),
      },
      "next/server": { NextResponse: Response },
      "@/lib/imagine/enhance-image-prompt": {
        enhanceImagePrompt: async () => {
          enhancements++;
          return "enhanced";
        },
      },
      "@/lib/imagine/generate": {
        OPENROUTER_IMAGE_MODELS: [],
        generateImages: async () => {
          images++;
          return { images: [] };
        },
      },
      "@/lib/imagine/styles": { applyStyle: (prompt: string) => ({ prompt }) },
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: {
            getUser: async () => ({
              data: { user: signedIn ? { id: "u" } : null },
            }),
          },
        }),
      },
      "@/lib/billing/catalog": { costFor: () => 10 },
      "@/lib/billing/ledger": {
        BillingError,
        InsufficientCreditsError,
        OperationPendingError,
        OperationConflictError,
        OperationFailedError,
        withReservation: async () => {
          throw new InsufficientCreditsError(10, 0);
        },
      },
    });
    const response = await route.POST(
      new Request("https://untrusted.invalid/api/imagine/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "image",
          count: 1,
          enhance: true,
          requestKey: "00000000-0000-0000-0000-000000000001",
        }),
      }),
    );
    assert.equal(response.status, signedIn ? 402 : 401);
    assert.equal(enhancements, 0);
    assert.equal(images, 0);
  }
});

test("unknown models are refused; catalog models charge their quoted tier and count", async () => {
  for (const model of ["unknown/expensive", "fixture/quality"]) {
    let providers = 0,
      reserved = 0;
    const route = load("../../../app/api/imagine/generate/route.ts", {
      "node:crypto": {
        createHash: () => ({ update: () => ({ digest: () => "fingerprint" }) }),
      },
      "next/server": { NextResponse: Response },
      "@/lib/imagine/enhance-image-prompt": {
        enhanceImagePrompt: async (p: string) => p,
      },
      "@/lib/imagine/generate": {
        OPENROUTER_IMAGE_MODELS: [{ id: "fixture/quality", tier: "quality" }],
        generateImages: async () => {
          providers++;
          return {
            provider: "openrouter",
            model,
            images: [
              { url: "https://fixture.invalid/1" },
              { url: "https://fixture.invalid/2" },
            ],
          };
        },
      },
      "@/lib/imagine/styles": { applyStyle: (prompt: string) => ({ prompt }) },
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: { getUser: async () => ({ data: { user: { id: "u" } } }) },
        }),
      },
      "@/lib/billing/catalog": { costFor },
      "@/lib/billing/ledger": {
        BillingError,
        InsufficientCreditsError,
        OperationPendingError,
        OperationConflictError,
        OperationFailedError,
        withReservation: async (
          input: { amount: number },
          work: () => Promise<{ result: unknown; actualCredits: number }>,
        ) => {
          reserved = input.amount;
          const { result, actualCredits } = await work();
          return { result, charged: actualCredits, account: { balance: 10 } };
        },
      },
    });
    const res = await route.POST(
      new Request("https://fixture.invalid/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "image",
          count: 1,
          model,
          requestKey: "00000000-0000-0000-0000-000000000001",
        }),
      }),
    );
    assert.equal(res.status, model.startsWith("unknown") ? 400 : 200);
    if (res.ok) {
      const response = await res.json();
      assert.equal(reserved, costFor("image.premium"));
      assert.equal(response.images.length, 1);
      assert.equal(response.credits.charged, reserved);
    } else assert.equal(providers, 0);
  }
});

test("checkout refuses unreleased billing and unavailable recovery schema before calling Polar", async () => {
  for (const [live, schemaReady, expected] of [
    [false, false, 503],
    [true, false, 503],
    [true, true, 200],
  ] as const) {
    let calls = 0;
    const route = load("../../../app/api/billing/checkout/route.ts", {
      "next/server": { NextResponse: Response },
      zod: {
        z: {
          object: () => ({
            safeParse: () => ({ success: true, data: { sku: "creator" } }),
          }),
          string: () => ({ min: () => ({ max: () => ({}) }) }),
        },
      },
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: { getUser: async () => ({ data: { user: { id: "u" } } }) },
        }),
      },
      "@/lib/billing/catalog": {
        isPaidSku: () => true,
        billingReadiness: () => ({ live, hasToken: true }),
      },
      "@/lib/billing/ledger": {
        BillingError,
        requireRecoverySchema: async () => {
          if (!schemaReady) throw new BillingError("missing schema");
        },
      },
      "@/lib/billing/polar": {
        PolarNotConfiguredError: class extends Error {},
        createCheckout: async () => {
          calls++;
          return { url: "https://fixture.invalid/checkout", id: "checkout" };
        },
      },
    });
    const request = new Request(
      "https://fixture.invalid/api/billing/checkout",
      { method: "POST", body: JSON.stringify({ sku: "creator" }) },
    );
    Object.assign(request, { nextUrl: new URL(request.url) });
    assert.equal((await route.POST(request)).status, expected);
    assert.equal(calls, expected === 200 ? 1 : 0);
  }
});
test("failed atomic webhook transaction returns retryable status; redelivery applies instead of becoming a poisoned duplicate", async () => {
  let calls = 0;
  const route = load("../../../app/api/webhook/polar/route.ts", {
    "@polar-sh/sdk/webhooks": {
      validateEvent: () => ({ type: "order.paid" }),
      WebhookVerificationError: class extends Error {},
    },
    "@/lib/billing/polar": { mapPolarEvent: () => [] },
    "@/lib/billing/ledger": {
      applyEvent: async () => {
        if (++calls === 1) throw Error("transient");
        return { duplicate: false, applied: 1 };
      },
    },
  });
  const request = () =>
    new Request("https://fixture.invalid/webhook", {
      method: "POST",
      headers: { "webhook-id": "delivery" },
      body: "{}",
    });
  assert.equal((await route.POST(request())).status, 503);
  const retry = await route.POST(request());
  assert.equal(retry.status, 200);
  assert.equal((await retry.json()).duplicate, false);
  assert.equal(calls, 2);
});
