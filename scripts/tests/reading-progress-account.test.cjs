const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const ts = require("typescript");

const sourcePath = path.resolve(
  __dirname,
  "../../apps/web/hooks/use-reading-progress.ts",
);
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

// Controlled hook lifecycle and transport, not a React renderer, Auth or DB.
// The companion browser check mounts these source files in real React.
function fixture(t) {
  const slots = [];
  const requests = [];
  const timers = new Map();
  let cursor = 0,
    dirty = false,
    owner = null,
    result,
    effects = [];
  let mounted = true,
    afterUnmountUpdates = 0,
    nextTimer = 0,
    replay = false;
  const same = (a, b) =>
    a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const react = {
    useState(initial) {
      const index = cursor++;
      slots[index] ??= {
        value: typeof initial === "function" ? initial() : initial,
      };
      return [
        slots[index].value,
        (value) => {
          if (!mounted) {
            afterUnmountUpdates++;
            return;
          }
          const next =
            typeof value === "function" ? value(slots[index].value) : value;
          if (!Object.is(next, slots[index].value)) {
            slots[index].value = next;
            dirty = true;
          }
        },
      ];
    },
    useRef(initial) {
      const index = cursor++;
      slots[index] ??= { value: { current: initial } };
      return slots[index].value;
    },
    useEffect(fn, deps) {
      const index = cursor++;
      if (replay || !same(slots[index]?.deps, deps))
        effects.push(() => {
          slots[index]?.cleanup?.();
          slots[index] = { deps, cleanup: fn() };
        });
    },
    useMemo(fn, deps) {
      const index = cursor++;
      if (!same(slots[index]?.deps, deps)) slots[index] = { deps, value: fn() };
      return slots[index].value;
    },
  };
  react.useCallback = (fn, deps) => react.useMemo(() => fn, deps);
  function query(kind, body, options) {
    let resolve, reject;
    const promise = new Promise((yes, no) => {
      resolve = yes;
      reject = no;
    });
    const request = {
      kind,
      body,
      options,
      resolve,
      reject,
      filters: {},
      signal: null,
      single: false,
    };
    requests.push(request);
    const chain = {
      select(columns) {
        request.columns = columns;
        return chain;
      },
      eq(key, value) {
        request.filters[key] = value;
        return chain;
      },
      single() {
        request.single = true;
        return chain;
      },
      abortSignal(signal) {
        request.signal = signal;
        return chain;
      },
      // Deliberately ignore abort to exercise stale-response protection.
      then(...args) {
        return promise.then(...args);
      },
    };
    return chain;
  }
  const client = {
    from(table) {
      assert.equal(table, "reading_progress");
      return {
        select: () => query("load"),
        upsert: (body, options) => query("save", body, options),
      };
    },
  };
  const moduleObject = { exports: {} };
  vm.runInNewContext(
    compiled,
    {
      module: moduleObject,
      exports: moduleObject.exports,
      AbortController,
      Date,
      setTimeout(fn, delay) {
        const id = ++nextTimer;
        timers.set(id, { fn, delay });
        return id;
      },
      clearTimeout(id) {
        timers.delete(id);
      },
      require(name) {
        if (name === "react") return react;
        if (name === "@/lib/supabase/client")
          return { createClient: () => client };
        throw Error("Unexpected hook import: " + name);
      },
    },
    { filename: sourcePath },
  );
  function render(nextOwner, commit = true) {
    owner = nextOwner;
    cursor = 0;
    effects = [];
    dirty = false;
    result = moduleObject.exports.useReadingProgress(owner);
    if (commit) commitEffects();
    return result;
  }
  function commitEffects() {
    for (const fn of effects) fn();
    effects = [];
    replay = false;
  }
  async function flush() {
    for (let i = 0; i < 24; i++) {
      await Promise.resolve();
      if (mounted && dirty) render(owner);
    }
    return result;
  }
  function dispose() {
    for (const slot of slots) slot?.cleanup?.();
    mounted = false;
  }
  t.after(async () => {
    dispose();
    await flush();
    assert.equal(timers.size, 0);
  });
  return {
    requests,
    render,
    flush,
    commitEffects,
    dispose,
    get result() {
      return result;
    },
    get afterUnmountUpdates() {
      return afterUnmountUpdates;
    },
    strictReplay() {
      replay = true;
      render(owner);
    },
    expire() {
      const active = [...timers.values()];
      assert.ok(active.length > 0);
      for (const timer of active) {
        assert.equal(timer.delay, 10_000);
        timer.fn();
      }
    },
    latest(kind) {
      return requests.filter((r) => r.kind === kind).at(-1);
    },
    async ready(user = "synthetic-a", rows = []) {
      render(user);
      await flush();
      this.latest("load").resolve({ data: rows, error: null });
      await flush();
      assert.equal(result.isLoading, false);
      assert.equal(result.loadError, null);
    },
    async save(slug = "synthetic-text", collection = "synthetic-collection") {
      const promise = result.markComplete(slug, collection);
      await flush();
      return { promise, request: this.latest("save") };
    },
  };
}
const row = (owner, slug, changes = {}) => ({
  user_id: owner,
  text_slug: slug,
  collection_slug: "synthetic-collection",
  completed_at: "2026-10-12T00:00:00.000Z",
  progress_percent: 100,
  ...changes,
});

test("out-of-order account loads retain only current account progress", async (t) => {
  const f = fixture(t);
  f.render("synthetic-a");
  await f.flush();
  const a = f.latest("load");
  f.render("synthetic-b");
  await f.flush();
  const b = f.latest("load");
  assert.equal(a.signal.aborted, true);
  b.resolve({ data: [row("synthetic-b", "b-text")], error: null });
  await f.flush();
  a.resolve({ data: [row("synthetic-a", "a-text")], error: null });
  await f.flush();
  assert.equal(f.result.isComplete("a-text"), false);
  assert.equal(f.result.isComplete("b-text"), true);
  assert.equal(b.filters.user_id, "synthetic-b");
});

test("account data is hidden on the first render before cleanup, including sign-out", async (t) => {
  const f = fixture(t);
  await f.ready("synthetic-a", [row("synthetic-a", "a-text")]);
  assert.equal(f.result.isComplete("a-text"), true);
  const first = f.render("synthetic-b", false);
  assert.equal(first.isComplete("a-text"), false);
  assert.equal(first.isLoading, true);
  f.commitEffects();
  await f.flush();
  const out = f.render(null, false);
  assert.equal(Object.keys(out.progress).length, 0);
  assert.equal(out.isLoading, false);
  f.commitEffects();
  await f.flush();
  assert.equal(
    await f.result.markComplete("text", "collection"),
    "unavailable",
  );
});

test("save stays pending until an exact acknowledgement and deduplicates repeat clicks", async (t) => {
  const f = fixture(t);
  await f.ready();
  const { promise, request } = await f.save();
  const duplicate = f.result.markComplete(
    "synthetic-text",
    "synthetic-collection",
  );
  assert.equal(
    await f.result.markComplete("synthetic-text", "other-collection"),
    "unavailable",
  );
  await f.flush();
  assert.equal(promise, duplicate);
  assert.equal(f.requests.filter((r) => r.kind === "save").length, 1);
  assert.equal(f.result.isSaving, true);
  assert.equal(f.result.isComplete("synthetic-text"), false);
  assert.equal(request.options.onConflict, "user_id,text_slug");
  assert.equal(request.single, true);
  assert.match(request.columns, /user_id/);
  request.resolve({ data: { ...request.body }, error: null });
  assert.equal(await promise, "saved");
  await f.flush();
  assert.equal(f.result.isSaving, false);
  assert.equal(f.result.isComplete("synthetic-text"), true);
  assert.equal(f.result.saveError, null);
});

for (const [name, response] of [
  ["null data without error", (r) => ({ data: null, error: null })],
  [
    "wrong owner",
    (r) => ({ data: { ...r.body, user_id: "synthetic-b" }, error: null }),
  ],
  [
    "wrong text",
    (r) => ({ data: { ...r.body, text_slug: "other" }, error: null }),
  ],
  [
    "wrong collection",
    (r) => ({ data: { ...r.body, collection_slug: "other" }, error: null }),
  ],
  [
    "incomplete percentage",
    (r) => ({ data: { ...r.body, progress_percent: 50 }, error: null }),
  ],
  [
    "missing completion",
    (r) => ({ data: { ...r.body, completed_at: null }, error: null }),
  ],
  [
    "wrong completion time",
    (r) => ({
      data: { ...r.body, completed_at: "2000-01-01T00:00:00Z" },
      error: null,
    }),
  ],
  [
    "invalid completion time",
    (r) => ({ data: { ...r.body, completed_at: "invalid" }, error: null }),
  ],
  [
    "denied write",
    (r) => ({ data: { ...r.body }, error: { message: "denied" } }),
  ],
]) {
  test(
    "unconfirmed save: " + name + " preserves earlier progress and can retry",
    async (t) => {
      const f = fixture(t);
      await f.ready("synthetic-a", [row("synthetic-a", "earlier")]);
      const first = await f.save();
      first.request.resolve(response(first.request));
      assert.equal(await first.promise, "unconfirmed");
      await f.flush();
      assert.equal(f.result.isSaving, false);
      assert.equal(f.result.isComplete("synthetic-text"), false);
      assert.equal(f.result.isComplete("earlier"), true);
      assert.match(f.result.saveError, /confirm/);
      const second = await f.save();
      second.request.resolve({ data: { ...second.request.body }, error: null });
      assert.equal(await second.promise, "saved");
      await f.flush();
      assert.equal(f.result.isComplete("synthetic-text"), true);
      assert.equal(f.result.saveError, null);
    },
  );
}

test("network rejection and a stalled save release pending state without confirming completion", async (t) => {
  const f = fixture(t);
  await f.ready();
  const network = await f.save();
  network.request.reject(new Error("network"));
  assert.equal(await network.promise, "unconfirmed");
  await f.flush();
  const stalled = await f.save();
  f.expire();
  assert.equal(await stalled.promise, "unconfirmed");
  await f.flush();
  assert.equal(stalled.request.signal.aborted, true);
  assert.equal(f.result.isSaving, false);
  assert.equal(f.result.isComplete("synthetic-text"), false);
  stalled.request.resolve({ data: { ...stalled.request.body }, error: null });
  await f.flush();
  assert.equal(f.result.isComplete("synthetic-text"), false);
});

test("a save from a retired session cannot update a new account or a later login of the same account", async (t) => {
  const f = fixture(t);
  await f.ready();
  const old = await f.save();
  f.render(null);
  await f.flush();
  await f.ready("synthetic-a");
  old.request.resolve({ data: { ...old.request.body }, error: null });
  assert.equal(await old.promise, "cancelled");
  await f.flush();
  assert.equal(f.result.isComplete("synthetic-text"), false);
  assert.equal(f.result.saveError, null);
  const a = await f.save();
  await f.ready("synthetic-b", [row("synthetic-b", "b-text")]);
  a.request.resolve({ data: { ...a.request.body }, error: null });
  assert.equal(await a.promise, "cancelled");
  await f.flush();
  assert.equal(f.result.isComplete("synthetic-text"), false);
  assert.equal(f.result.isComplete("b-text"), true);
});

for (const [name, data] of [
  ["null data", null],
  ["wrong owner", [row("synthetic-b", "x")]],
  ["duplicate key", [row("synthetic-a", "x"), row("synthetic-a", "x")]],
  ["invalid row", [row("synthetic-a", "x", { progress_percent: -1 })]],
]) {
  test(
    "load failure: " + name + " exposes retry and keeps writes unavailable",
    async (t) => {
      const f = fixture(t);
      f.render("synthetic-a");
      await f.flush();
      f.latest("load").resolve({ data, error: null });
      await f.flush();
      assert.equal(f.result.isLoading, false);
      assert.match(f.result.loadError, /load/);
      assert.equal(
        await f.result.markComplete("text", "collection"),
        "unavailable",
      );
      f.result.retry();
      await f.flush();
      f.latest("load").resolve({
        data: [row("synthetic-a", "restored")],
        error: null,
      });
      await f.flush();
      assert.equal(f.result.loadError, null);
      assert.equal(f.result.isComplete("restored"), true);
    },
  );
}

test("load rejection and timeout show retry; late load cannot replace retry result", async (t) => {
  const f = fixture(t);
  f.render("synthetic-a");
  await f.flush();
  f.latest("load").reject(new Error("network"));
  await f.flush();
  assert.match(f.result.loadError, /load/);
  f.result.retry();
  await f.flush();
  const stalled = f.latest("load");
  f.expire();
  await f.flush();
  assert.equal(f.result.isLoading, false);
  assert.match(f.result.loadError, /load/);
  f.result.retry();
  await f.flush();
  f.latest("load").resolve({ data: [], error: null });
  await f.flush();
  stalled.resolve({ data: [row("synthetic-a", "late")], error: null });
  await f.flush();
  assert.equal(f.result.isComplete("late"), false);
  assert.equal(f.result.loadError, null);
});

test("strict-mode-style cleanup and unmount abort requests without updating disposed state", async (t) => {
  const f = fixture(t);
  f.render("synthetic-a");
  await f.flush();
  const old = f.latest("load");
  f.strictReplay();
  await f.flush();
  const fresh = f.latest("load");
  assert.notEqual(old, fresh);
  assert.equal(old.signal.aborted, true);
  fresh.resolve({ data: [], error: null });
  await f.flush();
  const save = await f.save();
  f.dispose();
  save.request.resolve({ data: { ...save.request.body }, error: null });
  old.resolve({ data: [row("synthetic-a", "stale")], error: null });
  assert.equal(await save.promise, "cancelled");
  await f.flush();
  assert.equal(f.afterUnmountUpdates, 0);
  assert.equal(save.request.signal.aborted, true);
});

test("prototype-named slugs are ordinary keys; collection percentages stay bounded", async (t) => {
  const f = fixture(t);
  await f.ready("synthetic-a", [
    row("synthetic-a", "__proto__"),
    row("synthetic-a", "partial", { completed_at: null, progress_percent: 20 }),
  ]);
  assert.equal(f.result.isComplete("__proto__"), true);
  assert.equal(f.result.isComplete("constructor"), false);
  assert.equal(f.result.isComplete("partial"), false);
  const progress = f.result.getCollectionProgress("synthetic-collection", 1);
  assert.equal(progress.completed, 1);
  assert.equal(progress.percent, 100);
  assert.equal(
    f.result.getCollectionProgress("synthetic-collection", 0).percent,
    0,
  );
});

console.log(
  JSON.stringify({
    sourceSha256: crypto.createHash("sha256").update(source).digest("hex"),
    fixture: "controlled hook lifecycle/transport; no real Auth/DB/browser",
    privateProviderCalls: 0,
  }),
);

test("retired load-generation callbacks stay unavailable after a successful retry", async (t) => {
  const f = fixture(t);
  await f.ready();
  const retired = f.result.markComplete;
  f.result.retry();
  await f.flush();
  f.latest("load").resolve({ data: [], error: null });
  await f.flush();
  assert.equal(
    await retired("synthetic-text", "synthetic-collection"),
    "unavailable",
  );
  assert.equal(f.requests.filter((r) => r.kind === "save").length, 0);
  const current = await f.save();
  current.request.resolve({ data: { ...current.request.body }, error: null });
  assert.equal(await current.promise, "saved");
});
