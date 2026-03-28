export interface GenerationAsset {
  url: string;
  prompt: string;
  revisedPrompt?: string;
  mimeType?: string;
  data?: string;
}

export interface GenerationSafety {
  providerConfigured: boolean;
  fallbackUsed: boolean;
}

export interface ImagineGenerationResponse {
  generationId: string;
  status: "completed";
  provider: "grok" | "gemini";
  model: string;
  prompt: string;
  revisedPrompt?: string;
  aspectRatio: string;
  assetUrls: string[];
  assets: GenerationAsset[];
  timing: {
    startedAt: string;
    completedAt: string;
    durationMs: number;
  };
  safety: GenerationSafety;
  saveState: {
    canSave: boolean;
  };
  error: null;
  images: Array<{
    url?: string;
    data?: string;
    mimeType?: string;
    prompt?: string;
    revisedPrompt?: string;
  }>;
}
