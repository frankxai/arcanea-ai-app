const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

// Reuse the existing harness; every operation still evaluates actual app source.
const harness = fs.readFileSync(
  path.join(__dirname, "chat-account-storage.test.cjs"),
  "utf8",
);
const fixture = new Function(
  "require",
  "__dirname",
  `${harness.slice(0, harness.indexOf("\nconst A ="))}\nreturn fixture;`,
)(require, __dirname);
const actor = "user:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const id = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const messages = [
  {
    id: "sdk-message",
    role: "user",
    content: "My complete private manuscript",
  },
];

test("new conversations use the live UUID contract", () => {
  const f = fixture();
  const store = f.load("lib/chat/local-store.ts");
  assert.match(
    store.newSessionId(),
    /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i,
  );
});

test("hydration cannot replace an unsaved local edit with another device's copy", () => {
  const f = fixture();
  const scope = f.scope(actor);
  const store = f.load("lib/chat/local-store.ts");
  store.saveChatSession(id, messages, undefined, scope);
  store.mergeChatSessions(
    [
      {
        id,
        title: "Cloud title",
        messages: [{ id: "other", role: "user", content: "Other device" }],
        createdAt: "2030-01-01T00:00:00.000Z",
        updatedAt: "2030-01-01T00:00:00.000Z",
        cloudRevision: "remote-revision",
      },
    ],
    scope,
  );
  assert.equal(
    store.loadChatSession(id, scope).messages[0].content,
    messages[0].content,
  );
});

test("saving past the history cache budget preserves every unsynced manuscript", () => {
  const f = fixture();
  const scope = f.scope(actor);
  const store = f.load("lib/chat/local-store.ts");
  for (let index = 0; index < 51; index++) {
    assert.equal(
      store.saveChatSession(`draft-${index}`, messages, undefined, scope),
      true,
    );
  }
  assert.equal(store.listChatSessions(scope).length, 51);
  assert.equal(
    store.loadChatSession("draft-0", scope).messages[0].content,
    messages[0].content,
  );
});

function acknowledgedHistory(count, pinned = false) {
  return Array.from({ length: count }, (_, index) => ({
    id: `cloud-${index}`,
    title: `Saved world ${index}`,
    messages,
    pinned,
    cloudDirty: false,
    cloudRevision: "a".repeat(64),
    createdAt: new Date(Date.UTC(2030, 0, 1, 0, index)).toISOString(),
    updatedAt: new Date(Date.UTC(2030, 0, 1, 0, index)).toISOString(),
  }));
}

test("cloud hydration prunes acknowledged cache entries while retaining older unsynced work", () => {
  const { scope, store } = setup();
  store.mergeChatSessions(acknowledgedHistory(50), scope);
  assert.equal(
    store.loadChatSession(id, scope).messages[0].content,
    messages[0].content,
  );
  assert.equal(store.listChatSessions(scope).length, 50);
  assert.equal(store.loadChatSession("cloud-0", scope), null);
  assert.ok(store.loadChatSession("cloud-49", scope));
});

test("pinned history cannot make a new save report success while discarding its manuscript", () => {
  const f = fixture();
  const scope = f.scope(actor);
  const store = f.load("lib/chat/local-store.ts");
  store.replaceChatSessions(acknowledgedHistory(50, true), scope);
  assert.equal(store.saveChatSession(id, messages, undefined, scope), true);
  assert.equal(
    store.loadChatSession(id, scope).messages[0].content,
    messages[0].content,
  );
  assert.equal(
    store.listChatSessions(scope).filter((session) => session.pinned).length,
    50,
  );
});

test("history replacement preserves pins and copies without a trustworthy cloud acknowledgement", () => {
  const f = fixture();
  const scope = f.scope(actor);
  const store = f.load("lib/chat/local-store.ts");
  const history = acknowledgedHistory(52);
  history[0].cloudRevision = undefined;
  history[1].cloudRevision = "unconfirmed";
  for (const session of history.slice(2)) session.pinned = true;
  store.replaceChatSessions(history, scope);
  assert.equal(store.listChatSessions(scope).length, 52);
});

test("metadata hydration cannot classify a retained complete manuscript as cloud-saved", () => {
  const { f, scope, store } = setup();
  const local = store.loadChatSession(id, scope);
  const key = f
    .load("lib/chat/cloud-snapshot.ts")
    .chatSnapshotContentKey(local);
  store.acknowledgeChatSnapshot(id, "a".repeat(64), key, scope);
  store.mergeChatSessions(
    [
      {
        ...local,
        messages: [],
        cloudDirty: false,
        cloudRevision: "b".repeat(64),
        updatedAt: "2030-01-01T00:00:00.000Z",
      },
    ],
    scope,
  );
  const retained = store.loadChatSession(id, scope);
  assert.equal(retained.messages[0].content, messages[0].content);
  assert.equal(retained.cloudDirty, true);
});

test("cloud hydration preserves a creator's device-local history pin", () => {
  const { scope, store } = setup();
  store.togglePinSession(id, scope);
  const local = store.loadChatSession(id, scope);
  store.mergeChatSessions(
    [
      {
        ...local,
        pinned: false,
        cloudDirty: false,
        cloudRevision: "a".repeat(64),
        updatedAt: "2030-01-01T00:00:00.000Z",
      },
    ],
    scope,
  );
  assert.equal(store.loadChatSession(id, scope).pinned, true);
});

test("cloud save sends the complete snapshot atomically with actor and base revision", async () => {
  const f = fixture();
  const scope = f.scope(actor);
  const store = f.load("lib/chat/local-store.ts");
  const cloud = f.load("lib/chat/supabase-store.ts");
  store.saveChatSession(id, messages, { title: "My manuscript" }, scope);
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  assert.equal(
    await cloud.saveSessionToCloud(
      { id, title: "My manuscript", messages, luminorId: null, modelId: null },
      scope,
    ),
    true,
  );
  assert.equal(f.calls[0].rpc, "save_chat_snapshot");
  assert.equal(f.calls[0].args.p_expected_user_id, actor.slice(5));
  assert.equal(f.calls[0].args.p_expected_revision, null);
  assert.equal(f.calls[0].args.p_messages[0].content, messages[0].content);
  assert.equal(store.loadChatSession(id, scope).cloudRevision, "a".repeat(64));
});

function setup() {
  const f = fixture();
  const scope = f.scope(actor);
  const store = f.load("lib/chat/local-store.ts");
  const cloud = f.load("lib/chat/supabase-store.ts");
  store.saveChatSession(id, messages, { title: "My manuscript" }, scope);
  return {
    f,
    scope,
    store,
    cloud,
    snapshot: {
      id,
      title: "My manuscript",
      messages,
      luminorId: null,
      modelId: null,
    },
  };
}

function restartWithStorage(previous) {
  const restarted = fixture();
  for (const [key, value] of previous.values) restarted.values.set(key, value);
  return restarted;
}

test("failed cloud deletion stays removed after source modules restart and hydration returns the old copy", async () => {
  const { f, scope, store, cloud } = setup();
  const original = store.loadChatSession(id, scope);
  store.deleteChatSession(id, scope);
  f.setQueryResult({ data: null, error: { message: "offline" } });
  assert.equal(await cloud.deleteCloudSession(id, scope), false);

  const restarted = restartWithStorage(f);
  const nextScope = restarted.scope(actor);
  const nextStore = restarted.load("lib/chat/local-store.ts");
  nextStore.mergeChatSessions([original], nextScope);
  assert.equal(nextStore.loadChatSession(id, nextScope), null);
  assert.equal(nextStore.listChatSessions(nextScope).length, 0);
});

test("a restarted client retries the originating account's pending cloud deletion", async () => {
  const { f, scope, store } = setup();
  store.deleteChatSession(id, scope);
  const restarted = restartWithStorage(f);
  await restarted
    .load("lib/chat/supabase-store.ts")
    .loadCloudSessions(restarted.scope(actor));
  const deletion = restarted.calls.find((call) => call.deleted);
  assert.ok(deletion);
  assert.ok(
    deletion.filters.some(
      ([column, value]) => column === "user_id" && value === actor.slice(5),
    ),
  );
});

test("storage refusal leaves the original conversation and makes no destructive cloud call", async () => {
  const { f, scope, store, cloud } = setup();
  f.storage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  assert.equal(await cloud.deleteCloudSession(id, scope), false);
  assert.equal(
    store.loadChatSession(id, scope).messages[0].content,
    messages[0].content,
  );
  assert.equal(f.calls.length, 0);
});

test("a stale save cannot recreate a deleted conversation after source modules restart", async () => {
  const { f, scope, store, snapshot } = setup();
  store.deleteChatSession(id, scope);
  const restarted = restartWithStorage(f);
  const nextScope = restarted.scope(actor);
  assert.equal(
    (
      await restarted
        .load("lib/chat/supabase-store.ts")
        .saveChatSnapshotToCloud(snapshot, nextScope)
    ).status,
    "retired",
  );
  assert.equal(restarted.calls.length, 0);
});

test("pending deletions never retry under another account or a retired lifetime", async () => {
  const { f, scope, store, cloud } = setup();
  store.deleteChatSession(id, scope);
  const other = f.scope("user:bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  f.setUser(other.actor.slice(5));
  await cloud.loadCloudSessions(other);
  await cloud.loadCloudSessions(scope);
  assert.equal(f.calls.filter((call) => call.deleted).length, 0);
  assert.equal(
    f.load("lib/chat/local-store.ts").listPendingChatDeletions(other).length,
    0,
  );
});

test("confirmed deletion barriers survive restart and do not retry or merge stale snapshots", async () => {
  const { f, scope, store, cloud } = setup();
  const original = store.loadChatSession(id, scope);
  assert.equal(await cloud.deleteCloudSession(id, scope), true);
  const restarted = restartWithStorage(f);
  const nextScope = restarted.scope(actor);
  const nextStore = restarted.load("lib/chat/local-store.ts");
  await restarted
    .load("lib/chat/supabase-store.ts")
    .loadCloudSessions(nextScope);
  nextStore.replaceChatSessions([original], nextScope);
  assert.equal(nextStore.loadChatSession(id, nextScope), null);
  assert.equal(nextStore.listPendingChatDeletions(nextScope).length, 0);
  assert.equal(restarted.calls.filter((call) => call.deleted).length, 0);
});

test("an already admitted cloud read cannot return a conversation deleted while it waited", async () => {
  const { f, scope, store, cloud } = setup();
  f.setRows([{ id, title: "Old cloud copy", messages }]);
  let release;
  f.delayQuery(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  const loading = cloud.loadCloudSessions(scope);
  while (f.calls.length === 0) await new Promise(setImmediate);
  assert.equal(store.deleteChatSession(id, scope), true);
  release();
  assert.equal((await loading).length, 0);
});

test("separate deletion keys retain every intent and retry only a bounded batch per hydration", async () => {
  const { f, scope, store, cloud } = setup();
  const ids = Array.from({ length: 6 }, (_, index) => `removed-${index}`);
  for (const sessionId of ids)
    assert.equal(store.deleteChatSession(sessionId, scope), true);
  assert.equal(store.listPendingChatDeletions(scope).length, 6);
  await cloud.loadCloudSessions(scope);
  assert.equal(f.calls.filter((call) => call.deleted).length, 5);
  assert.equal(store.listPendingChatDeletions(scope).length, 1);
  await cloud.loadCloudSessions(scope);
  assert.equal(f.calls.filter((call) => call.deleted).length, 6);
  assert.equal(store.listPendingChatDeletions(scope).length, 0);
});

test("quota refusal when cleaning the old cache retains durable deletion intent", async () => {
  const { f, scope, store } = setup();
  const originalSet = f.storage.setItem;
  f.storage.setItem = (key, value) => {
    if (key.startsWith("arcanea_chat_sessions:"))
      throw new Error("QuotaExceededError");
    originalSet(key, value);
  };
  assert.equal(store.deleteChatSession(id, scope), true);
  const restarted = restartWithStorage(f);
  const nextScope = restarted.scope(actor);
  const nextStore = restarted.load("lib/chat/local-store.ts");
  assert.equal(nextStore.loadChatSession(id, nextScope), null);
  assert.equal(nextStore.listPendingChatDeletions(nextScope).length, 1);
});

test("failure to retain the cloud acknowledgement leaves the deletion pending for replay", async () => {
  const { f, scope, store, cloud } = setup();
  const originalSet = f.storage.setItem;
  f.storage.setItem = (key, value) => {
    if (value === "confirmed") throw new Error("QuotaExceededError");
    originalSet(key, value);
  };
  assert.equal(await cloud.deleteCloudSession(id, scope), false);
  assert.equal(store.loadChatSession(id, scope), null);
  assert.equal(store.listPendingChatDeletions(scope).length, 1);
  f.storage.setItem = originalSet;
  assert.equal(await cloud.deleteCloudSession(id, scope), true);
  assert.equal(store.listPendingChatDeletions(scope).length, 0);
});

test("overlapping deletion retries are idempotent after the first acknowledgement", async () => {
  const { scope, cloud } = setup();
  const results = await Promise.all([
    cloud.deleteCloudSession(id, scope),
    cloud.deleteCloudSession(id, scope),
  ]);
  assert.deepEqual(results, [true, true]);
});

test("initial hydration renders no browser-cache-dependent history or save label", () => {
  const { f, scope, store } = setup();
  store.setActiveChatSessionId(id, scope);
  f.load("lib/chat/project-store.ts").createChatProject(
    { title: "Private world" },
    scope,
  );
  const hook = f.load("hooks/use-chat-sessions.ts").useChatSessions();
  assert.equal(hook.saveStatus, "idle");
  assert.equal(hook.allSessions.length, 0);
  assert.equal(hook.projects.length, 0);
  assert.equal(hook.activeProject, null);
  assert.equal(hook.activeProjectId, null);
});

test("old account-scoped IDs map to stable actor-specific UUIDs without rekeying old work", async () => {
  const f = fixture();
  const helper = f.load("lib/chat/cloud-snapshot.ts");
  const first = await helper.chatSnapshotCloudId("chat_old", actor.slice(5));
  assert.equal(
    first,
    await helper.chatSnapshotCloudId("chat_old", actor.slice(5)),
  );
  assert.notEqual(
    first,
    await helper.chatSnapshotCloudId(
      "chat_old",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ),
  );
  assert.match(
    first,
    /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
});

test("a conflict or unavailable RPC retains the local work without a false acknowledgement", async () => {
  const { f, scope, store, cloud, snapshot } = setup();
  f.setRpcResult({
    data: null,
    error: { code: "P0001", message: "chat_revision_conflict" },
  });
  assert.equal(
    (await cloud.saveChatSnapshotToCloud(snapshot, scope)).status,
    "conflict",
  );
  f.setRpcResult({
    data: null,
    error: { code: "PGRST202", message: "Function not installed" },
  });
  assert.equal(
    (await cloud.saveChatSnapshotToCloud(snapshot, scope)).status,
    "unavailable",
  );
  const retained = store.loadChatSession(id, scope);
  assert.equal(retained.messages[0].content, messages[0].content);
  assert.equal(retained.cloudRevision, undefined);
  assert.equal(retained.cloudDirty, true);
});

test("a late acknowledgement advances the base without marking newer local work saved", async () => {
  const { f, scope, store, cloud, snapshot } = setup();
  let release;
  f.delayQuery(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  const saving = cloud.saveChatSnapshotToCloud(snapshot, scope);
  while (!f.calls.length) await Promise.resolve();
  store.saveChatSession(
    id,
    [{ ...messages[0], content: "Newer local edit" }],
    { title: "My manuscript" },
    scope,
  );
  release();
  await saving;
  const retained = store.loadChatSession(id, scope);
  assert.equal(retained.messages[0].content, "Newer local edit");
  assert.equal(retained.cloudRevision, "a".repeat(64));
  assert.equal(retained.cloudDirty, true);
});

test("overlapping saves serialize and use the preceding confirmed base revision", async () => {
  const { f, scope, store, cloud, snapshot } = setup();
  let release;
  f.delayQuery(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  const first = cloud.saveChatSnapshotToCloud(snapshot, scope);
  while (!f.calls.length) await Promise.resolve();
  const nextMessages = [{ ...messages[0], content: "Next edit" }];
  store.saveChatSession(id, nextMessages, { title: "My manuscript" }, scope);
  const second = cloud.saveChatSnapshotToCloud(
    { ...snapshot, messages: nextMessages },
    scope,
  );
  await Promise.resolve();
  assert.equal(f.calls.length, 1);
  release();
  await Promise.all([first, second]);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[1].args.p_expected_revision, "a".repeat(64));
  assert.equal(f.calls[1].args.p_messages[0].content, "Next edit");
  assert.equal(store.loadChatSession(id, scope).cloudDirty, false);
});

test("retired account lifetime discards an in-flight cloud acknowledgement", async () => {
  const { f, scope, store, cloud, snapshot } = setup();
  let release;
  f.delayQuery(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  const saving = cloud.saveChatSnapshotToCloud(snapshot, scope);
  while (!f.calls.length) await Promise.resolve();
  f.scope("user:bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  release();
  assert.equal((await saving).status, "retired");
  const newA = f.scope(actor);
  assert.equal(store.loadChatSession(id, newA).cloudRevision, undefined);
});

test("cloud loading requests normalized full snapshots and preserves SDK IDs and parts", async () => {
  const { f, scope, cloud } = setup();
  f.setRpcResult({
    data: [
      {
        id: "chat_old",
        title: "Cloud manuscript",
        messages: [
          {
            id: "sdk-id",
            role: "assistant",
            content: "Saved content",
            parts: [{ type: "text", text: "Saved content" }],
          },
        ],
        revision: "b".repeat(64),
        created_at: "2026-10-01",
        updated_at: "2026-10-02",
      },
    ],
    error: null,
  });
  const sessions = await cloud.loadCloudSessions(scope);
  assert.equal(f.calls[0].rpc, "load_chat_snapshots");
  assert.equal(f.calls[0].args.p_expected_user_id, actor.slice(5));
  const local = cloud.cloudSessionToLocalSession(sessions[0]);
  assert.equal(local.messages[0].id, "sdk-id");
  assert.equal(local.messages[0].parts[0].text, "Saved content");
  assert.equal(local.cloudRevision, "b".repeat(64));
});

test("queued deletion follows the in-flight save and prevents later replay from resurrecting it", async () => {
  const { f, scope, store, cloud, snapshot } = setup();
  let release;
  f.delayQuery(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  const saving = cloud.saveChatSnapshotToCloud(snapshot, scope);
  while (!f.calls.length) await Promise.resolve();
  store.deleteChatSession(id, scope);
  const deleting = cloud.deleteCloudSession(id, scope);
  const replay = cloud.saveChatSnapshotToCloud(snapshot, scope);
  release();
  await Promise.all([saving, deleting]);
  assert.equal((await replay).status, "retired");
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[1].deleted, true);
  assert.equal(store.loadChatSession(id, scope), null);
});

test("invalid structured content is denied before network rather than silently discarded", async () => {
  const { f, scope, cloud, snapshot } = setup();
  const bad = [
    {
      ...messages[0],
      parts: [
        {
          type: "text",
          text: "Visible",
          privateAttachment: "Must not disappear",
        },
      ],
    },
  ];
  assert.equal(
    (await cloud.saveChatSnapshotToCloud({ ...snapshot, messages: bad }, scope))
      .status,
    "failed",
  );
  assert.equal(f.calls.length, 0);
});

test("browser storage failure is reported and does not invent a durable local copy", () => {
  const f = fixture();
  const scope = f.scope(actor);
  f.storage.setItem = () => {
    throw new Error("Quota exceeded");
  };
  assert.equal(
    f
      .load("lib/chat/local-store.ts")
      .saveChatSession(id, messages, undefined, scope),
    false,
  );
  assert.equal(f.values.size, 0);
});

test("storage failure after an older cached draft sends current content and keeps a usable cloud base", async () => {
  const { f, scope, store, cloud, snapshot } = setup();
  store.setActiveChatSessionId(id, scope);
  f.storage.setItem = () => {
    throw new Error("Quota exceeded");
  };
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  const hook = f.load("hooks/use-chat-sessions.ts").useChatSessions();
  hook.saveMessages([
    { ...messages[0], content: "Current in-memory manuscript" },
  ]);
  f.flushTimers();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(
    f.calls[0].args.p_messages[0].content,
    "Current in-memory manuscript",
  );
  assert.equal(
    store.loadChatSession(id, scope).messages[0].content,
    messages[0].content,
  );
  await cloud.saveChatSnapshotToCloud(
    {
      ...snapshot,
      messages: [{ ...messages[0], content: "Next current edit" }],
    },
    scope,
  );
  assert.equal(f.calls[1].args.p_expected_revision, "a".repeat(64));
});

test("the conflict action creates a new private copy and preserves the original", async () => {
  const { f, scope, store } = setup();
  store.setActiveChatSessionId(id, scope);
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  const hook = f.load("hooks/use-chat-sessions.ts").useChatSessions();
  hook.saveSeparateCopy();
  const selected = store.getActiveChatSessionId(scope);
  assert.notEqual(selected, id);
  assert.equal(
    store.loadChatSession(selected, scope).messages[0].content,
    messages[0].content,
  );
  assert.equal(store.loadChatSession(selected, scope).cloudRevision, undefined);
  assert.equal(store.loadChatSession(id, scope).title, "My manuscript");
  // Let the finite, credential-free RPC fixture settle before ending the test.
  await new Promise((resolve) => setImmediate(resolve));
});
