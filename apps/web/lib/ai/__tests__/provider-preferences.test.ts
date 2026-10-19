import assert from "node:assert/strict";
import test from "node:test";
import {
  readProviderPreferences,
  saveProviderPreferences,
  createCredentialScope,
  providerStorageNames,
} from "../provider-preferences";
import {
  getStoredKeys,
  setStoredKeys,
  clearStoredKeys,
} from "../../../app/room/[persona]/browser-voice";

function store() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => {
      values.set(name, value);
    },
    removeItem: (name: string) => {
      values.delete(name);
    },
  };
}

test("unattributed browser keys are preserved but never assigned to an account", () => {
  const storage = store();
  const legacy = JSON.stringify({ openai: "example-legacy-key" });
  storage.setItem("arcanea-provider-keys", legacy);
  for (const actor of ["guest", "user:a", "user:b", null] as const) {
    assert.deepEqual(readProviderPreferences(storage, actor).keys, {});
  }
  assert.equal(storage.getItem("arcanea-provider-keys"), legacy);
});

test("account switch and guest sign-in keep three independent configurations", () => {
  const storage = store();
  saveProviderPreferences(
    storage,
    { openai: "example-a-key" },
    "openai",
    "user:a",
  );
  saveProviderPreferences(
    storage,
    { google: "example-b-key" },
    "google",
    "user:b",
  );
  saveProviderPreferences(
    storage,
    { groq: "example-guest-key" },
    "groq",
    "guest",
  );
  assert.deepEqual(readProviderPreferences(storage, "user:a"), {
    keys: { openai: "example-a-key" },
    activeId: "openai",
  });
  assert.deepEqual(readProviderPreferences(storage, "user:b"), {
    keys: { google: "example-b-key" },
    activeId: "google",
  });
  assert.deepEqual(readProviderPreferences(storage, "guest"), {
    keys: { groq: "example-guest-key" },
    activeId: "groq",
  });
  assert.deepEqual(readProviderPreferences(storage, null).keys, {});
});

test("pending identity cannot read or write storage", () => {
  const storage = {
    getItem: () => {
      throw new Error("must not read");
    },
    setItem: () => {
      throw new Error("must not write");
    },
    removeItem: () => {
      throw new Error("must not remove");
    },
  };
  assert.deepEqual(readProviderPreferences(storage, null), {
    keys: {},
    activeId: "google",
  });
  assert.throws(
    () => saveProviderPreferences(storage, {}, "google", null),
    /account/,
  );
});

test("another tab cannot silently overwrite this account's saved keys", () => {
  const storage = store();
  const expected = JSON.stringify(readProviderPreferences(storage, "user:a"));
  saveProviderPreferences(
    storage,
    { openai: "example-new-key" },
    "openai",
    "user:a",
  );
  assert.throws(
    () =>
      saveProviderPreferences(
        storage,
        { groq: "example-old-key" },
        "groq",
        "user:a",
        expected,
      ),
    /another tab/,
  );
  assert.equal(
    readProviderPreferences(storage, "user:a").keys.openai,
    "example-new-key",
  );
  saveProviderPreferences(
    storage,
    { google: "example-b-key" },
    "google",
    "user:b",
    expected,
  );
});

test("partial storage failure restores only the affected account", () => {
  const storage = store();
  saveProviderPreferences(
    storage,
    { openai: "example-a-key" },
    "openai",
    "user:a",
  );
  saveProviderPreferences(storage, { groq: "example-b-key" }, "groq", "user:b");
  const before = new Map(storage.values);
  let writes = 0;
  const broken = {
    ...storage,
    setItem: (name: string, value: string) => {
      if (++writes === 2) throw new Error("example-quota-failure");
      storage.setItem(name, value);
    },
  };
  assert.throws(
    () =>
      saveProviderPreferences(
        broken,
        { google: "example-new-key" },
        "google",
        "user:a",
      ),
    /could not save/,
  );
  assert.deepEqual(storage.values, before);
});

test("requests captured before A → B → A cannot use the new A session", () => {
  const scope = createCredentialScope();
  const pending = scope.get();
  assert.equal(scope.isCurrent(pending), false);
  scope.set("user:a");
  const a = scope.get();
  assert.equal(scope.isCurrent(a), true);
  scope.set("user:a");
  assert.equal(scope.isCurrent(a), true);
  scope.set("user:b");
  assert.equal(scope.isCurrent(a), false);
  scope.set("user:a");
  assert.equal(scope.isCurrent(a), false);
  const signedInAgain = scope.get();
  scope.set(null);
  assert.equal(scope.isCurrent(signedInAgain), false);
});

test("model selection and clearing stay inside the selected account", () => {
  const storage = store();
  const a = providerStorageNames("user:a")!;
  const b = providerStorageNames("user:b")!;
  storage.setItem(a.model, "arcanea-opus");
  storage.setItem(b.model, "arcanea-gemini-pro");
  storage.setItem("arcanea-active-model", "arcanea-gpt5");
  saveProviderPreferences(
    storage,
    { openai: "example-a-key" },
    "openai",
    "user:a",
  );
  assert.equal(storage.getItem(a.model), null);
  assert.equal(storage.getItem(b.model), "arcanea-gemini-pro");
  assert.equal(storage.getItem("arcanea-active-model"), "arcanea-gpt5");
});

test("room voice keys share scoped settings and clearing preserves other providers", () => {
  const storage = store();
  const originalWindow = globalThis.window;
  const originalStorage = globalThis.localStorage;
  Object.assign(globalThis, {
    window: { dispatchEvent: () => true },
    localStorage: storage,
  });
  try {
    storage.setItem("arcanea-voice-groq-key", "example-old-groq");
    storage.setItem("arcanea-voice-eleven-key", "example-old-eleven");
    assert.deepEqual(getStoredKeys(null), {});
    assert.deepEqual(getStoredKeys("user:a"), {
      groq: undefined,
      eleven: undefined,
    });
    saveProviderPreferences(
      storage,
      { openai: "example-a-openai" },
      "openai",
      "user:a",
    );
    setStoredKeys(
      { groq: "example-a-groq", eleven: "example-a-eleven" },
      "user:a",
    );
    setStoredKeys({ groq: "example-b-groq" }, "user:b");
    assert.deepEqual(getStoredKeys("user:a"), {
      groq: "example-a-groq",
      eleven: "example-a-eleven",
    });
    assert.deepEqual(getStoredKeys("user:b"), {
      groq: "example-b-groq",
      eleven: undefined,
    });
    clearStoredKeys("user:a");
    assert.equal(
      readProviderPreferences(storage, "user:a").keys.openai,
      "example-a-openai",
    );
    assert.equal(getStoredKeys("user:b").groq, "example-b-groq");
    assert.equal(storage.getItem("arcanea-voice-groq-key"), "example-old-groq");
    assert.equal(
      storage.getItem("arcanea-voice-eleven-key"),
      "example-old-eleven",
    );
  } finally {
    Object.assign(globalThis, {
      window: originalWindow,
      localStorage: originalStorage,
    });
  }
});
