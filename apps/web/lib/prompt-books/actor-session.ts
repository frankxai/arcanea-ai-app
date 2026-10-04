import type { SupabaseClient } from "@supabase/supabase-js";
import type { PromptBooksState } from "./store-state";
import * as service from "./service";

type ReadActor = () => Pick<
  PromptBooksState,
  "_client" | "_userId" | "_sessionVersion"
>;

export function currentActor(
  read: ReadActor,
  client: SupabaseClient,
  userId: string,
  version: number,
) {
  const state = read();
  return (
    state._client === client &&
    state._userId === userId &&
    state._sessionVersion === version
  );
}

export function assertActor(
  read: ReadActor,
  client: SupabaseClient,
  userId: string,
  version: number,
) {
  if (!currentActor(read, client, userId, version))
    throw new Error("Prompt Books identity changed");
}

export async function actor(read: ReadActor) {
  const { _client: client, _userId: userId, _sessionVersion: version } = read();
  if (!client || !userId) throw new Error("Not initialized");
  const verified = await client.auth.getUser();
  if (verified.error || verified.data.user?.id !== userId)
    throw new Error("Prompt Books identity changed");
  assertActor(read, client, userId, version);
  return { client, userId, version };
}

export async function changePromptTag(
  read: () => PromptBooksState,
  id: string,
  tagId: string,
  assigned: boolean,
) {
  const { client, userId, version } = await actor(read);
  if (
    !read().prompts.some((row) => row.id === id && row.userId === userId) ||
    !read().tags.some((row) => row.id === tagId && row.userId === userId)
  )
    throw new Error("Prompt or tag not available");
  if (assigned) {
    const { error } = await client
      .from("pb_prompt_tags")
      .upsert(
        { prompt_id: id, tag_id: tagId },
        { onConflict: "prompt_id,tag_id", ignoreDuplicates: true },
      );
    if (error) throw error;
  } else await service.removeTagFromPrompt(client, id, tagId);
  assertActor(read, client, userId, version);
  const { data: assignments, error } = await client
    .from("pb_prompt_tags")
    .select("tag_id")
    .eq("prompt_id", id);
  if (error) throw error;
  const tags = await service.listTags(client, userId);
  assertActor(read, client, userId, version);
  const ids = new Set((assignments ?? []).map((row) => row.tag_id));
  const current = read().prompts.find((row) => row.id === id);
  if (current)
    read().updatePromptInStore({
      ...current,
      tags: tags.filter((tag) => tag.userId === userId && ids.has(tag.id)),
    });
}
