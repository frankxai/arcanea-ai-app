'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

// Emotional tone type (inlined from ai-core)
export type EmotionalTone =
  | 'warm'
  | 'enthusiastic'
  | 'contemplative'
  | 'encouraging'
  | 'curious'
  | 'playful'
  | 'wise'
  | 'empathetic'
  | 'challenging'
  | 'celebratory';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalTone?: EmotionalTone;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    caption?: string;
  }[];
  status?: 'sending' | 'sent' | 'error';
}

interface BondState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  relationshipStatus: string;
}

interface UseChatOptions {
  luminorId: string;
  userId: string;
  apiEndpoint?: string;
  /** Luminor-specific system prompt injected on every request. */
  systemPrompt?: string;
}

interface UseChatReturn {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  streamingEmotionalTone?: EmotionalTone;
  thinkingState: 'idle' | 'thinking' | 'generating' | 'analyzing' | 'creating';
  bondState: BondState;
  sendMessage: (content: string, attachments?: File[]) => void;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  error: string | null;
  clearError: () => void;
  reconnect: () => void;
  isConnected: boolean;
}

export function useChat({
  luminorId,
  userId,
  apiEndpoint = '/api/ai/chat',
  systemPrompt,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingEmotionalTone, setStreamingEmotionalTone] = useState<EmotionalTone>();
  const [thinkingState, setThinkingState] = useState<'idle' | 'thinking' | 'generating' | 'analyzing' | 'creating'>('idle');
  const [bondState, setBondState] = useState<BondState>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    relationshipStatus: 'stranger',
  });
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const supabaseRef = useRef(createClient());

  const getAuthHeader = useCallback(async () => {
    const { data } = await supabaseRef.current.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      return null;
    }
    return `Bearer ${token}`;
  }, []);

  const hydrateMessages = useCallback((raw: Array<Record<string, unknown>>): Message[] => {
    return raw
      .map((msg) => ({
        id: typeof msg.id === 'string' ? msg.id : `msg-${Date.now()}`,
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: typeof msg.content === 'string' ? msg.content : '',
        timestamp: msg.timestamp ? new Date(String(msg.timestamp)) : new Date(),
        emotionalTone: msg.emotionalTone as EmotionalTone | undefined,
        status: 'sent' as const,
      }))
      .filter((msg) => Boolean(msg.content));
  }, []);

  const persistMessages = useCallback(async (persistedMessages: Message[]) => {
    if (!persistedMessages.length) return;
    const authHeader = await getAuthHeader();
    await fetch('/api/chat/history', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(authHeader ? { authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        luminorId,
        userId,
        messages: persistedMessages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.toISOString(),
        })),
      }),
    }).catch((error) => {
      console.warn('Failed to persist chat history:', error);
    });
  }, [getAuthHeader, luminorId, userId]);

  // Memoize loadChatHistory to prevent recreating on every render
  const loadChatHistory = useCallback(async () => {
    try {
      const authHeader = await getAuthHeader();
      const response = await fetch(
        `/api/chat/history?luminorId=${luminorId}&userId=${userId}&limit=50`,
        {
          headers: authHeader ? { authorization: authHeader } : {},
        }
      );
      if (!response.ok) throw new Error('Failed to load chat history');

      const data = await response.json();
      setMessages(hydrateMessages(data.messages || []));
      setBondState(data.bondState || {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        relationshipStatus: 'stranger',
      });
      setHasMore(data.hasMore || false);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Don't set error - just start with empty history
    }
  }, [luminorId, userId]);

  // Load initial chat history
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const authHeader = await getAuthHeader();
      const response = await fetch(
        `/api/chat/history?luminorId=${luminorId}&userId=${userId}&before=${oldestMessage?.id}&limit=50`,
        {
          headers: authHeader ? { authorization: authHeader } : {},
        }
      );
      if (!response.ok) throw new Error('Failed to load more messages');

      const data = await response.json();
      setMessages((prev) => [...hydrateMessages(data.messages || []), ...prev]);
      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error('Failed to load more messages:', err);
      setError('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  }, [luminorId, userId, messages, hasMore, isLoadingMore, getAuthHeader, hydrateMessages]);

  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      // Add user message optimistically
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, userMessage]);
      setThinkingState('thinking');

      if (attachments && attachments.length > 0) {
        console.warn('Chat attachments are not yet supported by /api/ai/chat. Sending text only.');
      }

      const recentMessages = messages.slice(-5).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content,
      }));
      const payload = {
        messages: [...recentMessages, { role: 'user' as const, content }],
        systemPrompt,
        stream: true,
      };

      try {
        // Create abort controller for this request
        abortControllerRef.current = new AbortController();
        const authHeader = await getAuthHeader();

        // Send message and start streaming
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(authHeader ? { authorization: authHeader } : {}),
          },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update user message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
        void persistMessages([{ ...userMessage, status: 'sent' }]);

        // Handle SSE streaming
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        setIsStreaming(true);
        setStreamingContent('');
        setThinkingState('idle');
        let fullContent = '';
        let currentEmotionalTone: EmotionalTone | undefined = undefined;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }

        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: fullContent,
          timestamp: new Date(),
          emotionalTone: currentEmotionalTone,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        void persistMessages([assistantMessage]);

        setIsStreaming(false);
        setStreamingContent('');
        setThinkingState('idle');
        setIsConnected(true);
      } catch (err: unknown) {
        console.error('Failed to send message:', err);

        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, ignore
          return;
        }

        // Update user message status to error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
          )
        );

        setError('Failed to send message. Please try again.');
        setIsStreaming(false);
        setStreamingContent('');
        setThinkingState('idle');
        setIsConnected(false);
      }
    },
    [luminorId, userId, messages, apiEndpoint, systemPrompt, getAuthHeader, persistMessages]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reconnect = useCallback(() => {
    setIsConnected(false);
    loadChatHistory();
  }, [loadChatHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
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
    reconnect,
    isConnected,
  };
}

export default useChat;
