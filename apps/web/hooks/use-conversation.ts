'use client';

/**
 * useConversation — Manages chat conversation state
 *
 * Extracted from the chat page to reduce component complexity.
 * Handles: messages, streaming, model selection, luminor activation,
 * follow-up parsing, and conversation lifecycle.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useModelSelection } from './use-provider';
import { getFocusModeById } from '@/components/chat/focus-modes';
import { classifyIntent } from '@/lib/ai/router';
import { CHAT_MODELS } from '@/components/chat/model-selector';
import { getLuminor, type LuminorConfig } from '@/lib/luminors/config';

// ---------------------------------------------------------------------------
// Helpers (pure functions, co-located with their consumer)
// ---------------------------------------------------------------------------

export function getMessageText(msg: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  // AI SDK v6: prefer parts (structured), fallback to content (plain string)
  if (msg.parts && msg.parts.length > 0) {
    const text = msg.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('');
    if (text) return text;
  }
  // Fallback: some transports populate content as a plain string
  if (typeof msg.content === 'string') return msg.content;
  return '';
}

/** Extract [FOLLOW_UP] suggestions from response text and return clean text + suggestions */
export function parseFollowUps(text: string): { clean: string; followUps: string[] } {
  const lines = text.split('\n');
  const followUps: string[] = [];
  const cleanLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\[FOLLOW_UP\]\s*(.+)/);
    if (match) {
      followUps.push(match[1].trim());
    } else {
      cleanLines.push(line);
    }
  }

  // Remove trailing empty lines from clean text
  while (cleanLines.length > 0 && cleanLines[cleanLines.length - 1].trim() === '') {
    cleanLines.pop();
  }

  return { clean: cleanLines.join('\n'), followUps };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActiveLuminor {
  id: string;
  name: string;
  title: string;
  tagline?: string;
  systemPrompt: string;
  preferredModel?: string;
  color?: string;
  avatar?: string;
}

export interface ConversationState {
  // Messages
  messages: any[];
  status: string;
  error: Error | null;
  sendMessage: (opts: { text: string }) => void;
  setMessages: (msgs: any[]) => void;

  // Input
  input: string;
  setInput: (v: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  // Model
  modelId: string;
  setModelId: (id: string) => void;
  providerLabel: string;
  provider: string;
  clientApiKey: string | undefined;

  // Focus
  focusMode: string;
  setFocusMode: (mode: string) => void;
  focusHint: string;

  // Luminor
  activeLuminor: ActiveLuminor | null;
  handleSelectLuminor: (luminor: LuminorConfig) => void;

  // State
  isLoading: boolean;
  isStreaming: boolean;
  isThinking: boolean;
  isEmpty: boolean;
  chatError: string | null;
  setChatError: (err: string | null) => void;

  // Copy
  copiedId: string | null;
  handleCopy: (msgId: string, text: string) => Promise<void>;

  // Gates
  activeGates: string[];

  // Beam
  beamPrompt: string | null;
  setBeamPrompt: (prompt: string | null) => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Actions
  handleSubmit: (e: React.FormEvent) => void;
  handleRetry: () => void;
  handleRegenerate: () => void;
  startNewChat: () => void;

  // Derived
  lastMsg: any;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConversation(): ConversationState {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');
  const luminorId = searchParams.get('luminor');
  const { provider, clientApiKey, label: providerLabel, modelId, setModelId } = useModelSelection();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [input, setInput] = useState('');
  const [activeGates, setActiveGates] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState('auto');
  const [beamPrompt, setBeamPrompt] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [initialSent, setInitialSent] = useState(false);

  // Active Luminor from Sanctum ("Use in Chat")
  const [activeLuminor, setActiveLuminor] = useState<ActiveLuminor | null>(null);

  // ---------------------------------------------------------------------------
  // Resolve Luminor from URL param — use local config for Chosen, API for custom
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!luminorId) return;
    const chosen = getLuminor(luminorId);
    if (chosen) {
      setActiveLuminor({
        id: chosen.id,
        name: chosen.name,
        title: chosen.title,
        tagline: chosen.tagline,
        systemPrompt: chosen.systemPrompt,
        color: chosen.color,
        avatar: chosen.avatar,
      });
      return;
    }
    fetch(`/api/luminors/${luminorId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setActiveLuminor({
            id: data.id,
            name: data.name,
            title: data.title,
            tagline: data.tagline,
            systemPrompt: data.system_prompt,
            preferredModel: data.preferred_model,
            color: data.color,
            avatar: data.avatar,
          });
          if (data.preferred_model && data.preferred_model !== 'arcanea-auto') {
            setModelId(data.preferred_model);
          }
        }
      })
      .catch(() => { /* Luminor not found — use default chat */ });
  }, [luminorId, setModelId]);

  // ---------------------------------------------------------------------------
  // Input handler
  // ---------------------------------------------------------------------------

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // ---------------------------------------------------------------------------
  // Focus mode hint
  // ---------------------------------------------------------------------------

  const focusHint = getFocusModeById(focusMode).promptHint;

  // ---------------------------------------------------------------------------
  // Transport + useChat
  // ---------------------------------------------------------------------------

  const transport = useMemo(
    () => new TextStreamChatTransport({
      api: '/api/ai/chat',
      body: {
        provider, clientApiKey, gatewayModel: modelId, focusHint,
        ...(activeLuminor ? { systemPrompt: activeLuminor.systemPrompt } : {}),
      },
      headers: { 'Content-Type': 'application/json' },
    }),
    [provider, clientApiKey, modelId, focusHint, activeLuminor]
  );

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
  } = useChat({
    transport,
    onError: (err) => {
      // Parse the actual error message — may come as plain text from our API
      let msg = err.message || '';
      // If the error is a generic fetch error, try to extract the server message
      if (msg.includes('fetch') || msg.includes('Failed') || !msg) {
        msg = 'Connection failed. Check Settings → Providers.';
      }
      // Surface API key errors clearly
      if (msg.includes('API key') || msg.includes('503') || msg.includes('401')) {
        msg = msg.replace(/^Error:\s*/, '');
      }
      setChatError(msg || 'Something went wrong. Check Settings → Providers.');
    },
  });

  // ---------------------------------------------------------------------------
  // Select a Luminor from the sidebar (Chosen — no API needed)
  // ---------------------------------------------------------------------------

  const handleSelectLuminor = useCallback((luminor: LuminorConfig) => {
    setActiveLuminor({
      id: luminor.id,
      name: luminor.name,
      title: luminor.title,
      tagline: luminor.tagline,
      systemPrompt: luminor.systemPrompt,
      color: luminor.color,
      avatar: luminor.avatar,
    });
    setMessages([]);
    setActiveGates([]);
  }, [setMessages]);

  // ---------------------------------------------------------------------------
  // Sync SDK error state into our local error state
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (error) {
      setChatError(error.message || 'Connection failed');
    }
  }, [error]);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const isLoading = status === 'submitted' || status === 'streaming';
  const lastMsg = messages[messages.length - 1];
  const isStreaming = isLoading && lastMsg?.role === 'assistant';
  const isThinking = isLoading && (!lastMsg || lastMsg.role === 'user');
  const isEmpty = messages.length === 0 && !isLoading;

  // ---------------------------------------------------------------------------
  // Client-side router for frequency indicator
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      const text = getMessageText(lastUser);
      if (text) {
        const result = classifyIntent(text);
        setActiveGates(result.activeGates);
      }
    }
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Auto-send initial prompt from URL
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (initialPrompt && !initialSent && messages.length === 0) {
      sendMessage({ text: initialPrompt });
      setInitialSent(true);
    }
  }, [initialPrompt, initialSent, messages.length, sendMessage]);

  // ---------------------------------------------------------------------------
  // Cmd+K command palette
  // ---------------------------------------------------------------------------

  useEffect(() => {
    function handleCmdK(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleCmdK);
    return () => document.removeEventListener('keydown', handleCmdK);
  }, []);

  // ---------------------------------------------------------------------------
  // Parse @ commands: @opus, @gemini, @grok etc. switch model for that message
  // ---------------------------------------------------------------------------

  const parseAtCommand = useCallback((text: string): { cleanText: string; overrideModel: string | null } => {
    const match = text.match(/^@(\w+)\s+/);
    if (!match) return { cleanText: text, overrideModel: null };

    const alias = match[1].toLowerCase();
    const model = CHAT_MODELS.find((m) =>
      m.shortName.toLowerCase() === alias ||
      m.id === `arcanea-${alias}` ||
      m.provider === alias
    );

    if (model) {
      return { cleanText: text.slice(match[0].length), overrideModel: model.id };
    }
    return { cleanText: text, overrideModel: null };
  }, []);

  // ---------------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const trimmed = input.trim();

      // /beam command — launch beam mode
      if (trimmed.startsWith('/beam ')) {
        setBeamPrompt(trimmed.slice(6));
        setInput('');
        return;
      }

      const { cleanText, overrideModel } = parseAtCommand(trimmed);

      // If @ command detected, temporarily switch model for this message
      if (overrideModel) {
        setModelId(overrideModel);
      }

      sendMessage({ text: cleanText });
      setInput('');
    }
  }, [input, isLoading, sendMessage, parseAtCommand, setModelId]);

  // ---------------------------------------------------------------------------
  // Retry last message on error
  // ---------------------------------------------------------------------------

  const handleRetry = useCallback(() => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;
    const text = getMessageText(lastUserMsg);
    if (!text) return;
    // Remove the failed assistant message if present
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant') {
      setMessages(messages.slice(0, -1));
    }
    sendMessage({ text });
  }, [messages, setMessages, sendMessage]);

  // ---------------------------------------------------------------------------
  // Regenerate: re-send last user message for a fresh response
  // ---------------------------------------------------------------------------

  const handleRegenerate = useCallback(() => {
    if (messages.length < 2) return;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx < 0) return;
    const actualIdx = messages.length - 1 - lastUserIdx;
    const userText = getMessageText(messages[actualIdx]);
    if (!userText) return;
    setMessages(messages.slice(0, actualIdx + 1));
    sendMessage({ text: userText });
  }, [messages, setMessages, sendMessage]);

  // ---------------------------------------------------------------------------
  // Copy message text to clipboard
  // ---------------------------------------------------------------------------

  const handleCopy = useCallback(async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Start a new chat
  // ---------------------------------------------------------------------------

  const startNewChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setActiveGates([]);
  }, [setMessages]);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    // Messages
    messages,
    status,
    error,
    sendMessage,
    setMessages,

    // Input
    input,
    setInput,
    handleInputChange,

    // Model
    modelId,
    setModelId,
    providerLabel,
    provider,
    clientApiKey,

    // Focus
    focusMode,
    setFocusMode,
    focusHint,

    // Luminor
    activeLuminor,
    handleSelectLuminor,

    // State
    isLoading,
    isStreaming,
    isThinking,
    isEmpty,
    chatError,
    setChatError,

    // Copy
    copiedId,
    handleCopy,

    // Gates
    activeGates,

    // Beam
    beamPrompt,
    setBeamPrompt,

    // Command palette
    commandPaletteOpen,
    setCommandPaletteOpen,

    // Actions
    handleSubmit,
    handleRetry,
    handleRegenerate,
    startNewChat,

    // Derived
    lastMsg,
  };
}
