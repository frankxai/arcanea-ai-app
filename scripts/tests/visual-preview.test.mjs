import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import test from "node:test";
import {
  assertCurrentSource,
  previewUrl,
  resolvePreview,
  validateDeployment,
} from "../resolve-visual-preview.mjs";

const expected = {
  owner: "frankxai",
  repo: "arcanea-ai-app",
  sha: "a".repeat(40),
  prNumber: 7,
};
const repository = "https://api.github.com/repos/frankxai/arcanea-ai-app";
const deployment = {
  id: 42,
  created_at: "2026-10-01T10:00:00Z",
  sha: expected.sha,
  repository_url: repository,
  environment: "Preview",
  production_environment: false,
  creator: { login: "vercel[bot]" },
};
const url = "https://arcanea-ai-ptg79i7g2-starlight-intelligence.vercel.app";
const status = {
  id: 55,
  created_at: "2026-10-01T10:01:00Z",
  state: "success",
  environment: "Preview",
  environment_url: url,
  deployment_url: `${repository}/deployments/42`,
  repository_url: repository,
  creator: { login: "vercel[bot]" },
};
const pr = {
  state: "open",
  draft: false,
  head: { sha: expected.sha, repo: { full_name: "frankxai/arcanea-ai-app" } },
};

function harness({
  rows = [deployment],
  states = [status],
  pull = () => pr,
} = {}) {
  const calls = [];
  return {
    calls,
    rest: {
      pulls: { get: async () => ({ data: pull() }) },
      repos: {
        listDeployments: async (input) => {
          calls.push(input);
          return { data: rows };
        },
        listDeploymentStatuses: async (input) => {
          calls.push(input);
          return { data: states };
        },
      },
      issues: {
        listComments: () => {
          throw new Error("Comments are not deployment proof");
        },
      },
    },
  };
}

test("resolves a current successful immutable preview and records its source", async () => {
  const github = harness();
  const result = await resolvePreview(github, expected, { attempts: 1 });
  assert.equal(result.url, url);
  assert.equal(result.source_sha, expected.sha);
  assert.equal(result.deployment_id, 42);
  assert.equal(github.calls[0].sha, expected.sha);
  assert.equal(github.calls[0].environment, "Preview");
  assert.equal(github.calls[1].per_page, 100);
});

for (const [name, change] of Object.entries({
  stale: { sha: "b".repeat(40) },
  foreign: {
    repository_url: "https://api.github.com/repos/other/arcanea-ai-app",
  },
  production: { environment: "Production" },
  productionFlag: { production_environment: true },
  untrustedCreator: { creator: { login: "someone" } },
}))
  test(`rejects ${name} deployment metadata`, () => {
    assert.throws(() =>
      validateDeployment({ ...deployment, ...change }, status, expected),
    );
  });

for (const state of [
  "pending",
  "in_progress",
  "failure",
  "error",
  "inactive",
  "cancelled",
  "success-with-warning",
]) {
  test(`rejects latest ${state} status, even with an older success`, async () => {
    await assert.rejects(
      resolvePreview(
        harness({ states: [{ ...status, state, id: 56 }, status] }),
        expected,
        { attempts: 1 },
      ),
    );
  });
}

test("does not reuse an older deployment after the newest deployment fails", async () => {
  await assert.rejects(
    resolvePreview(
      harness({
        rows: [deployment, { ...deployment, id: 41 }],
        states: [{ ...status, state: "failure" }],
      }),
      expected,
      { attempts: 1 },
    ),
  );
});

test("missing deployment/status fails after bounded wait without consulting comments", async () => {
  for (const changes of [{ rows: [] }, { states: [] }]) {
    let waits = 0;
    await assert.rejects(
      resolvePreview(harness(changes), expected, {
        attempts: 2,
        sleep: async (ms) => {
          assert.equal(ms, 15000);
          waits++;
        },
      }),
    );
    assert.equal(waits, 1);
  }
});

test("requested overrides must equal the metadata URL", async () => {
  assert.equal(
    (
      await resolvePreview(harness(), expected, {
        requestedUrl: `${url}/`,
        attempts: 1,
      })
    ).url,
    url,
  );
  await assert.rejects(
    resolvePreview(harness(), expected, {
      requestedUrl:
        "https://arcanea-ai-3nycuxwpo-starlight-intelligence.vercel.app",
      attempts: 1,
    }),
  );
});

test("untrusted and mutable hosts cannot receive capture credentials", () => {
  for (const value of [
    "http://arcanea-ai-ptg79i7g2-starlight-intelligence.vercel.app",
    "https://arcanea-ai-app-git-main-starlight-intelligence.vercel.app",
    "https://evil.vercel.app",
    `${url}.evil.test`,
    `${url}/page`,
    `${url}?secret=x`,
    `${url}#x`,
    url.replace("https://", "https://user:pass@"),
    url.replace(".app", ".app:444"),
  ]) {
    assert.throws(() => previewUrl(value));
  }
});

test("status must belong to this deployment, repository, environment and bot", () => {
  for (const change of [
    { deployment_url: `${repository}/deployments/41` },
    { repository_url: `${repository}x` },
    { environment: "Production" },
    { creator: { login: "github-actions[bot]" } },
  ]) {
    assert.throws(() =>
      validateDeployment(deployment, { ...status, ...change }, expected),
    );
  }
});

test("changed head, closed/draft PR and foreign head repository stop capture", async () => {
  for (const value of [
    { ...pr, state: "closed" },
    { ...pr, draft: true },
    { ...pr, head: { ...pr.head, sha: "b".repeat(40) } },
    {
      ...pr,
      head: { ...pr.head, repo: { full_name: "other/arcanea-ai-app" } },
    },
  ]) {
    await assert.rejects(
      assertCurrentSource(harness({ pull: () => value }), expected),
    );
  }
});

test("PR advancing during deployment lookup cannot yield accepted evidence", async () => {
  let reads = 0;
  await assert.rejects(
    resolvePreview(
      harness({
        pull: () =>
          ++reads === 1
            ? pr
            : { ...pr, head: { ...pr.head, sha: "b".repeat(40) } },
      }),
      expected,
      { attempts: 1 },
    ),
  );
  assert.equal(reads, 2);
});

test("manual workflow source still requires a full SHA and the same repository", async () => {
  assert.equal(
    (
      await resolvePreview(
        harness(),
        { ...expected, prNumber: undefined },
        { attempts: 1 },
      )
    ).source_sha,
    expected.sha,
  );
  await assert.rejects(
    resolvePreview(harness(), { ...expected, sha: "main" }, { attempts: 1 }),
  );
  await assert.rejects(
    resolvePreview(harness(), { ...expected, repo: "other" }, { attempts: 1 }),
  );
});

test("server time/id chooses newest status independent of response order", async () => {
  await assert.rejects(
    resolvePreview(
      harness({ states: [status, { ...status, id: 56, state: "failure" }] }),
      expected,
      { attempts: 1 },
    ),
  );
  const latest = { ...deployment, id: 43, created_at: "2026-10-01T10:02:00Z" };
  const github = harness({
    rows: [deployment, latest],
    states: [{ ...status, deployment_url: `${repository}/deployments/43` }],
  });
  assert.equal(
    (await resolvePreview(github, expected, { attempts: 1 })).deployment_id,
    43,
  );
});

test("full or malformed history blocks rather than guessing its latest record", async () => {
  for (const changes of [
    { rows: Array(100).fill(deployment) },
    { states: Array(100).fill(status) },
    { states: [{ ...status, created_at: "invalid" }] },
    { rows: [{ ...deployment, id: "42" }] },
  ]) {
    await assert.rejects(
      resolvePreview(harness(changes), expected, { attempts: 1 }),
    );
  }
});

const workflow = await readFile(
  new URL("../../.github/workflows/visual-qa.yml", import.meta.url),
  "utf8",
);
const nativeRequire = createRequire(import.meta.url);
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
function stepScript(name) {
  const section = workflow
    .split(`      - name: ${name}\n`)[1]
    .split("\n      - name:")[0];
  return section
    .split("          script: |\n")[1]
    .split("\n")
    .map((line) => line.replace(/^            /, ""))
    .join("\n");
}
function workflowHarness(github) {
  const files = new Map();
  const outputs = {};
  const context = {
    eventName: "pull_request",
    repo: { owner: expected.owner, repo: expected.repo },
    issue: { number: expected.prNumber },
    payload: { pull_request: { head: { sha: expected.sha } } },
  };
  const core = {
    info() {},
    setOutput(name, value) {
      outputs[name] = value;
    },
  };
  const require = (name) =>
    name === "node:fs"
      ? {
          mkdirSync() {},
          writeFileSync(path, data) {
            files.set(path, data);
          },
          readFileSync(path) {
            return files.get(path);
          },
        }
      : nativeRequire(name);
  return {
    outputs,
    files,
    async execute(name) {
      await new AsyncFunction(
        "github",
        "context",
        "core",
        "require",
        stepScript(name),
      )(github, context, core, require);
    },
  };
}

test("real workflow scripts bind capture output and confirm identical metadata after capture", async () => {
  const runner = workflowHarness(harness());
  await runner.execute("Resolve preview URL");
  assert.equal(runner.outputs["source-sha"], expected.sha);
  assert.equal(
    JSON.parse(runner.files.get("screenshots/preview-binding.json"))
      .deployment_id,
    42,
  );
  await runner.execute("Confirm preview binding after capture");
  assert.equal(runner.outputs.valid, "true");
});

test("workflow resolution fails before emitting a capture URL for a changed PR", async () => {
  const runner = workflowHarness(
    harness({
      pull: () => ({ ...pr, head: { ...pr.head, sha: "b".repeat(40) } }),
    }),
  );
  await assert.rejects(runner.execute("Resolve preview URL"));
  assert.equal(runner.outputs.url, undefined);
  assert.equal(runner.files.size, 0);
});

test("workflow does not mark source binding valid after a deployment failure during capture", async () => {
  const states = [status];
  const runner = workflowHarness(harness({ states }));
  await runner.execute("Resolve preview URL");
  states[0] = { ...status, state: "failure" };
  await assert.rejects(runner.execute("Confirm preview binding after capture"));
  assert.equal(runner.outputs.valid, undefined);
});
