import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fixture, owner, other, row } from "./fixtures";
import { PromptEditorSession } from "../editor-session";
import type { Prompt } from "../types";

let store: typeof import("../store").usePromptBooksStore;
before(async () => {
  const values = new Map<string, string>();
  values.set(
    "arcanea-prompt-books",
    JSON.stringify({
      version: 0,
      state: {
        prompts: [{ content: "Legacy private draft" }],
        collections: ["Legacy private collection"],
        tags: ["Legacy private tag"],
        _userId: "legacy-owner",
        activeCollectionId: "legacy-id",
        sidebarCollapsed: false,
        editorSplitView: false,
        viewMode: "grid",
      },
    }),
  );
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: globalThis.localStorage },
  });
  store = (await import("../store")).usePromptBooksStore;
  assert.deepEqual(store.getState().prompts, []);
  assert.deepEqual(store.getState().collections, []);
  assert.deepEqual(store.getState().tags, []);
  assert.equal(store.getState()._userId, null);
});

beforeEach(() => store.getState().reset());

async function editor(client: SupabaseClient) {
  await store.getState().initialize(client, owner);
  const prompt = store.getState().prompts[0];
  assert.ok(prompt);
  return new PromptEditorSession(
    prompt,
    () => store.getState()._userId === owner,
    (input, revision) =>
      store.getState().updatePrompt(prompt.id, input, revision),
  );
}

test("first edit autosaves through actual SDK/service and confirms stored time", async () => {
  const f = await fixture();
  const session = await editor(f.client);
  const unsubscribe = session.subscribe(() => {});
  try {
    session.updateField("content", "First automatic draft");
    await new Promise((resolve) => setTimeout(resolve, 2300));
    assert.equal(f.saved().content, "First automatic draft");
    assert.equal(session.getSnapshot().isDirty, false);
    assert.equal(session.getSnapshot().lastSavedAt, f.saved().updated_at);
  } finally {
    unsubscribe();
  }
});

test("concurrent Back/save waiters drain the latest keystrokes before returning", async () => {
  const f = await fixture();
  const session = await editor(f.client);
  session.updateField("content", "First snapshot");
  const gate = f.hold("PATCH");
  const save = session.save();
  await gate.entered.promise;
  session.updateField("content", "Latest snapshot");
  const back = session.save();
  gate.release.resolve();
  assert.deepEqual(await Promise.all([save, back]), [true, true]);
  assert.equal(f.saved().content, "Latest snapshot");
  assert.equal(session.getSnapshot().isDirty, false);
});

test("failed latest write refuses Back, retains draft, then explicit retry succeeds", async () => {
  const f = await fixture();
  const session = await editor(f.client);
  session.updateField("content", "First snapshot");
  const gate = f.hold("PATCH");
  const saving = session.save();
  await gate.entered.promise;
  session.updateField("content", "Recover this exact draft");
  f.fail();
  const back = session.save();
  gate.release.resolve();
  assert.deepEqual(await Promise.all([saving, back]), [false, false]);
  assert.equal(session.getSnapshot().state.content, "Recover this exact draft");
  assert.equal(session.getSnapshot().isDirty, true);
  assert.match(session.getSnapshot().saveError ?? "", /Retry save/);
  assert.equal(await session.save(), true);
  assert.equal(f.saved().content, "Recover this exact draft");
});

test("late older collection read cannot rewind the confirmed prompt", async () => {
  const f = await fixture();
  const session = await editor(f.client);
  const gate = f.hold("GET");
  const loading = store.getState().loadPrompts();
  await gate.entered.promise;
  session.updateField("content", "New confirmed content");
  assert.equal(await session.save(), true);
  gate.release.resolve();
  await loading;
  assert.equal(store.getState().prompts[0].content, "New confirmed content");
  session.refresh(store.getState().prompts[0]);
  assert.equal(session.getSnapshot().state.content, "New confirmed content");
});

test("A/B/A account switch rejects old write even when client and owner return", async () => {
  const f = await fixture();
  const session = await editor(f.client);
  session.updateField("content", "Private owner draft");
  const gate = f.hold("PATCH");
  const saving = session.save();
  await gate.entered.promise;
  const foreign = await fixture(other);
  await store.getState().initialize(foreign.client, other);
  assert.equal(store.getState().prompts[0].userId, other);
  await store.getState().initialize(f.client, owner);
  gate.release.resolve();
  assert.equal(await saving, false);
  assert.equal(session.getSnapshot().isDirty, true);
  assert.equal(session.getSnapshot().state.content, "Private owner draft");
  assert.equal(await session.save(), true);
});

test("logout rejects a delayed load and clears all private state", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("GET");
  const loading = store.getState().loadPrompts();
  await gate.entered.promise;
  store.getState().reset();
  gate.release.resolve();
  await loading;
  const state = store.getState();
  assert.deepEqual(
    [state.collections, state.prompts, state.tags, state.searchResults],
    [[], [], [], []],
  );
  assert.equal(state._userId, null);
  assert.equal(state._client, null);
});

test("caller filters cannot override owner, and foreign realtime rows are refused", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().loadPrompts({ userId: other });
  assert.equal(
    f.requests.at(-1)?.url.searchParams.get("user_id"),
    `eq.${owner}`,
  );
  const prompt = {
    ...store.getState().prompts[0],
    userId: other,
    content: "Foreign private draft",
  } as Prompt;
  store.getState().addPrompt(prompt);
  store.getState().updatePromptInStore(prompt);
  assert.equal(store.getState().prompts[0].content, "Original");
});

test("hydrate accepts validated preferences only, never private or runtime fields", () => {
  const merge = store.persist.getOptions().merge!;
  const current = store.getState();
  const hydrated = merge(
    {
      prompts: [{ content: "Legacy private draft" }],
      collections: ["private"],
      _userId: other,
      _client: "foreign",
      _sessionVersion: 123,
      activeCollectionId: "private",
      sidebarCollapsed: true,
      editorSplitView: "wrong type",
      viewMode: "list",
    },
    current,
  );
  assert.deepEqual(hydrated.prompts, []);
  assert.deepEqual(hydrated.collections, []);
  assert.equal(hydrated._userId, null);
  assert.equal(hydrated._client, null);
  assert.equal(hydrated.activeCollectionId, null);
  assert.equal(hydrated._sessionVersion, current._sessionVersion);
  assert.equal(hydrated.sidebarCollapsed, true);
  assert.equal(hydrated.editorSplitView, false);
  assert.equal(hydrated.viewMode, "list");
  assert.deepEqual(
    Object.keys(store.persist.getOptions().partialize!(hydrated)).sort(),
    ["editorSplitView", "sidebarCollapsed", "viewMode"],
  );
});

test("an old collection failure cannot mark a newer successful selection as errored", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("GET");
  f.failRead();
  store.getState().setActiveCollection("old");
  await gate.entered.promise;
  store.getState().setActiveCollection("new");
  await new Promise((resolve) => setTimeout(resolve, 30));
  gate.release.resolve();
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(store.getState().activeCollectionId, "new");
  assert.equal(store.getState().syncStatus, "synced");
});

test("old failed account load cannot change the new account's status", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("GET");
  f.failRead();
  store.getState().setActiveCollection("old");
  await gate.entered.promise;
  const foreign = await fixture(other);
  await store.getState().initialize(foreign.client, other);
  gate.release.resolve();
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(store.getState()._userId, other);
  assert.equal(store.getState().syncStatus, "synced");
});

test("current failed collection load reports an error honestly", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.failRead();
  store.getState().setActiveCollection("current");
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(store.getState().syncStatus, "error");
});

test("registered A realtime callbacks are ignored after A/B/A, including old unsubscribe", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  type Callback = (payload: {
    eventType: "UPDATE";
    new: Record<string, unknown>;
    old: Record<string, unknown>;
  }) => void;
  const callbacks: Record<string, Callback> = {};
  Object.defineProperty(f.client, "channel", {
    value: () => {
      const channel = {
        on: (_event: string, filter: { table: string }, callback: Callback) => {
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
  const old = new PromptBooksSync(f.client, owner);
  old.subscribe();
  const foreign = await fixture(other);
  await store.getState().initialize(foreign.client, other);
  await store.getState().initialize(f.client, owner);
  store.getState().setLastSyncAt("current-session-marker");
  for (const table of ["pb_prompts", "pb_collections", "pb_tags"]) {
    callbacks[table]({
      eventType: "UPDATE",
      old: {},
      new: {
        ...row(owner),
        id:
          table === "pb_prompts"
            ? "prompt-1"
            : table === "pb_tags"
              ? "tag-1"
              : "collection-1",
        name: "Stale owner A callback",
        content: "Stale owner A callback",
        updated_at: "2099-01-01T00:00:00Z",
      },
    });
  }
  assert.equal(store.getState().prompts[0].content, "Original");
  assert.equal(store.getState().collections[0].name, "Owned fixture row");
  assert.equal(store.getState().tags[0].name, "Owned fixture row");
  assert.equal(store.getState().lastSyncAt, "current-session-marker");
  old.unsubscribe();
  assert.equal(store.getState().syncStatus, "synced");
});
