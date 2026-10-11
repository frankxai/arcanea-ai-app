import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { createCredentialScope } from "../../ai/provider-preferences";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorited,
} from "../../imagine-favorites";

const originalFetch = globalThis.fetch;
const descriptors = Object.getOwnPropertyDescriptors(globalThis);
let items: Map<string, string>;
let calls: number;
const sample = {
  id: "image-a",
  url: "data:image/png;base64,aGVsbG8=",
  data: "aGVsbG8=",
  mimeType: "image/png",
  prompt: "A private manuscript scene",
};
function authority(actor: string) {
  const scope = createCredentialScope();
  scope.set(`user:${actor}`);
  return { scope, token: scope.get() };
}
const slot = (actor: string) =>
  `arcanea-imagine-favorites:v2:${encodeURIComponent(`user:${actor}`)}`;
const retained = {
  id: "retained",
  blobUrl: "https://example.invalid/retained.png",
  originalUrl: "",
  prompt: "An earlier private scene",
  savedAt: "2026-10-11T00:00:00Z",
};

beforeEach(() => {
  items = new Map();
  calls = 0;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {},
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => items.set(key, value),
      removeItem: (key: string) => items.delete(key),
    },
  });
  globalThis.fetch = async (_url, options) => {
    calls++;
    const body = JSON.parse(String(options?.body));
    return Response.json({
      ownerId: body.ownerId,
      assetId: body.assetId,
      url: `/api/imagine/assets/${body.assetId}.png`,
    });
  };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of ["window", "localStorage"]) {
    if (descriptors[key])
      Object.defineProperty(globalThis, key, descriptors[key]);
    else Reflect.deleteProperty(globalThis, key);
  }
});

test("an unowned legacy manifest is preserved and never displayed to another actor", () => {
  const raw = JSON.stringify([retained]);
  items.set("arcanea-imagine-favorites", raw);
  assert.deepEqual(getFavorites(authority("a")), []);
  assert.deepEqual(getFavorites(authority("b")), []);
  assert.equal(items.get("arcanea-imagine-favorites"), raw);
  assert.equal(calls, 0);
});

test("a saved favorite reopens only for its authenticated actor", async () => {
  await addFavorite(sample, authority("a"));
  assert.equal(getFavorites(authority("a"))[0].prompt, sample.prompt);
  assert.equal(getFavorites(authority("a"))[0].originalUrl, "");
  assert.deepEqual(getFavorites(authority("b")), []);
  assert.equal(isFavorited(sample.id, authority("b")), false);
  assert.equal(calls, 1);
});

test("guest and unresolved authority cannot submit or reveal stored favorites", async () => {
  const scope = createCredentialScope();
  let auth = { scope, token: scope.get() };
  assert.deepEqual(getFavorites(auth), []);
  await assert.rejects(addFavorite(sample, auth), /current account/);
  scope.set("guest");
  auth = { scope, token: scope.get() };
  assert.deepEqual(getFavorites(auth), []);
  await assert.rejects(addFavorite(sample, auth), /current account/);
  assert.equal(calls, 0);
});

for (const returnToA of [false, true])
  test(
    `an old upload cannot retain data after A/B${returnToA ? "/A" : ""}`,
    { timeout: 5000 },
    async () => {
      const auth = authority("a");
      let release!: (response: Response) => void;
      let submitted!: () => void;
      const reached = new Promise<void>((resolve) => {
        submitted = resolve;
      });
      globalThis.fetch = () => {
        calls++;
        submitted();
        return new Promise((resolve) => {
          release = resolve;
        });
      };
      const pending = addFavorite(sample, auth);
      await reached;
      auth.scope.set("user:b");
      const bData = JSON.stringify([retained]);
      items.set(slot("b"), bData);
      if (returnToA) auth.scope.set("user:a");
      release(Response.json({ url: "https://example.invalid/retained.png" }));
      await assert.rejects(pending, /current account/);
      assert.equal(items.get(slot("a")), undefined);
      assert.equal(items.get(slot("b")), bData);
      assert.equal(calls, 1);
    },
  );

for (const status of [401, 503])
  test(`storage HTTP ${status} never marks an expiring original as saved`, async () => {
    globalThis.fetch = async () => {
      calls++;
      return Response.json({ error: "fixture" }, { status });
    };
    await assert.rejects(addFavorite(sample, authority("a")), /not saved/);
    assert.equal(items.size, 0);
  });

test("session-only and unsafe save receipts never produce a favorite", async () => {
  for (const url of [
    null,
    "javascript:fixture",
    "https://name:secret@example.invalid/image.png",
  ]) {
    globalThis.fetch = async () => Response.json({ url });
    await assert.rejects(addFavorite(sample, authority("a")), /not saved/);
  }
  assert.equal(items.size, 0);
});

test("malformed persisted metadata is preserved rather than silently overwritten", async () => {
  items.set(slot("a"), "{broken");
  assert.throws(() => getFavorites(authority("a")), /preserved/);
  await assert.rejects(addFavorite(sample, authority("a")), /preserved/);
  assert.equal(items.get(slot("a")), "{broken");
  assert.equal(calls, 0);
});

test("storage-full and silently discarded writes remain visible failures", async () => {
  const raw = JSON.stringify([retained]);
  items.set(slot("a"), raw);
  const storage = localStorage;
  storage.setItem = () => {
    throw Error("fixture storage full");
  };
  await assert.rejects(
    addFavorite(sample, authority("a")),
    /not be saved locally/,
  );
  assert.equal(items.get(slot("a")), raw);
  storage.setItem = () => {};
  await assert.rejects(
    addFavorite(sample, authority("a")),
    /not be saved locally/,
  );
  assert.equal(items.get(slot("a")), raw);
});

test("removing B's matching ID leaves A's retained record untouched", () => {
  const raw = JSON.stringify([retained]);
  items.set(slot("a"), raw);
  removeFavorite(retained.id, authority("b"));
  assert.equal(items.get(slot("a")), raw);
});

test("an invalid inline image fails before save transport", async () => {
  await assert.rejects(
    addFavorite({ ...sample, data: "malformed===" }, authority("a")),
  );
  assert.equal(calls, 0);
});

test("lost save acknowledgement retries the same content-bound asset identifier", async () => {
  const bodies: Record<string, string>[] = [];
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body));
    bodies.push(body);
    if (bodies.length === 1) throw Error("fixture acknowledgement lost");
    return Response.json({
      ownerId: body.ownerId,
      assetId: body.assetId,
      url: `/api/imagine/assets/${body.assetId}.png`,
    });
  };
  await assert.rejects(addFavorite(sample, authority("a")));
  const saved = await addFavorite(sample, authority("a"));
  assert.equal(bodies[0].assetId, bodies[1].assetId);
  assert.equal(saved.assetId, bodies[1].assetId);
});

test("a successful receipt for another account cannot be retained", async () => {
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body));
    return Response.json({
      ownerId: "b",
      assetId: body.assetId,
      url: `/api/imagine/assets/${body.assetId}.png`,
    });
  };
  await assert.rejects(addFavorite(sample, authority("a")), /not saved/);
  assert.equal(items.size, 0);
});
