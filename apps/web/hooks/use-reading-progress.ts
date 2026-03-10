'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ReadingProgress {
  text_slug: string;
  collection_slug: string;
  completed_at: string | null;
  progress_percent: number;
}

export function useReadingProgress(userId: string | null) {
  const [progress, setProgress] = useState<Record<string, ReadingProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const db = supabase as any;
    db.from('reading_progress')
      .select('text_slug, collection_slug, completed_at, progress_percent')
      .eq('user_id', userId)
      .then((result: any) => {
        const data: ReadingProgress[] | null = result?.data ?? null;
        if (data) {
          const map: Record<string, ReadingProgress> = {};
          data.forEach((item: ReadingProgress) => {
            map[item.text_slug] = item;
          });
          setProgress(map);
        }
        setIsLoading(false);
      });
  }, [userId]);

  const markComplete = useCallback(
    async (textSlug: string, collectionSlug: string) => {
      if (!userId) return;
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- table not yet in generated types
      const { error }: { error: Error | null } = await (supabase as any)
        .from('reading_progress')
        .upsert(
          {
            user_id: userId,
            text_slug: textSlug,
            collection_slug: collectionSlug,
            completed_at: new Date().toISOString(),
            progress_percent: 100,
          },
          { onConflict: 'user_id,text_slug' }
        );

      if (!error) {
        setProgress((prev) => ({
          ...prev,
          [textSlug]: {
            text_slug: textSlug,
            collection_slug: collectionSlug,
            completed_at: new Date().toISOString(),
            progress_percent: 100,
          },
        }));
      }
    },
    [userId]
  );

  const isComplete = useCallback(
    (textSlug: string) => {
      return progress[textSlug]?.completed_at != null;
    },
    [progress]
  );

  const getCollectionProgress = useCallback(
    (collectionSlug: string, totalTexts: number) => {
      const completed = Object.values(progress).filter(
        (p) => p.collection_slug === collectionSlug && p.completed_at
      ).length;
      return {
        completed,
        total: totalTexts,
        percent:
          totalTexts > 0 ? Math.round((completed / totalTexts) * 100) : 0,
      };
    },
    [progress]
  );

  return { progress, isLoading, markComplete, isComplete, getCollectionProgress };
}
