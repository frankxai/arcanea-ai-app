/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Arcanea Intelligence Gateway — Curated Model Catalog
 *
 * The models the gateway can route to, grouped by use. Descriptions say
 * what each model is for. They carry no rankings or benchmark scores.
 */

import type { CuratedModel, ProviderId, ProviderConfig } from "./types";

// ─── Provider Registry ───────────────────────────────────────────────

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    authHeader: "x-api-key",
    envKey: "ANTHROPIC_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "anthropic",
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    authHeader: "Authorization",
    envKey: "OPENAI_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "openai",
  },
  google: {
    id: "google",
    name: "Google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    authHeader: "x-goog-api-key",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "google",
  },
  xai: {
    id: "xai",
    name: "xAI",
    baseUrl: "https://api.x.ai/v1",
    authHeader: "Authorization",
    envKey: "XAI_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "openai",
  },
  groq: {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    authHeader: "Authorization",
    envKey: "GROQ_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: "openai",
  },
  cerebras: {
    id: "cerebras",
    name: "Cerebras",
    baseUrl: "https://api.cerebras.ai/v1",
    authHeader: "Authorization",
    envKey: "CEREBRAS_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: "openai",
  },
  sambanova: {
    id: "sambanova",
    name: "SambaNova",
    baseUrl: "https://api.sambanova.ai/v1",
    authHeader: "Authorization",
    envKey: "SAMBANOVA_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: "openai",
  },
  replicate: {
    id: "replicate",
    name: "Replicate",
    baseUrl: "https://api.replicate.com/v1",
    authHeader: "Authorization",
    envKey: "REPLICATE_API_TOKEN",
    supportsStreaming: true,
    supportsTools: false,
    supportsVision: true,
    format: "openai",
  },
  together: {
    id: "together",
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    authHeader: "Authorization",
    envKey: "TOGETHER_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "openai",
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    authHeader: "Authorization",
    envKey: "DEEPSEEK_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: "openai",
  },
  moonshot: {
    id: "moonshot",
    name: "Moonshot (Kimi)",
    baseUrl: "https://api.moonshot.ai/v1",
    authHeader: "Authorization",
    envKey: "MOONSHOT_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: "openai",
  },
  mistral: {
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    authHeader: "Authorization",
    envKey: "MISTRAL_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "openai",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    authHeader: "Authorization",
    envKey: "OPENROUTER_API_KEY",
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: "openai",
  },
};

// ─── THE CURATED CATALOG ─────────────────────────────────────────────

export const CURATED_MODELS: CuratedModel[] = [
  // ═══════════════════════════════════════════════════════════════════
  //  FRONTIER REASONING — Reasoning, writing and code
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "arcanea-opus",
    name: "Arcanea Opus",
    description:
      "Anthropic Claude Opus 4.6. Reasoning, long-form writing and code.",
    provider: "anthropic",
    providerModelId: "claude-opus-4-6",
    category: ["reasoning", "creative", "code"],
    tier: "frontier",
    contextWindow: 200000,
    maxOutput: 32000,
    inputPrice: 5,
    outputPrice: 25,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2026-02-04",
    curatorNote: "Coding, long-form creative work and multi-step reasoning.",
  },
  {
    id: "arcanea-sonnet",
    name: "Arcanea Sonnet",
    description:
      "Anthropic Claude Sonnet 4.6. Reasoning, writing and code at a lower price than Opus.",
    provider: "anthropic",
    providerModelId: "claude-sonnet-4-6",
    category: ["reasoning", "creative", "code"],
    tier: "frontier",
    contextWindow: 200000,
    maxOutput: 16000,
    inputPrice: 3,
    outputPrice: 15,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2026-02-04",
    curatorNote: "General-purpose writing, reasoning and code.",
  },
  {
    id: "arcanea-gpt5",
    name: "Arcanea GPT-5",
    description: "OpenAI GPT-5.2 Pro. Mathematics, reasoning and code.",
    provider: "openai",
    providerModelId: "gpt-5.2-pro",
    category: ["reasoning", "code"],
    tier: "frontier",
    contextWindow: 400000,
    maxOutput: 32768,
    inputPrice: 1.75,
    outputPrice: 14,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2025-12-10",
    curatorNote: "Math, multi-step reasoning and structured output.",
  },
  {
    id: "arcanea-gemini-pro",
    name: "Arcanea Gemini Pro",
    description:
      "Google Gemini 3.1 Pro Preview. Reasoning across text, images and video. 1M context.",
    provider: "google",
    providerModelId: "gemini-3.1-pro-preview",
    category: ["reasoning", "vision", "code"],
    tier: "frontier",
    contextWindow: 1000000,
    maxOutput: 65536,
    inputPrice: 2,
    outputPrice: 12,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2026-02-19",
    curatorNote: "Long documents, video and multimodal input. 1M context.",
  },
  {
    id: "arcanea-grok",
    name: "Arcanea Grok",
    description: "xAI Grok 4.20. Reasoning and creative writing.",
    provider: "xai",
    providerModelId: "grok-4.20",
    category: ["reasoning", "creative"],
    tier: "frontier",
    contextWindow: 256000,
    maxOutput: 16384,
    inputPrice: 3,
    outputPrice: 15,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2026-02-17",
    curatorNote: "Reasoning and creative writing.",
  },
  {
    id: "arcanea-deepseek-r1",
    name: "Arcanea DeepSeek R1",
    description:
      "DeepSeek R1. Reasoning model that shows its chain of thought.",
    provider: "deepseek",
    providerModelId: "deepseek-reasoner",
    category: ["reasoning", "code"],
    tier: "frontier",
    contextWindow: 128000,
    maxOutput: 32768,
    inputPrice: 0.55,
    outputPrice: 2.19,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2025-01-20",
    curatorNote: "Shows its thinking process alongside the answer.",
  },
  {
    id: "arcanea-kimi",
    name: "Arcanea Kimi",
    description:
      "Moonshot Kimi K2.5. Open-weight model for agentic, tool-calling workflows.",
    provider: "moonshot",
    providerModelId: "kimi-k2.5",
    category: ["reasoning", "code"],
    tier: "frontier",
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.6,
    outputPrice: 2.5,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2025-07-01",
    curatorNote: "Agentic workflows with tool calls. Open-weight.",
  },
  {
    id: "arcanea-deepseek",
    name: "Arcanea DeepSeek V3",
    description: "DeepSeek V3. Low-cost model for reasoning, code and writing.",
    provider: "deepseek",
    providerModelId: "deepseek-chat",
    category: ["reasoning", "code", "creative"],
    tier: "frontier",
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.27,
    outputPrice: 1.1,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: "2025-12-01",
    curatorNote: "Low-cost option for reasoning, code and drafting.",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  PERFORMANCE — Lower cost and latency
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "arcanea-haiku",
    name: "Arcanea Haiku",
    description: "Anthropic Claude Haiku 4.5. Fast, lower-cost responses.",
    provider: "anthropic",
    providerModelId: "claude-haiku-4-5-20251001",
    category: ["fast", "code"],
    tier: "performance",
    contextWindow: 200000,
    maxOutput: 8192,
    inputPrice: 0.8,
    outputPrice: 4,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "Real-time apps, chatbots and quick tasks.",
  },
  {
    id: "arcanea-gemini-flash",
    name: "Arcanea Flash",
    description:
      "Google Gemini 2.5 Flash. Fast multimodal model with image output. 1M context.",
    provider: "google",
    providerModelId: "gemini-2.5-flash",
    category: ["fast", "vision", "creative"],
    tier: "performance",
    contextWindow: 1000000,
    maxOutput: 65536,
    inputPrice: 0.15,
    outputPrice: 0.6,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    supportsImageOutput: true,
    curatorNote: "Multimodal input and image generation. 1M context.",
  },
  {
    id: "arcanea-qwen",
    name: "Arcanea Qwen",
    description:
      "Qwen 3 235B on Cerebras. Reasoning, code and writing with low latency.",
    provider: "cerebras",
    providerModelId: "qwen-3-235b-a22b-instruct-2507",
    category: ["reasoning", "code", "creative"],
    tier: "performance",
    contextWindow: 131072,
    maxOutput: 16384,
    inputPrice: 0.6,
    outputPrice: 1.2,
    tokensPerSecond: 1400,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "Qwen 3 235B served on Cerebras hardware for fast responses.",
  },
  {
    id: "arcanea-maverick",
    name: "Arcanea Maverick",
    description:
      "Meta Llama 4 Maverick on Groq. Open-weight model for writing and code.",
    provider: "groq",
    providerModelId: "meta-llama/llama-4-maverick-17b-128e-instruct",
    category: ["creative", "code"],
    tier: "performance",
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.2,
    outputPrice: 0.6,
    tokensPerSecond: 562,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "Open-weight model served on Groq hardware.",
  },
  {
    id: "arcanea-mistral",
    name: "Arcanea Mistral",
    description:
      "Mistral Large from Mistral AI, an EU-based provider. Structured output and multilingual text.",
    provider: "mistral",
    providerModelId: "mistral-large-2512",
    category: ["reasoning", "code"],
    tier: "performance",
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.5,
    outputPrice: 1.5,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "EU-based provider. Structured output and multilingual work.",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  LOW LATENCY — Small models on fast inference hardware
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "arcanea-bolt",
    name: "Arcanea Bolt",
    description: "Llama 3.1 8B on Cerebras. Low latency for short tasks.",
    provider: "cerebras",
    providerModelId: "llama3.1-8b",
    category: ["fast"],
    tier: "speed",
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.1,
    outputPrice: 0.1,
    tokensPerSecond: 2200,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "Chat, summaries and quick transforms.",
  },
  {
    id: "arcanea-thunder",
    name: "Arcanea Thunder",
    description: "Llama 3.3 70B on Cerebras. Low-latency general model.",
    provider: "cerebras",
    providerModelId: "llama3.3-70b",
    category: ["fast", "reasoning"],
    tier: "speed",
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.6,
    outputPrice: 0.6,
    tokensPerSecond: 450,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "General tasks that need fast responses.",
  },
  {
    id: "arcanea-lightning",
    name: "Arcanea Lightning",
    description: "Llama 3.1 8B on Groq. Low latency for voice and chat.",
    provider: "groq",
    providerModelId: "llama-3.1-8b-instant",
    category: ["fast"],
    tier: "speed",
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.05,
    outputPrice: 0.08,
    tokensPerSecond: 750,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: "Voice bots, real-time chat and high-volume apps.",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  IMAGE GENERATION
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "arcanea-flux-pro",
    name: "Arcanea Flux Pro",
    description:
      "Flux 2 Pro by Black Forest Labs. Photorealistic image generation.",
    provider: "replicate",
    providerModelId: "black-forest-labs/FLUX.2-pro",
    category: ["image-gen"],
    tier: "frontier",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    releaseDate: "2025-06-01",
    curatorNote: "Photorealistic images.",
  },
  {
    id: "arcanea-dalle",
    name: "Arcanea DALL-E",
    description:
      "OpenAI image generation. Complex multi-element scenes from detailed prompts.",
    provider: "openai",
    providerModelId: "dall-e-3",
    category: ["image-gen"],
    tier: "frontier",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    curatorNote: "Complex multi-element scenes from detailed prompts.",
  },
  {
    id: "arcanea-imagen",
    name: "Arcanea Imagen",
    description: "Google Imagen 4. Image generation, including text in images.",
    provider: "google",
    providerModelId: "imagen-4",
    category: ["image-gen"],
    tier: "frontier",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    releaseDate: "2025-12-01",
    curatorNote: "Images that need readable text and typography.",
  },
  {
    id: "arcanea-ideogram",
    name: "Arcanea Ideogram",
    description: "Ideogram V3. Logos, typography and brand assets.",
    provider: "replicate",
    providerModelId: "ideogram-ai/ideogram-v3",
    category: ["image-gen"],
    tier: "performance",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    releaseDate: "2025-09-01",
    curatorNote: "Logos, typography and brand design.",
  },
  {
    id: "arcanea-recraft",
    name: "Arcanea Recraft",
    description:
      "Recraft V3. SVG vector output for icons, illustrations and brand assets.",
    provider: "replicate",
    providerModelId: "recraft-ai/recraft-v3-svg",
    category: ["image-gen"],
    tier: "performance",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    curatorNote:
      "Editable SVG vectors for icons, illustrations and scalable brand assets.",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  VIDEO GENERATION
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "arcanea-veo",
    name: "Arcanea Veo",
    description: "Google Veo 3.1. Video generation with native audio.",
    provider: "google",
    providerModelId: "veo-3.1",
    category: ["video-gen"],
    tier: "frontier",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsVideoOutput: true,
    supportsAudioOutput: true,
    releaseDate: "2025-12-01",
    curatorNote: "Realistic video with native audio.",
  },
  {
    id: "arcanea-sora",
    name: "Arcanea Sora",
    description:
      "OpenAI Sora 2. Narrative video with dialogue and native audio.",
    provider: "openai",
    providerModelId: "sora-2",
    category: ["video-gen"],
    tier: "frontier",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsVideoOutput: true,
    supportsAudioOutput: true,
    releaseDate: "2025-12-01",
    curatorNote: "Narrative video with dialogue and native audio.",
  },
  {
    id: "arcanea-kling",
    name: "Arcanea Kling",
    description: "Kling 2.6. Lower-cost video generation.",
    provider: "replicate",
    providerModelId: "kuaishou/kling-v2.6",
    category: ["video-gen"],
    tier: "performance",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsVideoOutput: true,
    supportsAudioOutput: true,
    releaseDate: "2025-11-01",
    curatorNote: "Lower-cost video for producing content at volume.",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  AUDIO — Voice and Sound
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "arcanea-whisper",
    name: "Arcanea Whisper",
    description: "Whisper V3 Turbo on Groq. Speech-to-text transcription.",
    provider: "groq",
    providerModelId: "whisper-large-v3-turbo",
    category: ["audio"],
    tier: "performance",
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0.111,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsAudioOutput: false,
    curatorNote: "Speech-to-text transcription.",
  },
];

// ─── Smart Auto-Select Model ────────────────────────────────────────

/** The "arcanea-auto" pseudo-model — router picks a model for the task */
export const AUTO_MODEL_ID = "arcanea-auto";

// ─── Lookup Helpers ──────────────────────────────────────────────────

export function getModelById(id: string): CuratedModel | undefined {
  return CURATED_MODELS.find((m) => m.id === id);
}

export function getModelsByCategory(category: string): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.category.includes(category as any));
}

export function getModelsByProvider(provider: ProviderId): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.provider === provider);
}

export function getModelsByTier(tier: string): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.tier === tier);
}

export function getTextModels(): CuratedModel[] {
  return CURATED_MODELS.filter(
    (m) =>
      !m.category.includes("image-gen") &&
      !m.category.includes("video-gen") &&
      !m.category.includes("audio"),
  );
}

export function getImageModels(): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.category.includes("image-gen"));
}

export function getVideoModels(): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.category.includes("video-gen"));
}

/** Resolve an Arcanea model ID to its provider's model ID */
export function resolveProviderModel(
  arcaneaId: string,
): { provider: ProviderConfig; modelId: string } | null {
  const model = getModelById(arcaneaId);
  if (!model) return null;
  const provider = PROVIDERS[model.provider];
  if (!provider) return null;
  return { provider, modelId: model.providerModelId };
}

/** Get total model count */
export function getModelCount(): number {
  return CURATED_MODELS.length;
}

/** Get unique provider count */
export function getProviderCount(): number {
  return new Set(CURATED_MODELS.map((m) => m.provider)).size;
}
