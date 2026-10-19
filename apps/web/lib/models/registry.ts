/**
 * Creation Engine P1 Model Registry (Issue #531)
 * Single source of truth for models, capabilities, inputs, unit cost, and credit prices.
 * Prices are placeholders FLAGGED FOR FRANK.
 */

export type ModelCapability = "image" | "edit" | "image-to-video" | "text-to-video" | "director";

export interface ModelInputSpec {
  prompt: boolean;
  aspectRatio?: readonly string[];
  maxCount?: number;
  imageUrl?: boolean;
  durationSeconds?: readonly number[];
}

export interface ModelDefinition {
  id: string;
  name: string;
  capability: ModelCapability;
  gatewayId: string;
  fallbackGatewayIds?: string[];
  inputs: ModelInputSpec;
  unitCostUsd: number;
  creditPrice: number; // FLAGGED FOR FRANK
  isPlaceholderPrice: boolean;
  provider: string;
}

const IMAGE_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9"] as const;
const VIDEO_RATIOS = ["16:9", "9:16", "1:1"] as const;

export const MODEL_REGISTRY: Record<string, ModelDefinition> = {
  "gpt-image-2": {
    id: "gpt-image-2",
    name: "GPT Image 2",
    capability: "image",
    gatewayId: "openai/gpt-image-2",
    fallbackGatewayIds: ["google/gemini-3.1-flash-image-preview", "bfl/flux-2-pro"],
    inputs: { prompt: true, aspectRatio: IMAGE_RATIOS, maxCount: 4 },
    unitCostUsd: 0.04,
    creditPrice: 1,
    isPlaceholderPrice: true,
    provider: "OpenAI",
  },
  "imagen-4-ultra": {
    id: "imagen-4-ultra",
    name: "Imagen 4 Ultra",
    capability: "image",
    gatewayId: "google/imagen-4.0-ultra-generate-001",
    fallbackGatewayIds: ["google/gemini-3.1-flash-image-preview", "bfl/flux-2-pro"],
    inputs: { prompt: true, aspectRatio: IMAGE_RATIOS, maxCount: 4 },
    unitCostUsd: 0.03,
    creditPrice: 1,
    isPlaceholderPrice: true,
    provider: "Google",
  },
  "flux-2-pro": {
    id: "flux-2-pro",
    name: "FLUX.2 Pro",
    capability: "image",
    gatewayId: "bfl/flux-2-pro",
    fallbackGatewayIds: ["google/gemini-3.1-flash-image-preview"],
    inputs: { prompt: true, aspectRatio: IMAGE_RATIOS, maxCount: 4 },
    unitCostUsd: 0.05,
    creditPrice: 1,
    isPlaceholderPrice: true,
    provider: "Black Forest Labs",
  },
  "gemini-3.1-flash-image": {
    id: "gemini-3.1-flash-image",
    name: "Gemini 3.1 Flash Image",
    capability: "image",
    gatewayId: "google/gemini-3.1-flash-image-preview",
    fallbackGatewayIds: ["bfl/flux-2-pro"],
    inputs: { prompt: true, aspectRatio: IMAGE_RATIOS, maxCount: 4 },
    unitCostUsd: 0.01,
    creditPrice: 1,
    isPlaceholderPrice: true,
    provider: "Google",
  },
  "grok-imagine-image": {
    id: "grok-imagine-image",
    name: "Grok Imagine Image",
    capability: "image",
    gatewayId: "xai/grok-imagine-image",
    fallbackGatewayIds: ["google/gemini-3.1-flash-image-preview"],
    inputs: { prompt: true, aspectRatio: IMAGE_RATIOS, maxCount: 4 },
    unitCostUsd: 0.02,
    creditPrice: 1,
    isPlaceholderPrice: true,
    provider: "xAI",
  },
  "veo-3.1": {
    id: "veo-3.1",
    name: "Google Veo 3.1",
    capability: "text-to-video",
    gatewayId: "google/veo-3.1-generate-001",
    fallbackGatewayIds: ["klingai/kling-v2.5-turbo-pro"],
    inputs: { prompt: true, aspectRatio: VIDEO_RATIOS, durationSeconds: [5, 8] },
    unitCostUsd: 0.35,
    creditPrice: 10,
    isPlaceholderPrice: true,
    provider: "Google",
  },
  "wan-2.5": {
    id: "wan-2.5",
    name: "Alibaba Wan 2.5",
    capability: "image-to-video",
    gatewayId: "alibaba/wan-2.5-i2v-720p",
    fallbackGatewayIds: ["google/veo-3.1-generate-001"],
    inputs: { prompt: true, imageUrl: true, aspectRatio: VIDEO_RATIOS, durationSeconds: [5, 8] },
    unitCostUsd: 0.25,
    creditPrice: 8,
    isPlaceholderPrice: true,
    provider: "Alibaba",
  },
};

export const DEFAULT_IMAGE_MODEL_ID = "gemini-3.1-flash-image";

export function getModel(id: string): ModelDefinition | undefined {
  return MODEL_REGISTRY[id];
}

export function getModelsByCapability(capability: ModelCapability): ModelDefinition[] {
  return Object.values(MODEL_REGISTRY).filter((m) => m.capability === capability);
}

export function getGatewayFallbackChain(modelId: string): string[] {
  return getModel(modelId)?.fallbackGatewayIds ?? [];
}
