/**
 * Claude safeguard handling for AI SDK call sites.
 *
 * Claude 5.x safety classifiers can decline a request: HTTP 200 with
 * `stop_reason: "refusal"`, which @ai-sdk/anthropic surfaces as
 * `finishReason: "content-filter"` (Gemini safety blocks map to the same
 * value). Two layers handle it:
 *
 *   1. Server-side fallback — Opus 5 / 5.5, Sonnet 5.5 and Fable 5.1 accept
 *      `fallbacks: "default"`, which re-runs a declined request on the model
 *      Anthropic recommends for that refusal category. The provider adds the
 *      `server-side-fallback-2026-07-01` beta header itself. Haiku 5.5 has no
 *      server-side fallback, so it gets nothing.
 *   2. A visible notice — when the whole chain still refuses, the stream would
 *      otherwise end with no text. `refusalNoticeTransform` appends a short
 *      explanation so the creator sees why.
 */

import type {
  FinishReason,
  StreamTextTransform,
  TextStreamPart,
  ToolSet,
} from "ai";
import { claudeSupportsServerFallback } from "@/lib/gateway/catalog";

export const REFUSAL_NOTICE =
  "The model's safety checks declined this request. Rephrase it and try again.";

/** True when a generation ended because a safety classifier declined it. */
export function isRefusal(finishReason: FinishReason | undefined): boolean {
  return finishReason === "content-filter";
}

/**
 * `providerOptions.anthropic` fields that opt a request into server-side
 * refusal fallback. Empty for models without one (Haiku 5.5, older Claude,
 * OpenRouter slugs), so it is safe to spread unconditionally.
 */
export function claudeFallbackOptions(
  modelId: string,
): { fallbacks: "default" } | Record<string, never> {
  return claudeSupportsServerFallback(modelId) ? { fallbacks: "default" } : {};
}

/**
 * `streamText` transform that inserts REFUSAL_NOTICE as its own text part
 * whenever a step finishes on a refusal.
 */
export function refusalNoticeTransform<
  TOOLS extends ToolSet,
>(): StreamTextTransform<TOOLS> {
  return () => {
    let notices = 0;
    return new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(part, controller) {
        if (part.type === "finish-step" && isRefusal(part.finishReason)) {
          const id = `refusal-notice-${notices++}`;
          controller.enqueue({ type: "text-start", id });
          controller.enqueue({ type: "text-delta", id, text: REFUSAL_NOTICE });
          controller.enqueue({ type: "text-end", id });
        }
        controller.enqueue(part);
      },
    });
  };
}
