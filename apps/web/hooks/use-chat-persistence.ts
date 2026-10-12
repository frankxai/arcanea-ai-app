/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useChatSessions } from "./use-chat-sessions";
import type {
  ChatMessage,
  ChatSession,
  ChatSessionSummary,
} from "@/lib/chat/local-store";

export interface ChatPersistenceState {
  /** List of all saved sessions (summaries only) */
  sessions: ChatSessionSummary[];
  /** Currently active session ID */
  activeSessionId: string;
  /** Save messages to the active session (debounced internally) */
  saveMessages: (
    messages: ChatMessage[],
    opts?: { luminorId?: string | null; modelId?: string | null },
  ) => void;
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
  const history = useChatSessions();
  return {
    sessions: history.allSessions,
    activeSessionId: history.activeSessionId,
    saveMessages: history.saveMessages,
    loadSession: history.loadSession,
    newSession: history.newSession,
    deleteSession: history.deleteSession,
    refreshSessions: () => {
      void history.refreshSessions();
    },
  };
}
