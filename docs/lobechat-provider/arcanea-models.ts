/**
 * Arcanea model-bank AI model definitions.
 *
 * This file goes in: packages/model-bank/src/aiModels/arcanea.ts
 * It defines the default/known model list for Arcanea when model fetching
 * is unavailable or as fallback enrichment data.
 *
 * @see https://arcanea.ai/docs/models
 */

import type { AIChatModelCard } from '../types/aiModel';

// https://arcanea.ai/docs/models
// https://arcanea.ai/docs/api

const arcaneaChatModels: AIChatModelCard[] = [
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      '#1 coding model. 80.8% SWE-bench Verified, #1 human preference. Claude Opus 4.6 via Arcanea Gateway.',
    displayName: 'Arcanea Opus (Claude Opus 4.6)',
    enabled: true,
    id: 'arcanea-opus',
    maxOutput: 32_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 15, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 75, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'cachedInput', rate: 1.5, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-05-22',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Best balance of speed and intelligence. Claude Sonnet 4 via Arcanea Gateway.',
    displayName: 'Arcanea Sonnet (Claude Sonnet 4)',
    enabled: true,
    id: 'arcanea-sonnet',
    maxOutput: 16_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 3, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 15, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'cachedInput', rate: 0.3, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-05-22',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      '#1 math model. 100% AIME 2025, 96.7% GPQA Diamond. OpenAI GPT-5 via Arcanea Gateway.',
    displayName: 'Arcanea GPT-5 (OpenAI GPT-5)',
    enabled: true,
    id: 'arcanea-gpt5',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 10, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 40, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'cachedInput', rate: 2.5, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-05-14',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 128_000,
    description:
      'Fast and affordable reasoning. OpenAI o4-mini via Arcanea Gateway.',
    displayName: 'Arcanea o4-mini (OpenAI o4-mini)',
    enabled: true,
    id: 'arcanea-o4-mini',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.1, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 4.4, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'cachedInput', rate: 0.275, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-04-16',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      '#1 raw reasoning. 77.1% ARC-AGI-2. Google Gemini 2.5 Pro via Arcanea Gateway.',
    displayName: 'Arcanea Gemini Pro (Gemini 2.5 Pro)',
    enabled: true,
    id: 'arcanea-gemini-pro',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.25, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 10, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-03-25',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      'Fastest multimodal model from Google. Gemini 2.5 Flash via Arcanea Gateway.',
    displayName: 'Arcanea Gemini Flash (Gemini 2.5 Flash)',
    enabled: true,
    id: 'arcanea-gemini-flash',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.15, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.6, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-04-17',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      '#1 value model. 66% SWE-bench at $0.27/M input. DeepSeek V3 via Arcanea Gateway.',
    displayName: 'Arcanea DeepSeek (DeepSeek V3)',
    enabled: true,
    id: 'arcanea-deepseek',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.27, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 1.1, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'cachedInput', rate: 0.07, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-03-24',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Deep chain-of-thought reasoning. DeepSeek R1 via Arcanea Gateway.',
    displayName: 'Arcanea Thinker (DeepSeek R1)',
    enabled: true,
    id: 'arcanea-thinker',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.55, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 2.19, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-01-20',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description:
      '#1 speed. 2,200+ tok/s via Cerebras. Llama 3.1 8B for instant responses.',
    displayName: 'Arcanea Bolt (Cerebras Llama 3.1 8B)',
    enabled: true,
    id: 'arcanea-bolt',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.1, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2024-07-23',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Fast and reliable chat. 840 tok/s via Groq. Llama 3.1 8B with ultra-low latency.',
    displayName: 'Arcanea Swift (Groq Llama 3.1 8B)',
    id: 'arcanea-swift',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.05, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.08, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2024-07-23',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Smart 70B via Cerebras at 450 tok/s. Llama 3.3 70B for analysis and writing.',
    displayName: 'Arcanea Scholar (Cerebras Llama 3.3 70B)',
    enabled: true,
    id: 'arcanea-scholar',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.6, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.6, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2024-12-06',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Reliable 70B via Groq at 394 tok/s. Llama 3.3 70B for complex reasoning.',
    displayName: 'Arcanea Sage (Groq Llama 3.3 70B)',
    id: 'arcanea-sage',
    maxOutput: 32_768,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.59, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.79, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2024-12-06',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Massive 235B MoE at 1,400 tok/s via Cerebras. Deep reasoning with exceptional speed.',
    displayName: 'Arcanea Titan (Cerebras Qwen 3 235B)',
    enabled: true,
    id: 'arcanea-titan',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.9, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.9, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-04-28',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      'Balanced MoE all-rounder. Llama 4 Scout via Groq at 594 tok/s.',
    displayName: 'Arcanea Scout (Groq Llama 4 Scout)',
    enabled: true,
    id: 'arcanea-scout',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.11, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.34, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-04-05',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      'Creative powerhouse. Llama 4 Maverick 128-expert MoE via Groq at 562 tok/s.',
    displayName: 'Arcanea Maverick (Groq Llama 4 Maverick)',
    enabled: true,
    id: 'arcanea-maverick',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.6, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-04-05',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576,
    description:
      'Multimodal understanding. Gemini 2.0 Flash for image analysis and visual Q&A.',
    displayName: 'Arcanea Vision (Gemini 2.0 Flash)',
    id: 'arcanea-vision',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-02-25',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 128_000,
    description:
      'Enterprise-grade RAG model. Cohere Command R+ optimized for retrieval and tool use.',
    displayName: 'Arcanea Command (Cohere Command R+)',
    id: 'arcanea-command',
    maxOutput: 4096,
    pricing: {
      units: [
        { name: 'textInput', rate: 2.5, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 10, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-02-27',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
    },
    contextWindowTokens: 127_072,
    description:
      'Real-time web search. Perplexity Sonar Pro with grounded answers and live citations.',
    displayName: 'Arcanea Sonar (Perplexity Sonar Pro)',
    id: 'arcanea-sonar',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 3, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 15, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-02-19',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Fastest Claude model. Claude 3.5 Haiku for instant responses and classification.',
    displayName: 'Arcanea Haiku (Claude 3.5 Haiku)',
    id: 'arcanea-haiku',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.8, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 4, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2024-10-22',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      'Latest Qwen reasoning model. Qwen 3 235B for multilingual reasoning and code.',
    displayName: 'Arcanea Qwen (Qwen 3 235B)',
    id: 'arcanea-qwen',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed' as const, unit: 'millionTokens' as const },
        { name: 'textOutput', rate: 1.2, strategy: 'fixed' as const, unit: 'millionTokens' as const },
      ],
    },
    releasedAt: '2025-04-28',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Smart router. Automatically selects the optimal model based on task complexity, speed, and cost.',
    displayName: 'Arcanea Auto (Smart Router)',
    enabled: true,
    id: 'arcanea-auto',
    maxOutput: 65_536,
    type: 'chat',
  },
];

export const allModels = [...arcaneaChatModels];

export default allModels;
