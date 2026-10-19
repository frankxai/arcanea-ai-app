const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const head = "a".repeat(40);
const source = readFileSync(
  path.resolve(__dirname, "../run-reading-scene-auth-fixture.mjs"),
  "utf8",
);
// Execute the actual admission block before any file/container/server bootstrap.
const prefix = source.slice(
  source.indexOf("const branch ="),
  source.indexOf("const output ="),
);
const javascript = ts.transpileModule(prefix, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const valid = {
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
  GITHUB_ACTOR: "frankxai",
  GITHUB_HEAD_REF: "agent/codex/reading-progress-auth-20261012",
  READING_PROGRESS_AUTH: "true",
  READING_SCENE_HEAD: head,
  READING_SCENE_FIXTURE_PASSWORD: "123-1-fixture",
};
function admit(overrides = {}) {
  let reads = 0;
  vm.runInNewContext(javascript, {
    process: { env: { ...valid, ...overrides } },
    Set,
    execFileSync: (command, args) => {
      assert.equal(command, "git");
      assert.deepEqual(Array.from(args), ["rev-parse", "HEAD"]);
      reads++;
      return head;
    },
  });
  return reads;
}
test("owned progress PR and main admit only exact fixture source", () => {
  assert.equal(admit(), 1);
  assert.equal(
    admit({ GITHUB_HEAD_REF: undefined, GITHUB_REF_NAME: "main" }),
    1,
  );
  assert.throws(
    () => admit({ READING_SCENE_HEAD: "b".repeat(40) }),
    /exact checked-out source/,
  );
});
test("owned companion lane retains mode, actor and credential admission", () => {
  const lane = { GITHUB_HEAD_REF: "agent/codex/reading-companion-20261012" };
  assert.equal(admit(lane), 1);
  for (const override of [
    { READING_PROGRESS_AUTH: undefined },
    { GITHUB_REPOSITORY: "fork/arcanea-ai-app" },
    { GITHUB_ACTOR: "another-actor" },
    { SUPABASE_SERVICE_ROLE_KEY: "synthetic-admin-value" },
  ])
    assert.throws(
      () => admit({ ...lane, ...override }),
      /owned disposable hosted lane/,
    );
});
test("untrusted repository, actor, lane and service-role credential fail before bootstrap", () => {
  for (const override of [
    { GITHUB_ACTIONS: "false" },
    { GITHUB_REPOSITORY: "fork/arcanea-ai-app" },
    { GITHUB_ACTOR: "another-actor" },
    { GITHUB_HEAD_REF: "feature/unadmitted" },
    { SUPABASE_SERVICE_ROLE_KEY: "synthetic-admin-value" },
  ])
    assert.throws(() => admit(override), /owned disposable hosted lane/);
});
test("invalid mode and non-fixture database password are refused", () => {
  assert.throws(
    () => admit({ READING_PROGRESS_AUTH: "false" }),
    /explicit reading-progress/,
  );
  assert.throws(
    () => admit({ READING_SCENE_FIXTURE_PASSWORD: "nonfixture-value" }),
    /ephemeral GitHub fixture password/,
  );
  assert.throws(
    () => admit({ READING_PROGRESS_AUTH: undefined }),
    /owned disposable hosted lane/,
  );
});
test("existing reading-scene and provider-account admission is preserved", () => {
  for (const branch of [
    "agent/codex/reading-scene-20261010",
    "agent/codex/provider-account-20261011",
    "main",
  ])
    assert.equal(
      admit({ READING_PROGRESS_AUTH: undefined, GITHUB_HEAD_REF: branch }),
      1,
    );
});
