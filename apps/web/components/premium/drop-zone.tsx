"use client";

import { m, AnimatePresence } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// DropZone — Universal ingestion surface for Arcanea Studio.
// Posts to /api/studio/ingest. Auto-classifies. Stores as markdown + JSONML
// with pgvector embedding (when OPENAI_API_KEY is configured server-side).
// ---------------------------------------------------------------------------

interface AcceptedType {
  label: string;
  extensions: string[];
  icon: string;
  color: string;
}

const ACCEPTED_TYPES: AcceptedType[] = [
  { label: "Markdown", extensions: [".md", ".mdx"], icon: "◩", color: "#7fffd4" },
  { label: "PDF", extensions: [".pdf"], icon: "◧", color: "#ef4444" },
  { label: "DOCX", extensions: [".docx"], icon: "◆", color: "#3b82f6" },
  { label: "Text", extensions: [".txt"], icon: "◐", color: "#00bcd4" },
  { label: "URLs", extensions: ["https://"], icon: "⎆", color: "#c084fc" },
  { label: "Paste (⌘V)", extensions: [], icon: "◈", color: "#ffd700" },
];

interface SourceOption {
  label: string;
  glyph: string;
  color: string;
  action: "drive" | "paste" | "coming-soon";
  note?: string;
}

const SOURCES: SourceOption[] = [
  { label: "Google Drive", glyph: "▲", color: "#4285f4", action: "drive" },
  { label: "Paste URL", glyph: "⎆", color: "#c084fc", action: "paste" },
  { label: "Obsidian vault", glyph: "◰", color: "#7c3aed", action: "coming-soon", note: "Q2 2026" },
  { label: "Notion", glyph: "▰", color: "#ffffff", action: "coming-soon", note: "Q3 2026" },
  { label: "Syncthing", glyph: "⟲", color: "#4fa4d4", action: "coming-soon", note: "Q3 2026" },
  { label: "GitHub", glyph: "◉", color: "#ffffff", action: "coming-soon", note: "Q2 2026" },
];

type Phase = "idle" | "submitting" | "success" | "error";

interface IngestResult {
  id: string;
  title: string;
  classification: string;
  confidence: number;
  tags: string[];
  summary?: string;
  embedded: boolean;
}

const CLASSIFICATION_COLOR: Record<string, string> = {
  character: "#ef4444",
  location: "#3b82f6",
  magic: "#ffd700",
  scene: "#7fffd4",
  lore: "#c084fc",
  reference: "#94a3b8",
  chapter: "#f472b6",
  note: "#34d399",
};

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function submitIngest(
  payload:
    | { kind: "text"; content: string; title?: string; sourceUri?: string }
    | { kind: "url"; url: string },
): Promise<IngestResult> {
  const res = await fetch("/api/studio/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? `Ingest failed (${res.status})`);
  }
  return data as IngestResult;
}

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [lastResult, setLastResult] = useState<IngestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPhase("idle");
    setError(null);
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    // Route text-like files through /api/studio/ingest (JSON body);
    // PDF/DOCX go through /api/studio/ingest/file (multipart) for
    // server-side binary extraction via unpdf + mammoth.
    const isTextLike =
      file.type.startsWith("text/") ||
      /\.(md|mdx|txt|json|yaml|yml)$/i.test(file.name);
    const isBinary =
      file.type === "application/pdf" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      /\.(pdf|docx)$/i.test(file.name);

    if (!isTextLike && !isBinary) {
      setError(
        `Unsupported file type (${file.type || file.name}). Accepted: markdown, text, PDF, DOCX.`,
      );
      setPhase("error");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File exceeds 15 MB limit");
      setPhase("error");
      return;
    }

    setPhase("submitting");
    setError(null);
    try {
      let result: IngestResult;
      if (isBinary) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/studio/ingest/file", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? `Ingest failed (${res.status})`);
        result = data as IngestResult;
      } else {
        const content = await readFileAsText(file);
        result = await submitIngest({
          kind: "text",
          content,
          title: file.name.replace(/\.[a-z0-9]+$/i, ""),
        });
      }
      setLastResult(result);
      setPhase("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }, []);

  const handleUrl = useCallback(async () => {
    const url = urlInput.trim();
    if (!url) return;
    setPhase("submitting");
    setError(null);
    try {
      const result = await submitIngest({ kind: "url", url });
      setLastResult(result);
      setPhase("success");
      setUrlInput("");
      setShowUrlInput(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }, [urlInput]);

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (phase === "submitting") return;
      const text = e.clipboardData.getData("text/plain");
      if (!text || text.length < 4) return;
      e.preventDefault();
      // Detect URL vs text
      try {
        new URL(text);
        if (text.length < 500) {
          // Treat as URL
          setPhase("submitting");
          setError(null);
          try {
            const result = await submitIngest({ kind: "url", url: text });
            setLastResult(result);
            setPhase("success");
            return;
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setPhase("error");
            return;
          }
        }
      } catch {
        // not a URL — fall through to text ingestion
      }
      setPhase("submitting");
      setError(null);
      try {
        const result = await submitIngest({ kind: "text", content: text });
        setLastResult(result);
        setPhase("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setPhase("error");
      }
    },
    [phase],
  );

  return (
    <div className="relative" onPaste={handlePaste}>
      <m.div
        animate={{
          borderColor: isDragging ? "#7fffd4" : "rgba(255,255,255,0.08)",
          backgroundColor: isDragging ? "rgba(127,255,212,0.04)" : "rgba(255,255,255,0.02)",
        }}
        transition={{ duration: 0.3 }}
        className="relative rounded-3xl border-2 border-dashed p-12 md:p-16 text-center overflow-hidden"
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) await handleFile(file);
        }}
      >
        {/* Animated aurora backdrop when dragging */}
        {isDragging && (
          <m.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <m.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(127,255,212,0.18), transparent 70%)",
                  "radial-gradient(ellipse 60% 40% at 70% 70%, rgba(0,188,212,0.16), transparent 70%)",
                  "radial-gradient(ellipse 60% 40% at 30% 70%, rgba(255,215,0,0.12), transparent 70%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </m.div>
        )}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            {phase === "submitting" && (
              <m.div
                key="submitting"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-[#7fffd4]/10 border border-[#7fffd4]/30">
                  <m.span
                    className="text-4xl text-[#7fffd4]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  >
                    ◎
                  </m.span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-2 bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] bg-clip-text text-transparent">
                  Classifying &amp; embedding…
                </h3>
                <p className="text-sm text-white/45 max-w-sm mx-auto">
                  The Studio is reading your content and routing it to your world graph.
                </p>
              </m.div>
            )}

            {phase === "success" && lastResult && (
              <m.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-[#7fffd4]/15 border border-[#7fffd4]/40">
                  <span className="text-4xl text-[#7fffd4]">✓</span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-2 text-white">
                  Ingested as{" "}
                  <span style={{ color: CLASSIFICATION_COLOR[lastResult.classification] ?? "#7fffd4" }}>
                    {lastResult.classification}
                  </span>
                </h3>
                <p className="text-sm text-white/60 mb-1 font-display font-medium">
                  {lastResult.title}
                </p>
                <p className="text-[11px] text-white/40 font-mono mb-4">
                  confidence {Math.round(lastResult.confidence * 100)}% ·{" "}
                  {lastResult.embedded ? "embedded ✓" : "not embedded"}
                </p>
                {lastResult.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                    {lastResult.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    href="/studio/vault"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/25 text-sm font-medium text-[#7fffd4] hover:bg-[#7fffd4]/20 transition-colors"
                  >
                    Open vault
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08]"
                  >
                    Drop another
                  </button>
                </div>
              </m.div>
            )}

            {phase === "error" && (
              <m.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-red-500/10 border border-red-500/30">
                  <span className="text-4xl text-red-400">!</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-2 text-red-300">
                  Couldn&apos;t ingest
                </h3>
                <p className="text-sm text-white/50 max-w-md mx-auto mb-5 font-body">
                  {error ?? "Unknown error"}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08]"
                >
                  Try again
                </button>
              </m.div>
            )}

            {phase === "idle" && !showUrlInput && (
              <m.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <m.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                  style={{
                    background: isDragging ? "rgba(127,255,212,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isDragging ? "rgba(127,255,212,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                  animate={{
                    scale: isDragging ? 1.1 : 1,
                    rotate: isDragging ? [0, -5, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <span
                    className="text-4xl"
                    style={{ color: isDragging ? "#7fffd4" : "rgba(255,255,255,0.5)" }}
                  >
                    ⇡
                  </span>
                </m.div>

                <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
                  <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                    {isDragging ? "Release to ingest" : "Drop anything in"}
                  </span>
                </h3>
                <p className="text-base text-white/45 leading-relaxed max-w-md mx-auto mb-8">
                  Markdown, PDF, DOCX, text, or URLs. Paste with ⌘V. Drag a file in. The Studio auto-classifies and stores in your world graph.
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {ACCEPTED_TYPES.map((type) => (
                    <span
                      key={type.label}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono"
                      style={{ color: `${type.color}cc` }}
                    >
                      <span>{type.icon}</span>
                      {type.label}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.mdx,.txt,.json,.yaml,.yml,.pdf,.docx,text/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFile(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-[#09090b] text-sm font-semibold hover:shadow-[0_0_24px_rgba(127,255,212,0.3)] transition-all"
                  >
                    Browse files
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    Paste URL
                  </button>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm font-mono text-white/40">
                    ⌘V to paste text
                  </span>
                </div>
              </m.div>
            )}

            {phase === "idle" && showUrlInput && (
              <m.div
                key="urlinput"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-[#c084fc]/10 border border-[#c084fc]/30 text-[#c084fc] text-2xl">
                  ⎆
                </div>
                <h3 className="text-xl font-display font-bold mb-4 text-white">
                  Paste a URL to ingest
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleUrl();
                  }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto"
                >
                  <input
                    type="url"
                    required
                    autoFocus
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7fffd4]/40"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-[#09090b] text-sm font-semibold hover:shadow-[0_0_24px_rgba(127,255,212,0.3)]"
                  >
                    Ingest
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlInput(false);
                      setUrlInput("");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/80"
                  >
                    Cancel
                  </button>
                </form>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>

      {/* Sources strip */}
      {phase === "idle" && !showUrlInput && (
        <div className="mt-6">
          <p className="text-center text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-4">
            Or pull from connected sources
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SOURCES.map((s) => {
              const isComingSoon = s.action === "coming-soon";
              const ButtonOrLink = s.action === "drive" ? Link : "button";
              const linkProps =
                s.action === "drive"
                  ? { href: "/studio/vault?connect=drive" }
                  : s.action === "paste"
                    ? { onClick: () => setShowUrlInput(true), type: "button" as const }
                    : { type: "button" as const, disabled: true };
              return (
                <ButtonOrLink
                  key={s.label}
                  // Union of Link and button props — cast to bypass the
                  // IntrinsicAttributes overlap check; shapes are runtime-safe.
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(linkProps as any)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.06] transition-all group ${
                    isComingSoon
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-white/[0.14] hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold"
                    style={{
                      background: `${s.color}15`,
                      border: `1px solid ${s.color}30`,
                      color: s.color,
                    }}
                  >
                    {s.glyph}
                  </span>
                  <span className="text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors">
                    {s.label}
                  </span>
                  {isComingSoon && s.note && (
                    <span className="text-[9px] font-mono text-white/25 tracking-wider">
                      {s.note}
                    </span>
                  )}
                </ButtonOrLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
