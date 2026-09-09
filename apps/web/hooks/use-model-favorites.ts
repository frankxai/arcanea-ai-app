/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'arcanea_favorite_models';
const SYNC_EVENT = 'arcanea:favorites-updated';

// Default recommended models for worldbuilding & fantasy writing
export const DEFAULT_FAVORITES = [
  'claude-sonnet-4', // Editor's Choice for Lyrical Prose & Chapters
  'gemini-2.0-pro',  // Best 1M Lore Vault & Canon Memory
  'deepseek-r1',     // Best Hard Magic & Logic Reasoning
  'qwen-3.6-plus-free', // Best 100% Free 1M Worldbuilder
];

export interface ModelFavoritesState {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  resetToDefault: () => void;
  favoriteCount: number;
  isReady: boolean;
}

export function useModelFavorites(): ModelFavoritesState {
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITES);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } else {
        // Initialize default favorites
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITES));
        setFavorites(DEFAULT_FAVORITES);
      }
    } catch {
      // localStorage may be disabled or in private mode
      setFavorites(DEFAULT_FAVORITES);
    }
    setIsReady(true);
  }, []);

  // Listen for sync events across components / tabs
  useEffect(() => {
    const handleSync = (e: Event) => {
      try {
        const customEvent = e as CustomEvent<string[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setFavorites(customEvent.detail);
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setFavorites(JSON.parse(stored));
        }
      } catch {
        // ignore sync errors
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const persist = useCallback((newList: string[]) => {
    setFavorites(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: newList }));
    } catch {
      // ignore write errors
    }
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const exists = favorites.includes(id);
      const next = exists ? favorites.filter((f) => f !== id) : [...favorites, id];
      persist(next);
    },
    [favorites, persist],
  );

  const addFavorite = useCallback(
    (id: string) => {
      if (!favorites.includes(id)) {
        persist([...favorites, id]);
      }
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (favorites.includes(id)) {
        persist(favorites.filter((f) => f !== id));
      }
    },
    [favorites, persist],
  );

  const clearFavorites = useCallback(() => {
    persist([]);
  }, [persist]);

  const resetToDefault = useCallback(() => {
    persist(DEFAULT_FAVORITES);
  }, [persist]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    resetToDefault,
    favoriteCount: favorites.length,
    isReady,
  };
}
