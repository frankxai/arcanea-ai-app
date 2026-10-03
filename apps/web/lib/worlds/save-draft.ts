import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/types/supabase";
import type { SaveWorldDraft } from "./draft";

// Stable, owner-scoped IDs make each insert retryable. Payload identity prevents
// a changed draft from overwriting a previously saved world or its later edits.
export function draftRecordId(value: string) {
  const hash = createHash("sha256").update(value).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export class DraftSaveError extends Error {
  constructor() {
    super(
      "Saving is incomplete. A private partial world may exist in your account. Your full draft is still here; retry to finish saving the same world.",
    );
  }
}

export async function saveWorldDraft(
  db: SupabaseClient<Database>,
  owner: string,
  input: SaveWorldDraft,
) {
  const draft = input.world;
  const id = draftRecordId(
    `${owner}:${input.draft_id}:${JSON.stringify(draft)}`,
  );
  const slug = `${draft.slug}-${id}`;
  const childId = (kind: string, index: number) =>
    draftRecordId(`${id}:${kind}:${index}`);
  const options = { onConflict: "id", ignoreDuplicates: true } as const;
  const root = await db.from("worlds").upsert(
    {
      id,
      creator_id: owner,
      slug,
      name: draft.name,
      tagline: draft.tagline,
      description: draft.description,
      mood: draft.mood,
      elements: draft.elements,
      laws: draft.laws,
      systems: draft.systems,
      palette: draft.palette,
      visibility: "private",
    },
    options,
  );
  if (root.error) throw new DraftSaveError();

  const existing = await db
    .from("worlds")
    .select("id,slug")
    .eq("id", id)
    .eq("creator_id", owner)
    .single();
  if (existing.error || !existing.data) throw new DraftSaveError();

  // Keep the complete input before projecting individual records. This retains
  // the art prompt and founding event as well as all fields shown in the preview.
  // These are retryable writes, not a transaction: a failure can leave a private
  // partial world. Never report saved until every write has succeeded.
  const source = await db.from("world_creations").upsert(
    {
      id: childId("source", 0),
      world_id: id,
      creator_id: owner,
      title: "Original world draft",
      type: "document",
      content: JSON.stringify(draft, null, 2),
      prompt: draft.image_prompt,
      is_public: false,
    },
    options,
  );
  if (source.error) throw new DraftSaveError();

  if (draft.characters.length) {
    const result = await db.from("world_characters").upsert(
      draft.characters.map((character, index) => ({
        ...character,
        id: childId("character", index),
        world_id: id,
        personality: character.personality ?? {},
      })),
      options,
    );
    if (result.error) throw new DraftSaveError();
  }
  if (draft.locations.length) {
    const result = await db.from("world_locations").upsert(
      draft.locations.map((location, index) => ({
        ...location,
        id: childId("location", index),
        world_id: id,
      })),
      options,
    );
    if (result.error) throw new DraftSaveError();
  }
  if (draft.first_event) {
    const result = await db.from("world_events").upsert(
      {
        ...draft.first_event,
        id: childId("event", 0),
        world_id: id,
        sort_order: 0,
      },
      options,
    );
    if (result.error) throw new DraftSaveError();
  }
  return {
    saved: true as const,
    world_id: existing.data.id,
    slug: existing.data.slug,
  };
}
