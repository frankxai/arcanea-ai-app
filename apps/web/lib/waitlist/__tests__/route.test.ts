import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// store.ts reads the KV env at import time, so env is set before the dynamic import.
process.env.KV_REST_API_URL = "https://kv.test.invalid";
process.env.KV_REST_API_TOKEN = "test-token";
process.env.WAITLIST_TOKEN_SECRET = "test-secret-at-least-32-characters-long";
delete process.env.RESEND_API_KEY;
delete process.env.RESEND_AUDIENCE_ID;

type Kv = {
  strings: Map<string, string>;
  hashes: Map<string, Map<string, string>>;
};

/** Minimal Upstash REST fake covering the commands the waitlist issues. */
function kvFetch(kv: Kv, calls: string[][]) {
  return async (_url: string | URL | Request, init?: RequestInit) => {
    const args = JSON.parse(String(init?.body)) as string[];
    calls.push(args);
    const [cmd, key, field, value] = args;
    const hash = kv.hashes.get(key) ?? new Map<string, string>();
    kv.hashes.set(key, hash);
    let result: unknown = null;
    if (cmd === "get") result = kv.strings.get(key) ?? null;
    if (cmd === "incr") {
      const next = Number(kv.strings.get(key) ?? 0) + 1;
      kv.strings.set(key, String(next));
      result = next;
    }
    if (cmd === "expire") result = 1;
    if (cmd === "hget") result = hash.get(field) ?? null;
    if (cmd === "hset") {
      hash.set(field, value);
      result = 1;
    }
    if (cmd === "hdel") result = hash.delete(field) ? 1 : 0;
    if (cmd === "eval") {
      const [positionsKey, countKey, signalsKey, email, json] = args.slice(3);
      const positions =
        kv.hashes.get(positionsKey) ?? new Map<string, string>();
      const saved = kv.hashes.get(signalsKey) ?? new Map<string, string>();
      kv.hashes.set(positionsKey, positions);
      kv.hashes.set(signalsKey, saved);
      const existing = positions.get(email);
      if (existing) result = [Number(existing), 0];
      else {
        const pos = Number(kv.strings.get(countKey) ?? 0) + 1;
        kv.strings.set(countKey, String(pos));
        positions.set(email, String(pos));
        saved.set(email, json.replace('"__POS__"', String(pos)));
        result = [pos, 1];
      }
    }
    return new Response(JSON.stringify({ result }), { status: 200 });
  };
}

const post = (body: unknown, ip = "198.51.100.7") =>
  new Request("https://www.arcanea.ai/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const valid = {
  productId: "arcanea-subscription",
  email: "  Reader@Example.COM ",
  consent: true,
  source: "/waitlist",
};

const loadRoute = () => import("../../../app/api/waitlist/route");
const signals = (kv: Kv, product = "arcanea-subscription") =>
  kv.hashes.get(`waitlist:${product}:signals`);

let kv: Kv;
let calls: string[][];
beforeEach(() => {
  process.env.KV_REST_API_URL = "https://kv.test.invalid";
  process.env.KV_REST_API_TOKEN = "test-token";
  kv = { strings: new Map(), hashes: new Map() };
  calls = [];
});

test("valid anonymous POST is stored once, under the normalised email", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { POST } = await loadRoute();
  const res = await POST(post(valid));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("cache-control"), "no-store");
  const out = await res.json();
  assert.equal(out.productId, "arcanea-subscription");
  assert.equal(out.position, 1);
  assert.equal(out.publicCount, null, "count stays withheld below threshold");
  const stored = signals(kv);
  assert.ok(stored?.has("reader@example.com"));
  assert.equal(stored?.size, 1);
});

test("invalid bodies are refused with 400 before any store call", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { POST } = await loadRoute();
  const cases: unknown[] = [
    "{not json",
    [],
    { ...valid, email: undefined },
    { ...valid, consent: "yes" },
    { ...valid, priceBand: "a-million" },
    { ...valid, isAdmin: true },
    { ...valid, email: 42 },
  ];
  for (const body of cases) {
    const res = await POST(post(body));
    assert.equal(res.status, 400, JSON.stringify(body));
    assert.deepEqual(await res.json(), { error: "Invalid request" });
  }
  assert.equal(calls.length, 0);
});

test("semantic checks still run: bad email, no consent and unknown product never store", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { POST } = await loadRoute();
  assert.equal(
    (await POST(post({ ...valid, email: "not-an-email" }))).status,
    400,
  );
  assert.equal((await POST(post({ ...valid, consent: false }))).status, 400);
  assert.equal(
    (await POST(post({ ...valid, productId: "arcanea-pro" }))).status,
    404,
  );
  assert.equal(signals(kv)?.size ?? 0, 0);
});

test("oversized bodies are refused with 413", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { POST } = await loadRoute();
  const res = await POST(post({ ...valid, pain: "x".repeat(5000) }));
  assert.equal(res.status, 413);

  // No Content-Length: a streamed body is cut off at the cap, never buffered whole.
  let pulled = 0;
  const endless = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulled++;
      controller.enqueue(new Uint8Array(1024).fill(32));
    },
  });
  // Node's fetch requires duplex for stream bodies; DOM RequestInit lacks the key.
  const init = { method: "POST", body: endless, duplex: "half" };
  const chunked = new Request(
    "https://www.arcanea.ai/api/waitlist",
    init as RequestInit,
  );
  assert.equal(chunked.headers.get("content-length"), null);
  const cut = await POST(chunked);
  assert.equal(cut.status, 413);
  assert.ok(pulled <= 8, `stopped reading after ${pulled} KB`);
  assert.equal(calls.length, 0);
});

test("a filled honeypot is refused, not stored, and never reported as success", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { POST } = await loadRoute();
  const res = await POST(
    post({ ...valid, company_website: "https://spam.test" }),
  );
  assert.equal(res.status, 400);
  assert.equal(
    calls.length,
    0,
    "no KV call, so a bot cannot even burn the limiter",
  );
  const empty = await POST(post({ ...valid, company_website: "" }));
  assert.equal(
    empty.status,
    200,
    "an untouched honeypot does not block a human",
  );
});

test("the sixth POST from one IP in a window gets 429 with Retry-After", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  const { POST } = await loadRoute();
  for (let i = 0; i < 5; i++) {
    const res = await POST(
      post({ ...valid, email: `r${i}@example.com` }, "203.0.113.5"),
    );
    assert.equal(res.status, 200, `request ${i + 1}`);
  }
  const blocked = await POST(
    post({ ...valid, email: "r5@example.com" }, "203.0.113.5"),
  );
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
  assert.equal(signals(kv)?.has("r5@example.com"), false);
  const otherIp = await POST(
    post({ ...valid, email: "r6@example.com" }, "203.0.113.6"),
  );
  assert.equal(otherIp.status, 200, "the limit is per IP, not global");
});

test("missing store env returns an honest 503, never a fake success", async (t) => {
  t.mock.method(globalThis, "fetch", kvFetch(kv, calls));
  t.mock.method(console, "error", () => {});
  delete process.env.KV_REST_API_TOKEN;
  const { POST } = await loadRoute();
  const res = await POST(post(valid));
  assert.equal(res.status, 503);
  const out = await res.json();
  assert.match(out.error, /not saved/);
  assert.equal(calls.length, 0);
});

test("no log line carries the raw email", async (t) => {
  const lines: string[] = [];
  t.mock.method(console, "error", (...args: unknown[]) =>
    lines.push(args.map(String).join(" ")),
  );
  t.mock.method(console, "warn", (...args: unknown[]) =>
    lines.push(args.map(String).join(" ")),
  );
  t.mock.method(console, "log", (...args: unknown[]) =>
    lines.push(args.map(String).join(" ")),
  );
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("boom", { status: 500 }),
  );
  const { POST } = await loadRoute();
  const res = await POST(
    post({ ...valid, email: "secret.person@example.com" }),
  );
  assert.equal(res.status, 503);
  assert.ok(lines.length > 0, "the failure is logged");
  assert.ok(
    lines.every((l) => !l.includes("secret.person")),
    lines.join("\n"),
  );
});
