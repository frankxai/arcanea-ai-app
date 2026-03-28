'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteChatSession,
  listChatSessions,
  loadChatSession,
  mergeChatSessions,
  newSessionId,
  renameChatSession,
  saveChatSession,
  searchSessions,
  togglePinSession,
  type ChatMessage,
  type ChatSession,
  type ChatSessionSummary,
} from '@/lib/chat/local-store';
import {
  cloudSessionToLocalSession,
  deleteCloudSession,
  loadCloudSessions,
  renameCloudSession,
  saveSessionToCloud,
} from '@/lib/chat/supabase-store';

const SIDEBAR_KEY = 'arcanea-sidebar-expanded';
const MOBILE_BREAKPOINT = 768;

function getInitialExpanded(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) return stored === 'true';
    return window.innerWidth >= MOBILE_BREAKPOINT;
  } catch {
    return false;
  }
}

function persistExpanded(value: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SIDEBAR_KEY, String(value));
  } catch {
    // ignore localStorage failures
  }
}

export interface UseChatSessionsReturn {
  sessions: ChatSessionSummary[];
  activeSessionId: string;
  isSidebarExpanded: boolean;
  searchQuery: string;
  isHydrating: boolean;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  setActiveSession: (sessionId: string) => void;
  loadSession: (id: string) => ChatSession | null;
  saveMessages: (
    messages: ChatMessage[],
    opts?: { luminorId?: string | null; modelId?: string | null },
  ) => void;
  newSession: () => string;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  togglePin: (id: string) => void;
  refreshSessions: () => Promise<void>;
}

export function useChatSessions(): UseChatSessionsReturn {
  const [activeSessionId, setActiveSessionId] = useState<string>(() => newSessionId());
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => getInitialExpanded());
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrating, setIsHydrating] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncCloudSessions = useCallback(async () => {
    const cloudSessions = await loadCloudSessions();
    if (cloudSessions.length === 0) return;

    mergeChatSessions(cloudSessions.map(cloudSessionToLocalSession));
  }, []);

  const refreshSessions = useCallback(async () => {
    setRefreshTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      await syncCloudSessions();
      if (!cancelled) {
        setRefreshTick((tick) => tick + 1);
        setIsHydrating(false);
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [refreshSessions, syncCloudSessions]);

  useEffect(() => {
    function handleFocus() {
      void syncCloudSessions()
        .then(() => {
          setRefreshTick((tick) => tick + 1);
        })
        .catch(() => {});
    }

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshSessions, syncCloudSessions]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const setActiveSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const loadSession = useCallback((id: string): ChatSession | null => {
    const session = loadChatSession(id);
    if (session) {
      setActiveSessionId(id);
    }
    return session;
  }, []);

  const saveMessages = useCallback((
    messages: ChatMessage[],
    opts?: { luminorId?: string | null; modelId?: string | null },
  ) => {
    if (messages.length === 0) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      saveChatSession(activeSessionId, messages, opts);
      refreshSessions();

      void saveSessionToCloud({
        id: activeSessionId,
        title: loadChatSession(activeSessionId)?.title || 'New Chat',
        messages: messages as unknown as Record<string, unknown>[],
        luminorId: opts?.luminorId ?? null,
        modelId: opts?.modelId ?? null,
      });
    }, 600);
  }, [activeSessionId, refreshSessions]);

  const newSession = useCallback(() => {
    const id = newSessionId();
    setActiveSessionId(id);
    return id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    deleteChatSession(id);
    void deleteCloudSession(id);

    if (id === activeSessionId) {
      setActiveSessionId(newSessionId());
    }

    refreshSessions();
  }, [activeSessionId, refreshSessions]);

  const renameSession = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    renameChatSession(id, trimmed);
    void renameCloudSession(id, trimmed);
    refreshSessions();
  }, [refreshSessions]);

  const togglePin = useCallback((id: string) => {
    togglePinSession(id);
    refreshSessions();
  }, [refreshSessions]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      persistExpanded(next);
      return next;
    });
  }, []);

  const stableSessions = useMemo<ChatSessionSummary[]>(() => {
    void refreshTick;
    return searchQuery.trim()
      ? searchSessions(searchQuery)
      : listChatSessions();
  }, [refreshTick, searchQuery]);

  return {
    sessions: stableSessions,
    activeSessionId,
    isSidebarExpanded,
    searchQuery,
    isHydrating,
    setSearchQuery,
    toggleSidebar,
    setActiveSession,
    loadSession,
    saveMessages,
    newSession,
    deleteSession,
    renameSession,
    togglePin,
    refreshSessions,
  };
}
