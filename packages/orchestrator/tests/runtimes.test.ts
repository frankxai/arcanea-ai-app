import { test } from "node:test";
import assert from "node:assert/strict";
import { runtimeFor, getRuntime } from "../src/runtimes.js";
import type { Model } from "@arcanea/router-spec";

function m(provider: Model["provider"]): Model {
  return {
    provider,
    family: "test",
    context: 100_000,
    tier: "free",
    strengths: [],
  };
}

test("runtimeFor maps anthropic → claude", () => {
  assert.equal(runtimeFor(m("anthropic")), "claude");
});

test("runtimeFor maps opencode-zen → opencode", () => {
  assert.equal(runtimeFor(m("opencode-zen")), "opencode");
});

test("runtimeFor maps openai → codex", () => {
  assert.equal(runtimeFor(m("openai")), "codex");
});

test("runtimeFor maps google → gemini", () => {
  assert.equal(runtimeFor(m("google")), "gemini");
});

test("an unsupported provider cannot silently use a different runtime", () => {
  assert.throws(() => runtimeFor(m("mystery")), /Unsupported model provider/);
});

test("getRuntime(claude) returns binary=claude and -p argv shape", () => {
  const rt = getRuntime("claude");
  assert.equal(rt.binary, "claude");
  const argv = rt.argv("claude-opus-4-7", "hello");
  assert.deepEqual(argv, ["-p", "hello", "--model", "claude-opus-4-7"]);
});

test("OpenCode receives a qualified model and a positional prompt", () => {
  const rt = getRuntime("opencode");
  const argv = rt.argv("minimax-m2.5-free", "hello");
  assert.deepEqual(argv, [
    "run",
    "--model",
    "opencode/minimax-m2.5-free",
    "--",
    "hello",
  ]);
});

test("Codex receives the selected model instead of its configured default", () => {
  const rt = getRuntime("codex");
  const argv = rt.argv("gpt-5", "hello");
  assert.deepEqual(argv, ["exec", "--model", "gpt-5", "--", "hello"]);
});

test("Gemini receives the selected model without changing approvals", () => {
  const rt = getRuntime("gemini");
  const argv = rt.argv("gemini-3.1-pro-preview", "hello");
  assert.deepEqual(argv, [
    "--model",
    "gemini-3.1-pro-preview",
    "--prompt",
    "hello",
  ]);
});
