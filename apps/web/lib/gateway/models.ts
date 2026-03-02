/**
 * Arcanea Intelligence Gateway — Curated Model Catalog
 *
 * THE EDGE: Only the absolute best models across all providers.
 * Verified March 2026 from published benchmarks and pricing pages.
 *
 * Philosophy: "We tested hundreds of models so you don't have to."
 *
 * Sources: Artificial Analysis, LLM Stats, SWE-bench, ARC-AGI-2,
 *          AIME 2025, GPQA Diamond, Terminal-Bench 2.0
 */

import type { CuratedModel, ProviderId, ProviderConfig } from './types';

// ─── Provider Registry ───────────────────────────────────────────────

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    authHeader: 'x-api-key',
    envKey: 'ANTHROPIC_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'anthropic',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    authHeader: 'Authorization',
    envKey: 'OPENAI_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'openai',
  },
  google: {
    id: 'google',
    name: 'Google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    authHeader: 'x-goog-api-key',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'google',
  },
  xai: {
    id: 'xai',
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    authHeader: 'Authorization',
    envKey: 'XAI_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'openai',
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    authHeader: 'Authorization',
    envKey: 'GROQ_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: 'openai',
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    authHeader: 'Authorization',
    envKey: 'CEREBRAS_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: 'openai',
  },
  sambanova: {
    id: 'sambanova',
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    authHeader: 'Authorization',
    envKey: 'SAMBANOVA_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: 'openai',
  },
  replicate: {
    id: 'replicate',
    name: 'Replicate',
    baseUrl: 'https://api.replicate.com/v1',
    authHeader: 'Authorization',
    envKey: 'REPLICATE_API_TOKEN',
    supportsStreaming: true,
    supportsTools: false,
    supportsVision: true,
    format: 'openai',
  },
  together: {
    id: 'together',
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    authHeader: 'Authorization',
    envKey: 'TOGETHER_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'openai',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    authHeader: 'Authorization',
    envKey: 'DEEPSEEK_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: 'openai',
  },
  moonshot: {
    id: 'moonshot',
    name: 'Moonshot (Kimi)',
    baseUrl: 'https://api.moonshot.ai/v1',
    authHeader: 'Authorization',
    envKey: 'MOONSHOT_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: false,
    format: 'openai',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    authHeader: 'Authorization',
    envKey: 'MISTRAL_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'openai',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    authHeader: 'Authorization',
    envKey: 'OPENROUTER_API_KEY',
    supportsStreaming: true,
    supportsTools: true,
    supportsVision: true,
    format: 'openai',
  },
};

// ─── THE CURATED CATALOG ─────────────────────────────────────────────
// Only the absolute BEST models. Verified March 2026.
// Every price, speed, and benchmark is sourced from published data.

export const CURATED_MODELS: CuratedModel[] = [
  // ═══════════════════════════════════════════════════════════════════
  //  FRONTIER REASONING — The Smartest Models Alive
  //  Source: ARC-AGI-2, AIME 2025, SWE-bench Verified, GPQA Diamond
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'arcanea-opus',
    name: 'Arcanea Opus',
    description: '#1 coding & human preference. 80.8% SWE-bench, 1606 Elo on GDPval-AA.',
    provider: 'anthropic',
    providerModelId: 'claude-opus-4-6',
    category: ['reasoning', 'creative', 'code'],
    tier: 'frontier',
    contextWindow: 200000,
    maxOutput: 32000,
    inputPrice: 5,
    outputPrice: 25,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2026-02-04',
    curatorNote: 'The gold standard for coding and creative work. Highest human preference ratings. When quality is everything.',
  },
  {
    id: 'arcanea-sonnet',
    name: 'Arcanea Sonnet',
    description: '79.6% SWE-bench at $3/$15. Near-Opus intelligence, fraction of the cost.',
    provider: 'anthropic',
    providerModelId: 'claude-sonnet-4-6',
    category: ['reasoning', 'creative', 'code'],
    tier: 'frontier',
    contextWindow: 200000,
    maxOutput: 16000,
    inputPrice: 3,
    outputPrice: 15,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2026-02-04',
    curatorNote: 'Best value frontier model. 79.6% SWE-bench = near-Opus coding at 5x lower cost. Default recommendation.',
  },
  {
    id: 'arcanea-gpt5',
    name: 'Arcanea GPT-5',
    description: '#1 mathematics. 100% AIME 2025 without tools. 80% SWE-bench.',
    provider: 'openai',
    providerModelId: 'gpt-5.2-pro',
    category: ['reasoning', 'code'],
    tier: 'frontier',
    contextWindow: 400000,
    maxOutput: 32768,
    inputPrice: 1.75,
    outputPrice: 14,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2025-12-10',
    curatorNote: 'Perfect math (100% AIME). 77.3% Terminal-Bench. Uses 2-4x fewer tokens than competitors. Strong structured output.',
  },
  {
    id: 'arcanea-gemini-pro',
    name: 'Arcanea Gemini Pro',
    description: '#1 raw reasoning. 77.1% ARC-AGI-2 — miles ahead. 1M context.',
    provider: 'google',
    providerModelId: 'gemini-3.1-pro-preview',
    category: ['reasoning', 'vision', 'code'],
    tier: 'frontier',
    contextWindow: 1000000,
    maxOutput: 65536,
    inputPrice: 2,
    outputPrice: 12,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2026-02-19',
    curatorNote: '77.1% ARC-AGI-2 — leads 13 of 16 benchmarks. 1M context. Best for massive docs, video, multimodal.',
  },
  {
    id: 'arcanea-grok',
    name: 'Arcanea Grok',
    description: 'xAI 500B-param model. 4-agent system. Real-time X/Twitter knowledge.',
    provider: 'xai',
    providerModelId: 'grok-4.20',
    category: ['reasoning', 'creative'],
    tier: 'frontier',
    contextWindow: 256000,
    maxOutput: 16384,
    inputPrice: 3,
    outputPrice: 15,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2026-02-17',
    curatorNote: '500B params, 4-agent internal system. Real-time knowledge from X. The wild card — benchmarks pending March 2026.',
  },
  {
    id: 'arcanea-deepseek-r1',
    name: 'Arcanea DeepSeek R1',
    description: 'Transparent reasoner. Shows chain-of-thought. ~95% AIME.',
    provider: 'deepseek',
    providerModelId: 'deepseek-reasoner',
    category: ['reasoning', 'code'],
    tier: 'frontier',
    contextWindow: 128000,
    maxOutput: 32768,
    inputPrice: 0.55,
    outputPrice: 2.19,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2025-01-20',
    curatorNote: 'Best transparent reasoning. See the full thinking process, not just the answer. Extraordinary value.',
  },
  {
    id: 'arcanea-kimi',
    name: 'Arcanea Kimi',
    description: 'Moonshot K2.5. 1T MoE, 100 sub-agents, 1500 tool calls. Agentic champion.',
    provider: 'moonshot',
    providerModelId: 'kimi-k2.5',
    category: ['reasoning', 'code'],
    tier: 'frontier',
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.60,
    outputPrice: 2.50,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2025-07-01',
    curatorNote: '1 trillion parameters, 100 sub-agents, 1,500 tool calls. Purpose-built for agentic workflows. Open-weight.',
  },
  {
    id: 'arcanea-deepseek',
    name: 'Arcanea DeepSeek V3',
    description: 'Price/performance king. 66% SWE-bench at $0.27/$1.10. 50-100x cheaper than frontier.',
    provider: 'deepseek',
    providerModelId: 'deepseek-chat',
    category: ['reasoning', 'code', 'creative'],
    tier: 'frontier',
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.27,
    outputPrice: 1.10,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    releaseDate: '2025-12-01',
    curatorNote: 'THE disruptor. 66% SWE-bench at $0.27 input — competitive with $15+ models. 50-100x cheaper.',
  },

  // ═══════════════════════════════════════════════════════════════════
  //  PERFORMANCE — Smart AND Fast
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'arcanea-haiku',
    name: 'Arcanea Haiku',
    description: 'Anthropic speed tier. Fast with surprising depth. Best speed/intelligence ratio.',
    provider: 'anthropic',
    providerModelId: 'claude-haiku-4-5-20251001',
    category: ['fast', 'code'],
    tier: 'performance',
    contextWindow: 200000,
    maxOutput: 8192,
    inputPrice: 0.8,
    outputPrice: 4,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: 'Best speed/intelligence from Anthropic. Real-time apps, chatbots, quick tasks.',
  },
  {
    id: 'arcanea-gemini-flash',
    name: 'Arcanea Flash',
    description: 'Google speed tier. 1M context, native image gen, $0.15/M input. Absurd value.',
    provider: 'google',
    providerModelId: 'gemini-2.5-flash',
    category: ['fast', 'vision', 'creative'],
    tier: 'performance',
    contextWindow: 1000000,
    maxOutput: 65536,
    inputPrice: 0.15,
    outputPrice: 0.60,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    supportsImageOutput: true,
    curatorNote: '1M context + image generation at $0.15/M input. The best value multimodal model that exists.',
  },
  {
    id: 'arcanea-qwen',
    name: 'Arcanea Qwen',
    description: 'Qwen 3 235B on Cerebras. 1,400 tok/s. Enterprise reasoning at inference speed.',
    provider: 'cerebras',
    providerModelId: 'qwen-3-235b-a22b-instruct-2507',
    category: ['reasoning', 'code', 'creative'],
    tier: 'performance',
    contextWindow: 131072,
    maxOutput: 16384,
    inputPrice: 0.60,
    outputPrice: 1.20,
    tokensPerSecond: 1400,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: '235B parameters at 1,400 tok/s via Cerebras CS-3. Enterprise-grade quality at speed-demon velocity.',
  },
  {
    id: 'arcanea-maverick',
    name: 'Arcanea Maverick',
    description: 'Llama 4 Maverick. 128 experts, 400B active. Best open-source on Groq.',
    provider: 'groq',
    providerModelId: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    category: ['creative', 'code'],
    tier: 'performance',
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.20,
    outputPrice: 0.60,
    tokensPerSecond: 562,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: '128 experts, 400B active parameters, open-source. On Groq hardware for maximum speed.',
  },
  {
    id: 'arcanea-mistral',
    name: 'Arcanea Mistral',
    description: 'Mistral Large. EU data sovereignty. Excellent structured output and multilingual.',
    provider: 'mistral',
    providerModelId: 'mistral-large-2512',
    category: ['reasoning', 'code'],
    tier: 'performance',
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.50,
    outputPrice: 1.50,
    supportsVision: true,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: 'EU data sovereignty. Mistral Large 3 at $0.50/$1.50. GDPR-first for European users.',
  },

  // ═══════════════════════════════════════════════════════════════════
  //  SPEED DEMONS — When Milliseconds Matter
  //  Cerebras: $10B OpenAI inference deal (Jan 2026). Fastest on Earth.
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'arcanea-bolt',
    name: 'Arcanea Bolt',
    description: 'Cerebras 8B at 2,200+ tok/s. The fastest model in the world.',
    provider: 'cerebras',
    providerModelId: 'llama3.1-8b',
    category: ['fast'],
    tier: 'speed',
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.10,
    outputPrice: 0.10,
    tokensPerSecond: 2200,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: '2,200+ tok/s on Cerebras CS-3. Answers appear instantly. Chat, summaries, quick transforms.',
  },
  {
    id: 'arcanea-thunder',
    name: 'Arcanea Thunder',
    description: 'Cerebras 70B at 450 tok/s. Real intelligence at impossible speed.',
    provider: 'cerebras',
    providerModelId: 'llama3.3-70b',
    category: ['fast', 'reasoning'],
    tier: 'speed',
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.60,
    outputPrice: 0.60,
    tokensPerSecond: 450,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: '70B brain at 450 tok/s. Smart enough for real work, fast enough for real-time. The sweet spot.',
  },
  {
    id: 'arcanea-lightning',
    name: 'Arcanea Lightning',
    description: 'Groq LPU. 750 tok/s. Lowest time-to-first-token for real-time voice/chat.',
    provider: 'groq',
    providerModelId: 'llama-3.1-8b-instant',
    category: ['fast'],
    tier: 'speed',
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.05,
    outputPrice: 0.08,
    tokensPerSecond: 750,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    curatorNote: 'Lowest latency to first token. $0.05/M input. Voice bots, real-time chat, high-volume apps.',
  },

  // ═══════════════════════════════════════════════════════════════════
  //  IMAGE GENERATION — Only the Best Visual AI
  //  Source: Zapier, WaveSpeed, Cliprise benchmarks March 2026
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'arcanea-flux-pro',
    name: 'Arcanea Flux Pro',
    description: '#1 photorealism. Flux 2 Pro by Black Forest Labs. Camera-accurate optics.',
    provider: 'replicate',
    providerModelId: 'black-forest-labs/FLUX.2-pro',
    category: ['image-gen'],
    tier: 'frontier',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    releaseDate: '2025-06-01',
    curatorNote: '#1 photorealism. Camera-accurate optics at $0.055/image. The undisputed king of image generation.',
  },
  {
    id: 'arcanea-dalle',
    name: 'Arcanea DALL-E',
    description: '#1 prompt comprehension. Complex multi-element scenes. GPT-4o native gen.',
    provider: 'openai',
    providerModelId: 'dall-e-3',
    category: ['image-gen'],
    tier: 'frontier',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    curatorNote: 'Best prompt understanding. Complex multi-element scenes with precise instruction following.',
  },
  {
    id: 'arcanea-imagen',
    name: 'Arcanea Imagen',
    description: '#1 text rendering. Imagen 4. Perfect typography in images.',
    provider: 'google',
    providerModelId: 'imagen-4',
    category: ['image-gen'],
    tier: 'frontier',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    releaseDate: '2025-12-01',
    curatorNote: 'Best text-in-image rendering. When you need readable text, perfect faces, clean typography.',
  },
  {
    id: 'arcanea-ideogram',
    name: 'Arcanea Ideogram',
    description: '#1 logos & typography. Ideogram V3. Design-grade text and brand assets.',
    provider: 'replicate',
    providerModelId: 'ideogram-ai/ideogram-v3',
    category: ['image-gen'],
    tier: 'performance',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    releaseDate: '2025-09-01',
    curatorNote: 'Best for logos, typography, and brand design. Text-in-image perfection.',
  },
  {
    id: 'arcanea-recraft',
    name: 'Arcanea Recraft',
    description: 'Only AI that outputs SVG vectors. Recraft V3. Icons, illustrations, brand assets.',
    provider: 'replicate',
    providerModelId: 'recraft-ai/recraft-v3-svg',
    category: ['image-gen'],
    tier: 'performance',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsImageOutput: true,
    curatorNote: 'ONLY model that outputs editable SVG vectors. Icons, illustrations, scalable brand assets.',
  },

  // ═══════════════════════════════════════════════════════════════════
  //  VIDEO GENERATION — Film-Grade Moving Pictures
  //  All three now support native audio generation (new in 2026).
  //  Source: TeamDay, AIML API, GLBGPT benchmarks
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'arcanea-veo',
    name: 'Arcanea Veo',
    description: '#1 realism. Veo 3.1. Film-grade lighting, physics, camera coherence + audio.',
    provider: 'google',
    providerModelId: 'veo-3.1',
    category: ['video-gen'],
    tier: 'frontier',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsVideoOutput: true,
    supportsAudioOutput: true,
    releaseDate: '2025-12-01',
    curatorNote: '#1 video realism. Cinematic lighting, real physics, native audio. $0.15-$0.75/sec.',
  },
  {
    id: 'arcanea-sora',
    name: 'Arcanea Sora',
    description: '#1 storytelling. Sora 2. Emotional depth, dialogue, narrative. Up to 60s + audio.',
    provider: 'openai',
    providerModelId: 'sora-2',
    category: ['video-gen'],
    tier: 'frontier',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsVideoOutput: true,
    supportsAudioOutput: true,
    releaseDate: '2025-12-01',
    curatorNote: '#1 storytelling. Emotional depth, dialogue, narrative structure. Up to 60s with native audio.',
  },
  {
    id: 'arcanea-kling',
    name: 'Arcanea Kling',
    description: 'Best value video. Kling 2.6. $0.05/sec. Production-grade at scale.',
    provider: 'replicate',
    providerModelId: 'kuaishou/kling-v2.6',
    category: ['video-gen'],
    tier: 'performance',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsVideoOutput: true,
    supportsAudioOutput: true,
    releaseDate: '2025-11-01',
    curatorNote: 'Best price-to-quality for video. $0.05/sec. The production workhorse for scaling content.',
  },

  // ═══════════════════════════════════════════════════════════════════
  //  AUDIO — Voice and Sound
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'arcanea-whisper',
    name: 'Arcanea Whisper',
    description: 'Whisper V3 Turbo on Groq. 217x realtime. Transcribe 1 hour in 17 seconds.',
    provider: 'groq',
    providerModelId: 'whisper-large-v3-turbo',
    category: ['audio'],
    tier: 'performance',
    contextWindow: 0,
    maxOutput: 0,
    inputPrice: 0.111,
    outputPrice: 0,
    supportsVision: false,
    supportsTools: false,
    supportsStreaming: false,
    supportsAudioOutput: false,
    curatorNote: '217x realtime on Groq LPU. Transcribe an hour of audio in 17 seconds. $0.111/minute.',
  },
];

// ─── Smart Auto-Select Model ────────────────────────────────────────

/** The "arcanea-auto" pseudo-model — router picks the best model for the task */
export const AUTO_MODEL_ID = 'arcanea-auto';

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
    (m) => !m.category.includes('image-gen') &&
           !m.category.includes('video-gen') &&
           !m.category.includes('audio')
  );
}

export function getImageModels(): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.category.includes('image-gen'));
}

export function getVideoModels(): CuratedModel[] {
  return CURATED_MODELS.filter((m) => m.category.includes('video-gen'));
}

/** Resolve an Arcanea model ID to its provider's model ID */
export function resolveProviderModel(arcaneaId: string): { provider: ProviderConfig; modelId: string } | null {
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
