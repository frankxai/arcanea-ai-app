"use client";

/** Creation panels for each Studio mode (split-pane: editor + preview/AI). */

import { useState, useCallback, useRef } from "react";
import {
  Image,
  Code,
  MusicNote,
  Sparkle,
  Info,
  PaperPlane,
  Terminal,
  Play,
  Eye,
  TextB,
  TextItalic,
  ListNumbers,
  Quotes,
  Link,
  Brain,
} from "@/lib/phosphor-icons";
import { AI_SUGGESTIONS } from "./studio-types";
import type { LuminorMessage } from "./studio-types";

// -- Text Creation Panel --

export function TextCreationPanel({
  content,
  setContent,
  luminorMessages,
  onAskLuminor,
  luminorInput,
  setLuminorInput,
}: {
  content: string;
  setContent: (val: string) => void;
  luminorMessages: LuminorMessage[];
  onAskLuminor: () => void;
  luminorInput: string;
  setLuminorInput: (val: string) => void;
}) {
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
      const next =
        content.substring(0, start) + replacement + content.substring(end);
      setContent(next);
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
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <ToolbarBtn onClick={() => insertMarkdown("**", "**")} title="Bold">
            <TextB size={16} weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertMarkdown("*", "*")} title="Italic">
            <TextItalic size={16} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertMarkdown("\n1. ", "")} title="Ordered List">
            <ListNumbers size={16} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertMarkdown("\n> ", "")} title="Blockquote">
            <Quotes size={16} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertMarkdown("[", "](url)")} title="Link">
            <Link size={16} />
          </ToolbarBtn>
          <div className="flex-1" />
          <span className="text-xs text-text-muted font-mono">Markdown supported</span>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            "Start writing here...\n\nStories, essays, poems, scripts — anything.\nUse Markdown for formatting."
          }
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none min-h-[300px]"
          spellCheck
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Right: Luminor AI Panel */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-crystal to-brand-primary flex items-center justify-center">
            <Brain size={14} className="text-cosmic-void" />
          </div>
          <span className="text-xs font-semibold text-text-primary">
            AI Assistant
          </span>
          <span className="ml-auto text-[10px] text-crystal font-mono">ACTIVE</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {luminorMessages.length === 0 ? (
            <>
              <p className="text-xs text-text-muted mb-3 px-1">
                Suggestions to enhance your creation:
              </p>
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    setLuminorInput(s.title);
                    setTimeout(onAskLuminor, 50);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-crystal/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <Sparkle size={14} weight="fill" className="text-crystal mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-text-primary group-hover:text-crystal transition-colors">
                        {s.title}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">{s.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            luminorMessages.map((msg, i) => (
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
                    <span className="font-semibold text-[10px] uppercase tracking-wider">
                      Luminor
                    </span>
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
              value={luminorInput}
              onChange={(e) => setLuminorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && luminorInput.trim()) onAskLuminor();
              }}
              placeholder="Ask AI..."
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-crystal/40 transition-colors"
            />
            <button
              onClick={onAskLuminor}
              disabled={!luminorInput.trim()}
              className="p-2 rounded-lg bg-gradient-to-r from-crystal to-brand-primary text-cosmic-void hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <PaperPlane size={14} weight="fill" />
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2 px-1">
            Connect your AI key in Settings to enable generation.
          </p>
        </div>
      </div>
    </div>
  );
}

// -- Image Creation Panel --

const IMAGE_STYLES = [
  "Fantasy Art",
  "Cosmic Abstract",
  "Character Portrait",
  "Landscape",
  "Concept Art",
  "Watercolor",
  "Digital Painting",
];

export function ImageCreationPanel() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Fantasy Art");

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">Describe your vision</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            "Describe the image you want to create...\n\nExample: A luminous Guardian standing before an open Gate,\ncrystalline energy radiating outward, cosmic aurora in\nthe background, in the style of epic fantasy concept art."
          }
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none min-h-[200px]"
        />
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-2">Style:</p>
          <div className="flex flex-wrap gap-2">
            {IMAGE_STYLES.map((s) => (
              <PillBtn key={s} active={style === s} onClick={() => setStyle(s)} variant="fire">
                {s}
              </PillBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-[400px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Eye size={14} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-primary">Preview</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full aspect-square max-w-[320px] rounded-2xl border border-white/[0.06] bg-gradient-to-br from-fire/5 via-transparent to-brand-primary/5 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-2xl bg-fire/10 border border-fire/20 flex items-center justify-center">
              <Image size={28} className="text-fire/60" />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-muted">
                {prompt.trim() ? "Ready to generate" : "Describe your image above"}
              </p>
              <p className="text-[11px] text-text-muted/60 mt-1">
                {prompt.trim() ? `Style: ${style}` : "Your creation will appear here"}
              </p>
            </div>
            {prompt.trim() && (
              <StatusPill variant="fire">Connect API key in Settings</StatusPill>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Code Creation Panel --

const LANGUAGES = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "HTML/CSS"];

export function CodeCreationPanel() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("TypeScript");

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <Terminal size={14} className="text-brand-gold" />
          <div className="flex items-center gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  language === lang
                    ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
                    : "text-text-muted hover:text-text-secondary hover:bg-white/[0.04]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Begin your ${language} creation here...\n// AI will help you write, debug, and optimize.\n\n`}
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-mono text-sm leading-relaxed focus:outline-none min-h-[300px] tab-size-2"
          spellCheck={false}
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{language}</span>
          <span>{code.split("\n").length} lines</span>
        </div>
      </div>

      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Play size={14} className="text-brand-gold" />
          <span className="text-xs font-semibold text-text-primary">Output</span>
        </div>
        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <Code size={24} className="text-brand-gold/60" />
          </div>
          <p className="text-xs text-text-muted max-w-[200px]">
            {code.trim()
              ? "Code is ready. Connect an AI key to get intelligent assistance, auto-completion, and debugging."
              : "Write code on the left. AI will help with suggestions, refactoring, and debugging."}
          </p>
          <StatusPill variant="gold">AI pair programming coming soon</StatusPill>
        </div>
      </div>
    </div>
  );
}

// -- Music Creation Panel --

const MOODS = [
  "Ethereal",
  "Triumphant",
  "Melancholic",
  "Mystical",
  "Energetic",
  "Peaceful",
  "Dark",
  "Celestial",
];

export function MusicCreationPanel() {
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("Ethereal");

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">Describe the sound</span>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            "Describe the music you want to create...\n\nExample: A haunting melody with crystal chimes echoing through\na vast cavern, building to a crescendo of orchestral strings\nand choir \u2014 the moment a Gate opens for the first time."
          }
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none min-h-[200px]"
        />
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-2">Mood:</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <PillBtn key={m} active={mood === m} onClick={() => setMood(m)} variant="blue">
                {m}
              </PillBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <MusicNote size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-text-primary">Sound Preview</span>
        </div>
        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-4">
          <WaveformPlaceholder />
          <div className="text-center">
            <p className="text-xs text-text-muted">
              {description.trim() ? `Mood: ${mood}` : "Describe your sound above"}
            </p>
          </div>
          <StatusPill variant="blue">Music generation coming soon</StatusPill>
        </div>
      </div>
    </div>
  );
}

// -- Shared sub-components --
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
    >
      {children}
    </button>
  );
}

type PillVariant = "fire" | "blue" | "gold";

const PILL_ACTIVE: Record<PillVariant, string> = {
  fire: "border-fire/40 bg-fire/15 text-fire",
  blue: "border-blue-400/40 bg-blue-400/15 text-blue-400",
  gold: "border-brand-gold/40 bg-brand-gold/15 text-brand-gold",
};

const STATUS_CLASSES: Record<PillVariant, { wrapper: string; text: string }> = {
  fire: {
    wrapper: "bg-fire/10 border border-fire/20",
    text: "text-fire",
  },
  blue: {
    wrapper: "bg-blue-400/10 border border-blue-400/20",
    text: "text-blue-400",
  },
  gold: {
    wrapper: "bg-brand-gold/10 border border-brand-gold/20",
    text: "text-brand-gold",
  },
};

function PillBtn({
  active,
  onClick,
  variant,
  children,
}: {
  active: boolean;
  onClick: () => void;
  variant: PillVariant;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
        active
          ? PILL_ACTIVE[variant]
          : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
      }`}
    >
      {children}
    </button>
  );
}

function StatusPill({
  variant,
  children,
}: {
  variant: PillVariant;
  children: React.ReactNode;
}) {
  const cls = STATUS_CLASSES[variant];
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${cls.wrapper}`}>
      <Info size={12} className={cls.text} />
      <span className={`text-[10px] ${cls.text}`}>{children}</span>
    </div>
  );
}

function WaveformPlaceholder() {
  return (
    <div className="w-full h-20 rounded-xl border border-white/[0.06] bg-gradient-to-r from-blue-500/5 via-brand-primary/5 to-blue-500/5 flex items-center justify-center overflow-hidden">
      <div className="flex items-end gap-[3px] h-12">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-blue-400/40 rounded-full"
            style={{
              height: `${8 + Math.sin(i * 0.5) * 20 + Math.random() * 16}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
