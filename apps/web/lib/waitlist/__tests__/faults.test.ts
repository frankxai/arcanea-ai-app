import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Fault-injection repros from the adversarial review of PR #422. store.ts reads
// env at import time, so everything is set before the dynamic import.
process.env.KV_REST_API_URL = "https://kv.test.invalid";
process.env.KV_REST_API_TOKEN = "test-token";
process.env.RESEND_API_KEY = "re_test";
process.env.RESEND_AUDIENCE_ID = "aud_test";
process.env.WAITLIST_TOKEN_SECRET = "test-secret-at-least-32-characters-long";

type Store = {
  strings: Map<string, string>;
  hashes: Map<string, Map<string, string>>;
};
type Fault = (cmd: string[], url: string) => Response | "throw" | undefined;

const tick = () => new Promise((resolve) => setImmediate(resolve));
const envelope = (result: unknown) =>
  new Response(JSON.stringify({ result }), { status: 200 });

function hash(store: Store, key: string) {
  const h = store.hashes.get(key) ?? new Map<string, string>();
  store.hashes.set(key, h);
  return h;
}

/**
 * In-memory Upstash REST. EVAL runs the join script's semantics in one
 * synchronous step, which is what Redis guarantees for a Lua script.
 */
function fakeUpstash(store: Store, fault: Fault = () => undefined) {
  const resend: { status: number; calls: number } = { status: 200, calls: 0 };
  const fetchImpl = async (
    input: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = String(input);
    await tick();
    if (url.includes("resend.com")) {
      resend.calls++;
      return new Response("{}", { status: resend.status });
    }
    const cmd = JSON.parse(String(init?.body)) as string[];
    const injected = fault(cmd, url);
    if (injected === "throw") throw new Error("ECONNRESET");
    if (injected) return injected;
    const [name, key, a, b] = cmd;
    switch (name.toLowerCase()) {
      case "get":
        return envelope(store.strings.get(key) ?? null);
      case "incr": {
        const next = Number(store.strings.get(key) ?? 0) + 1;
        store.strings.set(key, String(next));
        return envelope(next);
      }
      case "expire":
        return envelope(1);
      case "hget":
        return envelope(hash(store, key).get(a) ?? null);
      case "hset":
        hash(store, key).set(a, b);
        return envelope(1);
      case "hdel":
        return envelope(hash(store, key).delete(a) ? 1 : 0);
      case "eval": {
        const [
          ,
          ,
          ,
          positionsKey,
          countKey,
          signalsKey,
          email,
          json,
          allowUpdate,
        ] = cmd;
        const existing = hash(store, positionsKey).get(email);
        if (existing) {
          if (allowUpdate === "1")
            hash(store, signalsKey).set(
              email,
              json.replace('"__POS__"', existing),
            );
          return envelope([Number(existing), 0]);
        }
        const pos = Number(store.strings.get(countKey) ?? 0) + 1;
        store.strings.set(countKey, String(pos));
        hash(store, positionsKey).set(email, String(pos));
        hash(store, signalsKey).set(
          email,
          json.replace('"__POS__"', String(pos)),
        );
        return envelope([pos, 1]);
      }
      default:
        return new Response(
          JSON.stringify({ error: `ERR unknown command ${name}` }),
          { status: 400 },
        );
    }
  };
  return { fetchImpl, resend };
}

const NOW = Date.UTC(2026, 8, 15, 0, 1, 40);
const req = (ip = "203.0.113.20") =>
  new Request("https://www.arcanea.ai/api/waitlist", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
const load = () => import("../join");
const join = (email = "fan@example.com") => ({
  productId: "arcanea-mcp",
  email,
  consent: true,
  source: "/pricing",
});
const count = (store: Store) =>
  Number(store.strings.get("waitlist:arcanea-mcp:count") ?? 0);
const saved = (store: Store, email = "fan@example.com") => {
  const raw = store.hashes.get("waitlist:arcanea-mcp:signals")?.get(email);
  return raw ? JSON.parse(raw) : undefined;
};
const tokenOf = (body: unknown) =>
  (body as { updateToken?: string }).updateToken;

let store: Store;
beforeEach(() => {
  process.env.WAITLIST_TOKEN_SECRET = "test-secret-at-least-32-characters-long";
  store = { strings: new Map(), hashes: new Map() };
});

test("P1: an Upstash error envelope on HTTP 200 is a failure, not a signup", async (t) => {
  t.mock.method(console, "error", () => {});
  t.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(JSON.stringify({ error: "WRONGPASS invalid password" }), {
        status: 200,
      }),
  );
  const { joinWaitlist } = await load();
  const res = await joinWaitlist(join(), req(), NOW);
  assert.equal(res.status, 503);
});

test("P1: a limiter reply with no result fails closed instead of admitting 7 of 5", async (t) => {
  t.mock.method(console, "error", () => {});
  const { fetchImpl } = fakeUpstash(store, (cmd) =>
    cmd[0] === "incr" && cmd[1].startsWith("waitlist:rl:")
      ? new Response("{}", { status: 200 })
      : undefined,
  );
  t.mock.method(globalThis, "fetch", fetchImpl);
  const { joinWaitlist } = await load();
  const statuses: number[] = [];
  for (let i = 0; i < 7; i++) {
    statuses.push(
      (await joinWaitlist(join(`u${i}@example.com`), req(), NOW)).status,
    );
  }
  assert.deepEqual(statuses, [503, 503, 503, 503, 503, 503, 503]);
  assert.equal(count(store), 0);
});

test("P2: concurrent submits for one email claim exactly one position", async (t) => {
  const { fetchImpl } = fakeUpstash(store);
  t.mock.method(globalThis, "fetch", fetchImpl);
  const { joinWaitlist } = await load();
  const [a, b] = await Promise.all([
    joinWaitlist(join(), req("198.51.100.1"), NOW),
    joinWaitlist(join(), req("198.51.100.2"), NOW),
  ]);
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
  assert.equal(count(store), 1);
  assert.equal((a.body as { position: number }).position, 1);
  assert.equal((b.body as { position: number }).position, 1);
});

test("P2: a failed signal write does not consume a position", async (t) => {
  t.mock.method(console, "error", () => {});
  const { fetchImpl } = fakeUpstash(store, (cmd) =>
    cmd[0] === "eval" || (cmd[0] === "hset" && cmd[1].endsWith(":signals"))
      ? new Response(JSON.stringify({ error: "OOM command not allowed" }), {
          status: 200,
        })
      : undefined,
  );
  t.mock.method(globalThis, "fetch", fetchImpl);
  const { joinWaitlist } = await load();
  const res = await joinWaitlist(join(), req(), NOW);
  assert.equal(res.status, 503);
  assert.equal(count(store), 0);
  assert.equal(
    store.hashes.get("waitlist:arcanea-mcp:positions")?.size ?? 0,
    0,
  );
});

test("P2: a Resend 429 keeps a pending-delivery marker, and a later success clears it", async (t) => {
  const { fetchImpl, resend } = fakeUpstash(store);
  t.mock.method(globalThis, "fetch", fetchImpl);
  t.mock.method(console, "error", () => {});
  const { joinWaitlist } = await load();

  resend.status = 429;
  const first = await joinWaitlist(join(), req(), NOW);
  assert.equal(first.status, 200, "the signal is stored, so the signup stands");
  const pending = store.hashes.get("waitlist:arcanea-mcp:audience-pending");
  assert.ok(
    pending?.has("fan@example.com"),
    "failed delivery is recorded for retry",
  );
  assert.match(pending!.get("fan@example.com")!, /429/);

  resend.status = 200;
  await joinWaitlist(join(), req(), NOW);
  assert.equal(pending!.has("fan@example.com"), false);
});

test("P2: step-2 answers need the signed token from step 1", async (t) => {
  const { fetchImpl } = fakeUpstash(store);
  t.mock.method(globalThis, "fetch", fetchImpl);
  const { joinWaitlist } = await load();

  const step1 = await joinWaitlist(join(), req(), NOW);
  assert.equal(step1.status, 200);
  const token = tokenOf(step1.body);
  assert.equal(typeof token, "string", "step 1 returns an update token");

  const answers = { ...join(), priceBand: "25-99", role: "Agent builder" };
  assert.equal(
    (await joinWaitlist(answers, req(), NOW)).status,
    403,
    "no token",
  );
  assert.equal(
    (
      await joinWaitlist(
        {
          ...answers,
          updateToken: token!.replace(/.$/, (c) => (c === "0" ? "1" : "0")),
        },
        req(),
        NOW,
      )
    ).status,
    403,
    "tampered token",
  );
  assert.equal(
    (
      await joinWaitlist(
        { ...answers, email: "someone-else@example.com", updateToken: token },
        req(),
        NOW,
      )
    ).status,
    403,
    "token bound to another email",
  );
  assert.equal(
    (
      await joinWaitlist(
        { ...answers, updateToken: token },
        req(),
        NOW + 31 * 60 * 1000,
      )
    ).status,
    403,
    "expired token",
  );
  assert.equal(saved(store).priceBand, undefined);

  assert.equal(
    (await joinWaitlist({ ...answers, updateToken: token }, req(), NOW)).status,
    200,
  );
  assert.equal(saved(store).priceBand, "25-99");
});

test("P2: an unauthenticated rejoin cannot wipe answers, timestamp or position", async (t) => {
  const { fetchImpl } = fakeUpstash(store);
  t.mock.method(globalThis, "fetch", fetchImpl);
  const { joinWaitlist } = await load();

  const step1 = await joinWaitlist(join(), req(), NOW);
  await joinWaitlist(
    {
      ...join(),
      priceBand: "25-99",
      pain: "Scoring renders",
      updateToken: tokenOf(step1.body),
    },
    req(),
    NOW,
  );
  const before = saved(store);

  const rejoin = await joinWaitlist(
    { ...join(), source: "/elsewhere" },
    req("192.0.2.99"),
    NOW + 60_000,
  );
  assert.equal(rejoin.status, 200);
  const after = saved(store);
  assert.equal(after.priceBand, "25-99");
  assert.equal(after.pain, "Scoring renders");
  assert.equal(after.createdAt, before.createdAt);
  assert.equal(after.position, 1);
  assert.equal(after.source, "/pricing");

  const step2Again = await joinWaitlist(
    { ...join(), role: "Studio", updateToken: tokenOf(rejoin.body) },
    req(),
    NOW + 60_000,
  );
  assert.equal(step2Again.status, 200);
  const merged = saved(store);
  assert.equal(merged.role, "Studio");
  assert.equal(
    merged.priceBand,
    "25-99",
    "a partial update merges, it does not clear",
  );
});

test("P2: a missing token secret fails closed", async (t) => {
  t.mock.method(console, "error", () => {});
  const { fetchImpl } = fakeUpstash(store);
  t.mock.method(globalThis, "fetch", fetchImpl);
  delete process.env.WAITLIST_TOKEN_SECRET;
  const { joinWaitlist } = await load();
  assert.equal((await joinWaitlist(join(), req(), NOW)).status, 503);
  assert.equal(count(store), 0);
});
