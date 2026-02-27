'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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

/**
 * Try to get an auth token from Supabase.
 * Returns null if Supabase is not configured or the user is not logged in.
 * Never throws.
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
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

  const abortControllerRef = useRef<AbortController | null>(null);

  // Try to load chat history (non-critical - fails silently)
  const loadChatHistory = useCallback(async () => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;

      const response = await fetch(
        `/api/chat/history?luminorId=${luminorId}&userId=${userId}&limit=50`,
        { headers }
      );
      if (!response.ok) {
        // History endpoint may not exist or may fail — that is fine
        setIsConnected(true);
        return;
      }

      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(
          data.messages
            .map((msg: Record<string, unknown>) => ({
              id: typeof msg.id === 'string' ? msg.id : `msg-${Date.now()}`,
              role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
              content: typeof msg.content === 'string' ? msg.content : '',
              timestamp: msg.timestamp ? new Date(String(msg.timestamp)) : new Date(),
              status: 'sent' as const,
            }))
            .filter((msg: Message) => Boolean(msg.content))
        );
      }
      if (data.bondState) {
        setBondState(data.bondState);
      }
      setHasMore(data.hasMore || false);
      setIsConnected(true);
    } catch {
      // History loading failed — start with empty history, no error shown
      setIsConnected(true);
    }
  }, [luminorId, userId]);

  // Load initial chat history
  useEffect(() => {
    if (userId) {
      loadChatHistory();
    }
  }, [loadChatHistory, userId]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;

      const response = await fetch(
        `/api/chat/history?luminorId=${luminorId}&userId=${userId}&before=${oldestMessage?.id}&limit=50`,
        { headers }
      );
      if (!response.ok) throw new Error('Failed to load more messages');

      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        const older = data.messages
          .map((msg: Record<string, unknown>) => ({
            id: typeof msg.id === 'string' ? msg.id : `msg-${Date.now()}`,
            role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
            content: typeof msg.content === 'string' ? msg.content : '',
            timestamp: msg.timestamp ? new Date(String(msg.timestamp)) : new Date(),
            status: 'sent' as const,
          }))
          .filter((msg: Message) => Boolean(msg.content));
        setMessages((prev) => [...older, ...prev]);
      }
      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error('Failed to load more messages:', err);
      setError('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  }, [luminorId, userId, messages, hasMore, isLoadingMore]);

  const sendMessage = useCallback(
    async (content: string, _attachments?: File[]) => {
      if (!content.trim()) return;

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
      setError(null);

      // Build the messages payload (last 10 messages for context)
      const recentMessages = messages.slice(-10).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));
      const payload = {
        messages: [...recentMessages, { role: 'user' as const, content }],
        systemPrompt,
      };

      try {
        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        const token = await getAuthToken();
        const headers: Record<string, string> = {
          'content-type': 'application/json',
        };
        if (token) headers.authorization = `Bearer ${token}`;

        // Send message and start streaming
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Request failed with status ${response.status}`
          );
        }

        // Update user message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );

        // Persist user message (fire and forget)
        persistMessages([{ ...userMessage, status: 'sent' }]);

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        setIsStreaming(true);
        setStreamingContent('');
        setThinkingState('idle');
        let fullContent = '';

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
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Persist assistant message (fire and forget)
        persistMessages([assistantMessage]);

        setIsStreaming(false);
        setStreamingContent('');
        setThinkingState('idle');
        setIsConnected(true);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, ignore
          return;
        }

        console.error('Failed to send message:', err);

        // Update user message status to error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
          )
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to send message. Please try again.'
        );
        setIsStreaming(false);
        setStreamingContent('');
        setThinkingState('idle');
      }
    },
    [messages, apiEndpoint, systemPrompt]
  );

  // Fire-and-forget persistence — never throws
  const persistMessages = useCallback(async (msgs: Message[]) => {
    if (!msgs.length) return;
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'content-type': 'application/json' };
      if (token) headers.authorization = `Bearer ${token}`;

      await fetch('/api/chat/history', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          luminorId,
          userId,
          messages: msgs.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
      });
    } catch {
      // Persistence is best-effort
    }
  }, [luminorId, userId]);

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
