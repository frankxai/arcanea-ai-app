/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
  provider: "grok" | "openrouter" | "gemini";
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
