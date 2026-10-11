const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const api = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync(
      path.resolve(__dirname, "../../apps/web/lib/chat/entry-draft.ts"),
      "utf8",
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText,
  { exports: api },
);
const {
  stageEntryDraft,
  consumeEntryDraft,
  ENTRY_DRAFT_KEY,
  ENTRY_DRAFT_MAX_CHARS,
  ENTRY_DRAFT_TTL_MS,
  isCompositionKey,
} = api;
const id = "00000000-0000-4000-8000-000000000001";
const secondId = "00000000-0000-4000-8000-000000000002";
const now = 1000000;
function storage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}
test("one-use draft preserves Unicode, lines and the exact account", () => {
  const store = storage();
  assert.equal(
    stageEntryDraft(
      store,
      "  海の図書館\nThe tide kept her secret.  ",
      "creator-a",
      id,
      now,
    ),
    true,
  );
  const result = consumeEntryDraft(store, id, "creator-a", now + 1);
  assert.equal(result.ok, true);
  assert.equal(result.text, "海の図書館\nThe tide kept her secret.");
  assert.equal(store.getItem(ENTRY_DRAFT_KEY), null);
  assert.equal(
    consumeEntryDraft(store, id, "creator-a", now + 2).reason,
    "unavailable",
  );
});
test("guest is a separate actor; wrong account cannot read or erase the draft", () => {
  const store = storage();
  stageEntryDraft(store, "Private scene", "creator-a", id, now);
  const before = store.getItem(ENTRY_DRAFT_KEY);
  for (const owner of [null, "creator-b"])
    assert.equal(consumeEntryDraft(store, id, owner, now).reason, "account");
  assert.equal(store.getItem(ENTRY_DRAFT_KEY), before);
  assert.equal(
    consumeEntryDraft(store, id, "creator-a", now).text,
    "Private scene",
  );
  stageEntryDraft(store, "Guest scene", null, id, now);
  assert.equal(
    consumeEntryDraft(store, id, "creator-a", now).reason,
    "account",
  );
  assert.equal(consumeEntryDraft(store, id, null, now).text, "Guest scene");
});
test("old links cannot erase a newer draft, and storage remains bounded to one record", () => {
  const store = storage();
  stageEntryDraft(store, "First", null, id, now);
  stageEntryDraft(store, "Second", null, secondId, now);
  assert.equal(consumeEntryDraft(store, id, null, now).reason, "unavailable");
  assert.equal(consumeEntryDraft(store, secondId, null, now).text, "Second");
});
test("expiry refuses text and removes the expired record", () => {
  const store = storage();
  stageEntryDraft(store, "Expired scene", null, id, now);
  assert.equal(
    consumeEntryDraft(store, id, null, now + ENTRY_DRAFT_TTL_MS).reason,
    "expired",
  );
  assert.equal(store.getItem(ENTRY_DRAFT_KEY), null);
});
test("blocked and quota-limited storage never reports a successful handoff", () => {
  const failing = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("quota");
    },
    removeItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(
    stageEntryDraft(failing, "Keep this on home", null, id, now),
    false,
  );
  assert.equal(consumeEntryDraft(failing, id, null, now).reason, "storage");
  assert.equal(
    stageEntryDraft({ ...storage(), setItem() {} }, "Keep this", null, id, now),
    false,
  );
});
test("failed removal refuses prefill and preserves recoverable text", () => {
  for (const removeItem of [
    () => {
      throw new Error("blocked");
    },
    () => {},
  ]) {
    const store = storage();
    stageEntryDraft(store, "Do not duplicate", null, id, now);
    const before = store.getItem(ENTRY_DRAFT_KEY);
    assert.equal(
      consumeEntryDraft({ ...store, removeItem }, id, null, now).reason,
      "storage",
    );
    assert.equal(store.getItem(ENTRY_DRAFT_KEY), before);
  }
});
test("blank, oversize and malformed IDs are rejected before storage mutation", () => {
  const store = storage();
  for (const text of [" ", "x".repeat(ENTRY_DRAFT_MAX_CHARS + 1)])
    assert.equal(stageEntryDraft(store, text, null, id, now), false);
  for (const badId of ["../../private", "prompt=secret", ""]) {
    assert.equal(stageEntryDraft(store, "Secret", null, badId, now), false);
    assert.equal(
      consumeEntryDraft(store, badId, null, now).reason,
      "unavailable",
    );
  }
  assert.equal(store.getItem(ENTRY_DRAFT_KEY), null);
});
test("corrupt, future-dated and non-string records cannot prefill", () => {
  const store = storage();
  const valid = {
    version: 1,
    id,
    owner: null,
    text: "Scene",
    expiresAt: now + ENTRY_DRAFT_TTL_MS,
  };
  for (const raw of [
    "{",
    "null",
    "[]",
    JSON.stringify({ ...valid, owner: {} }),
    JSON.stringify({ ...valid, text: 42 }),
    JSON.stringify({ ...valid, text: "x".repeat(4001) }),
    JSON.stringify({ ...valid, expiresAt: now + ENTRY_DRAFT_TTL_MS + 1 }),
  ]) {
    store.setItem(ENTRY_DRAFT_KEY, raw);
    assert.equal(consumeEntryDraft(store, id, null, now).reason, "unavailable");
  }
});
test("IME signals protect Enter across native composing, active composition and legacy 229", () => {
  assert.equal(isCompositionKey({ isComposing: true }), true);
  assert.equal(isCompositionKey({ isComposing: false }, true), true);
  assert.equal(isCompositionKey({ keyCode: 229 }), true);
  assert.equal(isCompositionKey({ isComposing: false, keyCode: 13 }), false);
});
