/**
 * Arcanea Curated Model IDs
 *
 * These are the model identifiers accepted by the Arcanea Gateway.
 * Each maps to a carefully selected backend model.
 * Verified March 2026 from published benchmarks.
 */

export type ArcaneaModelId =
  // Frontier Reasoning (8)
  | 'arcanea-opus'        // Claude Opus 4.6 — #1 coding, #1 human preference
  | 'arcanea-sonnet'      // Claude Sonnet 4.6 — Best value frontier
  | 'arcanea-gpt5'        // GPT-5.2 Pro — #1 math (100% AIME)
  | 'arcanea-gemini-pro'  // Gemini 3.1 Pro Preview — #1 raw reasoning (77.1% ARC-AGI-2)
  | 'arcanea-grok'        // Grok 4.20 — 500B params, real-time knowledge
  | 'arcanea-deepseek-r1' // DeepSeek R1 — Transparent reasoning
  | 'arcanea-kimi'        // Kimi K2.5 — 1T MoE, agentic champion
  | 'arcanea-deepseek'    // DeepSeek V3.2 — 50-100x cheaper, still competitive
  // Performance (5)
  | 'arcanea-haiku'       // Claude Haiku 4.5 — Speed/intelligence sweet spot
  | 'arcanea-gemini-flash'// Gemini 2.5 Flash — 1M ctx, $0.15/M input
  | 'arcanea-qwen'        // Qwen 3 235B on Cerebras — 1,400 tok/s
  | 'arcanea-maverick'    // Llama 4 Maverick — 128 experts, open-source
  | 'arcanea-mistral'     // Mistral Large — EU data sovereignty
  // Speed Demons (3)
  | 'arcanea-bolt'        // Cerebras 8B — 2,200+ tok/s
  | 'arcanea-thunder'     // Cerebras 70B — 450 tok/s
  | 'arcanea-lightning'   // Groq 8B — 750 tok/s, lowest TTFT
  // Image Generation (5)
  | 'arcanea-flux-pro'    // Flux 2 Pro — #1 photorealism
  | 'arcanea-dalle'       // DALL-E 3 — #1 prompt comprehension
  | 'arcanea-imagen'      // Imagen 4 — #1 text rendering
  | 'arcanea-ideogram'    // Ideogram V3 — #1 logos/typography
  | 'arcanea-recraft'     // Recraft V3 SVG — Only SVG vector AI
  // Video Generation (3)
  | 'arcanea-veo'         // Veo 3.1 — #1 realism, film-grade + audio
  | 'arcanea-sora'        // Sora 2 — #1 storytelling, 60s + audio
  | 'arcanea-kling'       // Kling 2.6 — Best value, $0.05/sec
  // Audio (1)
  | 'arcanea-whisper'     // Whisper V3 Turbo — 217x realtime on Groq
  // Smart Routing (1)
  | 'arcanea-auto'        // Auto-select best model for task
  | (string & {});        // Allow custom model IDs (passthrough)

/** Human-readable model descriptions — verified March 2026 */
export const ARCANEA_MODELS: Record<string, string> = {
  'arcanea-opus': 'Claude Opus 4.6 — #1 coding (80.8% SWE-bench), #1 human preference (1606 Elo).',
  'arcanea-sonnet': 'Claude Sonnet 4.6 — 79.6% SWE-bench at $3/$15. Best value frontier.',
  'arcanea-gpt5': 'GPT-5.2 Pro — 100% AIME 2025, 80% SWE-bench. Best math model.',
  'arcanea-gemini-pro': 'Gemini 3.1 Pro Preview — 77.1% ARC-AGI-2. Leads 13 of 16 benchmarks. 1M ctx.',
  'arcanea-grok': 'Grok 4.20 — 500B params, 4-agent system. Real-time X knowledge.',
  'arcanea-deepseek-r1': 'DeepSeek R1 — Transparent chain-of-thought. See the reasoning process.',
  'arcanea-kimi': 'Kimi K2.5 — 1T MoE, 100 sub-agents, 1500 tool calls. Agentic champion.',
  'arcanea-deepseek': 'DeepSeek V3.2 — 66% SWE-bench at $0.27/$1.10. 50-100x cheaper than frontier.',
  'arcanea-haiku': 'Claude Haiku 4.5 — Best speed/intelligence from Anthropic.',
  'arcanea-gemini-flash': 'Gemini 2.5 Flash — 1M context + image gen at $0.15/M input.',
  'arcanea-qwen': 'Qwen 3 235B on Cerebras — 1,400 tok/s enterprise reasoning.',
  'arcanea-maverick': 'Llama 4 Maverick — 128 experts, 400B active params, open-source on Groq.',
  'arcanea-mistral': 'Mistral Large — EU data sovereignty, GDPR-first, strong coder.',
  'arcanea-bolt': 'Cerebras 8B — 2,200+ tok/s. The fastest model in the world.',
  'arcanea-thunder': 'Cerebras 70B — Smart AND fast at 450 tok/s.',
  'arcanea-lightning': 'Groq 8B — $0.05/M input. Lowest latency to first token.',
  'arcanea-flux-pro': 'Flux 2 Pro — #1 photorealism. Camera-accurate optics at $0.055/image.',
  'arcanea-dalle': 'DALL-E 3 — Best prompt comprehension for complex scenes.',
  'arcanea-imagen': 'Imagen 4 — Best text-in-image rendering and typography.',
  'arcanea-ideogram': 'Ideogram V3 — Best for logos, typography, brand design.',
  'arcanea-recraft': 'Recraft V3 SVG — Only AI that outputs editable vector graphics.',
  'arcanea-veo': 'Veo 3.1 — Film-grade video with native audio. $0.15-$0.75/sec.',
  'arcanea-sora': 'Sora 2 — #1 storytelling. Emotional depth, 60s, native audio.',
  'arcanea-kling': 'Kling 2.6 — Best value video at $0.05/sec. Production-grade.',
  'arcanea-whisper': 'Whisper V3 Turbo — 217x realtime on Groq. $0.111/min.',
  'arcanea-auto': 'Smart Router — Auto-select the best model for your task.',
};
