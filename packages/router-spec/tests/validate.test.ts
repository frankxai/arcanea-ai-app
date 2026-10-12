import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSpec, resolveTask, pickModel } from "../src/index.js";

test("loadSpec returns declared counts", () => {
  const spec = loadSpec();
  assert.ok(Object.keys(spec.models).length >= 10);
  assert.ok(Object.keys(spec.tasks).length >= 10);
  assert.ok(Object.keys(spec.surfaces).length >= 5);
});

test("every task.primary references a declared model", () => {
  const spec = loadSpec();
  for (const [taskId, task] of Object.entries(spec.tasks)) {
    for (const modelId of task.primary) {
      assert.ok(
        spec.models[modelId],
        `task[${taskId}].primary references undeclared model: ${modelId}`,
      );
    }
  }
});

test("every surface.taskOverrides references declared tasks", () => {
  const spec = loadSpec();
  for (const [surfaceId, surface] of Object.entries(spec.surfaces)) {
    for (const taskId of Object.keys(surface.taskOverrides ?? {})) {
      assert.ok(
        spec.tasks[taskId],
        `surface[${surfaceId}].taskOverrides references undeclared task: ${taskId}`,
      );
    }
  }
});

test("resolveTask returns valid candidates for known task+surface", () => {
  const spec = loadSpec();
  const candidates = resolveTask("world.canon", "claude-arcanea", spec);
  assert.ok(candidates.length > 0);
  assert.ok(candidates.includes("claude-opus-4-7"));
});

test("pickModel returns first non-deprecated model", () => {
  const spec = loadSpec();
  const picked = pickModel(["claude-opus-4-7", "claude-sonnet-4-6"], spec);
  assert.equal(picked, "claude-opus-4-7");
});

test("pickModel skips deprecated and picks next", () => {
  const spec = loadSpec();
  // glm-4.7-free is marked deprecated in models.yaml
  const picked = pickModel(["glm-4.7-free", "glm-5-free"], spec);
  assert.equal(picked, "glm-5-free");
});

test("resolveTask throws on unknown surface", () => {
  const spec = loadSpec();
  assert.throws(() => resolveTask("world.canon", "fake-surface", spec));
});

test("resolveTask throws on unknown task", () => {
  const spec = loadSpec();
  assert.throws(() => resolveTask("fake.task", "claude-arcanea", spec));
});

test("surface overrides cannot bypass allowed tiers", () => {
  const spec = structuredClone(loadSpec());
  spec.surfaces["arcanea-mcp"].taskOverrides = { "code.debug": ["gpt-5"] };
  assert.deepEqual(resolveTask("code.debug", "arcanea-mcp", spec), []);
});

test("an override cannot introduce an undeclared task", () => {
  const spec = structuredClone(loadSpec());
  spec.surfaces["arcanea-mcp"].taskOverrides = {
    "unknown.task": ["glm-5-free"],
  };
  assert.throws(
    () => resolveTask("unknown.task", "arcanea-mcp", spec),
    /Unknown task/,
  );
});

test("context requirements also apply to surface overrides", () => {
  const spec = structuredClone(loadSpec());
  spec.tasks["code.debug"].contextMin = 500_000;
  spec.surfaces["codex-arcanea"].taskOverrides = { "code.debug": ["gpt-5"] };
  assert.deepEqual(resolveTask("code.debug", "codex-arcanea", spec), []);
});

test("resolution excludes unknown, deprecated and duplicate candidates", () => {
  const spec = structuredClone(loadSpec());
  spec.surfaces["arcanea-mcp"].taskOverrides = {
    "code.debug": ["not-declared", "glm-4.7-free", "glm-5-free", "glm-5-free"],
  };
  assert.deepEqual(resolveTask("code.debug", "arcanea-mcp", spec), [
    "glm-5-free",
  ]);
});

test("a display-only surface retains catalog candidates", () => {
  assert.ok(resolveTask("code.debug", "web.models-page").length > 0);
});

test("exhausted candidates do not resurrect an invalid fallback", () => {
  assert.equal(pickModel(["not-declared", "glm-4.7-free"]), null);
});
