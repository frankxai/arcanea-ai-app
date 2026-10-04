import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

// Real pinned SDK and app service, with a disposable in-memory HTTP transport.
// This verifies caller/response behavior, never hosted RLS or owner acceptance.
const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const row = (userId = owner) => ({
  id: "prompt-1",
  user_id: userId,
  title: "Recovery prompt",
  content: "Original",
  prompt_type: "general",
  updated_at: "2026-10-04T12:00:00.000Z",
  created_at: "2026-10-04T12:00:00.000Z",
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function fixture(userId = owner) {
  let saved = row(userId);
  let fail = false;
  let readFailure = false;
  let held: {
    method: string;
    entered: ReturnType<typeof deferred<void>>;
    release: ReturnType<typeof deferred<void>>;
  } | null = null;
  const requests: { url: URL; method: string }[] = [];
  const user = {
    id: userId,
    aud: "authenticated",
    role: "authenticated",
    email: "owner@example.test",
    app_metadata: {},
    user_metadata: {},
    created_at: "2026-10-04T12:00:00Z",
  };
  const token = [
    Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),
    Buffer.from(
      JSON.stringify({
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: "authenticated",
        role: "authenticated",
      }),
    ).toString("base64url"),
    "fixture-signature",
  ].join(".");
  const client = createClient(
    "https://fixture.supabase.co",
    "fixture-anon-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async (input, init) => {
          const url = new URL(String(input));
          const method = init?.method ?? "GET";
          requests.push({ url, method });
          if (url.pathname.endsWith("/token"))
            return Response.json({
              access_token: token,
              refresh_token: "fixture-refresh",
              token_type: "bearer",
              expires_in: 3600,
              user,
            });
          if (url.pathname.endsWith("/user")) return Response.json(user);
          if (!url.pathname.includes("/rest/v1/"))
            throw new Error("Unexpected fixture endpoint");
          let result: unknown = [];
          let status = 200;
          if (
            url.pathname.endsWith("/pb_collections") ||
            url.pathname.endsWith("/pb_tags")
          ) {
            result = [
              {
                id: url.pathname.endsWith("/pb_tags")
                  ? "tag-1"
                  : "collection-1",
                user_id: userId,
                name: "Owned fixture row",
                is_global: true,
                created_at: saved.created_at,
                updated_at: saved.updated_at,
              },
            ];
          }
          if (url.pathname.endsWith("/pb_prompts")) {
            if (method === "PATCH") {
              if (fail) {
                fail = false;
                result = {
                  message: "Disposable write failure",
                  code: "fixture",
                };
                status = 400;
              } else
                saved = {
                  ...saved,
                  ...JSON.parse(String(init?.body)),
                  updated_at: new Date(
                    Date.parse(saved.updated_at) + 1000,
                  ).toISOString(),
                };
            }
            if (status === 200)
              result = new Headers(init?.headers)
                .get("accept")
                ?.includes("object")
                ? { ...saved }
                : [{ ...saved }];
          }
          const gate = held;
          if (
            readFailure &&
            method === "GET" &&
            url.pathname.endsWith("/pb_prompts")
          ) {
            readFailure = false;
            status = 400;
            result = { message: "Disposable read failure", code: "fixture" };
          }
          if (gate?.method === method && url.pathname.endsWith("/pb_prompts")) {
            held = null;
            gate.entered.resolve();
            await gate.release.promise;
          }
          return Response.json(result, { status });
        },
      },
    },
  );
  assert.equal(
    (
      await client.auth.signInWithPassword({
        email: user.email,
        password: "disposable-fixture",
      })
    ).error,
    null,
  );
  return {
    client,
    requests,
    saved: () => saved,
    fail: () => {
      fail = true;
    },
    failRead: () => {
      readFailure = true;
    },
    hold: (method: string) => {
      const gate = {
        method,
        entered: deferred<void>(),
        release: deferred<void>(),
      };
      held = gate;
      return gate;
    },
  };
}

beforeEach(() => store.getState().reset());

async function editor(client: SupabaseClient) {
  await store.getState().initialize(client, owner);
  const prompt = store.getState().prompts[0];
  assert.ok(prompt);
  return new PromptEditorSession(
    prompt,
    () => store.getState()._userId === owner,
    (input) => store.getState().updatePrompt(prompt.id, input),
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
