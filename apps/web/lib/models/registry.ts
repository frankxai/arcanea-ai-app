/**
 * Creation Engine P1 Model Registry (Issue #531)
 * Single source of truth for models, capabilities, inputs, unit cost, and credit prices.
 * Prices are placeholders FLAGGED FOR FRANK.
 */

export type ModelCapability = "image" | "edit" | "image-to-video" | "text-to-video" | "director";

export interface ModelDefinition {
  id: string;
  name: string;
  capability: ModelCapability;
  gatewayId: string;
  fallbackGatewayIds?: string[];
  unitCostUsd: number;
  creditPrice: number; // FLAGGED FOR FRANK
  isPlaceholderPrice: boolean;
  provider: string;
}

export const MODEL_REGISTRY: Record<string, ModelDefinition> = {
  "gpt-image-2": {
    id: "gpt-image-2",
    name: "GPT Image 2",
    capability: "image",
    gatewayId: "openai/gpt-image-2",
    fallbackGatewayIds: ["google/gemini-3.1-flash-image-preview", "bfl/flux-2-pro"],
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
    unitCostUsd: 0.02,
    creditPrice: 1,
    isPlaceholderPrice: true,
    provider: "xAI",
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
