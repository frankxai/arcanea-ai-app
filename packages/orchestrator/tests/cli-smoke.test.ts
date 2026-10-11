import { test } from "node:test";
import assert from "node:assert/strict";
import { execa } from "execa";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { sep } from "node:path";
import { existsSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(here, "..", "dist", "cli.js");

async function isolatedRun(
  args: string[],
  config: Record<string, unknown> = {},
  executeFixture = false,
) {
  const temporaryRoot = resolve(tmpdir());
  const home = await mkdtemp(resolve(temporaryRoot, "arcanea-routing-"));
  try {
    await mkdir(resolve(home, ".arcanea"));
    await writeFile(
      resolve(home, ".arcanea", "config.yaml"),
      JSON.stringify(config),
    );
    if (executeFixture) {
      await writeFile(
        resolve(home, process.platform === "win32" ? "codex.cmd" : "codex"),
        process.platform === "win32"
          ? "@echo off\r\necho ARCANEA_FIXTURE_RUNTIME\r\nexit /b 0\r\n"
          : '#!/bin/sh\nprintf "ARCANEA_FIXTURE_RUNTIME\\n"\nexit 0\n',
        { mode: 0o755 },
      );
    }
    const res = await execa(
      "node",
      [CLI, "run", ...args, ...(executeFixture ? [] : ["--dry-run"]), "hello"],
      {
        reject: false,
        env: {
          HOME: home,
          USERPROFILE: home,
          PATH: `${home}${process.platform === "win32" ? ";" : ":"}${process.env.PATH ?? ""}`,
        },
      },
    );
    if (executeFixture) assert.equal(res.stdout, "ARCANEA_FIXTURE_RUNTIME");
    return {
      ...res,
      historyExists: existsSync(resolve(home, ".arcanea", "history.jsonl")),
    };
  } finally {
    assert.ok(home.startsWith(`${temporaryRoot}${sep}`));
    await rm(home, { recursive: true, force: true });
  }
}

test("cli --version returns 1.x.x", async () => {
  const res = await execa("node", [CLI, "--version"], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /^1\.\d+\.\d+$/);
});

test("cli list-tasks prints task classes", async () => {
  const res = await execa("node", [CLI, "list-tasks"], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /orchestrate/);
  assert.match(res.stdout, /code\.debug/);
  assert.match(res.stdout, /world\.canon/);
});

test("cli list-models prints models", async () => {
  const res = await execa("node", [CLI, "list-models"], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /claude-opus-4-7/);
});

test("cli explain shows routing decision", async () => {
  const res = await execa("node", [CLI, "explain", "world.canon"], {
    reject: false,
  });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /Task: world\.canon/);
  assert.match(res.stdout, /claude-opus-4-7/);
});

test("cli explain with unknown task exits non-zero", async () => {
  const res = await execa("node", [CLI, "explain", "totally.not.a.real.task"], {
    reject: false,
  });
  assert.notEqual(res.exitCode, 0);
  assert.match(res.stderr, /Unknown task/);
});

test("cli run --dry-run shows exec plan without invoking runtime", async () => {
  const res = await isolatedRun(["--task", "nav.fast"]);
  assert.equal(res.exitCode, 0);
  assert.match(res.stderr, /dry-run/);
  assert.match(res.stderr, /claude-haiku-4-5/);
});

test("explain labels an unsupported provider without routing it to Claude", async () => {
  const res = await execa(
    "node",
    [CLI, "explain", "research.quick", "--surface", "grok-sis"],
    { reject: false },
  );
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /grok-4\s+unsupported/);
});

test("a pinned model still obeys surface tier restrictions", async () => {
  const res = await isolatedRun([
    "--task",
    "code.debug",
    "--surface",
    "arcanea-mcp",
    "--model",
    "gpt-5",
  ]);
  assert.equal(res.exitCode, 1);
  assert.match(res.stderr, /not eligible/);
  assert.doesNotMatch(res.stderr, /would exec/);
});

test("a pin does not skip task validation", async () => {
  const res = await isolatedRun(["--task", "unknown.task", "--model", "gpt-5"]);
  assert.equal(res.exitCode, 1);
  assert.match(res.stderr, /Unknown task/);
});

test("all unavailable runtimes stop instead of restoring the original chain", async () => {
  const auth = Object.fromEntries(
    ["claude", "opencode", "codex", "gemini"].map((id) => [
      id,
      { installed: false },
    ]),
  );
  const res = await isolatedRun(["--task", "code.debug"], { auth });
  assert.equal(res.exitCode, 1);
  assert.doesNotMatch(res.stderr, /would exec/);
});

test("an unavailable pinned runtime stops without model fallback", async () => {
  const res = await isolatedRun(["--task", "code.debug", "--model", "gpt-5"], {
    auth: { codex: { installed: false } },
  });
  assert.equal(res.exitCode, 1);
  assert.match(res.stderr, /not installed/);
  assert.doesNotMatch(res.stderr, /would exec/);
});

test("an explicit surface takes precedence over a saved default", async () => {
  const res = await isolatedRun(
    ["--task", "code.debug", "--surface", "claude-arcanea"],
    { defaultSurface: "arcanea-mcp" },
  );
  assert.equal(res.exitCode, 0);
  assert.match(res.stderr, /surface=claude-arcanea/);
});

test("the native Codex dry run carries the selected model", async () => {
  const res = await isolatedRun(["--task", "code.debug", "--model", "gpt-5"]);
  assert.equal(res.exitCode, 0);
  assert.match(res.stderr, /codex exec --model gpt-5 -- hello/);
});

test("display-only surfaces cannot execute tasks", async () => {
  const res = await isolatedRun([
    "--task",
    "code.debug",
    "--surface",
    "web.models-page",
  ]);
  assert.equal(res.exitCode, 1);
  assert.doesNotMatch(res.stderr, /would exec/);
});

test("an explicitly disabled history stays absent after a fixture execution", async () => {
  const res = await isolatedRun(
    ["--task", "code.debug", "--model", "gpt-5", "--no-history"],
    {},
    true,
  );
  assert.equal(res.exitCode, 0);
  assert.equal(res.historyExists, false);
});

test("ordinary fixture execution retains operational history", async () => {
  const res = await isolatedRun(
    ["--task", "code.debug", "--model", "gpt-5"],
    {},
    true,
  );
  assert.equal(res.exitCode, 0);
  assert.equal(res.historyExists, true);
});
