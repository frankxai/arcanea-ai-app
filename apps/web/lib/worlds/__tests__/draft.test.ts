import { test } from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database/types/supabase";
import {
  saveWorldDraftSchema,
  readStoredWorldDraft,
  worldDraftSchema,
} from "../draft";
import { saveWorldDraft, DraftSaveError } from "../save-draft";

const input = saveWorldDraftSchema.parse({
  draft_id: "aaad4508-1165-477b-a644-c9c2c81922a4",
  world: {
    name: "The last library",
    slug: "the-last-library",
    description: "Exactly the world the creator chose.",
    characters: [{ name: "Mara", backstory: "She records her memories." }],
    locations: [{ name: "Reading room", description: "A thousand mirrors." }],
    laws: [{ name: "The cost", description: "Reading costs one memory." }],
    first_event: { title: "The arrival", description: "The courier lands." },
    image_prompt: "A library inside a dying star",
  },
});

function database() {
  const tables = new Map<string, Map<string, Record<string, unknown>>>();
  let failedTable: string | null = null;
  let thrownTable: string | null = null;
  const db = {
    from(table: string) {
      if (!tables.has(table)) tables.set(table, new Map());
      const rows = tables.get(table)!;
      return {
        async upsert(
          values: Record<string, unknown> | Record<string, unknown>[],
          options: { ignoreDuplicates: boolean; onConflict: string },
        ) {
          assert.equal(options.ignoreDuplicates, true);
          assert.equal(options.onConflict, "id");
          if (table === thrownTable) throw new Error("connection lost");
          if (table === failedTable) return { error: { code: "write_failed" } };
          for (const row of Array.isArray(values) ? values : [values])
            if (!rows.has(row.id as string))
              rows.set(row.id as string, structuredClone(row));
          return { error: null };
        },
        select() {
          const filters = new Map<string, string>();
          const query = {
            eq(key: string, value: string) {
              filters.set(key, value);
              return query;
            },
            async single() {
              const data = [...rows.values()].find((row) =>
                [...filters].every(([key, value]) => row[key] === value),
              );
              return {
                data: data ?? null,
                error: data ? null : { code: "not_found" },
              };
            },
          };
          return query;
        },
      };
    },
  } as unknown as SupabaseClient<Database>;
  return {
    db,
    tables,
    fail(table: string | null) {
      failedTable = table;
    },
    throws(table: string | null) {
      thrownTable = table;
    },
  };
}

test("saves the exact draft and returns the stored canonical slug", async () => {
  const state = database();
  const saved = await saveWorldDraft(state.db, "owner-a", input);
  assert.equal(saved.saved, true);
  assert.notEqual(saved.slug, input.world.slug);
  assert.equal(
    state.tables.get("worlds")!.get(saved.world_id)!.visibility,
    "private",
  );
  const source = [...state.tables.get("world_creations")!.values()][0];
  assert.deepEqual(JSON.parse(source.content as string), input.world);
  assert.equal(source.is_public, false);
  assert.equal(
    [...state.tables.get("world_events")!.values()][0].title,
    "The arrival",
  );
});

test("concurrent retries insert one world and one of each child", async () => {
  const state = database();
  const results = await Promise.all(
    Array.from({ length: 4 }, () => saveWorldDraft(state.db, "owner-a", input)),
  );
  assert.equal(new Set(results.map((result) => result.world_id)).size, 1);
  for (const rows of state.tables.values()) assert.equal(rows.size, 1);
});

for (const table of [
  "worlds",
  "world_creations",
  "world_characters",
  "world_locations",
  "world_events",
]) {
  test(`a ${table} failure is never successful; retry completes the same draft`, async () => {
    const state = database();
    state.fail(table);
    await assert.rejects(
      saveWorldDraft(state.db, "owner-a", input),
      DraftSaveError,
    );
    state.fail(null);
    const saved = await saveWorldDraft(state.db, "owner-a", input);
    assert.equal(saved.saved, true);
    for (const rows of state.tables.values()) assert.equal(rows.size, 1);
  });
}

test("a thrown child transport failure remains retryable", async () => {
  const state = database();
  state.throws("world_locations");
  await assert.rejects(saveWorldDraft(state.db, "owner-a", input));
  state.throws(null);
  await saveWorldDraft(state.db, "owner-a", input);
  for (const rows of state.tables.values()) assert.equal(rows.size, 1);
});

test("owner and payload identity are isolated", async () => {
  const state = database();
  const first = await saveWorldDraft(state.db, "owner-a", input);
  const other = await saveWorldDraft(state.db, "owner-b", input);
  const changed = await saveWorldDraft(state.db, "owner-a", {
    ...input,
    world: { ...input.world, name: "Changed" },
  });
  assert.equal(
    new Set([first.world_id, other.world_id, changed.world_id]).size,
    3,
  );
});

test("a retry preserves edits made to saved records and uses their current URL", async () => {
  const state = database();
  const first = await saveWorldDraft(state.db, "owner-a", input);
  state.tables.get("worlds")!.get(first.world_id)!.slug = "edited-world-url";
  const character = [...state.tables.get("world_characters")!.values()][0];
  character.name = "Creator's edit";
  const retry = await saveWorldDraft(state.db, "owner-a", input);
  assert.equal(retry.slug, "edited-world-url");
  assert.equal(character.name, "Creator's edit");
});

test("validation rejects unsafe slugs, malformed children and excessive payloads", () => {
  assert.equal(
    worldDraftSchema.safeParse({ ...input.world, slug: "../outside" }).success,
    false,
  );
  assert.equal(
    worldDraftSchema.safeParse({ ...input.world, characters: [{ name: 123 }] })
      .success,
    false,
  );
  assert.equal(
    worldDraftSchema.safeParse({
      ...input.world,
      description: "x".repeat(12001),
    }).success,
    false,
  );
  assert.equal(
    saveWorldDraftSchema.safeParse({ ...input, draft_id: "not-an-id" }).success,
    false,
  );
});

test("tab recovery validates the version and keeps the full draft", () => {
  const stored = { version: 1, description: "A library in a star", ...input };
  assert.deepEqual(readStoredWorldDraft(JSON.stringify(stored)), stored);
  assert.equal(readStoredWorldDraft("broken json"), null);
  assert.equal(
    readStoredWorldDraft(JSON.stringify({ ...stored, version: 2 })),
    null,
  );
  assert.equal(readStoredWorldDraft("x".repeat(150001)), null);
});
