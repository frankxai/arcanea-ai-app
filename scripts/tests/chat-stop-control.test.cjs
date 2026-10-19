const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const { createRequire } = require("node:module");
const ts = require("typescript");

const repo = path.resolve(__dirname, "../..");
const appRequire = createRequire(path.join(repo, "apps/web/package.json"));
const { Chat } = appRequire("@ai-sdk/react");
const { DefaultChatTransport } = appRequire("ai");
const page = ts.createSourceFile(
  "page.tsx",
  fs.readFileSync(path.join(repo, "apps/web/app/chat/page.tsx"), "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const hook = ts.createSourceFile(
  "use-conversation.ts",
  fs.readFileSync(
    path.join(repo, "apps/web/hooks/use-conversation.ts"),
    "utf8",
  ),
  ts.ScriptTarget.Latest,
  true,
);
const declarations = new Map();
let stopBinding;
let conversation;
let textHelper;
function visitPage(node) {
  if (ts.isJsxAttribute(node) && node.name.getText(page) === "onStop") {
    assert.equal(
      stopBinding,
      undefined,
      "The chat input has one Stop binding.",
    );
    stopBinding = node.initializer.expression.getText(page);
  }
  ts.forEachChild(node, visitPage);
}
function visitHook(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name))
    declarations.set(node.name.text, node);
  if (ts.isFunctionDeclaration(node)) {
    if (node.name?.text === "useConversation") conversation = node;
    if (node.name?.text === "getMessageText") textHelper = node;
  }
  ts.forEachChild(node, visitHook);
}
visitPage(page);
visitHook(hook);
assert.match(stopBinding, /^conversation\.\w+$/);
const returned = conversation.body.statements.find(
  ts.isReturnStatement,
).expression;
const property = returned.properties.find(
  (value) => value.name.getText(hook) === stopBinding.split(".")[1],
);
assert.ok(
  property,
  "Exercise the hook action actually wired to the Stop control.",
);
let handler = ts.isShorthandPropertyAssignment(property)
  ? property.name.getText(hook)
  : property.initializer.getText(hook);
if (declarations.has(handler)) {
  const initializer = declarations.get(handler).initializer;
  handler =
    ts.isCallExpression(initializer) &&
    initializer.expression.getText(hook) === "useCallback"
      ? initializer.arguments[0].getText(hook)
      : initializer.getText(hook);
}
const executable = ts.transpileModule(
  `${textHelper.getText(hook)}\nexports.handler = ${handler};`,
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;
const settle = () => new Promise((resolve) => setImmediate(resolve));

test(
  "the full-chat Stop control aborts its real SDK stream without resending",
  { timeout: 5000 },
  async () => {
    // Actual page binding, hook action, Chat and transport. Only the network
    // response is synthetic; no provider, account or production write is used.
    let requests = 0;
    let aborted = false;
    let controller;
    const sendPromises = [];
    const transport = new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (_url, init) => {
        requests++;
        if (requests > 1) throw new Error("Stop tried to resend the prompt.");
        const stream = new ReadableStream({
          start(value) {
            controller = value;
            const encoder = new TextEncoder();
            for (const event of [
              { type: "start", messageId: "synthetic-partial" },
              { type: "text-start", id: "synthetic-text" },
              {
                type: "text-delta",
                id: "synthetic-text",
                delta: "Retained partial answer",
              },
            ])
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
              );
            init.signal.addEventListener(
              "abort",
              () => {
                aborted = true;
                controller.error(
                  new DOMException("Synthetic stream stopped", "AbortError"),
                );
              },
              { once: true },
            );
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "x-vercel-ai-ui-message-stream": "v1",
          },
        });
      },
    });
    const chat = new Chat({ id: "synthetic-stop-regression", transport });
    try {
      sendPromises.push(chat.sendMessage({ text: "Synthetic private prompt" }));
      for (let i = 0; i < 30 && chat.messages.length < 2; i++) await settle();
      assert.equal(chat.status, "streaming");
      assert.equal(chat.messages.length, 2);
      const action = {};
      vm.runInNewContext(executable, {
        exports: action,
        messages: chat.messages,
        stop: () => chat.stop(),
        setMessages: (messages) => {
          chat.messages = messages;
        },
        sendMessage: (message) => {
          const pending = chat.sendMessage(message);
          sendPromises.push(pending);
          return pending;
        },
      });
      await action.handler();
      for (let i = 0; i < 10; i++) await settle();
      assert.equal(
        aborted,
        true,
        "The actual Stop action must abort the active request.",
      );
      assert.equal(
        requests,
        1,
        "Stopping must not resend or start another request.",
      );
      assert.equal(
        chat.messages.length,
        2,
        "Retain the prompt and partial answer.",
      );
      assert.equal(chat.messages[1].parts[0].text, "Retained partial answer");
      assert.equal(chat.status, "ready");
    } finally {
      await chat.stop();
      // The broken regeneration handler can replace the SDK's active response.
      // Release our synthetic stream even when SDK Stop can no longer find it.
      try {
        controller?.error(new DOMException("Fixture cleanup", "AbortError"));
      } catch {}
      await Promise.allSettled(sendPromises);
    }
  },
);
