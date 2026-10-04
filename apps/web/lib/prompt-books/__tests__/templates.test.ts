import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fixture, owner, other } from "./fixtures";
import { PromptEditorSession } from "../editor-session";
import type { SavePromptTemplateInput } from "../store-state";

let store: typeof import("../store").usePromptBooksStore;
before(async () => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  });
  store = (await import("../store")).usePromptBooksStore;
});
beforeEach(() => store.getState().reset());
const details = {
  requestId: "00000000-0000-4000-8000-000000000010",
  name: "Current creator template",
  description: "Recoverable creation",
  category: "creative",
  variables: [{ name: "subject", label: "Subject", type: "text" }],
  isPublic: false,
} satisfies SavePromptTemplateInput;

test("template creation uses all confirmed editor fields and the actual is_public mapping", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input, revision) =>
      store.getState().updatePrompt("prompt-1", input, revision),
  );
  session.updateField("title", "Latest title");
  session.updateField("content", "Write {{subject}} from the latest draft");
  session.updateField("negativeContent", "Avoid repetition");
  session.updateField("systemPrompt", "Keep continuity");
  session.updateField("promptType", "chat");
  session.updateField("contextConfig", { maxTokens: 1536 });
  session.updateField("fewShotExamples", [
    { role: "user", content: "Example" },
  ]);
  session.updateField("chainSteps", [{ order: 1, inlinePrompt: "Continue" }]);
  assert.equal(await session.save(), true);
  const template = await store
    .getState()
    .savePromptAsTemplate("prompt-1", details);
  const confirmed = session.getSnapshot().state;
  assert.equal(template.userId, owner);
  assert.equal(template.content, confirmed.content);
  assert.equal(template.negativeContent, confirmed.negativeContent);
  assert.equal(template.systemPrompt, confirmed.systemPrompt);
  assert.equal(template.promptType, confirmed.promptType);
  assert.deepEqual(template.contextConfig, confirmed.contextConfig);
  assert.deepEqual(template.fewShotExamples, confirmed.fewShotExamples);
  assert.deepEqual(template.chainSteps, confirmed.chainSteps);
  assert.deepEqual(template.variables, details.variables);
  assert.equal(f.template()?.is_public, false);
  assert.equal(Object.hasOwn(f.template()!, "visibility"), false);
});

test("saving a template rejects an old same-owner response after A/B/A", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("POST", "pb_templates");
  const saving = store.getState().savePromptAsTemplate("prompt-1", details);
  await gate.entered.promise;
  const foreign = await fixture(other);
  await store.getState().initialize(foreign.client, other);
  await store.getState().initialize(f.client, owner);
  const rejected = assert.rejects(saving, /identity changed/);
  gate.release.resolve();
  await rejected;
  assert.equal(store.getState().prompts[0].content, "Original");
  assert.equal(f.templateRows().length, 1);
  const retry = await store.getState().savePromptAsTemplate("prompt-1", {
    ...details,
    requestId: "00000000-0000-4000-8000-000000000012",
  });
  assert.equal(retry.id, details.requestId);
  assert.equal(f.templateRows().length, 1);
});

test("a failed template write preserves the confirmed prompt and succeeds on explicit retry", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store
    .getState()
    .updatePrompt("prompt-1", { content: "Keep this confirmed creation" });
  const confirmed = structuredClone(store.getState().prompts[0]);
  f.failTemplate();
  await assert.rejects(
    store.getState().savePromptAsTemplate("prompt-1", details),
  );
  assert.deepEqual(store.getState().prompts[0], confirmed);
  assert.equal(f.template(), null);
  const template = await store
    .getState()
    .savePromptAsTemplate("prompt-1", details);
  assert.equal(template.content, confirmed.content);
});

test("confirmed refreshed content reconciles variables while retaining surviving custom metadata", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store
    .getState()
    .updatePrompt("prompt-1", { content: "{{subject}} in {{new_world}}" });
  const template = await store.getState().savePromptAsTemplate("prompt-1", {
    ...details,
    variables: [
      {
        name: "subject",
        label: "Your protagonist",
        type: "text",
        default: "Keep my edit",
        required: true,
      },
      { name: "removed", label: "Removed", type: "text" },
    ],
  });
  assert.deepEqual(template.variables, [
    {
      name: "subject",
      label: "Your protagonist",
      type: "text",
      default: "Keep my edit",
      required: true,
    },
    {
      name: "new_world",
      label: "New World",
      type: "text",
      default: "",
      required: false,
    },
  ]);
});

test("a lost template acknowledgement resumes its primary key without creating a duplicate", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store
    .getState()
    .updatePrompt("prompt-1", { content: "Unique recoverable template" });
  f.failTemplateAfterCommit();
  await assert.rejects(
    store.getState().savePromptAsTemplate("prompt-1", details),
  );
  assert.equal(f.templateRows().length, 1);
  const retry = await store.getState().savePromptAsTemplate("prompt-1", {
    ...details,
    requestId: "00000000-0000-4000-8000-000000000011",
  });
  assert.equal(retry.id, details.requestId);
  assert.equal(f.templateRows().length, 1);
  const writes = f.requests.filter(
    (r) => r.method === "POST" && r.url.pathname.endsWith("/pb_templates"),
  );
  assert.equal(writes.length, 2);
  assert.ok(
    writes.every((r) => r.url.searchParams.get("on_conflict") === "id"),
  );
});

test("editing template metadata after a lost acknowledgement creates the revised payload with a new key", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store
    .getState()
    .updatePrompt("prompt-1", { content: "Metadata recovery creation" });
  f.failTemplateAfterCommit();
  await assert.rejects(
    store.getState().savePromptAsTemplate("prompt-1", details),
  );
  const retry = await store
    .getState()
    .savePromptAsTemplate("prompt-1", { ...details, name: "Revised name" });
  assert.equal(retry.name, "Revised name");
  assert.notEqual(retry.id, details.requestId);
  assert.equal(f.templateRows().length, 2);
});

test("a JSONB-reordered cache still resumes the same unacknowledged template", async () => {
  const f = await fixture();
  f.replaceStored({
    content: "Canonical template recovery",
    context_config: { temperature: 0.7, maxTokens: 1536 },
  });
  await store.getState().initialize(f.client, owner);
  f.failTemplateAfterCommit();
  await assert.rejects(
    store.getState().savePromptAsTemplate("prompt-1", details),
  );
  f.replaceStored({
    context_config: { maxTokens: 1536, temperature: 0.7 },
    updated_at: "2026-10-04T13:00:00Z",
  });
  await store.getState().loadPrompts();
  const retry = await store.getState().savePromptAsTemplate("prompt-1", {
    ...details,
    requestId: "00000000-0000-4000-8000-000000000019",
  });
  assert.equal(retry.id, details.requestId);
  assert.equal(f.templateRows().length, 1);
});
