import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const sourceScript = readFileSync(
  join(repoRoot, "scripts/vercel-ignore-build.sh"),
);
const sourceShim = readFileSync(
  join(repoRoot, "apps/web/scripts/vercel-ignore-build.sh"),
);
const chapter =
  "book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/chapters/chapter-13-body-before-miracle.md";
const packet = chapter.replace("/chapters/", "/packets/");
const windowsBash = "C:/Program Files/Git/bin/bash.exe";
const bash =
  process.env.ARCANEA_TEST_BASH ||
  (process.platform === "win32" && existsSync(windowsBash)
    ? windowsBash
    : "bash");

function fixture(t) {
  const tempRoot = resolve(tmpdir());
  const root = mkdtempSync(join(tempRoot, "arcanea-ignore-build-test-"));
  t.after(() => {
    const target = resolve(root);
    const withinTemp = relative(tempRoot, target);
    assert.ok(
      withinTemp && !isAbsolute(withinTemp) && !withinTemp.startsWith(".."),
    );
    assert.ok(basename(target).startsWith("arcanea-ignore-build-test-"));
    rmSync(target, { recursive: true, force: true });
  });

  const env = { ...process.env };
  for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"])
    delete env[key];
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 15000,
    }).trim();
  const write = (path, content) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  };
  const commit = (message = "fixture change") => {
    git("add", "--all");
    git(
      "-c",
      "user.name=Build filter test",
      "-c",
      "user.email=build-test@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      message,
    );
  };
  git("init", "-q");
  git("config", "core.autocrlf", "false");
  write("scripts/vercel-ignore-build.sh", sourceScript);
  write("apps/web/scripts/vercel-ignore-build.sh", sourceShim);
  write("README.md", "Documentation\n");
  write(chapter, "# Chapter\n\nOriginal prose.\n");
  write(packet, "Private production notes.\n");
  commit("fixture baseline");

  const run = (cwd = "root", extra = {}) => {
    const result = spawnSync(bash, ["scripts/vercel-ignore-build.sh"], {
      cwd: cwd === "web" ? join(root, "apps/web") : root,
      encoding: "utf8",
      timeout: 15000,
      env: {
        ...env,
        VERCEL_ENV: "preview",
        VERCEL_GIT_COMMIT_REF: "codex/arcanea-cinematic-book",
        VERCEL_GIT_COMMIT_MESSAGE: "coherent checkpoint",
        ...extra,
      },
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    return result;
  };
  return { root, write, commit, run };
}

for (const cwd of ["root", "web"]) {
  test(`a manuscript-only edit builds from ${cwd}`, (t) => {
    const f = fixture(t);
    f.write(chapter, "# Chapter\n\nRevised prose.\n");
    f.commit();
    const result = f.run(cwd);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /cinematic chapter content/);
  });

  test(`ordinary docs and private chapter packets still skip from ${cwd}`, (t) => {
    const f = fixture(t);
    f.write("README.md", "Changed documentation.\n");
    f.write(packet, "Changed private production notes.\n");
    f.commit();
    const result = f.run(cwd);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /docs-only commit/);
  });

  test(`application changes still build from ${cwd}`, (t) => {
    const f = fixture(t);
    f.write(
      "apps/web/app/page.tsx",
      "export default function Page() { return null; }\n",
    );
    f.commit();
    const result = f.run(cwd);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /build: codex\/arcanea-cinematic-book/);
  });
}

test("chapter additions and deletions both trigger a build", (t) => {
  const f = fixture(t);
  f.write(chapter.replace("chapter-13-", "chapter-33-"), "New draft.\n");
  f.commit();
  assert.equal(f.run().status, 1);
  unlinkSync(join(f.root, chapter));
  f.commit();
  assert.equal(f.run("web").status, 1);
});

test("an explicit WIP marker still skips a manuscript preview", (t) => {
  const f = fixture(t);
  f.write(chapter, "Intermediate prose.\n");
  f.commit("[agent-wip] intermediate chapter");
  const result = f.run("web", {
    VERCEL_GIT_COMMIT_MESSAGE: "[agent-wip] intermediate chapter",
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("the coherent commit after WIP builds even when it only updates a packet", (t) => {
  const f = fixture(t);
  f.write(chapter, "Intermediate prose.\n");
  f.commit("[agent-wip] intermediate chapter");
  f.write(packet, "Coherent checkpoint.\n");
  f.commit();
  const result = f.run("web");
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /coherent checkpoint follows/);
});

test("production always builds despite WIP and branch skip settings", (t) => {
  const f = fixture(t);
  f.write("README.md", "Changed documentation.\n");
  f.commit();
  const result = f.run("web", {
    VERCEL_ENV: "production",
    VERCEL_GIT_COMMIT_REF: "backup/snapshot",
    VERCEL_GIT_COMMIT_MESSAGE: "[agent-wip] backup",
  });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /production deploy/);
});

test("missing parent history defaults to building", (t) => {
  const f = fixture(t);
  const result = f.run("web");
  assert.equal(result.status, 1, result.stdout + result.stderr);
});
