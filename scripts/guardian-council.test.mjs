import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  aggregateVerdict,
  buildProviderRequest,
  classifyRisk,
  expectedPerspectivesFor,
  resolveReviewContext,
  selectSinglePerspective,
  SEMANTIC_PERSPECTIVES,
  validateReview,
  validateReviewSet,
  verifyEvidenceDirectory,
  writeCompleteEvidence,
  writeFailureEvidence,
} from "./guardian-council.mjs";

const TRUSTED = "c".repeat(40);
const HEAD = "a".repeat(40);
const BASE = "b".repeat(40);
const MODEL = "configured-model";
const MAX_OUTPUT_TOKENS = 1_800;
const MERGE = "d".repeat(40);

function workflowSource() {
  return readFileSync(
    new URL("../.github/workflows/guardian-pr-check.yml", import.meta.url),
    "utf8",
  );
}

function prepareWorkflowScript() {
  const workflow = workflowSource();
  const step = workflow.indexOf(
    "- name: Resolve immutable PR metadata and exact-head admin approval",
  );
  const marker = "          script: |\n";
  const start = workflow.indexOf(marker, step);
  const end = workflow.indexOf("\n\n  review:", start);
  if (step < 0 || start < 0 || end < 0) {
    throw new Error("could not extract trusted prepare workflow script");
  }
  return workflow
    .slice(start + marker.length, end)
    .split("\n")
    .map((line) => (line.startsWith("            ") ? line.slice(12) : line))
    .join("\n");
}

function canaryPullRequest(overrides = {}) {
  return {
    number: 209,
    state: "closed",
    merged: true,
    merged_at: "2026-07-25T00:00:00Z",
    merge_commit_sha: MERGE,
    base: { ref: "main", sha: BASE },
    head: { sha: HEAD },
    user: { login: "change-author" },
    labels: [{ name: "guardian-trusted-run" }],
    ...overrides,
  };
}

async function runPrepareCanary({
  actor = "security-admin",
  pr = canaryPullRequest(),
  compare = {
    status: "ahead",
    base_commit: { sha: MERGE },
    merge_base_commit: { sha: MERGE },
  },
  reviews = [
    {
      id: 1,
      state: "APPROVED",
      commit_id: HEAD,
      user: { login: "security-admin" },
    },
  ],
} = {}) {
  const outputs = {};
  const context = {
    eventName: "workflow_dispatch",
    actor,
    ref: "refs/heads/main",
    repo: { owner: "frankxai", repo: "arcanea-ai-app" },
    payload: { repository: { default_branch: "main" } },
  };
  const github = {
    paginate: async () => reviews,
    rest: {
      pulls: {
        get: async () => ({ data: pr }),
        listReviews: async () => ({ data: reviews }),
      },
      repos: {
        getCollaboratorPermissionLevel: async () => ({
          data: { permission: "admin" },
        }),
        getBranch: async () => ({
          data: { commit: { sha: TRUSTED } },
        }),
        compareCommits: async () => ({ data: compare }),
      },
    },
  };
  const core = {
    setOutput: (key, value) => {
      outputs[key] = String(value);
    },
  };

  const previousNumber = process.env.DISPATCH_PR_NUMBER;
  const previousAcknowledgement = process.env.CANARY_ACKNOWLEDGEMENT;
  process.env.DISPATCH_PR_NUMBER = "209";
  process.env.CANARY_ACKNOWLEDGEMENT = "POST_MERGE_CANARY";
  try {
    const AsyncFunction = Object.getPrototypeOf(
      async function () {},
    ).constructor;
    const execute = new AsyncFunction(
      "context",
      "github",
      "core",
      prepareWorkflowScript(),
    );
    await execute(context, github, core);
    return outputs;
  } finally {
    if (previousNumber === undefined) delete process.env.DISPATCH_PR_NUMBER;
    else process.env.DISPATCH_PR_NUMBER = previousNumber;
    if (previousAcknowledgement === undefined) {
      delete process.env.CANARY_ACKNOWLEDGEMENT;
    } else {
      process.env.CANARY_ACKNOWLEDGEMENT = previousAcknowledgement;
    }
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function makeContext({ paths, tier, sacredTouched = false, diffSuffix = "" }) {
  const diff = [
    "diff --git a/source.js b/source.js",
    "--- a/source.js",
    "+++ b/source.js",
    "@@ -1 +1 @@",
    "-old",
    `+new${diffSuffix}`,
  ].join("\n");
  return {
    schema_version: 2,
    trusted_source_sha: TRUSTED,
    observed_trusted_source_sha: TRUSTED,
    base_sha: BASE,
    head_sha: HEAD,
    changed_entries: paths.map((path) => ({ status: "M", path })),
    changed_paths: paths,
    changed_path_count: paths.length,
    files_changed: paths.length,
    deletions: 1,
    sacred_touched: sacredTouched,
    sacred_deleted: false,
    tier,
    tier_reason:
      tier === "HIGH_RISK"
        ? "the exact-head diff touches a sacred trust-root path"
        : "the exact-head diff requires one routed semantic perspective",
    diff,
    diff_bytes: Buffer.byteLength(diff),
    diff_sha256: sha256(diff),
  };
}

const COUNCIL_CONTEXT = makeContext({
  paths: [
    ".github/workflows/guardian-pr-check.yml",
    "scripts/guardian-council.mjs",
  ],
  tier: "HIGH_RISK",
  sacredTouched: true,
});

const STANDARD_CONTEXT = makeContext({
  paths: [
    "scripts/check-1.mjs",
    "scripts/check-2.mjs",
    "scripts/check-3.mjs",
    "scripts/check-4.mjs",
    "scripts/check-5.mjs",
    "scripts/check-6.mjs",
  ],
  tier: "STANDARD",
});

function validReview(perspective, context, verdict = "approve") {
  const findings =
    verdict === "approve"
      ? []
      : [
          {
            severity: verdict === "block" ? "blocking" : "major",
            path: context.changed_paths[0],
            line: 12,
            title: "Verifier contract is incomplete",
            detail:
              "The supplied patch can report success without complete exact-head evidence.",
            evidence:
              "The independent enforcement contract is absent from the supplied patch.",
          },
        ];

  return {
    perspective: perspective.id,
    gate: perspective.gate,
    head_sha: context.head_sha,
    verdict,
    summary: `${perspective.name} semantic perspective evaluated the exact supplied patch.`,
    findings,
  };
}

function providerReport(perspective, context, verdict = "approve") {
  const modelReview = validReview(perspective, context, verdict);
  const rawText = JSON.stringify(modelReview);
  const rawPayload = {
    id: `msg_${perspective.id}`,
    type: "message",
    model: MODEL,
    stop_reason: "end_turn",
    content: [{ type: "text", text: rawText }],
    usage: {
      input_tokens: 100,
      output_tokens: 50,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
  };
  const rawProviderResponse = JSON.stringify(rawPayload);
  const request = buildProviderRequest({
    perspective,
    context,
    model: MODEL,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  });

  return {
    schema_version: 2,
    ...modelReview,
    focus: perspective.focus,
    trusted_source_sha: context.trusted_source_sha,
    base_sha: context.base_sha,
    diff_sha256: context.diff_sha256,
    provider_request: {
      api: "anthropic-messages",
      api_version: "2023-06-01",
      endpoint: "https://api.anthropic.com/v1/messages",
      configured_model: MODEL,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0,
      perspective: perspective.id,
      gate: perspective.gate,
      trusted_source_sha: context.trusted_source_sha,
      base_sha: context.base_sha,
      head_sha: context.head_sha,
      diff_sha256: context.diff_sha256,
      ...request.hashes,
      requested_at: "2026-07-25T00:00:00.000Z",
      response_received_at: "2026-07-25T00:00:01.000Z",
      attempt: 1,
    },
    provider: {
      api: "anthropic-messages",
      configured_model: MODEL,
      response_model: MODEL,
      message_id: rawPayload.id,
      stop_reason: rawPayload.stop_reason,
      raw_response_sha256: sha256(rawProviderResponse),
      usage: rawPayload.usage,
    },
    raw_provider_response: rawProviderResponse,
    prompt_estimated_tokens: 100,
    model_output_sha256: sha256(rawText),
  };
}

function writeEvidence(outputDir, mode, context) {
  const perspectives = expectedPerspectivesFor(mode, context.changed_paths);
  const reviews = perspectives.map((perspective) =>
    providerReport(perspective, context),
  );
  return writeCompleteEvidence({
    outputDir,
    mode,
    context,
    model: MODEL,
    reviews,
  });
}

function updateManifest(outputDir, update) {
  const path = join(outputDir, "manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  update(manifest);
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

test("the Council is exactly five named semantic perspectives", () => {
  assert.deepEqual(
    SEMANTIC_PERSPECTIVES.map(({ id, gate }) => [id, gate]),
    [
      ["lyssandria", "foundation"],
      ["lyria", "sight"],
      ["draconia", "fire"],
      ["alera", "voice"],
      ["elara", "starweave"],
    ],
  );
});

test("verdict precedence is block, request-changes, approve; zero is invalid", () => {
  assert.equal(
    aggregateVerdict([
      { verdict: "approve" },
      { verdict: "request-changes" },
      { verdict: "block" },
    ]),
    "block",
  );
  assert.equal(
    aggregateVerdict([{ verdict: "approve" }, { verdict: "request-changes" }]),
    "request-changes",
  );
  assert.equal(aggregateVerdict([{ verdict: "approve" }]), "approve");
  assert.throws(() => aggregateVerdict([]), /zero semantic perspective/);
});

test("review validation rejects a report bound to the wrong head", () => {
  const perspective = SEMANTIC_PERSPECTIVES[0];
  assert.throws(
    () =>
      validateReview(
        {
          ...validReview(perspective, COUNCIL_CONTEXT),
          head_sha: "d".repeat(40),
        },
        {
          perspective,
          headSha: HEAD,
          changedPaths: COUNCIL_CONTEXT.changed_paths,
        },
      ),
    /not bound to exact head/,
  );
});

test("review validation rejects findings outside the exact-head diff", () => {
  const perspective = SEMANTIC_PERSPECTIVES[0];
  const review = validReview(perspective, COUNCIL_CONTEXT, "request-changes");
  review.findings[0].path = "apps/web/unrelated.tsx";
  assert.throws(
    () =>
      validateReview(review, {
        perspective,
        headSha: HEAD,
        changedPaths: COUNCIL_CONTEXT.changed_paths,
      }),
    /not part of the exact-head diff/,
  );
});

test("terminal verdicts require matching finding severity", () => {
  const perspective = SEMANTIC_PERSPECTIVES[0];
  const invalidApprove = validReview(
    perspective,
    COUNCIL_CONTEXT,
    "request-changes",
  );
  invalidApprove.verdict = "approve";
  assert.throws(
    () =>
      validateReview(invalidApprove, {
        perspective,
        headSha: HEAD,
        changedPaths: COUNCIL_CONTEXT.changed_paths,
      }),
    /approve cannot contain/,
  );

  const invalidBlock = validReview(
    perspective,
    COUNCIL_CONTEXT,
    "request-changes",
  );
  invalidBlock.verdict = "block";
  assert.throws(
    () =>
      validateReview(invalidBlock, {
        perspective,
        headSha: HEAD,
        changedPaths: COUNCIL_CONTEXT.changed_paths,
      }),
    /block requires a blocking/,
  );
});

test("Council validation rejects missing, duplicate, and wrong-gate perspectives", () => {
  const reviews = SEMANTIC_PERSPECTIVES.map((perspective) =>
    validReview(perspective, COUNCIL_CONTEXT),
  );
  assert.throws(
    () => validateReviewSet(reviews.slice(0, 4), SEMANTIC_PERSPECTIVES),
    /expected 5 semantic perspective reports/,
  );
  assert.throws(
    () =>
      validateReviewSet(
        [reviews[0], reviews[0], reviews[2], reviews[3], reviews[4]],
        SEMANTIC_PERSPECTIVES,
      ),
    /duplicate semantic perspective/,
  );
  const wrongGate = reviews.map((review) => ({ ...review }));
  wrongGate[0].gate = "sight";
  assert.throws(
    () => validateReviewSet(wrongGate, SEMANTIC_PERSPECTIVES),
    /expected foundation gate evidence/,
  );
});

test("STANDARD routing is deterministic from independently changed paths", () => {
  assert.equal(
    selectSinglePerspective(["apps/web/components/Hero.tsx"]).id,
    "lyria",
  );
  assert.equal(
    selectSinglePerspective(["supabase/migrations/001.sql"]).id,
    "lyssandria",
  );
  assert.equal(selectSinglePerspective(["docs/ops/incident.md"]).id, "alera");
  assert.equal(
    selectSinglePerspective(["scripts/performance/benchmark.mjs"]).id,
    "draconia",
  );
});

test("review context diffs immutable PR objects while remaining on trusted source", () => {
  const repository = mkdtempSync(join(tmpdir(), "arcanea-trusted-git-"));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repository,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    git("init");
    git("config", "user.name", "Guardian Contract Test");
    git("config", "user.email", "guardian-test@arcanea.invalid");
    writeFileSync(join(repository, "source.js"), "export const value = 1;\n");
    git("add", "source.js");
    git("commit", "-m", "base");
    const base = git("rev-parse", "HEAD");

    writeFileSync(join(repository, "source.js"), "export const value = 2;\n");
    git("add", "source.js");
    git("commit", "-m", "head");
    const head = git("rev-parse", "HEAD");
    git("checkout", "--detach", base);

    const context = resolveReviewContext({
      trustedSha: base,
      baseSha: base,
      expectedHeadSha: head,
      cwd: repository,
    });
    assert.equal(git("rev-parse", "HEAD"), base);
    assert.equal(context.trusted_source_sha, base);
    assert.equal(context.observed_trusted_source_sha, base);
    assert.equal(context.head_sha, head);
    assert.match(context.diff, /value = 2/);
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});

test("deleting a sacred path is independently classified BLOCKED", () => {
  const repository = mkdtempSync(join(tmpdir(), "arcanea-sacred-delete-"));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repository,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    git("init");
    git("config", "user.name", "Guardian Contract Test");
    git("config", "user.email", "guardian-test@arcanea.invalid");
    mkdirSync(join(repository, ".github", "workflows"), { recursive: true });
    const sacredPath = join(repository, ".github", "workflows", "critical.yml");
    writeFileSync(sacredPath, "name: critical\n");
    git("add", ".github/workflows/critical.yml");
    git("commit", "-m", "base");
    const base = git("rev-parse", "HEAD");

    unlinkSync(sacredPath);
    git("add", ".github/workflows/critical.yml");
    git("commit", "-m", "SACRED-DELETE: author marker cannot override");
    const head = git("rev-parse", "HEAD");
    git("checkout", "--detach", base);

    const context = resolveReviewContext({
      trustedSha: base,
      baseSha: base,
      expectedHeadSha: head,
      cwd: repository,
    });
    assert.equal(context.sacred_deleted, true);
    assert.equal(context.tier, "BLOCKED");
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});

test("content-addressed Council evidence verifies and diff tampering fails", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-council-"));
  try {
    writeEvidence(outputDir, "council", COUNCIL_CONTEXT);
    const manifest = verifyEvidenceDirectory({
      outputDir,
      expectedContext: COUNCIL_CONTEXT,
      expectedMode: "council",
    });
    assert.equal(manifest.aggregate_verdict, "approve");

    writeFileSync(
      join(outputDir, "diff.patch"),
      `${COUNCIL_CONTEXT.diff}\ntampered`,
      "utf8",
    );
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: COUNCIL_CONTEXT,
          expectedMode: "council",
        }),
      /(artifact digest mismatch|independently recomputed exact-head diff)/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("failure evidence remains inspectable but cannot satisfy enforcement", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-failure-"));
  try {
    writeFailureEvidence({
      outputDir,
      mode: "council",
      context: COUNCIL_CONTEXT,
      code: "missing-configuration",
      message: "required configuration is absent",
    });
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: COUNCIL_CONTEXT,
          expectedMode: "council",
        }),
      /did not complete/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("provider provenance and raw response must agree", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-provider-"));
  try {
    writeEvidence(outputDir, "council", COUNCIL_CONTEXT);
    const reviewPath = join(outputDir, "review-lyssandria.json");
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    review.provider.message_id = "msg_forged";
    writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`, "utf8");
    updateManifest(outputDir, (manifest) => {
      const artifact = manifest.artifacts.find(
        ({ path }) => path === "review-lyssandria.json",
      );
      const bytes = readFileSync(reviewPath);
      artifact.sha256 = sha256(bytes);
      artifact.bytes = bytes.byteLength;
    });
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: COUNCIL_CONTEXT,
          expectedMode: "council",
        }),
      /raw provider response does not match normalized provenance/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("forged zero-review STANDARD evidence blocks", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-zero-standard-"));
  try {
    writeEvidence(outputDir, "single", STANDARD_CONTEXT);
    const required = expectedPerspectivesFor(
      "single",
      STANDARD_CONTEXT.changed_paths,
    )[0];
    unlinkSync(join(outputDir, `review-${required.id}.json`));
    updateManifest(outputDir, (manifest) => {
      manifest.perspective_count = 0;
      manifest.required_perspectives = [];
      manifest.artifacts = manifest.artifacts.filter(
        ({ path }) => !path.startsWith("review-"),
      );
    });
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: STANDARD_CONTEXT,
          expectedMode: "single",
        }),
      /(artifact set|perspective_count|required_perspectives)/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("mutually rewritten manifest, context, diff, and reports cannot replace independent context", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-rewritten-"));
  try {
    const forgedContext = makeContext({
      paths: [
        "scripts/forged-1.mjs",
        "scripts/forged-2.mjs",
        "scripts/forged-3.mjs",
        "scripts/forged-4.mjs",
        "scripts/forged-5.mjs",
        "scripts/forged-6.mjs",
      ],
      tier: "STANDARD",
      diffSuffix: "-forged",
    });
    writeEvidence(outputDir, "single", forgedContext);
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: STANDARD_CONTEXT,
          expectedMode: "single",
        }),
      /independently recomputed trusted\/base\/head\/diff context/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("expected base and head mismatches block even with internally consistent evidence", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-sha-mismatch-"));
  try {
    writeEvidence(outputDir, "single", STANDARD_CONTEXT);
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: {
            ...STANDARD_CONTEXT,
            base_sha: "d".repeat(40),
          },
          expectedMode: "single",
        }),
      /independently recomputed trusted\/base\/head\/diff context/,
    );
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: {
            ...STANDARD_CONTEXT,
            head_sha: "e".repeat(40),
          },
          expectedMode: "single",
        }),
      /independently recomputed trusted\/base\/head\/diff context/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("manifest perspective_count mismatch blocks", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-count-"));
  try {
    writeEvidence(outputDir, "single", STANDARD_CONTEXT);
    updateManifest(outputDir, (manifest) => {
      manifest.perspective_count = 5;
    });
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: STANDARD_CONTEXT,
          expectedMode: "single",
        }),
      /perspective_count 5 does not match independently required 1/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("STANDARD cannot choose its required perspective from the manifest", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "arcanea-route-forge-"));
  try {
    writeEvidence(outputDir, "single", STANDARD_CONTEXT);
    updateManifest(outputDir, (manifest) => {
      manifest.required_perspectives = [
        { perspective: "elara", gate: "starweave" },
      ];
    });
    assert.throws(
      () =>
        verifyEvidenceDirectory({
          outputDir,
          expectedContext: STANDARD_CONTEXT,
          expectedMode: "single",
        }),
      /required_perspectives does not match independent routing/,
    );
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
});

test("commit-message markers never bypass BLOCKED classification", () => {
  assert.equal(
    classifyRisk({
      filesChanged: 501,
      deletions: 0,
      sacredTouched: false,
      sacredDeleted: false,
      commitMessage: "BIG-CHANGE: author supplied marker",
    }).tier,
    "BLOCKED",
  );
  assert.equal(
    classifyRisk({
      filesChanged: 1,
      deletions: 1,
      sacredTouched: true,
      sacredDeleted: true,
      commitMessage: "SACRED-DELETE: author supplied marker",
    }).tier,
    "BLOCKED",
  );
});

test("all diff metadata disables external diff and text conversion", () => {
  const verifier = readFileSync(
    new URL("./guardian-council.mjs", import.meta.url),
    "utf8",
  );
  assert.match(
    verifier,
    /\[\s*"diff",\s*"--name-status",\s*"--no-ext-diff",\s*"--no-textconv",\s*"-z"/,
  );
  assert.match(
    verifier,
    /\["diff",\s*"--shortstat",\s*"--no-ext-diff",\s*"--no-textconv"/,
  );
});

test("workflow trust boundary is immutable, pinned, and never checks out PR code", () => {
  const workflow = workflowSource();
  assert.match(workflow, /^\s{2}pull_request_target:/m);
  assert.doesNotMatch(workflow, /^\s{2}pull_request:/m);
  assert.doesNotMatch(workflow, /^\s*git checkout\b/m);
  assert.doesNotMatch(workflow, /ref:\s*\$\{\{[^}\n]*head/i);
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.doesNotMatch(workflow, /persist-credentials:\s*true/);
  assert.match(
    workflow,
    /GUARDIAN_FETCH_TOKEN:\s*\$\{\{\s*github\.token\s*\}\}/,
  );
  assert.match(
    workflow,
    /GIT_CONFIG_KEY_0=http\.https:\/\/github\.com\/\.extraheader/,
  );
  assert.match(
    workflow,
    /GIT_CONFIG_VALUE_0="AUTHORIZATION: basic \$AUTH_HEADER"/,
  );

  const actionUses = workflow
    .split("\n")
    .filter((line) => /^\s*uses:\s*/.test(line));
  assert.ok(actionUses.length > 0);
  for (const line of actionUses) {
    assert.match(line, /@[0-9a-f]{40}(?:\s+#.*)?$/);
  }

  const secretExpressions = workflow
    .split("\n")
    .filter((line) => line.includes("secrets.ANTHROPIC_API_KEY"));
  assert.equal(secretExpressions.length, 1);
  assert.ok(
    workflow.indexOf("Run trusted semantic perspectives") <
      workflow.indexOf(secretExpressions[0]),
  );
  assert.doesNotMatch(
    workflow,
    /grep[^\n]*(BIG-CHANGE|SACRED-DELETE|MASS-REFACTOR)/,
  );
});

test("post-merge canary rejects dispatch by the PR author", async () => {
  await assert.rejects(
    () => runPrepareCanary({ actor: "change-author" }),
    /must be dispatched by a non-author/,
  );
});

test("post-merge canary rejects an unmerged PR", async () => {
  await assert.rejects(
    () =>
      runPrepareCanary({
        pr: canaryPullRequest({
          state: "open",
          merged: false,
          merged_at: null,
          merge_commit_sha: null,
        }),
      }),
    /requires a merged PR with an immutable merge commit/,
  );
});

test("post-merge canary rejects a merge absent from current default-branch ancestry", async () => {
  await assert.rejects(
    () =>
      runPrepareCanary({
        compare: {
          status: "diverged",
          base_commit: { sha: MERGE },
          merge_base_commit: { sha: BASE },
        },
      }),
    /not an ancestor of the current trusted default branch/,
  );
});

test("post-merge canary accepts non-author admin only when merge is on current default branch", async () => {
  const outputs = await runPrepareCanary();
  assert.equal(outputs.trusted_sha, TRUSTED);
  assert.equal(outputs.base_sha, BASE);
  assert.equal(outputs.head_sha, HEAD);
  assert.equal(outputs.authorized, "true");
  assert.equal(outputs.authorized_by, "security-admin");
});

test("CODEOWNERS records the non-author bootstrap limitation", () => {
  const codeowners = readFileSync(
    new URL("../.github/CODEOWNERS", import.meta.url),
    "utf8",
  );
  assert.match(codeowners, /single-owner mapping cannot/i);
  assert.match(codeowners, /satisfy that contract/i);
  assert.match(
    codeowners,
    /\/\.github\/workflows\/guardian-pr-check\.yml\s+@frankxai/,
  );
  assert.match(codeowners, /\/scripts\/guardian-council\.mjs\s+@frankxai/);
});
