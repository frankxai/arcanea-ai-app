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
