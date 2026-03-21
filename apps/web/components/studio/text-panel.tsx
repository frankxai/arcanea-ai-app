"use client";

import { useCallback, useRef } from "react";
import {
  Sparkle,
  PaperPlane,
  TextB,
  TextItalic,
  ListNumbers,
  Quotes,
  Link,
  Brain,
} from "@/lib/phosphor-icons";
import { AI_SUGGESTIONS } from "./studio-types";
import type { AiMessage } from "./studio-types";

// ---------------------------------------------------------------------------
// Text Creation Panel
// ---------------------------------------------------------------------------

interface TextCreationPanelProps {
  content: string;
  setContent: (val: string) => void;
  aiMessages: AiMessage[];
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
    <div className="flex flex-col lg:flex-row gap-0 flex-1 min-h-0">
      {/* Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <ToolbarBtn
            onClick={() => insertMarkdown("**", "**")}
            title="Bold"
          >
            <TextB size={16} weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertMarkdown("*", "*")} title="Italic">
            <TextItalic size={16} />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => insertMarkdown("\n1. ", "")}
            title="Ordered List"
          >
            <ListNumbers size={16} />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => insertMarkdown("\n> ", "")}
            title="Blockquote"
          >
            <Quotes size={16} />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => insertMarkdown("[", "](url)")}
            title="Link"
          >
            <Link size={16} />
          </ToolbarBtn>
          <div className="flex-1" />
          <span className="text-xs text-text-muted font-mono">
            Markdown supported
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing...

Use Markdown for formatting. The AI panel can help you develop ideas."
          aria-label="Text editor"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7fffd4]/20 focus:ring-inset min-h-[300px]"
          spellCheck
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* AI Sidebar */}
      <AiSidePanel
        messages={aiMessages}
        input={aiInput}
        setInput={setAiInput}
        onSend={onAskAI}
        accentColor="crystal"
        label="Writing AI"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

export function AiSidePanel({
  messages,
  input,
  setInput,
  onSend,
  accentColor = "crystal",
  label = "AI Assistant",
  suggestions,
  isGenerating,
  children,
}: {
  messages: AiMessage[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  accentColor?: string;
  label?: string;
  suggestions?: { title: string; description: string }[];
  isGenerating?: boolean;
  children?: React.ReactNode;
}) {
  const items = suggestions || AI_SUGGESTIONS;
  const gradientFrom =
    accentColor === "brand-gold" ? "from-brand-gold" : "from-crystal";

  return (
    <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
        <div
          className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradientFrom} to-brand-primary flex items-center justify-center`}
        >
          <Brain size={14} className="text-cosmic-void" />
        </div>
        <span className="text-xs font-semibold text-text-primary">{label}</span>
        {isGenerating && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-[#7fffd4] font-mono">
            <Sparkle
              size={10}
              className="animate-spin"
              style={{ animationDuration: "2s" }}
            />
            Thinking...
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <>
            <p className="text-xs text-text-muted mb-3 px-1">
              Suggestions to get started:
            </p>
            {items.map((s) => (
              <button
                key={s.title}
                onClick={() => {
                  setInput(s.title);
                  setTimeout(onSend, 50);
                }}
                className="w-full text-left p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#7fffd4]/30 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <Sparkle
                    size={14}
                    weight="fill"
                    className="text-[#7fffd4] mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-medium text-text-primary group-hover:text-[#7fffd4] transition-colors">
                      {s.title}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {s.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-primary/10 border border-brand-primary/20 text-text-primary ml-6"
                  : "bg-white/[0.03] border border-white/[0.08] text-text-secondary mr-2"
              }`}
            >
              {msg.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-1.5 text-[#7fffd4]">
                  <Sparkle size={10} weight="fill" />
                  <span className="font-semibold text-[10px] uppercase tracking-wider">
                    AI
                  </span>
                </div>
              )}
              <pre className="whitespace-pre-wrap font-body">{msg.text}</pre>
            </div>
          ))
        )}
        {children}
      </div>

      <div className="p-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) onSend();
            }}
            placeholder="Ask AI..."
            aria-label="Ask AI"
            className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-[#7fffd4]/40 focus:ring-2 focus:ring-[#7fffd4]/20 transition-colors"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isGenerating}
            className="p-2 rounded-lg bg-gradient-to-r from-[#7fffd4] to-brand-primary text-cosmic-void hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <PaperPlane size={14} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
