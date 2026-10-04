import { test, before, beforeEach } from "node:test";
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
const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

test("superseded initialization failure cannot undo recovered route selection", async () => {
  const f = await fixture();
  f.failRead();
  const gate = f.hold("GET");
  const initializing = store.getState().initialize(f.client, owner);
  await gate.entered.promise;
  store.getState().setActiveCollection("recovered-route");
  await settle();
  assert.equal(store.getState().syncStatus, "synced");
  gate.release.resolve();
  await initializing;
  assert.equal(store.getState().activeCollectionId, "recovered-route");
  assert.equal(store.getState().syncStatus, "synced");
});

test("superseded initialization success cannot conceal a current selection failure", async () => {
  const f = await fixture();
  const gate = f.hold("GET");
  const initializing = store.getState().initialize(f.client, owner);
  await gate.entered.promise;
  f.failRead();
  store.getState().setActiveCollection("failed-route");
  await settle();
  assert.equal(store.getState().syncStatus, "error");
  gate.release.resolve();
  await initializing;
  assert.equal(store.getState().syncStatus, "error");
});

test("an unsuperseded initialization failure remains visible", async () => {
  const f = await fixture();
  f.failRead();
  await store.getState().initialize(f.client, owner);
  assert.equal(store.getState().syncStatus, "error");
});

test("successful selection recovery clears its previous sync error", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  f.failRead();
  store.getState().setActiveCollection("first");
  await settle();
  assert.equal(store.getState().syncStatus, "error");
  store.getState().setActiveCollection("recovered");
  await settle();
  assert.equal(store.getState().syncStatus, "synced");
});

for (const assigned of [true, false]) {
  test(`old ${assigned ? "assign" : "unassign"} tag response is refused after A/B/A`, async () => {
    const f = await fixture();
    await store.getState().initialize(f.client, owner);
    const gate = f.hold("GET", "pb_prompt_tags");
    const changing = store
      .getState()
      .changePromptTag("prompt-1", "tag-1", assigned);
    await gate.entered.promise;
    const foreign = await fixture(other);
    await store.getState().initialize(foreign.client, other);
    await store.getState().initialize(f.client, owner);
    const prompt = store.getState().prompts[0];
    const currentTag = {
      ...store.getState().tags[0],
      name: "Current session tags",
    };
    store.getState().updatePromptInStore({ ...prompt, tags: [currentTag] });
    const rejected = assert.rejects(changing, /identity changed/);
    gate.release.resolve();
    await rejected;
    assert.equal(
      store.getState().prompts[0].tags?.[0].name,
      "Current session tags",
    );
  });
}

test("adding a second tag preserves the first association through actual SDK reads", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().changePromptTag("prompt-1", "tag-1", true);
  await store.getState().changePromptTag("prompt-1", "tag-2", true);
  assert.deepEqual(
    store
      .getState()
      .prompts[0].tags?.map((tag) => tag.id)
      .sort(),
    ["tag-1", "tag-2"],
  );
});

test("a failed tag refresh preserves the confirmed cache and can be retried", async () => {
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  await store.getState().changePromptTag("prompt-1", "tag-1", true);
  f.failRead("pb_prompt_tags");
  await assert.rejects(
    store.getState().changePromptTag("prompt-1", "tag-2", true),
  );
  assert.deepEqual(
    store.getState().prompts[0].tags?.map((tag) => tag.id),
    ["tag-1"],
  );
  await store.getState().changePromptTag("prompt-1", "tag-2", true);
  assert.deepEqual(
    store
      .getState()
      .prompts[0].tags?.map((tag) => tag.id)
      .sort(),
    ["tag-1", "tag-2"],
  );
});
