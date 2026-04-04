'use client';

/**
 * useChatWorldMode — Detects ?mode=world and provides world-building context
 *
 * When the chat loads with ?mode=world, returns a world-building system prompt
 * and mode indicator. The chat page uses this to guide the AI into a structured
 * world-creation conversation, then offers a "Create This World" action.
 */

import { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const WORLD_BUILDER_PROMPT = `You are a world-building assistant for Arcanea, a creative multiverse platform.

Help the user design a fantasy world step by step. Ask about:
1. **Core concept** — What makes this world unique? What is the central premise?
2. **Elements & magic** — What forces of nature or magic exist? How do they work?
3. **Factions & cultures** — Who inhabits this world? What groups compete or collaborate?
4. **Key characters** — Who are the most important figures? Heroes, villains, legends?
5. **Founding events** — What shaped this world? Wars, discoveries, cataclysms?

Keep each response focused on ONE area. Be encouraging and creative.
After 3-4 exchanges, summarize the world concept in a structured format and tell the user:
"Your world is taking shape! When you're ready, click **Create This World** to bring it to life."

Do NOT generate JSON. Speak naturally and collaboratively.`;

export interface WorldModeState {
  /** Whether the chat is in world-builder mode */
  isWorldMode: boolean;
  /** System prompt to inject when in world mode */
  worldPrompt: string;
  /** Whether the user has sent enough messages to offer world creation */
  canCreateWorld: boolean;
  /** Whether world creation is in progress */
  isCreating: boolean;
  /** Error from world creation attempt */
  createError: string | null;
  /** Slug of the created world (for navigation) */
  createdSlug: string | null;
  /** Trigger world creation from conversation messages */
  createWorld: (messages: Array<{ role: string; content: string }>) => Promise<void>;
  /** Update the user message count (called by the chat page) */
  updateCount: (count: number) => void;
}

export function useChatWorldMode(): WorldModeState {
  const searchParams = useSearchParams();
  const isWorldMode = searchParams.get('mode') === 'world';
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const countRef = useRef(0);

  // Track user message count for "ready to create" threshold
  const updateCount = useCallback((count: number) => {
    if (count !== countRef.current) {
      countRef.current = count;
      setMessageCount(count);
    }
  }, []);

  const canCreateWorld = isWorldMode && messageCount >= 2;

  const createWorld = useCallback(
    async (messages: Array<{ role: string; content: string }>) => {
      setIsCreating(true);
      setCreateError(null);
      try {
        // Build a description from the full conversation
        const description = messages
          .map((m) => `${m.role === 'user' ? 'Creator' : 'AI'}: ${m.content}`)
          .join('\n\n');

        const res = await fetch('/api/worlds/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: `Based on this world-building conversation, create a world:\n\n${description}`,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(data.error || 'Failed to create world');
        }

        const world = await res.json();
        setCreatedSlug(world.slug || world.id);
      } catch (err) {
        setCreateError(err instanceof Error ? err.message : 'World creation failed');
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return {
    isWorldMode,
    worldPrompt: WORLD_BUILDER_PROMPT,
    canCreateWorld,
    isCreating,
    createError,
    createdSlug,
    createWorld,
    updateCount,
  };
}
