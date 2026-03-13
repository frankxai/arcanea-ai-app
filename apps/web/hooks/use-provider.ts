'use client';

import { useState, useEffect } from 'react';

const PROVIDER_STORAGE_KEY = 'arcanea-active-provider';
const KEYS_STORAGE_KEY = 'arcanea-provider-keys';

const PROVIDER_LABELS: Record<string, string> = {
  openrouter: 'Gemini 2.5 Flash (OpenRouter)',
  google: 'Gemini 2.0 Flash',
  anthropic: 'Claude Sonnet 4',
  openai: 'GPT-4o',
};

interface ProviderState {
  provider: string;
  clientApiKey: string | undefined;
  label: string;
}

/**
 * Reads the active AI provider and its client-side API key from localStorage.
 * Returns the provider ID, key (if any), and a display label.
 */
export function useProvider(): ProviderState {
  const [state, setState] = useState<ProviderState>({
    provider: 'google',
    clientApiKey: undefined,
    label: PROVIDER_LABELS.google,
  });

  useEffect(() => {
    try {
      const provider = localStorage.getItem(PROVIDER_STORAGE_KEY) || 'google';
      const keysRaw = localStorage.getItem(KEYS_STORAGE_KEY);
      const keys = keysRaw ? JSON.parse(keysRaw) : {};
      const clientApiKey = keys[provider] || undefined;
      const label = PROVIDER_LABELS[provider] || PROVIDER_LABELS.google;
      setState({ provider, clientApiKey, label });
    } catch {
      // localStorage unavailable — use defaults
    }
  }, []);

  return state;
}
