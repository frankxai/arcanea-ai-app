"use client";

import { useState, useEffect, useCallback } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GeneratedCharacter {
  name: string;
  title?: string;
  backstory?: string;
  element?: string;
  origin_class?: string;
}

interface GeneratedLocation {
  name: string;
  region?: string;
  description?: string;
  significance?: string;
}

interface GeneratedWorld {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  mood?: string;
  elements?: { name: string; domain: string; color: string }[];
  palette?: { primary: string; secondary: string; accent: string };
}

interface GenerateResult {
  world: GeneratedWorld;
  characters: GeneratedCharacter[];
  locations: GeneratedLocation[];
  event?: { title: string; description: string; era?: string };
  image_prompt?: string;
  saved: boolean;
  world_id?: string;
}

type Phase = "input" | "generating" | "result";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXAMPLES = [
  "A world where music is magic and silence is death",
  "A cyberpunk city run by AI gods who dream in code",
  "An underwater civilization where emotions control the weather",
  "A dying star that holds the last library of the universe",
];

const PROGRESS_STEPS = [
  "Naming your world...",
  "Forging characters...",
  "Mapping locations...",
  "Writing the founding myth...",
  "Choosing a color palette...",
];

const REFINE_SUFFIXES = [
  "more dramatic and epic",
  "darker and more mysterious",
  "more whimsical and playful",
  "grittier and more realistic",
  "more ancient and mythological",
];

const EL_GLOW: Record<string, string> = {
  fire: "shadow-red-500/30", water: "shadow-blue-400/30", earth: "shadow-emerald-500/30",
  wind: "shadow-slate-300/30", void: "shadow-purple-500/30", spirit: "shadow-amber-400/30",
  light: "shadow-yellow-300/30", shadow: "shadow-violet-600/30",
};

function elGlow(n: string) {
  const k = n.toLowerCase();
  return Object.entries(EL_GLOW).find(([x]) => k.includes(x))?.[1] ?? "shadow-[#00bcd4]/30";
}

// ---------------------------------------------------------------------------
// Genre Preview — predictive pill after 20+ chars
// ---------------------------------------------------------------------------

const GENRE_RULES: { keywords: string[]; genre: string; color: string }[] = [
  { keywords: ["magic", "wizard", "spell", "enchant", "sorcery", "fantasy", "dragon", "elf"], genre: "Fantasy", color: "#7c3aed" },
  { keywords: ["cyber", "neon", "hack", "android", "augment", "neural"], genre: "Cyberpunk", color: "#00bcd4" },
  { keywords: ["underwater", "ocean", "sea", "coral", "abyss", "depth"], genre: "Aquatic", color: "#3b82f6" },
  { keywords: ["space", "star", "galaxy", "nebula", "cosmic", "planet", "orbit"], genre: "Cosmic", color: "#fbbf24" },
  { keywords: ["medieval", "knight", "castle", "kingdom", "feudal", "sword"], genre: "Medieval", color: "#a3a3a3" },
  { keywords: ["horror", "dark", "death", "haunt", "shadow", "dread", "fear"], genre: "Horror", color: "#ef4444" },
];

function GenrePreview({ description }: { description: string }) {
  if (description.length < 20) return null;
  const lower = description.toLowerCase();
  const match = GENRE_RULES.find((r) => r.keywords.some((k) => lower.includes(k)));
  if (!match) return null;
  return (
    <m.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="flex items-center gap-2 mt-2 px-1">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: match.color }} />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: match.color }} />
      </span>
      <span className="text-xs text-white/40">{match.genre} World</span>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#00bcd4]/[0.04] rounded-full blur-[120px] animate-pulse" /><div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#7c3aed]/[0.04] rounded-full blur-[120px]" style={{ animationDelay: "2s" }} /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#ffd700]/[0.02] rounded-full blur-[150px]" />
    </div>
  );
}

function GeneratingOverlay({ step }: { step: number }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="relative w-28 h-28 mb-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00bcd4]/30 via-[#7c3aed]/20 to-[#ffd700]/20 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#00bcd4]/40 via-[#7c3aed]/30 to-[#ffd700]/30 animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#00bcd4] via-[#7c3aed] to-[#ffd700] opacity-50 blur-sm" />
        <div className="absolute inset-8 rounded-full bg-[#09090b]" />
      </div>
      <p className="text-white/60 text-lg font-display mb-8">Weaving the fabric of your universe...</p>
      <div className="space-y-3 max-w-xs">
        {PROGRESS_STEPS.map((label, i) => (
          <m.div key={label} initial={{ opacity: 0, x: -12 }}
            animate={i <= step ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.15, duration: 0.4 }}
            className={`flex items-center gap-3 text-sm ${i <= step ? "text-white/70" : "text-white/10"}`}>
            <span className={`w-2 h-2 rounded-full ${i < step ? "bg-[#00bcd4]" : i === step ? "bg-[#00bcd4] animate-pulse" : "bg-white/10"}`} />
            {label}
          </m.div>
        ))}
      </div>
    </m.div>
  );
}

function HeroSection({ world, heroImage }: { world: GeneratedWorld; heroImage: string | null }) {
  const from = world.palette?.primary || "#00bcd4";
  const to = world.palette?.secondary || "#7c3aed";
  const h = heroImage ? 320 : 200;
  return (
    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="relative w-full rounded-2xl overflow-hidden mb-12" style={{ minHeight: h }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${from}22, ${to}22, #09090b)` }} />
      {heroImage && <img src={heroImage} alt={`Concept art for ${world.name}`} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 py-10" style={{ minHeight: h }}>
        <p className="text-[#00bcd4] font-mono text-xs tracking-widest uppercase mb-3">Your World</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 text-center drop-shadow-lg">{world.name}</h2>
        {world.tagline && <p className="text-lg text-white/60 max-w-xl text-center">{world.tagline}</p>}
      </div>
    </m.div>
  );
}

function ElementOrbs({ elements }: { elements: { name: string; domain: string; color: string }[] }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
      className="flex flex-wrap items-center justify-center gap-5 mb-12">
      {elements.map((el, i) => (
        <m.div key={el.name} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }} className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full shadow-lg ${elGlow(el.name)} relative`} style={{ backgroundColor: el.color }}>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ boxShadow: `0 0 20px ${el.color}40, 0 0 40px ${el.color}20` }} />
          </div>
          <span className="text-xs text-white/50 font-medium">{el.name}</span>
          <span className="text-[10px] text-white/25">{el.domain}</span>
        </m.div>
      ))}
    </m.div>
  );
}

const EL_STRIPE: Record<string, string> = {
  fire: "#ef4444", water: "#3b82f6", earth: "#22c55e", wind: "#94a3b8", void: "#8b5cf6", spirit: "#fbbf24",
};

function CharacterCard({ char, index }: { char: GeneratedCharacter; index: number }) {
  const el = char.element?.toLowerCase() || "";
  const stripe = Object.entries(EL_STRIPE).find(([k]) => el.includes(k))?.[1] ?? "#00bcd4";
  return (
    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.15 }}
      className="rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all overflow-hidden flex">
      <div className="w-1 shrink-0" style={{ backgroundColor: stripe }} />
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-display font-semibold text-white">{char.name}</h4>
          {char.element && <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00bcd4]/10 text-[#00bcd4] border border-[#00bcd4]/20">{char.element}</span>}
        </div>
        {char.title && <p className="text-xs text-white/40 mb-1">{char.title}</p>}
        {char.origin_class && <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-[#7c3aed]/10 text-[#7c3aed]/70 border border-[#7c3aed]/20 mb-2">{char.origin_class}</span>}
        {char.backstory && <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{char.backstory}</p>}
      </div>
    </m.div>
  );
}

function LocationCard({ loc, index }: { loc: GeneratedLocation; index: number }) {
  return (
    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + index * 0.15 }}
      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all">
      {loc.region && <p className="text-[10px] text-[#7c3aed]/50 uppercase tracking-widest mb-2">{loc.region}</p>}
      <h4 className="font-display font-semibold text-white mb-1">{loc.name}</h4>
      {loc.description && <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-2">{loc.description}</p>}
      {loc.significance && <p className="text-xs text-white/30 italic line-clamp-2">{loc.significance}</p>}
    </m.div>
  );
}

function FoundingEvent({ event, worldName }: { event: { title: string; description: string; era?: string }; worldName: string }) {
  return (
    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
      className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 mb-10 relative overflow-hidden">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#ffd700]/30 via-[#ffd700]/10 to-transparent" />
      <div className="absolute left-[19px] top-6 w-3 h-3 rounded-full bg-[#ffd700]/60 ring-2 ring-[#ffd700]/20" />
      <div className="pl-8">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-xs text-[#ffd700]/50 uppercase tracking-wider">Founding Event</p>
          {event.era && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffd700]/10 text-[#ffd700]/60 border border-[#ffd700]/20">{event.era}</span>}
        </div>
        <p className="text-xs text-white/25 mb-2">The beginning of {worldName}</p>
        <h4 className="font-display font-semibold text-white mb-2">{event.title}</h4>
        <p className="text-sm text-white/45 leading-relaxed">{event.description}</p>
      </div>
    </m.div>
  );
}

function PaletteSection({ palette }: { palette: { primary: string; secondary: string; accent: string } }) {
  const swatches = [["Primary", palette.primary], ["Secondary", palette.secondary], ["Accent", palette.accent]] as const;
  return (
    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mb-10">
      <p className="text-sm font-mono text-white/30 uppercase tracking-wider mb-4">Palette</p>
      <div className="flex gap-4">
        {swatches.map(([label, color]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="w-20 h-14 rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-white/30">{label}</span>
            <span className="text-[11px] text-white/50 font-mono">{color}</span>
          </div>
        ))}
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function CreateWorldPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(-1);

  // Keyboard shortcuts: Cmd/Ctrl+Enter to generate, Escape to reset, Tab to cycle examples
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === "input" && e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); generate(); }
      if (phase === "input" && e.key === "Tab" && !e.shiftKey && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const next = (exampleIdx + 1) % EXAMPLES.length;
        setExampleIdx(next);
        setDescription(EXAMPLES[next]);
      }
      if (phase === "result" && e.key === "Escape") { e.preventDefault(); reset(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, exampleIdx, generate, reset]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data?.user);
    });

    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    if (prompt) setDescription(prompt.slice(0, 500));
  }, []);

  useEffect(() => {
    if (phase !== "generating") return;
    setProgressStep(0);
    const interval = setInterval(() => {
      setProgressStep((s) => (s < PROGRESS_STEPS.length - 1 ? s + 1 : s));
    }, 4000);
    return () => clearInterval(interval);
  }, [phase]);

  const generateHeroImage = useCallback(async (imagePrompt: string, worldName: string) => {
    setImageLoading(true);
    try {
      const res = await fetch("/api/worlds/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "world",
          blueprint: { prompt: imagePrompt, name: worldName },
        }),
      });

      if (!res.ok) return;
      const data = await res.json();
      if (data.generated && data.imageData && data.mimeType) {
        setHeroImage(`data:${data.mimeType};base64,${data.imageData}`);
      }
    } catch {
      // Non-blocking — silently continue without image
    } finally {
      setImageLoading(false);
    }
  }, []);

  const generate = useCallback(async (desc?: string) => {
    const trimmed = (desc || description).trim();
    if (!trimmed || trimmed.length < 5) return;

    setError(null);
    setHeroImage(null);
    setPhase("generating");
    try {
      const res = await fetch("/api/worlds/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Generation failed (${res.status})`);
      }

      const data: GenerateResult = await res.json();
      setResult(data);
      setPhase("result");

      // Phase 2: generate hero image in background
      if (data.image_prompt) {
        generateHeroImage(data.image_prompt, data.world.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("input");
    }
  }, [description, generateHeroImage]);

  const saveWorld = useCallback(async () => {
    if (!result || saving) return;
    setSaving(true);

    try {
      if (result.saved && result.world?.slug) {
        window.location.href = `/worlds/${result.world.slug}`;
        return;
      }

      const res = await fetch("/api/worlds/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) throw new Error("Failed to save world");
      const data: GenerateResult = await res.json();
      if (data.world?.slug) {
        window.location.href = `/worlds/${data.world.slug}`;
      }
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [result, saving, description]);

  const startRefine = () => {
    setRefining(true);
  };

  const handleRefine = (suffix: string) => {
    const newDesc = `${description} -- but make it ${suffix}`;
    setDescription(newDesc.slice(0, 500));
    setRefining(false);
    generate(newDesc.slice(0, 500));
  };

  const reset = () => {
    setPhase("input");
    setDescription("");
    setResult(null);
    setHeroImage(null);
    setError(null);
    setRefining(false);
  };

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen bg-[#09090b] text-white relative">
        <AuroraBackground />

        {/* Back nav */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8">
          <Link
            href="/worlds"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Worlds
          </Link>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-24">
          <AnimatePresence mode="wait">
            {/* -- Phase: Input ----------------------------------------- */}
            {phase === "input" && (
              <m.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#00bcd4]/60" />
                  <span className="text-[#00bcd4] font-mono text-xs tracking-widest uppercase">World Forge</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#00bcd4]/60" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
                  <span className="text-white">Create a </span>
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #00bcd4, #7c3aed, #ffd700)" }}>World</span>
                </h1>

                <p className="text-lg text-white/40 max-w-lg mb-10">
                  Describe your world in one sentence. AI will generate characters, locations, lore, and a color palette.
                </p>

                <div className="w-full max-w-2xl mb-6">
                  <div className="relative rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.4)] focus-within:shadow-[0_0_0_1px_rgba(0,188,212,0.3),0_8px_40px_rgba(0,0,0,0.4),0_0_80px_rgba(0,188,212,0.08)] transition-all duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-white/[0.025] backdrop-blur-2xl" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }
                      }}
                      placeholder="A floating archipelago where gravity is controlled by ancient crystals..."
                      rows={3}
                      className="relative w-full px-6 py-5 bg-transparent text-white/90 placeholder-white/20 resize-none focus:outline-none font-body text-[15px] leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-xs text-white/20">{description.length}/500</span>
                    {error && <span className="text-xs text-red-400">{error}</span>}
                  </div>
                  <AnimatePresence>
                    <GenrePreview description={description} />
                  </AnimatePresence>
                </div>

                <m.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => generate()}
                  disabled={description.trim().length < 5}
                  className={`px-10 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                    description.trim().length >= 5
                      ? "bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white shadow-lg shadow-[#00bcd4]/20 hover:shadow-[#00bcd4]/40"
                      : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                  }`}
                >
                  Create World
                </m.button>

                <div className="mt-10 w-full max-w-2xl">
                  <p className="text-xs text-white/20 mb-3 uppercase tracking-wider">Try one of these</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setDescription(ex)}
                        className="px-4 py-2 rounded-full text-[13px] text-white/30 hover:text-white/65 bg-white/[0.02] hover:bg-[#00bcd4]/[0.06] border border-white/[0.04] hover:border-[#00bcd4]/20 transition-all duration-300"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </m.div>
            )}

            {/* -- Phase: Generating ------------------------------------ */}
            {phase === "generating" && (
              <GeneratingOverlay key="generating" step={progressStep} />
            )}

            {/* -- Phase: Result ---------------------------------------- */}
            {phase === "result" && result && (
              <m.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Hero section with image */}
                <HeroSection world={result.world} heroImage={heroImage} />

                {/* Image loading indicator */}
                {imageLoading && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                      <div className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
                      <span className="text-xs text-white/40">Generating concept art...</span>
                    </div>
                  </m.div>
                )}

                {/* Description */}
                {result.world.description && (
                  <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-white/35 max-w-2xl mx-auto leading-relaxed text-center mb-10"
                  >
                    {result.world.description}
                  </m.p>
                )}

                {/* Element orbs */}
                {result.world.elements && result.world.elements.length > 0 && (
                  <ElementOrbs elements={result.world.elements} />
                )}

                {/* Characters */}
                {result.characters.length > 0 && (
                  <div className="mb-10">
                    <m.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm font-mono text-[#00bcd4]/60 uppercase tracking-wider mb-4"
                    >
                      Characters
                    </m.h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.characters.slice(0, 3).map((c, i) => (
                        <CharacterCard key={c.name} char={c} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {result.locations.length > 0 && (
                  <div className="mb-10">
                    <m.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-sm font-mono text-[#7c3aed]/60 uppercase tracking-wider mb-4"
                    >
                      Locations
                    </m.h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.locations.slice(0, 3).map((l, i) => (
                        <LocationCard key={l.name} loc={l} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Founding event */}
                {result.event && (
                  <FoundingEvent event={result.event} worldName={result.world.name} />
                )}

                {/* Palette */}
                {result.world.palette && <PaletteSection palette={result.world.palette} />}

                {/* CTA */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="mt-12 text-center"
                >
                  <p className="text-white/30 text-sm mb-6">
                    This is your world. What happens next?
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isAuthenticated ? (
                      <m.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={saveWorld}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white font-bold rounded-xl shadow-lg shadow-[#00bcd4]/20 hover:shadow-[#00bcd4]/40 transition-shadow disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Enter This World"}
                        {!saving && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        )}
                      </m.button>
                    ) : (
                      <Link
                        href="/auth/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white font-bold rounded-xl shadow-lg shadow-[#00bcd4]/20 hover:shadow-[#00bcd4]/40 transition-shadow"
                      >
                        Sign up to save
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    )}

                    <button
                      onClick={startRefine}
                      className="inline-flex items-center gap-2 px-8 py-4 border border-[#ffd700]/20 text-[#ffd700]/60 font-bold rounded-xl hover:bg-[#ffd700]/[0.04] hover:text-[#ffd700]/80 transition-colors"
                    >
                      Refine
                    </button>

                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.1] text-white/60 font-bold rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      Start Over
                    </button>
                  </div>

                  {/* Refine options */}
                  <AnimatePresence>
                    {refining && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 overflow-hidden"
                      >
                        <p className="text-xs text-white/30 mb-3">Make it...</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {REFINE_SUFFIXES.map((suffix) => (
                            <button
                              key={suffix}
                              onClick={() => handleRefine(suffix)}
                              className="px-4 py-2 rounded-full text-[13px] text-[#ffd700]/50 hover:text-[#ffd700]/80 bg-[#ffd700]/[0.03] hover:bg-[#ffd700]/[0.08] border border-[#ffd700]/10 hover:border-[#ffd700]/30 transition-all duration-300"
                            >
                              {suffix}
                            </button>
                          ))}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </LazyMotion>
  );
}
