'use client';

/**
 * useWorldCharacterInit — Handles ?character=&world= query param initialization
 *
 * When the chat page loads with character/world params, this hook:
 * 1. Calls the /api/chat/world-init endpoint
 * 2. Returns the character context for display + system prompt injection
 * 3. Clears the URL params after initialization
 */

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export interface WorldCharacterContext {
  characterName: string;
  worldName: string;
  characterPortrait: string | null;
  systemPrompt: string;
}

interface UseWorldCharacterInitResult {
  worldCharacter: WorldCharacterContext | null;
  isLoading: boolean;
  error: string | null;
  clearWorldCharacter: () => void;
}

export function useWorldCharacterInit(): UseWorldCharacterInitResult {
  const searchParams = useSearchParams();
  const [worldCharacter, setWorldCharacter] = useState<WorldCharacterContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initAttempted = useRef(false);

  useEffect(() => {
    if (initAttempted.current) return;

    const characterId = searchParams.get('character');
    const worldSlug = searchParams.get('world');

    if (!characterId || !worldSlug) return;
    initAttempted.current = true;
    setIsLoading(true);

    fetch('/api/chat/world-init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId, worldSlug }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(data.error || 'Failed to initialize character');
        }
        return res.json();
      })
      .then((data: WorldCharacterContext) => {
        setWorldCharacter(data);
        // Clean URL without navigation
        window.history.replaceState(null, '', '/chat');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchParams]);

  const clearWorldCharacter = () => {
    setWorldCharacter(null);
    setError(null);
    initAttempted.current = false;
  };

  return { worldCharacter, isLoading, error, clearWorldCharacter };
}
