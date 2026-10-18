// Actual generation route; Auth, ledger and provider are isolated seams.
// No keys, provider calls or real credit reservation are exercised.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("../../node_modules/typescript");
const {
  NextRequest,
  NextResponse,
} = require("../../apps/web/node_modules/next/server");
const { createHash, randomUUID } = require("node:crypto");
const alice = "00000000-0000-4000-8000-000000000001";
const bob = "00000000-0000-4000-8000-000000000002";

function subject(actor) {
  const calls = { reservations: [], generations: 0, costs: 0 };
  const imports = {
    "node:crypto": { createHash },
    "next/server": { NextResponse },
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: actor ? { id: actor } : null },
          }),
        },
      }),
    },
    "@/lib/imagine/generate": {
      OPENROUTER_IMAGE_MODELS: [{ id: "test/model", tier: "fast" }],
      generateImages: async () => {
        calls.generations++;
        return {
          provider: "openrouter",
          model: "test/model",
          images: [{ url: "data:image/png;base64,iVBORw0KGgo=" }],
        };
      },
    },
    "@/lib/imagine/video-jobs": {},
    "@/lib/imagine/enhance-image-prompt": {},
    "@/lib/imagine/styles": { applyStyle: (prompt) => ({ prompt }) },
    "@/lib/billing/catalog": {
      costFor: (_, count) => {
        calls.costs++;
        return count;
      },
    },
    "@/lib/billing/ledger": {
      withReservation: async (input, generate) => {
        calls.reservations.push(input);
        const output = await generate("test-reference");
        return {
          result: output.result,
          charged: output.actualCredits,
          account: { balance: 99 },
        };
      },
      ...Object.fromEntries(
        [
          "BillingError",
          "OperationPendingError",
          "OperationConflictError",
          "OperationFailedError",
          "InsufficientCreditsError",
        ].map((name) => [name, class extends Error {}]),
      ),
    },
  };
  const source = fs.readFileSync(
    path.join(__dirname, "../../apps/web/app/api/imagine/generate/route.ts"),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
    Buffer,
    Date,
    console,
  })(
    (name) => {
      assert.ok(Object.hasOwn(imports, name), name);
      return imports[name];
    },
    module,
    module.exports,
  );
  return { ...module.exports, calls };
}
function request(expectedActor) {
  return new NextRequest("https://www.arcanea.ai/api/imagine/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "The river carried a silver bowl.",
      count: 1,
      requestKey: randomUUID(),
      model: "test/model",
      provider: "openrouter",
      expectedActor,
    }),
  });
}

test("a scene from A cannot reserve B's credits while its SDK still reports A", async () => {
  const s = subject(bob);
  const response = await s.POST(request(alice));
  assert.equal(response.status, 403);
  assert.equal((await response.json()).reason, "account_changed");
  assert.deepEqual(s.calls, { reservations: [], generations: 0, costs: 0 });
});

test("malformed actor assertions fail before credit or provider admission", async () => {
  for (const actor of [null, "", 1, {}, []]) {
    const s = subject(alice);
    assert.equal((await s.POST(request(actor))).status, 403);
    assert.deepEqual(s.calls, { reservations: [], generations: 0, costs: 0 });
  }
});

test("a matching actor and existing callers use the authenticated ledger owner", async () => {
  for (const actor of [alice, undefined]) {
    const s = subject(alice);
    assert.equal((await s.POST(request(actor))).status, 200);
    assert.equal(s.calls.reservations.length, 1);
    assert.equal(s.calls.reservations[0].userId, alice);
    assert.equal(s.calls.generations, 1);
  }
});

test("an actor assertion cannot authenticate an anonymous request", async () => {
  const s = subject(null);
  assert.equal((await s.POST(request(alice))).status, 401);
  assert.deepEqual(s.calls, { reservations: [], generations: 0, costs: 0 });
});
