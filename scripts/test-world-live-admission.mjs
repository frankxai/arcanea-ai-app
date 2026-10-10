import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, relative, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";

test("actual live acceptance rejects missing, forged and mismatched review before containers or models", () => {
  const dir = mkdtempSync(join(tmpdir(), "world-admission-"));
  const within = relative(realpathSync(tmpdir()), realpathSync(dir));
  assert.ok(within && !within.startsWith("..") && !isAbsolute(within));
  try {
    const script = join(dir, "runner.mjs");
    writeFileSync(
      script,
      readFileSync("scripts/run-world-service-fixture.mjs"),
    );
    const preload = join(dir, "offline.mjs"),
      marker = join(dir, "docker-boundary");
    const head = "a".repeat(40),
      source = "Fixture source\n";
    const hash = (s) => createHash("sha256").update(s).digest("hex");
    const review = JSON.stringify({
      verdict: "PASS",
      reviewedCommit: head,
      critical: [],
      high: [],
      medium: [],
    });
    const receipt = {
      repository: "frankxai/arcanea-ai-app",
      pr: 561,
      headSha: head,
      maker: "codex",
      provider: "Gemini",
      verdict: "PASS",
      blockingFindings: [],
      reviewedFiles: ["fixture.ts"],
      review,
      reviewSha256: hash(review),
      packetSha256: hash("Complete fixture packet"),
      sourceHashes: { "fixture.ts": hash(source) },
    };
    writeFileSync(
      preload,
      `import cp from 'node:child_process';import {syncBuiltinESMExports} from 'node:module';import {writeFileSync} from 'node:fs';cp.execFileSync=(command,args)=>{if(command==='git'){if(args[0]==='rev-parse')return '${head}\\n';if(args[0]==='diff')return 'fixture.ts\\n';if(args[0]==='show')return Buffer.from(${JSON.stringify(source)});}if(command==='docker'){writeFileSync(process.env.TEST_MARKER,'Reached offline container boundary');throw Error('Offline container boundary');}throw Error('Unexpected subprocess');};syncBuiltinESMExports();globalThis.fetch=async url=>{if(!String(url).startsWith('https://api.github.com/repos/frankxai/arcanea-ai-app/issues/561/comments?'))throw Error('Unexpected provider request');return {ok:true,json:async()=>JSON.parse(process.env.TEST_COMMENTS)};};`,
    );
    const comment = (r = receipt, id = 132689939) => ({
      user: { id },
      body: "STARLIGHT-INDEPENDENT-REVIEW-V1\n" + JSON.stringify(r),
    });
    const cases = [
      [],
      [comment(receipt, 7)],
      [comment({ ...receipt, headSha: "b".repeat(40) })],
      [comment({ ...receipt, reviewSha256: "0".repeat(64) })],
      [comment({ ...receipt, sourceHashes: { "fixture.ts": "0".repeat(64) } })],
      [
        comment({
          ...receipt,
          blockingFindings: [{ description: "Unresolved" }],
        }),
      ],
    ];
    const run = (comments) =>
      spawnSync(
        process.execPath,
        ["--import", pathToFileURL(preload).href, script],
        {
          cwd: dir,
          encoding: "utf8",
          timeout: 10000,
          env: {
            PATH: process.env.PATH,
            SystemRoot: process.env.SystemRoot || "",
            GITHUB_ACTIONS: "true",
            GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
            GITHUB_REF_NAME: "agent/codex/world-creator-recovery-20261010",
            GITHUB_SHA: head,
            RUNNER_TEMP: dir,
            GITHUB_RUN_ID: "fixture",
            GITHUB_RUN_ATTEMPT: "1",
            WORLD_TEST_API_KEY: "offline-fixture-key",
            WORLD_LIVE_GENERATION: "true",
            TEST_COMMENTS: JSON.stringify(comments),
            TEST_MARKER: marker,
          },
        },
      );
    for (const comments of cases) {
      const result = run(comments);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /No independently reviewed exact source/);
      assert.equal(existsSync(marker), false);
    }
    const admitted = run([comment()]);
    assert.equal(admitted.status, 1);
    assert.equal(existsSync(marker), true);
    assert.match(admitted.stderr, /Offline container boundary/);
    assert.equal(
      JSON.parse(
        readFileSync(
          join(dir, "screenshots/world-service/service-receipt.json"),
        ),
      ).providerCalls,
      0,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
