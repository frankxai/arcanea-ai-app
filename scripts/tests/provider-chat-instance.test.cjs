const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const { createRequire } = require("node:module");
const { execFileSync } = require("node:child_process");
const ts = require("typescript");

const repo = path.resolve(__dirname, "../..");
const appRequire = createRequire(path.join(repo, "apps/web/package.json"));
const { Chat } = appRequire("@ai-sdk/react");
const sdkSource = fs.readFileSync(
  path.resolve(
    path.dirname(appRequire.resolve("@ai-sdk/react")),
    "../src/use-chat.ts",
  ),
  "utf8",
);
const file = "apps/web/hooks/use-conversation.ts";
const sourceRef = process.env.PROVIDER_CHAT_SOURCE_REF;
if (sourceRef && !/^[0-9a-f]{40}$/.test(sourceRef))
  throw new Error("The reproduction requires an immutable source SHA.");
const source = sourceRef
  ? execFileSync("git", ["show", `${sourceRef}:${file}`], {
      cwd: repo,
      encoding: "utf8",
    })
  : fs.readFileSync(path.join(repo, file), "utf8");
const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
const declarations = new Map();
let chatOptions;
function visit(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name))
    declarations.set(node.name.text, node);
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(parsed) === "useChat"
  )
    chatOptions = node.arguments[0];
  ts.forEachChild(node, visit);
}
visit(parsed);
assert.ok(chatOptions, "Exercise the application's actual chat configuration.");
let setup = "";
for (const property of chatOptions.properties) {
  if (
    ts.isPropertyAssignment(property) &&
    ts.isIdentifier(property.initializer)
  ) {
    const declaration = declarations.get(property.initializer.text);
    if (declaration && property.name.getText(parsed) === "chat")
      setup += `const ${declaration.getText(parsed)};\n`;
  }
}
const transpile = (value) =>
  ts.transpileModule(value, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;

test("pending SDK callbacks stay with their account before passive cleanup", async () => {
  // Run actual SDK Chat instances, hook source and app configuration. Only the
  // React scheduler and transport are synthetic; no browser or provider is used.
  const preferences = {};
  vm.runInNewContext(
    transpile(
      fs.readFileSync(
        path.join(repo, "apps/web/lib/ai/provider-preferences.ts"),
        "utf8",
      ),
    ),
    { exports: preferences },
  );
  const credentialScope = preferences.createCredentialScope();
  const slots = [];
  let cursor = 0;
  const react = {
    useRef: (initial) =>
      slots[cursor++] ?? (slots[cursor - 1] = { current: initial }),
    useMemo: (fn, dependencies) => {
      const index = cursor++;
      if (
        !slots[index] ||
        dependencies.some(
          (value, i) => !Object.is(value, slots[index].dependencies[i]),
        )
      )
        slots[index] = { dependencies, value: fn() };
      return slots[index].value;
    },
    useCallback: (fn) => {
      cursor++;
      return fn;
    },
    useSyncExternalStore: (_subscribe, snapshot) => {
      cursor++;
      return snapshot();
    },
    useEffect: () => {
      cursor++;
    },
  };
  const sdk = {};
  vm.runInNewContext(transpile(sdkSource), {
    exports: sdk,
    require: (name) => {
      if (name === "react") return react;
      if (name === "./chat" || name === "./chat.react") return { Chat };
      return appRequire(name);
    },
  });
  const errors = [];
  function render(owner, transport) {
    credentialScope.set(`user:${owner}`);
    cursor = 0;
    const configuration = {};
    vm.runInNewContext(
      transpile(`${setup} exports.options = ${chatOptions.getText(parsed)};`),
      {
        exports: configuration,
        Chat,
        transport,
        credentialScope,
        credentialToken: credentialScope.get(),
        conversationIdentity: "fixture",
        useMemo: react.useMemo,
        setChatError: (error) => errors.push({ owner, error }),
      },
    );
    return sdk.useChat(configuration.options);
  }
  let rejectA;
  const pendingA = new Promise((_resolve, reject) => {
    rejectA = reject;
  });
  let requests = 0;
  const transportA = {
    sendMessages: () => {
      requests++;
      return pendingA;
    },
  };
  const a = render("a", transportA);
  const pending = a.sendMessage({ text: "Account A private fixture" });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests, 1);
  assert.equal(
    render("a", transportA).sendMessage,
    a.sendMessage,
    "Same-actor rerenders retain the request instance.",
  );
  const b = render("b", {
    sendMessages: () => {
      throw new Error("Current account B fixture");
    },
  });
  // Release between render and passive cleanup, where id-only isolation fails.
  rejectA(new Error("Late account A private fixture"));
  await pending;
  assert.deepEqual(
    errors,
    [],
    "A late A request cannot invoke B's error callback.",
  );
  await b.sendMessage({ text: "Account B fixture" });
  assert.deepEqual(
    errors,
    [{ owner: "b", error: "Current account B fixture" }],
    "Current-actor errors remain visible.",
  );
});
