const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

function fixture() {
  const data = new Map();
  const calls = [];
  let userId = "creator-a";
  let resolveUser = null;
  let cloudData = [];
  const localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  const client = {
    auth: {
      getUser: async () => {
        const id = resolveUser ? await resolveUser : userId;
        return { data: { user: id ? { id } : null } };
      },
    },
    from: (table) => {
      const call = { table, filters: [] };
      calls.push(call);
      const builder = {
        eq: (key, value) => {
          call.filters.push([key, value]);
          return builder;
        },
        select: () => builder,
        order: () => builder,
        limit: () => builder,
        in: () => builder,
        delete: () => {
          call.action = "delete";
          return builder;
        },
        update: (value) => {
          call.action = "update";
          call.value = value;
          return builder;
        },
        upsert: (value) => {
          call.action = "upsert";
          call.value = value;
          return builder;
        },
        then: (resolve) =>
          Promise.resolve({ data: cloudData, error: null }).then(resolve),
      };
      return builder;
    },
  };
  const modules = new Map();
  function load(name) {
    if (modules.has(name)) return modules.get(name);
    const api = {};
    const text = fs.readFileSync(
      path.resolve(__dirname, `../../apps/web/lib/chat/${name}.ts`),
      "utf8",
    );
    vm.runInNewContext(
      ts.transpileModule(text, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
      {
        exports: api,
        window: {},
        localStorage,
        console,
        crypto: require("node:crypto").webcrypto,
        require: (id) => {
          if (id === "@/lib/supabase/client")
            return { createClient: () => client };
          if (id === "@/lib/chat/local-store") return load("local-store");
          throw new Error(`Unexpected dependency: ${id}`);
        },
      },
    );
    modules.set(name, api);
    return api;
  }
  return {
    data,
    calls,
    localStorage,
    load,
    setUser: (id) => {
      userId = id;
    },
    delayUser: (promise) => {
      resolveUser = promise;
    },
    setRows: (rows) => {
      cloudData = rows;
    },
  };
}
const message = (text) => [{ id: "message", role: "user", content: text }];
const cloudSession = {
  id: "session-a",
  title: "A private scene",
  messages: [],
  luminorId: null,
  modelId: null,
};

test("unattributed legacy history is preserved and excluded from every actor scope", () => {
  const f = fixture();
  const api = f.load("local-store");
  api.saveChatSession("old", message("Legacy private scene"));
  const original = f.data.get("arcanea_chat_sessions");
  for (const owner of [null, "creator-a", "creator-b"]) {
    const store = api.createChatSessionStore(owner);
    assert.equal(store.listChatSessions().length, 0);
    assert.equal(store.loadChatSession("old"), null);
    store.saveChatSession("fresh", message(`New ${owner}`));
  }
  assert.equal(f.data.get("arcanea_chat_sessions"), original);
});

test("read, search, active ID, rename, pin and delete stay in the initiating actor", () => {
  const f = fixture();
  const api = f.load("local-store");
  const a = api.createChatSessionStore("creator-a");
  const b = api.createChatSessionStore("creator-b");
  const guest = api.createChatSessionStore(null);
  a.saveChatSession("same-id", message("A private scene"));
  b.saveChatSession("same-id", message("B private scene"));
  a.setActiveChatSessionId("same-id");
  assert.equal(b.getActiveChatSessionId(), null);
  assert.equal(guest.loadChatSession("same-id"), null);
  assert.equal(b.searchSessions("A private").length, 0);
  b.renameChatSession("same-id", "B renamed");
  b.togglePinSession("same-id");
  b.deleteChatSession("same-id");
  assert.equal(a.loadChatSession("same-id").title, "A private scene");
  assert.equal(a.loadChatSession("same-id").pinned, false);
});

test("project selection and deletion cannot alter another actor's sessions or projects", () => {
  const f = fixture();
  const sessions = f.load("local-store");
  const projects = f.load("project-store");
  const a = projects.createChatProjectStore("creator-a");
  const b = projects.createChatProjectStore("creator-b");
  const project = a.createChatProject({ title: "A secret world" });
  sessions
    .createChatSessionStore("creator-a")
    .saveChatSession("same-id", message("A"), { projectId: project.id });
  sessions
    .createChatSessionStore("creator-b")
    .saveChatSession("same-id", message("B"), { projectId: project.id });
  assert.equal(b.listChatProjects().length, 0);
  assert.equal(b.getActiveChatProjectId(), null);
  a.deleteChatProject(project.id);
  assert.equal(
    sessions.createChatSessionStore("creator-a").loadChatSession("same-id")
      .projectId,
    null,
  );
  assert.equal(
    sessions.createChatSessionStore("creator-b").loadChatSession("same-id")
      .projectId,
    project.id,
  );
});

test("a stale cloud operation refuses an account resolved after the switch", async () => {
  const f = fixture();
  const api = f.load("supabase-store");
  let resolve;
  f.delayUser(
    new Promise((r) => {
      resolve = r;
    }),
  );
  const pending = api.saveSessionToCloud(cloudSession, "creator-a");
  resolve("creator-b");
  assert.equal(await pending, false);
  assert.equal((await api.loadCloudSessions("creator-a")).length, 0);
  assert.equal(
    await api.renameCloudSession("session-a", "rename", "creator-a"),
    false,
  );
  assert.equal(await api.deleteCloudSession("session-a", "creator-a"), false);
  assert.equal(f.calls.length, 0);
});

test("guest cloud operations never attribute guest work to a logged-in account", async () => {
  const f = fixture();
  const api = f.load("supabase-store");
  assert.equal(await api.saveSessionToCloud(cloudSession, null), false);
  assert.equal((await api.loadCloudSessions(null)).length, 0);
  assert.equal(await api.deleteCloudSession("session-a", null), false);
  const projects = f.load("project-store").createChatProjectStore(null);
  assert.equal(
    await projects.saveProjectToCloud({ id: "project", title: "Guest world" }),
    false,
  );
  assert.equal(f.calls.length, 0);
});

test("authorized cloud writes and mutations carry the initiating account filter", async () => {
  const f = fixture();
  const api = f.load("supabase-store");
  assert.equal(await api.saveSessionToCloud(cloudSession, "creator-a"), true);
  assert.equal(f.calls[0].value.user_id, "creator-a");
  assert.equal(
    await api.renameCloudSession("session-a", "Renamed", "creator-a"),
    true,
  );
  assert.equal(await api.deleteCloudSession("session-a", "creator-a"), true);
  for (const call of f.calls.slice(1)) {
    assert.ok(
      call.filters.some(
        ([key, value]) => key === "user_id" && value === "creator-a",
      ),
    );
  }
});

test("project cloud sync and mutations refuse a different current account", async () => {
  const f = fixture();
  const a = f.load("project-store").createChatProjectStore("creator-a");
  f.setUser("creator-b");
  assert.equal((await a.syncProjectsFromCloud()).length, 0);
  assert.equal(
    await a.saveProjectToCloud({ id: "project-a", title: "A world" }),
    false,
  );
  assert.equal(
    await a.assignCloudSessionToProject("session-a", "project-a"),
    false,
  );
  assert.equal(await a.deleteProjectFromCloud("project-a"), false);
  assert.equal(f.calls.length, 0);
});

test("malformed cloud message payload recovers without breaking hydration", () => {
  const api = fixture().load("supabase-store");
  const result = api.cloudSessionToLocalSession({
    id: "metadata-only",
    title: "Scene",
    messages: null,
  });
  assert.equal(result.messages.length, 0);
});

test("newer metadata-only cloud rows preserve saved messages and local pins", () => {
  const f = fixture();
  const store = f.load("local-store").createChatSessionStore("creator-a");
  store.saveChatSession("saved-scene", [
    {
      id: "scene-message",
      role: "user",
      content: "Keep this scene",
      parts: [{ type: "text", text: "Keep this scene" }],
    },
  ]);
  store.togglePinSession("saved-scene");
  const before = store.loadChatSession("saved-scene");
  const metadata = f.load("supabase-store").cloudSessionToLocalSession({
    id: before.id,
    title: "Renamed in the cloud",
    messages: null,
    created_at: before.createdAt,
    updated_at: new Date(Date.parse(before.updatedAt) + 1000).toISOString(),
  });
  store.mergeChatSessions([metadata]);
  const after = store.loadChatSession(before.id);
  assert.deepEqual(
    JSON.parse(JSON.stringify(after.messages)),
    JSON.parse(JSON.stringify(before.messages)),
  );
  assert.equal(after.title, metadata.title);
  assert.equal(after.pinned, true);
  assert.equal(store.searchSessions("Keep this scene").length, 1);
  const other = f.load("local-store").createChatSessionStore("creator-b");
  assert.equal(other.loadChatSession(before.id), null);
});

test("newer nonempty cloud transcripts still replace older local messages", () => {
  const store = fixture()
    .load("local-store")
    .createChatSessionStore("creator-a");
  store.saveChatSession("scene", [{ id: "old", role: "user", content: "Old" }]);
  const before = store.loadChatSession("scene");
  store.mergeChatSessions([
    {
      ...before,
      messages: [{ id: "new", role: "assistant", content: "Revised scene" }],
      updatedAt: new Date(Date.parse(before.updatedAt) + 1000).toISOString(),
    },
  ]);
  assert.equal(
    store.loadChatSession("scene").messages[0].content,
    "Revised scene",
  );
});

test("invalid entries in a cloud message array do not break valid-message recovery", () => {
  const api = fixture().load("supabase-store");
  const result = api.cloudSessionToLocalSession({
    id: "partial-cloud",
    title: "Scene",
    messages: [
      null,
      false,
      42,
      "bad",
      [],
      { id: "valid", role: "user", content: "Recovered" },
    ],
  });
  assert.equal(result.messages.length, 1);
  assert.equal(result.messages[0].content, "Recovered");
});
