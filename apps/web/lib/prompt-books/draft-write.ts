import type { SupabaseClient } from "@supabase/supabase-js";
import type { Prompt, UpdatePromptInput } from "./types";
import { getPrompt } from "./service";

export class PromptDraftConflict extends Error {
  constructor(readonly current: Prompt) {
    super("A newer prompt revision is available");
  }
}

export async function writePromptDraft(
  client: SupabaseClient,
  userId: string,
  id: string,
  input: UpdatePromptInput,
  expectedUpdatedAt: string,
): Promise<Prompt> {
  const { data, error } = await client
    .from("pb_prompts")
    .update({
      title: input.title,
      content: input.content,
      negative_content: input.negativeContent,
      system_prompt: input.systemPrompt,
      prompt_type: input.promptType,
      context_config: input.contextConfig,
      few_shot_examples: input.fewShotExamples,
      chain_steps: input.chainSteps,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("updated_at", expectedUpdatedAt)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  const current = await getPrompt(client, id);
  if (!current || current.userId !== userId)
    throw new Error("Prompt not available");
  if (!data) throw new PromptDraftConflict(current);
  return current;
}
