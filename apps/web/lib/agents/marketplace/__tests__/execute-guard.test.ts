import test from "node:test";
import assert from "node:assert/strict";
import {
  EXECUTE_LIMITS,
  DEFAULT_EXECUTE_MODEL,
  checkCreditsFailClosed,
  FREE_TOOL_NAMES,
  reserveCredits,
  refundCredits,
  classifyAuthError,
  isHeaderSafeId,
  checkInputCaps,
  checkPromptCap,
  extractAccessToken,
  learningEnabled,
  onlyFreeTools,
  meteredCallsAllowed,
  resolveDeclaredModel,
} from "../execute-guard";

function creditsClient(opts: {
  select?: { data: unknown; error: unknown } | "throw";
  insert?: { data: unknown; error: unknown };
}) {
  return {
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                async single() {
                  if (opts.select === "throw") throw new Error("down");
                  return opts.select ?? { data: null, error: null };
                },
              };
            },
          };
        },
        insert() {
          return {
            select() {
              return {
                async single() {
                  return opts.insert ?? { data: { balance: 100 }, error: null };
                },
              };
            },
          };
        },
      };
    },
  };
}

test("the kill switch fails closed: only an explicit true admits calls", () => {
  assert.equal(meteredCallsAllowed({}), false);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "" }), false);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "false" }), false);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "ture" }), false);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "1" }), false);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "true" }), true);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: " TRUE " }), true);
});

test("the second model call (learning) is off unless explicitly enabled", () => {
  assert.equal(learningEnabled({}), false);
  assert.equal(learningEnabled({ AGENT_EXECUTE_LEARNING: "1" }), false);
  assert.equal(learningEnabled({ AGENT_EXECUTE_LEARNING: "true" }), true);
});

test("input caps reject empty, oversized input and oversized context", () => {
  assert.deepEqual(checkInputCaps("   ", {}), {
    ok: false,
    status: 400,
    error: "input is required and must be a non-empty string",
  });
  const tooLong = checkInputCaps(
    "x".repeat(EXECUTE_LIMITS.maxInputChars + 1),
    {},
  );
  assert.equal(tooLong.ok, false);
  assert.equal(!tooLong.ok && tooLong.status, 413);
  const bigContext = checkInputCaps("hi", {
    a: "y".repeat(EXECUTE_LIMITS.maxContextChars),
  });
  assert.equal(bigContext.ok, false);
  const ok = checkInputCaps("  hi  ", [1, 2]);
  assert.deepEqual(ok, { ok: true, input: "hi", context: {} });
});

test("model resolution uses one declared model and never falls through", () => {
  // Only an OpenAI key is set: the default (Gemini) model must be refused,
  // not silently replaced by a paid OpenAI one.
  const refused = resolveDeclaredModel(undefined, {
    OPENAI_API_KEY: "sk-test",
  });
  assert.equal(refused.ok, false);

  const gemini = resolveDeclaredModel(undefined, { GEMINI_API_KEY: "k" });
  assert.equal(gemini.ok, true);
  assert.equal(gemini.ok && gemini.gatewayId, DEFAULT_EXECUTE_MODEL);

  const unknown = resolveDeclaredModel("does-not-exist", {
    GEMINI_API_KEY: "k",
  });
  assert.equal(unknown.ok, false);

  // An agent that names a model whose key is missing is refused too.
  const missing = resolveDeclaredModel("arcanea-haiku", {
    GEMINI_API_KEY: "k",
  });
  assert.equal(missing.ok, false);
});

test("credits check allows a sufficient balance and denies an insufficient one", async () => {
  const ok = await checkCreditsFailClosed(
    creditsClient({ select: { data: { balance: 50 }, error: null } }),
    "u1",
    10,
  );
  assert.deepEqual(ok, { status: "ok", balance: 50 });
  const low = await checkCreditsFailClosed(
    creditsClient({ select: { data: { balance: 5 }, error: null } }),
    "u1",
    10,
  );
  assert.deepEqual(low, { status: "insufficient", balance: 5 });
});

test("credits check fails closed on a query error, a thrown error and a bad balance", async () => {
  const queryError = await checkCreditsFailClosed(
    creditsClient({
      select: { data: null, error: { code: "42P01", message: "no table" } },
    }),
    "u1",
    0,
  );
  assert.deepEqual(queryError, { status: "unavailable" });
  const thrown = await checkCreditsFailClosed(
    creditsClient({ select: "throw" }),
    "u1",
    0,
  );
  assert.deepEqual(thrown, { status: "unavailable" });
  const bad = await checkCreditsFailClosed(
    creditsClient({ select: { data: { balance: "lots" }, error: null } }),
    "u1",
    0,
  );
  assert.deepEqual(bad, { status: "unavailable" });
});

test("a new user gets the starter balance only if it can be stored", async () => {
  const created = await checkCreditsFailClosed(
    creditsClient({ select: { data: null, error: { code: "PGRST116" } } }),
    "u1",
    10,
  );
  assert.deepEqual(created, { status: "ok", balance: 100 });
  const insertFails = await checkCreditsFailClosed(
    creditsClient({
      select: { data: null, error: { code: "PGRST116" } },
      insert: { data: null, error: { code: "42501", message: "denied" } },
    }),
    "u1",
    10,
  );
  assert.deepEqual(insertFails, { status: "unavailable" });
});

const JWT = "aaa.bbb.ccc";
const b64url = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

test("session cookie: base64url value written by @supabase/ssr", () => {
  const value =
    "base64-" +
    b64url(JSON.stringify({ access_token: JWT, refresh_token: "r" }));
  assert.equal(
    extractAccessToken(`theme=dark; sb-abc-auth-token=${value}`),
    JWT,
  );
});

test("session cookie: value split into numbered chunks is rejoined in order", () => {
  const value =
    "base64-" +
    b64url(JSON.stringify({ access_token: JWT, note: "é".repeat(40) }));
  const cut = Math.floor(value.length / 2);
  const header = `sb-abc-auth-token.1=${value.slice(cut)}; sb-abc-auth-token.0=${value.slice(0, cut)}`;
  assert.equal(extractAccessToken(header), JWT);
});

test("session cookie: legacy JSON, array and raw JWT forms still work", () => {
  const json = encodeURIComponent(JSON.stringify({ access_token: JWT }));
  assert.equal(extractAccessToken(`sb-x-auth-token=${json}`), JWT);
  const array = encodeURIComponent(JSON.stringify([{ access_token: JWT }]));
  assert.equal(extractAccessToken(`sb-x-auth-token=${array}`), JWT);
  assert.equal(extractAccessToken(`sb-x-auth-token=${JWT}`), JWT);
});

test("session cookie: garbage and unrelated cookies give no token", () => {
  assert.equal(extractAccessToken(""), null);
  assert.equal(extractAccessToken("a=b; c=d"), null);
  assert.equal(extractAccessToken("sb-x-auth-token=not a token"), null);
  assert.equal(extractAccessToken("sb-x-auth-token=base64-!!!"), null);
});

test("only allowlisted free tools are offered; paid and unknown tools are withheld", () => {
  const tools = {
    handoff_to_luminor: 1,
    web_search: 2,
    deep_research: 3,
    image_generate: 4,
    memory_store: 5,
    some_future_paid_tool: 6,
  };
  // image_generate is a zero-cost /imagine handoff and stays available.
  assert.deepEqual(onlyFreeTools(tools), {
    handoff_to_luminor: 1,
    image_generate: 4,
  });
  assert.equal(onlyFreeTools({ web_search: 1, deep_research: 2 }), undefined);
  for (const paid of ["web_search", "deep_research", "memory_store"]) {
    assert.equal((FREE_TOOL_NAMES as readonly string[]).includes(paid), false);
  }
});

test("the composed prompt is capped, not only the request fields", () => {
  assert.equal(checkPromptCap("s".repeat(3_300), "i".repeat(8_000)), true);
  assert.equal(
    checkPromptCap("s".repeat(EXECUTE_LIMITS.maxPromptChars), "x"),
    false,
  );
});

test("a negative or non-finite price is refused before the balance is read", async () => {
  const client = creditsClient({
    select: { data: { balance: 50 }, error: null },
  });
  assert.deepEqual(await checkCreditsFailClosed(client, "u1", -5), {
    status: "unavailable",
  });
  assert.deepEqual(await checkCreditsFailClosed(client, "u1", Number.NaN), {
    status: "unavailable",
  });
  assert.deepEqual(await checkCreditsFailClosed(client, "u1", 0), {
    status: "ok",
    balance: 50,
  });
});

test("the arcanea-auto sentinel resolves to the single default model", () => {
  const auto = resolveDeclaredModel("arcanea-auto", { GEMINI_API_KEY: "k" });
  assert.equal(auto.ok, true);
  assert.equal(auto.ok && auto.gatewayId, DEFAULT_EXECUTE_MODEL);
  // With only a paid OpenAI key set, auto is still refused, not rerouted.
  assert.equal(
    resolveDeclaredModel("arcanea-auto", { OPENAI_API_KEY: "sk-test" }).ok,
    false,
  );
});

// A tiny in-memory `credits` table that behaves like PostgREST for the calls
// reserveCredits and refundCredits make, including the compare-and-set
// `.eq("balance", seen)` on update.
function creditsTable(initial: number, opts: { failUpdate?: boolean } = {}) {
  const row = { user_id: "u1", balance: initial };
  const client = {
    row,
    from(table: string) {
      assert.equal(table, "credits");
      return {
        select() {
          return {
            eq() {
              return {
                async single() {
                  // Yield so parallel callers interleave their reads.
                  await Promise.resolve();
                  return { data: { balance: row.balance }, error: null };
                },
              };
            },
          };
        },
        update(patch: { balance: number }) {
          const filters: Record<string, unknown> = {};
          const q = {
            eq(col: string, val: unknown) {
              filters[col] = val;
              return q;
            },
            async select() {
              await Promise.resolve();
              if (opts.failUpdate)
                return {
                  data: null,
                  error: { code: "42501", message: "denied" },
                };
              if (filters.balance === row.balance) {
                row.balance = patch.balance;
                return { data: [{ balance: row.balance }], error: null };
              }
              return { data: [], error: null };
            },
          };
          return q;
        },
      };
    },
  };
  return client;
}

test("reserving credits takes the price before the call and reports the new balance", async () => {
  const db = creditsTable(50);
  const r = await reserveCredits(db, "u1", 10);
  assert.deepEqual(r, { status: "reserved", amount: 10, balance: 40 });
  assert.equal(db.row.balance, 40);
});

test("a free agent reserves nothing and never writes", async () => {
  const db = creditsTable(0, { failUpdate: true });
  const r = await reserveCredits(db, "u1", 0);
  assert.deepEqual(r, { status: "reserved", amount: 0, balance: 0 });
});

test("parallel requests cannot spend the same credits twice", async () => {
  // Exactly one run's worth of credits, five requests at once.
  const db = creditsTable(10);
  const results = await Promise.all(
    Array.from({ length: 5 }, () => reserveCredits(db, "u1", 10)),
  );
  const reserved = results.filter((r) => r.status === "reserved");
  assert.equal(reserved.length, 1);
  assert.equal(db.row.balance, 0);
  for (const r of results) {
    if (r.status !== "reserved") {
      assert.ok(r.status === "insufficient" || r.status === "unavailable");
    }
  }
});

test("parallel requests with credits for three runs reserve at most three", async () => {
  const db = creditsTable(30);
  const results = await Promise.all(
    Array.from({ length: 6 }, () => reserveCredits(db, "u1", 10)),
  );
  const reserved = results.filter((r) => r.status === "reserved").length;
  assert.ok(reserved <= 3);
  assert.ok(db.row.balance >= 0);
  assert.equal(db.row.balance, 30 - reserved * 10);
});

test("an insufficient balance is refused without writing", async () => {
  const db = creditsTable(5);
  assert.deepEqual(await reserveCredits(db, "u1", 10), {
    status: "insufficient",
    balance: 5,
  });
  assert.equal(db.row.balance, 5);
});

test("a failed write, and a negative or fractional price, fail closed", async () => {
  assert.deepEqual(
    await reserveCredits(creditsTable(50, { failUpdate: true }), "u1", 10),
    {
      status: "unavailable",
    },
  );
  assert.deepEqual(await reserveCredits(creditsTable(50), "u1", -10), {
    status: "unavailable",
  });
  assert.deepEqual(await reserveCredits(creditsTable(50), "u1", 2.5), {
    status: "unavailable",
  });
  assert.deepEqual(await reserveCredits(creditsTable(50), "u1", Number.NaN), {
    status: "unavailable",
  });
});

test("a reservation is returned in full on refund and reports the balance written", async () => {
  const db = creditsTable(50);
  const r = await reserveCredits(db, "u1", 10);
  assert.equal(r.status, "reserved");
  assert.deepEqual(await refundCredits(db, "u1", 10), {
    status: "refunded",
    balance: 50,
  });
  assert.equal(db.row.balance, 50);
  // The balance reported is the one the update wrote, not reserved + amount:
  // another request changed it in between.
  const a = await reserveCredits(db, "u1", 10);
  const b = await reserveCredits(db, "u1", 10);
  assert.equal(a.status === "reserved" && b.status === "reserved", true);
  assert.deepEqual(await refundCredits(db, "u1", 10), {
    status: "refunded",
    balance: 40,
  });
});

test("a refund that is rejected is a definite failure; a dropped connection is unknown", async () => {
  // A server rejection carries a code: nothing applied, safe to retry.
  assert.deepEqual(
    await refundCredits(creditsTable(5, { failUpdate: true }), "u1", 10),
    { status: "failed" },
  );
  assert.deepEqual(await refundCredits(creditsTable(5), "u1", -3), {
    status: "failed",
  });
  // An error with no code (fetch failed) may or may not have applied.
  const flaky = creditsTable(5);
  const real = flaky.from.bind(flaky);
  flaky.from = ((t: string) => {
    const q = real(t) as ReturnType<typeof real>;
    return {
      ...q,
      update: (patch: { balance: number }) => {
        const u = q.update(patch);
        return {
          eq: (...args: [string, unknown]) => {
            u.eq(...args);
            return {
              eq: (...a2: [string, unknown]) => {
                u.eq(...a2);
                return {
                  select: async () => ({
                    data: null,
                    error: { message: "TypeError: fetch failed" },
                  }),
                };
              },
            };
          },
        };
      },
    };
  }) as typeof flaky.from;
  assert.deepEqual(await refundCredits(flaky, "u1", 10), { status: "unknown" });
});

test("an auth outage is not an anonymous visitor", () => {
  // The auth server rejected the credential: signed out, 401.
  assert.equal(classifyAuthError({ status: 401 }), "anonymous");
  assert.equal(classifyAuthError({ status: 403 }), "anonymous");
  // Could not check: dropped connection (no status), 5xx, rate limited: 503.
  assert.equal(classifyAuthError({}), "unavailable");
  assert.equal(classifyAuthError(null), "unavailable");
  assert.equal(classifyAuthError({ status: 0 }), "unavailable");
  assert.equal(classifyAuthError({ status: 502 }), "unavailable");
  assert.equal(classifyAuthError({ status: 429 }), "unavailable");
});

test("only header-safe agent ids are echoed in a response header", () => {
  assert.equal(isHeaderSafeId("code-crafter"), true);
  assert.equal(isHeaderSafeId("agent_1.v2:beta"), true);
  assert.equal(isHeaderSafeId("has space"), false);
  assert.equal(isHeaderSafeId("naïve"), false);
  assert.equal(isHeaderSafeId("line\nbreak"), false);
  assert.equal(isHeaderSafeId(""), false);
});
