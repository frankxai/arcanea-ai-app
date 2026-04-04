'use client';

import { useEffect } from 'react';

interface ChatShortcutsDeps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
  hasMessages: boolean;
}

/**
 * Register global keyboard shortcuts for the chat page.
 * - Cmd+N: new chat
 * - Cmd+Shift+S: toggle sidebar
 * - Cmd+F: in-conversation search (only when messages exist)
 */
export function useChatShortcuts({
  onNewChat,
  onToggleSidebar,
  onToggleSearch,
  hasMessages,
}: ChatShortcutsDeps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Cmd+N -- new chat
      if (mod && e.key === 'n') {
        e.preventDefault();
        onNewChat();
      }

      // Cmd+Shift+S -- toggle sidebar
      if (mod && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        onToggleSidebar();
      }

      // Cmd+F -- in-conversation search
      if (mod && e.key === 'f' && hasMessages) {
        e.preventDefault();
        onToggleSearch();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewChat, onToggleSidebar, onToggleSearch, hasMessages]);
}
