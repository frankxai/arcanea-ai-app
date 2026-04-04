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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#00bcd4]/[0.04] rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#7c3aed]/[0.04] rounded-full blur-[120px]" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#ffd700]/[0.02] rounded-full blur-[150px]" />
    </div>
  );
}

function GeneratingOverlay({ step }: { step: number }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
    >
      {/* Pulsing aurora orb */}
      <div className="relative w-28 h-28 mb-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00bcd4]/30 via-[#7c3aed]/20 to-[#ffd700]/20 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#00bcd4]/40 via-[#7c3aed]/30 to-[#ffd700]/30 animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#00bcd4] via-[#7c3aed] to-[#ffd700] opacity-50 blur-sm" />
        <div className="absolute inset-8 rounded-full bg-[#09090b]" />
      </div>

      <p className="text-white/60 text-lg font-display mb-8">
        Weaving the fabric of your universe...
      </p>

      <div className="space-y-3 max-w-xs">
        {PROGRESS_STEPS.map((label, i) => (
          <m.div
            key={label}
            initial={{ opacity: 0, x: -12 }}
            animate={i <= step ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className={`flex items-center gap-3 text-sm ${
              i <= step ? "text-white/70" : "text-white/10"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              i < step ? "bg-[#00bcd4]" : i === step ? "bg-[#00bcd4] animate-pulse" : "bg-white/10"
            }`} />
            {label}
          </m.div>
        ))}
      </div>
    </m.div>
  );
}

function CharacterCard({ char, index }: { char: GeneratedCharacter; index: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15 }}
      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-display font-semibold text-white">{char.name}</h4>
        {char.element && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00bcd4]/10 text-[#00bcd4] border border-[#00bcd4]/20">
            {char.element}
          </span>
        )}
      </div>
      {char.title && <p className="text-xs text-white/40 mb-2">{char.title}</p>}
      {char.backstory && <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{char.backstory}</p>}
    </m.div>
  );
}

function LocationCard({ loc, index }: { loc: GeneratedLocation; index: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.15 }}
      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all"
    >
      <h4 className="font-display font-semibold text-white mb-1">{loc.name}</h4>
      {loc.region && <p className="text-xs text-[#7c3aed]/70 mb-2">{loc.region}</p>}
      {loc.description && <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{loc.description}</p>}
    </m.div>
  );
}

function PalettePreview({ palette }: { palette: { primary: string; secondary: string; accent: string } }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex items-center gap-3"
    >
      <span className="text-xs text-white/30">Palette</span>
      {[palette.primary, palette.secondary, palette.accent].map((color) => (
        <div
          key={color}
          className="w-8 h-8 rounded-lg border border-white/10"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
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
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  // Check auth + pre-fill from query param on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data?.user);
    });

    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    if (prompt) setDescription(prompt.slice(0, 500));
  }, []);

  // Progress step ticker during generation
  useEffect(() => {
    if (phase !== "generating") return;
    setProgressStep(0);
    const interval = setInterval(() => {
      setProgressStep((s) => (s < PROGRESS_STEPS.length - 1 ? s + 1 : s));
    }, 4000);
    return () => clearInterval(interval);
  }, [phase]);

  const generate = useCallback(async () => {
    const trimmed = description.trim();
    if (!trimmed || trimmed.length < 5) return;

    setError(null);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("input");
    }
  }, [description]);

  const saveWorld = useCallback(async () => {
    if (!result || saving) return;
    setSaving(true);

    try {
      // The generate endpoint already saves for authenticated users.
      // If it was saved there, redirect directly.
      if (result.saved && result.world?.slug) {
        window.location.href = `/worlds/${result.world.slug}`;
        return;
      }

      // Otherwise, save via a dedicated POST (for cases where
      // the user was not authenticated during generation but signed in after).
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

  const reset = () => {
    setPhase("input");
    setDescription("");
    setResult(null);
    setError(null);
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
            {/* ── Phase: Input ────────────────────────────── */}
            {phase === "input" && (
              <m.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                {/* Header */}
                <div className="mb-2">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#00bcd4]/60" />
                    <span className="text-[#00bcd4] font-mono text-xs tracking-widest uppercase">
                      World Forge
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#00bcd4]/60" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
                  <span className="text-white">Create a </span>
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #00bcd4, #7c3aed, #ffd700)" }}>
                    World
                  </span>
                </h1>

                <p className="text-lg text-white/40 max-w-lg mb-10">
                  Describe your world in one sentence. AI will generate
                  characters, locations, lore, and a color palette.
                </p>

                {/* Text area */}
                <div className="w-full max-w-2xl mb-6">
                  <div className="relative rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.4)] focus-within:shadow-[0_0_0_1px_rgba(0,188,212,0.3),0_8px_40px_rgba(0,0,0,0.4),0_0_80px_rgba(0,188,212,0.08)] transition-all duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-white/[0.025] backdrop-blur-2xl" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          generate();
                        }
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
                </div>

                {/* Generate button */}
                <m.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={generate}
                  disabled={description.trim().length < 5}
                  className={`px-10 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                    description.trim().length >= 5
                      ? "bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white shadow-lg shadow-[#00bcd4]/20 hover:shadow-[#00bcd4]/40"
                      : "bg-white/[0.04] text-white/20 cursor-not-allowed"
                  }`}
                >
                  Create World
                </m.button>

                {/* Example suggestions */}
                <div className="mt-10 w-full max-w-2xl">
                  <p className="text-xs text-white/20 mb-3 uppercase tracking-wider">
                    Try one of these
                  </p>
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

            {/* ── Phase: Generating ──────────────────────── */}
            {phase === "generating" && (
              <GeneratingOverlay key="generating" step={progressStep} />
            )}

            {/* ── Phase: Result ──────────────────────────── */}
            {phase === "result" && result && (
              <m.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* World header */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-12"
                >
                  <p className="text-[#00bcd4] font-mono text-xs tracking-widest uppercase mb-3">
                    Your World
                  </p>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                    {result.world.name}
                  </h2>
                  {result.world.tagline && (
                    <p className="text-lg text-white/50 max-w-xl mx-auto mb-4">
                      {result.world.tagline}
                    </p>
                  )}
                  {result.world.description && (
                    <m.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-white/35 max-w-2xl mx-auto leading-relaxed"
                    >
                      {result.world.description}
                    </m.p>
                  )}
                </m.div>

                {/* Element dots */}
                {result.world.elements && result.world.elements.length > 0 && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-3 mb-10"
                  >
                    {result.world.elements.map((el) => (
                      <div key={el.name} className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full ring-1 ring-white/10"
                          style={{ backgroundColor: el.color }}
                        />
                        <span className="text-xs text-white/40">{el.name}</span>
                      </div>
                    ))}
                  </m.div>
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
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 mb-10"
                  >
                    <p className="text-xs text-[#ffd700]/60 uppercase tracking-wider mb-2">
                      Founding Event{result.event.era ? ` -- ${result.event.era}` : ""}
                    </p>
                    <h4 className="font-display font-semibold text-white mb-2">
                      {result.event.title}
                    </h4>
                    <p className="text-sm text-white/45 leading-relaxed">
                      {result.event.description}
                    </p>
                  </m.div>
                )}

                {/* Palette */}
                {result.world.palette && <PalettePreview palette={result.world.palette} />}

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
                      onClick={reset}
                      className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.1] text-white/60 font-bold rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </LazyMotion>
  );
}
