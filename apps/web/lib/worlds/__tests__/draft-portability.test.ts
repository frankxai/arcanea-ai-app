import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readStoredWorldDraft,
  WORLD_DRAFT_KEY,
  WORLD_PREVIOUS_DRAFT_KEY,
} from "../draft";
import {
  DraftStorageError,
  MAX_DRAFT_CHARACTERS,
  parseDraftFile,
  persistImportedDraft,
  serializeDraft,
  type PortableDraft,
} from "../draft-portability";

const id = "aaad4508-1165-477b-a644-c9c2c81922a4";
const nextId = "f259e024-a6e9-4f54-b547-901d285377d3";
const draft: PortableDraft = {
  version: 1,
  description: "A library inside a dying star",
  draft_id: id,
  world: {
    name: "The last library",
    slug: "the-last-library",
    tagline: "Memories return home",
    description: "An authored world with a rule, a consequence and a choice.",
    mood: "Quiet",
    elements: [{ name: "Light", domain: "Memory", color: "#ffd700" }],
    laws: [
      {
        name: "The cost",
        description: "Reading costs one memory.\nClosing the book restores it.",
      },
    ],
    systems: [
      {
        name: "Exchange",
        type: "Economy",
        rules: "No memory can be sold twice.",
      },
    ],
    characters: [
      {
        name: "Sélène 星",
        title: "Keeper",
        backstory: "She remembers the first reader.",
        element: "Light",
        origin_class: "Archivist",
        personality: { traits: ["Patient"], voice_style: "Soft" },
      },
    ],
    locations: [
      {
        name: "The hall",
        region: "Core",
        description: "Books orbit a desk.",
        significance: "Where the choice is made.",
      },
    ],
    first_event: {
      title: "Arrival",
      description: "A courier refuses to surrender a memory.",
      era: "First night",
    },
    palette: { primary: "#00bcd4", secondary: "#0d47a1", accent: "#ffd700" },
    image_prompt: "A library inside a dying star",
  },
};
const incoming = { ...draft, draft_id: nextId, description: "A new beginning" };
const conceptKey = "arcanea.world-concept";
function memoryStorage() {
  const map = new Map<string, string>([
    [WORLD_DRAFT_KEY, serializeDraft(draft)],
    [WORLD_PREVIOUS_DRAFT_KEY, "older backup"],
    [conceptKey, "pending concept"],
  ]);
  const storage = {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
  };
  return { map, storage };
}

test("restorable export retains the complete world, concept and retry identity", () => {
  const raw = serializeDraft(draft);
  let allocated = false;
  const restored = parseDraftFile(raw, () => {
    allocated = true;
    return nextId;
  });
  assert.deepEqual(restored, { draft, legacy: false });
  assert.deepEqual(readStoredWorldDraft(raw), draft);
  assert.equal(allocated, false);
  assert.ok(!raw.includes("access_token"));
});

test("older world-only JSON opens as a new copy with an explicit concept fallback", () => {
  const restored = parseDraftFile(JSON.stringify(draft.world), () => nextId);
  assert.equal(restored.legacy, true);
  assert.equal(restored.draft.draft_id, nextId);
  assert.equal(restored.draft.description, draft.world.description);
  assert.deepEqual(restored.draft.world, draft.world);
  assert.equal(readStoredWorldDraft(JSON.stringify(draft.world)), null);
});

test("malformed, unfamiliar, wrong-version and invalid legacy inputs are refused", () => {
  for (const value of [
    null,
    [],
    {},
    { ...draft, version: 2 },
    { ...draft, draft_id: "bad-id" },
    { world: draft.world },
    { ...draft, access_token: "not-a-real-token" },
    { ...draft.world, extra_story: "must not be discarded" },
    {
      ...draft.world,
      characters: [
        {
          ...draft.world.characters[0],
          secret_scene: "preserve in the source file",
        },
      ],
    },
  ]) {
    assert.throws(() => parseDraftFile(JSON.stringify(value), () => nextId));
  }
  assert.throws(
    () => parseDraftFile("{", () => nextId),
    /valid world draft JSON/,
  );
  assert.throws(() =>
    parseDraftFile(JSON.stringify(draft.world), () => "invalid-uuid"),
  );
});

test("raw and normalized exports respect the existing recovery size limit", () => {
  assert.throws(
    () => parseDraftFile(" ".repeat(MAX_DRAFT_CHARACTERS + 1), () => nextId),
    /too large/,
  );
  const large = structuredClone(draft);
  large.world.characters = Array.from({ length: 8 }, () => ({
    name: "Keeper",
    backstory: "a".repeat(12000),
  }));
  large.world.locations = Array.from({ length: 8 }, () => ({
    name: "Hall",
    description: "a".repeat(12000),
  }));
  assert.throws(() => serializeDraft(large), /too large/);
});

test("successful import preserves the displaced complete draft and clears the pending concept", () => {
  const { map, storage } = memoryStorage();
  assert.deepEqual(persistImportedDraft(storage, incoming, draft), draft);
  assert.deepEqual(readStoredWorldDraft(map.get(WORLD_DRAFT_KEY)!), incoming);
  assert.deepEqual(
    readStoredWorldDraft(map.get(WORLD_PREVIOUS_DRAFT_KEY)!),
    draft,
  );
  assert.equal(map.has(conceptKey), false);
});

test("a changed draft with the same identity still gets a backup; an identical import keeps the old backup", () => {
  const { map, storage } = memoryStorage();
  const changed = structuredClone(draft);
  changed.world.laws[0].description = "Reading now costs two memories.";
  assert.deepEqual(persistImportedDraft(storage, changed, draft), draft);
  assert.deepEqual(
    readStoredWorldDraft(map.get(WORLD_PREVIOUS_DRAFT_KEY)!),
    draft,
  );
  map.set(WORLD_PREVIOUS_DRAFT_KEY, "keep this backup");
  assert.equal(persistImportedDraft(storage, changed, changed), null);
  assert.equal(map.get(WORLD_PREVIOUS_DRAFT_KEY), "keep this backup");
});

test("storage read failure or the first failed write leaves every recovery record unchanged", () => {
  for (const operation of ["getItem", "setItem"] as const) {
    const { map, storage } = memoryStorage();
    const before = [...map];
    storage[operation] = () => {
      throw new Error("Storage unavailable");
    };
    assert.throws(
      () => persistImportedDraft(storage, incoming, draft),
      (error) => error instanceof DraftStorageError && !error.rollbackFailed,
    );
    assert.deepEqual([...map], before);
  }
});

test("failure after backup or during concept removal restores all old records", () => {
  for (const failAt of [2, 3]) {
    const { map, storage } = memoryStorage();
    const before = new Map(map);
    let writes = 0;
    const set = storage.setItem;
    const remove = storage.removeItem;
    storage.setItem = (key, value) => {
      if (++writes === failAt) throw new Error("Quota");
      set(key, value);
    };
    storage.removeItem = (key) => {
      if (++writes === failAt) throw new Error("Blocked");
      remove(key);
    };
    assert.throws(
      () => persistImportedDraft(storage, incoming, draft),
      (error) => error instanceof DraftStorageError && !error.rollbackFailed,
    );
    assert.deepEqual(map, before);
  }
});

test("failed rollback is reported honestly while the caller's on-screen draft stays intact", () => {
  const { storage } = memoryStorage();
  const onScreen = structuredClone(draft);
  let writes = 0;
  const set = storage.setItem;
  storage.setItem = (key, value) => {
    if (++writes > 1) throw new Error("Persistent quota");
    set(key, value);
  };
  assert.throws(
    () => persistImportedDraft(storage, incoming, onScreen),
    (error) =>
      error instanceof DraftStorageError &&
      error.rollbackFailed &&
      /export it before leaving/.test(error.message),
  );
  assert.deepEqual(onScreen, draft);
});

test("empty current storage retains the older backup, and validation fails before storage writes", () => {
  const { map, storage } = memoryStorage();
  map.delete(WORLD_DRAFT_KEY);
  assert.equal(persistImportedDraft(storage, incoming, null), null);
  assert.equal(map.get(WORLD_PREVIOUS_DRAFT_KEY), "older backup");
  const before = new Map(map);
  assert.throws(() =>
    persistImportedDraft(
      storage,
      { ...incoming, version: 2 } as unknown as PortableDraft,
      null,
    ),
  );
  assert.deepEqual(map, before);
});
