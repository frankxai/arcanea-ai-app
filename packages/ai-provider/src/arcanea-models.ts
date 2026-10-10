/**
 * Arcanea Curated Model IDs
 *
 * These are the model identifiers accepted by the Arcanea Gateway.
 * Each maps to a backend provider model.
 */

export type ArcaneaModelId =
  // Frontier Reasoning (8)
  | "arcanea-opus" // Claude Opus 4.6 — reasoning, writing, code
  | "arcanea-sonnet" // Claude Sonnet 4.6 — reasoning, writing, code
  | "arcanea-gpt5" // GPT-5.2 Pro — math, reasoning
  | "arcanea-gemini-pro" // Gemini 3.1 Pro Preview — multimodal reasoning
  | "arcanea-grok" // Grok 4.20 — reasoning, creative writing
  | "arcanea-deepseek-r1" // DeepSeek R1 — Transparent reasoning
  | "arcanea-kimi" // Kimi K2.5 — agentic tool use
  | "arcanea-deepseek" // DeepSeek V3.2 — low cost
  // Performance (5)
  | "arcanea-haiku" // Claude Haiku 4.5 — fast, lower cost
  | "arcanea-gemini-flash" // Gemini 2.5 Flash — 1M ctx, image output
  | "arcanea-qwen" // Qwen 3 235B on Cerebras — low latency
  | "arcanea-maverick" // Llama 4 Maverick — open-weight, on Groq
  | "arcanea-mistral" // Mistral Large — EU-based provider
  // Low Latency (3)
  | "arcanea-bolt" // Cerebras 8B — low latency
  | "arcanea-thunder" // Cerebras 70B — low latency
  | "arcanea-lightning" // Groq 8B — low latency
  // Image Generation (5)
  | "arcanea-flux-pro" // Flux 2 Pro — photorealism
  | "arcanea-dalle" // DALL-E 3 — complex prompts
  | "arcanea-imagen" // Imagen 4 — text in images
  | "arcanea-ideogram" // Ideogram V3 — logos/typography
  | "arcanea-recraft" // Recraft V3 SVG — SVG vector output
  // Video Generation (3)
  | "arcanea-veo" // Veo 3.1 — video + audio
  | "arcanea-sora" // Sora 2 — narrative video + audio
  | "arcanea-kling" // Kling 2.6 — lower-cost video
  // Audio (1)
  | "arcanea-whisper" // Whisper V3 Turbo — transcription on Groq
  // Smart Routing (1)
  | "arcanea-auto" // Auto-select a model for the task
  | (string & {}); // Allow custom model IDs (passthrough)

/** Human-readable model descriptions */
export const ARCANEA_MODELS: Record<string, string> = {
  "arcanea-opus": "Claude Opus 4.6 — Reasoning, long-form writing and code.",
  "arcanea-sonnet":
    "Claude Sonnet 4.6 — Reasoning, writing and code at a lower price than Opus.",
  "arcanea-gpt5": "GPT-5.2 Pro — Mathematics, reasoning and code.",
  "arcanea-gemini-pro":
    "Gemini 3.1 Pro Preview — Reasoning across text, images and video. 1M ctx.",
  "arcanea-grok": "Grok 4.20 — Reasoning and creative writing.",
  "arcanea-deepseek-r1":
    "DeepSeek R1 — Transparent chain-of-thought. See the reasoning process.",
  "arcanea-kimi":
    "Kimi K2.5 — Open-weight model for agentic, tool-calling workflows.",
  "arcanea-deepseek":
    "DeepSeek V3.2 — Low-cost model for reasoning, code and writing.",
  "arcanea-haiku": "Claude Haiku 4.5 — Fast, lower-cost responses.",
  "arcanea-gemini-flash":
    "Gemini 2.5 Flash — Fast multimodal model with image output. 1M context.",
  "arcanea-qwen":
    "Qwen 3 235B on Cerebras — Reasoning, code and writing with low latency.",
  "arcanea-maverick": "Llama 4 Maverick — Open-weight model on Groq.",
  "arcanea-mistral":
    "Mistral Large — EU-based provider. Structured output and multilingual text.",
  "arcanea-bolt": "Cerebras 8B — Low latency for short tasks.",
  "arcanea-thunder": "Cerebras 70B — Low-latency general model.",
  "arcanea-lightning": "Groq 8B — Low latency for voice and chat.",
  "arcanea-flux-pro": "Flux 2 Pro — Photorealistic image generation.",
  "arcanea-dalle":
    "DALL-E 3 — Complex multi-element scenes from detailed prompts.",
  "arcanea-imagen": "Imagen 4 — Image generation, including text in images.",
  "arcanea-ideogram": "Ideogram V3 — Logos, typography and brand design.",
  "arcanea-recraft": "Recraft V3 SVG — Editable SVG vector graphics.",
  "arcanea-veo": "Veo 3.1 — Video generation with native audio.",
  "arcanea-sora": "Sora 2 — Narrative video with dialogue and native audio.",
  "arcanea-kling": "Kling 2.6 — Lower-cost video generation.",
  "arcanea-whisper": "Whisper V3 Turbo — Speech-to-text transcription on Groq.",
  "arcanea-auto": "Smart Router — Picks a model for your task.",
};
