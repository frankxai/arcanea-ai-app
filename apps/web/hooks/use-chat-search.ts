/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { UIMessage } from 'ai';
import { getMessageText } from '@/hooks/use-conversation';

export interface ChatSearchState {
  showSearch: boolean;
  inConvoSearchQuery: string;
  currentMatchIndex: number;
  totalMatches: number;
  setShowSearch: (v: boolean | ((prev: boolean) => boolean)) => void;
  handleSearchQueryChange: (query: string) => void;
  handleSearchNext: () => void;
  handleSearchPrev: () => void;
  handleSearchClose: () => void;
}

export function useChatSearch(messages: UIMessage[]): ChatSearchState {
  const [showSearch, setShowSearch] = useState(false);
  const [inConvoSearchQuery, setInConvoSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const totalMatches = useMemo(() => {
    if (!inConvoSearchQuery.trim()) return 0;
    const q = inConvoSearchQuery.toLowerCase();
    let count = 0;
    for (const msg of messages) {
      const text = getMessageText(msg).toLowerCase();
      let idx = 0;
      while ((idx = text.indexOf(q, idx)) !== -1) {
        count++;
        idx += q.length;
      }
    }
    return count;
  }, [inConvoSearchQuery, messages]);

  // Reset match index when query changes or total changes
  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [inConvoSearchQuery, totalMatches]);

  const handleSearchQueryChange = useCallback((query: string) => {
    setInConvoSearchQuery(query);
  }, []);

  const handleSearchNext = useCallback(() => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % totalMatches);
    }
  }, [totalMatches]);

  const handleSearchPrev = useCallback(() => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
    }
  }, [totalMatches]);

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setInConvoSearchQuery('');
    setCurrentMatchIndex(0);
  }, []);

  return {
    showSearch,
    inConvoSearchQuery,
    currentMatchIndex,
    totalMatches,
    setShowSearch,
    handleSearchQueryChange,
    handleSearchNext,
    handleSearchPrev,
    handleSearchClose,
  };
}
