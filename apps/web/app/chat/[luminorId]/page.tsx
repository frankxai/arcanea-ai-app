'use client';

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import {
  PhPaperPlane,
  PhPlus,
  PhCircleNotch,
  PhArrowDown,
  PhArrowLeft,
  PhWarningCircle,
  PhX,
} from '@/lib/phosphor-icons';
import { getLuminor } from '@/lib/luminors/config';

// ---------------------------------------------------------------------------
// Companion-specific quick starters
// ---------------------------------------------------------------------------

const LUMINOR_STARTERS: Record<string, string[]> = {
  logicus: ['Help me design the architecture for...', 'What pattern should I use for...', 'Review this system design:', 'How should I structure...'],
  synthra: ['Refactor this code for clarity:', 'Review this implementation:', 'Help me write clean code for...', 'What naming convention for...'],
  debugon: ['I have a bug I cannot find:', 'This keeps failing:', 'Help me trace this error:', 'Root cause analysis for...'],
  nexus: ['I need to integrate these two systems:', 'Design an API for...', 'Help me connect...', 'This integration keeps failing:'],
  prismatic: ['Review this design:', 'What color palette for...', 'How should I layout...', 'This feels visually wrong:'],
  melodia: ['I need music for...', 'Describe the sound of...', 'What sonic mood for...', 'Help me write lyrics for...'],
  motio: ['How should this element animate?', 'Design the transition for...', 'What timing and easing for...', 'This animation feels wrong:'],
  formis: ['I need to model...', 'How should I texture...', 'Help me visualize...', 'Design the 3D environment for...'],
  chronica: ['I am stuck in my story:', 'Help me structure this narrative:', 'My character needs...', "The plot isn't working:"],
  veritas: ['Rewrite this for clarity:', 'Help me write copy for...', "This message isn't landing:", 'How do I explain...'],
  lexicon: ['What is the right word for...', 'Help me name this:', 'Analyze this language:', 'Translate this concept into...'],
  poetica: ['Write a poem about...', 'Help me with these lyrics:', 'Find the rhythm in...', 'What metaphor for...'],
  oracle: ['Research this topic:', 'What do we know about...', 'Find the best sources for...', 'Deep analysis of...'],
  analytica: ['Analyze this data:', 'What pattern do you see in...', 'Help me interpret...', 'What does this mean?'],
  memoria: ['Help me organize this:', 'Design a knowledge system for...', 'How should I structure this information?', 'Create documentation for...'],
  futura: ['Where is this trend going?', 'What will this field look like in 5 years?', 'Anticipate the change in...', 'What am I missing about the future of...'],
};

const FALLBACK_STARTERS = [
  'Help me brainstorm ideas for...',
  'What do you think about...',
  'I need guidance on...',
  'Explore this concept with me:',
];

// ---------------------------------------------------------------------------
// Companion Chat Page — powered by Vercel AI SDK useChat
// ---------------------------------------------------------------------------

export default function CompanionChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const luminorId = params.luminorId as string;
  const initialPrompt = searchParams.get('prompt');

  // Companion config
  const luminorConfig = useMemo(() => getLuminor(luminorId), [luminorId]);

  // Redirect if invalid companion
  useEffect(() => {
    if (luminorId && !luminorConfig) {
      router.push('/chat');
    }
  }, [luminorId, luminorConfig, router]);

  // Vercel AI SDK — handles streaming, messages, parsing automatically
  // NOTE: @ai-sdk/react v3.0.118 removed `input` and `handleInputChange` from useChat.
  // Using local state instead. Tab 1 can refine this during chat revamp.
  const [input, setInput] = useState('');
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const {
    messages,
    status,
    error,
    append,
    setMessages,
  } = useChat({
    id: `companion-${luminorId}`,
    api: '/api/ai/chat',
    body: {
      systemPrompt: luminorConfig?.systemPrompt,
    },
  });

  // @ai-sdk/react v3.0.118 replaced isLoading with status enum
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      append({ role: 'user', content: input.trim() });
      setInput('');
    }
  }, [input, isLoading, append]);

  // UI state
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-send initial prompt from ?prompt= query param
  const [initialSent, setInitialSent] = useState(false);
  useEffect(() => {
    if (initialPrompt && !initialSent && messages.length === 0) {
      append({ role: 'user', content: initialPrompt });
      setInitialSent(true);
    }
  }, [initialPrompt, initialSent, messages.length, append]);

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

  // New chat
  const startNewChat = () => {
    setMessages([]);
    setInput('');
    textareaRef.current?.focus();
  };

  // Keyboard: Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  // Detect streaming state
  const lastMsg = messages[messages.length - 1];
  const isStreaming = isLoading && lastMsg?.role === 'assistant';
  const isThinking = isLoading && (!lastMsg || lastMsg.role === 'user');
  const isEmpty = messages.length === 0 && !isLoading;

  // Quick starters for this companion
  const starters = LUMINOR_STARTERS[luminorId] || FALLBACK_STARTERS;

  // Companion color (fallback to cyan)
  const color = luminorConfig?.color || '#00bcd4';

  // Loading state — wait for config
  if (!luminorConfig) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090b]">
        <PhCircleNotch className="w-8 h-8 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#09090b]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex w-8 h-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
            aria-label="Back to chat"
          >
            <PhArrowLeft className="w-4 h-4" />
          </Link>

          {/* Companion avatar + name */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
              style={{ backgroundColor: color }}
            >
              {luminorConfig.avatar ? (
                <img
                  src={luminorConfig.avatar}
                  alt={luminorConfig.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                luminorConfig.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-white/90 truncate">
                {luminorConfig.name}
              </h1>
              <p className="text-[11px] text-white/35 truncate">
                {luminorConfig.tagline}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 ml-2">
            <span
              className={`w-2 h-2 rounded-full ${isLoading ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: isLoading ? color : '#22c55e' }}
            />
            <span className="text-[11px] text-white/25">
              {isThinking ? 'Thinking...' : isStreaming ? 'Generating...' : 'Online'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
            >
              <PhPlus className="w-3.5 h-3.5" />
              New
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" className="bg-red-500/8 border-b border-red-500/20 px-4 py-2.5">
          <div className="max-w-[680px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400/80 text-sm">
              <PhWarningCircle className="w-4 h-4" />
              <span>{error.message}</span>
            </div>
            <button onClick={startNewChat} aria-label="Dismiss" className="text-red-400/60 hover:text-red-400">
              <PhX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      >
        {isEmpty ? (
          /* Empty state — companion welcome */
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="max-w-[540px] w-full text-center">
              {/* Companion avatar */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-4"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 40px ${color}30`,
                }}
              >
                {luminorConfig.avatar ? (
                  <img
                    src={luminorConfig.avatar}
                    alt={luminorConfig.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  luminorConfig.name.charAt(0).toUpperCase()
                )}
              </div>

              <h1 className="text-2xl font-semibold text-white/90 mb-1 tracking-tight">
                {luminorConfig.name}
              </h1>
              <p className="text-sm text-white/40 mb-8">
                {luminorConfig.tagline}
              </p>

              {/* Quick starters */}
              <div className="flex flex-wrap justify-center gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => append({ role: 'user', content: s })}
                    className="px-4 py-2 rounded-full text-sm text-white/50 border border-white/[0.08] hover:text-white/70 hover:bg-white/[0.03] transition-all duration-150"
                    style={{
                      borderColor: 'rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget.style.borderColor = `${color}40`);
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)');
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-[680px] mx-auto px-4 py-6" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%]">
                    <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-[#1a1a1f] text-white/90 text-[15px] leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {/* Companion avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0 mt-0.5"
                      style={{ backgroundColor: color }}
                    >
                      {luminorConfig.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Message content */}
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium mb-1 block" style={{ color }}>
                        {luminorConfig.name}
                      </span>
                      <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.7] text-white/85">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {isStreaming && msg.id === lastMsg?.id && (
                          <span
                            className="inline-block w-[2px] h-[18px] animate-pulse ml-0.5 align-text-bottom"
                            style={{ backgroundColor: color }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0 animate-pulse"
                  style={{ backgroundColor: color }}
                >
                  {luminorConfig.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2 text-white/30">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs">Thinking...</span>
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
                borderColor: input.trim() ? `${color}50` : 'rgba(255,255,255,0.08)',
                backgroundColor: '#111113',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${luminorConfig.name}...`}
                aria-label="Message input"
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-14 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none disabled:opacity-40 text-[15px] rounded-2xl"
                style={{ minHeight: '52px', maxHeight: '200px' }}
              />

              <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                  style={{
                    backgroundColor: input.trim() && !isLoading ? color : 'transparent',
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
                Enter to send · Shift+Enter for new line
              </span>
              <span className="text-[11px] text-white/15 font-mono">
                Gemini 2.0 Flash
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
