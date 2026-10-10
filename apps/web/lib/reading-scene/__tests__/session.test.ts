import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import {
  persistScene,
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
