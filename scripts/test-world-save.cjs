const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const wr = Module.createRequire(path.resolve("apps/web/package.json"));
const ts = wr("typescript");
const { NextRequest } = wr("next/server");
const input = {
  draft_id: "12345678-1234-4234-a234-123456789abc",
  world: {
    name: "Harbor",
    slug: "harbor",
    characters: [{ name: "Mara" }],
    locations: [{ name: "Seawall" }],
    first_event: { title: "Bargain", description: "A witnessed debt." },
  },
};
function setup({
  user = { id: "owner" },
  authHang = false,
  writeHang = false,
} = {}) {
  const cache = new Map(),
    tables = [],
    signals = [],
    deadlines = [];
  let authCalls = 0;
  let releaseWrite;
  const db = {
    auth: {
      getUser: () => {
        authCalls++;
        return authHang
          ? new Promise(() => {})
          : Promise.resolve({ data: { user }, error: null });
      },
    },
    from: (table) => {
      const state = { table, signal: null };
      const chain = new Proxy(
        {},
        {
          get: (_target, key) => {
            if (key === "abortSignal")
              return (signal) => {
                state.signal = signal;
                signals.push(signal);
                return chain;
              };
            if (key === "then")
              return (resolve, reject) => {
                tables.push(table);
                if (writeHang)
                  return new Promise((resolve) => {
                    releaseWrite = () =>
                      resolve({
                        data: { id: "world-id", slug: "harbor-id" },
                        error: null,
                      });
                  }).then(resolve, reject);
                return Promise.resolve({
                  data: { id: "world-id", slug: "harbor-id" },
                  error: null,
                }).then(resolve, reject);
              };
            return () => chain;
          },
        },
      );
      return chain;
    },
  };
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const m = new Module(file);
    cache.set(file, m);
    m.filename = file;
    m.paths = Module._nodeModulePaths(path.dirname(file));
    m.require = (id) => {
      if (id === "@/lib/supabase/server")
        return { createClient: async () => db };
      if (id === "@/lib/async-deadline") {
        const actual = load("apps/web/lib/async-deadline.ts");
        return {
          withAbortDeadline: (label, ms, work) => {
            deadlines.push(ms);
            return actual.withAbortDeadline(label, Math.min(ms, 20), work);
          },
        };
      }
      if (id.startsWith("@/")) return load("apps/web/" + id.slice(2) + ".ts");
      if (id.startsWith("."))
        return load(path.resolve(path.dirname(file), id + ".ts"));
      return wr(id);
    };
    m._compile(
      ts.transpileModule(fs.readFileSync(file, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      }).outputText,
      file,
    );
    return m.exports;
  }
  return {
    route: load("apps/web/app/api/worlds/save/route.ts"),
    tables,
    signals,
    deadlines,
    authCalls: () => authCalls,
    releaseWrite: () => releaseWrite?.(),
  };
}
function request(body = JSON.stringify(input), headers = {}, signal) {
  return new NextRequest("https://arcanea.ai/api/worlds/save", {
    method: "POST",
    headers: {
      origin: "https://arcanea.ai",
      "content-type": "application/json",
      ...headers,
    },
    body,
    signal,
    ...(typeof body !== "string" ? { duplex: "half" } : {}),
  });
}
async function timely(promise) {
  return Promise.race([
    promise,
    new Promise((resolve) =>
      setTimeout(() => resolve({ status: "unbounded" }), 100),
    ),
  ]);
}
test("foreign-origin save refuses before authentication or writes", async () => {
  const s = setup();
  const r = await s.route.POST(
    request(undefined, { origin: "https://other.invalid" }),
  );
  assert.equal(r.status, 403);
  assert.equal(s.authCalls(), 0);
  assert.equal(s.tables.length, 0);
});
test("save limits actual UTF-8 bytes despite a small declared length", async () => {
  const s = setup();
  const r = await s.route.POST(
    request(JSON.stringify({ ...input, extra: "🌊".repeat(40000) }), {
      "content-length": "100",
    }),
  );
  assert.equal(r.status, 413);
  assert.equal(s.tables.length, 0);
});
test("oversized save streams stop reading and cancel before database writes", async () => {
  let chunks = 0,
    cancelled = false;
  const stream = new ReadableStream({
    pull(controller) {
      if (chunks === 4) {
        controller.close();
        return;
      }
      chunks++;
      controller.enqueue(new Uint8Array(80000));
    },
    cancel() {
      cancelled = true;
    },
  });
  const s = setup();
  const r = await s.route.POST(request(stream));
  assert.equal(r.status, 413);
  assert.ok(cancelled);
  assert.ok(chunks <= 3);
  assert.equal(s.tables.length, 0);
});
test("stalled authentication returns a safe deadline failure with no writes", async () => {
  const s = setup({ authHang: true });
  const r = await timely(s.route.POST(request()));
  assert.equal(r.status, 503);
  assert.deepEqual(s.deadlines, [4500]);
  assert.equal(s.tables.length, 0);
});
test("a stalled save aborts its transport and preserves the retry contract", async () => {
  const s = setup({ writeHang: true });
  const r = await timely(s.route.POST(request()));
  assert.equal(r.status, 503);
  assert.equal(s.signals.length, 1);
  assert.ok(s.signals[0].aborted);
  assert.deepEqual(s.deadlines, [4500, 18000]);
  assert.match((await r.json()).error, /full draft is still here/);
  s.releaseWrite();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(
    s.tables.length,
    1,
    "a late acknowledgement cannot start child writes",
  );
});
test("anonymous and already-cancelled saves never write", async () => {
  const s = setup({ user: null });
  const r = await s.route.POST(request());
  assert.equal(r.status, 401);
  assert.equal(s.tables.length, 0);
  const c = new AbortController();
  c.abort();
  const other = setup();
  assert.equal(
    (await other.route.POST(request(undefined, {}, c.signal))).status,
    408,
  );
  assert.equal(other.authCalls(), 0);
});
test("validated save attaches the same abort signal to every query", async () => {
  const s = setup();
  const r = await s.route.POST(request());
  assert.equal(r.status, 200);
  assert.equal((await r.json()).saved, true);
  assert.equal(s.tables.length, 6);
  assert.equal(s.signals.length, 6);
  assert.ok(s.signals.every((signal) => signal === s.signals[0]));
  assert.match(r.headers.get("cache-control"), /private.*no-store/);
});
test("a cancelled body read releases the stream without writes", async () => {
  const c = new AbortController();
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("{"));
    },
    cancel() {
      cancelled = true;
    },
  });
  const s = setup();
  const pending = s.route.POST(request(stream, {}, c.signal));
  setTimeout(() => c.abort(), 10);
  assert.equal((await timely(pending)).status, 408);
  assert.ok(cancelled);
  assert.equal(s.tables.length, 0);
});
test("a stalled body is cancelled at the actual five-second deadline", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("{"));
    },
    cancel() {
      cancelled = true;
    },
  });
  const s = setup();
  const started = Date.now();
  const r = await s.route.POST(request(stream));
  assert.equal(r.status, 408);
  assert.ok(cancelled);
  assert.ok(Date.now() - started >= 4900 && Date.now() - started < 6500);
  assert.equal(s.tables.length, 0);
});
