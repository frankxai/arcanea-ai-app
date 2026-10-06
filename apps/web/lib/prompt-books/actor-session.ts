import type { SupabaseClient } from "@supabase/supabase-js";
import type { PromptBooksState } from "./store-state";
import * as service from "./service";
import { writePromptDraft, PromptDraftConflict } from "./draft-write";
import { comparePromptRevisions } from "./revisions";
import type { UpdatePromptInput } from "./types";

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

// Queue by owner and prompt across session generations. Confirm each actor after waiting;
// a failed/stale operation cannot strand later edits or change another session.
const tagWrites = new Map<string, Promise<void>>();

export function changePromptTag(
  read: () => PromptBooksState,
  id: string,
  tagId: string,
  assigned: boolean,
): Promise<void> {
  const { _client: client, _userId: userId, _sessionVersion: version } = read();
  if (!client || !userId) return Promise.reject(new Error("Not initialized"));
  const key = JSON.stringify([userId, id]);
  const previous = tagWrites.get(key) ?? Promise.resolve();
  const writing = previous
    .catch(() => undefined)
    .then(async () => {
      assertActor(read, client, userId, version);
      await actor(read);
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
      const tags = await service.listTags(client, userId);
      assertActor(read, client, userId, version);
      const { data: assignments, error } = await client
        .from("pb_prompt_tags")
        .select("tag_id")
        .eq("prompt_id", id);
      if (error) throw error;
      assertActor(read, client, userId, version);
      const ids = new Set((assignments ?? []).map((row) => row.tag_id));
      const current = read().prompts.find((row) => row.id === id);
      if (current)
        read().updatePromptInStore({
          ...current,
          tags: tags.filter((tag) => tag.userId === userId && ids.has(tag.id)),
        });
    });
  tagWrites.set(key, writing);
  return writing.finally(() => {
    if (tagWrites.get(key) === writing) tagWrites.delete(key);
  });
}

// Both successful responses and a fetched conflicting row are authoritative
// cache evidence after the actor guard. A lost write acknowledgement can then
// confirm its matching draft and immediately create a template from that cache.
export async function updateOwnedPrompt(
  read: () => PromptBooksState,
  id: string,
  input: UpdatePromptInput,
  expectedUpdatedAt?: string,
) {
  const { client, userId, version } = await actor(read);

  let prompt;
  try {
    prompt = expectedUpdatedAt
      ? await writePromptDraft(client, userId, id, input, expectedUpdatedAt)
      : await service.updatePrompt(client, id, input);
  } catch (error) {
    assertActor(read, client, userId, version);
    if (
      error instanceof PromptDraftConflict &&
      error.current.userId === userId
    ) {
      read().updatePromptInStore(error.current);
      const latest = read().prompts.find((row) => row.id === id);
      throw new PromptDraftConflict(latest ?? error.current);
    }
    throw error;
  }
  assertActor(read, client, userId, version);
  if (prompt.userId !== userId)
    throw new Error("Unexpected Prompt Books owner");
  const cached = read().prompts.find((row) => row.id === id);
  if (
    expectedUpdatedAt &&
    cached &&
    (comparePromptRevisions(prompt.updatedAt, cached.updatedAt) ?? -1) < 0
  )
    throw new PromptDraftConflict(cached);
  read().updatePromptInStore(prompt);
  return prompt;
}
