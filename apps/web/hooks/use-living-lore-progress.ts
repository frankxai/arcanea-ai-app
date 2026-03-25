'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CrewBond, LivingLoreProgress } from '@/lib/living-lore/types';

interface LivingLoreState {
  progress: LivingLoreProgress[];
  bonds: CrewBond[];
  loading: boolean;
  error: string | null;
}

/**
 * Client-side hook for fetching and managing Living Lore progress.
 * Fetches from /api/living-lore/progress and /api/living-lore/bonds.
 */
export function useLivingLoreProgress() {
  const [state, setState] = useState<LivingLoreState>({
    progress: [],
    bonds: [],
    loading: true,
    error: null,
  });

  // Fetch both progress and bonds on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const [progressRes, bondsRes] = await Promise.all([
          fetch('/api/living-lore/progress'),
          fetch('/api/living-lore/bonds'),
        ]);

        // If unauthorized (not logged in), return empty data without error
        if (progressRes.status === 401 || bondsRes.status === 401) {
          if (!cancelled) {
            setState({ progress: [], bonds: [], loading: false, error: null });
          }
          return;
        }

        const [progressData, bondsData] = await Promise.all([
          progressRes.json(),
          bondsRes.json(),
        ]);

        if (!cancelled) {
          // Map snake_case API response to camelCase types
          const progress: LivingLoreProgress[] = (progressData.progress ?? []).map(
            (p: Record<string, unknown>) => ({
              contentType: p.content_type as string,
              contentSlug: p.content_slug as string,
              actNumber: p.act_number as number,
              startedAt: p.started_at as string,
              completedAt: (p.completed_at as string) ?? null,
              choices: (p.choices as Record<string, unknown>) ?? {},
              xpAwarded: p.xp_awarded as number,
            })
          );

          const bonds: CrewBond[] = (bondsData.bonds ?? []).map(
            (b: Record<string, unknown>) => ({
              crewMemberId: b.crew_member_id as string,
              bondLevel: b.bond_level as number,
              conversations: b.conversations as number,
              encountersShared: b.encounters_shared as number,
              lastInteraction: (b.last_interaction as string) ?? null,
            })
          );

          setState({ progress, bonds, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load progress',
          }));
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Record completion of an episode or encounter.
   */
  const recordProgress = useCallback(
    async (contentType: 'episode' | 'encounter', contentSlug: string, actNumber: number) => {
      try {
        const res = await fetch('/api/living-lore/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType, contentSlug, actNumber }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        // Optimistically add to local state
        const newEntry: LivingLoreProgress = {
          contentType,
          contentSlug,
          actNumber,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          choices: {},
          xpAwarded: data.xpAwarded ?? 0,
        };

        setState((prev) => {
          const filtered = prev.progress.filter((p) => p.contentSlug !== contentSlug);
          return { ...prev, progress: [...filtered, newEntry] };
        });

        return data;
      } catch {
        return null;
      }
    },
    []
  );

  /**
   * Update bond with a crew member after an interaction.
   */
  const updateBond = useCallback(
    async (crewMemberId: string, interactionType: 'chat' | 'encounter' | 'lore_read') => {
      try {
        const res = await fetch('/api/living-lore/bonds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crewMemberId, interactionType }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        // Optimistically update local state
        setState((prev) => {
          const existing = prev.bonds.findIndex((b) => b.crewMemberId === crewMemberId);
          const updated: CrewBond = {
            crewMemberId,
            bondLevel: data.newLevel ?? 0,
            conversations: interactionType === 'chat'
              ? (prev.bonds[existing]?.conversations ?? 0) + 1
              : prev.bonds[existing]?.conversations ?? 0,
            encountersShared: interactionType === 'encounter'
              ? (prev.bonds[existing]?.encountersShared ?? 0) + 1
              : prev.bonds[existing]?.encountersShared ?? 0,
            lastInteraction: new Date().toISOString(),
          };

          const bonds = [...prev.bonds];
          if (existing >= 0) {
            bonds[existing] = updated;
          } else {
            bonds.push(updated);
          }
          return { ...prev, bonds };
        });

        return data;
      } catch {
        return null;
      }
    },
    []
  );

  /** Filter progress for completed episodes. */
  const getCompletedEpisodes = useCallback(() => {
    return state.progress.filter(
      (p) => p.contentType === 'episode' && p.completedAt !== null
    );
  }, [state.progress]);

  /** Filter progress for completed encounters. */
  const getCompletedEncounters = useCallback(() => {
    return state.progress.filter(
      (p) => p.contentType === 'encounter' && p.completedAt !== null
    );
  }, [state.progress]);

  /** Find the bond for a specific crew member. */
  const getBondForMember = useCallback(
    (memberId: string): CrewBond | undefined => {
      return state.bonds.find((b) => b.crewMemberId === memberId);
    },
    [state.bonds]
  );

  /** Sum of all XP awarded. */
  const totalXp = useMemo(
    () => state.progress.reduce((sum, p) => sum + p.xpAwarded, 0),
    [state.progress]
  );

  return {
    ...state,
    recordProgress,
    updateBond,
    getCompletedEpisodes,
    getCompletedEncounters,
    getBondForMember,
    totalXp,
  };
}
