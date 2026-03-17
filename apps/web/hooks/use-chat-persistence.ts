'use client';

/**
 * useChatPersistence — React hook for chat history persistence
 *
 * Manages localStorage-based chat sessions. Auto-saves messages
 * (debounced 1s) and auto-loads the most recent session on mount.
 *
 * When Supabase auth is configured later, this hook can be upgraded
 * to sync with the server while keeping localStorage as fallback.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  saveChatSession,
  loadChatSession,
  listChatSessions,
  deleteChatSession,
  newSessionId,
  generateSessionTitle,
  type ChatMessage,
  type ChatSession,
  type ChatSessionSummary,
} from '@/lib/chat/local-store';

export interface ChatPersistenceState {
  /** List of all saved sessions (summaries only) */
  sessions: ChatSessionSummary[];
  /** Currently active session ID */
  activeSessionId: string;
  /** Save messages to the active session (debounced internally) */
  saveMessages: (messages: ChatMessage[], opts?: { luminorId?: string | null; modelId?: string | null }) => void;
  /** Load a specific session by ID — returns the full session or null */
  loadSession: (id: string) => ChatSession | null;
  /** Start a new empty session — returns the new session ID */
  newSession: () => string;
  /** Delete a session by ID */
  deleteSession: (id: string) => void;
  /** Refresh the sessions list from localStorage */
  refreshSessions: () => void;
}

export function useChatPersistence(): ChatPersistenceState {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => newSessionId());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Load sessions list on mount
  // ---------------------------------------------------------------------------

  const refreshSessions = useCallback(() => {
    setSessions(listChatSessions());
  }, []);

  useEffect(() => {
    refreshSessions();
    mountedRef.current = true;
  }, [refreshSessions]);

  // ---------------------------------------------------------------------------
  // Save messages (debounced 1s)
  // ---------------------------------------------------------------------------

  const saveMessages = useCallback(
    (messages: ChatMessage[], opts?: { luminorId?: string | null; modelId?: string | null }) => {
      // Don't save empty conversations
      if (messages.length === 0) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        saveChatSession(activeSessionId, messages, opts);
        refreshSessions();
      }, 1000);
    },
    [activeSessionId, refreshSessions]
  );

  // ---------------------------------------------------------------------------
  // Load a session
  // ---------------------------------------------------------------------------

  const loadSessionFn = useCallback((id: string): ChatSession | null => {
    const session = loadChatSession(id);
    if (session) {
      setActiveSessionId(id);
    }
    return session;
  }, []);

  // ---------------------------------------------------------------------------
  // New session
  // ---------------------------------------------------------------------------

  const newSessionFn = useCallback((): string => {
    const id = newSessionId();
    setActiveSessionId(id);
    return id;
  }, []);

  // ---------------------------------------------------------------------------
  // Delete session
  // ---------------------------------------------------------------------------

  const deleteSessionFn = useCallback(
    (id: string) => {
      deleteChatSession(id);
      refreshSessions();

      // If deleting the active session, start a new one
      if (id === activeSessionId) {
        setActiveSessionId(newSessionId());
      }
    },
    [activeSessionId, refreshSessions]
  );

  // ---------------------------------------------------------------------------
  // Cleanup debounce on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    sessions,
    activeSessionId,
    saveMessages,
    loadSession: loadSessionFn,
    newSession: newSessionFn,
    deleteSession: deleteSessionFn,
    refreshSessions,
  };
}
