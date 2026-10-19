"use client";

import { useEffect } from "react";
import { usePromptBooksStore } from "@/lib/prompt-books/store";
import { PromptBooksSync } from "@/lib/prompt-books/sync";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Main hook for initializing and using Prompt Books.
 * Call this once at the top-level prompt-books page.
 */
export function usePromptBooks(
  client: SupabaseClient | null,
  userId: string | null,
) {
  const store = usePromptBooksStore();
  const { initialize, reset } = store;
  useEffect(() => {
    if (!client || !userId) {
      reset();
      return;
    }
    void initialize(client, userId);
    const sync = new PromptBooksSync(client, userId);
    sync.subscribe();
    return () => {
      sync.unsubscribe();
      const current = usePromptBooksStore.getState();
      if (current._client === client && current._userId === userId) reset();
    };
  }, [client, userId, initialize, reset]);

  return store;
}
