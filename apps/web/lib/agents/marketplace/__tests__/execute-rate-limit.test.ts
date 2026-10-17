import test from "node:test";
import assert from "node:assert/strict";
import {
  RATE_KEY_PREFIX,
  checkExecuteRateLimit,
  sharedStoreConfig,
} from "../execute-rate-limit";

const WINDOW = { maxRequests: 3, windowMs: 60_000 };
const ENV = {
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io/",
  UPSTASH_REDIS_REST_TOKEN: "t",
};

/** A fake Upstash pipeline endpoint with a real atomic counter per key. */
function fakeUpstash() {
  const counts = new Map<string, number>();
  const calls: Array<{ url: string; body: unknown[][]; auth: string | null }> =
    [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    const body = JSON.parse(String(init.body)) as unknown[][];
    calls.push({
      url,
      body,
      auth: (init.headers as Record<string, string>).Authorization ?? null,
    });
    const key = String(body[0][1]);
    const next = (counts.get(key) ?? 0) + 1;
    counts.set(key, next);
    return new Response(JSON.stringify([{ result: next }, { result: 1 }]), {
      status: 200,
    });
  }) as unknown as typeof fetch;
  return { fetchImpl, calls, counts };
}

test("shared store: counts across callers, then limits, with a namespaced key", async () => {
  const up = fakeUpstash();
  const now = () => 1_000_000;
  const out = [];
  for (let i = 0; i < 5; i++) {
    out.push(
      await checkExecuteRateLimit("ip:1.2.3.4", WINDOW, {
        env: ENV,
        fetchImpl: up.fetchImpl,
        now,
      }),
    );
  }
  assert.deepEqual(
    out.map((o) => o.status),
    ["allowed", "allowed", "allowed", "limited", "limited"],
  );
  const limited = out[3];
  assert.equal(limited.status === "limited" && limited.store, "shared");
  assert.equal(
    limited.status === "limited" && limited.retryAfterSec >= 1,
    true,
  );
  const key = String(up.calls[0].body[0][1]);
  assert.ok(key.startsWith(`${RATE_KEY_PREFIX}ip:1.2.3.4:`));
  assert.equal(up.calls[0].url, "https://example.upstash.io/pipeline");
  assert.equal(up.calls[0].auth, "Bearer t");
});

test("shared store: a new window starts from zero", async () => {
  const up = fakeUpstash();
  const a = await checkExecuteRateLimit("u", WINDOW, {
    env: ENV,
    fetchImpl: up.fetchImpl,
    now: () => 0,
  });
  const b = await checkExecuteRateLimit("u", WINDOW, {
    env: ENV,
    fetchImpl: up.fetchImpl,
    now: () => 61_000,
  });
  assert.equal(a.status === "allowed" && a.remaining, 2);
  assert.equal(b.status === "allowed" && b.remaining, 2);
});

test("fails closed when the store is unreachable, errors or answers garbage", async () => {
  const boom = (async () => {
    throw new Error("network");
  }) as unknown as typeof fetch;
  const bad = (async () =>
    new Response("no", { status: 500 })) as unknown as typeof fetch;
  const junk = (async () =>
    new Response(JSON.stringify([{ result: "x" }]), {
      status: 200,
    })) as unknown as typeof fetch;
  for (const fetchImpl of [boom, bad, junk]) {
    const r = await checkExecuteRateLimit("u", WINDOW, { env: ENV, fetchImpl });
    assert.equal(r.status, "unavailable");
  }
});

test("fails closed when no shared store is configured, unless local is accepted", async () => {
  const local = () => ({ allowed: true, resetTime: 0, remaining: 2 });
  const none = await checkExecuteRateLimit("u", WINDOW, { env: {}, local });
  assert.deepEqual(none, {
    status: "unavailable",
    reason: "rate_limit_store_unconfigured",
  });
  const accepted = await checkExecuteRateLimit("u", WINDOW, {
    env: { AGENT_EXECUTE_RATE_LIMIT_LOCAL: "true" },
    local,
  });
  assert.deepEqual(accepted, {
    status: "allowed",
    remaining: 2,
    store: "local",
  });
  // A non-https store URL is not trusted.
  assert.equal(
    sharedStoreConfig({
      UPSTASH_REDIS_REST_URL: "http://x",
      UPSTASH_REDIS_REST_TOKEN: "t",
    }),
    null,
  );
});

test("the URL and token are taken as a matched pair", () => {
  // A partial Upstash binding must not borrow the KV token, or vice versa.
  assert.deepEqual(
    sharedStoreConfig({
      UPSTASH_REDIS_REST_URL: "https://up.example.io",
      KV_REST_API_URL: "https://kv.example.io/",
      KV_REST_API_TOKEN: "kv-token",
    }),
    { url: "https://kv.example.io", token: "kv-token" },
  );
  assert.deepEqual(
    sharedStoreConfig({
      UPSTASH_REDIS_REST_TOKEN: "up-token",
      KV_REST_API_URL: "https://kv.example.io",
      KV_REST_API_TOKEN: "kv-token",
    }),
    { url: "https://kv.example.io", token: "kv-token" },
  );
  assert.deepEqual(
    sharedStoreConfig({
      UPSTASH_REDIS_REST_URL: "https://up.example.io",
      UPSTASH_REDIS_REST_TOKEN: "up-token",
      KV_REST_API_URL: "https://kv.example.io",
      KV_REST_API_TOKEN: "kv-token",
    }),
    { url: "https://up.example.io", token: "up-token" },
  );
  assert.equal(
    sharedStoreConfig({ UPSTASH_REDIS_REST_URL: "https://up.example.io" }),
    null,
  );
});
