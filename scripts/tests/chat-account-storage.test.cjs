const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { stripTypeScriptTypes } = require("node:module");
const { test } = require("node:test");

// Exercise the actual dependency-free stores, not copies of their algorithms.
function fixture() {
  const values = new Map();
  const storage = {
    get length() {
      return values.size;
    },
    key: (index) => Array.from(values.keys())[index] ?? null,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const modules = new Map();
  const calls = [];
  const timers = new Map();
  let timerId = 0;
  let userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  let cloudRows = [];
  let authWait;
  let queryWait;
  let rpcResult;
  let queryResult;
  let hookCursor = null;
  let renderRequested = false;
  const hookCells = [];
  const effects = [];
  const sameDeps = (previous, next) =>
    previous &&
    next &&
    previous.length === next.length &&
    previous.every((value, index) => Object.is(value, next[index]));
  const react = {
    useState(initial) {
      if (hookCursor === null)
        return [typeof initial === "function" ? initial() : initial, () => {}];
      const index = hookCursor++;
      if (!hookCells[index])
        hookCells[index] = {
          value: typeof initial === "function" ? initial() : initial,
        };
      const cell = hookCells[index];
      return [
        cell.value,
        (next) => {
          const value = typeof next === "function" ? next(cell.value) : next;
          if (!Object.is(value, cell.value)) {
            cell.value = value;
            if (hookCursor !== null) renderRequested = true;
          }
        },
      ];
    },
    useMemo(fn, deps) {
      if (hookCursor === null) return fn();
      const index = hookCursor++;
      if (!sameDeps(hookCells[index]?.deps, deps))
        hookCells[index] = { deps, value: fn() };
      return hookCells[index].value;
    },
    useCallback(fn, deps) {
      return react.useMemo(() => fn, deps);
    },
    useRef(value) {
      return react.useMemo(() => ({ current: value }), []);
    },
    useEffect(fn, deps) {
      if (hookCursor === null) return;
      const index = hookCursor++;
      if (!sameDeps(hookCells[index]?.deps, deps)) {
        const previous = hookCells[index];
        const cell = { deps };
        hookCells[index] = cell;
        effects.push(() => {
          previous?.cleanup?.();
          cell.cleanup = fn();
        });
      }
    },
  };
  const client = {
    rpc(name, args) {
      calls.push({ rpc: name, args });
      return {
        abortSignal() {
          return this;
        },
        async then(resolve) {
          if (queryWait) await queryWait;
          return resolve(rpcResult ?? { data: cloudRows, error: null });
        },
      };
    },
    auth: {
      getUser: async () => {
        if (authWait) await authWait;
        return { data: { user: userId ? { id: userId } : null } };
      },
    },
    from(table) {
      const entry = { table, filters: [], writes: [] };
      calls.push(entry);
      const query = {
        select(columns) {
          entry.columns = columns;
          return query;
        },
        eq(column, value) {
          entry.filters.push([column, value]);
          return query;
        },
        in() {
          return query;
        },
        order() {
          return query;
        },
        limit() {
          return query;
        },
        upsert(value) {
          entry.writes.push(value);
          return query;
        },
        update(value) {
          entry.writes.push(value);
          return query;
        },
        delete() {
          entry.deleted = true;
          return query;
        },
        abortSignal() {
          return query;
        },
        async then(resolve) {
          if (queryWait) await queryWait;
          return resolve(queryResult ?? { data: cloudRows, error: null });
        },
      };
      return query;
    },
  };
  const root = path.resolve(__dirname, "../../apps/web");
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const filename = path.join(root, relative);
    let source = stripTypeScriptTypes(fs.readFileSync(filename, "utf8"));
    const names = [
      ...source.matchAll(
        /export\s+(?:async\s+)?(?:function|const|class)\s+(\w+)/g,
      ),
    ].map((m) => m[1]);
    source = source
      .replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g,
        (_, bindings, specifier) => {
          const bindingsJs = bindings.replace(
            /\b(\w+)\s+as\s+(\w+)/g,
            "$1: $2",
          );
          return `const {${bindingsJs}} = require(${JSON.stringify(specifier)});`;
        },
      )
      .replace(/export\s+(?=(?:async\s+)?(?:function|const|class)\b)/g, "");
    const exports = {};
    const sandbox = {
      exports,
      require(specifier) {
        if (specifier === "react") return react;
        if (specifier === "@/lib/auth/context")
          return { useAuth: () => ({ credentialScope }) };
        if (specifier === "@/lib/analytics/events")
          return { analytics: new Proxy({}, { get: () => () => {} }) };
        if (specifier === "@/lib/supabase/client")
          return { createClient: () => client };
        const target = specifier.startsWith("@/")
          ? specifier.slice(2)
          : path.posix.join(path.posix.dirname(relative), specifier);
        return load(`${target}.ts`);
      },
      window: {
        localStorage: storage,
        addEventListener() {},
        removeEventListener() {},
      },
      localStorage: storage,
      setTimeout: (fn) => {
        timers.set(++timerId, fn);
        return timerId;
      },
      clearTimeout: (id) => timers.delete(id),
      crypto: globalThis.crypto,
      TextEncoder,
      AbortSignal,
      console,
      Date,
      Map,
      Set,
    };
    vm.runInNewContext(
      `${source}\nObject.assign(exports, {${names.join(",")}});`,
      sandbox,
      { filename },
    );
    modules.set(relative, exports);
    return exports;
  }
  let current;
  const credentialScope = {
    get: () => current,
    isCurrent: (token) => current === token && token.actor !== null,
  };
  const scope = (actor) => {
    const token = { actor, isCurrent: () => current === token };
    current = token;
    return token;
  };
  return {
    values,
    storage,
    calls,
    load,
    scope,
    // Deterministic hook-state shim, not a mounted React or Auth fixture.
    renderHook(fn) {
      let result;
      for (let attempt = 0; attempt < 10; attempt++) {
        renderRequested = false;
        hookCursor = 0;
        try {
          result = fn();
        } finally {
          hookCursor = null;
        }
        if (!renderRequested) return result;
      }
      throw new Error("Hook render did not settle");
    },
    flushEffects() {
      for (const effect of effects.splice(0)) effect();
    },
    flushTimers: () => {
      for (const fn of timers.values()) fn();
      timers.clear();
    },
    setUser: (value) => {
      userId = value;
    },
    setRows: (value) => {
      cloudRows = value;
    },
    setRpcResult: (value) => {
      rpcResult = value;
    },
    setQueryResult: (value) => {
      queryResult = value;
    },
    delayAuth: (value) => {
      authWait = value;
    },
    delayQuery: (value) => {
      queryWait = value;
    },
  };
}

const A = "user:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const B = "user:bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const message = [{ id: "m1", role: "user", content: "Private original world" }];

test("removal refusal is visible and retry preserves the original until intent is stored", async () => {
  const f = fixture();
  const scope = f.scope(A);
  const store = f.load("lib/chat/local-store.ts");
  store.saveChatSession("remove-a", message, {}, scope);
  const useHistory = f.load("hooks/use-chat-sessions.ts").useChatSessions;
  let history = f.renderHook(useHistory);
  const write = f.storage.setItem;
  f.storage.setItem = (key, value) => {
    if (key.startsWith("arcanea_chat_deletion:"))
      throw new Error("Storage refused");
    return write(key, value);
  };
  history.deleteSession("remove-a");
  history = f.renderHook(useHistory);
  assert.equal(history.deletionFailed, true);
  assert.equal(history.failedDeletionId, "remove-a");
  assert.equal(
    store.loadChatSession("remove-a", scope).messages[0].content,
    message[0].content,
  );
  assert.equal(f.calls.filter((call) => call.deleted).length, 0);
  f.storage.setItem = write;
  await history.retryDeletion();
  history = f.renderHook(useHistory);
  assert.equal(history.deletionFailed, false);
  assert.equal(history.failedDeletionId, null);
  assert.equal(store.loadChatSession("remove-a", scope), null);
  await new Promise(setImmediate);
  assert.equal(f.calls.filter((call) => call.deleted).length, 1);
});

test("old-account removal errors and retry callbacks retire across A to B to A", () => {
  const f = fixture();
  const scope = f.scope(A);
  const store = f.load("lib/chat/local-store.ts");
  store.saveChatSession("remove-a", message, {}, scope);
  const useHistory = f.load("hooks/use-chat-sessions.ts").useChatSessions;
  const write = f.storage.setItem;
  f.storage.setItem = () => {
    throw new Error("Storage refused");
  };
  f.renderHook(useHistory).deleteSession("remove-a");
  const failed = f.renderHook(useHistory);
  assert.equal(failed.deletionFailed, true);
  f.scope(B);
  assert.equal(f.renderHook(useHistory).deletionFailed, false);
  assert.equal(f.renderHook(useHistory).failedDeletionId, null);
  const returned = f.scope(A);
  assert.equal(f.renderHook(useHistory).deletionFailed, false);
  f.storage.setItem = write;
  failed.retryDeletion();
  assert.equal(store.loadChatSession("remove-a", returned).messages.length, 1);
  assert.equal(f.calls.length, 0);
});

test("pending account removals are hidden until mount and clear after acknowledged retry", async () => {
  const f = fixture();
  const scope = f.scope(A);
  const store = f.load("lib/chat/local-store.ts");
  store.saveChatSession("remove-a", message, {}, scope);
  store.deleteChatSession("remove-a", scope);
  f.setQueryResult({ data: null, error: { message: "Offline" } });
  const useHistory = f.load("hooks/use-chat-sessions.ts").useChatSessions;
  assert.equal(f.renderHook(useHistory).pendingDeletionCount, 0);
  f.flushEffects();
  await new Promise(setImmediate);
  let history = f.renderHook(useHistory);
  assert.equal(history.pendingDeletionCount, 1);
  assert.equal(await history.retryDeletion(), false);
  history = f.renderHook(useHistory);
  assert.equal(history.pendingDeletionCount, 1);
  assert.equal(history.isRetryingDeletion, false);
  f.setQueryResult({ data: null, error: null });
  const retry = history.retryDeletion();
  assert.equal(f.renderHook(useHistory).isRetryingDeletion, true);
  assert.equal(await retry, true);
  history = f.renderHook(useHistory);
  assert.equal(history.pendingDeletionCount, 0);
  assert.equal(history.isRetryingDeletion, false);
});

test("private messages, search, pin, active session and deletion stay with their account", () => {
  const f = fixture();
  const store = f.load("lib/chat/local-store.ts");
  const a = f.scope(A);
  store.saveChatSession("chat-a", message, { projectId: "project-a" }, a);
  store.setActiveChatSessionId("chat-a", a);
  const b = f.scope(B);
  assert.equal(store.listChatSessions(b).length, 0);
  assert.equal(store.searchSessions("Private", b).length, 0);
  assert.equal(store.loadChatSession("chat-a", b), null);
  assert.equal(store.getActiveChatSessionId(b), null);
  store.deleteChatSession("chat-a", b);
  store.togglePinSession("chat-a", b);
  const reopened = f.scope(A);
  assert.equal(
    store.loadChatSession("chat-a", reopened).messages[0].content,
    message[0].content,
  );
  assert.equal(store.getActiveChatSessionId(reopened), "chat-a");
  assert.equal(store.loadChatSession("chat-a", reopened).pinned, false);
});

test("private projects and active project stay with their account and guest work stays separate", () => {
  const f = fixture();
  const store = f.load("lib/chat/project-store.ts");
  const a = f.scope(A);
  const project = store.createChatProject({ title: "Private Atlas" }, a);
  const b = f.scope(B);
  assert.equal(store.listChatProjects(b).length, 0);
  assert.equal(store.getActiveChatProjectId(b), null);
  store.renameChatProject(project.id, "Wrong account", b);
  store.deleteChatProject(project.id, b);
  const guest = f.scope("guest");
  store.createChatProject({ title: "Guest draft" }, guest);
  const reopened = f.scope(A);
  assert.equal(
    store.loadChatProject(project.id, reopened).title,
    "Private Atlas",
  );
  assert.equal(store.listChatProjects(reopened).length, 1);
});

test("A → B → A refuses writes, reads and cloud work captured by the old A lifetime", async () => {
  const f = fixture();
  const sessions = f.load("lib/chat/local-store.ts");
  const projects = f.load("lib/chat/project-store.ts");
  const a = f.scope(A);
  f.scope(B);
  const nextA = f.scope(A);
  sessions.saveChatSession("stale", message, {}, a);
  sessions.setActiveChatSessionId("stale", a);
  projects.createChatProject({ title: "Stale project" }, a);
  assert.equal(sessions.listChatSessions(nextA).length, 0);
  assert.equal(sessions.getActiveChatSessionId(nextA), null);
  assert.equal(projects.listChatProjects(nextA).length, 0);
  await projects.syncProjectsFromCloud(a);
  assert.equal(f.calls.length, 0);
});

test("unattributed legacy history is preserved without automatically claiming it for an account", () => {
  const f = fixture();
  const store = f.load("lib/chat/local-store.ts");
  const raw = JSON.stringify([
    { id: "old", title: "Earlier private work", messages: message },
  ]);
  f.values.set("arcanea_chat_sessions", raw);
  f.values.set("arcanea_active_chat_session", "old");
  assert.equal(store.listChatSessions(f.scope(A)).length, 0);
  assert.equal(store.listChatSessions(f.scope("guest")).length, 0);
  assert.equal(f.values.get("arcanea_chat_sessions"), raw);
  assert.equal(f.values.get("arcanea_active_chat_session"), "old");
});

test("a late cloud project response is not merged after switching accounts", async () => {
  const f = fixture();
  const store = f.load("lib/chat/project-store.ts");
  let release;
  const wait = new Promise((resolve) => {
    release = resolve;
  });
  f.delayQuery(wait);
  f.setRows([
    {
      id: "cloud-a",
      title: "A cloud project",
      created_at: "2026-10-12",
      updated_at: "2026-10-12",
    },
  ]);
  const pending = store.syncProjectsFromCloud(f.scope(A));
  await Promise.resolve();
  await Promise.resolve();
  const b = f.scope(B);
  release();
  await pending;
  assert.equal(store.listChatProjects(b).length, 0);
  assert.equal(store.listChatProjects(f.scope(A)).length, 0);
});

test("cloud mutations refuse another authenticated actor before any query", async () => {
  const f = fixture();
  const projects = f.load("lib/chat/project-store.ts");
  const sessions = f.load("lib/chat/supabase-store.ts");
  const a = f.scope(A);
  f.setUser(B.slice(5));
  assert.equal(
    await projects.saveProjectToCloud(
      { id: "p", title: "A project", updatedAt: "2026-10-12" },
      a,
    ),
    false,
  );
  assert.equal(await projects.deleteProjectFromCloud("p", a), false);
  assert.equal(await projects.assignCloudSessionToProject("s", "p", a), false);
  assert.equal(
    await sessions.saveSessionToCloud(
      {
        id: "s",
        title: "A chat",
        messages: message,
        luminorId: null,
        modelId: null,
      },
      a,
    ),
    false,
  );
  assert.equal(await sessions.deleteCloudSession("s", a), false);
  assert.equal(await sessions.renameCloudSession("s", "Renamed", a), false);
  assert.equal(f.calls.length, 0);
});

test("auth resolution finishing after a scope change cannot dispatch private work", async () => {
  const f = fixture();
  const store = f.load("lib/chat/project-store.ts");
  let release;
  f.delayAuth(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  const pending = store.syncProjectsFromCloud(f.scope(A));
  f.scope(B);
  release();
  await pending;
  assert.equal(f.calls.length, 0);
});

test("metadata-only cloud hydration cannot erase a complete local conversation", () => {
  const f = fixture();
  const store = f.load("lib/chat/local-store.ts");
  const a = f.scope(A);
  store.saveChatSession("same", message, {}, a);
  store.mergeChatSessions(
    [
      {
        id: "same",
        title: "Cloud title",
        messages: [],
        createdAt: "2099-01-01",
        updatedAt: "2099-01-01",
      },
    ],
    a,
  );
  assert.equal(
    store.loadChatSession("same", a).messages[0].content,
    message[0].content,
  );
});

test("a metadata row without a messages array does not crash cloud recovery", () => {
  const f = fixture();
  const store = f.load("lib/chat/supabase-store.ts");
  const local = store.cloudSessionToLocalSession({
    id: "old",
    title: "Existing",
    created_at: "2026-10-12",
    updated_at: "2026-10-12",
  });
  assert.equal(local.messages.length, 0);
});

test("the production history hook preserves completed messages before its cloud debounce", () => {
  const f = fixture();
  const a = f.scope(A);
  const history = f.load("hooks/use-chat-sessions.ts").useChatSessions();
  history.saveMessages(message);
  const saved = f
    .load("lib/chat/local-store.ts")
    .loadChatSession(history.activeSessionId, a);
  assert.equal(saved.messages[0].content, message[0].content);
  assert.equal(f.calls.length, 0);
});

test("the production hook refuses a stale debounce and stale callbacks after account switching", () => {
  const f = fixture();
  const a = f.scope(A);
  const hook = f.load("hooks/use-chat-sessions.ts").useChatSessions();
  hook.saveMessages(message);
  f.scope(B);
  f.scope(A);
  hook.saveMessages([
    { id: "late", role: "user", content: "Retired callback" },
  ]);
  assert.equal(hook.createProject("Retired project"), null);
  f.flushTimers();
  assert.equal(f.calls.length, 0);
  const current = f.scope(A);
  const saved = f
    .load("lib/chat/local-store.ts")
    .loadChatSession(hook.activeSessionId, current);
  assert.equal(saved.messages.length, 1);
  assert.equal(saved.messages[0].content, message[0].content);
  assert.equal(
    f.load("lib/chat/project-store.ts").listChatProjects(current).length,
    0,
  );
});

test("cloud rename and delete pin their filters to the originating actor", async () => {
  const f = fixture();
  const a = f.scope(A);
  const store = f.load("lib/chat/supabase-store.ts");
  const sessionId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  f.load("lib/chat/local-store.ts").saveChatSession(
    sessionId,
    message,
    undefined,
    a,
  );
  f.setRpcResult({ data: { revision: "a".repeat(64) }, error: null });
  await store.renameCloudSession(sessionId, "Title", a);
  await store.deleteCloudSession(sessionId, a);
  assert.equal(f.calls[0].rpc, "save_chat_snapshot");
  assert.equal(f.calls[0].args.p_expected_user_id, A.slice(5));
  assert.equal(f.calls[0].args.p_session_id, sessionId);
  for (const call of f.calls.slice(1)) {
    assert.ok(
      call.filters.some(
        ([column, value]) => column === "user_id" && value === A.slice(5),
      ),
    );
    assert.ok(
      call.filters.some(
        ([column, value]) => column === "id" && value === sessionId,
      ),
    );
  }
  assert.equal(f.calls.length, 2);
});

test("the prior persistence hook delegates to the same account-bound history", () => {
  const f = fixture();
  const a = f.scope(A);
  const history = f.load("hooks/use-chat-persistence.ts").useChatPersistence();
  history.saveMessages(message);
  assert.equal(
    f
      .load("lib/chat/local-store.ts")
      .loadChatSession(history.activeSessionId, a).messages[0].content,
    message[0].content,
  );
  const b = f.scope(B);
  assert.equal(f.load("lib/chat/local-store.ts").listChatSessions(b).length, 0);
});

test("the actual credential-scope factory rejects pending auth and A to B to A lifetimes", () => {
  const f = fixture();
  const credentials = f
    .load("lib/ai/provider-preferences.ts")
    .createCredentialScope();
  const factory = f.load("lib/chat/storage-scope.ts");
  const store = f.load("lib/chat/local-store.ts");
  const pending = factory.createChatStorageScope(credentials);
  store.saveChatSession("pending", message, {}, pending);
  assert.equal(store.listChatSessions(pending).length, 0);
  credentials.set(A);
  const a = factory.createChatStorageScope(credentials);
  store.saveChatSession("original", message, {}, a);
  credentials.set(B);
  assert.equal(
    store.listChatSessions(factory.createChatStorageScope(credentials)).length,
    0,
  );
  credentials.set(A);
  store.saveChatSession("retired", message, {}, a);
  const current = factory.createChatStorageScope(credentials);
  assert.equal(store.listChatSessions(current).length, 1);
  assert.equal(
    store.loadChatSession("original", current).messages[0].content,
    message[0].content,
  );
  assert.equal(store.loadChatSession("retired", current), null);
});

test("the actual page entry stays consistent before mounting and waits for auth", () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, "../../apps/web/app/chat/page.tsx"),
    "utf8",
  );
  const start = source.indexOf("export default function ChatPage()");
  const end = source.indexOf("function ChatPageContent()", start);
  assert.ok(start >= 0 && end > start);
  // Evaluate the actual entry decision with inert element records. This covers
  // auth admission and React keys, not mounting, effects or rendered pixels.
  const entry = source
    .slice(start, end)
    .replace("export default ", "")
    .replace(
      /<(ChatLoading|ChatPageContent)([^>]*?)\/>/g,
      (_, name, attributes) => {
        const key = attributes.match(/key=\{([\s\S]+)\}/);
        return `element(${JSON.stringify(name)}, ${key ? key[1] : "undefined"})`;
      },
    );
  let token = { actor: null, revision: 0 };
  let mounted = false;
  const component = new Function(
    "useAuth",
    "element",
    "useState",
    "useEffect",
    `${entry}\nreturn ChatPage;`,
  )(
    () => ({ credentialScope: { get: () => token } }),
    (name, key) => ({ name, key }),
    () => [mounted, () => {}],
    () => {},
  );
  assert.equal(component().name, "ChatLoading");
  token = { actor: A, revision: 1 };
  assert.equal(
    component().name,
    "ChatLoading",
    "Parent auth may resolve before this subtree hydrates",
  );
  mounted = true;
  token = { actor: null, revision: 0 };
  assert.equal(component().name, "ChatLoading");
  token = { actor: A, revision: 1 };
  const first = component();
  assert.equal(first.name, "ChatPageContent");
  token = { actor: B, revision: 2 };
  assert.notEqual(component().key, first.key);
  token = { actor: A, revision: 3 };
  assert.notEqual(component().key, first.key);
});
