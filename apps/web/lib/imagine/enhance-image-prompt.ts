import { generateText } from "ai";
import {
  platformDefaultModelId,
  platformGatewayAvailable,
  platformGatewayOptions,
  platformLanguageModel,
} from "@/lib/ai/platform-gateway";

/** Optional server-side enhancement. Call only inside admitted provider work. */
export async function enhanceImagePrompt(prompt: string): Promise<string> {
  if (!platformGatewayAvailable()) return prompt;
  try {
    const { text } = await generateText({
      model: platformLanguageModel(platformDefaultModelId()),
      abortSignal: AbortSignal.timeout(10000),
      maxOutputTokens: 600,
      temperature: 0.85,
      system:
        'Rewrite the image prompt with specific composition, lighting and texture. Return JSON with an "enhanced" string under 2000 characters.',
      prompt,
      providerOptions: platformGatewayOptions("imagine-prompt"),
    });
    if (typeof text !== "string" || text.length > 10000) return prompt;
    const json = text.match(/\{[\s\S]*\}/)?.[0] ?? text;
    const enhanced: unknown = JSON.parse(json).enhanced;
    return typeof enhanced === "string" &&
      enhanced.trim() &&
      enhanced.length <= 2000
      ? enhanced
      : prompt;
  } catch {
    return prompt;
  }
}
