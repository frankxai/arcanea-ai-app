import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  validateRun,
  validateArtifact,
  validateEvidence,
  validateReview,
  selectEvidence,
  reviewRun,
  alreadyReviewed,
  renderReview,
  generationBudget,
  providerReceipt,
  parseProviderReview,
  failureReceipt,
} from "./excellence-review.mjs";

const head = "a".repeat(40);
const base = "b".repeat(40);
const built = "c".repeat(40);
const repoId = 123;
const repository = "example/arcanea";
const run = {
  id: 321,
  name: "CI",
  path: ".github/workflows/ci.yml",
  event: "pull_request",
  status: "completed",
  conclusion: "success",
  head_sha: head,
  repository: { id: repoId, full_name: repository },
  head_repository: { id: repoId },
  pull_requests: [
    {
      number: 7,
      head: { sha: head, repo: { id: repoId } },
      base: { sha: base, repo: { id: repoId } },
    },
  ],
};
const pr = {
  state: "open",
  draft: false,
  head: { sha: head, repo: { id: repoId } },
};
const artifact = {
  id: 55,
  name: `galleries-built-app-${built}`,
  expired: false,
  size_in_bytes: 1000,
  digest: `sha256:${"d".repeat(64)}`,
  workflow_run: {
    id: run.id,
    head_sha: head,
    repository_id: repoId,
    head_repository_id: repoId,
  },
};
const merge = { sha: built, parents: [{ sha: base }, { sha: head }] };
const files = [{ filename: "apps/web/app/lab/orthea/encounter.tsx" }];
const selection = selectEvidence(files);
const evidence = {
  "built-app-manifest.json": { builtCommit: built, reviewedSourceCommit: head },
  "orthea/report.json": {
    builtCommit: built,
    screenshots: selection.images.map((name) => name.slice(7)),
  },
  ...Object.fromEntries(
    selection.images.map((name) => [
      name,
      {
        data: "png",
        sha256: "d".repeat(64),
        bytes: 3,
        width: 375,
        height: 812,
      },
    ]),
  ),
};
const clear = {
  verdict: "clear",
  summary: "No visible defects in these five states.",
  findings: [],
};

test("a rejected provider verdict has a safe, distinguishable boundary reason", () => {
  assert.throws(
    () => validateReview({ verdict: "ship" }, selection.images),
    (error) =>
      error.name === "ReviewBoundaryError" &&
      error.message === "Invalid visual verdict",
  );
});

test("provider receipt preserves bounded final answer and numeric usage without thought parts or envelope data", () => {
  const receipt = providerReceipt({
    candidates: [
      {
        finishReason: "STOP",
        content: {
          parts: [
            { thought: true, text: "private reasoning bait" },
            { text: JSON.stringify(clear) },
          ],
        },
        credential: "secret envelope bait",
      },
    ],
    usageMetadata: {
      thoughtsTokenCount: 1000,
      candidatesTokenCount: 300,
      totalTokenCount: "untrusted",
      random: "bait",
    },
  });
  assert.deepEqual(receipt.usage, {
    candidatesTokenCount: 300,
    thoughtsTokenCount: 1000,
  });
  assert.deepEqual(parseProviderReview(receipt), clear);
  assert.doesNotMatch(JSON.stringify(receipt), /bait|private reasoning/);
  assert.equal(
    providerReceipt({ candidates: [{ finishReason: "secret bait" }] })
      .finishReason,
    "UNKNOWN",
  );
});

test("truncated, blocked, ambiguous and invalid provider responses retain diagnostics and cannot produce a review", () => {
  for (const payload of [
    {
      candidates: [
        {
          finishReason: "MAX_TOKENS",
          content: { parts: [{ text: '{"verdict":' }] },
        },
      ],
      usageMetadata: { thoughtsTokenCount: 4096 },
    },
    { candidates: [{ finishReason: "SAFETY" }] },
    { candidates: [{ finishReason: "STOP" }, { finishReason: "STOP" }] },
    {
      candidates: [
        {
          finishReason: "STOP",
          content: { parts: [{ text: "not valid JSON" }] },
        },
      ],
    },
    {
      candidates: [
        {
          finishReason: "STOP",
          content: { parts: [{ text: "x".repeat(17000) }] },
        },
      ],
    },
  ]) {
    const receipt = providerReceipt(payload);
    assert.ok(receipt.answer.length <= 16000);
    assert.throws(() => parseProviderReview(receipt), {
      name: "ReviewBoundaryError",
    });
  }
});

test("failure receipts reveal only static boundary reasons and reserve bounded answer capacity", () => {
  const unsafe = failureReceipt(
    new Error("https://signed.example/?secret=DO_NOT_RECORD"),
    "independent image critique",
  );
  assert.doesNotMatch(JSON.stringify(unsafe), /signed\.example|DO_NOT_RECORD/);
  assert.equal(unsafe.shipVerdictIssued, false);
  try {
    validateReview({ verdict: "ship" }, selection.images);
  } catch (error) {
    assert.equal(
      failureReceipt(error, "independent image critique").reason,
      "Invalid visual verdict",
    );
  }
  assert.equal(generationBudget.maxOutputTokens, 4096);
  assert.equal(generationBudget.thinkingConfig.thinkingBudget, 1024);
});

function harness(overrides = {}) {
  const calls = [];
  const saved = [];
  let reads = 0;
  const dependencies = {
    run: structuredClone(run),
    repository,
    async github(path, options) {
      calls.push({ path, options });
      if (options?.method === "POST") return { id: 1 };
      if (path.endsWith("/pulls/7")) {
        reads += 1;
        return overrides.prAt ? overrides.prAt(reads) : structuredClone(pr);
      }
      if (path.includes("/comments?")) return overrides.comments ?? [];
      if (path.includes("/compare/"))
        return { files: overrides.files ?? files };
      if (path.includes("/artifacts?"))
        return { total_count: 1, artifacts: [overrides.artifact ?? artifact] };
      if (path.includes("/git/commits/")) return merge;
      throw new Error(`Unexpected test API path ${path}`);
    },
    async extract() {
      calls.push({ extract: true });
      return overrides.evidence ?? structuredClone(evidence);
    },
    async critique() {
      calls.push({ critique: true });
      return overrides.review ?? structuredClone(clear);
    },
    async save(receipt) {
      saved.push(receipt);
    },
  };
  return {
    dependencies,
    calls,
    saved,
    posts: () => calls.filter((call) => call.options?.method === "POST"),
  };
}

test("review workflow uses only actions admitted by the repository policy", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/excellence-loop.yml", import.meta.url),
    "utf8",
  );
  const actions = [...workflow.matchAll(/uses:\s*([^\s#]+)/g)].map(
    (match) => match[1],
  );
  assert.ok(actions.length > 0);
  assert.deepEqual(
    actions.filter(
      (action) => !/^(actions\/[^@]+|pnpm\/action-setup)@/.test(action),
    ),
    [],
  );
});

test("workflow does not check out or execute the reviewed head, install dependencies, or grant content writes", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/excellence-loop.yml", import.meta.url),
    "utf8",
  );
  assert.match(workflow, /ref: \$\{\{ github\.workflow_sha \}\}/);
  assert.match(workflow, /contents: read/);
  assert.doesNotMatch(
    workflow,
    /contents: write|git push|allowed_tools|anthropic|pnpm install|head_sha \}\}/,
  );
});

test("valid CI source and artifact are bound to both merge parents", () => {
  assert.equal(validateRun(run, repository).number, 7);
  assert.equal(validateArtifact(artifact, run, merge), built);
  validateEvidence(evidence, selection, run, built);
});

for (const [label, modify] of [
  [
    "fork",
    (value) => {
      value.head_repository.id = 999;
    },
  ],
  [
    "failed CI",
    (value) => {
      value.conclusion = "failure";
    },
  ],
  [
    "different workflow",
    (value) => {
      value.path = ".github/workflows/untrusted.yml";
    },
  ],
  [
    "missing PR association",
    (value) => {
      value.pull_requests = [];
    },
  ],
  [
    "forged association",
    (value) => {
      value.pull_requests[0].head.sha = base;
    },
  ],
]) {
  test(`reject ${label} before provider access`, async () => {
    const h = harness();
    modify(h.dependencies.run);
    await assert.rejects(reviewRun(h.dependencies));
    assert.equal(h.calls.length, 0);
  });
}

test("reject foreign, expired, oversized, digestless and wrong-build artifacts", () => {
  for (const value of [
    { ...artifact, expired: true },
    { ...artifact, size_in_bytes: 70 * 1024 * 1024 },
    { ...artifact, digest: "" },
    { ...artifact, workflow_run: { ...artifact.workflow_run, head_sha: base } },
  ])
    assert.throws(() => validateArtifact(value, run, merge));
  assert.throws(() =>
    validateArtifact(artifact, run, {
      ...merge,
      parents: [{ sha: head }, { sha: "f".repeat(40) }],
    }),
  );
});

test("source/report/image mismatch stops the provider and publication", async () => {
  const bad = structuredClone(evidence);
  bad["built-app-manifest.json"].reviewedSourceCommit = base;
  const h = harness({ evidence: bad });
  await assert.rejects(reviewRun(h.dependencies), /manifest source/);
  assert.equal(
    h.calls.some((call) => call.critique),
    false,
  );
  assert.equal(h.posts().length, 0);
});

test("complete review posts only after three current-head checks and saves hashed evidence", async () => {
  const h = harness();
  const result = await reviewRun(h.dependencies);
  assert.equal(result.status, "reviewed");
  assert.equal(
    h.calls.filter((call) => call.path?.endsWith("/pulls/7")).length,
    3,
  );
  assert.equal(h.posts().length, 1);
  assert.equal(h.saved[0].captures.length, 5);
  assert.equal(h.saved[0].artifact.digest, artifact.digest);
  assert.match(h.posts()[0].options.body.body, /not a ship verdict/);
});

for (const changedAt of [1, 2, 3]) {
  test(`head change at read ${changedAt} never posts a stale review`, async () => {
    const h = harness({
      prAt: (count) =>
        count >= changedAt ? { ...pr, head: { ...pr.head, sha: base } } : pr,
    });
    await assert.rejects(reviewRun(h.dependencies), /newer head/);
    assert.equal(h.posts().length, 0);
    assert.equal(
      h.calls.some((call) => call.critique),
      changedAt === 3,
    );
  });
}

test("unknown surface produces explicit missing coverage without using the provider", async () => {
  const h = harness({ files: [{ filename: "apps/web/app/books/page.tsx" }] });
  const result = await reviewRun(h.dependencies);
  assert.equal(result.receipt.review.verdict, "needs_review");
  assert.equal(
    h.calls.some((call) => call.critique || call.extract),
    false,
  );
});

test("mixed scope reviews covered pixels and retains unassessed files prominently", async () => {
  const h = harness({
    files: [...files, { filename: "apps/web/middleware.ts" }],
  });
  const result = await reviewRun(h.dependencies);
  assert.deepEqual(result.receipt.uncovered, ["apps/web/middleware.ts"]);
  assert.match(h.posts()[0].options.body.body, /Unassessed changed files/);
});

test("non-visual package changes consume no model request or PR comment", async () => {
  const h = harness({
    files: [{ filename: "packages/arcanea-mcp/src/index.ts" }],
  });
  assert.equal((await reviewRun(h.dependencies)).status, "no-visual-change");
  assert.equal(h.posts().length, 0);
});

test("renamed-away files and multi-profile image limits retain missing coverage", () => {
  assert.ok(
    selectEvidence([
      {
        filename: "docs/old.tsx",
        previous_filename: "apps/web/app/books/page.tsx",
      },
    ]).uncovered.length,
  );
  assert.equal(
    selectEvidence([
      ...files,
      { filename: "apps/web/app/gallery/sovereign-depths/page.tsx" },
    ]).exceedsLimit,
    true,
  );
  assert.throws(() =>
    selectEvidence(Array.from({ length: 101 }, () => files[0])),
  );
});

test("human marker injection cannot suppress review; matching bot receipt can", async () => {
  const body = renderReview({ head, ciRun: run.id, images: [], review: clear });
  assert.equal(
    alreadyReviewed(
      [{ user: { login: "someone", type: "User" }, body }],
      head,
      run.id,
    ),
    false,
  );
  const h = harness({
    comments: [{ user: { login: "github-actions[bot]", type: "Bot" }, body }],
  });
  assert.equal((await reviewRun(h.dependencies)).status, "already-reviewed");
  assert.equal(
    h.calls.some((call) => call.critique),
    false,
  );
});

test("invalid, contradictory and invented-image findings fail before publication", async () => {
  const finding = {
    clause: "D1",
    image: selection.images[0],
    quote: "Competing titles",
    fix: "Reduce the secondary title.",
  };
  for (const review of [
    { ...clear, verdict: "ship" },
    { ...clear, summary: "" },
    { ...clear, findings: [finding] },
    { ...clear, verdict: "refine" },
    {
      ...clear,
      verdict: "refine",
      findings: [{ ...finding, image: "imaginary.png" }],
    },
    { ...clear, verdict: "refine", findings: [{ ...finding, clause: "A1" }] },
  ]) {
    const h = harness({ review });
    await assert.rejects(reviewRun(h.dependencies));
    assert.equal(h.posts().length, 0);
  }
  assert.equal(
    validateReview(
      {
        verdict: "refine",
        summary: "Clarify the hierarchy.",
        findings: [finding],
      },
      selection.images,
    ).verdict,
    "refine",
  );
});

test("model text cannot create mentions, HTML, images, or new Markdown headings", () => {
  const body = renderReview({
    head,
    ciRun: run.id,
    images: [],
    review: {
      ...clear,
      summary: "@owner <script> ![x](https://example.com)\n# injected",
    },
  });
  assert.doesNotMatch(body, /@owner|<script>|!\[x\]|\n# injected/);
});

test("Python ZIP seam accepts a PNG and rejects traversal, duplicates, symlinks, bombs and malformed data", async () => {
  const python = process.platform === "win32" ? "python" : "python3";
  const script = fileURLToPath(
    new URL("./excellence-artifact.py", import.meta.url),
  );
  const code = `
import base64, json, pathlib, runpy, stat, struct, sys, tempfile, warnings, zipfile
read = runpy.run_path(sys.argv[1])['read_evidence']
png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=')
with tempfile.TemporaryDirectory(prefix='arcanea-evidence-test-') as directory:
    path = pathlib.Path(directory) / 'test.zip'
    def archive(entries):
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
                for name, data in entries:
                    if isinstance(name, str):
                        info = zipfile.ZipInfo(name)
                        info.filename = name
                    else: info = name
                    z.writestr(info, data)
    archive([('ok.png', png), ('meta.json', b'{"builtCommit":"abc"}')])
    result = read(path, ['ok.png', 'meta.json'])
    assert result['ok.png']['width'] == 1 and result['meta.json']['builtCommit'] == 'abc'
    symlink = zipfile.ZipInfo('link'); symlink.external_attr = (stat.S_IFLNK | 0o777) << 16
    huge = bytearray(png); huge[16:24] = struct.pack('>II', 50000, 50000)
    cases = [
        ([('../escape', b'x'), ('ok.png', png)], ['ok.png']),
        ([('/absolute', b'x'), ('ok.png', png)], ['ok.png']),
        ([('C:drive', b'x'), ('ok.png', png)], ['ok.png']),
        ([('a\\\\b', b'x'), ('ok.png', png)], ['ok.png']),
        ([('ok.png', png), ('ok.png', png)], ['ok.png']),
        ([(symlink, b'outside'), ('ok.png', png)], ['ok.png']),
        ([('ok.png', b'<script>')], ['ok.png']),
        ([('ok.png', huge)], ['ok.png']),
        ([('ok.png', png)], ['missing.png']),
        ([('ok.png', png)], ['ok.png', 'ok.png']),
        ([('ok.png', png + b'x' * (3 * 1024 * 1024))], ['ok.png']),
        ([(str(i), b'x') for i in range(201)], ['0']),
        ([('meta.json', b'not json')], ['meta.json']),
    ]
    for index, (entries, names) in enumerate(cases):
        archive(entries)
        try: read(path, names)
        except Exception: pass
        else: raise AssertionError('Unsafe archive accepted: ' + str(index))
print('13 hostile archive cases rejected; valid PNG/JSON accepted')
`;
  const { stdout } = await promisify(execFile)(
    python,
    ["-B", "-c", code, script],
    { timeout: 15000 },
  );
  assert.match(stdout, /13 hostile archive cases rejected/);
});
