import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import {
  exportScene,
  persistScene,
  projectSceneResult,
  restoreScene,
  sceneSlot,
  type SceneSession,
} from "../session";

const scene: SceneSession = {
  schema: "arcanea.reading-scene.v1",
  owner: "actor-a",
  source: {
    bookId: "book1",
    bookTitle: "Existing book",
    chapterTitle: "Existing chapter",
    path: "/books/book1/chapter-one",
    chapterHash: "a".repeat(64),
    passage: "The river carried a silver bowl.",
  },
  brief: "Illustrate the silver bowl in the river.",
  model: "provider/model",
  requestKey: randomUUID(),
  result: null,
  creationId: null,
};

test("pending request identity survives reload but never crosses actor or chapter", () => {
  const raw = JSON.stringify(scene);
  assert.equal(
    restoreScene(raw, "actor-a", scene.source.path)?.requestKey,
    scene.requestKey,
  );
  assert.equal(restoreScene(raw, "actor-b", scene.source.path), null);
  assert.equal(restoreScene(raw, "actor-a", "/books/book1/chapter-two"), null);
  assert.notEqual(
    sceneSlot("actor-a", scene.source.path),
    sceneSlot("actor-b", scene.source.path),
  );
});

test("malformed recovery cannot crash image rendering or replace a valid operation", () => {
  assert.equal(restoreScene("{", scene.owner, scene.source.path), null);
  for (const result of [
    { status: "completed", images: [] },
    { status: "completed", images: [null] },
  ])
    assert.equal(
      restoreScene(
        JSON.stringify({ ...scene, result }),
        scene.owner,
        scene.source.path,
      ),
      null,
    );
});

test("generation admission refuses silent storage loss", () => {
  assert.throws(
    () =>
      persistScene(
        {
          setItem() {},
          getItem() {
            return null;
          },
        },
        scene,
      ),
    /could not retain/,
  );
  const slots = new Map<string, string>();
  persistScene(
    {
      setItem(k, v) {
        slots.set(k, v);
      },
      getItem(k) {
        return slots.get(k) ?? null;
      },
    },
    scene,
  );
  assert.equal(
    restoreScene(
      slots.get(sceneSlot(scene.owner, scene.source.path))!,
      scene.owner,
      scene.source.path,
    )?.requestKey,
    scene.requestKey,
  );
});

test("generated and restored results omit runtime billing and image metadata", () => {
  const result = {
    generationId: `gen_${scene.requestKey}`,
    status: "completed" as const,
    provider: "openrouter" as const,
    model: scene.model,
    images: [
      {
        data: "aGVsbG8=",
        mimeType: "image/png",
        prompt: scene.brief,
        providerAccount: "private-provider-account",
      },
    ],
    credits: { action: "image.standard", charged: 5, balance: 917 },
    timing: { durationMs: 101 },
  };
  const projected = projectSceneResult(result);
  assert.deepEqual(Object.keys(projected), [
    "generationId",
    "status",
    "provider",
    "model",
    "images",
  ]);
  assert.deepEqual(projected.images[0], {
    data: "aGVsbG8=",
    mimeType: "image/png",
    prompt: scene.brief,
  });
  const legacy = { ...scene, result, creationId: randomUUID() };
  const restored = restoreScene(
    JSON.stringify(legacy),
    scene.owner,
    scene.source.path,
  );
  assert.deepEqual(restored?.result, projected);
  assert.equal(restored?.creationId, legacy.creationId);
  const slots = new Map<string, string>();
  persistScene(
    {
      setItem(k, v) {
        slots.set(k, v);
      },
      getItem(k) {
        return slots.get(k) ?? null;
      },
    },
    legacy,
  );
  assert.deepEqual(
    JSON.parse(slots.get(sceneSlot(scene.owner, scene.source.path))!).result,
    projected,
  );
});

test("portable exports retain provenance without account or recovery state", () => {
  const result = {
    generationId: `gen_${scene.requestKey}`,
    status: "completed" as const,
    provider: "openrouter" as const,
    model: scene.model,
    images: [{ data: "aGVsbG8=", mimeType: "image/png" }],
    credits: { balance: 917 },
  };
  const internal = {
    ...scene,
    source: { ...scene.source, privateNote: "private source note" },
    result,
    creationId: randomUUID(),
    privateNote: "private session note",
  };
  assert.deepEqual(exportScene(internal), {
    schema: "arcanea.reading-scene-export.v1",
    source: scene.source,
    brief: scene.brief,
    model: scene.model,
    result: {
      status: result.status,
      provider: result.provider,
      model: result.model,
      images: result.images,
    },
  });
  const serialized = JSON.stringify(exportScene(internal));
  assert.equal(serialized.includes(scene.requestKey!), false);
  assert.equal(serialized.includes(internal.creationId), false);
  assert.equal(serialized.includes(scene.owner), false);
  assert.equal(exportScene(scene).result, null);
});
