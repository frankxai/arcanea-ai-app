import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fixture, owner, other } from "./fixtures";
import { PromptEditorSession } from "../editor-session";

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
  name: "Current creator template",
  description: "Recoverable creation",
  category: "creative",
  variables: [{ name: "subject", type: "text" as const }],
  isPublic: false,
};

test("template creation uses all confirmed editor fields and the actual is_public mapping", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input) => store.getState().updatePrompt("prompt-1", input),
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
