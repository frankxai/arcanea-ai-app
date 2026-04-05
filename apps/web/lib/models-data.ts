/**
 * AI Models Data Layer
 *
 * Data source for arcanea.ai/models — the AI Model Arena & Benchmarks page.
 * Shows community which models exist, their benchmarks, pricing, and how
 * Arcanea uses them in its agent workflows.
 *
 * Last updated: 2026-04-04
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface AIModelPricing {
  /** Price per million input tokens in USD, or "free" */
  input: number | 'free';
  /** Price per million output tokens in USD, or "free" */
  output: number | 'free';
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  /** Emoji representing the provider */
  providerLogo: string;
  version: string;
  /** Maximum context window in tokens */
  contextWindow: number;
  /** Maximum output tokens (0 = not publicly specified) */
  maxOutput: number;
  /** SWE-Bench Verified score as a percentage, or null if unavailable */
  sweBench: number | null;
  pricing: AIModelPricing;
  /** Estimated generation speed in tokens/sec */
  speed: number;
  /** ISO date string of public release / availability */
  releaseDate: string;
  strengths: string[];
  weaknesses: string[];
  category: 'frontier' | 'open-source' | 'free-tier' | 'specialized';
  tags: string[];
}

export interface ArcaneanWorkflow {
  id: string;
  /** Display name of the workflow agent */
  name: string;
  /** Greek-mythology agent persona */
  guardian: string;
  /** Arcanean Gate this maps to */
  gate: string;
  /** Primary model ID */
  model: string;
  /** Ordered fallback model IDs */
  fallbackModels: string[];
  /** Why this model was chosen for this workflow */
  rationale: string;
  category:
    | 'orchestration'
    | 'coding'
    | 'review'
    | 'research'
    | 'coordination'
    | 'quick';
}

export interface ImageModel {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  version: string;
  maxResolution: string;
  defaultResolution: string;
  pricing: { perImage: number | 'free'; unit: string };
  speed: number; // seconds per image
  strengths: string[];
  weaknesses: string[];
  category: 'frontier' | 'open-source' | 'free-tier' | 'specialized';
  tags: string[];
  textRendering: 'excellent' | 'good' | 'poor' | 'none';
  styleControl: 'excellent' | 'good' | 'limited';
  apiAvailable: boolean;
}

export interface ModelWeeklyUpdate {
  /** ISO date string for the Monday of the week */
  weekOf: string;
  /** Model IDs that are free this week */
  models: string[];
  notes: string;
  newAdditions: string[];
  removals: string[];
}

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

export const AI_MODELS: AIModel[] = [
  // ── Frontier ────────────────────────────────────────────────────────────

  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    providerLogo: '🟤',
    version: '4.0',
    contextWindow: 200_000,
    maxOutput: 32_000,
    sweBench: 90.0,
    pricing: { input: 15, output: 75 },
    speed: 40,
    releaseDate: '2025-05-22',
    strengths: [
      'Highest SWE-Bench score of any model',
      'Deep multi-step reasoning',
      'Extended thinking with visible chain-of-thought',
      'Agentic coding — sustained autonomous work',
      'Exceptional instruction following',
    ],
    weaknesses: [
      'Premium pricing',
      'Slower than lighter models',
      'Overkill for simple tasks',
    ],
    category: 'frontier',
    tags: ['reasoning', 'coding', 'agentic', 'extended-thinking'],
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    providerLogo: '🟤',
    version: '4.0',
    contextWindow: 200_000,
    maxOutput: 16_000,
    sweBench: 72.7,
    pricing: { input: 3, output: 15 },
    speed: 80,
    releaseDate: '2025-05-22',
    strengths: [
      'Best cost-performance ratio for coding',
      'Strong agentic capabilities',
      'Fast for a frontier model',
      'Transparent extended thinking',
    ],
    weaknesses: [
      'Slightly less capable than Opus on hardest tasks',
      'Smaller output window than Opus',
    ],
    category: 'frontier',
    tags: ['coding', 'agentic', 'balanced', 'extended-thinking'],
  },
  {
    id: 'claude-haiku-3.5',
    name: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    providerLogo: '🟤',
    version: '3.5',
    contextWindow: 200_000,
    maxOutput: 8_192,
    sweBench: 40.6,
    pricing: { input: 0.25, output: 1.25 },
    speed: 150,
    releaseDate: '2024-10-29',
    strengths: [
      'Extremely fast responses',
      'Very low cost per token',
      'Good for classification and routing',
      'Handles simple tasks efficiently',
    ],
    weaknesses: [
      'Not suited for complex reasoning',
      'Lower coding accuracy',
      'Smaller output window',
    ],
    category: 'frontier',
    tags: ['fast', 'cheap', 'routing', 'classification'],
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerLogo: '🟢',
    version: '4o',
    contextWindow: 128_000,
    maxOutput: 16_384,
    sweBench: 38.4,
    pricing: { input: 2.5, output: 10 },
    speed: 90,
    releaseDate: '2024-05-13',
    strengths: [
      'Strong multimodal capabilities (text + vision + audio)',
      'Wide ecosystem and tool integrations',
      'Reliable general-purpose performance',
    ],
    weaknesses: [
      'Lower SWE-Bench than Claude models',
      'Smaller context than Gemini',
      'Higher cost than open-source alternatives',
    ],
    category: 'frontier',
    tags: ['multimodal', 'general-purpose', 'vision', 'audio'],
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerLogo: '🟢',
    version: '4o-mini',
    contextWindow: 128_000,
    maxOutput: 16_384,
    sweBench: 23.7,
    pricing: { input: 0.15, output: 0.6 },
    speed: 130,
    releaseDate: '2024-07-18',
    strengths: [
      'Very low cost',
      'Fast inference',
      'Good for simple tasks and summarisation',
    ],
    weaknesses: [
      'Weak on complex reasoning',
      'Not suited for agentic coding',
    ],
    category: 'frontier',
    tags: ['cheap', 'fast', 'lightweight'],
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    providerLogo: '🔵',
    version: '2.0-flash',
    contextWindow: 1_000_000,
    maxOutput: 8_192,
    sweBench: 33.0,
    pricing: { input: 0.075, output: 0.3 },
    speed: 160,
    releaseDate: '2025-02-05',
    strengths: [
      'Massive 1M token context window',
      'Extremely cheap',
      'Very fast inference',
      'Native multimodal (text, image, video, audio)',
    ],
    weaknesses: [
      'Lower reasoning depth than Opus/Sonnet',
      'Smaller output window',
      'Less reliable for agentic tasks',
    ],
    category: 'frontier',
    tags: ['long-context', 'multimodal', 'cheap', 'fast'],
  },
  {
    id: 'gemini-2.0-pro',
    name: 'Gemini 2.0 Pro',
    provider: 'Google',
    providerLogo: '🔵',
    version: '2.0-pro',
    contextWindow: 1_000_000,
    maxOutput: 8_192,
    sweBench: 48.0,
    pricing: { input: 1.25, output: 5 },
    speed: 70,
    releaseDate: '2025-03-25',
    strengths: [
      '1M context with stronger reasoning than Flash',
      'Good code generation',
      'Competitive pricing for performance level',
    ],
    weaknesses: [
      'Slower than Flash',
      'Still behind Claude on agentic tasks',
    ],
    category: 'frontier',
    tags: ['long-context', 'reasoning', 'coding'],
  },

  // ── Free-Tier (via Zen / open routers) ──────────────────────────────────

  {
    id: 'qwen-3.6-plus-free',
    name: 'Qwen 3.6 Plus',
    provider: 'Alibaba',
    providerLogo: '🟠',
    version: '3.6-plus',
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: 78.8,
    pricing: { input: 'free', output: 'free' },
    speed: 85,
    releaseDate: '2025-06-01',
    strengths: [
      'Free via Zen routing',
      '1M context window — best free long-context model',
      '78.8% SWE-Bench — competitive with top frontier models',
      'Strong agentic reasoning',
      'Excellent multilingual support',
    ],
    weaknesses: [
      'Rate-limited on free tier',
      'Less tested in Western dev ecosystems',
      'Availability depends on Zen router uptime',
    ],
    category: 'free-tier',
    tags: ['free', 'long-context', 'agentic', 'multilingual', 'coding'],
  },
  {
    id: 'minimax-m2.5-free',
    name: 'MiniMax M2.5',
    provider: 'MiniMax',
    providerLogo: '🟣',
    version: '2.5',
    contextWindow: 200_000,
    maxOutput: 16_384,
    sweBench: 80.2,
    pricing: { input: 'free', output: 'free' },
    speed: 75,
    releaseDate: '2025-07-01',
    strengths: [
      'Free via Zen routing',
      'Highest SWE-Bench among free models (80.2%)',
      'Exceptional code generation and comprehension',
      'Strong at complex multi-file edits',
    ],
    weaknesses: [
      'Smaller context than Qwen',
      'Less versatile for non-coding tasks',
      'Rate-limited on free tier',
    ],
    category: 'free-tier',
    tags: ['free', 'coding', 'swe-bench', 'agentic'],
  },
  {
    id: 'big-pickle-free',
    name: 'Big Pickle (GLM-4.6)',
    provider: 'Zhipu',
    providerLogo: '🟡',
    version: '4.6',
    contextWindow: 200_000,
    maxOutput: 8_192,
    sweBench: 70.0,
    pricing: { input: 'free', output: 'free' },
    speed: 65,
    releaseDate: '2025-05-01',
    strengths: [
      'Free via Zen routing',
      'Deep reasoning for architecture decisions',
      'Good at system design and analysis',
    ],
    weaknesses: [
      'Slower than other free options',
      'Lower SWE-Bench than M2.5 or Qwen',
      'Less suited for rapid iteration',
    ],
    category: 'free-tier',
    tags: ['free', 'reasoning', 'architecture'],
  },
  {
    id: 'glm-4.7-free',
    name: 'GLM 4.7',
    provider: 'Zhipu',
    providerLogo: '🟡',
    version: '4.7',
    contextWindow: 200_000,
    maxOutput: 8_192,
    sweBench: 73.8,
    pricing: { input: 'free', output: 'free' },
    speed: 70,
    releaseDate: '2025-08-01',
    strengths: [
      'Free via Zen routing',
      'Improved over GLM-4.6',
      'Strong multilingual and research capabilities',
      'Good documentation generation',
    ],
    weaknesses: [
      'Still behind top-tier coding models',
      'Smaller context than Qwen',
    ],
    category: 'free-tier',
    tags: ['free', 'multilingual', 'research', 'docs'],
  },
  {
    id: 'gpt-5-nano-free',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    providerLogo: '🟢',
    version: '5-nano',
    contextWindow: 128_000,
    maxOutput: 8_192,
    sweBench: null,
    pricing: { input: 'free', output: 'free' },
    speed: 200,
    releaseDate: '2025-09-01',
    strengths: [
      'Free via Zen routing',
      'Fastest model in the free tier',
      'Good for navigation and lightweight tasks',
      'Low latency for interactive UX',
    ],
    weaknesses: [
      'No SWE-Bench data yet',
      'Not suited for complex reasoning',
      'Small model — limited depth',
    ],
    category: 'free-tier',
    tags: ['free', 'fast', 'lightweight', 'navigation'],
  },
  {
    id: 'kimi-k2.5-free',
    name: 'Kimi K2.5',
    provider: 'Moonshot',
    providerLogo: '🌙',
    version: 'k2.5',
    contextWindow: 260_000,
    maxOutput: 16_384,
    sweBench: 76.8,
    pricing: { input: 'free', output: 'free' },
    speed: 80,
    releaseDate: '2025-07-01',
    strengths: [
      'Free via Zen routing',
      '260K context — larger than most free models',
      'Strong frontend and integration work',
      '76.8% SWE-Bench — solid coding performance',
    ],
    weaknesses: [
      'Less proven on backend architecture',
      'Rate-limited on free tier',
    ],
    category: 'free-tier',
    tags: ['free', 'frontend', 'integration', 'coding'],
  },
  {
    id: 'nemotron-3-super-free',
    name: 'Nemotron 3 Super',
    provider: 'NVIDIA',
    providerLogo: '💚',
    version: '3-super',
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: null,
    pricing: { input: 'free', output: 'free' },
    speed: 90,
    releaseDate: '2025-06-01',
    strengths: [
      'Free via Zen routing',
      '1M context window',
      'NVIDIA hardware-optimised inference',
      'Strong at structured data and analysis',
    ],
    weaknesses: [
      'No public SWE-Bench score',
      'Less community tooling than OpenAI/Anthropic',
    ],
    category: 'free-tier',
    tags: ['free', 'long-context', 'nvidia', 'analysis'],
  },
  {
    id: 'mimo-v2-pro-free',
    name: 'MiMo V2 Pro',
    provider: 'Xiaomi',
    providerLogo: '🔶',
    version: 'v2-pro',
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: 78.0,
    pricing: { input: 'free', output: 'free' },
    speed: 80,
    releaseDate: '2025-08-01',
    strengths: [
      'Free via Zen routing',
      '1M context window',
      '78% SWE-Bench — strong for a free model',
      'Good general-purpose coding',
    ],
    weaknesses: [
      'Newer model with less community adoption',
      'Less documentation in English',
    ],
    category: 'free-tier',
    tags: ['free', 'long-context', 'coding'],
  },

  // ── Open Source / Low Cost ──────────────────────────────────────────────

  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    providerLogo: '🐋',
    version: 'v3',
    contextWindow: 64_000,
    maxOutput: 8_192,
    sweBench: 42.0,
    pricing: { input: 0.27, output: 1.1 },
    speed: 60,
    releaseDate: '2024-12-26',
    strengths: [
      'Extremely low cost',
      'Open weights model',
      'Good reasoning for price point',
      'Strong math and logic capabilities',
    ],
    weaknesses: [
      'Smaller context than competitors',
      'Slower inference than cloud-native models',
      'Lower SWE-Bench than top-tier',
    ],
    category: 'open-source',
    tags: ['cheap', 'open-weights', 'reasoning', 'math'],
  },
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick',
    provider: 'Meta',
    providerLogo: '🦙',
    version: '4-maverick',
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: 50.0,
    pricing: { input: 'free', output: 'free' },
    speed: 70,
    releaseDate: '2025-04-05',
    strengths: [
      'Fully open-source (Apache 2.0 derivative)',
      '1M context window',
      'Self-hostable — full data sovereignty',
      'Mixture-of-experts architecture',
      'Large community and fine-tune ecosystem',
    ],
    weaknesses: [
      'Requires significant compute to self-host',
      'Lower SWE-Bench than top proprietary models',
      'MoE can have inconsistent quality across tasks',
    ],
    category: 'open-source',
    tags: ['open-source', 'long-context', 'self-host', 'moe'],
  },
];

// ---------------------------------------------------------------------------
// Image Models
// ---------------------------------------------------------------------------

export const IMAGE_MODELS: ImageModel[] = [
  {
    id: 'flux-2-max',
    name: 'FLUX.2 Max',
    provider: 'Black Forest Labs',
    providerLogo: '⬛',
    version: '2.0-max',
    maxResolution: '2048x2048',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.04, unit: 'per image' },
    speed: 8,
    strengths: [
      'Best text rendering of any image model',
      'Photorealistic quality — near-indistinguishable from photography',
      'Strong prompt adherence and compositional accuracy',
    ],
    weaknesses: [
      'Slower than most competitors',
      'Premium pricing at $0.04/image',
    ],
    category: 'frontier',
    tags: ['photorealistic', 'text-rendering', 'creative'],
    textRendering: 'excellent',
    styleControl: 'excellent',
    apiAvailable: true,
  },
  {
    id: 'grok-2-image',
    name: 'Grok 2 Image',
    provider: 'xAI',
    providerLogo: '🤖',
    version: '2.0',
    maxResolution: '1024x1024',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.02, unit: 'per image' },
    speed: 4,
    strengths: [
      'Fast generation at 4 seconds per image',
      'Good general-purpose quality at low cost',
      'Native xAI API with straightforward integration',
    ],
    weaknesses: [
      'Less artistic control than specialized models',
      'Newer model with smaller community and fewer fine-tunes',
    ],
    category: 'frontier',
    tags: ['fast', 'versatile', 'api-native'],
    textRendering: 'good',
    styleControl: 'good',
    apiAvailable: true,
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    providerLogo: '🟢',
    version: '3.0',
    maxResolution: '1024x1792',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.04, unit: 'per image (1024x1024)' },
    speed: 6,
    strengths: [
      'Excellent text rendering in generated images',
      'Strong creative interpretation — expands sparse prompts well',
      'Reliable API with broad ecosystem support',
    ],
    weaknesses: [
      'Aggressive safety filters limit some creative directions',
      'Less photorealistic than FLUX for real-world scenes',
    ],
    category: 'frontier',
    tags: ['text-rendering', 'creative', 'reliable'],
    textRendering: 'excellent',
    styleControl: 'good',
    apiAvailable: true,
  },
  {
    id: 'gemini-image',
    name: 'Gemini Image',
    provider: 'Google',
    providerLogo: '🔵',
    version: '2.0',
    maxResolution: '1024x1024',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.02, unit: 'per image via API' },
    speed: 3,
    strengths: [
      'Fastest generation at ~3 seconds',
      'Cheapest frontier option at $0.02/image',
      'Integrated with Gemini chat for conversational image creation',
    ],
    weaknesses: [
      'Less artistic depth than dedicated image models',
      'Newer image capability — still maturing',
    ],
    category: 'frontier',
    tags: ['fast', 'multimodal', 'affordable'],
    textRendering: 'good',
    styleControl: 'good',
    apiAvailable: true,
  },
  {
    id: 'sd-3.5-large',
    name: 'Stable Diffusion 3.5 Large',
    provider: 'Stability AI',
    providerLogo: '🟣',
    version: '3.5-large',
    maxResolution: '1024x1024',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.035, unit: 'per image (API) / free self-hosted' },
    speed: 5,
    strengths: [
      'Fully open-source — self-host with zero per-image cost',
      'Massive community with thousands of LoRAs and fine-tunes',
      'Highly customizable through ComfyUI and extensions',
    ],
    weaknesses: [
      'Requires a capable GPU for self-hosting (12GB+ VRAM)',
      'Base quality below FLUX and DALL-E without fine-tuning',
    ],
    category: 'open-source',
    tags: ['open-source', 'self-host', 'customizable'],
    textRendering: 'good',
    styleControl: 'excellent',
    apiAvailable: true,
  },
  {
    id: 'midjourney-v7',
    name: 'Midjourney v7',
    provider: 'Midjourney',
    providerLogo: '🎨',
    version: '7.0',
    maxResolution: '2048x2048',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.05, unit: 'per image (est. from subscription)' },
    speed: 10,
    strengths: [
      'Unmatched aesthetic quality — the gold standard for artistic output',
      'Strong built-in artistic styles and coherent compositions',
      'Excellent at fantasy, concept art, and stylized illustration',
    ],
    weaknesses: [
      'No direct API — Discord-only or web interface',
      'Poor text rendering in generated images',
      'Most expensive option at ~$0.05/image',
    ],
    category: 'specialized',
    tags: ['artistic', 'aesthetic', 'stylized'],
    textRendering: 'poor',
    styleControl: 'excellent',
    apiAvailable: false,
  },
  {
    id: 'ideogram-2',
    name: 'Ideogram 2.0',
    provider: 'Ideogram',
    providerLogo: '🅸',
    version: '2.0',
    maxResolution: '1024x1024',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.03, unit: 'per image' },
    speed: 5,
    strengths: [
      'Best-in-class text rendering — near-perfect typography in images',
      'Excellent for logos, signage, and text-heavy compositions',
      'Good balance of quality and speed',
    ],
    weaknesses: [
      'Less versatile for general artistic styles',
      'Smaller community than FLUX or Stable Diffusion',
    ],
    category: 'specialized',
    tags: ['text-rendering', 'typography', 'logos'],
    textRendering: 'excellent',
    styleControl: 'good',
    apiAvailable: true,
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    provider: 'Google',
    providerLogo: '🔵',
    version: '3.0',
    maxResolution: '1024x1024',
    defaultResolution: '1024x1024',
    pricing: { perImage: 0.02, unit: 'per image via Vertex AI' },
    speed: 4,
    strengths: [
      'High-quality output backed by Google research',
      'Native Vertex AI integration for enterprise workflows',
      'Strong safety controls and content filtering',
    ],
    weaknesses: [
      'Only available through Vertex AI — no standalone API',
      'Enterprise pricing complexity with Vertex billing',
    ],
    category: 'frontier',
    tags: ['google', 'vertex-ai', 'enterprise'],
    textRendering: 'good',
    styleControl: 'good',
    apiAvailable: true,
  },
];

// ---------------------------------------------------------------------------
// Arcanean Workflows — oh-my-opencode agent routing
// ---------------------------------------------------------------------------

export const ARCANEAN_WORKFLOWS: ArcaneanWorkflow[] = [
  {
    id: 'sisyphus',
    name: 'Sisyphus',
    guardian: 'Aiyami',
    gate: 'Crown',
    model: 'qwen-3.6-plus-free',
    fallbackModels: ['claude-sonnet-4', 'gemini-2.0-pro'],
    rationale:
      'Orchestrator needs relentless persistence and 1M context to hold the full project state. Qwen 3.6 Plus offers the best free agentic reasoning with massive context.',
    category: 'orchestration',
  },
  {
    id: 'hephaestus',
    name: 'Hephaestus',
    guardian: 'Draconia',
    gate: 'Fire',
    model: 'minimax-m2.5-free',
    fallbackModels: ['claude-sonnet-4', 'kimi-k2.5-free'],
    rationale:
      'Coder needs the highest SWE-Bench score available. MiniMax M2.5 leads at 80.2% — the divine forge of code.',
    category: 'coding',
  },
  {
    id: 'oracle',
    name: 'Oracle',
    guardian: 'Lyria',
    gate: 'Sight',
    model: 'big-pickle-free',
    fallbackModels: ['gemini-2.0-pro', 'claude-sonnet-4'],
    rationale:
      'Architecture decisions require deep reasoning over complex systems. Big Pickle excels at slow, deliberate analysis — seeing the whole picture.',
    category: 'research',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    guardian: 'Elara',
    gate: 'Starweave',
    model: 'qwen-3.6-plus-free',
    fallbackModels: ['gemini-2.0-flash', 'nemotron-3-super-free'],
    rationale:
      'Research demands vast context for ingesting papers, docs, and codebases. 1M context + strong reasoning makes Qwen the fire-bringer of knowledge.',
    category: 'research',
  },
  {
    id: 'metis',
    name: 'Metis',
    guardian: 'Alera',
    gate: 'Voice',
    model: 'qwen-3.6-plus-free',
    fallbackModels: ['claude-sonnet-4', 'gemini-2.0-pro'],
    rationale:
      'Strategy and planning need long-context reasoning to weigh trade-offs across the entire system. Qwen delivers wisdom at scale.',
    category: 'coordination',
  },
  {
    id: 'momus',
    name: 'Momus',
    guardian: 'Maylinn',
    gate: 'Heart',
    model: 'minimax-m2.5-free',
    fallbackModels: ['claude-sonnet-4', 'qwen-3.6-plus-free'],
    rationale:
      'Code review requires deep comprehension of implementation patterns. M2.5 at 80.2% SWE-Bench catches what others miss — the honest critic.',
    category: 'review',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    guardian: 'Lyssandria',
    gate: 'Foundation',
    model: 'kimi-k2.5-free',
    fallbackModels: ['minimax-m2.5-free', 'claude-sonnet-4'],
    rationale:
      'Coordination and frontend integration need broad context and strong UI/UX understanding. Kimi K2.5 carries the world of integrations.',
    category: 'coordination',
  },
  {
    id: 'librarian',
    name: 'Librarian',
    guardian: 'Leyla',
    gate: 'Flow',
    model: 'glm-4.7-free',
    fallbackModels: ['qwen-3.6-plus-free', 'gemini-2.0-flash'],
    rationale:
      'Documentation and research benefit from strong multilingual capabilities. GLM 4.7 excels at structured knowledge extraction.',
    category: 'research',
  },
  {
    id: 'explore',
    name: 'Explore',
    guardian: 'Ino',
    gate: 'Unity',
    model: 'gpt-5-nano-free',
    fallbackModels: ['gpt-4o-mini', 'gemini-2.0-flash'],
    rationale:
      'Navigation and exploration need speed above all else. GPT-5 Nano is the fastest free model — instant wayfinding through the codebase.',
    category: 'quick',
  },
];

// ---------------------------------------------------------------------------
// Weekly Updates
// ---------------------------------------------------------------------------

export const MODEL_WEEKLY_UPDATES: ModelWeeklyUpdate[] = [
  {
    weekOf: '2026-04-04',
    models: [
      'qwen-3.6-plus-free',
      'minimax-m2.5-free',
      'big-pickle-free',
      'glm-4.7-free',
      'gpt-5-nano-free',
      'kimi-k2.5-free',
      'nemotron-3-super-free',
      'mimo-v2-pro-free',
    ],
    notes:
      'All Zen-routed models remain free this week. MiniMax M2.5 continues to lead SWE-Bench at 80.2%. Qwen 3.6 Plus remains the recommended orchestrator model for its 1M context + 78.8% SWE-Bench combination. MiMo V2 Pro gaining traction as a strong 1M-context alternative. Image generation models are now tracked in the Arena — 8 models across frontier, open-source, and specialized categories.',
    newAdditions: [],
    removals: [],
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/** Look up a model by its unique ID. Returns undefined if not found. */
export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

/** Get all models in a given category. */
export function getModelsByCategory(
  category: AIModel['category'],
): AIModel[] {
  return AI_MODELS.filter((m) => m.category === category);
}

/** Get all models that are free (both input and output pricing is "free"). */
export function getFreeModels(): AIModel[] {
  return AI_MODELS.filter(
    (m) => m.pricing.input === 'free' && m.pricing.output === 'free',
  );
}

/** Get all image generation models. */
export function getImageModels(): ImageModel[] {
  return IMAGE_MODELS;
}

/** Look up an image model by its unique ID. */
export function getImageModelById(id: string): ImageModel | undefined {
  return IMAGE_MODELS.find((m) => m.id === id);
}

/** Get all Arcanean workflows that use a given model (primary or fallback). */
export function getWorkflowsForModel(modelId: string): ArcaneanWorkflow[] {
  return ARCANEAN_WORKFLOWS.filter(
    (w) => w.model === modelId || w.fallbackModels.includes(modelId),
  );
}
