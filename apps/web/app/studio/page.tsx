"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth/context";
import { ModelSelector } from "@/components/chat/model-selector";
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
import type { ImagineGenerationResponse } from "@/lib/imagine/contracts";
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
    description: "Generate and refine images from text prompts.",
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
    description: "Compose original music and soundscapes.",
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
  aiMessages,
  onAskAI,
  aiInput,
  setAiInput,
}: {
  content: string;
  setContent: (val: string) => void;
  aiMessages: { role: "user" | "luminor"; text: string }[];
  onAskAI: () => void;
  aiInput: string;
  setAiInput: (val: string) => void;
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
            aria-label="Bold"
          >
            <TextB size={16} weight="bold" />
          </button>
          <button
            onClick={() => insertMarkdown("*", "*")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Italic"
            aria-label="Italic"
          >
            <TextItalic size={16} />
          </button>
          <button
            onClick={() => insertMarkdown("\n1. ", "")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Ordered List"
            aria-label="Ordered List"
          >
            <ListNumbers size={16} />
          </button>
          <button
            onClick={() => insertMarkdown("\n> ", "")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Blockquote"
            aria-label="Blockquote"
          >
            <Quotes size={16} />
          </button>
          <button
            onClick={() => insertMarkdown("[", "](url)")}
            className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
            title="Link"
            aria-label="Insert Link"
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
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[300px]"
          aria-label="Text editor"
          spellCheck
        />

        {/* Status bar */}
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
          <span className="text-xs font-semibold text-text-primary">
            Companion
          </span>
        </div>

        {/* Suggestions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {aiMessages.length === 0 ? (
            <>
              <p className="text-xs text-text-muted mb-3 px-1">
                Suggestions to enhance your creation:
              </p>
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    setAiInput(s.title);
                    setTimeout(onAskAI, 50);
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
                    <span className="font-semibold text-[10px] uppercase tracking-wider">
                      AI
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
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && aiInput.trim()) onAskAI();
              }}
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

interface GeneratedImageData {
  id: string;
  url: string;
  prompt: string;
}

function ImageCreationPanel({
  imagePrompt,
  setImagePrompt,
  generatedImages,
  setGeneratedImages,
}: {
  imagePrompt: string;
  setImagePrompt: (val: string) => void;
  generatedImages: GeneratedImageData[];
  setGeneratedImages: (val: GeneratedImageData[]) => void;
}) {
  const [style, setStyle] = useState("Fantasy Art");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const prompt = imagePrompt;
  const setPrompt = setImagePrompt;

  const styles = [
    "Fantasy Art",
    "Cosmic Abstract",
    "Character Portrait",
    "Landscape",
    "Concept Art",
    "Watercolor",
    "Digital Painting",
  ];

  const ratios = ["1:1", "16:9", "9:16", "4:3", "3:2"];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setImageError(null);

    const fullPrompt = `${prompt.trim()}, ${style.toLowerCase()} style`;

    try {
      const res = await fetch("/api/imagine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, count: 4, aspectRatio }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Generation failed (${res.status})`);
      }

      const data = (await res.json()) as ImagineGenerationResponse;
      const images: GeneratedImageData[] = (data.images || []).map(
        (img: { url?: string; data?: string; mimeType?: string; prompt?: string }, i: number) => ({
          id: `studio_img_${Date.now()}_${i}`,
          url: img.url || (img.data ? `data:${img.mimeType || "image/png"};base64,${img.data}` : ""),
          prompt: img.prompt || fullPrompt,
        })
      );

      setGeneratedImages(images);
      if (images.length > 0) setSelectedImage(images[0].id);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, style, aspectRatio, isGenerating]);

  const activeImage = generatedImages.find((img) => img.id === selectedImage);

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && prompt.trim()) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Describe the image you want to create...

Example: A solitary figure on a cliff edge at twilight,
crystalline light spreading across the horizon,
in the style of epic fantasy concept art."
          aria-label="Image prompt"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[200px]"
        />

        {/* Style selector */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02] space-y-3">
          <div>
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
          <div>
            <p className="text-xs text-text-muted mb-2">Aspect ratio:</p>
            <div className="flex flex-wrap gap-2">
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all font-mono ${
                    aspectRatio === r
                      ? "border-fire/40 bg-fire/15 text-fire"
                      : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isGenerating
                ? "rgba(239,68,68,0.15)"
                : "linear-gradient(135deg, #ef4444, #00bcd4)",
              color: isGenerating ? "#ef4444" : "#0a0a1a",
            }}
          >
            {isGenerating ? (
              <>
                <Sparkle size={14} className="animate-spin" style={{ animationDuration: "2s" }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkle size={14} weight="fill" />
                Generate Image
              </>
            )}
          </button>
          <p className="text-[10px] text-text-muted text-center">
            {prompt.trim() ? "Ctrl+Enter to generate" : "Enter a prompt to begin"}
          </p>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="lg:w-[400px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Eye size={14} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-primary">
            Preview
          </span>
          {generatedImages.length > 0 && (
            <span className="text-[10px] text-text-muted ml-auto">
              {generatedImages.length} image{generatedImages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {imageError && (
            <div className="mb-3 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-300 flex items-center justify-between">
              <span>{imageError}</span>
              <button onClick={() => setImageError(null)} className="text-red-400 hover:text-red-300 ml-2 shrink-0">
                <Info size={12} />
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-fire/10 border border-fire/20 flex items-center justify-center">
                <Sparkle size={24} className="text-fire animate-spin" style={{ animationDuration: "2s" }} />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-primary">Generating your vision...</p>
                <p className="text-[11px] text-text-muted mt-1">This may take 10-30 seconds</p>
              </div>
            </div>
          )}

          {!isGenerating && generatedImages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-fire/10 border border-fire/20 flex items-center justify-center">
                <Image size={28} className="text-fire/60" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-muted">
                  {prompt.trim() ? "Ready to generate" : "Describe your image"}
                </p>
                <p className="text-[11px] text-text-muted/60 mt-1">
                  {prompt.trim() ? `Style: ${style} | ${aspectRatio}` : "Your creation will appear here"}
                </p>
              </div>
            </div>
          )}

          {!isGenerating && activeImage && (
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative rounded-xl overflow-hidden border border-white/[0.08] group">
                <img
                  src={activeImage.url}
                  alt={activeImage.prompt}
                  className="w-full object-contain bg-black/20"
                />
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={activeImage.url}
                    download={`arcanea-${activeImage.id}.png`}
                    className="p-2 rounded-lg bg-black/60 border border-white/[0.12] text-white hover:bg-black/80 transition-colors"
                    title="Download"
                  >
                    <Download size={12} />
                  </a>
                </div>
              </div>

              {/* Thumbnails */}
              {generatedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {generatedImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                        selectedImage === img.id
                          ? "border-fire/50 ring-1 ring-fire/30"
                          : "border-white/[0.06] hover:border-white/[0.12]"
                      }`}
                    >
                      <img src={img.url} alt="" width={80} height={80} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code Creation Panel
// ---------------------------------------------------------------------------

function CodeCreationPanel({
  code,
  setCode,
  language,
  setLanguage,
  selectedModel,
}: {
  code: string;
  setCode: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  selectedModel?: string;
}) {
  const [codeAiMessages, setCodeAiMessages] = useState<
    { role: "user" | "luminor"; text: string }[]
  >([]);
  const [codeAiInput, setCodeAiInput] = useState("");
  const [isCodeGenerating, setIsCodeGenerating] = useState(false);

  const languages = [
    "TypeScript",
    "JavaScript",
    "Python",
    "Rust",
    "Go",
    "HTML/CSS",
  ];

  const CODE_SUGGESTIONS = [
    { title: "Generate from description", description: "Describe what you need and get complete code." },
    { title: "Explain this code", description: "Get a clear explanation of what the code does." },
    { title: "Refactor for quality", description: "Improve structure, naming, and patterns." },
    { title: "Find and fix bugs", description: "Identify potential issues and get fixes." },
  ];

  const handleCodeAI = useCallback(async () => {
    const input = codeAiInput.trim();
    if (!input || isCodeGenerating) return;

    setCodeAiMessages((prev) => [...prev, { role: "user", text: input }]);
    setCodeAiInput("");
    setIsCodeGenerating(true);

    try {
      const systemPrompt = `You are a code generation Luminor working in ${language}. Write clean, production-quality code. When given a description, generate the complete implementation. When asked to explain, refactor, or debug, analyze the provided code carefully. Use ${language} by default. Be concise and practical. If the user provides existing code, consider it as context.`;

      const contextMsg = code.trim()
        ? `\n\n[Current code in editor]:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``
        : "";

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...codeAiMessages.slice(-6).map((m) => ({
              role: m.role === "luminor" ? "assistant" : "user",
              content: m.text,
            })),
            { role: "user", content: input + contextMsg },
          ],
          gatewayModel: selectedModel || undefined,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let streamBuffer = "";

        setCodeAiMessages((prev) => [...prev, { role: "luminor", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          streamBuffer += decoder.decode(value, { stream: true });
          // Parse data stream protocol: 0:"text"\n
          const lines = streamBuffer.split("\n");
          streamBuffer = lines.pop() || "";
          for (const line of lines) {
            const match = line.match(/^0:"((?:[^"\\]|\\.)*)"/);
            if (match) {
              fullText += match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
            } else if (!line.startsWith("e:") && !line.startsWith("d:") && line.trim()) {
              fullText += line;
            }
          }
          setCodeAiMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "luminor", text: fullText };
            return updated;
          });
        }

        // If the response contains a code block, offer to apply it
        const codeMatch = fullText.match(/```[\w]*\n([\s\S]*?)```/);
        if (codeMatch && codeMatch[1]?.trim()) {
          setCodeAiMessages((prev) => [
            ...prev,
            {
              role: "luminor",
              text: "__CODE_BLOCK__" + codeMatch[1].trim(),
            },
          ]);
        }
      } else {
        setCodeAiMessages((prev) => [
          ...prev,
          {
            role: "luminor",
            text: "AI service is not available right now. Check that an API key is configured.",
          },
        ]);
      }
    } catch {
      setCodeAiMessages((prev) => [
        ...prev,
        {
          role: "luminor",
          text: "Could not reach the AI service. Check your connection and try again.",
        },
      ]);
    } finally {
      setIsCodeGenerating(false);
    }
  }, [codeAiInput, code, language, codeAiMessages, isCodeGenerating, selectedModel]);

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
          placeholder={`// Start writing ${language}...\n// The AI panel can generate, explain, refactor, or debug your code.\n\n`}
          aria-label="Code editor"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[300px] tab-size-2"
          spellCheck={false}
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{language}</span>
          <span>{code.split("\n").length} lines</span>
          {isCodeGenerating && (
            <span className="flex items-center gap-1.5 text-brand-gold">
              <Sparkle size={10} className="animate-spin" style={{ animationDuration: "2s" }} />
              AI thinking...
            </span>
          )}
        </div>
      </div>

      {/* Right: AI Panel */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold to-brand-primary flex items-center justify-center">
            <Brain size={14} className="text-cosmic-void" />
          </div>
          <span className="text-xs font-semibold text-text-primary">
            Code AI
          </span>
        </div>

        {/* Messages / Suggestions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {codeAiMessages.length === 0 ? (
            <>
              <p className="text-xs text-text-muted mb-3 px-1">
                Code assistance:
              </p>
              {CODE_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    setCodeAiInput(s.title);
                    setTimeout(handleCodeAI, 50);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-brand-gold/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <Code
                      size={14}
                      className="text-brand-gold mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-medium text-text-primary group-hover:text-brand-gold transition-colors">
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
            codeAiMessages.map((msg, i) => {
              // Special handling for extracted code blocks
              if (msg.role === "luminor" && msg.text.startsWith("__CODE_BLOCK__")) {
                const extractedCode = msg.text.replace("__CODE_BLOCK__", "");
                return (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-brand-gold/5 border border-brand-gold/20"
                  >
                    <button
                      onClick={() => setCode(extractedCode)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-medium text-brand-gold hover:bg-brand-gold/10 transition-colors flex items-center gap-1.5"
                    >
                      <Play size={10} weight="fill" />
                      Apply generated code to editor
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-primary/10 border border-brand-primary/20 text-text-primary ml-6"
                      : "bg-white/[0.03] border border-white/[0.08] text-text-secondary mr-2"
                  }`}
                >
                  {msg.role === "luminor" && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-brand-gold">
                      <Code size={10} />
                      <span className="font-semibold text-[10px] uppercase tracking-wider">
                        Code AI
                      </span>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">{msg.text}</pre>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={codeAiInput}
              onChange={(e) => setCodeAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && codeAiInput.trim()) handleCodeAI();
              }}
              placeholder="Ask about code..."
              aria-label="Ask about code"
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-brand-gold/40 focus:ring-2 focus:ring-brand-gold/20 transition-colors"
            />
            <button
              onClick={handleCodeAI}
              disabled={!codeAiInput.trim() || isCodeGenerating}
              className="p-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-primary text-cosmic-void hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send code question"
            >
              <PaperPlane size={14} weight="fill" />
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2 px-1">
            Code in the editor is sent as context to the AI.
          </p>
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
          aria-label="Music description"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[200px]"
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
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "luminor"; text: string }[]
  >([]);
  const [aiInput, setAiInput] = useState("");

  // Intelligence Gateway model selection
  const [selectedModel, setSelectedModel] = useState("arcanea-auto");

  // Lifted state for image panel
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);

  // Lifted state for code panel
  const [codeContent, setCodeContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("TypeScript");

  const currentMode = MODES.find((m) => m.id === activeMode)!;

  const handleAskAI = useCallback(() => {
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");

    // Call AI via chat API
    (async () => {
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: `You are ${currentMode.guardian}, a ${currentMode.element} Luminor of Arcanea. Help the creator with their ${activeMode} work. Be concise, wise, and practical. Respond in 2-3 sentences.` },
              ...aiMessages.slice(-6).map((m) => ({
                role: m.role === 'luminor' ? 'assistant' : 'user',
                content: m.text,
              })),
              { role: 'user', content: userMsg },
            ],
            luminorId: currentMode.guardian.toLowerCase(),
            gatewayModel: selectedModel || undefined,
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';
          let streamBuffer = '';

          setAiMessages((prev) => [...prev, { role: 'luminor', text: '' }]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            streamBuffer += decoder.decode(value, { stream: true });
            // Parse data stream protocol: 0:"text"\n
            const lines = streamBuffer.split('\n');
            streamBuffer = lines.pop() || '';
            for (const line of lines) {
              const match = line.match(/^0:"((?:[^"\\]|\\.)*)"/);
              if (match) {
                fullText += match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
              } else if (!line.startsWith('e:') && !line.startsWith('d:') && line.trim()) {
                fullText += line;
              }
            }
            setAiMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'luminor', text: fullText };
              return updated;
            });
          }
        } else {
          setAiMessages((prev) => [
            ...prev,
            { role: 'luminor', text: 'Connection is limited right now. Try again in a moment, or keep writing — sometimes the work itself is the best guide.' },
          ]);
        }
      } catch {
        setAiMessages((prev) => [
          ...prev,
          { role: 'luminor', text: 'Begin writing, and let the work reveal its own direction. The best ideas come from momentum.' },
        ]);
      }
    })();
  }, [aiInput, currentMode.guardian, currentMode.element, activeMode, aiMessages, selectedModel]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleManifest = useCallback(async () => {
    // Determine content based on active mode
    let contentBody: string;
    let contentPayload: Record<string, unknown>;
    let title: string;
    let description: string;

    switch (activeMode) {
      case 'text':
        contentBody = textContent.trim();
        if (!contentBody) {
          setSaveMessage('Write something first.');
          setTimeout(() => setSaveMessage(''), 3000);
          return;
        }
        title = contentBody.split('\n')[0].slice(0, 100) || 'Text creation';
        description = contentBody.slice(0, 500);
        contentPayload = { body: contentBody, mode: 'text' };
        break;

      case 'image':
        if (generatedImages.length === 0) {
          setSaveMessage('Generate an image first.');
          setTimeout(() => setSaveMessage(''), 3000);
          return;
        }
        title = imagePrompt.slice(0, 100) || 'Image creation';
        description = imagePrompt.slice(0, 500);
        contentPayload = {
          prompt: imagePrompt,
          images: generatedImages.map((img) => ({ url: img.url, prompt: img.prompt })),
          mode: 'image',
        };
        break;

      case 'code':
        contentBody = codeContent.trim();
        if (!contentBody) {
          setSaveMessage('Write some code first.');
          setTimeout(() => setSaveMessage(''), 3000);
          return;
        }
        title = `${codeLanguage} — ${contentBody.split('\n')[0].replace(/^\/\/\s*/, '').slice(0, 80) || 'Code creation'}`;
        description = contentBody.slice(0, 500);
        contentPayload = { body: contentBody, language: codeLanguage, mode: 'code' };
        break;

      case 'music':
        setSaveMessage('Music saving is not available yet.');
        setTimeout(() => setSaveMessage(''), 3000);
        return;

      default:
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
      let res: Response;

      if (activeMode === 'image') {
        // Upload the first generated image to Supabase Storage via studio/save
        const primaryImage = generatedImages[0];
        res = await fetch('/api/studio/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: primaryImage.url,
            prompt: imagePrompt,
            title: title.trim(),
            element: currentMode.element,
            gate: currentMode.gate,
            guardian: currentMode.guardian,
          }),
        });
      } else {
        res = await fetch('/api/creations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title: title.trim(),
            description: description.trim(),
            content: contentPayload,
            type: activeMode === 'text' ? 'text' : activeMode === 'code' ? 'code' : 'mixed',
            status: 'draft',
            visibility: 'private',
            element: currentMode.element as 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit',
            gate: currentMode.gate as 'Foundation' | 'Flow' | 'Fire' | 'Heart' | 'Voice' | 'Sight' | 'Crown' | 'Starweave' | 'Unity' | 'Source',
            guardian: currentMode.guardian,
          }),
        });
      }

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
  }, [textContent, imagePrompt, generatedImages, codeContent, codeLanguage, activeMode, currentMode.element, currentMode.gate, currentMode.guardian, user]);


  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div
          className="absolute inset-0 opacity-20 transition-colors duration-700"
          style={{
            background: `radial-gradient(ellipse at top right, ${currentMode.elementColor}12, transparent 55%), radial-gradient(ellipse at bottom left, rgba(0,188,212,0.06), transparent 55%)`,
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
                const ModeIcon = mode.icon as React.ComponentType<any>;
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
            {/* Model Selector — Intelligence Gateway */}
            {(activeMode === "text" || activeMode === "code") && (
              <ModelSelector
                value={selectedModel}
                onChange={setSelectedModel}
              />
            )}

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const copyContent =
                    activeMode === 'text' ? textContent :
                    activeMode === 'code' ? codeContent :
                    activeMode === 'image' ? imagePrompt : '';
                  if (copyContent) navigator.clipboard.writeText(copyContent);
                }}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.08] transition-colors"
                title="Copy to clipboard"
                aria-label="Copy to clipboard"
              >
                <Copy size={14} />
              </button>
              <button
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.08] transition-colors"
                title="Download"
                aria-label="Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => {
                  if (activeMode === 'text') { setTextContent(""); setAiMessages([]); }
                  else if (activeMode === 'code') { setCodeContent(""); }
                  else if (activeMode === 'image') { setImagePrompt(""); setGeneratedImages([]); }
                }}
                className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Clear"
                aria-label="Clear content"
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
              aiMessages={aiMessages}
              onAskAI={handleAskAI}
              aiInput={aiInput}
              setAiInput={setAiInput}
            />
          )}
          {activeMode === "image" && (
            <ImageCreationPanel
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              generatedImages={generatedImages}
              setGeneratedImages={setGeneratedImages}
            />
          )}
          {activeMode === "code" && (
            <CodeCreationPanel
              code={codeContent}
              setCode={setCodeContent}
              language={codeLanguage}
              setLanguage={setCodeLanguage}
              selectedModel={selectedModel}
            />
          )}
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
            <span className="text-xs text-[#00bcd4] animate-pulse">{saveMessage}</span>
          )}

          <button
            onClick={handleManifest}
            disabled={isSaving}
            className="group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all overflow-hidden disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, #00bcd4, ${currentMode.elementColor}cc, #00bcd4)`,
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
