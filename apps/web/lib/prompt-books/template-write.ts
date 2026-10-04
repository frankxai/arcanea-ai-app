import type { SupabaseClient } from "@supabase/supabase-js";
import type { Template } from "./types";
import { getTemplate } from "./service";
import { canonicalJson } from "./json-values";

// Unacknowledged operations stay private in memory across actor resets. Only
// the verified owner with the same payload can resume one. Never persist them.
const pending = new Map<string, string>();

export async function writePromptTemplate(
  client: SupabaseClient,
  userId: string,
  promptId: string,
  input: Omit<Template, "id" | "useCount" | "createdAt" | "updatedAt">,
  requestId: string,
  assertCurrent: () => void,
): Promise<{ template: Template; acknowledge: () => void }> {
  const key = canonicalJson([userId, promptId, input]);
  const id =
    pending.get(key) ??
    ([...pending.values()].includes(requestId)
      ? crypto.randomUUID()
      : requestId);
  pending.set(key, id);
  assertCurrent();
  const { error } = await client.from("pb_templates").upsert(
    {
      id,
      user_id: userId,
      name: input.name,
      description: input.description,
      category: input.category,
      content: input.content,
      negative_content: input.negativeContent,
      system_prompt: input.systemPrompt,
      prompt_type: input.promptType,
      variables: input.variables,
      context_config: input.contextConfig,
      few_shot_examples: input.fewShotExamples,
      chain_steps: input.chainSteps,
      guardian_id: input.guardianId,
      element: input.element,
      is_public: input.isPublic,
      tags: input.tags,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
  assertCurrent();
  if (error) throw error;
  const template = await getTemplate(client, id);
  assertCurrent();
  if (!template || template.userId !== userId)
    throw new Error("Template not available");
  return {
    template,
    acknowledge: () => {
      if (pending.get(key) === id) pending.delete(key);
    },
  };
}
