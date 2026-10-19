/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getModelKey,
  readProviderPreferences,
  providerStorageNames,
  type ProviderActor,
} from "@/lib/ai/provider-preferences";
import { useAuth } from "@/lib/auth/context";

const PROVIDER_LABELS: Record<string, string> = {
  openrouter: "OpenRouter",
  google: "Google Gemini",
  anthropic: "Anthropic Claude",
  openai: "OpenAI",
  xai: "xAI Grok",
  deepseek: "DeepSeek",
  groq: "Groq",
  cerebras: "Cerebras",
  mistral: "Mistral AI",
  moonshot: "Moonshot",
};

// Gateway model ID → provider mapping for the chat API
const MODEL_PROVIDERS: Record<string, string> = {
  "arcanea-auto": "gateway",
  "arcanea-opus": "anthropic",
  "arcanea-sonnet": "anthropic",
  "arcanea-gpt5": "openai",
  "arcanea-gemini-pro": "google",
  "arcanea-grok": "xai",
  "arcanea-deepseek-r1": "deepseek",
  "arcanea-kimi": "moonshot",
  "arcanea-deepseek": "deepseek",
  "arcanea-haiku": "anthropic",
  "arcanea-gemini-flash": "google",
  "arcanea-qwen": "cerebras",
  "arcanea-maverick": "groq",
  "arcanea-mistral": "mistral",
  "arcanea-bolt": "cerebras",
  "arcanea-thunder": "cerebras",
  "arcanea-lightning": "groq",
};

const MODEL_LABELS: Record<string, string> = {
  "arcanea-auto": "Auto",
  "arcanea-opus": "Opus 4.6",
  "arcanea-sonnet": "Sonnet 4.6",
  "arcanea-gpt5": "GPT-5",
  "arcanea-gemini-pro": "Gemini 3.1 Pro",
  "arcanea-grok": "Grok 4.2",
  "arcanea-deepseek-r1": "DeepSeek R1",
  "arcanea-kimi": "Kimi K2.5",
  "arcanea-deepseek": "DeepSeek V3",
  "arcanea-haiku": "Haiku 4.5",
  "arcanea-gemini-flash": "Gemini Flash",
  "arcanea-qwen": "Qwen 3",
  "arcanea-maverick": "Maverick",
  "arcanea-mistral": "Mistral Large",
  "arcanea-bolt": "Bolt",
  "arcanea-thunder": "Thunder",
  "arcanea-lightning": "Lightning",
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
export function readProviderFromStorage(actor: ProviderActor): ProviderState {
  const fallback: ProviderState = {
    provider: "google",
    modelId: null,
    clientApiKey: undefined,
    label: PROVIDER_LABELS.google,
    isGateway: false,
  };
  if (typeof window === "undefined" || !actor) return fallback;
  try {
    const names = providerStorageNames(actor)!;
    const modelId = localStorage.getItem(names.model);
    const { keys, activeId: provider } = readProviderPreferences(
      localStorage,
      actor,
    );

    if (modelId && MODEL_PROVIDERS[modelId]) {
      const modelProvider =
        modelId === "arcanea-auto" ? provider : MODEL_PROVIDERS[modelId];
      const clientApiKey = getModelKey(keys, modelProvider);
      const label = MODEL_LABELS[modelId] || modelId;
      return {
        provider: modelProvider,
        modelId,
        clientApiKey,
        label,
        isGateway: true,
      };
    } else {
      const clientApiKey = getModelKey(keys, provider);
      const label = PROVIDER_LABELS[provider] || PROVIDER_LABELS.google;
      return { provider, modelId: null, clientApiKey, label, isGateway: false };
    }
  } catch {
    return fallback;
  }
}

export function useProvider(): ProviderState {
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  const [snapshot, setSnapshot] = useState(() => ({
    token,
    state: readProviderFromStorage(token.actor),
  }));

  // Re-sync on storage events (e.g. settings page changes keys)
  useEffect(() => {
    function onStorage() {
      const current = credentialScope.get();
      setSnapshot({
        token: current,
        state: readProviderFromStorage(current.actor),
      });
    }
    onStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("arcanea-model-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("arcanea-model-change", onStorage);
    };
  }, [credentialScope, token]);

  return snapshot.token === token
    ? snapshot.state
    : readProviderFromStorage(null);
}

/**
 * Set the active Gateway model (persists to localStorage).
 */
export function setActiveModel(modelId: string, actor: ProviderActor) {
  if (typeof window === "undefined") return false;
  const names = providerStorageNames(actor);
  if (!names) return false;
  try {
    localStorage.setItem(names.model, modelId);
  } catch {
    toast.error(
      "Your browser could not save the model. Allow site storage and try again.",
    );
    return false;
  }
  // Dispatch a storage event so other components can react
  window.dispatchEvent(new Event("arcanea-model-change"));
  return true;
}

/**
 * Hook for model selection with setter.
 */
export function useModelSelection() {
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  const providerState = useProvider();
  const setModelId = useCallback(
    (id: string) => {
      if (credentialScope.isCurrent(token)) setActiveModel(id, token.actor);
    },
    [credentialScope, token],
  );

  return {
    ...providerState,
    modelId: providerState.modelId || "arcanea-auto",
    setModelId,
  };
}
