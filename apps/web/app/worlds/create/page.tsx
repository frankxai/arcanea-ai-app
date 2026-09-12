/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  MotionConfig,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  draftResult,
  readStoredWorldDraft,
  WORLD_DRAFT_KEY,
  WORLD_PREVIOUS_DRAFT_KEY,
  WORLD_REFINEMENTS,
  worldDraftSchema,
  type WorldDraft,
} from "@/lib/worlds/draft";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GeneratedCharacter = WorldDraft["characters"][number];

interface GeneratedLocation {
  name: string;
  region?: string;
  description?: string;
  significance?: string;
}

type GeneratedWorld = WorldDraft;

interface GenerateResult {
  draft_id: string;
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

const REFINE_SUFFIXES = WORLD_REFINEMENTS;

const EL_GLOW: Record<string, string> = {
  fire: "shadow-red-500/30",
  water: "shadow-blue-400/30",
  earth: "shadow-emerald-500/30",
  wind: "shadow-slate-300/30",
  void: "shadow-purple-500/30",
  spirit: "shadow-amber-400/30",
  light: "shadow-yellow-300/30",
  shadow: "shadow-violet-600/30",
};

function elGlow(n: string) {
  const k = n.toLowerCase();
  return (
    Object.entries(EL_GLOW).find(([x]) => k.includes(x))?.[1] ??
    "shadow-[var(--arc-brand-atlantean-teal)]/30"
  );
}

// ---------------------------------------------------------------------------
// Genre Preview — predictive pill after 20+ chars
// ---------------------------------------------------------------------------

const GENRE_RULES: { keywords: string[]; genre: string; color: string }[] = [
  {
    keywords: [
      "magic",
      "wizard",
      "spell",
      "enchant",
      "sorcery",
      "fantasy",
      "dragon",
      "elf",
    ],
    genre: "Fantasy",
    color: "var(--arc-void)",
  },
  {
    keywords: ["cyber", "neon", "hack", "android", "augment", "neural"],
    genre: "Cyberpunk",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    keywords: ["underwater", "ocean", "sea", "coral", "abyss", "depth"],
    genre: "Aquatic",
    color: "var(--arc-brand-cosmic-blue)",
  },
  {
    keywords: [
      "space",
      "star",
      "galaxy",
      "nebula",
      "cosmic",
      "planet",
      "orbit",
    ],
    genre: "Cosmic",
    color: "var(--arc-brand-arcanean-gold)",
  },
  {
    keywords: ["medieval", "knight", "castle", "kingdom", "feudal", "sword"],
    genre: "Medieval",
    color: "var(--arc-earth)",
  },
  {
    keywords: ["horror", "dark", "death", "haunt", "shadow", "dread", "fear"],
    genre: "Horror",
    color: "var(--arc-fire)",
  },
];

function GenrePreview({ description }: { description: string }) {
  if (description.length < 20) return null;
  const lower = description.toLowerCase();
  const match = GENRE_RULES.find((r) =>
    r.keywords.some((k) => lower.includes(k)),
  );
  if (!match) return null;
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-2 mt-2 px-1"
    >
      <span className="relative flex h-2 w-2">
        <span
          className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
          style={{ backgroundColor: match.color }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: match.color }}
        />
      </span>
      <span className="text-xs text-white/70">{match.genre} world</span>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[var(--arc-brand-atlantean-teal)]/[0.04] rounded-full blur-[120px] motion-safe:animate-pulse" />
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[var(--arc-void)]/[0.04] rounded-full blur-[120px]"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--arc-brand-arcanean-gold)]/[0.02] rounded-full blur-[150px]" />
    </div>
  );
}

function GeneratingOverlay() {
  return (
    <div
      role="status"
      className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6"
    >
      <div
        className="w-10 h-10 border-2 border-white/20 border-t-[var(--arc-brand-atlantean-teal)] rounded-full motion-safe:animate-spin"
        aria-hidden="true"
      />
      <h2 className="text-2xl font-display">Creating your world draft</h2>
      <p className="text-white/70 max-w-sm">
        The model is composing your world, characters and locations. This can
        take a moment.
      </p>
    </div>
  );
}

function HeroSection({
  world,
  heroImage,
}: {
  world: GeneratedWorld;
  heroImage: string | null;
}) {
  const from = world.palette?.primary || "var(--arc-brand-atlantean-teal)";
  const to = world.palette?.secondary || "var(--arc-void)";
  const h = heroImage ? 320 : 200;
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative w-full rounded-2xl overflow-hidden mb-12"
      style={{ minHeight: h }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${from}22, ${to}22, var(--arc-cosmic-void))`,
        }}
      />
      {heroImage && (
        <Image
          src={heroImage}
          alt={`Concept art for ${world.name}`}
          fill
          className="absolute inset-0 object-cover opacity-60"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)]/60 to-transparent" />
      <div
        className="relative z-10 flex flex-col items-center justify-end h-full px-6 py-10"
        style={{ minHeight: h }}
      >
        <p className="text-[var(--arc-brand-atlantean-teal)] font-mono text-xs tracking-widest mb-3">
          Your world
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 text-center drop-shadow-lg">
          {world.name}
        </h1>
        {world.tagline && (
          <p className="text-lg text-white/60 max-w-xl text-center">
            {world.tagline}
          </p>
        )}
      </div>
    </m.div>
  );
}

function ElementOrbs({
  elements,
}: {
  elements: { name: string; domain: string; color: string }[];
}) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap items-center justify-center gap-5 mb-12"
    >
      {elements.map((el, i) => (
        <m.div
          key={el.name}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-10 h-10 rounded-full shadow-lg ${elGlow(el.name)} relative`}
            style={{ backgroundColor: el.color }}
          >
            <div
              className="absolute inset-0 rounded-full motion-safe:animate-pulse"
              style={{
                boxShadow: `0 0 20px ${el.color}40, 0 0 40px ${el.color}20`,
              }}
            />
          </div>
          <span className="text-xs text-white/50 font-medium">{el.name}</span>
          <span className="text-[10px] text-white/70">{el.domain}</span>
        </m.div>
      ))}
    </m.div>
  );
}

const EL_STRIPE: Record<string, string> = {
  fire: "var(--arc-fire)",
  water: "var(--arc-brand-cosmic-blue)",
  earth: "var(--arc-wind)",
  wind: "var(--arc-void)",
  void: "var(--arc-void)",
  spirit: "var(--arc-brand-arcanean-gold)",
};

function CharacterCard({
  char,
  index,
}: {
  char: GeneratedCharacter;
  index: number;
}) {
  const el = char.element?.toLowerCase() || "";
  const stripe =
    Object.entries(EL_STRIPE).find(([k]) => el.includes(k))?.[1] ??
    "var(--arc-brand-atlantean-teal)";
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15 }}
      className="rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors overflow-hidden flex"
    >
      <div className="w-1 shrink-0" style={{ backgroundColor: stripe }} />
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-display font-semibold text-white">{char.name}</h4>
          {char.element && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20">
              {char.element}
            </span>
          )}
        </div>
        {char.title && (
          <p className="text-xs text-white/70 mb-1">{char.title}</p>
        )}
        {char.origin_class && (
          <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-[var(--arc-void)]/10 text-[var(--arc-void)]/70 border border-[var(--arc-void)]/20 mb-2">
            {char.origin_class}
          </span>
        )}
        {char.backstory && (
          <p className="text-sm text-white/50 leading-relaxed">
            {char.backstory}
          </p>
        )}
        {!!char.personality?.traits.length && (
          <p className="mt-3 text-sm text-white/70">
            Traits: {char.personality.traits.join(", ")}
          </p>
        )}
        {char.personality?.voice_style && (
          <p className="mt-2 text-sm text-white/70">
            Voice: {char.personality.voice_style}
          </p>
        )}
      </div>
    </m.div>
  );
}

function LocationCard({
  loc,
  index,
}: {
  loc: GeneratedLocation;
  index: number;
}) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.15 }}
      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors"
    >
      {loc.region && (
        <p className="text-[10px] text-[var(--arc-void)]/50 tracking-widest mb-2">
          {loc.region}
        </p>
      )}
      <h4 className="font-display font-semibold text-white mb-1">{loc.name}</h4>
      {loc.description && (
        <p className="text-sm text-white/50 leading-relaxed mb-2">
          {loc.description}
        </p>
      )}
      {loc.significance && (
        <p className="text-xs text-white/70 italic">{loc.significance}</p>
      )}
    </m.div>
  );
}

function FoundingEvent({
  event,
  worldName,
}: {
  event: { title: string; description: string; era?: string };
  worldName: string;
}) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 mb-10 relative overflow-hidden"
    >
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--arc-brand-arcanean-gold)]/30 via-[var(--arc-brand-arcanean-gold)]/10 to-transparent" />
      <div className="absolute left-[19px] top-6 w-3 h-3 rounded-full bg-[var(--arc-brand-arcanean-gold)]/60 ring-2 ring-[var(--arc-brand-arcanean-gold)]/20" />
      <div className="pl-8">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-xs text-[var(--arc-brand-arcanean-gold)]/50 tracking-wider">
            Founding event
          </p>
          {event.era && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)]/60 border border-[var(--arc-brand-arcanean-gold)]/20">
              {event.era}
            </span>
          )}
        </div>
        <p className="text-xs text-white/70 mb-2">
          The beginning of {worldName}
        </p>
        <h4 className="font-display font-semibold text-white mb-2">
          {event.title}
        </h4>
        <p className="text-sm text-white/45 leading-relaxed">
          {event.description}
        </p>
      </div>
    </m.div>
  );
}

function PaletteSection({
  palette,
}: {
  palette: { primary: string; secondary: string; accent: string };
}) {
  const swatches = [
    ["Primary", palette.primary],
    ["Secondary", palette.secondary],
    ["Accent", palette.accent],
  ] as const;
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="mb-10"
    >
      <p className="text-sm font-mono text-white/70 tracking-wider mb-4">
        Palette
      </p>
      <div className="flex gap-4">
        {swatches.map(([label, color]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-14 rounded-xl border border-white/10 shadow-lg"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] text-white/70">{label}</span>
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
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("input");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generating = useRef(false);
  const [storageNote, setStorageNote] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState(false);
  const [pendingConcept, setPendingConcept] = useState<string | null>(null);
  const [previousDraft, setPreviousDraft] =
    useState<ReturnType<typeof readStoredWorldDraft>>(null);
  const [previousHeroImage, setPreviousHeroImage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) =>
        setIsAuthenticated(!!data?.user),
      )
      .catch(() => setIsAuthenticated(false));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) =>
        setIsAuthenticated(!!session?.user),
    );
    const params = new URLSearchParams(window.location.search);
    try {
      const concept = sessionStorage.getItem("arcanea.world-concept");
      const stored = readStoredWorldDraft(
        sessionStorage.getItem(WORLD_DRAFT_KEY),
      );
      setPreviousDraft(
        readStoredWorldDraft(sessionStorage.getItem(WORLD_PREVIOUS_DRAFT_KEY)),
      );
      if (stored) {
        setDescription(stored.description);
        setResult(draftResult(stored.world, stored.draft_id));
        setPhase("result");
        setStorageNote("Draft restored from this browser tab.");
        if (concept) setPendingConcept(concept.slice(0, 500));
      } else if (concept) {
        setDescription(concept.slice(0, 500));
        window.history.replaceState(null, "", "/worlds/create");
      } else if (params.get("prompt"))
        setDescription(params.get("prompt")!.slice(0, 500));
    } catch {
      setStorageNote(
        "Browser storage is unavailable. Export your draft before leaving this page.",
      );
    }
    return () => subscription.unsubscribe();
  }, []);

  const rememberDraft = useCallback(
    (data: GenerateResult, concept: string) => {
      try {
        const current = readStoredWorldDraft(
          sessionStorage.getItem(WORLD_DRAFT_KEY),
        );
        if (current && current.draft_id !== data.draft_id) {
          setPreviousDraft(current);
          setPreviousHeroImage(heroImage);
          sessionStorage.setItem(
            WORLD_PREVIOUS_DRAFT_KEY,
            JSON.stringify(current),
          );
        }
        sessionStorage.setItem(
          WORLD_DRAFT_KEY,
          JSON.stringify({
            version: 1,
            description: concept,
            draft_id: data.draft_id,
            world: data.world,
          }),
        );
        sessionStorage.removeItem("arcanea.world-concept");
        setStorageNote(
          "Draft kept in this browser tab. Save to your account or export a copy before closing it.",
        );
      } catch {
        setStorageNote(
          "Browser storage is unavailable. Export your draft before leaving this page.",
        );
      }
    },
    [heroImage],
  );

  const continueToSignIn = useCallback(
    (concept?: string) => {
      try {
        // Existing drafts already have their own recovery record. A pending
        // concept is only needed before the first generation.
        if (concept && !result)
          sessionStorage.setItem("arcanea.world-concept", concept);
      } catch {
        setError(
          "Copy your concept before signing in; browser storage is unavailable.",
        );
        return;
      }
      router.push("/auth/login?next=%2Fworlds%2Fcreate%3Fresume%3D1");
    },
    [result, router],
  );

  const generateHeroImage = useCallback(
    async (imagePrompt: string, worldName: string) => {
      if (!isAuthenticated) {
        continueToSignIn();
        return;
      }
      setImageLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/worlds/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "world",
            blueprint: { prompt: imagePrompt, name: worldName },
          }),
        });

        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error(
            "Sign in again to create concept art. Your world draft is still here.",
          );
        }
        if (!res.ok)
          throw new Error(
            "Concept art could not be generated. Your world draft is unchanged.",
          );
        const data = await res.json();
        if (data.generated && data.imageData && data.mimeType) {
          setHeroImage(`data:${data.mimeType};base64,${data.imageData}`);
        } else {
          throw new Error(
            "Concept art is unavailable. Your world draft is unchanged.",
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Concept art is unavailable. Your world draft is unchanged.",
        );
      } finally {
        setImageLoading(false);
      }
    },
    [isAuthenticated, continueToSignIn],
  );

  const generate = useCallback(
    async (desc?: string, refinement?: string) => {
      const trimmed = (desc || description).trim();
      if (
        !trimmed ||
        trimmed.length < 5 ||
        generating.current ||
        isAuthenticated === null
      )
        return;
      if (!isAuthenticated) {
        continueToSignIn(trimmed);
        return;
      }
      generating.current = true;

      setError(null);
      setPhase("generating");
      try {
        const res = await fetch("/api/worlds/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: trimmed, refinement }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (res.status === 401) {
            setIsAuthenticated(false);
            throw new Error(
              "Your session ended. Sign in again to create a draft.",
            );
          }
          throw new Error(
            typeof body.error === "string"
              ? body.error
              : `Generation failed (${res.status})`,
          );
        }

        const data: GenerateResult = await res.json();
        const parsed = worldDraftSchema.safeParse(data.world);
        if (!data.draft_id || !parsed.success)
          throw new Error(
            "The draft could not be validated. Please try again.",
          );
        const normalized = draftResult(parsed.data, data.draft_id);
        rememberDraft(normalized, trimmed);
        setResult(normalized);
        setDescription(trimmed);
        setHeroImage(null);
        setPendingConcept(null);
        setPhase("result");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setPhase(result ? "result" : "input");
      } finally {
        generating.current = false;
      }
    },
    [description, rememberDraft, result, isAuthenticated, continueToSignIn],
  );

  const saveWorld = useCallback(async () => {
    if (!result || saving) return;
    setSaving(true);
    setError(null);

    try {
      if (result.saved && result.world?.slug) {
        router.push(`/worlds/${result.world.slug}`);
        return;
      }

      const res = await fetch("/api/worlds/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft_id: result.draft_id,
          world: result.world,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
        throw new Error(
          "Sign in again to save this draft. Your draft is still here.",
        );
      }
      if (!res.ok || data.saved !== true || !data.slug)
        throw new Error(
          data.error ||
            "Saving did not finish. Your draft is still here; try again.",
        );
      setResult({
        ...result,
        saved: true,
        world_id: data.world_id,
        world: { ...result.world, slug: data.slug },
      });
      try {
        sessionStorage.removeItem(WORLD_DRAFT_KEY);
      } catch {
        /* The saved world remains in the account. */
      }
      router.push(`/worlds/${encodeURIComponent(data.slug)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Saving did not finish. Your draft is still here; try again.",
      );
    } finally {
      setSaving(false);
    }
  }, [result, saving, router]);

  const startRefine = () => {
    setRefining(true);
  };

  const handleRefine = (suffix: string) => {
    setRefining(false);
    generate(description, suffix);
  };

  const exportDraft = () => {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(result.world, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.world.slug}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const reset = () => {
    if (saving || imageLoading) return false;
    if (
      result &&
      !result.saved &&
      !window.confirm(
        "Start a new concept? Save or export this draft first if you need a lasting copy. You can restore the previous text draft in this tab.",
      )
    )
      return false;
    try {
      const current = readStoredWorldDraft(
        sessionStorage.getItem(WORLD_DRAFT_KEY),
      );
      if (current) {
        sessionStorage.setItem(
          WORLD_PREVIOUS_DRAFT_KEY,
          JSON.stringify(current),
        );
        setPreviousDraft(current);
        setPreviousHeroImage(heroImage);
      }
      sessionStorage.removeItem(WORLD_DRAFT_KEY);
      sessionStorage.removeItem("arcanea.world-concept");
    } catch {
      setError(
        "Export your draft before starting over. A recovery copy could not be stored.",
      );
      return false;
    }
    setStorageNote(null);
    setPhase("input");
    setDescription("");
    setResult(null);
    setHeroImage(null);
    setError(null);
    setRefining(false);
    setPendingConcept(null);
    return true;
  };

  const restorePrevious = () => {
    if (!previousDraft || saving || imageLoading || phase === "generating")
      return;
    const restored = draftResult(previousDraft.world, previousDraft.draft_id);
    const restoredImage = previousHeroImage;
    rememberDraft(restored, previousDraft.description);
    setDescription(previousDraft.description);
    setResult(restored);
    setHeroImage(restoredImage);
    setPhase("result");
    setError(null);
    setPendingConcept(null);
  };

  // Preserve native Tab navigation and IME composition.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        phase === "input" &&
        event.key === "Enter" &&
        (event.metaKey || event.ctrlKey) &&
        !event.isComposing
      ) {
        event.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, generate]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white relative">
          <AuroraBackground />

          {/* Back nav */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8">
            <Link
              href="/worlds"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white/90 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Worlds
            </Link>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-24">
            {pendingConcept && (
              <section
                aria-label="Choose your draft"
                className="mb-8 rounded-xl border border-white/20 p-5"
              >
                <h2 className="text-lg font-medium">
                  Your unsaved draft is still here
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  You also brought a new concept. Keep this draft or start the
                  new idea with a recoverable copy of the previous text.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="rounded-lg border border-white/30 px-4 py-3"
                    onClick={() => {
                      setPendingConcept(null);
                      try {
                        sessionStorage.removeItem("arcanea.world-concept");
                      } catch {
                        /* The current draft remains visible. */
                      }
                    }}
                  >
                    Keep this draft
                  </button>
                  <button
                    className="rounded-lg border border-white/30 px-4 py-3"
                    onClick={() => {
                      const concept = pendingConcept;
                      if (reset()) setDescription(concept);
                    }}
                  >
                    Use new concept
                  </button>
                </div>
              </section>
            )}
            {previousDraft && (
              <button
                onClick={restorePrevious}
                disabled={saving || imageLoading || phase === "generating"}
                className="mb-6 rounded-lg border border-white/20 px-4 py-3 text-sm disabled:opacity-50"
              >
                Restore previous draft
              </button>
            )}
            <AnimatePresence mode="wait">
              {/* -- Phase: Input ----------------------------------------- */}
              {phase === "input" && (
                <m.div
                  key="input"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="inline-flex items-center gap-2 mb-6">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--arc-brand-atlantean-teal)]/60" />
                    <span className="text-[var(--arc-brand-atlantean-teal)] font-mono text-xs tracking-widest">
                      World draft
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--arc-brand-atlantean-teal)]/60" />
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
                    <span className="text-white">Create a </span>
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-void), var(--arc-brand-arcanean-gold))",
                      }}
                    >
                      world
                    </span>
                  </h1>

                  <p className="text-lg text-white/70 max-w-lg mb-8">
                    Describe your world in one sentence. Preview its characters,
                    locations and rules before saving.
                  </p>

                  <p className="text-sm text-white/70 max-w-lg mb-8">
                    Sign in to generate with hosted AI. Drafts stay in this tab
                    until you save privately to your account. Avoid confidential
                    material.
                  </p>
                  <div className="w-full max-w-2xl mb-6">
                    <div className="relative rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.4)] focus-within:shadow-[0_0_0_1px_rgba(0,188,212,0.3),0_8px_40px_rgba(0,0,0,0.4),0_0_80px_rgba(0,188,212,0.08)] transition-colors duration-300">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-white/[0.025] backdrop-blur-2xl" />
                      <textarea
                        aria-label="Describe your world"
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value.slice(0, 500))
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            (e.ctrlKey || e.metaKey) &&
                            !e.shiftKey &&
                            !e.nativeEvent.isComposing
                          ) {
                            e.preventDefault();
                            e.stopPropagation();
                            generate();
                          }
                        }}
                        placeholder="A floating archipelago where gravity is controlled by ancient crystals..."
                        rows={3}
                        className="relative w-full px-6 py-5 bg-transparent text-white/90 placeholder-white/60 resize-none focus:outline-none font-body text-[15px] leading-relaxed"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 px-1">
                      <span className="text-xs text-white/70">
                        {description.length}/500
                      </span>
                      {error && (
                        <span role="alert" className="text-xs text-red-400">
                          {error}
                        </span>
                      )}
                    </div>
                    <AnimatePresence>
                      <GenrePreview description={description} />
                    </AnimatePresence>
                  </div>

                  <m.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => generate()}
                    disabled={
                      description.trim().length < 5 || isAuthenticated === null
                    }
                    className={`px-10 py-4 rounded-xl font-bold text-base transition-colors duration-200 ${
                      description.trim().length >= 5
                        ? "bg-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] shadow-lg shadow-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[var(--arc-brand-atlantean-teal)]/40"
                        : "bg-white/[0.04] text-white/70 cursor-not-allowed"
                    }`}
                  >
                    {isAuthenticated === null
                      ? "Checking your session…"
                      : isAuthenticated
                        ? "Create world"
                        : "Sign in to create your world"}
                  </m.button>

                  <div className="mt-10 w-full max-w-2xl">
                    <p className="text-xs text-white/70 mb-3 tracking-wider">
                      Try one of these
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {EXAMPLES.map((ex) => (
                        <button
                          key={ex}
                          onClick={() => setDescription(ex)}
                          className="px-4 py-2 rounded-full text-[13px] text-white/70 hover:text-white/90 bg-white/[0.02] hover:bg-[var(--arc-brand-atlantean-teal)]/[0.06] border border-white/[0.04] hover:border-[var(--arc-brand-atlantean-teal)]/20 transition-colors duration-300"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </m.div>
              )}

              {/* -- Phase: Generating ------------------------------------ */}
              {phase === "generating" && <GeneratingOverlay key="generating" />}

              {/* -- Phase: Result ---------------------------------------- */}
              {phase === "result" && result && (
                <m.div
                  key="result"
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Hero section with image */}
                  <HeroSection world={result.world} heroImage={heroImage} />

                  {/* Image loading indicator */}
                  {imageLoading && (
                    <m.div
                      initial={false}
                      animate={{ opacity: 1 }}
                      className="text-center mb-8"
                    >
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                        <div className="w-2 h-2 rounded-full bg-[var(--arc-brand-atlantean-teal)] motion-safe:animate-pulse" />
                        <span className="text-xs text-white/70">
                          Generating concept art...
                        </span>
                      </div>
                    </m.div>
                  )}

                  {/* Description */}
                  {result.world.description && (
                    <m.p
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-white/70 max-w-2xl mx-auto leading-relaxed text-center mb-10"
                    >
                      {result.world.description}
                    </m.p>
                  )}

                  {/* Element orbs */}
                  {result.world.elements &&
                    result.world.elements.length > 0 && (
                      <ElementOrbs elements={result.world.elements} />
                    )}

                  {/* Characters */}
                  {result.characters.length > 0 && (
                    <div className="mb-10">
                      <m.h3
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm font-mono text-[var(--arc-brand-atlantean-teal)]/60 tracking-wider mb-4"
                      >
                        Characters
                      </m.h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.characters.map((c, i) => (
                          <CharacterCard key={c.name} char={c} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Locations */}
                  {result.locations.length > 0 && (
                    <div className="mb-10">
                      <m.h3
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm font-mono text-[var(--arc-void)]/60 tracking-wider mb-4"
                      >
                        Locations
                      </m.h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.locations.map((l, i) => (
                          <LocationCard key={l.name} loc={l} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Founding event */}
                  {result.event && (
                    <FoundingEvent
                      event={result.event}
                      worldName={result.world.name}
                    />
                  )}

                  {/* Palette */}
                  {result.world.palette && (
                    <PaletteSection palette={result.world.palette} />
                  )}

                  {result.world.laws.length > 0 && (
                    <section className="my-10">
                      <h3 className="text-lg mb-4">World rules</h3>
                      <ul className="space-y-4">
                        {result.world.laws.map((law) => (
                          <li
                            key={law.name}
                            className="border-l-2 border-[var(--arc-brand-atlantean-teal)] pl-4"
                          >
                            <h4 className="font-medium">{law.name}</h4>
                            <p className="text-sm text-white/70 mt-1">
                              {law.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {result.world.systems.length > 0 && (
                    <section className="my-10">
                      <h2 className="text-lg mb-4">World systems</h2>
                      <div className="space-y-5">
                        {result.world.systems.map((system, index) => (
                          <article
                            key={`${system.name}-${index}`}
                            className="border-l-2 border-[var(--arc-brand-atlantean-teal)] pl-4"
                          >
                            <h3 className="font-medium">{system.name}</h3>
                            <p className="text-sm text-white/70 mt-1">
                              {system.type}
                            </p>
                            <p className="text-sm text-white/80 mt-2 whitespace-pre-wrap">
                              {system.rules}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                  <p
                    role="status"
                    className="text-sm text-white/70 text-center my-5"
                  >
                    {storageNote}
                  </p>
                  {error && (
                    <p
                      role="alert"
                      className="text-sm text-red-300 text-center my-5"
                    >
                      {error}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-4 my-6">
                    <button
                      onClick={exportDraft}
                      className="px-5 py-3 rounded-lg border border-white/20 text-sm"
                    >
                      Export draft
                    </button>
                    {result.image_prompt && !heroImage && (
                      <button
                        disabled={imageLoading}
                        onClick={() =>
                          generateHeroImage(
                            result.image_prompt!,
                            result.world.name,
                          )
                        }
                        className="px-5 py-3 rounded-lg border border-white/20 text-sm disabled:opacity-50"
                      >
                        {imageLoading
                          ? "Creating concept art…"
                          : "Generate concept art"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-white/70 text-center">
                    Concept art is a separate generation and is not included in
                    the saved text draft.
                  </p>
                  {/* CTA */}
                  <m.div
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="mt-12 text-center"
                  >
                    <p className="text-white/70 text-sm mb-6">
                      This is your world. What happens next?
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      {isAuthenticated ? (
                        <m.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={saveWorld}
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] font-bold rounded-xl shadow-lg shadow-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[var(--arc-brand-atlantean-teal)]/40 transition-shadow disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save this world"}
                          {!saving && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          )}
                        </m.button>
                      ) : (
                        <Link
                          href="/auth/login?next=%2Fworlds%2Fcreate%3Fresume%3D1"
                          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] font-bold rounded-xl shadow-lg shadow-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[var(--arc-brand-atlantean-teal)]/40 transition-shadow"
                        >
                          Sign in to save this draft
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      )}

                      <button
                        onClick={startRefine}
                        disabled={saving || imageLoading}
                        className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--arc-brand-arcanean-gold)]/20 text-[var(--arc-brand-arcanean-gold)]/60 font-bold rounded-xl hover:bg-[var(--arc-brand-arcanean-gold)]/[0.04] hover:text-[var(--arc-brand-arcanean-gold)]/80 transition-colors"
                      >
                        Refine
                      </button>

                      <button
                        onClick={reset}
                        disabled={saving || imageLoading}
                        className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.1] text-white/60 font-bold rounded-xl hover:bg-white/[0.04] transition-colors"
                      >
                        Start over
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
                          <p className="text-xs text-white/70 mb-3">
                            Generate a new version. The previous text draft
                            stays available to restore.
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {REFINE_SUFFIXES.map((suffix) => (
                              <button
                                key={suffix}
                                onClick={() => handleRefine(suffix)}
                                className="px-4 py-2 rounded-full text-[13px] text-[var(--arc-brand-arcanean-gold)]/50 hover:text-[var(--arc-brand-arcanean-gold)]/80 bg-[var(--arc-brand-arcanean-gold)]/[0.03] hover:bg-[var(--arc-brand-arcanean-gold)]/[0.08] border border-[var(--arc-brand-arcanean-gold)]/10 hover:border-[var(--arc-brand-arcanean-gold)]/30 transition-colors duration-300"
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
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
