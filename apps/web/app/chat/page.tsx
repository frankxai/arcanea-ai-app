'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import ChatMarkdown from '@/components/chat/chat-markdown';
import { ModelSelector } from '@/components/chat/model-selector';
import { FocusModeSelector } from '@/components/chat/focus-modes';
import { BeamMode } from '@/components/chat/beam-mode';
import { CommandPalette } from '@/components/chat/command-palette';
import { ExportDialog } from '@/components/chat/export-dialog';
import { ArtifactsPanel, detectArtifact } from '@/components/chat/artifacts-panel';
import type { Artifact } from '@/components/chat/artifacts-panel';
import {
  PhPaperPlane,
  PhPlus,
  PhCircleNotch,
  PhArrowDown,
  PhWarningCircle,
  PhArrowClockwise,
  PhX,
  PhCopy,
  PhCheck,
  PhClockCounterClockwise,
  PhPencilSimple,
  PhExport,
  PhImageSquare,
  PhSparkle,
  PhGear,
  PhMicrophone,
} from '@/lib/phosphor-icons';
import { LuminorSidebar } from '@/components/chat/luminor-sidebar';
import { getLuminor } from '@/lib/luminors/config';
import { SessionSidebar } from '@/components/chat/session-sidebar';
import { CreationIndicator } from '@/components/chat/creation-indicator';
import { useAutoSave } from '@/lib/arc/auto-save';
import { estimateTokens, formatTokenCount } from '@/lib/chat/token-estimate';
import {
  useConversation,
  getMessageText,
  parseFollowUps,
} from '@/hooks/use-conversation';
import { useChatPersistence } from '@/hooks/use-chat-persistence';
import type { ChatMessage as StoredMessage } from '@/lib/chat/local-store';

// ---------------------------------------------------------------------------
// Gate metadata for the tagline indicator
// ---------------------------------------------------------------------------

const GATE_META: Record<string, { label: string; tagline: string; color: string }> = {
  lyssandria: { label: 'Foundation', tagline: 'Roots of Strength',   color: '#6b8e23' },
  leyla:      { label: 'Flow',       tagline: 'River of Creation',   color: '#4fc3f7' },
  draconia:   { label: 'Fire',       tagline: 'Flame of Will',       color: '#ff6b35' },
  maylinn:    { label: 'Heart',      tagline: 'Wings of Compassion', color: '#e91e63' },
  alera:      { label: 'Voice',      tagline: 'Voice of Truth',      color: '#ab47bc' },
  lyria:      { label: 'Sight',      tagline: 'Eye of Vision',       color: '#7e57c2' },
  aiyami:     { label: 'Crown',      tagline: 'Crown of Light',      color: '#ffd700' },
  elara:      { label: 'Starweave',  tagline: 'Star of Change',      color: '#26c6da' },
  ino:        { label: 'Unity',      tagline: 'Bond of Unity',       color: '#66bb6a' },
  shinkami:   { label: 'Source',      tagline: 'Source of All',       color: '#ffffff' },
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';

const TEAM_COLORS: Record<string, string> = {
  development: '#00bcd4',
  creative: '#e040fb',
  writing: '#ffab40',
  research: '#69f0ae',
};

const SUGGESTIONS = [
  'Build me a magic system with five elements and a cost',
  'Architect a real-time multiplayer backend in TypeScript',
  'Write lyrics for a song about leaving everything behind',
  'I have three ideas and can only ship one — help me decide',
  'Design a brand identity for a fictional coffee shop on Mars',
  'Explain quantum entanglement like I write fantasy novels',
];

// ---------------------------------------------------------------------------
// Inline edit form for user messages
// ---------------------------------------------------------------------------

function EditMessageForm({ initialText, onSave, onCancel }: { initialText: string; onSave: (text: string) => void; onCancel: () => void }) {
  const [text, setText] = React.useState(initialText);
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (text.trim()) onSave(text.trim()); } if (e.key === 'Escape') onCancel(); }}
        className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1f] border border-[#00bcd4]/30 text-white/90 text-[15px] leading-relaxed resize-none focus:outline-none focus:border-[#00bcd4]/50"
        rows={Math.min(text.split('\n').length + 1, 8)}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-white/40 hover:text-white/60 rounded-lg hover:bg-white/[0.04] transition-colors">Cancel</button>
        <button type="button" onClick={() => { if (text.trim()) onSave(text.trim()); }} className="px-3 py-1.5 text-xs text-white bg-[#00bcd4] rounded-lg hover:bg-[#00bcd4]/80 transition-colors">Save &amp; Resend</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const {
    messages,
    sendMessage,
    setMessages,
    input,
    setInput,
    handleInputChange,
    modelId,
    setModelId,
    providerLabel,
    provider,
    clientApiKey,
    focusMode,
    setFocusMode,
    focusHint,
    activeLuminor,
    handleSelectLuminor,
    isLoading,
    isStreaming,
    isThinking,
    isEmpty,
    chatError,
    setChatError,
    copiedId,
    handleCopy,
    activeGates,
    swarmResult,
    beamPrompt,
    setBeamPrompt,
    commandPaletteOpen,
    setCommandPaletteOpen,
    handleSubmit,
    handleRetry,
    handleRegenerate,
    startNewChat,
    lastMsg,
    editingMessageId,
    setEditingMessageId,
    handleEditMessage,
    handleRegenerateFrom,
    branches,
    loadBranch,
  } = useConversation();

  // ---------------------------------------------------------------------------
  // Refs (declared early — used by persistence and UI sections below)
  // ---------------------------------------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---------------------------------------------------------------------------
  // Chat persistence — localStorage-based history
  // ---------------------------------------------------------------------------

  const persistence = useChatPersistence();
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  const restoredRef = useRef(false);

  // Serialize AI SDK messages → storable format
  const serializeMessages = useCallback((msgs: typeof messages): StoredMessage[] => {
    return msgs.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: getMessageText(m),
      parts: m.parts,
      createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : undefined,
    }));
  }, []);

  // Auto-save messages after each change (persistence hook debounces internally)
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      persistence.saveMessages(serializeMessages(messages), {
        luminorId: activeLuminor?.id ?? null,
        modelId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]);

  // Load a saved session
  const handleLoadSession = useCallback((sessionId: string) => {
    const session = persistence.loadSession(sessionId);
    if (session && session.messages.length > 0) {
      // Restore messages into the AI SDK state
      setMessages(session.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        parts: m.parts || [{ type: 'text', text: m.content }],
        createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
      })));
    }
    setHistorySidebarOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistence, setMessages]);

  // Wire new chat to also create a new persistence session
  const handlePersistentNewChat = useCallback(() => {
    startNewChat();
    persistence.newSession();
    textareaRef.current?.focus();
  }, [startNewChat, persistence]);

  // ---------------------------------------------------------------------------
  // Arc auto-save — silently detects and saves creations
  // ---------------------------------------------------------------------------

  const autoSave = useAutoSave(messages, isLoading);

  // ---------------------------------------------------------------------------
  // UI-only state (scroll, sidebar, refs) — stays in the component
  // ---------------------------------------------------------------------------

  const [luminorSidebarOpen, setLuminorSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Auto-scroll on new content
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Scroll detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const dist = scrollHeight - scrollTop - clientHeight;
    setShowScrollBtn(dist > 200);
    setAutoScroll(dist <= 100);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
  };

  // Detect artifacts from the latest assistant message
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastAssistant = [...messages].reverse().find((m: any) => m.role === 'assistant');
      if (lastAssistant) {
        const text = getMessageText(lastAssistant);
        const artifact = detectArtifact(text);
        if (artifact) setActiveArtifact(artifact);
      }
    }
  }, [messages, isLoading]);

  // Focus textarea after clearing chat — uses persistent new chat
  const handleStartNewChat = handlePersistentNewChat;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onerror = () => { setIsRecording(false); };
    recognition.onend = () => { setIsRecording(false); };
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [setInput]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  return (
    <div className="flex h-screen bg-[#09090b]">
      {/* Swarm animation keyframes */}
      <style>{`
        @keyframes gatePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes luminorFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Luminor Sidebar */}
      <LuminorSidebar
        activeLuminorId={activeLuminor?.id ?? null}
        onSelectLuminor={handleSelectLuminor}
        collapsed={!luminorSidebarOpen}
        onToggle={() => setLuminorSidebarOpen((v) => !v)}
        onNewChat={handleStartNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLuminorSidebarOpen((v) => !v)}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              aria-label="Toggle luminor sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-white/90 hover:text-[#00bcd4] transition-colors"
            >
              Arcanea
            </Link>
            {/* Model selector + Gate indicator */}
            <ModelSelector value={modelId ?? 'arcanea-auto'} onChange={setModelId} />
            {isEmpty && (
              <span className="text-[10px] text-white/20 ml-1 hidden sm:inline">AI model</span>
            )}
            {activeGates.length > 0 && messages.length > 0 && (
              <div className="flex items-center gap-1.5">
                {/* Gate tagline chips — max 2 on mobile, 3 on desktop */}
                {activeGates.slice(0, 3).map((gate, idx) => {
                  const meta = GATE_META[gate];
                  if (!meta) return null;
                  const isLead = swarmResult?.coordinationMode === 'solo' && swarmResult.leadGuardian === gate;
                  return (
                    <span
                      key={gate}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border transition-colors ${idx >= 2 ? 'hidden sm:inline-flex' : 'inline-flex'}`}
                      style={{
                        color: meta.color,
                        borderColor: `${meta.color}${isLead ? '30' : '15'}`,
                        opacity: isLead ? 1 : 0.65,
                        animation: isLead ? 'gatePulse 3s ease-in-out infinite' : undefined,
                      }}
                      title={`${meta.label} Gate — ${meta.tagline}`}
                    >
                      {meta.tagline}
                    </span>
                  );
                })}
                {/* Coordination mode indicator — hidden on mobile */}
                {swarmResult && swarmResult.coordinationMode !== 'convergence' && (() => {
                  const leadMeta = swarmResult.leadGuardian ? GATE_META[swarmResult.leadGuardian] : null;
                  const activeNames = swarmResult.activeLuminors.map(l =>
                    l.id.charAt(0).toUpperCase() + l.id.slice(1)
                  ).join(', ');
                  const tooltipText = swarmResult.coordinationMode === 'solo' && leadMeta
                    ? `${leadMeta.label} leads${activeNames ? ` · ${activeNames} active` : ''}`
                    : `Council mode${activeNames ? ` · ${activeNames} active` : ''}`;
                  return (
                    <span
                      className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-md border transition-colors cursor-default group/coord relative"
                      style={swarmResult.coordinationMode === 'solo' && leadMeta ? {
                        color: leadMeta.color,
                        borderColor: `${leadMeta.color}20`,
                        textShadow: `0 0 8px ${leadMeta.color}40`,
                      } : {
                        color: 'rgba(255,255,255,0.35)',
                        borderImage: 'linear-gradient(135deg, #ff6b3530, #4fc3f730, #ab47bc30, #ffd70030) 1',
                      }}
                    >
                      {swarmResult.coordinationMode === 'solo' && leadMeta
                        ? leadMeta.label
                        : 'Council'}
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-[#1a1a1f] border border-white/[0.08] text-[10px] text-white/60 whitespace-nowrap opacity-0 pointer-events-none group-hover/coord:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                        {tooltipText}
                      </span>
                    </span>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { persistence.refreshSessions(); setHistorySidebarOpen((v) => !v); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                historySidebarOpen
                  ? 'text-[#00bcd4]/80 bg-[#00bcd4]/8'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
              aria-label="Toggle chat history"
              title="Chat history"
            >
              <PhClockCounterClockwise className="w-3.5 h-3.5" />
              History
            </button>
            {messages.length > 0 && (
              <button
                onClick={() => setShowExport(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
                aria-label="Export conversation"
                title="Export"
              >
                <PhExport className="w-4 h-4" />
              </button>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleStartNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                <PhPlus className="w-3.5 h-3.5" />
                New
              </button>
            )}
          </div>
        </div>

        {/* Session history panel */}
        {historySidebarOpen && (
          <div className="border-b border-white/[0.06] bg-[#0c0c0e]">
            <SessionSidebar
              sessions={persistence.sessions}
              activeSessionId={persistence.activeSessionId}
              onSelectSession={handleLoadSession}
              onDeleteSession={persistence.deleteSession}
              onNewChat={handleStartNewChat}
            />
          </div>
        )}

        {/* Error banner with retry */}
        {chatError && (
          <div role="alert" className="bg-red-500/8 border-b border-red-500/20 px-4 py-2.5">
            <div className="max-w-[680px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400/80 text-sm min-w-0">
                <PhWarningCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {chatError.includes('UNAUTHORIZED') || chatError.includes('Authentication')
                    ? 'Sign in to start chatting, or add an API key in Settings.'
                    : chatError.includes('API key') || chatError.includes('503')
                    ? 'No AI provider configured. Add a key in Settings \u2192 Providers.'
                    : chatError.includes('fetch') || chatError.includes('Failed')
                    ? 'Connection error. Check your internet and try again.'
                    : chatError.length > 100
                    ? 'Something went wrong. Try again or check Settings.'
                    : chatError}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/settings/providers"
                  className="px-2.5 py-1 rounded-md text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  Add API Key
                </Link>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <PhArrowClockwise className="w-3.5 h-3.5" />
                  Retry
                </button>
                <button onClick={() => { handleStartNewChat(); setChatError(null); }} aria-label="Dismiss error" className="text-red-400/60 hover:text-red-400">
                  <PhX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (files.length > 0) setAttachments(prev => [...prev, ...files]);
          }}
          className="relative flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
        >
          {isDragOver && (
            <div className="absolute inset-0 z-20 bg-[#00bcd4]/10 border-2 border-dashed border-[#00bcd4]/40 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <PhImageSquare className="w-8 h-8 text-[#00bcd4] mx-auto mb-2" />
                <p className="text-sm text-[#00bcd4]">Drop images here</p>
              </div>
            </div>
          )}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-[540px] w-full text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00bcd4]/20 to-[#0d47a1]/20 border border-[#00bcd4]/10 flex items-center justify-center mb-5 mx-auto">
                  <span className="text-2xl">&#10022;</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                  {activeLuminor ? activeLuminor.name : 'What will you create?'}
                </h1>
                <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto leading-relaxed">
                  {activeLuminor ? activeLuminor.title || activeLuminor.tagline : 'Write, code, design, research. Or just think out loud.'}
                </p>

                {/* Onboarding banner — first-run when no API key is configured */}
                {isEmpty && !clientApiKey && (
                  <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl border border-[#00bcd4]/20 bg-[#00bcd4]/5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00bcd4]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <PhSparkle className="w-4 h-4 text-[#00bcd4]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/80 mb-1">Set up your AI provider</h3>
                        <p className="text-xs text-white/40 mb-3 leading-relaxed">
                          Add an API key to start chatting. Google Gemini offers a free tier — perfect for getting started.
                        </p>
                        <Link
                          href="/settings/providers"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00bcd4] text-white hover:bg-[#00bcd4]/80 transition-colors"
                        >
                          <PhGear className="w-3.5 h-3.5" />
                          Configure Providers
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Focus mode selector — Perplexity-style */}
                <div className="flex justify-center mb-6">
                  <FocusModeSelector value={focusMode} onChange={setFocusMode} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                  {SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage({ text: s })}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl text-left text-[13px] text-white/50 border border-white/[0.06] backdrop-blur-sm hover:border-[#00bcd4]/25 hover:text-white/75 hover:bg-[#00bcd4]/[0.04] hover:shadow-[0_0_20px_rgba(0,188,212,0.06)] transition-all duration-200 group"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[680px] mx-auto px-4 py-6" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] group/user">
                      {editingMessageId === msg.id ? (
                        <EditMessageForm
                          initialText={getMessageText(msg)}
                          onSave={(text) => { handleEditMessage(msg.id, text); setEditingMessageId(null); }}
                          onCancel={() => setEditingMessageId(null)}
                        />
                      ) : (
                        <div className="relative">
                          <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-[#1a1a1f] to-[#141418] text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm">
                            {getMessageText(msg)}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingMessageId(msg.id)}
                            className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-white/0 group-hover/user:text-white/30 hover:!text-white/60 hover:bg-white/[0.04] transition-all"
                            aria-label="Edit message"
                          >
                            <PhPencilSimple className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (() => {
                    const rawText = getMessageText(msg);
                    const isComplete = !isLoading || msg.id !== lastMsg?.id;
                    const { clean, followUps } = isComplete ? parseFollowUps(rawText) : { clean: rawText, followUps: [] };

                    return (
                    <div className="group flex gap-3">
                      {/* Avatar — Luminor or Arcanea */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          background: activeLuminor
                            ? `linear-gradient(135deg, ${activeLuminor.color || '#00bcd4'}, ${activeLuminor.color || '#00bcd4'}80)`
                            : 'linear-gradient(135deg, #00bcd4, #0d47a1)',
                        }}
                      >
                        {activeLuminor?.avatar || 'A'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium" style={{ color: activeLuminor?.color || '#00bcd4' }}>
                            {activeLuminor?.name || 'Arcanea'}
                          </span>
                          {activeLuminor?.title && (
                            <span className="text-[10px] text-white/25">{activeLuminor.title}</span>
                          )}
                          <span className="text-[10px] text-white/20 font-mono">{providerLabel}</span>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.75] text-white/85 prose-headings:text-white/90 prose-headings:font-semibold prose-code:text-[#00bcd4]/80 prose-a:text-[#00bcd4] prose-strong:text-white/90">
                          <ChatMarkdown content={clean} isStreaming={isStreaming && msg.id === lastMsg?.id} />
                          {isStreaming && msg.id === lastMsg?.id && (
                            <span className="inline-block w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse ml-1 align-middle shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
                          )}
                        </div>

                        {/* Follow-up suggestions (Perplexity pattern) */}
                        {followUps.length > 0 && !isLoading && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {followUps.map((fu, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => sendMessage({ text: fu })}
                                className="px-3 py-1.5 rounded-full text-[12px] text-white/45 border border-white/[0.06]
                                  hover:border-white/[0.14] hover:text-white/65 hover:bg-white/[0.03] transition-all"
                              >
                                {fu}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Luminor suggestions — show on last message when swarm is active */}
                        {!isLoading && msg.id === lastMsg?.id && swarmResult && swarmResult.coordinationMode !== 'convergence' && swarmResult.activeLuminors.length > 0 && !activeLuminor && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {swarmResult.activeLuminors.slice(0, 3).map((l, idx) => {
                              const teamColor = TEAM_COLORS[l.team] || '#00bcd4';
                              const displayName = l.id.charAt(0).toUpperCase() + l.id.slice(1);
                              return (
                                <button
                                  key={l.id}
                                  type="button"
                                  onClick={() => { const cfg = getLuminor(l.id); if (cfg) handleSelectLuminor(cfg as any); }}
                                  className="group/lum flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-[11px] border border-white/[0.06] text-white/35
                                    hover:text-white/65 hover:bg-white/[0.03] transition-all duration-200"
                                  style={{
                                    borderLeftWidth: '2px',
                                    borderLeftColor: `${teamColor}50`,
                                    animation: `luminorFadeIn 300ms ease-out ${idx * 50}ms both`,
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${teamColor}15, inset 0 0 12px ${teamColor}08`;
                                    (e.currentTarget as HTMLElement).style.borderLeftColor = teamColor;
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    (e.currentTarget as HTMLElement).style.borderLeftColor = `${teamColor}50`;
                                  }}
                                  title={l.hint}
                                >
                                  <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                    style={{ background: `${teamColor}20`, color: teamColor }}
                                  >
                                    {displayName.charAt(0)}
                                  </span>
                                  <span>
                                    <span className="font-medium" style={{ color: `${teamColor}cc` }}>{displayName}</span>
                                    <span className="text-white/20 mx-1">·</span>
                                    <span className="text-white/30">{l.hint}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Message actions — visible on hover/focus */}
                        {!isLoading && rawText && (
                          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, clean)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/40"
                              aria-label="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <><PhCheck className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                              ) : (
                                <><PhCopy className="w-3.5 h-3.5" /><span>Copy</span></>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRegenerateFrom(msg.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/40"
                              aria-label="Regenerate response"
                            >
                              <PhArrowClockwise className="w-3.5 h-3.5" />
                              <span>Regenerate</span>
                            </button>
                            {branches.has(msg.id) && (
                              <div className="flex items-center gap-1 ml-2">
                                <span className="text-[10px] text-white/25">|</span>
                                {branches.get(msg.id)!.map((_: any, i: number) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => loadBranch(msg.id, i)}
                                    className="px-1.5 py-0.5 rounded text-[10px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors font-mono"
                                    title={`Load branch ${i + 1}`}
                                  >
                                    v{i + 1}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })()}
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 animate-pulse"
                    style={{
                      background: activeLuminor
                        ? `linear-gradient(135deg, ${activeLuminor.color || '#00bcd4'}, ${activeLuminor.color || '#00bcd4'}80)`
                        : 'linear-gradient(135deg, #00bcd4, #0d47a1)',
                    }}
                  >
                    {activeLuminor?.avatar || 'A'}
                  </div>
                  <div className="flex items-center gap-2 text-white/30">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs font-light tracking-wide">Thinking</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={scrollToBottom}
              aria-label="Scroll to bottom"
              className="w-9 h-9 rounded-full bg-[#1a1a1f] border border-white/[0.1] shadow-lg flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
            >
              <PhArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-white/[0.06] bg-[#09090b]">
          <div className="max-w-[680px] mx-auto px-4 py-4">
            <form onSubmit={handleSubmit}>
              <div
                className="relative rounded-2xl border transition-colors duration-150"
                style={{
                  borderColor: input.trim() ? 'rgba(0,188,212,0.3)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: '#111113',
                  boxShadow: input.trim() ? '0 0 30px rgba(0,188,212,0.08), inset 0 0 30px rgba(0,188,212,0.02)' : 'none',
                }}
              >
                {attachments.length > 0 && (
                  <div className="flex gap-2 px-4 pt-3 pb-1 flex-wrap">
                    {attachments.map((file, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/[0.1]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white"
                        >
                          <PhX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {isRecording && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Listening... speak now
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={activeLuminor ? `Message ${activeLuminor.name}...` : "What would you like to create?"}
                  aria-label="Message input"
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 pr-14 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none disabled:opacity-40 text-[15px] rounded-2xl"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                  {!input.trim() && !isLoading && (
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
                        isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                      }`}
                      aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                    >
                      <PhMicrophone className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                    style={{
                      backgroundColor: input.trim() && !isLoading ? ACCENT : 'transparent',
                    }}
                  >
                    {isLoading ? (
                      <PhCircleNotch className="w-4 h-4 text-white/40 animate-spin" />
                    ) : (
                      <PhPaperPlane className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[11px] text-white/20">
                  {input.trim()
                    ? formatTokenCount(estimateTokens(input))
                    : 'Enter to send · Shift+Enter for newline'}
                </span>
                <div className="flex items-center gap-2">
                  <CreationIndicator autoSave={autoSave} />
                  {focusMode !== 'auto' && (
                    <FocusModeSelector value={focusMode} onChange={setFocusMode} />
                  )}
                  <span className="text-[11px] text-white/15 font-mono">
                    {providerLabel}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Artifacts side panel — renders code / HTML / SVG from AI responses */}
      {activeArtifact && (
        <ArtifactsPanel
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectModel={(id) => { setModelId(id); setCommandPaletteOpen(false); }}
        onSelectFocus={(id) => { setFocusMode(id); setCommandPaletteOpen(false); }}
        onNewChat={() => { handleStartNewChat(); setCommandPaletteOpen(false); }}
        onBeamMode={() => { setBeamPrompt(input.trim() || 'Compare models'); setCommandPaletteOpen(false); }}
      />

      {/* Beam Mode overlay */}
      {beamPrompt && (
        <BeamMode
          prompt={beamPrompt}
          provider={provider}
          clientApiKey={clientApiKey}
          focusHint={focusHint}
          onSelectResponse={(text, beamModelId) => {
            // Add the beam result as if the user sent and got a response
            sendMessage({ text: beamPrompt });
            setBeamPrompt(null);
          }}
          onClose={() => setBeamPrompt(null)}
        />
      )}

      {/* Export dialog */}
      {showExport && (
        <ExportDialog
          messages={messages}
          luminorName={activeLuminor?.name}
          modelLabel={providerLabel}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
