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
test("owner-filtered table search retains complete owned rows", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().search("Recovery");
  assert.equal(store.getState().searchResults[0].title, "Recovery prompt");
  assert.equal(store.getState().searchResults[0].userId, owner);
});
test("delayed search responses cannot replace the current query after A/B/A", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.hold("GET", "pb_prompts");
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
test("explicit foreign owners in table search responses remain rejected", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.searchOwner(other);
  await store.getState().search("Recovery");
  assert.deepEqual(store.getState().searchResults, []);
});
test("search refuses a changed actual SDK actor before querying the table", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const b = await fixture(other);
  store.setState({ _client: b.client });
  await store.getState().search("Private");
  assert.equal(
    b.requests.filter((r) => r.url.searchParams.has("or")).length,
    0,
  );
  assert.deepEqual(store.getState().searchResults, []);
});

test("table search quotes values and caps an owner-filtered non-archived query", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.missingSearchRpc();
  await store.getState().search('Quoted, (value) "and"');
  assert.equal(store.getState().searchResults[0].userId, owner);
  const request = f.requests.find((r) => r.url.searchParams.has("or"))!;
  assert.equal(request.url.searchParams.get("user_id"), `eq.${owner}`);
  assert.equal(request.url.searchParams.get("is_archived"), "eq.false");
  assert.equal(request.url.searchParams.get("limit"), "50");
  assert.equal(request.url.searchParams.get("order"), "updated_at.desc");
  const filters = request.url.searchParams.get("or")!;
  assert.ok(filters.includes('title.ilike."%Quoted, (value)'));
  assert.ok(filters.includes('content.ilike."%Quoted, (value)'));
});
test("search never invokes the unsafe legacy RPC, even when it is available", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().search("First");
  await store.getState().search("Second");
  assert.equal(
    f.requests.filter((r) => r.url.pathname.endsWith("/rpc/pb_search_prompts"))
      .length,
    0,
  );
  assert.equal(
    f.requests.filter((r) => r.url.searchParams.has("or")).length,
    2,
  );
  assert.equal(store.getState().searchQuery, "Second");
});
test("table rows without an explicit owner are rejected", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.missingSearchRpc();
  f.omitSearchOwner();
  await store.getState().search("Private");
  assert.deepEqual(store.getState().searchResults, []);
});
