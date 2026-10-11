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
import { z } from "zod";
import * as legacyCredits from "../../types/credits";
function load(
  path: string,
  imports: Record<string, unknown>,
  context: Record<string, unknown> = {},
) {
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
    Buffer,
    process: { env: { POLAR_WEBHOOK_SECRET: "test-only" } },
    console: { error() {}, warn() {} },
    crypto: globalThis.crypto,
    ...context,
  });
  return exports;
}
test("a failed legacy balance read must never grant provider admission", async () => {
  const route = load("../../../app/api/credits/spend/route.ts", {
    "next/server": { NextResponse: Response },
    zod: { z },
    "@/lib/types/credits": legacyCredits,
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: { getUser: async () => ({ data: { user: { id: "u" } } }) },
      }),
      createAdminClient: () => ({
        from() {
          throw Error("database is unavailable");
        },
      }),
    },
  });
  const response = await route.POST(
    new Request("https://www.arcanea.ai/api/credits/spend", {
      method: "POST",
      body: JSON.stringify({ creationType: "video" }),
    }),
  );
  assert.ok(
    response.status >= 400,
    "Database failure must not report successful debit",
  );
  assert.notEqual((await response.json()).success, true);
});
test("legacy image endpoint delegates to the same governed handler without forwarding cookies elsewhere", async () => {
  const incoming = new Request(
    "https://untrusted.invalid/api/ai/generate-image",
    { method: "POST", body: "{}" },
  );
  const route = load("../../../app/api/ai/generate-image/route.ts", {
    "next/server": { NextResponse: Response },
    "../../imagine/generate/route": {
      POST: async (request: Request) => {
        assert.equal(request, incoming);
        return Response.json({ reason: "unauthenticated" }, { status: 401 });
      },
    },
  });
  const response = await route.POST(incoming);
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
});
test("animation validates requests, denies missing accounts and credit, and maps pending recovery without provider work", async () => {
  for (const scenario of [
    "malformed",
    "anonymous",
    "depleted",
    "pending",
    "conflict",
    "complete",
  ]) {
    let providers = 0;
    const requestKey = "00000000-0000-0000-0000-000000000001";
    const route = load("../../../app/api/imagine/animate/route.ts", {
      "node:crypto": {
        createHash: () => ({ update: () => ({ digest: () => "hash" }) }),
      },
      "next/server": { NextResponse: Response },
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: {
            getUser: async () => ({
              error: null,
              data: {
                user: scenario === "anonymous" ? null : { id: "user-a" },
              },
            }),
          },
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
          input: { amount: number; action: string; userId: string },
          work: (
            reference: string,
          ) => Promise<{ result: unknown; actualCredits: number }>,
        ) => {
          assert.equal(input.amount, costFor("video.clip", 1));
          assert.equal(input.action, "video.clip");
          assert.equal(input.userId, "user-a");
          if (scenario === "depleted")
            throw new InsufficientCreditsError(input.amount, 0);
          if (scenario === "pending")
            throw new OperationPendingError("user-a:" + requestKey);
          if (scenario === "conflict") throw new OperationConflictError();
          const outcome = await work("user-a:" + requestKey);
          return {
            result: outcome.result,
            charged: outcome.actualCredits,
            account: { balance: 10 },
          };
        },
      },
      "@/lib/imagine/video-jobs": {
        checkpointVideoJob: async () => {},
        readVideoJob: async () => null,
      },
      "@/lib/imagine/video": {
        videoProvider: () => "grok-video",
        generateVideo: async () => {
          providers++;
          return {
            videoUrl: "https://vidgen.x.ai/result.mp4",
            provider: "grok-video",
          };
        },
      },
      "@/lib/imagine/video-admission": {
        isHttpsImageUrl: (url: unknown) =>
          typeof url === "string" && url.startsWith("https:"),
        MAX_ANIMATION_PROMPT_LENGTH: 1000,
      },
    });
    const response = await route.POST(
      new Request("https://www.arcanea.ai/api/imagine/animate", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: "https://images.test/frame.png",
          ...(scenario === "malformed" ? {} : { requestKey }),
        }),
      }),
    );
    const status = {
      malformed: 400,
      anonymous: 401,
      depleted: 402,
      pending: 409,
      conflict: 409,
      complete: 200,
    }[scenario];
    assert.equal(response.status, status, scenario);
    assert.equal(providers, scenario === "complete" ? 1 : 0, scenario);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
});
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
      "@/lib/imagine/video-jobs": {
        checkpointImageJob: async () => {
          throw Error("Unexpected checkpoint");
        },
        readImageJob: async () => {
          throw Error("Unexpected recovery");
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
  for (const model of [
    "unknown/expensive",
    "fixture/quality",
    "fixture/oversized",
  ]) {
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
      "@/lib/imagine/video-jobs": {
        checkpointImageJob: async () => {
          throw Error("Unexpected checkpoint");
        },
        readImageJob: async () => {
          throw Error("Unexpected recovery");
        },
      },
      "@/lib/imagine/generate": {
        OPENROUTER_IMAGE_MODELS: [
          { id: "fixture/quality", tier: "quality" },
          { id: "fixture/oversized", tier: "quality" },
        ],
        generateImages: async () => {
          providers++;
          return {
            provider: "openrouter",
            model,
            images: [
              {
                url: model.endsWith("oversized")
                  ? "data:image/png;base64," + "A".repeat(3 * 1024 * 1024)
                  : "data:image/png;base64,UNIQUE_IMAGE_BYTES",
              },
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
          let completed;
          try {
            completed = await work();
          } catch (error) {
            if (error instanceof OperationPendingError) throw error;
            throw new OperationFailedError();
          }
          const { result, actualCredits } = completed;
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
    assert.equal(
      res.status,
      model.startsWith("unknown")
        ? 400
        : model.endsWith("oversized")
          ? 409
          : 200,
    );
    if (res.ok) {
      const response = await res.json();
      assert.equal(reserved, costFor("image.premium"));
      assert.equal(response.images.length, 1);
      assert.equal(
        JSON.stringify(response).split("UNIQUE_IMAGE_BYTES").length - 1,
        1,
      );
      assert.equal(response.assetUrls, undefined);
      assert.equal(response.assets, undefined);
      assert.equal(response.credits.charged, reserved);
    } else assert.equal(providers, model.endsWith("oversized") ? 1 : 0);
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

test("the actual image handler admits once and recovers only an actor-bound checkpoint", async () => {
  const requestKey = "00000000-0000-0000-0000-000000000001";
  for (const scenario of [
    "anonymous",
    "depleted",
    "initial",
    "recover",
    "pending",
    "oversized",
  ]) {
    let submissions = 0;
    let recoveries = 0;
    let checkpoints = 0;
    const generated = {
      provider: "grok",
      model: "grok-imagine-image-2.0",
      images: [
        {
          url:
            scenario === "oversized"
              ? "x".repeat(3 * 1024 * 1024)
              : "https://images.test/image.png",
        },
      ],
    };
    const savedJob = {
      provider: "grok",
      requestId: "accepted-1",
      model: generated.model,
      count: 1,
    };
    const route = load("../../../app/api/imagine/generate/route.ts", {
      "node:crypto": {
        createHash: () => ({
          update: () => ({ digest: () => "image-fingerprint" }),
        }),
      },
      "next/server": { NextResponse: Response },
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: {
            getUser: async () => ({
              data: {
                user: scenario === "anonymous" ? null : { id: "user-a" },
              },
            }),
          },
        }),
      },
      "@/lib/imagine/enhance-image-prompt": {
        enhanceImagePrompt: async () => {
          throw Error("Recovery must not enhance again");
        },
      },
      "@/lib/imagine/styles": { applyStyle: (prompt: string) => ({ prompt }) },
      "@/lib/billing/catalog": { costFor },
      "@/lib/imagine/generate": {
        OPENROUTER_IMAGE_MODELS: [],
        generateImages: async (
          _options: unknown,
          runtime: {
            reference: string;
            checkpoint: (job: unknown) => Promise<void>;
          },
        ) => {
          submissions++;
          assert.equal(runtime.reference, "user-a:" + requestKey);
          await runtime.checkpoint(savedJob);
          return generated;
        },
        resumeImages: async (job: unknown, runtime: { reference: string }) => {
          recoveries++;
          assert.deepEqual(job, savedJob);
          assert.equal(runtime.reference, "user-a:" + requestKey);
          if (scenario === "pending")
            throw new OperationPendingError(runtime.reference);
          return generated;
        },
      },
      "@/lib/imagine/video-jobs": {
        checkpointImageJob: async (
          userId: string,
          reference: string,
          job: unknown,
        ) => {
          checkpoints++;
          assert.equal(userId, "user-a");
          assert.equal(reference, "user-a:" + requestKey);
          assert.deepEqual(job, savedJob);
        },
        readImageJob: async (userId: string, reference: string) => {
          assert.equal(userId, "user-a");
          assert.equal(reference, "user-a:" + requestKey);
          return savedJob;
        },
      },
      "@/lib/billing/ledger": {
        BillingError,
        InsufficientCreditsError,
        OperationPendingError,
        OperationConflictError,
        OperationFailedError,
        withReservation: async (
          input: { amount: number; userId: string; requestKey: string },
          work: (
            reference: string,
          ) => Promise<{ result: unknown; actualCredits: number }>,
          recover: (
            reference: string,
          ) => Promise<{ result: unknown; actualCredits: number }>,
        ) => {
          assert.equal(input.userId, "user-a");
          assert.equal(input.requestKey, requestKey);
          assert.equal(input.amount, costFor("image.standard", 1));
          if (scenario === "depleted")
            throw new InsufficientCreditsError(input.amount, 0);
          const output = await (
            ["recover", "pending"].includes(scenario) ? recover : work
          )("user-a:" + requestKey);
          assert.equal(output.actualCredits, costFor("image.standard", 1));
          return {
            result: output.result,
            charged: output.actualCredits,
            account: { balance: 10 },
          };
        },
      },
    });
    const response = await route.POST(
      new Request("https://www.arcanea.ai/api/imagine/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: "A lighthouse",
          requestKey,
          count: 1,
          provider: "grok",
        }),
      }),
    );
    const expected = {
      anonymous: 401,
      depleted: 402,
      initial: 200,
      recover: 200,
      pending: 409,
      oversized: 409,
    };
    assert.equal(
      response.status,
      expected[scenario as keyof typeof expected],
      scenario,
    );
    assert.equal(
      submissions,
      ["initial", "oversized"].includes(scenario) ? 1 : 0,
    );
    assert.equal(checkpoints, submissions);
    assert.equal(recoveries, ["recover", "pending"].includes(scenario) ? 1 : 0);
    const receipt = await response.json();
    if (response.status === 200) {
      assert.equal(receipt.generationId, "gen_" + requestKey);
      assert.equal(receipt.safety.fallbackUsed, false);
    }
    if (response.status === 409)
      assert.equal(receipt.reason, "operation_pending");
  }
});
