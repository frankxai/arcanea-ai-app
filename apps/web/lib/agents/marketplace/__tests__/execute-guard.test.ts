import test from "node:test";
import assert from "node:assert/strict";
import {
  EXECUTE_LIMITS,
  DEFAULT_EXECUTE_MODEL,
  checkCreditsFailClosed,
  PAID_TOOL_NAMES,
  checkInputCaps,
  checkPromptCap,
  extractAccessToken,
  learningEnabled,
  withoutPaidTools,
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

test("the kill switch is on by default and only an explicit false turns it off", () => {
  assert.equal(meteredCallsAllowed({}), true);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "true" }), true);
  assert.equal(meteredCallsAllowed({ AI_METERED_ALLOWED: "false" }), false);
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
      insert: { data: null, error: { message: "denied" } },
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

test("paid tools are stripped from the tool set", () => {
  const tools = {
    handoff_to_luminor: 1,
    web_search: 2,
    deep_research: 3,
    image_generate: 4,
  };
  // image_generate is a zero-cost /imagine handoff and stays available.
  assert.deepEqual(withoutPaidTools(tools), {
    handoff_to_luminor: 1,
    image_generate: 4,
  });
  assert.equal(withoutPaidTools({ web_search: 1 }), undefined);
  assert.deepEqual([...PAID_TOOL_NAMES].sort(), [
    "deep_research",
    "web_search",
  ]);
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
