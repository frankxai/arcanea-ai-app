'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PhList, PhX, PhWarningCircle, PhArrowLeft } from '@/lib/phosphor-icons';
import { LuminorHeader } from '@/components/chat/luminor-header';
import { ChatContainer } from '@/components/chat/chat-container';
import { ChatInput } from '@/components/chat/chat-input';
import { ContextSidebar } from '@/components/chat/context-sidebar';
import { QuickActions } from '@/components/chat/quick-actions';
import { useChat } from '@/hooks/use-chat';
import { getLuminor } from '@/lib/luminors/config';
import Link from 'next/link';

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

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const luminorId = params.luminorId as string;

  // Try to get auth context, but don't crash if AuthProvider is missing or auth fails
  const [userId, setUserId] = useState<string>('');
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveUser() {
      // Try dynamic import to avoid hard crash if Supabase is not configured
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          if (data.session?.user) {
            setUserId(data.session.user.id);
          } else {
            setUserId(getGuestId());
          }
          setAuthReady(true);
        }
      } catch {
        // Supabase not configured or auth failed — use guest ID
        if (!cancelled) {
          setUserId(getGuestId());
          setAuthReady(true);
        }
      }
    }

    resolveUser();
    return () => { cancelled = true; };
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Get Luminor config
  const luminorConfig = useMemo(() => getLuminor(luminorId), [luminorId]);

  // Redirect if invalid Luminor
  useEffect(() => {
    if (luminorId && !luminorConfig) {
      router.push('/chat');
    }
  }, [luminorId, luminorConfig, router]);

  // Chat hook — pass Luminor's system prompt so every request carries persona context
  const {
    messages,
    isStreaming,
    streamingContent,
    streamingEmotionalTone,
    thinkingState,
    bondState,
    sendMessage,
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

  // Loading state
  if (!authReady || !luminorConfig) {
    return (
      <div className="flex items-center justify-center h-screen bg-cosmic-deep">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">
              {luminorConfig?.avatar || '...'}
            </span>
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
        onBondClick={() => setSidebarOpen(true)}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <PhWarningCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300"
            >
              <PhX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
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

        {/* Sidebar */}
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
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile: Back to selection + sidebar toggle */}
      <div className="lg:hidden fixed bottom-24 right-6 flex flex-col gap-3 z-30">
        <Link
          href="/chat"
          className="w-12 h-12 rounded-full bg-gray-800/90 backdrop-blur-sm border border-gray-700 flex items-center justify-center shadow-lg"
        >
          <PhArrowLeft className="w-5 h-5 text-gray-300" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: luminorConfig.color,
            boxShadow: `0 4px 20px ${luminorConfig.color}60`,
          }}
        >
          {sidebarOpen ? (
            <PhX className="w-6 h-6 text-white" />
          ) : (
            <PhList className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
