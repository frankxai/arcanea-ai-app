import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { createCredentialScope } from "../../ai/provider-preferences";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorited,
  loadFavoritePage,
  changeCloudFavorite,
  readCloudFavorite,
} from "../../imagine-favorites";

const originalFetch = globalThis.fetch;
const descriptors = Object.getOwnPropertyDescriptors(globalThis);
let items: Map<string, string>;
let pendingChanges: Map<string, string>;
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
  pendingChanges = new Map();
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
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => pendingChanges.get(key) ?? null,
      setItem: (key: string, value: string) => pendingChanges.set(key, value),
      removeItem: (key: string) => pendingChanges.delete(key),
    },
  });
  globalThis.fetch = async (_url, options) => {
    calls++;
    const body = JSON.parse(String(options?.body));
    return Response.json({
      ownerId: body.ownerId,
      assetId: body.assetId,
      url: `/api/imagine/assets/${body.assetId}.png`,
      favorited: true,
      favoriteRevision: 0,
    });
  };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of ["window", "localStorage", "sessionStorage"]) {
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
  const saved = await addFavorite(sample, authority("a"));
  assert.match(saved.cacheWarning!, /preserved/);
  assert.equal(items.get(slot("a")), "{broken");
  assert.equal(calls, 1);
});

test("a confirmed cloud save reports browser cache failures without losing older data", async () => {
  const raw = JSON.stringify([retained]);
  items.set(slot("a"), raw);
  const storage = localStorage;
  storage.setItem = () => {
    throw Error("fixture storage full");
  };
  assert.match(
    (await addFavorite(sample, authority("a"))).cacheWarning!,
    /Saved to your account/,
  );
  assert.equal(items.get(slot("a")), raw);
  storage.setItem = () => {};
  assert.match(
    (await addFavorite(sample, authority("a"))).cacheWarning!,
    /Saved to your account/,
  );
  assert.equal(items.get(slot("a")), raw);
});

test("removing B's matching ID leaves A's retained record untouched", async () => {
  const raw = JSON.stringify([retained]);
  items.set(slot("a"), raw);
  await removeFavorite(retained.id, authority("b"));
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
      favorited: true,
      favoriteRevision: 0,
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

const cloudId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const cloudRow = (extra: Record<string, unknown> = {}) => ({
  ...retained,
  id: "cloud-scene",
  ownerId: "a",
  assetId: cloudId,
  url: `/api/imagine/assets/${cloudId}.png`,
  alt: "Private scene",
  provider: null,
  uploadedAt: retained.savedAt,
  updatedAt: "2026-10-11T00:00:00.123456Z",
  favorited: true,
  favoriteRevision: 0,
  operationId: null,
  ...extra,
});
const cloudFavorite = () => ({
  ...retained,
  id: "cloud-scene",
  assetId: cloudId,
  favoriteRevision: 0,
  blobUrl: `/api/imagine/assets/${cloudId}.png`,
});

test("a cleared browser cache reopens account favorites without importing or overwriting legacy data", async () => {
  const legacy = JSON.stringify([retained]);
  items.set("arcanea-imagine-favorites", legacy);
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.match(String(url), /favorites=true/);
    assert.equal(options?.credentials, "same-origin");
    assert.equal(options?.cache, "no-store");
    return Response.json({ ownerId: "a", images: [cloudRow()], next: null });
  };
  const page = await loadFavoritePage(authority("a"));
  assert.equal(page.images[0].assetId, cloudId);
  assert.equal(page.images[0].savedAt, "2026-10-11T00:00:00.123456Z");
  assert.equal(items.size, 1);
  assert.equal(items.get("arcanea-imagine-favorites"), legacy);
  assert.equal(calls, 1);
});

test("microsecond pagination cursors survive transport unchanged", async () => {
  const cursor = { before: "2026-10-11T00:00:00.123456Z", id: cloudId };
  globalThis.fetch = async (url) => {
    const query = new URL(String(url), "https://fixture.invalid").searchParams;
    assert.equal(query.get("before"), cursor.before);
    assert.equal(query.get("id"), cursor.id);
    return Response.json({ ownerId: "a", images: [], next: null });
  };
  assert.deepEqual(await loadFavoritePage(authority("a"), cursor), {
    images: [],
    next: null,
  });
});

test("foreign, removed, duplicated, oversized and unsafe cloud pages fail visibly", async () => {
  for (const page of [
    { ownerId: "b", images: [cloudRow()], next: null },
    { ownerId: "a", images: [cloudRow({ ownerId: "b" })], next: null },
    { ownerId: "a", images: [cloudRow({ favorited: false })], next: null },
    { ownerId: "a", images: [cloudRow(), cloudRow()], next: null },
    {
      ownerId: "a",
      images: Array.from({ length: 51 }, () => cloudRow()),
      next: null,
    },
    {
      ownerId: "a",
      images: [cloudRow({ url: `${cloudFavorite().blobUrl}/extra` })],
      next: null,
    },
    { ownerId: "a", images: [cloudRow({ favoriteRevision: -1 })], next: null },
    { ownerId: "a", images: [], next: { before: "invalid", id: cloudId } },
  ]) {
    globalThis.fetch = async () => Response.json(page);
    await assert.rejects(loadFavoritePage(authority("a")));
  }
  assert.equal(items.size, 0);
});

test("a repeated next cursor cannot loop through a favorite page", async () => {
  const cursor = { before: retained.savedAt, id: cloudId };
  globalThis.fetch = async () =>
    Response.json({ ownerId: "a", images: [], next: cursor });
  await assert.rejects(
    loadFavoritePage(authority("a"), cursor),
    /did not advance/,
  );
});

for (const returnToA of [false, true])
  test(`cloud page completion cannot cross A/B${returnToA ? "/A" : ""}`, async () => {
    const auth = authority("a");
    let release!: (response: Response) => void;
    globalThis.fetch = () =>
      new Promise((resolve) => {
        release = resolve;
      });
    const loading = loadFavoritePage(auth);
    auth.scope.set("user:b");
    if (returnToA) auth.scope.set("user:a");
    release(Response.json({ ownerId: "a", images: [cloudRow()], next: null }));
    await assert.rejects(loading, /current account/);
    assert.equal(items.size, 0);
  });

test("lost favorite-change acknowledgement retries exactly one stable operation", async () => {
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), cloudFavorite().blobUrl);
    assert.equal(options?.method, "PATCH");
    const body = JSON.parse(String(options?.body));
    bodies.push(body);
    if (bodies.length === 1) throw Error("fixture acknowledgement lost");
    return Response.json(
      cloudRow({
        favorited: false,
        favoriteRevision: 1,
        operationId: body.operationId,
      }),
    );
  };
  await assert.rejects(
    changeCloudFavorite(cloudFavorite(), false, authority("a")),
  );
  assert.equal(pendingChanges.size, 1);
  const changed = await changeCloudFavorite(
    cloudFavorite(),
    false,
    authority("a"),
  );
  assert.deepEqual(bodies[0], bodies[1]);
  assert.equal(changed.favoriteRevision, 1);
  assert.equal(pendingChanges.size, 0);
});

test("a cloud favorite can be removed with no local manifest while its private asset stays retained", async () => {
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body));
    assert.equal(body.favorited, false);
    return Response.json(
      cloudRow({
        favorited: false,
        favoriteRevision: 1,
        operationId: body.operationId,
      }),
    );
  };
  const result = await removeFavorite(cloudFavorite(), authority("a"));
  assert.equal(result.cacheWarning, null);
  assert.deepEqual(getFavorites(authority("a")), []);
});

test("a rejected stale revision preserves the cached favorite and clears only the rejected operation", async () => {
  const raw = JSON.stringify([cloudFavorite()]);
  items.set(slot("a"), raw);
  globalThis.fetch = async () =>
    Response.json({ error: "conflict" }, { status: 409 });
  await assert.rejects(
    removeFavorite(cloudFavorite(), authority("a")),
    /changed elsewhere/,
  );
  assert.equal(items.get(slot("a")), raw);
  assert.equal(pendingChanges.size, 0);
});

test("missing or discarded session storage prevents a mutation before transport", async () => {
  for (const write of [
    () => {
      throw Error("unavailable");
    },
    () => {},
  ]) {
    sessionStorage.setItem = write;
    globalThis.fetch = async () => {
      calls++;
      throw Error("unexpected transport");
    };
    await assert.rejects(
      changeCloudFavorite(cloudFavorite(), false, authority("a")),
      /session storage/,
    );
  }
  assert.equal(calls, 0);
});

test("mismatched owner, revision, operation and private URL leave the mutation unconfirmed", async () => {
  for (const extra of [
    { ownerId: "b" },
    { favoriteRevision: 2 },
    { operationId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    { url: "https://fixture.invalid/asset.png" },
  ]) {
    globalThis.fetch = async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      return Response.json(
        cloudRow({
          favorited: false,
          favoriteRevision: 1,
          operationId: body.operationId,
          ...extra,
        }),
      );
    };
    await assert.rejects(
      changeCloudFavorite(cloudFavorite(), false, authority("a")),
    );
    assert.equal(pendingChanges.size, 1);
  }
});

test("legacy private cache metadata is refreshed before a cloud mutation", async () => {
  const methods: string[] = [];
  const favorite = { ...cloudFavorite(), favoriteRevision: undefined };
  globalThis.fetch = async (url, options) => {
    methods.push(options?.method ?? "GET");
    if (options?.method !== "PATCH") {
      assert.equal(String(url), `${favorite.blobUrl}?metadata=1`);
      return Response.json(cloudRow({ favorited: false, favoriteRevision: 3 }));
    }
    const body = JSON.parse(String(options.body));
    assert.equal(body.revision, 3);
    return Response.json(
      cloudRow({ favoriteRevision: 4, operationId: body.operationId }),
    );
  };
  assert.equal(
    (await changeCloudFavorite(favorite, true, authority("a")))
      .favoriteRevision,
    4,
  );
  assert.deepEqual(methods, ["GET", "PATCH"]);
});

test("private metadata reports removed state and rejects malformed local handles without transport", async () => {
  globalThis.fetch = async () => {
    calls++;
    return Response.json(cloudRow({ favorited: false }));
  };
  assert.equal(
    (await readCloudFavorite(cloudFavorite(), authority("a"))).favorited,
    false,
  );
  await assert.rejects(
    readCloudFavorite(
      { ...cloudFavorite(), blobUrl: `${cloudFavorite().blobUrl}/extra` },
      authority("a"),
    ),
  );
  assert.equal(calls, 1);
});

test("confirmed cloud removal preserves unreadable browser bookmarks and returns a warning", async () => {
  items.set(slot("a"), "{broken");
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body));
    return Response.json(
      cloudRow({
        favorited: false,
        favoriteRevision: 1,
        operationId: body.operationId,
      }),
    );
  };
  assert.match(
    (await removeFavorite(cloudFavorite(), authority("a"))).cacheWarning!,
    /removed.*preserved/,
  );
  assert.equal(items.get(slot("a")), "{broken");
});

for (const returnToA of [false, true])
  test(`favorite mutation completion cannot cross A/B${returnToA ? "/A" : ""}`, async () => {
    const auth = authority("a");
    let release!: (response: Response) => void;
    let body: Record<string, unknown>;
    globalThis.fetch = (_url, options) => {
      body = JSON.parse(String(options?.body));
      return new Promise((resolve) => {
        release = resolve;
      });
    };
    const changing = removeFavorite(cloudFavorite(), auth);
    auth.scope.set("user:b");
    if (returnToA) auth.scope.set("user:a");
    release(
      Response.json(
        cloudRow({
          favorited: false,
          favoriteRevision: 1,
          operationId: body!.operationId,
        }),
      ),
    );
    await assert.rejects(changing, /current account/);
    assert.equal(items.size, 0);
    assert.equal(pendingChanges.size, 1);
  });
