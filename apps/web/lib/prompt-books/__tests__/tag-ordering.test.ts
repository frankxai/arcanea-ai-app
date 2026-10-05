import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, owner, other } from "./fixtures";

test("a delayed old-session tag write settles before newer owner intent after A/B/A", async () => {
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
  const store = (await import("../store")).usePromptBooksStore;
  store.getState().reset();
  const f = await fixture();
  await store.getState().initialize(f.client, owner);
  const gate = f.holdBefore("POST", "pb_prompt_tags");
  const older = store.getState().changePromptTag("prompt-1", "tag-1", true);
  const refused = assert.rejects(older, /identity changed/);
  await gate.entered.promise;
  const b = await fixture(other);
  await store.getState().initialize(b.client, other);
  await store.getState().initialize(f.client, owner);
  const newer = store.getState().changePromptTag("prompt-1", "tag-1", false);
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(
    f.requests.filter(
      (r) =>
        r.method === "DELETE" && r.url.pathname.endsWith("/pb_prompt_tags"),
    ).length,
    0,
  );
  gate.release.resolve();
  await refused;
  await newer;
  assert.deepEqual(store.getState().prompts[0].tags, []);
  await store.getState().loadPrompts();
  assert.deepEqual(store.getState().prompts[0].tags, []);
  assert.equal(store.getState()._userId, owner);
});
