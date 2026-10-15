import test from "node:test";
import assert from "node:assert/strict";
import {
  EXECUTE_LIMITS,
  DEFAULT_EXECUTE_MODEL,
  checkCreditsFailClosed,
  checkInputCaps,
  learningEnabled,
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
  const tooLong = checkInputCaps("x".repeat(EXECUTE_LIMITS.maxInputChars + 1), {});
  assert.equal(tooLong.ok, false);
  assert.equal(!tooLong.ok && tooLong.status, 413);
  const bigContext = checkInputCaps("hi", { a: "y".repeat(EXECUTE_LIMITS.maxContextChars) });
  assert.equal(bigContext.ok, false);
  const ok = checkInputCaps("  hi  ", [1, 2]);
  assert.deepEqual(ok, { ok: true, input: "hi", context: {} });
});

test("model resolution uses one declared model and never falls through", () => {
  // Only an OpenAI key is set: the default (Gemini) model must be refused,
  // not silently replaced by a paid OpenAI one.
  const refused = resolveDeclaredModel(undefined, { OPENAI_API_KEY: "sk-test" });
  assert.equal(refused.ok, false);

  const gemini = resolveDeclaredModel(undefined, { GEMINI_API_KEY: "k" });
  assert.equal(gemini.ok, true);
  assert.equal(gemini.ok && gemini.gatewayId, DEFAULT_EXECUTE_MODEL);

  const unknown = resolveDeclaredModel("does-not-exist", { GEMINI_API_KEY: "k" });
  assert.equal(unknown.ok, false);

  // An agent that names a model whose key is missing is refused too.
  const missing = resolveDeclaredModel("arcanea-haiku", { GEMINI_API_KEY: "k" });
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
    creditsClient({ select: { data: null, error: { code: "42P01", message: "no table" } } }),
    "u1",
    0,
  );
  assert.deepEqual(queryError, { status: "unavailable" });
  const thrown = await checkCreditsFailClosed(creditsClient({ select: "throw" }), "u1", 0);
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
