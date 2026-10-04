import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fixture, owner, other, row } from "./fixtures";
import { PromptEditorSession } from "../editor-session";
import { comparePromptRevisions } from "../revisions";

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
const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

test("superseded initialization failure cannot undo recovered route selection", async () => {
  const f = await fixture();
  f.failRead();
  const gate = f.hold("GET");
  const initializing = store.getState().initialize(f.client, owner);
  await gate.entered.promise;
  store.getState().setActiveCollection("recovered-route");
  await settle();
  assert.equal(store.getState().syncStatus, "synced");
  gate.release.resolve();
  await initializing;
  assert.equal(store.getState().activeCollectionId, "recovered-route");
  assert.equal(store.getState().syncStatus, "synced");
});

test("superseded initialization success cannot conceal a current selection failure", async () => {
  const f = await fixture();
  const gate = f.hold("GET");
  const initializing = store.getState().initialize(f.client, owner);
  await gate.entered.promise;
  f.failRead();
  store.getState().setActiveCollection("failed-route");
  await settle();
  assert.equal(store.getState().syncStatus, "error");
  gate.release.resolve();
  await initializing;
  assert.equal(store.getState().syncStatus, "error");
});

test("an unsuperseded initialization failure remains visible", async () => {
  const f = await fixture();
  f.failRead();
  await store.getState().initialize(f.client, owner);
  assert.equal(store.getState().syncStatus, "error");
});

test("successful selection recovery clears its previous sync error", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.failRead();
  store.getState().setActiveCollection("first");
  await settle();
  assert.equal(store.getState().syncStatus, "error");
  store.getState().setActiveCollection("recovered");
  await settle();
  assert.equal(store.getState().syncStatus, "synced");
});

for (const assigned of [true, false]) {
  test(`old ${assigned ? "assign" : "unassign"} tag response is refused after A/B/A`, async () => {
    const f = await fixture();
    await store.getState().initialize(f.client, owner);
    const gate = f.hold("GET", "pb_prompt_tags");
    const changing = store
      .getState()
      .changePromptTag("prompt-1", "tag-1", assigned);
    await gate.entered.promise;
    const foreign = await fixture(other);
    await store.getState().initialize(foreign.client, other);
    await store.getState().initialize(f.client, owner);
    const prompt = store.getState().prompts[0];
    const currentTag = {
      ...store.getState().tags[0],
      name: "Current session tags",
    };
    store.getState().updatePromptInStore({ ...prompt, tags: [currentTag] });
    const rejected = assert.rejects(changing, /identity changed/);
    gate.release.resolve();
    await rejected;
    assert.equal(
      store.getState().prompts[0].tags?.[0].name,
      "Current session tags",
    );
  });
}

test("adding a second tag preserves the first association through actual SDK reads", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().changePromptTag("prompt-1", "tag-1", true);
  await store.getState().changePromptTag("prompt-1", "tag-2", true);
  assert.deepEqual(
    store
      .getState()
      .prompts[0].tags?.map((tag) => tag.id)
      .sort(),
    ["tag-1", "tag-2"],
  );
});

test("a failed tag refresh preserves the confirmed cache and can be retried", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().changePromptTag("prompt-1", "tag-1", true);
  f.failRead("pb_prompt_tags");
  await assert.rejects(
    store.getState().changePromptTag("prompt-1", "tag-2", true),
  );
  assert.deepEqual(
    store.getState().prompts[0].tags?.map((tag) => tag.id),
    ["tag-1"],
  );
  await store.getState().changePromptTag("prompt-1", "tag-2", true);
  assert.deepEqual(
    store
      .getState()
      .prompts[0].tags?.map((tag) => tag.id)
      .sort(),
    ["tag-1", "tag-2"],
  );
});

test("a current collection failure survives successful route prompt/tag reads", async () => {
  const f = await fixture();
  f.failRead("pb_collections");
  const gate = f.hold("GET", "pb_collections");
  const initializing = store.getState().initialize(f.client, owner);
  await gate.entered.promise;
  store.getState().setActiveCollection("direct-route");
  await settle();
  assert.equal(store.getState().syncStatus, "syncing");
  gate.release.resolve();
  await initializing;
  assert.equal(store.getState().syncStatus, "error");
  // A realtime channel subscription cannot conceal the failed resource either.
  store.getState().setSyncStatus("synced");
  assert.equal(store.getState().syncStatus, "error");
  await store.getState().loadCollections();
  assert.equal(store.getState().syncStatus, "synced");
  assert.equal(store.getState().collections.length, 1);
});

test("autosave and the actual registered realtime update retain omitted tag associations", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().changePromptTag("prompt-1", "tag-1", true);
  await store
    .getState()
    .updatePrompt("prompt-1", { content: "Saved with tags" });
  assert.deepEqual(
    store.getState().prompts[0].tags?.map((tag) => tag.id),
    ["tag-1"],
  );
  const callbacks: Record<
    string,
    (payload: {
      eventType: string;
      new: Record<string, unknown>;
      old: Record<string, unknown>;
    }) => void
  > = {};
  Object.defineProperty(f.client, "channel", {
    value: () => {
      const channel = {
        on: (
          _event: string,
          filter: { table: string },
          callback: (typeof callbacks)[string],
        ) => {
          callbacks[filter.table] = callback;
          return channel;
        },
        subscribe: () => channel,
      };
      return channel;
    },
  });
  Object.defineProperty(f.client, "removeChannel", { value: async () => "ok" });
  const { PromptBooksSync } = await import("../sync");
  const sync = new PromptBooksSync(f.client, owner);
  sync.subscribe();
  try {
    callbacks.pb_prompts({
      eventType: "UPDATE",
      old: {},
      new: {
        ...row(),
        content: "Realtime with tags",
        updated_at: "2026-10-04T15:00:00.000Z",
      },
    });
    assert.equal(store.getState().prompts[0].content, "Realtime with tags");
    assert.deepEqual(
      store.getState().prompts[0].tags?.map((tag) => tag.id),
      ["tag-1"],
    );
    store
      .getState()
      .updatePromptInStore({ ...store.getState().prompts[0], tags: [] });
    assert.deepEqual(store.getState().prompts[0].tags, []);
  } finally {
    sync.unsubscribe();
  }
});

for (const [name, change] of [
  [
    "context",
    (session: PromptEditorSession) =>
      session.updateField("contextConfig", {
        model: "creator-model",
        temperature: 0.4,
      }),
  ],
  [
    "few-shot examples",
    (session: PromptEditorSession) =>
      session.updateField("fewShotExamples", [
        { role: "user", content: "Keep this example" },
      ]),
  ],
  [
    "chain steps",
    (session: PromptEditorSession) =>
      session.updateField("chainSteps", [
        { order: 1, inlinePrompt: "Keep this step" },
      ]),
  ],
] as const) {
  test(`Back/save awaits a pending ${name}-only draft`, async () => {
    const f = await fixture();
    await store.getState().initialize(f.client, owner);
    const session = new PromptEditorSession(
      store.getState().prompts[0],
      () => true,
      (input) => store.getState().updatePrompt("prompt-1", input),
    );
    change(session);
    const expected = structuredClone(session.getSnapshot().state);
    const gate = f.hold("PATCH");
    const saving = session.save();
    await gate.entered.promise;
    let returned = false;
    const back = session.save().then((ok) => {
      returned = true;
      return ok;
    });
    await settle();
    assert.equal(returned, false);
    gate.release.resolve();
    assert.deepEqual(await Promise.all([saving, back]), [true, true]);
    const stored = store.getState().prompts[0];
    assert.deepEqual(stored.contextConfig, expected.contextConfig);
    assert.deepEqual(stored.fewShotExamples, expected.fewShotExamples);
    assert.deepEqual(stored.chainSteps, expected.chainSteps);
  });
}

test("failed context/example/chain save refuses Back and retries the latest immutable draft", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input) => store.getState().updatePrompt("prompt-1", input),
  );
  const config = { model: "creator-model", stopSequences: ["original"] };
  session.updateField("contextConfig", config);
  config.stopSequences[0] = "external mutation";
  session.updateField("fewShotExamples", [
    { role: "assistant", content: "Recover my example" },
  ]);
  session.updateField("chainSteps", [
    { order: 1, inlinePrompt: "Recover my step" },
  ]);
  f.fail();
  assert.equal(await session.save(), false);
  const expected = structuredClone(session.getSnapshot().state);
  assert.equal(expected.contextConfig.stopSequences?.[0], "original");
  assert.equal(session.getSnapshot().isDirty, true);
  assert.match(session.getSnapshot().saveError ?? "", /Retry save/);
  assert.equal(await session.save(), true);
  const stored = store.getState().prompts[0];
  assert.deepEqual(stored.contextConfig, expected.contextConfig);
  assert.deepEqual(stored.fewShotExamples, expected.fewShotExamples);
  assert.deepEqual(stored.chainSteps, expected.chainSteps);
});

test("a same-owner stale template creation cannot update cache or trigger navigation after A/B/A", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("POST");
  let navigated = false;
  const creating = store
    .getState()
    .instantiateTemplate("template-1", { subject: "a recovered world" })
    .then(() => {
      navigated = true;
    });
  await gate.entered.promise;
  const foreign = await fixture(other);
  await store.getState().initialize(foreign.client, other);
  await store.getState().initialize(f.client, owner);
  store.getState().updatePromptInStore({
    ...store.getState().prompts[0],
    content: "Current session content",
    updatedAt: "2099-01-01T00:00:00Z",
  });
  const rejected = assert.rejects(creating, /identity changed/);
  gate.release.resolve();
  await rejected;
  assert.equal(navigated, false);
  assert.equal(store.getState().prompts[0].content, "Current session content");
});

test("current verified template creation resolves variables and enters its owner cache", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const prompt = await store
    .getState()
    .instantiateTemplate("template-1", { subject: "a recovered world" });
  assert.equal(prompt.content, "Write a recovered world");
  assert.equal(prompt.userId, owner);
  assert.equal(store.getState().prompts[0].content, "Write a recovered world");
});

test("same-millisecond newer SDK loads and clean editor refresh preserve all timestamp precision", async () => {
  const f = await fixture();
  f.replaceStored({ updated_at: "2026-10-04T12:00:00.123456Z" });
  await store.getState().initialize(f.client, owner);
  const session = new PromptEditorSession(
    store.getState().prompts[0],
    () => true,
    (input) => store.getState().updatePrompt("prompt-1", input),
  );
  f.replaceStored({
    content: "Newer microsecond draft",
    updated_at: "2026-10-04T12:00:00.123457Z",
  });
  await store.getState().loadPrompts();
  session.refresh(store.getState().prompts[0]);
  assert.equal(store.getState().prompts[0].content, "Newer microsecond draft");
  assert.equal(session.getSnapshot().state.content, "Newer microsecond draft");
  assert.equal(
    session.getSnapshot().lastSavedAt,
    "2026-10-04T12:00:00.123457Z",
  );
  const current = store.getState().prompts[0];
  store.getState().updatePromptInStore({
    ...current,
    content: "Stale realtime/write",
    updatedAt: "2026-10-04T12:00:00.123456Z",
  });
  assert.equal(store.getState().prompts[0].content, "Newer microsecond draft");
  f.replaceStored({
    content: "Stale SDK load",
    updated_at: "2026-10-04T12:00:00.123456Z",
  });
  await store.getState().loadPrompts();
  assert.equal(store.getState().prompts[0].content, "Newer microsecond draft");
  session.refresh({
    ...current,
    content: "Stale editor refresh",
    updatedAt: "2026-10-04T12:00:00.123455Z",
  });
  assert.equal(session.getSnapshot().state.content, "Newer microsecond draft");
});

test("revision comparison normalizes timezones, fractional padding and rejects invalid server timestamps", () => {
  assert.equal(
    comparePromptRevisions(
      "2026-10-04T14:00:00.123456+02:00",
      "2026-10-04T12:00:00.123456Z",
    ),
    0,
  );
  assert.equal(
    comparePromptRevisions(
      "2026-10-04T12:00:00.123456Z",
      "2026-10-04T12:00:00.123Z",
    ),
    1,
  );
  assert.equal(
    comparePromptRevisions(
      "2026-10-04T12:00:00.123456Z",
      "2026-10-04T12:00:00.123457Z",
    ),
    -1,
  );
  assert.equal(
    comparePromptRevisions("2026-10-04T12:00:00.123456Z", "invalid timestamp"),
    null,
  );
  assert.equal(
    comparePromptRevisions("invalid timestamp", "2026-10-04T12:00:00.123456Z"),
    null,
  );
});
