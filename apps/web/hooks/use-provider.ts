'use client';

import { useState, useEffect, useCallback } from 'react';

const PROVIDER_STORAGE_KEY = 'arcanea-active-provider';
const MODEL_STORAGE_KEY = 'arcanea-active-model';
const KEYS_STORAGE_KEY = 'arcanea-provider-keys';

const PROVIDER_LABELS: Record<string, string> = {
  openrouter: 'Gemini 2.5 Flash (OpenRouter)',
  google: 'Gemini 2.0 Flash',
  anthropic: 'Claude Sonnet 4',
  openai: 'GPT-4o',
};

// Gateway model ID → provider mapping for the chat API
const MODEL_PROVIDERS: Record<string, string> = {
  'arcanea-auto': 'gateway',
  'arcanea-opus': 'anthropic',
  'arcanea-sonnet': 'anthropic',
  'arcanea-gpt5': 'openai',
  'arcanea-gemini-pro': 'google',
  'arcanea-grok': 'xai',
  'arcanea-deepseek-r1': 'deepseek',
  'arcanea-kimi': 'moonshot',
  'arcanea-deepseek': 'deepseek',
  'arcanea-haiku': 'anthropic',
  'arcanea-gemini-flash': 'google',
  'arcanea-qwen': 'cerebras',
  'arcanea-maverick': 'groq',
  'arcanea-mistral': 'mistral',
  'arcanea-bolt': 'cerebras',
  'arcanea-thunder': 'cerebras',
  'arcanea-lightning': 'groq',
};

const MODEL_LABELS: Record<string, string> = {
  'arcanea-auto': 'Auto',
  'arcanea-opus': 'Opus 4.6',
  'arcanea-sonnet': 'Sonnet 4.6',
  'arcanea-gpt5': 'GPT-5',
  'arcanea-gemini-pro': 'Gemini 3.1 Pro',
  'arcanea-grok': 'Grok 4.2',
  'arcanea-deepseek-r1': 'DeepSeek R1',
  'arcanea-kimi': 'Kimi K2.5',
  'arcanea-deepseek': 'DeepSeek V3',
  'arcanea-haiku': 'Haiku 4.5',
  'arcanea-gemini-flash': 'Gemini Flash',
  'arcanea-qwen': 'Qwen 3',
  'arcanea-maverick': 'Maverick',
  'arcanea-mistral': 'Mistral Large',
  'arcanea-bolt': 'Bolt',
  'arcanea-thunder': 'Thunder',
  'arcanea-lightning': 'Lightning',
};

export interface ProviderState {
  /** Legacy provider ID or 'gateway' for Gateway models */
  provider: string;
  /** Gateway model ID (e.g. 'arcanea-opus') — null for legacy mode */
  modelId: string | null;
  clientApiKey: string | undefined;
  label: string;
  /** Whether using Gateway model selection vs legacy provider mode */
  isGateway: boolean;
}

/**
 * Reads the active AI model/provider and client-side API keys from localStorage.
 * Supports both legacy provider mode (google/anthropic/openai/openrouter)
 * and Gateway model mode (arcanea-opus, arcanea-auto, etc.).
 */
export function useProvider(): ProviderState {
  const [state, setState] = useState<ProviderState>({
    provider: 'google',
    modelId: null,
    clientApiKey: undefined,
    label: PROVIDER_LABELS.google,
    isGateway: false,
  });

  useEffect(() => {
    try {
      const modelId = localStorage.getItem(MODEL_STORAGE_KEY);
      const provider = localStorage.getItem(PROVIDER_STORAGE_KEY) || 'google';
      const keysRaw = localStorage.getItem(KEYS_STORAGE_KEY);

      // Parse keys with corruption recovery
      let keys: Record<string, string> = {};
      if (keysRaw) {
        try {
          keys = JSON.parse(keysRaw);
        } catch {
          console.warn('[useProvider] Corrupted keys in localStorage, clearing');
          localStorage.removeItem(KEYS_STORAGE_KEY);
        }
      }

      if (modelId && MODEL_PROVIDERS[modelId]) {
        // Gateway mode: use the selected model
        const modelProvider = MODEL_PROVIDERS[modelId];
        const clientApiKey = keys[modelProvider] || keys[provider] || undefined;
        const label = MODEL_LABELS[modelId] || modelId;
        setState({ provider: modelProvider, modelId, clientApiKey, label, isGateway: true });
      } else {
        // Legacy mode: use the selected provider
        const clientApiKey = keys[provider] || undefined;
        const label = PROVIDER_LABELS[provider] || PROVIDER_LABELS.google;
        setState({ provider, modelId: null, clientApiKey, label, isGateway: false });
      }
    } catch {
      // localStorage completely unavailable (private browsing, etc.)
    }
  }, []);

  return state;
}

/**
 * Set the active Gateway model (persists to localStorage).
 */
export function setActiveModel(modelId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODEL_STORAGE_KEY, modelId);
  // Dispatch a storage event so other components can react
  window.dispatchEvent(new Event('arcanea-model-change'));
}

/**
 * Hook for model selection with setter.
 */
export function useModelSelection() {
  const providerState = useProvider();
  const [modelId, setModelIdState] = useState(providerState.modelId || 'arcanea-auto');

  useEffect(() => {
    if (providerState.modelId) {
      setModelIdState(providerState.modelId);
    }
  }, [providerState.modelId]);

  const setModelId = useCallback((id: string) => {
    setModelIdState(id);
    setActiveModel(id);
  }, []);

  return { modelId, setModelId, ...providerState };
}
