import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { registerHooks } from "node:module";
import { after, mock, test } from "node:test";

// Exercise the real route, guard and shared limiter. Only external framework,
// identity, catalog and provider boundaries are fixtures; no model can run.
const web = new URL("../../../../", import.meta.url);
const limiterUrl = new URL("lib/rate-limit/rate-limiter.ts", web).href;
const guardUrl = new URL("lib/agents/marketplace/execute-guard.ts", web).href;
const fixtures = {
  "next/server": `export const NextRequest = Request;
    export const NextResponse = { json: (body, init) => Response.json(body, init) };`,
  "@ai-sdk/google": `export const createGoogleGenerativeAI = () => { throw Error("Unexpected provider call"); };`,
  "@ai-sdk/anthropic": `export const createAnthropic = () => { throw Error("Unexpected provider call"); };`,
  "@ai-sdk/openai": `export const createOpenAI = () => { throw Error("Unexpected provider call"); };`,
  ai: `export const stepCountIs = () => { throw Error("Unexpected provider call"); };
    export const streamText = () => { throw Error("Unexpected provider call"); };`,
  "@/lib/agents/marketplace/catalog": `export const CATALOG_BY_ID = {
    fixture: { id: "fixture", name: "Fixture", priceCredits: 1, spec: {} }
  };`,
  "@/lib/gateway/catalog": `export const GATEWAY_MODELS = {};
    export const EXTENDED_PROVIDERS = {};
    export const claudeRejectsSamplingParams = () => false;`,
  "@/lib/luminors/config": `export const LUMINORS = {};`,
  "@/lib/ai/claude-safeguards": `export const refusalNoticeTransform = () => {
    throw Error("Unexpected provider call");
  };`,
  "@supabase/supabase-js": `export const createClient = () => ({
    auth: { getUser: async () => ({ data: { user: { id: globalThis.executeTestUser } } }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({
      data: { balance: 0 }, error: null
    }) }) }) })
  });`,
};
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/rate-limit/rate-limiter") {
      return { url: limiterUrl, shortCircuit: true };
    }
    if (specifier === "@/lib/agents/marketplace/execute-guard") {
      return { url: guardUrl, shortCircuit: true };
    }
    if (Object.hasOwn(fixtures, specifier)) {
      return {
        url: `data:text/javascript,${encodeURIComponent(fixtures[specifier])}`,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

// The production limiter's cleanup interval must not keep this test alive.
const intervals = [];
const setInterval = globalThis.setInterval;
const intervalMock = mock.method(globalThis, "setInterval", (...args) => {
  const timer = setInterval(...args);
  intervals.push(timer);
  return timer;
});
const { checkRateLimit } = await import(limiterUrl);
intervalMock.mock.restore();
const { EXECUTE_LIMITS } = await import(guardUrl);
const { POST } = await import(
  new URL("app/api/agents/[id]/execute/route.ts", web)
);
mock.method(console, "info", () => {});

const originalEnv = Object.fromEntries(
  [
    "AI_METERED_ALLOWED",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ].map((key) => [key, process.env[key]]),
);
process.env.AI_METERED_ALLOWED = "true";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://identity.fixture.invalid";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "fixture-only";
after(() => {
  for (const timer of intervals) clearInterval(timer);
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  delete globalThis.executeTestUser;
  hooks.deregister();
  mock.restoreAll();
});

function execute(ip, userId) {
  globalThis.executeTestUser = userId;
  return POST(
    new Request("https://arcanea.fixture.invalid/api/agents/fixture/execute", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
        ...(userId ? { cookie: "sb-test-auth-token=aaa.bbb.ccc" } : {}),
      },
      body: JSON.stringify({ input: "A bounded fixture task" }),
    }),
    { params: Promise.resolve({ id: "fixture" }) },
  );
}

test("unrelated IP traffic cannot exhaust the agent execution allowance", async () => {
  const ip = randomUUID();
  for (let i = 0; i < EXECUTE_LIMITS.perIp.maxRequests; i++) {
    checkRateLimit(`ip:${ip}`, EXECUTE_LIMITS.perIp);
  }
  assert.equal(checkRateLimit(`ip:${ip}`, EXECUTE_LIMITS.perIp).allowed, false);
  assert.equal(
    (await execute(ip)).status,
    401,
    "execution reaches its authentication guard",
  );
});

test("unrelated user traffic cannot exhaust the agent execution allowance", async () => {
  const userId = randomUUID();
  for (let i = 0; i < EXECUTE_LIMITS.perUser.maxRequests; i++) {
    checkRateLimit(`user:${userId}`, EXECUTE_LIMITS.perUser);
  }
  assert.equal(
    checkRateLimit(`user:${userId}`, EXECUTE_LIMITS.perUser).allowed,
    false,
  );
  assert.equal(
    (await execute(randomUUID(), userId)).status,
    402,
    "execution reaches its credit guard",
  );
});

test("execution still enforces its IP cap without consuming unrelated capacity", async () => {
  const ip = randomUUID();
  for (let i = 0; i < EXECUTE_LIMITS.perIp.maxRequests; i++) {
    assert.equal((await execute(ip)).status, 401);
  }
  const denied = await execute(ip);
  assert.equal(denied.status, 429);
  assert.ok(Number(denied.headers.get("retry-after")) > 0);
  assert.equal(checkRateLimit(`ip:${ip}`, EXECUTE_LIMITS.perIp).allowed, true);
});

test("execution still enforces its user cap across IPs without consuming unrelated capacity", async () => {
  const userId = randomUUID();
  for (let i = 0; i < EXECUTE_LIMITS.perUser.maxRequests; i++) {
    assert.equal((await execute(randomUUID(), userId)).status, 402);
  }
  const denied = await execute(randomUUID(), userId);
  assert.equal(denied.status, 429);
  assert.ok(Number(denied.headers.get("retry-after")) > 0);
  assert.equal(
    checkRateLimit(`user:${userId}`, EXECUTE_LIMITS.perUser).allowed,
    true,
  );
});
