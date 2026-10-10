const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const file = path.resolve(
  __dirname,
  "../../apps/web/lib/chat/error-message.ts",
);
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  { exports: exportsObject },
);
const { getErrorMessage } = exportsObject;

test("actual BYOK denial tells the customer how to connect", () => {
  for (const message of [
    "Connect your provider key in Settings → Providers to use chat.",
    "CUSTOMER_KEY_REQUIRED",
    "No API key configured",
  ]) {
    const recovery = getErrorMessage(message);
    assert.equal(recovery.title, "Connect your provider");
    assert.match(recovery.action, /your own provider key/);
    assert.doesNotMatch(recovery.action, /admin|server keys/);
  }
});
test("rejected keys, rate limits and interrupted requests have distinct recovery", () => {
  assert.equal(
    getErrorMessage(new Error("HTTP 401")).title,
    "Check your provider key",
  );
  assert.equal(getErrorMessage("HTTP 403").title, "Check your provider key");
  assert.equal(
    getErrorMessage("HTTP 429").title,
    "Provider rate limit reached",
  );
  assert.equal(getErrorMessage("Failed to FETCH").title, "Connection lost");
  assert.equal(
    getErrorMessage("Maximum context length").title,
    "Message too long",
  );
  assert.equal(getErrorMessage("ETIMEDOUT").title, "Response timed out");
  assert.equal(getErrorMessage("HTTP 503").title, "Response interrupted");
});
test("raw provider details and credential-looking values are never displayed", () => {
  const secret = "synthetic-private-customer-value";
  for (const message of [
    `HTTP 401 key=${secret}`,
    `provider stack trace ${secret}`,
    `timeout ${secret}`,
  ]) {
    const recovery = getErrorMessage(message);
    assert.equal(JSON.stringify(recovery).includes(secret), false);
    assert.equal(JSON.stringify(recovery).includes("stack trace"), false);
  }
  assert.match(getErrorMessage("timeout").action, /may charge/);
  assert.match(
    getErrorMessage("unknown").action,
    /Text already received remains available/,
  );
});
