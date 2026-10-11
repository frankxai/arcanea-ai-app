const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const { execFileSync } = require("node:child_process");
const { webcrypto, randomUUID } = require("node:crypto");
const ts = require("typescript");

const repo = path.resolve(__dirname, "../..");
const sourceRef = process.env.READING_SCENE_ACCOUNT_SOURCE_REF;
if (sourceRef && !/^[0-9a-f]{40}$/.test(sourceRef))
  throw new Error("Reproduction requires an immutable source SHA.");
function source(file) {
  return sourceRef
    ? execFileSync("git", ["show", `${sourceRef}:${file}`], {
        cwd: repo,
        encoding: "utf8",
      })
    : fs.readFileSync(path.join(repo, file), "utf8");
}
function load(file, imports = {}, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(source(file), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unexpected import ${name}`);
      return imports[name];
    },
    URL,
    TextEncoder,
    crypto: { subtle: webcrypto.subtle, randomUUID },
    ...globals,
  });
  return module.exports;
}

function workspace({ completed = false, pending = false, fresh = false } = {}) {
  // Execute the whole application component and its actual credential/recovery
  // modules. React scheduling, browser storage and HTTP replies are synthetic.
  const preferences = load("apps/web/lib/ai/provider-preferences.ts");
  const brief = load("apps/web/lib/reading-scene/brief.ts");
  const session = load("apps/web/lib/reading-scene/session.ts", {
    "./brief": brief,
  });
  const credentialScope = preferences.createCredentialScope();
  credentialScope.set("user:actor-a");
  const requestKey = randomUUID();
  const scene = {
    schema: "arcanea.reading-scene.v1",
    owner: "actor-a",
    source: {
      bookId: "book1",
      bookTitle: "Source book",
      chapterTitle: "Source chapter",
      path: "/books/book1/chapter-one",
      chapterHash: "a".repeat(64),
      passage: "The river carried a silver bowl.",
    },
    brief: "Illustrate the silver bowl in the river.",
    model: "provider/model",
    requestKey: fresh ? null : requestKey,
    result: completed
      ? {
          generationId: `gen_${requestKey}`,
          status: "completed",
          provider: "openrouter",
          model: "provider/model",
          images: [{ data: "aGVsbG8=", mimeType: "image/png" }],
        }
      : null,
    creationId: null,
  };
  const slots = new Map();
  const writes = [];
  const reads = [];
  const requests = [];
  const updates = [];
  const effects = [];
  let stateIndex = 0;
  let release;
  const response = new Promise((resolve) => {
    release = resolve;
  });
  const initial = [scene, false, false, "", "", null, "configured"];
  const selectionNode = {};
  const selectionContainer = { contains: (node) => node === selectionNode };
  const component = load(
    "apps/web/components/saga/scene-visualizer.tsx",
    {
      react: {
        useState(value) {
          const index = stateIndex++;
          return [
            initial[index] ?? value,
            (next) => updates.push({ index, next }),
          ];
        },
        useRef: (value) => ({ current: value }),
        useCallback: (fn) => fn,
        useLayoutEffect() {},
        useEffect: (fn) => effects.push(fn),
      },
      "react/jsx-runtime": {
        jsx: (type, props) => ({ type, props }),
      },
      "@/lib/auth/context": {
        useAuth: () => ({
          user: { id: "actor-a" },
          isLoading: false,
          credentialScope,
        }),
      },
      "@/lib/ai/provider-preferences": preferences,
      "@/lib/imagine/generate": {
        OPENROUTER_IMAGE_MODELS: [{ id: "provider/model", tier: "fast" }],
      },
      "@/lib/reading-scene/brief": brief,
      "@/lib/reading-scene/session": session,
      "./scene-workspace-view": { SceneWorkspaceView: () => {} },
    },
    {
      AbortController,
      AbortSignal,
      setTimeout,
      clearTimeout,
      location: { pathname: scene.source.path },
      window: {
        getSelection: () => ({
          isCollapsed: false,
          anchorNode: selectionNode,
          focusNode: selectionNode,
          toString: () => scene.source.passage,
        }),
      },
      document: { addEventListener() {}, removeEventListener() {} },
      sessionStorage: {
        getItem: (key) => {
          reads.push(key);
          return slots.get(key) ?? null;
        },
        setItem: (key, value) => {
          writes.push({ key, value });
          slots.set(key, value);
        },
        removeItem: (key) => slots.delete(key),
      },
      fetch: async (url, options) => {
        requests.push({ url, options });
        return pending
          ? response
          : {
              ok: true,
              json: async () => ({
                creationId: requestKey,
                visibility: "private",
              }),
            };
      },
    },
  );
  const props = {
    ...scene.source,
    sourceText: scene.source.passage,
    readingRef: { current: selectionContainer },
  };
  const element = component.SceneVisualizer(props);
  const view = element.type(element.props);
  return {
    view: view.props,
    credentialScope,
    scene,
    writes,
    reads,
    requests,
    updates,
    effects,
    release,
  };
}

test("old connected scene actions cannot send or persist after the SDK changes actor before React cleanup", async () => {
  for (const action of ["generate", "save", "retain"]) {
    const w = workspace({ completed: action === "save" });
    w.credentialScope.set("user:actor-b");
    if (action === "retain") w.view.retain(w.scene);
    else await w.view[action]();
    assert.equal(
      w.requests.length,
      0,
      `${action} must not use B's cookie with A's scene`,
    );
    assert.equal(
      w.writes.length,
      0,
      `${action} must not persist A's stale scene`,
    );
    assert.equal(w.updates.length, 0, `${action} must not reveal stale state`);
  }
});

test("late generation and save replies are rejected after A to B to A without passive cleanup", async () => {
  for (const action of ["generate", "save"]) {
    const w = workspace({ completed: action === "save", pending: true });
    const operation = w.view[action]();
    assert.equal(w.requests.length, 1, "Current actor can start its operation");
    const writesBeforeSwitch = w.writes.length;
    const updatesBeforeSwitch = w.updates.length;
    w.credentialScope.set("user:actor-b");
    w.credentialScope.set("user:actor-a");
    w.release({
      ok: true,
      json: async () =>
        action === "generate"
          ? {
              generationId: `gen_${w.scene.requestKey}`,
              status: "completed",
              provider: "openrouter",
              model: w.scene.model,
              images: [{ data: "aGVsbG8=", mimeType: "image/png" }],
            }
          : { creationId: w.scene.requestKey, visibility: "private" },
    });
    await operation;
    assert.equal(
      w.writes.length,
      writesBeforeSwitch,
      "Late reply cannot write recovery state",
    );
    assert.equal(
      w.updates.length,
      updatesBeforeSwitch,
      "Late reply cannot update the current UI",
    );
  }
});

test("queued recovery load cannot read or request A's state after the SDK changes actor", async () => {
  const w = workspace();
  w.effects[0]();
  w.credentialScope.set("user:actor-b");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(w.requests.length, 0);
  assert.equal(w.reads.length, 0);
  assert.equal(w.writes.length, 0);
  assert.equal(w.updates.length, 0);
});

test("a current account can retain and save its scene", async () => {
  const w = workspace({ completed: true });
  assert.equal(w.view.retain(w.scene), true);
  await w.view.save();
  assert.equal(w.requests.length, 1);
  assert.equal(w.requests[0].url, "/api/reading-scenes");
  assert.equal(
    JSON.parse(w.requests[0].options.body).expectedActor,
    w.scene.owner,
  );
  assert.equal(w.writes.length, 2);
});

test("generation cannot retain an unexpected second image", async () => {
  const w = workspace({ pending: true });
  const operation = w.view.generate();
  w.release({
    ok: true,
    json: async () => ({
      generationId: `gen_${w.scene.requestKey}`,
      status: "completed",
      provider: "openrouter",
      model: w.scene.model,
      images: [
        { data: "aGVsbG8=", mimeType: "image/png" },
        { data: "aGVsbG8=", mimeType: "image/png" },
      ],
    }),
  });
  await operation;
  assert.equal(w.requests.length, 1);
  assert.equal(w.writes.length, 1, "Only the pending request is retained");
  assert.equal(JSON.parse(w.writes[0].value).result, null);
});

test("a newly admitted workspace captures the still-selected chapter passage without another selection event", () => {
  const w = workspace();
  w.effects[1]();
  assert.ok(
    w.updates.some(
      ({ index, next }) => index === 4 && next === w.scene.source.passage,
    ),
  );
});

test("malformed generated model/provider metadata retains only the recoverable pending request", async () => {
  for (const metadata of [
    { provider: "openrouter" },
    { model: "provider/model" },
    { provider: "foreign", model: "provider/model" },
    { provider: "openrouter", model: "" },
  ]) {
    const w = workspace({ pending: true });
    const operation = w.view.generate();
    w.release({
      ok: true,
      json: async () => ({
        generationId: `gen_${w.scene.requestKey}`,
        status: "completed",
        ...metadata,
        images: [{ data: "aGVsbG8=", mimeType: "image/png" }],
      }),
    });
    await operation;
    assert.equal(
      w.writes.length,
      1,
      "An invalid completed result must not overwrite recovery",
    );
    assert.equal(JSON.parse(w.writes[0].value).result, null);
  }
});

test("reentrant connected generation/save actions admit one operation before React updates busy", async () => {
  for (const action of ["generate", "save"]) {
    const w = workspace({
      pending: true,
      fresh: action === "generate",
      completed: action === "save",
    });
    const first = w.view[action]();
    const second = w.view[action]();
    const request = JSON.parse(w.requests[0].options.body);
    assert.equal(request.expectedActor, w.scene.owner);
    w.release({
      ok: true,
      json: async () =>
        action === "generate"
          ? {
              generationId: `gen_${request.requestKey}`,
              status: "completed",
              provider: "openrouter",
              model: w.scene.model,
              images: [{ data: "aGVsbG8=", mimeType: "image/png" }],
            }
          : { creationId: request.requestKey, visibility: "private" },
    });
    await Promise.all([first, second]);
    assert.equal(
      w.requests.length,
      1,
      "Reentrant activation cannot start another request",
    );
  }
});
