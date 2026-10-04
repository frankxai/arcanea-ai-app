import { test, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PromptEditorSession } from "../editor-session";
import type { Prompt } from "../types";

let store: typeof import("../store").usePromptBooksStore;
before(async () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  store = (await import("../store")).usePromptBooksStore;
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
