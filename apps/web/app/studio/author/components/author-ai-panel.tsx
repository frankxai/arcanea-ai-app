'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

interface AuthorAIPanelProps {
  bookSlug: string;
  currentChapter: string;
}

const SUGGESTED_PROMPTS = [
  'Review this scene for pacing',
  'Is this dialogue consistent with the character?',
  'Check continuity with previous chapters',
  'Suggest what happens next',
  'Improve this prose — make it sharper',
  'Does this scene advance both plot and character?',
];

export function AuthorAIPanel({ bookSlug, currentChapter }: AuthorAIPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    api: '/api/ai/author-chat',
    body: { bookSlug, currentChapter },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 px-2 py-4 bg-white/[0.03] border border-white/[0.06] rounded-l-lg text-white/40 hover:text-white/60 transition-colors"
        title="Show AI companion"
      >
        <span className="text-xs [writing-mode:vertical-rl]">AI Companion</span>
      </button>
    );
  }

  return (
    <aside className="w-80 flex-shrink-0 border-l border-white/[0.06] bg-[#09090b]/80 backdrop-blur-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm font-semibold text-white/70">Author Companion</h2>
            <p className="text-[10px] text-[#00bcd4]/60 mt-0.5">Canon-aware &middot; Character-aware</p>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/30 hover:text-white/50 text-xs"
            title="Collapse"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-white/30 text-center mb-4">
              I&apos;ve read your characters, world bible, and story blueprint. Ask me anything about your book.
            </p>
            <div className="grid gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); }}
                  className="text-left px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.role === 'user' ? 'ml-8' : 'mr-4'}`}>
            <div className={`px-3 py-2 rounded-lg text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-white/80'
                : 'bg-white/[0.02] border border-white/[0.06] text-white/60'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="mr-4">
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]/40 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]/40 animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]/40 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your book..."
            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/30"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 rounded-lg bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] text-xs font-medium hover:bg-[#00bcd4]/20 disabled:opacity-30 transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
