"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  Pen,
  Image,
  Code,
  MusicNote,
  Sparkle,
  Star,
  Copy,
  Download,
  Trash,
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
  Gear,
  Brain,
} from "@/lib/phosphor-icons";
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type CreationMode = "text" | "image" | "code" | "music";

interface ModeConfig {
  id: CreationMode;
  label: string;
  icon: React.ElementType;
  guardian: string;
  gate: string;
  element: string;
  elementColor: string;
  description: string;
}

const MODES: ModeConfig[] = [
  {
    id: "text",
    label: "Text",
    icon: Pen,
    guardian: "Lyssandria",
    gate: "Foundation",
    element: "Earth",
    elementColor: "#22c55e",
    description: "Write stories, essays, scripts, and more.",
  },
  {
    id: "image",
    label: "Image",
    icon: Image,
    guardian: "Draconia",
    gate: "Fire",
    element: "Fire",
    elementColor: "#ef4444",
    description: "Generate and refine images with AI.",
  },
  {
    id: "code",
    label: "Code",
    icon: Code,
    guardian: "Shinkami",
    gate: "Source",
    element: "Void",
    elementColor: "#ffd700",
    description: "Build software with a thinking partner.",
  },
  {
    id: "music",
    label: "Music",
    icon: MusicNote,
    guardian: "Leyla",
    gate: "Flow",
    element: "Water",
    elementColor: "#3b82f6",
    description: "Compose original music with AI.",
  },
];

const AI_SUGGESTIONS = [
  {
    title: "Expand this passage",
    description: "Add depth and sensory detail to your current scene.",
  },
  {
    title: "Strengthen the voice",
    description: "Make the narrative more vivid and resonant.",
  },
  {
    title: "Add imagery",
    description: "Weave richer visual language into your prose.",
  },
  {
    title: "Suggest a direction",
    description: "Get an unexpected angle on where this could go.",
  },
];

// ---------------------------------------------------------------------------
// Text Creation Panel
// ---------------------------------------------------------------------------

function TextCreationPanel({
  content,
  setContent,
  luminorMessages,
  onAskLuminor,
  luminorInput,
  setLuminorInput,
}: {
  content: string;
  setContent: (val: string) => void;
  luminorMessages: { role: "user" | "luminor"; text: string }[];
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
          <button
            onClick={() => insertMarkdown("**", "**")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Bold"
          >
            <TextB size={16} weight="bold" />
          </button>
          <button
            onClick={() => insertMarkdown("*", "*")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Italic"
          >
            <TextItalic size={16} />
          </button>
          <button
            onClick={() => insertMarkdown("\n1. ", "")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Ordered List"
          >
            <ListNumbers size={16} />
          </button>
          <button
            onClick={() => insertMarkdown("\n> ", "")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Blockquote"
          >
            <Quotes size={16} />
          </button>
          <button
            onClick={() => insertMarkdown("[", "](url)")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Link"
          >
            <Link size={16} />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-text-muted font-mono">
            Markdown supported
          </span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing...

Use Markdown for formatting. The AI panel can help you develop ideas."
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none min-h-[300px]"
          spellCheck
        />

        {/* Status bar */}
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
        </div>

        {/* Suggestions */}
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
                    <Sparkle
                      size={14}
                      weight="fill"
                      className="text-crystal mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-medium text-text-primary group-hover:text-crystal transition-colors">
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

        {/* Input */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={luminorInput}
              onChange={(e) => setLuminorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && luminorInput.trim()) onAskLuminor();
              }}
              placeholder="Ask Luminor..."
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

// ---------------------------------------------------------------------------
// Image Creation Panel
// ---------------------------------------------------------------------------

function ImageCreationPanel() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Fantasy Art");

  const styles = [
    "Fantasy Art",
    "Cosmic Abstract",
    "Character Portrait",
    "Landscape",
    "Concept Art",
    "Watercolor",
    "Digital Painting",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Left: Prompt Input */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">
            Describe your vision
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create...

Example: A solitary figure on a cliff edge at twilight,
crystalline light spreading across the horizon,
in the style of epic fantasy concept art."
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none min-h-[200px]"
        />

        {/* Style selector */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-2">Style:</p>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  style === s
                    ? "border-fire/40 bg-fire/15 text-fire"
                    : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="lg:w-[400px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Eye size={14} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-primary">
            Preview
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full aspect-square max-w-[320px] rounded-2xl border border-white/[0.06] bg-gradient-to-br from-fire/5 via-transparent to-brand-primary/5 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-2xl bg-fire/10 border border-fire/20 flex items-center justify-center">
              <Image size={28} className="text-fire/60" />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-muted">
                {prompt.trim()
                  ? "Ready to generate"
                  : "Describe your image above"}
              </p>
              <p className="text-[11px] text-text-muted/60 mt-1">
                {prompt.trim()
                  ? `Style: ${style}`
                  : "Your creation will appear here"}
              </p>
            </div>
            {prompt.trim() && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fire/10 border border-fire/20">
                <Info size={12} className="text-fire" />
                <span className="text-[10px] text-fire">
                  Connect API key in Settings
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code Creation Panel
// ---------------------------------------------------------------------------

function CodeCreationPanel() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("TypeScript");

  const languages = [
    "TypeScript",
    "JavaScript",
    "Python",
    "Rust",
    "Go",
    "HTML/CSS",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Left: Code Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <Terminal size={14} className="text-brand-gold" />
          <div className="flex items-center gap-2">
            {languages.map((lang) => (
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
          placeholder={`// Start writing ${language}...\n// The AI panel will help with suggestions and debugging.\n\n`}
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-mono text-sm leading-relaxed focus:outline-none min-h-[300px] tab-size-2"
          spellCheck={false}
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{language}</span>
          <span>{code.split("\n").length} lines</span>
        </div>
      </div>

      {/* Right: Output / AI */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Play size={14} className="text-brand-gold" />
          <span className="text-xs font-semibold text-text-primary">
            Output
          </span>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <Code size={24} className="text-brand-gold/60" />
          </div>
          <p className="text-xs text-text-muted max-w-[200px]">
            {code.trim()
              ? "Code is ready. Connect an AI key for assistance, auto-completion, and debugging."
              : "Write code on the left. The AI will help with suggestions, refactoring, and debugging."}
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mt-2">
            <Info size={12} className="text-brand-gold" />
            <span className="text-[10px] text-brand-gold">
              AI pair programming coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Music Creation Panel
// ---------------------------------------------------------------------------

function MusicCreationPanel() {
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("Ethereal");

  const moods = [
    "Ethereal",
    "Triumphant",
    "Melancholic",
    "Mystical",
    "Energetic",
    "Peaceful",
    "Dark",
    "Celestial",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Left: Description */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">
            Describe the sound
          </span>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the music you want to create...

Example: A haunting melody with crystal chimes echoing through
a vast space, building to a crescendo of orchestral strings
and choir — tension resolving into stillness."
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none min-h-[200px]"
        />

        {/* Mood selector */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-xs text-text-muted mb-2">Mood:</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  mood === m
                    ? "border-blue-400/40 bg-blue-400/15 text-blue-400"
                    : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <MusicNote size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-text-primary">
            Sound Preview
          </span>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-4">
          {/* Waveform placeholder */}
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

          <div className="text-center">
            <p className="text-xs text-text-muted">
              {description.trim()
                ? `Mood: ${mood}`
                : "Describe your sound above"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20">
            <Info size={12} className="text-blue-400" />
            <span className="text-[10px] text-blue-400">
              Music generation coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Studio Page
// ---------------------------------------------------------------------------

export default function StudioPage() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<CreationMode>("text");
  const [textContent, setTextContent] = useState("");
  const [luminorMessages, setLuminorMessages] = useState<
    { role: "user" | "luminor"; text: string }[]
  >([]);
  const [luminorInput, setLuminorInput] = useState("");

  const currentMode = MODES.find((m) => m.id === activeMode)!;

  const handleAskLuminor = useCallback(() => {
    if (!luminorInput.trim()) return;

    const userMsg = luminorInput.trim();
    setLuminorMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLuminorInput("");

    // Call real Luminor AI via chat API
    (async () => {
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: `You are ${currentMode.guardian}, a ${currentMode.element} Guardian of Arcanea. Help the creator with their ${activeMode} work. Be concise, wise, and practical. Respond in 2-3 sentences.` },
              ...luminorMessages.slice(-6).map((m) => ({
                role: m.role === 'luminor' ? 'assistant' : 'user',
                content: m.text,
              })),
              { role: 'user', content: userMsg },
            ],
            luminorId: currentMode.guardian.toLowerCase(),
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';

          setLuminorMessages((prev) => [...prev, { role: 'luminor', text: '' }]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
            setLuminorMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'luminor', text: fullText };
              return updated;
            });
          }
        } else {
          setLuminorMessages((prev) => [
            ...prev,
            { role: 'luminor', text: 'Connection is limited right now. Try again in a moment, or keep writing — sometimes the work itself is the best guide.' },
          ]);
        }
      } catch {
        setLuminorMessages((prev) => [
          ...prev,
          { role: 'luminor', text: 'Begin writing, and let the work reveal its own direction. The best ideas come from momentum.' },
        ]);
      }
    })();
  }, [luminorInput, currentMode.guardian]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleManifest = useCallback(async () => {
    if (!textContent.trim() && activeMode === 'text') {
      setSaveMessage('Write something first.');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    if (!user) {
      setSaveMessage('Sign in to save your creations.');
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    try {
      const res = await fetch('/api/creations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: textContent.slice(0, 100).trim() || `${activeMode} creation`,
          description: textContent.slice(0, 500).trim(),
          content: { body: textContent, mode: activeMode },
          type: activeMode === 'text' ? 'text' : activeMode === 'image' ? 'image' : activeMode === 'code' ? 'code' : 'mixed',
          status: 'draft',
          visibility: 'private',
          element: currentMode.element as 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit',
          gate: currentMode.gate as 'Foundation' | 'Flow' | 'Fire' | 'Heart' | 'Voice' | 'Sight' | 'Crown' | 'Shift' | 'Unity' | 'Source',
          guardian: currentMode.guardian,
        }),
      });

      if (res.ok) {
        setSaveMessage('Saved as draft.');
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveMessage(data.error?.message || 'Sign in to save creations.');
      }
    } catch {
      setSaveMessage('Could not save. Check your connection.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 4000);
    }
  }, [textContent, activeMode, currentMode.element, currentMode.gate, currentMode.guardian, user]);


  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div
          className="absolute inset-0 opacity-20 transition-colors duration-700"
          style={{
            background: `radial-gradient(ellipse at top right, ${currentMode.elementColor}12, transparent 55%), radial-gradient(ellipse at bottom left, rgba(127,255,212,0.06), transparent 55%)`,
          }}
        />
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 flex flex-col min-h-screen">
        {/* ── Top Bar: Mode Selector + Title ── */}
        <header className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Mode Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl liquid-glass border border-white/[0.06]">
              {MODES.map((mode) => {
                const ModeIcon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white/[0.06] text-text-primary shadow-sm"
                        : "text-text-muted hover:text-text-secondary hover:bg-white/[0.04]"
                    }`}
                    title={mode.description}
                  >
                    <ModeIcon
                      size={16}
                      weight={isActive ? "fill" : "regular"}
                      style={isActive ? { color: mode.elementColor } : undefined}
                    />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 flex items-center gap-3">
              <div className="hidden md:block">
                <h1 className="text-sm font-semibold text-text-primary">
                  Creation Studio
                </h1>
                <p className="text-[11px] text-text-muted">
                  {currentMode.description}
                </p>
              </div>
            </div>

            {/* Mode indicator */}
            <div
              className="w-2 h-2 rounded-full hidden sm:block"
              style={{ backgroundColor: currentMode.elementColor }}
            />
          </div>
        </header>

        {/* ── Workspace ── */}
        <div className="flex-1 flex flex-col rounded-2xl liquid-glass border border-white/[0.06] overflow-hidden min-h-[500px]">
          {/* Workspace Header */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (textContent) {
                    navigator.clipboard.writeText(textContent);
                  }
                }}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.08] transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={14} />
              </button>
              <button
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.08] transition-colors"
                title="Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => {
                  setTextContent("");
                  setLuminorMessages([]);
                }}
                className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Clear"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          {activeMode === "text" && (
            <TextCreationPanel
              content={textContent}
              setContent={setTextContent}
              luminorMessages={luminorMessages}
              onAskLuminor={handleAskLuminor}
              luminorInput={luminorInput}
              setLuminorInput={setLuminorInput}
            />
          )}
          {activeMode === "image" && <ImageCreationPanel />}
          {activeMode === "code" && <CodeCreationPanel />}
          {activeMode === "music" && <MusicCreationPanel />}
        </div>

        {/* ── Bottom Action Bar ── */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentMode.elementColor }}
            />
            <span>
              {currentMode.label}
            </span>
          </div>

          <div className="flex-1" />

          <button
            className="px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.04] text-xs text-text-muted hover:text-text-primary hover:bg-white/[0.08] transition-colors flex items-center gap-2"
          >
            <Gear size={14} />
            Settings
          </button>

          {saveMessage && (
            <span className="text-xs text-atlantean-teal-aqua animate-pulse">{saveMessage}</span>
          )}

          <button
            onClick={handleManifest}
            disabled={isSaving}
            className="group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all overflow-hidden disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, #7fffd4, ${currentMode.elementColor}cc, #7fffd4)`,
              backgroundSize: "200% 200%",
              color: "#0a0a1a",
            }}
          >
            <span className="relative flex items-center gap-2">
              <Star size={16} weight="fill" />
              Save
            </span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-colors" />
          </button>
        </div>
      </main>
    </div>
  );
}
