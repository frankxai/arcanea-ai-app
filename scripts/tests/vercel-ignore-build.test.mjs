import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  chmodSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(
  new URL("../vercel-ignore-build.sh", import.meta.url),
);

function fixture(t) {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, "arcanea-preview-history-"));
  t.after(() => {
    assert.ok(resolve(root).startsWith(parent + sep));
    rmSync(root, { recursive: true, force: true });
  });
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "-q");
  git("config", "commit.gpgsign", "false");
  git("config", "core.hooksPath", join(root, "no-hooks"));
  const write = (path, body) => {
    const destination = join(root, path);
    mkdirSync(resolve(destination, ".."), { recursive: true });
    writeFileSync(destination, body);
  };
  const commit = (message = "fixture") => {
    git("add", "--all");
    git(
      "-c",
      "user.name=Preview test",
      "-c",
      "user.email=preview@example.invalid",
      "commit",
      "--allow-empty",
      "-qm",
      message,
    );
    return git("rev-parse", "HEAD");
  };
  write("src/app.js", "export const version = 1;\n");
  const base = commit();
  const bin = join(root, ".git", "fake-bin");
  mkdirSync(bin);
  const curl = join(bin, "curl");
  writeFileSync(
    curl,
    '#!/usr/bin/env bash\nprintf "%s" "$FIXTURE_PR_JSON"\nexit "${FIXTURE_CURL_STATUS:-0}"\n',
  );
  chmodSync(curl, 0o755);
  const run = (extra = {}) => {
    const result = spawnSync("bash", [script], {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      env: {
        ...process.env,
        PATH: bin + ":" + process.env.PATH,
        FIXTURE_PR_JSON: JSON.stringify([{ draft: false, state: "open" }]),
        VERCEL_GIT_REPO_OWNER: "frankxai",
        VERCEL_GIT_REPO_SLUG: "arcanea-ai-app",
        VERCEL_GIT_PULL_REQUEST_ID: "",
        VERCEL_ENV: "preview",
        VERCEL_GIT_COMMIT_REF: "codex/preview-fixture",
        VERCEL_GIT_COMMIT_MESSAGE: git("log", "-1", "--format=%B"),
        VERCEL_GIT_PREVIOUS_SHA: base,
        ...extra,
      },
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null);
    return result;
  };
  return { root, git, write, commit, base, run };
}

function expectDecision(result, status, reason) {
  assert.equal(result.status, status, result.stdout + result.stderr);
  assert.match(result.stdout, reason);
}

test("code followed by docs builds the complete pending change", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("runtime correction");
  f.write("docs/review.md", "Review evidence\n");
  f.commit("record review");
  expectDecision(f.run(), 1, /BUILDING/);
});

test("docs-only pending changes skip, including multiple commits", (t) => {
  const f = fixture(t);
  for (const name of [
    "read me.md",
    "docs/usage.txt",
    "planning-with-files/state.md",
    "book/chapter.txt",
    "wiki/help.txt",
  ]) {
    f.write(name, "documentation\n");
    f.commit();
  }
  expectDecision(f.run(), 0, /docs-only/);
});

test("unavailable, invalid and option-like previous commits build", (t) => {
  const f = fixture(t);
  f.write("readme.md", "documentation\n");
  f.commit();
  for (const previous of [
    "",
    "a".repeat(40),
    "a".repeat(64),
    "HEAD^",
    "--help",
    "$(false)",
  ]) {
    expectDecision(
      f.run({ VERCEL_GIT_PREVIOUS_SHA: previous }),
      1,
      /previous successful deployment commit unavailable/,
    );
  }
});

test("a previous deployment absent from shallow history builds", (t) => {
  const f = fixture(t);
  f.write("readme.md", "documentation\n");
  const head = f.commit();
  f.write(".git/shallow", head + "\n");
  // Remove the otherwise local base object to model a shallow checkout.
  const object = join(
    f.root,
    ".git",
    "objects",
    f.base.slice(0, 2),
    f.base.slice(2),
  );
  rmSync(object);
  expectDecision(
    f.run(),
    1,
    /previous successful deployment commit unavailable/,
  );
});

test("production builds even when checkpoint and branch filters would skip", (t) => {
  const f = fixture(t);
  expectDecision(
    f.run({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "docs/example",
      VERCEL_GIT_COMMIT_MESSAGE: "[agent-wip]",
    }),
    1,
    /production\/main/,
  );
});

test("explicit preview checkpoints still skip", (t) => {
  const f = fixture(t);
  expectDecision(
    f.run({ VERCEL_GIT_COMMIT_MESSAGE: "work [agent-wip]" }),
    0,
    /checkpoint/,
  );
});

test("a coherent commit after an ignored checkpoint still builds", (t) => {
  const f = fixture(t);
  f.commit("work [agent-wip]");
  f.commit("ready");
  expectDecision(
    f.run({ VERCEL_GIT_COMMIT_REF: "docs/example" }),
    1,
    /coherent checkpoint follows/,
  );
});

test("pending code survives several ignored and docs-only checkpoints", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("code [agent-wip]");
  f.write("readme.md", "documentation\n");
  f.commit("review [agent-wip]");
  f.commit("ready");
  f.commit("final review");
  expectDecision(f.run(), 1, /BUILDING/);
});

test("explicit preview requests build bot and tooling branches", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("change deployable code");
  for (const branch of [
    "dependabot/deps",
    "backup/snapshot",
    "worktree-example",
    "copilot/fix",
    "changeset-release/main",
    "docs/guide",
  ]) {
    expectDecision(
      f.run({
        VERCEL_GIT_COMMIT_REF: branch,
        VERCEL_GIT_COMMIT_MESSAGE: "fix [preview]",
      }),
      1,
      /BUILDING/,
    );
  }
});

test("documentation-only changes skip regardless of branch name", (t) => {
  const f = fixture(t);
  f.write("docs/review.md", "Read-only review note\n");
  f.commit();
  for (const branch of [
    "docs/guide",
    "feature/guide",
    "codex/preview-fixture",
  ]) {
    expectDecision(f.run({ VERCEL_GIT_COMMIT_REF: branch }), 0, /docs-only/);
  }
});

test("a draft PR skips a code preview until explicitly requested", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit();
  expectDecision(
    f.run({
      VERCEL_GIT_PULL_REQUEST_ID: "123",
      FIXTURE_PR_JSON: JSON.stringify({ draft: true, state: "open" }),
      VERCEL_GIT_REPO_OWNER: "frankxai",
      VERCEL_GIT_REPO_SLUG: "arcanea-ai-app",
    }),
    0,
    /PR is a draft/,
  );
});

test("renaming source into an ignored documentation path still builds", (t) => {
  const f = fixture(t);
  f.git("mv", "src/app.js", "renamed.md");
  f.commit();
  expectDecision(f.run(), 1, /BUILDING/);
});

test("a force-pushed branch compares deployed and current trees", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  const deployed = f.commit();
  f.git("checkout", "--detach", f.base);
  f.write("readme.md", "different branch history\n");
  f.commit();
  expectDecision(f.run({ VERCEL_GIT_PREVIOUS_SHA: deployed }), 1, /BUILDING/);
});

test("a net code revert to the deployed tree can skip its documentation delta", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit();
  f.write("src/app.js", "export const version = 1;\n");
  f.write("readme.md", "reverted change\n");
  f.commit();
  expectDecision(f.run(), 0, /docs-only/);
});

test("a Git diff error builds without claiming a docs-only change", (t) => {
  const f = fixture(t);
  f.write(
    "fail-diff.bash",
    'git() { if [[ "${1:-}" == diff ]]; then return 42; fi; command git "$@"; }\n',
  );
  const result = f.run({ BASH_ENV: join(f.root, "fail-diff.bash") });
  expectDecision(result, 1, /BUILDING/);
  assert.doesNotMatch(result.stdout, /docs-only/);
});

test("production, main and unknown refs build before every preview skip rule", (t) => {
  const f = fixture(t);
  for (const extra of [
    { VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "dependabot/deps" },
    { VERCEL_GIT_COMMIT_REF: "main" },
    { VERCEL_GIT_COMMIT_REF: "" },
  ]) {
    expectDecision(
      f.run({
        FIXTURE_PR_JSON: "[]",
        VERCEL_GIT_COMMIT_MESSAGE: "checkpoint [agent-wip]",
        ...extra,
      }),
      1,
      /production\/main/,
    );
  }
});

test("preview opt-ins override draft, bot, catch-up and checkpoint skips", (t) => {
  const f = fixture(t);
  for (const extra of [
    { VERCEL_GIT_COMMIT_REF: "preview/release" },
    {
      VERCEL_GIT_COMMIT_REF: "dependabot/deps",
      VERCEL_GIT_COMMIT_MESSAGE: "fix [preview]",
    },
    { VERCEL_GIT_COMMIT_MESSAGE: "Merge branch 'main' [preview]" },
    { VERCEL_GIT_COMMIT_MESSAGE: "checkpoint [agent-wip] [preview]" },
  ]) {
    expectDecision(
      f.run({
        FIXTURE_PR_JSON: JSON.stringify({ draft: true, state: "open" }),
        ...extra,
      }),
      1,
      /BUILDING/,
    );
  }
});

test("markers in commit bodies do not change the subject decision", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "changed\n");
  f.commit();
  expectDecision(
    f.run({ VERCEL_GIT_COMMIT_MESSAGE: "ready\n\nmentions [agent-wip]" }),
    1,
    /BUILDING/,
  );
  expectDecision(
    f.run({
      VERCEL_GIT_COMMIT_REF: "dependabot/deps",
      VERCEL_GIT_COMMIT_MESSAGE: "fix\n\nmentions [preview]",
    }),
    0,
    /bot\/tooling/,
  );
});

test("missing, malformed and failed API responses cannot confirm an agent PR", (t) => {
  const f = fixture(t);
  for (const json of [
    "",
    "{",
    "null",
    "{}",
    '{"draft":false}',
    '{"draft":"false","state":"open"}',
    '{"draft":false,"state":"closed"}',
    '{"message":"draft: false","nested":{"draft":false}}',
  ]) {
    expectDecision(
      f.run({ FIXTURE_PR_JSON: json }),
      0,
      /without a confirmed ready PR/,
    );
  }
  expectDecision(
    f.run({ FIXTURE_PR_JSON: "", FIXTURE_CURL_STATUS: "22" }),
    0,
    /without a confirmed ready PR/,
  );
  expectDecision(f.run({ FIXTURE_PR_JSON: "[]" }), 0, /no open PR/);
  expectDecision(
    f.run({ VERCEL_GIT_REPO_OWNER: "" }),
    0,
    /without a confirmed ready PR/,
  );
});

test("PR text and nested fields cannot masquerade as the API draft flag", (t) => {
  const f = fixture(t);
  const draft = {
    draft: true,
    state: "open",
    title: 'example "draft":false',
    nested: { draft: false },
  };
  expectDecision(
    f.run({ FIXTURE_PR_JSON: JSON.stringify(draft) }),
    0,
    /PR is a draft/,
  );
  expectDecision(
    f.run({ FIXTURE_PR_JSON: JSON.stringify([draft]) }),
    0,
    /PR is a draft/,
  );
});

test("a ready PR is not made draft by nested data", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "changed\n");
  f.commit();
  expectDecision(
    f.run({
      FIXTURE_PR_JSON: JSON.stringify({
        draft: false,
        state: "open",
        nested: { draft: true },
      }),
    }),
    1,
    /BUILDING/,
  );
  expectDecision(
    f.run({
      FIXTURE_PR_JSON: JSON.stringify({ draft: false, state: "open" }),
      FIXTURE_CURL_STATUS: "28",
    }),
    0,
    /without a confirmed ready PR/,
  );
});

test("unconfirmed non-agent branches preserve the Git history fallback", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "changed\n");
  f.commit();
  expectDecision(
    f.run({ VERCEL_GIT_COMMIT_REF: "feature/fix", FIXTURE_PR_JSON: "{broken" }),
    1,
    /BUILDING/,
  );
});

test("bot and catch-up branches skip without an opt-in", (t) => {
  const f = fixture(t);
  for (const branch of [
    "dependabot/deps",
    "renovate/deps",
    "copilot/fix",
    "changeset-release/main",
    "backup/snapshot",
    "worktree-example",
  ]) {
    expectDecision(f.run({ VERCEL_GIT_COMMIT_REF: branch }), 0, /bot\/tooling/);
  }
  for (const subject of [
    "Merge branch 'main' into feature",
    "Merge remote-tracking branch 'origin/main' into feature",
  ]) {
    expectDecision(
      f.run({ VERCEL_GIT_COMMIT_MESSAGE: subject }),
      0,
      /catch-up merge/,
    );
  }
});
