import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const loader = fileURLToPath(
  new URL("./generate-containment-loader.mjs", import.meta.url),
);
const probe = fileURLToPath(
  new URL("./generate-containment-probe.mjs", import.meta.url),
);
function run(input = {}, env = {}, webRoot) {
  return JSON.parse(
    execFileSync(process.execPath, ["--import", loader, probe], {
      env: {
        PATH: process.env.PATH,
        GRIMOIRE_CASE: JSON.stringify(input),
        GOOGLE_GENERATIVE_AI_API_KEY: "fixture",
        ...env,
        ...(webRoot ? { GRIMOIRE_WEB_ROOT: webRoot } : {}),
      },
      encoding: "utf8",
      timeout: 5000,
    }),
  );
}
const standard = (tier) => ({
  answers: { worldName: "Fixture world" },
  tier,
  email: "fixture@example.invalid",
});
const cases = [
  ["unset metering", {}, {}],
  ["disabled metering", {}, { AI_METERED_ALLOWED: "false" }],
  [
    "enabled flag alone grants no admission",
    {},
    { AI_METERED_ALLOWED: "true" },
  ],
  [
    "unverified actor header",
    { headers: { authorization: "Bearer fixture" } },
    {},
  ],
  [
    "missing reservation",
    { body: { ...standard("mage"), reservationId: null } },
    {},
  ],
  [
    "forged exhausted reservation",
    { body: { ...standard("mage"), reservation: { remaining: 0 } } },
    {},
  ],
  [
    "caller tier escalation",
    { body: standard("archmage") },
    { ANTHROPIC_API_KEY: "fixture" },
  ],
  [
    "missing declared provider cannot fall through",
    { body: standard("archmage") },
    {},
  ],
  [
    "oversized answers",
    { body: { ...standard("mage"), answers: { notes: "x".repeat(100000) } } },
    {},
  ],
  ["malformed JSON", { jsonThrows: true }, {}],
  ["aborted request", { aborted: true, jsonThrows: true }, {}],
  ["invalid shape", { body: [] }, {}],
  ["no request property may be read", { noAccess: true }, {}],
];
for (const [name, input, env] of cases)
  test(name, () => {
    const result = run(input, env);
    assert.equal(result.status, 503);
    assert.equal(result.jsonReads, 0);
    assert.deepEqual(result.calls, []);
    assert.deepEqual(result.imports, []);
    assert.equal(result.networkAttempts, 0);
    assert.equal(result.headers["cache-control"], "private, no-store");
    assert.deepEqual(JSON.parse(result.body), {
      error:
        "Grimoire generation is unavailable until metered admission is verified.",
      code: "GRIMOIRE_GENERATION_UNAVAILABLE",
    });
  });
test("denial is uniform for malformed, premium and ordinary requests", () => {
  assert.equal(
    run({ jsonThrows: true }).body,
    run({ body: standard("archmage") }).body,
  );
  assert.equal(run().body, run({ aborted: true, jsonThrows: true }).body);
});

// Optional red/green control: point to apps/web in a separate immutable #655
// checkout. Hash verification rejects other source. The actual three-module
// chain runs unchanged; only SDK, catalog and formatting/safeguard leaves stub.
const baseline = process.env.GRIMOIRE_BASELINE_WEB_ROOT;
if (baseline) {
  test("baseline control is pinned to the three reviewed Git blobs", () => {
    for (const [path, sha] of [
      [
        "app/api/agents/grimoire/generate/route.ts",
        "9df64f787d33cb18a92637171996e08da7726c90",
      ],
      [
        "lib/agents/grimoire/orchestrator.ts",
        "9ebe6f45cb454ff19ebbaa83d23449aad00f5381",
      ],
      [
        "lib/agents/marketplace/executor.ts",
        "29dd2a76610203a1a7a9c41d6cace8162c348bec",
      ],
    ]) {
      const bytes = readFileSync(baseline + "/" + path);
      assert.equal(
        createHash("sha1")
          .update("blob " + bytes.length + "\0")
          .update(bytes)
          .digest("hex"),
        sha,
      );
    }
  });
  for (const [tier, count] of [
    ["apprentice", 4],
    ["mage", 8],
    ["archmage", 13],
  ]) {
    test("baseline records unadmitted " + tier + " chain", () => {
      const result = run(
        { body: standard(tier) },
        { AI_METERED_ALLOWED: "false" },
        baseline,
      );
      assert.equal(result.status, 200);
      assert.equal(result.calls.length, count);
      assert.equal(result.jsonReads, 1);
      assert.equal(result.networkAttempts, 0);
      assert.ok(result.calls.every((call) => call.maxOutputTokens === 8192));
    });
  }
  test("baseline premium falls through when declared provider is absent", () => {
    const result = run({ body: standard("archmage") }, {}, baseline);
    assert.equal(result.calls.length, 13);
    assert.ok(result.calls.every((call) => call.model.provider === "google"));
    assert.equal(result.networkAttempts, 0);
  });
}
