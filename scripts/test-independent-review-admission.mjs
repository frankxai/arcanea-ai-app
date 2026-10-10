import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  existsSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "AGENTS.md",
  "ops/NEXT-PROMPTS.md",
  "ops/OPS-LEDGER.md",
  "ops/sessions/2026-10-10.md",
];

test("actual review script rejects unpinned, mismatched and expanded handovers before provider access", () => {
  const temporary = mkdtempSync(join(tmpdir(), "arcanea-review-admission-"));
  const within = relative(realpathSync(tmpdir()), realpathSync(temporary));
  assert.ok(within && !within.startsWith("..") && !isAbsolute(within));
  try {
    const hub = join(temporary, ".review-hub");
    mkdirSync(join(hub, "ops/sessions"), { recursive: true });
    execFileSync("git", ["init", "--quiet", "--object-format=sha1", hub]);
    const git = (args, input) =>
      execFileSync("git", args, {
        cwd: hub,
        input,
        encoding: "utf8",
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: "Fixture",
          GIT_AUTHOR_EMAIL: "fixture@example.invalid",
          GIT_COMMITTER_NAME: "Fixture",
          GIT_COMMITTER_EMAIL: "fixture@example.invalid",
        },
      }).trim();
    const commit = (parent) => {
      git(["add", "--", ...files]);
      const tree = git(["write-tree"]);
      const head = git(
        ["commit-tree", tree, ...(parent ? ["-p", parent] : [])],
        "Admission fixture\n",
      );
      git(["update-ref", "HEAD", head]);
      return head;
    };
    for (const path of files)
      writeFileSync(join(hub, path), "Existing record\n");
    const base = commit();
    for (const path of files.slice(1))
      writeFileSync(join(hub, path), "Existing record\nRelease evidence\n");
    const head = commit(base);
    const script = join(temporary, "review.mjs");
    writeFileSync(
      script,
      readFileSync(join(root, "scripts/review-author-recovery.mjs")),
    );
    const marker = join(temporary, "provider-accessed");
    const preload = join(temporary, "offline.mjs");
    writeFileSync(
      preload,
      'import { writeFileSync } from "node:fs"; globalThis.fetch = async () => { writeFileSync(process.env.REVIEW_TEST_MARKER, "Reached provider boundary without network"); throw Error("Offline fixture"); };',
    );
    const env = {
      ...Object.fromEntries(
        ["PATH", "Path", "SystemRoot", "TEMP", "TMP"]
          .filter((key) => process.env[key])
          .map((key) => [key, process.env[key]]),
      ),
      GITHUB_REF_NAME: "agent/codex/review-handover-20261010",
      GITHUB_SHA: head,
      GEMINI_API_KEY: "nonsecret-offline-fixture",
      REVIEW_TARGET: "hub-release",
      REVIEW_HUB_HEAD: head,
      REVIEW_HUB_BASE: base,
      REVIEW_TEST_MARKER: marker,
    };
    const run = (overrides, cwd = temporary) =>
      spawnSync(
        process.execPath,
        ["--import", pathToFileURL(preload).href, script],
        {
          cwd,
          env: { ...env, ...overrides },
          encoding: "utf8",
          timeout: 10_000,
        },
      );
    const rejected = (overrides, message, cwd) => {
      const result = run(overrides, cwd);
      assert.equal(result.error, undefined);
      assert.equal(result.status, 1);
      assert.match(result.stderr, message);
      assert.equal(
        existsSync(marker),
        false,
        "Rejected evidence must never reach the provider",
      );
    };
    rejected(
      { REVIEW_HUB_HEAD: "", REVIEW_HUB_BASE: "" },
      /full commit hashes/,
    );
    rejected(
      { REVIEW_HUB_HEAD: "main; invalid-command" },
      /full commit hashes/,
    );
    rejected({ REVIEW_HUB_HEAD: base }, /exact runner revision/);
    rejected({ REVIEW_HUB_BASE: head }, /first parent/);
    rejected(
      { REVIEW_TARGET: "", GITHUB_SHA: "0".repeat(40) },
      /exact runner revision/,
      root,
    );
    writeFileSync(
      join(hub, "AGENTS.md"),
      "Changed authority outside the admitted handover\n",
    );
    const expanded = commit(head);
    rejected(
      { REVIEW_HUB_HEAD: expanded, REVIEW_HUB_BASE: head },
      /Unexpected hub release scope/,
    );
    // Use the original immutable three-document commit for the admitted case.
    git(["update-ref", "HEAD", head]);
    const admitted = run({});
    assert.equal(admitted.error, undefined);
    assert.equal(
      admitted.status,
      1,
      "The offline provider must not earn a review verdict",
    );
    assert.equal(
      existsSync(marker),
      true,
      "A correctly pinned, bounded handover reaches the provider boundary",
    );
    const failure = JSON.parse(
      readFileSync(
        join(temporary, "screenshots/hub-review/failure.json"),
        "utf8",
      ),
    );
    assert.equal(failure.phase, "model-discovery");
    assert.equal(
      existsSync(join(temporary, "screenshots/hub-review/receipt.json")),
      false,
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
