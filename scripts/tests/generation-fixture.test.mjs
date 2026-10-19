import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
const source = readFileSync(
  new URL("../generation-provider-fixture.mjs", import.meta.url),
  "utf8",
);
const env = {
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
  GITHUB_REF_NAME: "agent/codex/generation-admission-20261011",
  GENERATION_FIXTURE_ORIGIN: "http://127.0.0.1:54321",
  XAI_API_KEY: "fixture-" + "a".repeat(64),
};
function load(overrides = {}) {
  const calls = [];
  const context = {
    process: { env: { ...env, ...overrides } },
    globalThis: {
      fetch: async (url, init) => {
        calls.push({ url, init });
        return Response.json({ request_id: "accepted" });
      },
    },
    URL,
    Request,
    Headers,
  };
  runInNewContext(source, context);
  return { transport: context.globalThis.fetch, calls };
}
test("provider fixture refuses another harness, repository, branch, origin or credential", () => {
  for (const overrides of [
    { GITHUB_ACTIONS: "false" },
    { GITHUB_REPOSITORY: "other/repo" },
    { GITHUB_REF_NAME: "main" },
    { GENERATION_FIXTURE_ORIGIN: "https://remote.invalid" },
    { XAI_API_KEY: "ordinary-key" },
  ])
    assert.throws(() => load(overrides));
});
test("only a fixture-key image request reaches the loopback supplier", async () => {
  const fixture = load();
  await fixture.transport("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.XAI_API_KEY}` },
    body: "{}",
  });
  assert.equal(fixture.calls.length, 1);
  assert.equal(
    fixture.calls[0].url,
    "http://127.0.0.1:54321/v1/images/generations",
  );
  assert.equal(fixture.calls[0].init.redirect, "error");
  for (const url of [
    "https://openrouter.ai/api/v1/chat/completions",
    "https://generativelanguage.googleapis.com/v1beta/models",
    "https://api.x.ai/v1/images/generations?redirect=other",
    "https://api.x.ai/v1/chat/completions",
    "https://user:pass@api.x.ai/v1/images/generations",
  ])
    await assert.rejects(
      fixture.transport(url, {
        headers: { Authorization: `Bearer ${env.XAI_API_KEY}` },
      }),
    );
  await assert.rejects(
    fixture.transport("https://api.x.ai/v1/images/generations", {
      headers: { Authorization: "Bearer ordinary-key" },
    }),
  );
  assert.equal(fixture.calls.length, 1);
});
test("actual private Auth and database requests retain their original transport", async () => {
  const fixture = load();
  const init = { headers: { Authorization: "Bearer disposable-auth" } };
  await fixture.transport("http://127.0.0.1:54321/auth/v1/user", init);
  assert.equal(fixture.calls[0].url, "http://127.0.0.1:54321/auth/v1/user");
  assert.equal(fixture.calls[0].init, init);
});

test("the full fixture refuses local execution and inherited hosted credentials before containers", () => {
  const runner = new URL(
    "../run-generation-service-fixture.mjs",
    import.meta.url,
  );
  const options = {
    cwd: new URL("../../", import.meta.url),
    encoding: "utf8",
    timeout: 10000,
  };
  const local = spawnSync(
    process.execPath,
    [runner.pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:")],
    { ...options, env: { ...process.env, GITHUB_ACTIONS: "false" } },
  );
  assert.notEqual(local.status, 0);
  assert.match(local.stderr, /restricted to the owned hosted lane/);
  const credential = spawnSync(
    process.execPath,
    [runner.pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:")],
    {
      ...options,
      env: {
        ...process.env,
        GITHUB_ACTIONS: "true",
        GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
        GITHUB_REF_NAME: "agent/codex/generation-admission-20261011",
        XAI_API_KEY: "prohibited",
      },
    },
  );
  assert.notEqual(credential.status, 0);
  assert.match(credential.stderr, /Hosted credentials are prohibited/);
});

test("Browser verifier resolves the app-owned dependency and refuses local execution before Chromium", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/verify-generation-preview-browser.cjs"],
    {
      cwd: new URL("../../", import.meta.url),
      env: {
        ...process.env,
        GITHUB_ACTIONS: "false",
        GITHUB_REPOSITORY: "",
        GITHUB_REF_NAME: "",
      },
      encoding: "utf8",
      timeout: 15000,
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Disposable generation client acceptance failed/);
  assert.doesNotMatch(result.stderr, /MODULE_NOT_FOUND|Cannot find module/);
});

async function receiptHelpers() {
  const verifier = readFileSync(
    new URL("../verify-generation-preview-browser.cjs", import.meta.url),
    "utf8",
  );
  const start = verifier.indexOf("  const asyncFailures = [];");
  const end = verifier.indexOf("  async function capture(", start);
  assert.ok(start >= 0 && end > start);
  const files = new Map();
  const rows = [];
  const events = [];
  const helpers = await runInNewContext(
    `(async () => { ${verifier.slice(start, end)}; return { record, persist, onUnhandled, closeContext, serveImage }; })()`,
    {
      rows,
      config: {
        head: "fixture-head",
        output: "screenshots/generation-service",
      },
      image: new Uint8Array([1, 2, 3]),
      fs: {
        writeFile: async (path, body) => files.set(path, body),
        rename: async (from, to) => {
          assert.ok(files.has(from));
          files.set(to, files.get(from));
          files.delete(from);
        },
      },
      process: { on: (name) => events.push(name) },
    },
  );
  return {
    helpers,
    rows,
    events,
    evidence: () =>
      JSON.parse(
        files.get("screenshots/generation-service/browser-evidence.json"),
      ),
  };
}

test("actual browser receipt helpers checkpoint rows atomically and async errors remain blocking without secret output", async () => {
  const { helpers, events, evidence } = await receiptHelpers();
  assert.deepEqual(events, ["unhandledRejection"]);
  await helpers.record({ scope: "first-real-check", passed: true });
  assert.equal(evidence().passed, false);
  assert.equal(evidence().rows.length, 1);
  for (let i = 1; i < 9; i++)
    await helpers.record({ scope: `check-${i}`, passed: true });
  await helpers.persist(true);
  assert.equal(evidence().passed, true);
  const failure = new Error("PRIVATE-CREDENTIAL-SENTINEL");
  failure.stack =
    "Error: PRIVATE-CREDENTIAL-SENTINEL\n at verify-generation-preview-browser.cjs:123:9";
  helpers.onUnhandled(failure);
  await helpers.persist(true);
  const result = evidence();
  assert.equal(result.passed, false);
  assert.deepEqual(result.asyncFailures, [{ kind: "Other", scriptLine: 123 }]);
  assert.equal(result.rows.length, 9);
  assert.ok(!JSON.stringify(result).includes("PRIVATE-CREDENTIAL-SENTINEL"));
});

test("actual fixture image handler ignores only owned context teardown races", async () => {
  const { helpers } = await receiptHelpers();
  let closed = false;
  const context = {
    close: async () => {
      closed = true;
    },
  };
  const route = {
    fulfill: async () => {
      throw Error("route failed");
    },
  };
  await assert.rejects(helpers.serveImage(route, context, {}), /route failed/);
  await helpers.closeContext(context);
  assert.equal(closed, true);
  await helpers.serveImage(route, context, {});
});
