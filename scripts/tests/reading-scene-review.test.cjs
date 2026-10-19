const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { createContext, SourceTextModule, SyntheticModule } = require("node:vm");

// Execute the actual review entrypoint with isolated Git, filesystem, process
// and HTTP boundaries. No provider request, credential or file write occurs.
const source = readFileSync(
  resolve(__dirname, "../review-reading-scene.mjs"),
  "utf8",
);
const head = "a".repeat(40);
const base = "b".repeat(40);
const file = "apps/web/components/saga/scene-visualizer.tsx";
const validReview = () => ({
  reviewedCommit: head,
  verdict: "PASS",
  critical: [],
  high: [],
  medium: [],
  limits: ["Static review cannot certify production image quality."],
});

async function execute({
  env = {},
  tokens = 50000,
  review = validReview(),
  finishReason = "STOP",
} = {}) {
  const calls = [],
    writes = new Map(),
    logs = [],
    shown = [];
  const process = {
    env: {
      READING_SCENE_HEAD: head,
      GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
      READING_SCENE_REVIEW_BUDGET_USD: "1",
      GEMINI_API_KEY: "disposable-test-value",
      GITHUB_ACTOR: "frankxai",
      GITHUB_REF_NAME: "agent/codex/reading-scene-20261010",
      ...env,
    },
    exitCode: 0,
  };
  const context = createContext({
    process,
    Buffer,
    AbortSignal,
    console: {
      log: (value) => logs.push(value),
      error: (value) => logs.push(value),
    },
    fetch: async (url, options) => {
      calls.push({ url, options });
      const body = url.endsWith("models?pageSize=1000")
        ? {
            models: [
              {
                name: "models/gemini-3.1-pro-preview",
                inputTokenLimit: 1_000_000,
                supportedGenerationMethods: ["generateContent"],
              },
            ],
          }
        : url.endsWith(":countTokens")
          ? { totalTokens: tokens }
          : {
              candidates: [
                {
                  finishReason,
                  content: { parts: [{ text: JSON.stringify(review) }] },
                },
              ],
              modelVersion: "fixture-model-version",
              responseId: "fixture-response",
              usageMetadata: {
                promptTokenCount: tokens,
                candidatesTokenCount: 200,
              },
            };
      return { ok: true, json: async () => body };
    },
  });
  const exports = {
    "node:child_process": {
      execFileSync: (command, args) => {
        assert.equal(command, "git");
        if (args[0] === "rev-parse") return `${head}\n`;
        if (args[0] === "merge-base") return `${base}\n`;
        if (args[0] === "diff")
          return args[1] === "--name-only"
            ? `${file}\n`
            : "complete bounded delta\n";
        assert.equal(args[0], "show");
        shown.push(args[1]);
        return `Complete source ${args[1]}\n`;
      },
    },
    "node:crypto": { createHash },
    "node:fs": {
      mkdirSync: () => {},
      writeFileSync: (path, content) => writes.set(path, content),
    },
  };
  const module = new SourceTextModule(source, { context });
  await module.link((specifier) => {
    const values = exports[specifier];
    assert.ok(values);
    return new SyntheticModule(
      Object.keys(values),
      function () {
        for (const [name, value] of Object.entries(values))
          this.setExport(name, value);
      },
      { context },
    );
  });
  let error;
  try {
    await module.evaluate();
  } catch (failure) {
    error = failure;
  }
  return { calls, writes, logs, shown, process, error };
}

test("review requires explicit budget, actor, branch and immutable head before any network access", async () => {
  for (const env of [
    { READING_SCENE_REVIEW_BUDGET_USD: "" },
    { GITHUB_ACTOR: "foreign" },
    { GITHUB_REF_NAME: "main" },
    { READING_SCENE_HEAD: base },
  ]) {
    const result = await execute({ env });
    assert.match(result.error.message, /exact owned manual workflow/);
    assert.equal(result.calls.length, 0);
    assert.equal(result.writes.size, 0);
  }
});

test("cost admission rejects oversized or invalid token counts before paid generation", async () => {
  for (const tokens of [600000, 0, -1, "50000", null]) {
    const result = await execute({ tokens });
    assert.equal(result.process.exitCode, 1);
    assert.equal(
      result.calls.filter((call) => call.url.endsWith(":generateContent"))
        .length,
      0,
    );
    assert.equal(
      result.writes.has("screenshots/reading-scene-review/receipt.json"),
      false,
    );
  }
});

test("valid review binds the complete source, cost evidence and full findings without raw response files", async () => {
  const result = await execute();
  assert.equal(result.error, undefined);
  assert.equal(result.process.exitCode, 0);
  assert.equal(result.shown.length, 8);
  const receipt = JSON.parse(
    result.writes.get("screenshots/reading-scene-review/receipt.json"),
  );
  assert.equal(receipt.head, head);
  assert.equal(receipt.base, base);
  assert.equal(Object.keys(receipt.sourceHashes).length, 8);
  const evidence = result.logs.find((log) =>
    log.includes('"kind":"independent-reading-source-review"'),
  );
  assert.deepEqual(JSON.parse(evidence).review, validReview());
  assert.equal(
    receipt.providerEvidenceSha256,
    createHash("sha256").update(evidence).digest("hex"),
  );
  assert.equal(
    result.writes.has("screenshots/reading-scene-review/review.json"),
    false,
  );
  for (const content of result.writes.values()) {
    assert.equal(content.includes("fixture-response"), false);
    assert.equal(content.includes("Static review cannot certify"), false);
    assert.equal(content.includes("disposable-test-value"), false);
  }
});

test("blocking findings are retained with a failing verdict", async () => {
  const review = validReview();
  review.verdict = "FAIL";
  review.medium.push({
    file,
    line: 12,
    summary: "Owner recovery could accept a late response.",
    fix: "Check the actor before publishing the result.",
  });
  const result = await execute({ review });
  assert.equal(result.process.exitCode, 1);
  assert.deepEqual(
    JSON.parse(
      result.logs.find((log) =>
        log.includes('"kind":"independent-reading-source-review"'),
      ),
    ).review,
    review,
  );
  const receipt = JSON.parse(
    result.writes.get("screenshots/reading-scene-review/receipt.json"),
  );
  assert.equal(Object.hasOwn(receipt, "medium"), false);
  assert.equal(Object.hasOwn(receipt, "verdict"), false);
});

test("malformed, unbound and truncated provider output cannot earn a source verdict", async () => {
  const cases = [
    null,
    [],
    { ...validReview(), reviewedCommit: base },
    { ...validReview(), extra: "untrusted" },
    { ...validReview(), limits: ["\u0000"] },
    { ...validReview(), limits: ["x".repeat(3001)] },
    {
      ...validReview(),
      medium: [
        { file: "outside/review.ts", line: 1, summary: "Finding", fix: "Fix" },
      ],
    },
    {
      ...validReview(),
      medium: [{ file, line: 0, summary: "Finding", fix: "Fix" }],
    },
  ];
  for (const review of cases) {
    const result = await execute({ review });
    assert.equal(result.process.exitCode, 1);
    assert.equal(
      result.writes.has("screenshots/reading-scene-review/receipt.json"),
      false,
    );
  }
  const result = await execute({ finishReason: "MAX_TOKENS" });
  assert.equal(result.process.exitCode, 1);
  assert.equal(
    result.writes.has("screenshots/reading-scene-review/receipt.json"),
    false,
  );
});
