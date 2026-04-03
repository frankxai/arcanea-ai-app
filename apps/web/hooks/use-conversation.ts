'use client';

/**
 * useConversation — Manages chat conversation state
 *
 * Extracted from the chat page to reduce component complexity.
 * Handles: messages, streaming, model selection, luminor activation,
 * follow-up parsing, and conversation lifecycle.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  type FileUIPart,
  type UIMessage,
} from 'ai';
import { useModelSelection } from './use-provider';
import { getFocusModeById } from '@/components/chat/focus-modes';
import { classifyIntent } from '@/lib/ai/router';
import { resolveSwarm, type SwarmResult } from '@/lib/ai/guardian-swarm';
import { CHAT_MODELS } from '@/components/chat/model-selector';
import { getLuminor, getLuminorIds, type LuminorConfig } from '@/lib/luminors/config';
import type { ChatProject } from '@/lib/chat/project-store';
import {
  coerceArcaneaRuntimeMetadata,
  formatArcaneaRuntimeSummary,
  type ArcaneaRuntimeMetadata,
} from '@/lib/chat/runtime-metadata';

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
// @mention parsing: models first (higher priority), then Luminors
// ---------------------------------------------------------------------------

const MODEL_MENTION_ALIASES = ['opus', 'sonnet', 'gemini', 'grok', 'gpt5', 'haiku', 'flash'] as const;

export interface MentionParseResult {
  cleanText: string;
  mentionedLuminor?: string;
  mentionedModel?: string;
}

export function parseMention(text: string): MentionParseResult {
  // Check for model mentions first (higher priority)
  const modelPattern = new RegExp(`^@(${MODEL_MENTION_ALIASES.join('|')})\\s+`, 'i');
  const modelMatch = text.match(modelPattern);
  if (modelMatch) {
    return {
      cleanText: text.replace(modelPattern, '').trim(),
      mentionedModel: modelMatch[1].toLowerCase(),
    };
  }

  // Check for Luminor mentions
  const luminorIds = getLuminorIds();
  const luminorPattern = new RegExp(`^@(${luminorIds.join('|')})\\s+`, 'i');
  const luminorMatch = text.match(luminorPattern);
  if (luminorMatch) {
    const name = luminorMatch[1];
    const matched = luminorIds.find((n) => n.toLowerCase() === name.toLowerCase());
    return {
      cleanText: text.replace(luminorPattern, '').trim(),
      mentionedLuminor: matched,
    };
  }

  return { cleanText: text };
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
  messages: UIMessage[];
  status: string;
  error: Error | undefined;
  sendMessage: (opts: { text: string; files?: FileUIPart[] }) => void;
  setMessages: (msgs: UIMessage[]) => void;

  // Input
  input: string;
  setInput: (v: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  // Model
  modelId: string | null;
  setModelId: (id: string) => void;
  providerLabel: string;
  provider: string;
  clientApiKey: string | undefined;
  runtimeMetadata: ArcaneaRuntimeMetadata | null;
  runtimeSummary: string | null;

  // Focus (deprecated — auto-routing replaces manual focus selection)
  focusMode: string;
  setFocusMode: (mode: string) => void;
  focusHint: string;

  // Luminor
  activeLuminor: ActiveLuminor | null;
  handleSelectLuminor: (luminor: LuminorConfig) => void;
  /** Which Luminor(s) responded, read from x-arcanea-luminors response header */
  respondingLuminor: string | null;

  // Tools
  enabledTools: Set<string>;
  setEnabledTools: (tools: Set<string>) => void;
  toggleTool: (tool: string) => void;
  detectToolIntent: (message: string) => string[];

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

  // Gates & Swarm
  activeGates: string[];
  swarmResult: SwarmResult | null;

  // Beam
  beamPrompt: string | null;
  setBeamPrompt: (prompt: string | null) => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Edit / Regenerate from any point
  editingMessageId: string | null;
  setEditingMessageId: (id: string | null) => void;
  handleEditMessage: (messageId: string, newText: string) => void;
  handleRegenerateFrom: (messageId: string) => void;

  // Branching
  branches: Map<string, UIMessage[][]>;
  loadBranch: (messageId: string, branchIndex: number) => void;

  // Actions
  handleSubmit: (e: React.FormEvent) => void;
  handleRetry: () => void;
  handleRegenerate: () => void;
  startNewChat: () => void;

  // Derived
  lastMsg: UIMessage | undefined;
}

interface UseConversationOptions {
  activeProject?: ChatProject | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConversation(options?: UseConversationOptions): ConversationState {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');
  const luminorId = searchParams.get('luminor');
  const { provider, clientApiKey, label: providerLabel, modelId, setModelId } = useModelSelection();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [input, setInput] = useState('');
  const [activeGates, setActiveGates] = useState<string[]>([]);
  const [swarmResult, setSwarmResult] = useState<SwarmResult | null>(null);
  const [focusMode, setFocusMode] = useState('auto');
  const [beamPrompt, setBeamPrompt] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const initialPromptSentRef = useRef(false);
  const [branches, setBranches] = useState<Map<string, UIMessage[][]>>(new Map());

  // Active Luminor from Sanctum ("Use in Chat")
  const [activeLuminor, setActiveLuminor] = useState<ActiveLuminor | null>(null);

  // Which Luminor responded.
  // Today this is still approximated from local activation/@mention state.
  // If we want server-authoritative responding Luminor state, it should move
  // into message metadata just like the runtime provider/context summary.
  const [respondingLuminor, setRespondingLuminor] = useState<string | null>(null);

  // Enabled tool categories (e.g. 'image', 'think', 'search')
  const [enabledTools, setEnabledTools] = useState<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // Resolve Luminor from URL param — use local config for Chosen, API for custom
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!luminorId) return;
    const chosen = getLuminor(luminorId);
    if (chosen) {
      // This effect hydrates conversation state from route params.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          // This effect hydrates conversation state from route params.
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
  // Tool toggle
  // ---------------------------------------------------------------------------

  const toggleTool = useCallback((tool: string) => {
    setEnabledTools((prev) => {
      const next = new Set(prev);
      if (next.has(tool)) {
        next.delete(tool);
      } else {
        next.add(tool);
      }
      return next;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Auto-tool detection — suggest tools based on message content
  // ---------------------------------------------------------------------------

  const detectToolIntent = useCallback((message: string): string[] => {
    const detected: string[] = [];
    const lower = message.toLowerCase();
    if (/\b(generate|draw|create|make|design)\b.*\b(image|picture|photo|illustration|art|logo|icon)\b/i.test(message)) {
      detected.push('image');
    }
    if (/\b(think|analyze|reason|step by step|complex|deep dive|break down)\b/i.test(message)) {
      detected.push('think');
    }
    if (/\b(search|find|latest|news|current|today|recent|look up|google)\b/i.test(message)) {
      detected.push('search');
    }
    return detected;
  }, []);

  // ---------------------------------------------------------------------------
  // Focus mode hint
  // ---------------------------------------------------------------------------

  const focusHint = getFocusModeById(focusMode).promptHint;

  // ---------------------------------------------------------------------------
  // Transport + useChat
  // ---------------------------------------------------------------------------

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: '/api/ai/chat',
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const {
    messages,
    status,
    error,
    sendMessage: sendSdkMessage,
    setMessages,
  } = useChat({
    transport,
    onError: (err) => {
      // The AI SDK wraps HTTP errors. The server returns plain text for 4xx/5xx.
      // err.message often contains the response body for non-200 responses.
      let msg = err.message || '';

      // Strip "Error:" prefix if present
      msg = msg.replace(/^Error:\s*/, '');

      // Pass through the server message directly — getErrorMessage() in
      // chat-area.tsx will map it to a user-friendly title + action.
      // Only fall back to a generic message if we have nothing useful.
      if (!msg || msg === 'undefined') {
        msg = 'Something went wrong. Try again or check Settings.';
      }

      setChatError(msg);
    },
  });

  const buildRequestBody = useCallback(() => {
    const currentEnabledTools = Array.from(enabledTools).sort();

    // Resolve BYOK search key from localStorage (tavily > brave)
    let searchApiKey: string | undefined;
    try {
      const keysRaw = localStorage.getItem('arcanea-provider-keys');
      if (keysRaw) {
        const keys = JSON.parse(keysRaw) as Record<string, string>;
        searchApiKey = keys.tavily || keys.brave || undefined;
      }
    } catch {
      // Ignore parse errors
    }

    return {
      provider,
      clientApiKey,
      gatewayModel: modelId,
      focusHint,
      ...(options?.activeProject
        ? {
            projectContext: {
              id: options.activeProject.id,
              title: options.activeProject.title,
              description: options.activeProject.description,
              goal: options.activeProject.goal,
            },
          }
        : {}),
      ...(activeLuminor ? { systemPrompt: activeLuminor.systemPrompt } : {}),
      ...(currentEnabledTools.length > 0 ? { enabledTools: currentEnabledTools } : {}),
      ...(searchApiKey ? { searchApiKey } : {}),
    };
  }, [provider, clientApiKey, modelId, focusHint, activeLuminor, enabledTools, options?.activeProject]);

  const sendMessage = useCallback((opts: { text: string; files?: FileUIPart[] }) => {
    // Clear any previous error when the user sends a new message
    setChatError(null);
    sendSdkMessage(opts, { body: buildRequestBody() });
  }, [sendSdkMessage, buildRequestBody]);

  // ---------------------------------------------------------------------------
  // Activate a Luminor (shared by @mention + sidebar selection)
  // ---------------------------------------------------------------------------

  const activateLuminor = useCallback((luminor: LuminorConfig) => {
    setActiveLuminor({
      id: luminor.id,
      name: luminor.name,
      title: luminor.title,
      tagline: luminor.tagline,
      systemPrompt: luminor.systemPrompt,
      color: luminor.color,
      avatar: luminor.avatar,
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Select a Luminor from the sidebar (Chosen — no API needed)
  // ---------------------------------------------------------------------------

  const handleSelectLuminor = useCallback((luminor: LuminorConfig) => {
    activateLuminor(luminor);
    setMessages([]);
    setActiveGates([]);
    setSwarmResult(null);
    setRespondingLuminor(null);
  }, [setMessages, activateLuminor]);

  // ---------------------------------------------------------------------------
  // Sync SDK error state into our local error state
  // ---------------------------------------------------------------------------
  // NOTE: The onError callback in useChat already sets chatError with the
  // parsed server response. This effect is a safety net for edge cases where
  // the SDK sets `error` without calling onError (e.g. transport-level failures).
  // We guard against overwriting a more detailed message from onError by only
  // setting if chatError is currently null.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (error && !chatError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChatError(error.message || 'Connection failed');
    }
  }, [error, chatError]);

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const isLoading = status === 'submitted' || status === 'streaming';
  const lastMsg = messages[messages.length - 1];
  const isStreaming = isLoading && lastMsg?.role === 'assistant';
  const isThinking = isLoading && (!lastMsg || lastMsg.role === 'user');
  const isEmpty = messages.length === 0 && !isLoading;
  const runtimeMetadata = useMemo<ArcaneaRuntimeMetadata | null>(() => {
    const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
    return coerceArcaneaRuntimeMetadata(lastAssistant?.metadata);
  }, [messages]);
  const runtimeSummary = useMemo(() => {
    if (!runtimeMetadata) return null;
    return formatArcaneaRuntimeSummary(runtimeMetadata);
  }, [runtimeMetadata]);

  // ---------------------------------------------------------------------------
  // Client-side router for frequency indicator
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Skip re-classification during streaming — the last user message hasn't changed
    if (isLoading) return;
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      const text = getMessageText(lastUser);
      if (text) {
        const result = classifyIntent(text);
        // These values are derived from the last settled user turn.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveGates(result.activeGates);
        setSwarmResult(resolveSwarm(result.weights, result.activeGates));
      }
    }
  }, [messages, isLoading]);

  // ---------------------------------------------------------------------------
  // Auto-send initial prompt from URL
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (initialPrompt && !initialPromptSentRef.current && messages.length === 0) {
      sendMessage({ text: initialPrompt });
      initialPromptSentRef.current = true;
    }
  }, [initialPrompt, messages.length, sendMessage]);

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
  // Auto-enable search tool when Research focus mode is active
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (focusMode === 'research') {
      // Research mode implies these tool capabilities.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabledTools((prev) => {
        if (prev.has('search') && prev.has('think')) return prev;
        const next = new Set(prev);
        next.add('search');
        next.add('think');
        return next;
      });
    }
  }, [focusMode]);

  // ---------------------------------------------------------------------------
  // Parse @ commands: models (@opus, @gemini, etc.) and Luminors (@Logicus, etc.)
  // Models are checked first (higher priority via parseMention), then Luminors.
  // Falls back to legacy CHAT_MODELS matching for aliases like provider names.
  // ---------------------------------------------------------------------------

  const resolveAtMention = useCallback((text: string): {
    cleanText: string;
    overrideModel: string | null;
    overrideLuminor: LuminorConfig | null;
  } => {
    // First: try the unified parseMention (handles model aliases + Luminor IDs)
    const mention = parseMention(text);

    if (mention.mentionedModel) {
      // Map alias to a CHAT_MODELS entry
      const alias = mention.mentionedModel;
      const model = CHAT_MODELS.find((m) =>
        m.shortName.toLowerCase() === alias ||
        m.id === `arcanea-${alias}` ||
        m.provider === alias
      );
      return {
        cleanText: mention.cleanText,
        overrideModel: model?.id ?? null,
        overrideLuminor: null,
      };
    }

    if (mention.mentionedLuminor) {
      const luminor = getLuminor(mention.mentionedLuminor);
      return {
        cleanText: mention.cleanText,
        overrideModel: null,
        overrideLuminor: luminor ?? null,
      };
    }

    // Legacy fallback: match @alias against CHAT_MODELS directly
    const match = text.match(/^@(\w+)\s+/);
    if (match) {
      const alias = match[1].toLowerCase();
      const model = CHAT_MODELS.find((m) =>
        m.shortName.toLowerCase() === alias ||
        m.id === `arcanea-${alias}` ||
        m.provider === alias
      );
      if (model) {
        return { cleanText: text.slice(match[0].length), overrideModel: model.id, overrideLuminor: null };
      }
    }

    return { cleanText: text, overrideModel: null, overrideLuminor: null };
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

      const { cleanText, overrideModel, overrideLuminor } = resolveAtMention(trimmed);

      // If @model detected, switch model for this message
      if (overrideModel) {
        setModelId(overrideModel);
      }

      // If @Luminor detected, activate that Luminor for the conversation
      if (overrideLuminor) {
        activateLuminor(overrideLuminor);
        setRespondingLuminor(overrideLuminor.id);
      }

      sendMessage({ text: cleanText });
      setInput('');
    }
  }, [input, isLoading, sendMessage, resolveAtMention, setModelId, activateLuminor]);

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
  // Edit a user message: truncate history to that point, re-send with new text
  // ---------------------------------------------------------------------------

  const handleEditMessage = useCallback((messageId: string, newText: string) => {
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx < 0) return;
    setMessages(messages.slice(0, idx));
    setEditingMessageId(null);
    sendMessage({ text: newText });
  }, [messages, setMessages, sendMessage]);

  // ---------------------------------------------------------------------------
  // Regenerate from any assistant message (not just the last)
  // ---------------------------------------------------------------------------

  const handleRegenerateFrom = useCallback((messageId: string) => {
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx < 0) return;

    // Save the current branch from this point forward
    const branchKey = messageId;
    const branchContent = messages.slice(idx);
    setBranches(prev => {
      const next = new Map(prev);
      const existing = next.get(branchKey) || [];
      existing.push(branchContent);
      next.set(branchKey, existing);
      return next;
    });

    // Find the user message immediately before this assistant message
    let userIdx = -1;
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userIdx = i;
        break;
      }
    }
    if (userIdx < 0) return;
    const userText = getMessageText(messages[userIdx]);
    if (!userText) return;
    // Truncate to include the user message, then re-send
    setMessages(messages.slice(0, userIdx + 1));
    sendMessage({ text: userText });
  }, [messages, setMessages, sendMessage]);

  // ---------------------------------------------------------------------------
  // Load a previously saved branch (conversation branching)
  // ---------------------------------------------------------------------------

  const loadBranch = useCallback((messageId: string, branchIndex: number) => {
    const branchList = branches.get(messageId);
    if (!branchList || !branchList[branchIndex]) return;
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx < 0) return;
    // Replace from this point with the saved branch
    const before = messages.slice(0, idx);
    setMessages([...before, ...branchList[branchIndex]]);
  }, [messages, branches, setMessages]);

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
    setSwarmResult(null);
    setRespondingLuminor(null);
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
    runtimeMetadata,
    runtimeSummary,

    // Focus
    focusMode,
    setFocusMode,
    focusHint,

    // Luminor
    activeLuminor,
    handleSelectLuminor,
    respondingLuminor,

    // Tools
    enabledTools,
    setEnabledTools,
    toggleTool,
    detectToolIntent,

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

    // Gates & Swarm
    activeGates,
    swarmResult,

    // Beam
    beamPrompt,
    setBeamPrompt,

    // Command palette
    commandPaletteOpen,
    setCommandPaletteOpen,

    // Edit / Regenerate from any point
    editingMessageId,
    setEditingMessageId,
    handleEditMessage,
    handleRegenerateFrom,

    // Branching
    branches,
    loadBranch,

    // Actions
    handleSubmit,
    handleRetry,
    handleRegenerate,
    startNewChat,

    // Derived
    lastMsg,
  };
}
