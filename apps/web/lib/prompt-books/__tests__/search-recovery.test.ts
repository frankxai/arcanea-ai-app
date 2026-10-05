import { before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { fixture, owner, other } from "./fixtures";
let store: typeof import("../store").usePromptBooksStore;
before(async () => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  });
  store = (await import("../store")).usePromptBooksStore;
});
beforeEach(() => store.getState().reset());
test("owner-filtered search RPC rows without user_id stay visible", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().search("Recovery");
  assert.equal(store.getState().searchResults[0].title, "Recovery prompt");
  assert.equal(store.getState().searchResults[0].userId, owner);
});
test("delayed search responses cannot replace the current query after A/B/A", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("POST", "rpc/pb_search_prompts");
  const older = store.getState().search("Older");
  await gate.entered.promise;
  const b = await fixture(other);
  await store.getState().initialize(b.client, other);
  await store.getState().initialize(f.client, owner);
  f.replaceStored({ title: "Current query result" });
  await store.getState().search("Current");
  gate.release.resolve();
  await older;
  assert.equal(store.getState().searchQuery, "Current");
  assert.equal(store.getState().searchResults[0].title, "Current query result");
});
test("explicit foreign owners in search responses remain rejected", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.searchOwner(other);
  await store.getState().search("Recovery");
  assert.deepEqual(store.getState().searchResults, []);
});
test("search refuses a changed actual SDK actor before invoking the RPC", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const b = await fixture(other);
  store.setState({ _client: b.client });
  await store.getState().search("Private");
  assert.equal(
    b.requests.filter((r) => r.url.pathname.endsWith("/rpc/pb_search_prompts"))
      .length,
    0,
  );
  assert.deepEqual(store.getState().searchResults, []);
});
