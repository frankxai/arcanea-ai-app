import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fixture, owner } from "./fixtures";
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

test("conditional draft write preserves newer remote fields and requires an explicit conflict retry", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input, revision) =>
      store.getState().updatePrompt("prompt-1", input, revision),
  );
  session.updateField("content", "My retained draft");
  f.replaceStored({
    title: "Newer remote title",
    context_config: { maxTokens: 1536 },
    updated_at: "2026-10-04T12:01:00.123456Z",
  });
  assert.equal(await session.save(), false);
  assert.equal(f.saved().content, "Original");
  assert.equal(session.getSnapshot().state.content, "My retained draft");
  assert.equal(session.getSnapshot().state.title, "Newer remote title");
  assert.equal(session.getSnapshot().state.contextConfig.maxTokens, 1536);
  assert.equal(session.getSnapshot().isDirty, true);
  assert.match(session.getSnapshot().saveError ?? "", /Newer changes arrived/);
  assert.equal(await session.save(), true);
  assert.equal(f.saved().content, "My retained draft");
  assert.equal(f.saved().title, "Newer remote title");
  const writes = f.requests.filter((r) => r.method === "PATCH");
  assert.equal(
    writes[0].url.searchParams.get("updated_at"),
    "eq.2026-10-04T12:00:00.000Z",
  );
  assert.equal(
    writes[1].url.searchParams.get("updated_at"),
    "eq.2026-10-04T12:01:00.123456Z",
  );
  assert.equal(writes[1].url.searchParams.get("user_id"), `eq.${owner}`);
});

test("a newer fetched revision cannot falsely confirm a different editor snapshot", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input, revision) =>
      store.getState().updatePrompt("prompt-1", input, revision),
  );
  session.updateField("content", "Retain my edit");
  const gate = f.hold("PATCH");
  const saving = session.save();
  await gate.entered.promise;
  f.replaceStored({
    content: "Later remote edit",
    updated_at: "2026-10-04T12:02:00Z",
  });
  gate.release.resolve();
  assert.equal(await saving, false);
  assert.equal(session.getSnapshot().isDirty, true);
  assert.equal(session.getSnapshot().state.content, "Retain my edit");
  assert.notEqual(session.getSnapshot().lastSavedAt, "2026-10-04T12:02:00Z");
  assert.equal(f.saved().content, "Later remote edit");
});

test("template creation refuses a cache row that differs from the confirmed editor snapshot", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input, revision) =>
      store.getState().updatePrompt("prompt-1", input, revision),
  );
  const confirmed = session.getConfirmedState();
  store.getState().updatePromptInStore({
    ...store.getState().prompts[0],
    content: "Different cached draft",
    updatedAt: "2026-10-04T13:00:00Z",
  });
  await assert.rejects(
    store.getState().savePromptAsTemplate(
      "prompt-1",
      {
        requestId: "00000000-0000-4000-8000-000000000020",
        name: "My template",
        description: "",
        category: "creative",
        variables: [],
        isPublic: false,
      },
      confirmed,
    ),
    /Prompt changed after saving/,
  );
  assert.equal(f.template(), null);
});

test("an older in-flight prompt read neither resurrects a deletion nor drops a new arrival", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const initial = store.getState().prompts[0];
  const gate = f.hold("GET");
  const loading = store.getState().loadPrompts();
  await gate.entered.promise;
  store.getState().removePrompt(initial.id);
  store.getState().addPrompt({
    ...initial,
    id: "new-arrival",
    content: "Keep this addition",
  });
  gate.release.resolve();
  await loading;
  assert.deepEqual(
    store.getState().prompts.map((row) => row.id),
    ["new-arrival"],
  );
});

for (const resource of ["collections", "tags"] as const) {
  test(`an older SDK ${resource} read retains a newer realtime row`, async () => {
    const f = await fixture();
    await store.getState().initialize(f.client, owner);
    const gate = f.hold("GET", `pb_${resource}`);
    const loading =
      resource === "collections"
        ? store.getState().loadCollections()
        : store.getState().loadTags();
    await gate.entered.promise;
    const current = store.getState()[resource][0];
    const updated = {
      ...current,
      name: "Newer row",
      updatedAt: "2026-10-04T13:00:00.123456Z",
    };
    if (resource === "collections")
      store
        .getState()
        .updateCollectionInStore(updated as import("../types").Collection);
    else store.getState().updateTagInStore(updated as import("../types").Tag);
    gate.release.resolve();
    await loading;
    assert.equal(store.getState()[resource][0].name, "Newer row");
  });
}
