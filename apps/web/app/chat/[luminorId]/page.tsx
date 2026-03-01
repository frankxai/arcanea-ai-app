'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  PhList,
  PhX,
  PhWarningCircle,
  PhArrowLeft,
  PhPlus,
  PhChatCircle,
  PhCircleNotch,
} from '@/lib/phosphor-icons';
import { LuminorHeader } from '@/components/chat/luminor-header';
import { ChatContainer } from '@/components/chat/chat-container';
import { ChatInput } from '@/components/chat/chat-input';
import { ContextSidebar } from '@/components/chat/context-sidebar';
import { QuickActions } from '@/components/chat/quick-actions';
import { useChat } from '@/hooks/use-chat';
import { getLuminor } from '@/lib/luminors/config';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SessionListItem {
  id: string;
  title: string | null;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a stable guest ID so the chat hook has a userId even
 * when Supabase auth is not configured or the user is not logged in.
 */
function getGuestId(): string {
  if (typeof window === 'undefined') return 'guest';
  const key = 'arcanea-guest-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Sessions sidebar
// ---------------------------------------------------------------------------

interface SessionsSidebarProps {
  luminorId: string;
  luminorColor: string;
  activeSessionId: string | null;
  isAuthenticated: boolean;
  onNewSession: () => void;
  onSessionSelect: (sessionId: string) => void;
}

function SessionsSidebar({
  luminorId,
  luminorColor,
  activeSessionId,
  isAuthenticated,
  onNewSession,
  onSessionSelect,
}: SessionsSidebarProps) {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/chat/sessions?userId=${encodeURIComponent('me')}&luminorId=${encodeURIComponent(luminorId)}`
      );
      if (res.ok) {
        const json = await res.json();
        // Support both { data } (new) and { sessions } (legacy) response shapes
        const list = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.sessions)
          ? json.sessions
          : [];
        setSessions(
          list.map(
            (s: { id: string; title: string | null; updatedAt: string }) => ({
              id: s.id,
              title: s.title,
              updatedAt: s.updatedAt,
            })
          )
        );
      }
    } catch {
      // Non-critical
    } finally {
      setLoading(false);
    }
  }, [luminorId, isAuthenticated]);

  // Reload when the active session changes (e.g. after new session is created)
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, activeSessionId]);

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-white/[0.06] bg-cosmic-deep/60 backdrop-blur-sm shrink-0">
      {/* New chat button */}
      <div className="p-3 border-b border-white/[0.06]">
        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono font-semibold
            border border-white/[0.08] text-text-secondary
            hover:border-white/[0.15] hover:text-text-primary transition-all duration-200"
        >
          <PhPlus className="w-4 h-4" />
          New chat
        </button>
      </div>

      {/* Session list */}
      <div
        className="flex-1 overflow-y-auto p-2 space-y-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: `${luminorColor}40 transparent` }}
      >
        {!isAuthenticated ? (
          <p className="px-3 py-4 text-xs text-text-muted font-body text-center leading-relaxed">
            Sign in to save your conversation history
          </p>
        ) : loading ? (
          <div className="flex justify-center pt-6">
            <PhCircleNotch
              className="w-4 h-4 animate-spin"
              style={{ color: luminorColor }}
            />
          </div>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-4 text-xs text-text-muted font-body text-center">
            No previous conversations yet
          </p>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group"
                style={
                  isActive
                    ? {
                        backgroundColor: `${luminorColor}18`,
                        borderLeft: `2px solid ${luminorColor}`,
                      }
                    : {}
                }
              >
                <div
                  className={`flex items-start gap-2 ${
                    isActive ? '' : 'text-text-secondary group-hover:text-text-primary'
                  }`}
                >
                  <PhChatCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-60" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-mono leading-snug">
                      {session.title ?? 'Untitled session'}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {formatSessionDate(session.updatedAt)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const luminorId = params.luminorId as string;

  // Resolve auth state — never crashes if Supabase is not configured
  const [userId, setUserId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveUser() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          if (data.session?.user) {
            setUserId(data.session.user.id);
            setIsAuthenticated(true);
          } else {
            setUserId(getGuestId());
            setIsAuthenticated(false);
          }
          setAuthReady(true);
        }
      } catch {
        if (!cancelled) {
          setUserId(getGuestId());
          setIsAuthenticated(false);
          setAuthReady(true);
        }
      }
    }

    resolveUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const [contextSidebarOpen, setContextSidebarOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Luminor config
  const luminorConfig = useMemo(() => getLuminor(luminorId), [luminorId]);

  // Redirect if invalid Luminor
  useEffect(() => {
    if (luminorId && !luminorConfig) {
      router.push('/chat');
    }
  }, [luminorId, luminorConfig, router]);

  // Chat hook
  const {
    messages,
    isStreaming,
    streamingContent,
    streamingEmotionalTone,
    thinkingState,
    bondState,
    sessionId,
    sendMessage,
    startNewSession,
    loadMore,
    hasMore,
    isLoadingMore,
    error,
    clearError,
  } = useChat({
    luminorId,
    userId,
    systemPrompt: luminorConfig?.systemPrompt,
  });

  // Hide quick actions after first message
  useEffect(() => {
    if (messages.length > 0) {
      setShowQuickActions(false);
    }
  }, [messages.length]);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    sendMessage(content, attachments);
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
    setShowQuickActions(false);
  };

  const handleNewSession = () => {
    startNewSession();
    setShowQuickActions(true);
  };

  // Loading session history from a sidebar tap is handled by reloading chat
  // history for the selected session. We pass a luminorId-scoped view, so
  // for now switching sessions simply means starting a new session since the
  // history API loads the most-recent session automatically. A future
  // enhancement would pass sessionId as a query param to /api/chat/history.
  const handleSessionSelect = (_sessionId: string) => {
    // For now, this is a no-op hint for future deep-link per-session support.
    // The sidebar's active highlight already reflects the current sessionId.
  };

  // Loading state
  if (!authReady || !luminorConfig) {
    return (
      <div className="flex items-center justify-center h-screen bg-cosmic-deep">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">{luminorConfig?.avatar ?? '...'}</span>
          </div>
          <p className="text-text-secondary font-body">
            {!authReady ? 'Preparing session...' : 'Loading Intelligence...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-cosmic-deep">
      {/* Header */}
      <LuminorHeader
        name={luminorConfig.name}
        tagline={luminorConfig.tagline}
        academy={luminorConfig.academy}
        color={luminorConfig.color}
        avatar={luminorConfig.avatar}
        bondLevel={bondState.level}
        bondXP={bondState.xp}
        xpToNextLevel={bondState.xpToNextLevel}
        relationshipStatus={bondState.relationshipStatus}
        status={
          isStreaming
            ? 'generating'
            : thinkingState !== 'idle'
            ? 'thinking'
            : 'active'
        }
        onBondClick={() => setContextSidebarOpen(true)}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <PhWarningCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-300">
              <PhX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content — sessions sidebar + chat area + context sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sessions Sidebar (desktop only) */}
        <SessionsSidebar
          luminorId={luminorId}
          luminorColor={luminorConfig.color}
          activeSessionId={sessionId}
          isAuthenticated={isAuthenticated}
          onNewSession={handleNewSession}
          onSessionSelect={handleSessionSelect}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Quick Actions */}
          {showQuickActions && messages.length === 0 && (
            <QuickActions
              luminorName={luminorConfig.name}
              luminorSlug={luminorId}
              luminorColor={luminorConfig.color}
              onActionClick={handleQuickAction}
            />
          )}

          {/* Messages */}
          <ChatContainer
            messages={messages}
            luminorName={luminorConfig.name}
            luminorColor={luminorConfig.color}
            luminorAvatar={luminorConfig.avatar}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            streamingEmotionalTone={streamingEmotionalTone}
            thinkingState={thinkingState}
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />

          {/* Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={isStreaming || thinkingState !== 'idle'}
            placeholder={`Share your thoughts with ${luminorConfig.name}...`}
            luminorColor={luminorConfig.color}
          />
        </div>

        {/* Context Sidebar (bond/memory) */}
        <ContextSidebar
          luminorName={luminorConfig.name}
          luminorColor={luminorConfig.color}
          bondLevel={bondState.level}
          bondXP={bondState.xp}
          xpToNextLevel={bondState.xpToNextLevel}
          relationshipStatus={bondState.relationshipStatus}
          keyMoments={[]}
          recentTopics={[]}
          creatorPreferences={{}}
          isOpen={contextSidebarOpen}
          onClose={() => setContextSidebarOpen(false)}
        />
      </div>

      {/* Mobile FABs: back to selection + context sidebar toggle */}
      <div className="lg:hidden fixed bottom-24 right-6 flex flex-col gap-3 z-30">
        <Link
          href="/chat"
          className="w-12 h-12 rounded-full bg-gray-800/90 backdrop-blur-sm border border-gray-700 flex items-center justify-center shadow-lg"
        >
          <PhArrowLeft className="w-5 h-5 text-gray-300" />
        </Link>
        <button
          onClick={() => setContextSidebarOpen(!contextSidebarOpen)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: luminorConfig.color,
            boxShadow: `0 4px 20px ${luminorConfig.color}60`,
          }}
        >
          {contextSidebarOpen ? (
            <PhX className="w-6 h-6 text-white" />
          ) : (
            <PhList className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
