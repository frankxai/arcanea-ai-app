const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = readFileSync(
  path.join(__dirname, "../../apps/web/lib/openrouter-live.ts"),
  "utf8",
);
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
function fixture(phase) {
  const calls = [];
  const context = {
    exports: {},
    process: { env: { NEXT_PHASE: phase } },
    fetch: async (...args) => {
      calls.push(args);
      return { ok: true, json: async () => ({ data: [] }) };
    },
  };
  vm.runInNewContext(code, context);
  return { calls, load: context.exports.fetchLiveModels };
}

test("production builds use the existing static catalog without any supplier request", async () => {
  const run = fixture("phase-production-build");
  assert.equal(await run.load(), null);
  assert.equal(run.calls.length, 0);
});

test("runtime catalog retrieval remains a public GET without credentials, body or project data", async () => {
  const run = fixture("phase-production-server");
  assert.equal(await run.load(), null);
  assert.equal(run.calls.length, 1);
  assert.equal(run.calls[0][0], "https://openrouter.ai/api/v1/models");
  assert.deepEqual(Object.keys(run.calls[0][1]), ["next"]);
  assert.equal(run.calls[0][1].next.revalidate, 3600);
});
