import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// store.ts reads the KV env at import time, so env is set before the dynamic import.
process.env.KV_REST_API_URL = "https://kv.test.invalid";
process.env.KV_REST_API_TOKEN = "test-token";
delete process.env.RESEND_API_KEY;
delete process.env.RESEND_AUDIENCE_ID;

type Kv = {
  strings: Map<string, string>;
  hashes: Map<string, Map<string, string>>;
  expiries: Map<string, string>;
};

function kvFetch(kv: Kv, calls: string[]) {
  return async (url: string | URL | Request, init?: RequestInit) => {
    calls.push(String(url));
    const [cmd, key, field, value] = JSON.parse(String(init?.body)) as string[];
    const hash = kv.hashes.get(key) ?? new Map<string, string>();
    kv.hashes.set(key, hash);
    let result: unknown = null;
    if (cmd === "get") result = kv.strings.get(key) ?? null;
    if (cmd === "incr") {
      const next = Number(kv.strings.get(key) ?? 0) + 1;
      kv.strings.set(key, String(next));
      result = next;
    }
    if (cmd === "expire") {
      kv.expiries.set(key, field);
      result = 1;
    }
    if (cmd === "hget") result = hash.get(field) ?? null;
    if (cmd === "hset") {
      hash.set(field, value);
      result = 1;
    }
    return new Response(JSON.stringify({ result }), { status: 200 });
  };
}

const request = (ip?: string) =>
  new Request("https://www.arcanea.ai/api/waitlist?utm_source=test", {
    method: "POST",
    headers: ip ? { "x-forwarded-for": `${ip}, 10.0.0.1` } : {},
  });
const load = () => import("../join");
const signals = (kv: Kv, product = "arcanea-mcp") =>
  kv.hashes.get(`waitlist:${product}:signals`)?.size ?? 0;
// 2026-09-15T00:01:40Z: 100 s into a 600 s window, so 500 s remain.
const NOW = Date.UTC(2026, 8, 15, 0, 1, 40);

let kv: Kv;
beforeEach(() => {
  process.env.KV_REST_API_URL = "https://kv.test.invalid";
  process.env.KV_REST_API_TOKEN = "test-token";
  kv = { strings: new Map(), hashes: new Map(), expiries: new Map() };
});

test("registry carries both Arcanea waitlists with enabled lists", async () => {
  const { findProduct } = await load();
  for (const id of ["arcanea-subscription", "arcanea-mcp"]) {
    const product = findProduct(id);
    assert.ok(product, id);
    assert.equal(product.waitlist.enabled, true);
  }
  assert.equal(findProduct("arcanea-pro"), undefined);
});

test("fails closed with 503 and never reports success when KV env is missing", async (t) => {
  const calls: string[] = [];
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  t.mock.method(console, "error", () => {});
  delete process.env.KV_REST_API_URL;
  const { joinWaitlist, UNAVAILABLE } = await load();
  const res = await joinWaitlist(
    { productId: "arcanea-mcp", email: "a@example.com", consent: true },
    request(),
  );
  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { error: UNAVAILABLE });
  assert.equal(calls.length, 0);
});

test("fails closed with 503 when the KV store errors", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("boom", { status: 500 }),
  );
  t.mock.method(console, "error", () => {});
  const { joinWaitlist, UNAVAILABLE } = await load();
  const res = await joinWaitlist(
    { productId: "arcanea-mcp", email: "a@example.com", consent: true },
    request(),
  );
  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { error: UNAVAILABLE });
});

test("limiter store unavailable refuses with 503 and writes no signal", async (t) => {
  const calls: string[] = [];
  const store = kvFetch(kv, calls);
  t.mock.method(
    globalThis,
    "fetch",
    async (url: string, init?: RequestInit) => {
      const [cmd, key] = JSON.parse(String(init?.body)) as string[];
      if (cmd === "incr" && key.startsWith("waitlist:rl:"))
        throw new Error("ECONNRESET");
      return store(url, init);
    },
  );
  t.mock.method(console, "error", () => {});
  const { joinWaitlist, UNAVAILABLE } = await load();
  const res = await joinWaitlist(
    { productId: "arcanea-mcp", email: "a@example.com", consent: true },
    request("203.0.113.9"),
    NOW,
  );
  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { error: UNAVAILABLE });
  assert.equal(res.headers, undefined);
  assert.equal(signals(kv), 0);
});

test("rejects unknown products, bad email and missing consent before storing a signal", async (t) => {
  const calls: string[] = [];
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { joinWaitlist } = await load();
  assert.equal(
    (
      await joinWaitlist(
        { productId: "nope", email: "a@example.com", consent: true },
        request(),
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await joinWaitlist(
        { productId: "arcanea-mcp", email: "not-an-email", consent: true },
        request(),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await joinWaitlist(
        { productId: "arcanea-mcp", email: "a@example.com" },
        request(),
      )
    ).status,
    400,
  );
  assert.equal((await joinWaitlist(null, request())).status, 400);
  assert.equal(signals(kv), 0);
});

test("stores the signal, keeps position on re-submit, withholds the count below threshold", async (t) => {
  const calls: string[] = [];
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { joinWaitlist } = await load();

  const first = await joinWaitlist(
    {
      productId: "arcanea-mcp",
      email: "Maker@Example.com",
      consent: true,
      source: "/pricing",
    },
    request(),
    NOW,
  );
  assert.equal(first.status, 200);
  assert.ok("position" in first.body);
  assert.equal(first.body.position, 1);
  assert.equal(first.body.publicCount, null);
  assert.equal(first.body.foundingSeatsLeft, 99);

  const second = await joinWaitlist(
    {
      productId: "arcanea-mcp",
      email: "maker@example.com",
      consent: true,
      priceBand: "25-99",
      role: "Agent builder",
    },
    request(),
    NOW,
  );
  assert.equal(second.status, 200);
  assert.ok("position" in second.body);
  assert.equal(second.body.position, 1);

  const stored = JSON.parse(
    kv.hashes.get("waitlist:arcanea-mcp:signals")!.get("maker@example.com")!,
  );
  assert.equal(stored.priceBand, "25-99");
  assert.deepEqual(stored.utm, { utm_source: "test" });
  assert.ok(calls.every((url) => !url.includes("resend.com")));
});

test("sixth request from one IP in a window gets 429 with Retry-After and is not stored", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, []));
  const { joinWaitlist, MAX_PER_IP, RATE_LIMITED, RATE_WINDOW_SECONDS } =
    await load();

  for (let i = 0; i < MAX_PER_IP; i++) {
    const ok = await joinWaitlist(
      {
        productId: "arcanea-mcp",
        email: `user${i}@example.com`,
        consent: true,
      },
      request("203.0.113.7"),
      NOW,
    );
    assert.equal(ok.status, 200, `request ${i + 1}`);
  }
  const blocked = await joinWaitlist(
    { productId: "arcanea-mcp", email: "user9@example.com", consent: true },
    request("203.0.113.7"),
    NOW,
  );
  assert.equal(blocked.status, 429);
  assert.deepEqual(blocked.body, { error: RATE_LIMITED });
  assert.equal(blocked.headers?.["Retry-After"], "500");
  assert.equal(signals(kv), MAX_PER_IP);

  const rateKeys = [...kv.strings.keys()].filter((k) =>
    k.startsWith("waitlist:rl:"),
  );
  assert.ok(
    rateKeys.every(
      (k) => !k.includes("203.0.113.7") && !k.includes("example.com"),
    ),
    "no raw IP or email in keys",
  );
  assert.ok(
    rateKeys.every((k) => kv.expiries.get(k) === String(RATE_WINDOW_SECONDS)),
    "every window expires",
  );

  const otherIp = await joinWaitlist(
    { productId: "arcanea-mcp", email: "user9@example.com", consent: true },
    request("198.51.100.4"),
    NOW,
  );
  assert.equal(otherIp.status, 200);

  const nextWindow = await joinWaitlist(
    { productId: "arcanea-mcp", email: "user10@example.com", consent: true },
    request("203.0.113.7"),
    NOW + RATE_WINDOW_SECONDS * 1000,
  );
  assert.equal(nextWindow.status, 200);
});

test("one email hammered from rotating IPs is capped by the hashed-email bucket", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, []));
  const { joinWaitlist, MAX_PER_EMAIL } = await load();

  for (let i = 0; i < MAX_PER_EMAIL; i++) {
    const ok = await joinWaitlist(
      {
        productId: "arcanea-subscription",
        email: "Loop@Example.com",
        consent: true,
      },
      request(`192.0.2.${i + 1}`),
      NOW,
    );
    assert.equal(ok.status, 200, `request ${i + 1}`);
  }
  const blocked = await joinWaitlist(
    {
      productId: "arcanea-subscription",
      email: "loop@example.com",
      consent: true,
    },
    request("192.0.2.200"),
    NOW,
  );
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers?.["Retry-After"], "500");
});

test("first-paint state is undefined when unconfigured, never a number", async (t) => {
  const calls: string[] = [];
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  delete process.env.KV_REST_API_TOKEN;
  const { readWaitlistState } = await load();
  assert.equal(await readWaitlistState("arcanea-subscription"), undefined);
  assert.equal(calls.length, 0);
});
