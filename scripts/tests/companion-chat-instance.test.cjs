const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const { createRequire } = require("node:module");

// Actual SDK and component source; React scheduling and responses are synthetic.
// This fixture never calls a provider or writes to production.
const repo = path.resolve(__dirname, "../..");
const appRequire = createRequire(path.join(repo, "apps/web/package.json"));
const dependencyRequire = createRequire(path.join(repo, "package.json"));
const ts = dependencyRequire("typescript");
const { Chat } = appRequire("@ai-sdk/react");
const { DefaultChatTransport } = appRequire("ai");
const sourceFile =
  process.env.COMPANION_SOURCE_FILE ??
  path.join(repo, "apps/web/components/lumina/companion-chat.tsx");
const componentSource = fs.readFileSync(sourceFile, "utf8");
const sdkFile = path.resolve(
  path.dirname(appRequire.resolve("@ai-sdk/react")),
  "../src/use-chat.ts",
);
const sdkSource = fs.readFileSync(sdkFile, "utf8");
const preferencesSource = fs.readFileSync(
  path.join(repo, "apps/web/lib/ai/provider-preferences.ts"),
  "utf8",
);
const safeErrorsSource = fs.readFileSync(
  path.join(repo, "apps/web/lib/chat/error-message.ts"),
  "utf8",
);
const transpile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
const preferences = {};
vm.runInNewContext(transpile(preferencesSource), { exports: preferences });
const safeErrors = {};
vm.runInNewContext(transpile(safeErrorsSource), { exports: safeErrors });
const actorA = "user:11111111-1111-4111-8111-111111111111";
const actorB = "user:22222222-2222-4222-8222-222222222222";

function fixture() {
  const credentialScope = preferences.createCredentialScope();
  credentialScope.set(actorA);
  const keyVersions = new Map([
    [actorA, "dummy-a1"],
    [actorB, "dummy-b1"],
  ]);
  const requests = [];
  const writes = [];
  const chats = [];
  const hookScopes = new Map();
  const subscriptions = [];
  let slots;
  let cursor;
  let renderToken;
  let responder = async () =>
    new Response("Synthetic provider failure", { status: 503 });
  const readProviderFromStorage = (actor) => ({
    provider: "google",
    clientApiKey: actor ? keyVersions.get(actor) : undefined,
    label: "Synthetic Gemini",
    modelId: null,
    isGateway: false,
  });
  const fetch = async (url, init) => {
    requests.push({ url: String(url), body: JSON.parse(init.body) });
    return responder(url, init);
  };
  const react = {
    useState(initial) {
      const index = cursor++;
      const capturedSlots = slots;
      const capturedToken = renderToken;
      if (!(index in capturedSlots))
        capturedSlots[index] =
          typeof initial === "function" ? initial() : initial;
      return [
        capturedSlots[index],
        (value) => {
          capturedSlots[index] =
            typeof value === "function" ? value(capturedSlots[index]) : value;
          writes.push({ token: capturedToken, value: capturedSlots[index] });
        },
      ];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useMemo(fn, deps) {
      const index = cursor++;
      if (
        !(index in slots) ||
        deps.some((value, i) => !Object.is(value, slots[index].deps[i]))
      )
        slots[index] = { deps, value: fn() };
      return slots[index].value;
    },
    useCallback(fn, deps) {
      return react.useMemo(() => fn, deps);
    },
    useEffect() {
      cursor++;
    },
    useSyncExternalStore(subscribe, snapshot) {
      cursor++;
      subscriptions.push(subscribe(() => {}));
      return snapshot();
    },
  };
  const sdk = {};
  vm.runInNewContext(transpile(sdkSource), {
    exports: sdk,
    require: (name) =>
      name === "react"
        ? react
        : name === "./chat.react" || name === "./chat"
          ? { Chat }
          : appRequire(name),
  });
  const jsx = (type, props, key) => ({ type, props, key });
  class ObservedChat extends Chat {
    constructor(options) {
      super(options);
      chats.push(this);
    }
  }
  class ObservedTransport extends DefaultChatTransport {
    constructor(options) {
      super({ ...options, fetch: options.fetch ?? fetch });
    }
  }
  const component = {};
  vm.runInNewContext(transpile(componentSource), {
    exports: component,
    fetch,
    require(name) {
      if (name === "react") return react;
      if (name === "react/jsx-runtime")
        return { jsx, jsxs: jsx, Fragment: Symbol.for("fixture.fragment") };
      if (name === "@ai-sdk/react") return { ...sdk, Chat: ObservedChat };
      if (name === "ai") return { DefaultChatTransport: ObservedTransport };
      if (name === "next/link") return { default: "a" };
      if (name.endsWith(".module.css"))
        return {
          default: new Proxy({}, { get: (_target, key) => String(key) }),
        };
      if (name === "@/hooks/use-provider")
        return {
          useProvider: () =>
            readProviderFromStorage(credentialScope.get().actor),
          readProviderFromStorage,
        };
      if (name === "@/lib/auth/context")
        return { useAuth: () => ({ credentialScope }) };
      if (name === "@/lib/chat/error-message") return safeErrors;
      if (name === "@/lib/ai/provider-preferences") return preferences;
      throw new Error(`Unexpected component dependency: ${name}`);
    },
  });
  function runComponent(fn, props, key) {
    if (!hookScopes.has(key)) hookScopes.set(key, []);
    slots = hookScopes.get(key);
    cursor = 0;
    renderToken = credentialScope.get();
    const tree = fn(props);
    return typeof tree.type === "function"
      ? runComponent(tree.type, tree.props, `child:${tree.key ?? "unkeyed"}`)
      : tree;
  }
  const render = () =>
    runComponent(component.CompanionChat, { open: true }, "root");
  function find(tree, predicate) {
    if (!tree || typeof tree !== "object") return null;
    if (predicate(tree)) return tree;
    for (const child of [tree.props?.children].flat(Infinity)) {
      const found = find(child, predicate);
      if (found) return found;
    }
    return null;
  }
  function prepare() {
    let tree = render();
    find(tree, (node) => node.type === "textarea").props.onChange({
      target: { value: "Synthetic private character prompt" },
    });
    tree = render();
    return find(tree, (node) => node.type === "form").props.onSubmit;
  }
  const submit = (handler) => handler({ preventDefault() {} });
  const settle = async () => {
    for (let i = 0; i < 6; i++)
      await new Promise((resolve) => setImmediate(resolve));
  };
  return {
    credentialScope,
    keyVersions,
    requests,
    writes,
    chats,
    render,
    prepare,
    submit,
    settle,
    setResponder: (next) => {
      responder = next;
    },
    cleanup: () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      chats.forEach((chat) => chat.stop());
    },
  };
}

async function staleCase(actors) {
  const f = fixture();
  try {
    const sender = f.prepare();
    actors.forEach((actor) => f.credentialScope.set(actor));
    f.submit(sender);
    await f.settle();
    assert.equal(
      f.requests.length,
      0,
      "An obsolete companion must not POST its previous account prompt/key.",
    );
  } finally {
    f.cleanup();
  }
}
const cases = [
  ["A-to-B before React render", () => staleCase([actorB])],
  ["A-to-B-to-A before React render", () => staleCase([actorB, actorA])],
  ["loading account before React render", () => staleCase([null])],
  [
    "account switch while SDK prepares the request",
    async () => {
      const f = fixture();
      try {
        f.submit(f.prepare());
        f.credentialScope.set(actorB);
        await f.settle();
        assert.equal(
          f.requests.length,
          0,
          "Recheck the account immediately before the SDK fetch.",
        );
      } finally {
        f.cleanup();
      }
    },
  ],
  [
    "updated provider settings before React render",
    async () => {
      const f = fixture();
      try {
        const sender = f.prepare();
        f.keyVersions.set(actorA, "dummy-a2");
        f.submit(sender);
        await f.settle();
        assert.equal(
          f.requests.length,
          1,
          "The current actor can still send explicitly.",
        );
        assert.equal(
          f.requests[0].body.clientApiKey,
          "dummy-a2",
          "Read the current actor key at send time.",
        );
      } finally {
        f.cleanup();
      }
    },
  ],
  [
    "removed provider key before React render",
    async () => {
      const f = fixture();
      try {
        const sender = f.prepare();
        f.keyVersions.delete(actorA);
        f.submit(sender);
        await f.settle();
        assert.equal(
          f.requests.length,
          0,
          "A removed key must not be sent from the render snapshot.",
        );
      } finally {
        f.cleanup();
      }
    },
  ],
  [
    "matching account and one explicit send",
    async () => {
      const f = fixture();
      try {
        const sender = f.prepare();
        f.submit(sender);
        f.submit(sender);
        await f.settle();
        assert.equal(
          f.requests.length,
          1,
          "Duplicate submit events in one frame send once.",
        );
        assert.equal(f.requests[0].body.clientApiKey, "dummy-a1");
        assert.equal(
          f.requests[0].body.messages[0].parts[0].text,
          "Synthetic private character prompt",
        );
      } finally {
        f.cleanup();
      }
    },
  ],
  [
    "current empty reply still reports recovery",
    async () => {
      const f = fixture();
      try {
        f.setResponder(
          async () =>
            new Response(
              'data: {"type":"start","messageId":"synthetic-current-empty"}\n\ndata: {"type":"finish","finishReason":"stop"}\n\ndata: [DONE]\n\n',
              {
                headers: {
                  "Content-Type": "text/event-stream",
                  "x-vercel-ai-ui-message-stream": "v1",
                },
              },
            ),
        );
        f.submit(f.prepare());
        await f.settle();
        assert.equal(f.requests.length, 1);
        assert.ok(
          f.writes.some(
            (write) =>
              write.value?.title ===
              safeErrors.getErrorMessage("Empty response").title,
          ),
          "The current actor still sees the actual empty-reply alert.",
        );
      } finally {
        f.cleanup();
      }
    },
  ],
  [
    "late empty reply after A-to-B-to-A",
    async () => {
      const f = fixture();
      try {
        let release;
        f.setResponder(
          () =>
            new Promise((resolve) => {
              release = resolve;
            }),
        );
        f.submit(f.prepare());
        await f.settle();
        assert.equal(f.requests.length, 1);
        const oldToken = f.credentialScope.get();
        f.credentialScope.set(actorB);
        f.credentialScope.set(actorA);
        f.render();
        const before = f.writes.length;
        release(
          new Response(
            'data: {"type":"start","messageId":"synthetic-empty"}\n\ndata: {"type":"finish","finishReason":"stop"}\n\ndata: [DONE]\n\n',
            {
              headers: {
                "Content-Type": "text/event-stream",
                "x-vercel-ai-ui-message-stream": "v1",
              },
            },
          ),
        );
        await f.settle();
        assert.equal(
          f.writes
            .slice(before)
            .filter((write) => typeof write.value?.title === "string").length,
          0,
          "An old completion cannot introduce a recovery alert into the current account.",
        );
        assert.equal(f.credentialScope.isCurrent(oldToken), false);
      } finally {
        f.cleanup();
      }
    },
  ],
];

(async () => {
  const results = [];
  for (const [name, run] of cases) {
    try {
      await run();
      results.push({ name, passed: true });
    } catch (error) {
      results.push({ name, passed: false, error: error.message });
    }
  }
  const receipt = {
    recordedAt: new Date().toISOString(),
    node: process.version,
    source: path.relative(repo, sourceFile),
    sourceSha256: crypto
      .createHash("sha256")
      .update(componentSource)
      .digest("hex"),
    sdkSourceSha256: crypto
      .createHash("sha256")
      .update(sdkSource)
      .digest("hex"),
    preferencesSourceSha256: crypto
      .createHash("sha256")
      .update(preferencesSource)
      .digest("hex"),
    realSDK: true,
    syntheticReactScheduler: true,
    syntheticResponses: true,
    actualNetworkRequests: 0,
    providerCalls: 0,
    productionWrites: 0,
    results,
  };
  if (process.env.COMPANION_RECEIPT_FILE)
    fs.writeFileSync(
      process.env.COMPANION_RECEIPT_FILE,
      JSON.stringify(receipt, null, 2) + "\n",
      { flag: "wx" },
    );
  process.stdout.write(JSON.stringify(receipt, null, 2) + "\n");
  process.exitCode = results.every((result) => result.passed) ? 0 : 1;
})().catch((error) => {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
