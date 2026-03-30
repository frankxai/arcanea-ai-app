"use client";

import { useCallback, useRef } from "react";
import {
  Sparkle,
  Brain,
  PaperPlane,
  TextB,
  TextItalic,
  ListNumbers,
  Quotes,
  Link,
} from "@/lib/phosphor-icons";
import { AI_SUGGESTIONS } from "./studio-types";

interface TextCreationPanelProps {
  content: string;
  setContent: (val: string) => void;
  aiMessages: { role: "user" | "luminor"; text: string }[];
  onAskAI: () => void;
  aiInput: string;
  setAiInput: (val: string) => void;
}

export function TextCreationPanel({
  content,
  setContent,
  aiMessages,
  onAskAI,
  aiInput,
  setAiInput,
}: TextCreationPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const replacement = `${prefix}${selected || "text"}${suffix}`;
      const newContent =
        content.substring(0, start) + replacement + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + (selected || "text").length
        );
      }, 0);
    },
    [content, setContent]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Left: Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <button onClick={() => insertMarkdown("**", "**")} className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors" title="Bold" aria-label="Bold">
            <TextB size={16} weight="bold" />
          </button>
          <button onClick={() => insertMarkdown("*", "*")} className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors" title="Italic" aria-label="Italic">
            <TextItalic size={16} />
          </button>
          <button onClick={() => insertMarkdown("\n1. ", "")} className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors" title="Ordered List" aria-label="Ordered List">
            <ListNumbers size={16} />
          </button>
          <button onClick={() => insertMarkdown("\n> ", "")} className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors" title="Blockquote" aria-label="Blockquote">
            <Quotes size={16} />
          </button>
          <button onClick={() => insertMarkdown("[", "](url)")} className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors" title="Link" aria-label="Insert Link">
            <Link size={16} />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-text-muted font-mono">Markdown supported</span>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing...

Use Markdown for formatting. The AI panel can help you develop ideas."
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[300px]"
          aria-label="Text editor"
          spellCheck
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Right: AI Panel */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-crystal to-brand-primary flex items-center justify-center">
            <Brain size={14} className="text-cosmic-void" />
          </div>
          <span className="text-xs font-semibold text-text-primary">Companion</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {aiMessages.length === 0 ? (
            <>
              <p className="text-xs text-text-muted mb-3 px-1">Suggestions to enhance your creation:</p>
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => { setAiInput(s.title); setTimeout(onAskAI, 50); }}
                  className="w-full text-left p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-crystal/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <Sparkle size={14} weight="fill" className="text-crystal mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-text-primary group-hover:text-crystal transition-colors">{s.title}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{s.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            aiMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-primary/10 border border-brand-primary/20 text-text-primary ml-6"
                    : "bg-white/[0.03] border border-white/[0.08] text-text-secondary mr-2"
                }`}
              >
                {msg.role === "luminor" && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-crystal">
                    <Sparkle size={10} weight="fill" />
                    <span className="font-semibold text-[10px] uppercase tracking-wider">AI</span>
                  </div>
                )}
                {msg.text}
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && aiInput.trim()) onAskAI(); }}
              placeholder="Ask AI..."
              aria-label="Ask AI"
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-crystal/40 focus:ring-2 focus:ring-crystal/20 transition-colors"
            />
            <button
              onClick={onAskAI}
              disabled={!aiInput.trim()}
              className="p-2 rounded-lg bg-gradient-to-r from-crystal to-brand-primary text-cosmic-void hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <PaperPlane size={14} weight="fill" />
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2 px-1">Connect your AI key in Settings to enable generation.</p>
        </div>
      </div>
    </div>
  );
}
