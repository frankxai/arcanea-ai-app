import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
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
  const run = (extra = {}) => {
    const result = spawnSync("bash", [script], {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      env: {
        ...process.env,
        VERCEL_ENV: "preview",
        VERCEL_GIT_COMMIT_REF: "feature/preview-fixture",
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
  expectDecision(f.run(), 1, /build:/);
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
    /production deploy/,
  );
});

test("explicit preview checkpoints still skip", (t) => {
  const f = fixture(t);
  expectDecision(
    f.run({ VERCEL_GIT_COMMIT_MESSAGE: "work [agent-wip]" }),
    0,
    /work-in-progress/,
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
  expectDecision(f.run(), 1, /build:/);
});

test("a non-gated branch name never hides deployable code", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("change deployable code");
  // dependabot/* previews are now skipped by the preview gate (tested below);
  // GitHub Actions CI still builds and tests them.
  for (const branch of [
    "backup/snapshot",
    "worktree-example",
    "copilot/fix",
    "changeset-release/main",
    "docs/guide",
  ]) {
    expectDecision(f.run({ VERCEL_GIT_COMMIT_REF: branch }), 1, /build:/);
  }
});

test("documentation-only changes skip regardless of branch name", (t) => {
  const f = fixture(t);
  f.write("docs/review.md", "Read-only review note\n");
  f.commit();
  for (const branch of [
    "docs/guide",
    "feature/preview-fixture",
    "preview/docs",
  ]) {
    expectDecision(f.run({ VERCEL_GIT_COMMIT_REF: branch }), 0, /docs-only/);
  }
});

test("draft PR state does not suppress a code preview", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit();
  expectDecision(
    f.run({
      VERCEL_GIT_PULL_REQUEST_ID: "123",
      VERCEL_GIT_REPO_OWNER: "frankxai",
      VERCEL_GIT_REPO_SLUG: "arcanea-ai-app",
    }),
    1,
    /build:/,
  );
});

test("renaming source into an ignored documentation path still builds", (t) => {
  const f = fixture(t);
  f.git("mv", "src/app.js", "renamed.md");
  f.commit();
  expectDecision(f.run(), 1, /build:/);
});

test("a force-pushed branch compares deployed and current trees", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  const deployed = f.commit();
  f.git("checkout", "--detach", f.base);
  f.write("readme.md", "different branch history\n");
  f.commit();
  expectDecision(f.run({ VERCEL_GIT_PREVIOUS_SHA: deployed }), 1, /build:/);
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
  expectDecision(result, 1, /build:/);
  assert.doesNotMatch(result.stdout, /docs-only/);
});

// Bot and agent preview gate (chore/preview-build-gate). Production must build
// exactly as before; previews on bot/agent branches skip unless opted in.
// GitHub Actions CI is unaffected: it still runs on every one of these branches.
test("preview gate: production on main always builds", (t) => {
  const f = fixture(t);
  expectDecision(
    f.run({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main" }),
    1,
    /production deploy/,
  );
});

test("preview gate: production builds even from a bot-looking ref", (t) => {
  const f = fixture(t);
  for (const ref of [
    "dependabot/npm_and_yarn/vite-8.3.4",
    "agent/claude/x",
    "ccr-cb0551ef-mlbwjk",
  ]) {
    expectDecision(
      f.run({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: ref }),
      1,
      /production deploy/,
    );
  }
});

test("preview gate: a human feature branch preview with code builds", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("feat: change");
  expectDecision(
    f.run({ VERCEL_GIT_COMMIT_REF: "fix/auth-callback-service-role" }),
    1,
    /build: fix\/auth-callback-service-role/,
  );
});

test("preview gate: dependabot previews skip, even with [preview]", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("chore(deps): bump vite");
  for (const message of [
    "chore(deps): bump vite",
    "chore(deps): bump vite [preview]",
  ]) {
    expectDecision(
      f.run({
        VERCEL_GIT_COMMIT_REF: "dependabot/npm_and_yarn/vite-8.3.4",
        VERCEL_GIT_COMMIT_MESSAGE: message,
      }),
      0,
      /skip: dependabot preview/,
    );
  }
});

test("preview gate: agent and bot branches skip without an opt-in", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("feat: change");
  for (const ref of [
    "agent/claude/liquid-surface",
    "agent/jules/5763313057218637442",
    "agent/codex/chat-world-handoff-20261011",
    "grok/webdev/a11y",
    "claude/ai-gateway-platform-routing",
    "codex/media-apl-boundary-20260925",
    "jules-16122521610008969658-a785b329",
    "google-labs-jules-fix",
    "ccr-cb0551ef-mlbwjk",
    "auto-fix-1792404611033",
  ]) {
    expectDecision(
      f.run({ VERCEL_GIT_COMMIT_REF: ref }),
      0,
      /skip: agent branch .* without \[preview\]/,
    );
  }
});

test("preview gate: an agent branch with [preview] builds", (t) => {
  const f = fixture(t);
  for (const message of [
    "feat(ui): liquid tiers [preview]",
    "feat(ui): liquid tiers\n\nVisual check needed [preview]",
  ]) {
    expectDecision(
      f.run({
        VERCEL_GIT_COMMIT_REF: "agent/claude/liquid-surface",
        VERCEL_GIT_COMMIT_MESSAGE: message,
      }),
      1,
      /opted in with \[preview\]/,
    );
  }
});

test("preview gate: preview/* and cto/* branches are never gated", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("feat: change");
  for (const ref of [
    "preview/liquid-surface",
    "cto/pricing-review",
    "preview/run-1792404611033",
  ]) {
    const result = f.run({ VERCEL_GIT_COMMIT_REF: ref });
    expectDecision(result, 1, /build:/);
    assert.doesNotMatch(result.stdout, /agent branch|dependabot preview/);
  }
});

test("preview gate: an unset ref or other env keeps existing logic", (t) => {
  const f = fixture(t);
  f.write("src/app.js", "export const version = 2;\n");
  f.commit("feat: change");
  for (const env of [
    { VERCEL_GIT_COMMIT_REF: "" },
    { VERCEL_ENV: "development", VERCEL_GIT_COMMIT_REF: "agent/codex/x" },
    { VERCEL_ENV: "", VERCEL_GIT_COMMIT_REF: "dependabot/x" },
  ]) {
    const result = f.run(env);
    expectDecision(result, 1, /build:/);
    assert.doesNotMatch(result.stdout, /agent branch|dependabot preview/);
  }
});
