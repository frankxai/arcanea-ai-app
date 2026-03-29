import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Arcanea",
  description:
    "Latest updates, features, and improvements to the Arcanea Creative Intelligence Platform.",
  openGraph: {
    title: "Changelog — Arcanea",
    description:
      "Latest updates, features, and improvements to the Arcanea Creative Intelligence Platform.",
  },
};

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type Category = "feature" | "fix" | "design" | "performance";

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  category: Category;
  items: string[];
}

const CATEGORY_STYLES: Record<
  Category,
  { bg: string; text: string; border: string; label: string }
> = {
  feature: {
    bg: "bg-[#00bcd4]/10",
    text: "text-[#00bcd4]",
    border: "border-[#00bcd4]/20",
    label: "Feature",
  },
  fix: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    label: "Fix",
  },
  design: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    label: "Design",
  },
  performance: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    label: "Performance",
  },
};

/* ------------------------------------------------------------------ */
/*  Changelog Data                                                     */
/* ------------------------------------------------------------------ */

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-03-29",
    version: "3.2.0",
    title: "Chronicles of Arcanea — 257,000 Words of Original Canon",
    category: "feature",
    items: [
      "Book 1: The Three Academies — 10 chapters, 38,000 words (COMPLETE)",
      "Book 2: The Gate-Touched — 3 opening chapters, 12,300 words",
      "Series Bible: 10 documents including World Architecture (12K words), Character Bible, Dragon Codex, Dungeon Compendium, Academy Curriculum, Companion Bestiary, Songs & Hymns, The Prophecy of Five Fractures",
      "The Fall of Malachar — tragic antagonist origin story",
      "Three Great Academies: The Luminary (Light), Draconis Forge (Fire), Abyssal Athenaeum (Water)",
      "Gate-Touched classification: Sparked, Kindled, Blazing, Transcendent, Luminor-Born",
      "12 named Dragons with full profiles and bond mechanics",
      "10 Dungeons — corrupted Gate temples with unique mechanics",
      "20 Companion creatures in naturalist field guide format",
      "Parallel expansion: deep lore, world atlas, founding myths (148K words)",
    ],
  },
  {
    date: "2026-03-28",
    version: "3.1.0",
    title: "Product Excellence — Chat, Imagine, Credits, Performance",
    category: "feature",
    items: [
      "Imagine: masonry layout for mixed aspect ratios, prompt history (last 30), 8 style preset chips",
      "Credits system activated — real Supabase queries replace mock data (balance, spend, webhook, checkout)",
      "Chat: Arcanea personality system — 'You are not helpful. You are generative.'",
      "Imagine: OpenRouter provider with 8 models, GPT-5 Image Mini, Gemini 2.5 fix",
      "Arcanean Style Engine: 12 canonical visual styles wired to /imagine",
      "Brand mark wired into navbar, chat header, and message thinking state",
    ],
  },
  {
    date: "2026-03-28",
    version: "3.0.1",
    title: "Hz Depth-Only Policy + Homepage Performance",
    category: "performance",
    items: [
      "Removed all Hz/frequency numbers from marketing surfaces (8 files, 24+ edits)",
      "Hz visible only on deep lore pages (/lore/gates, /lore/guardians)",
      "Homepage LCP: HeroChatBox deferred via dynamic() import (~20-40kB saved)",
      "hero-v3: motion → m + LazyMotion domAnimation (~26kB framer savings)",
      "hero-chat-box: useRouter replaced with window.location.href",
      "Replaced wellness language with maker-focused copy across all landing components",
      "All 25 footer links verified pointing to real pages",
    ],
  },
  {
    date: "2026-03-23",
    version: "2.7.0",
    title: "Security & Auth Hardening",
    category: "fix",
    items: [
      "Deny-by-default API auth — all routes require valid session",
      "Protected page enforcement across authenticated routes",
      "Refined auth boundaries with clear public/private split",
      "Chat error messages improved with actionable guidance",
      "Public API prefix trailing slash cleanup",
    ],
  },
  {
    date: "2026-03-22",
    version: "2.6.0",
    title: "Massive Platform Upgrade — 519 Files Changed",
    category: "feature",
    items: [
      "Creative Superintelligence positioning across homepage, about, pricing",
      "107 error boundaries + 23 loading states added (full route coverage)",
      "72 canonical URLs for SEO across all layouts",
      "LazyMotion migration: 33KB to 7KB per page (-78% bundle)",
      "6 new blog posts (15 total) — ecosystem, OSS strategy, vision manifesto",
      "6 stub pages upgraded to full production content",
      "Onboarding flow polished with AnimatePresence transitions",
      "Dashboard wired to real Supabase data + Quick Actions grid",
      "Library reading time badges + Continue Your Journey section",
      "Gallery element filters + floating Create button",
      "Community GitHub stats section with 27 repos, 791 tests",
      "Studio image generation wired to real API",
      "Discover page with real Guardian v3 images + Supabase query",
      "Supabase: 22 FK indexes + 4 function security fixes",
      "Stripe payment infrastructure added",
    ],
  },
  {
    date: "2026-03-22",
    version: "2.5.0",
    title: "Chat Revolution — AI SDK v6, Artifacts, Branching",
    category: "feature",
    items: [
      "Fixed chat streaming — AI SDK v6 UIMessage parts extraction",
      "Artifacts side panel — code, HTML, SVG rendering (Canvas pattern)",
      "Conversation branching — regenerate preserves old versions (v1, v2...)",
      "Streaming text animation — smooth CSS fade-in during response",
      "Message editing — inline edit any user message and resend",
      "Regenerate from any assistant message, not just the last",
      "Export conversations — Markdown, JSON, Plain Text download",
      "Drag-and-drop image upload with preview thumbnails",
      "Voice input — Web Speech API with real-time transcription",
      "Token counter — shows estimated tokens while typing",
      "Supabase cloud sync — offline-first chat persistence",
      "No-API-key onboarding banner with provider setup guide",
    ],
  },
  {
    date: "2026-03-22",
    version: "2.4.0",
    title: "Imagine & Studio Upgrade",
    category: "feature",
    items: [
      "Style presets as tappable pills (Fantasy Art, Photorealistic, Anime...)",
      "Share button with Web Share API on mobile",
      "Tight mobile grid (2px gaps, Instagram-style)",
      "Shimmer skeleton loading cards",
      "Studio video tab wired to Veo 3.1 API",
    ],
  },
  {
    date: "2026-03-22",
    version: "2.3.0",
    title: "Design Polish & Mobile Excellence",
    category: "design",
    items: [
      "Gradient text heading in empty state",
      "Subtle teal glow on focused input",
      "Pulsing dot streaming cursor with glow",
      "Code blocks with teal top accent and visible copy button",
      "Better markdown rendering — blockquotes, tables, lists",
      "Mobile sidebar as overlay with backdrop tap-to-close",
    ],
  },
  {
    date: "2026-03-22",
    version: "2.2.0",
    title: "Infrastructure & Intelligence",
    category: "performance",
    items: [
      "Non-www to www 308 permanent redirect in middleware",
      "Smart auto-routing finds best available AI provider",
      "Model selection synchronous localStorage init (no race)",
      "Intelligence OS v2.0 with 10 creative agents",
      "Navigation audit — all 45+ links verified",
    ],
  },
  {
    date: "2026-03-21",
    version: "2.1.0",
    title: "Overnight Build — New Pages & Content",
    category: "feature",
    items: [
      "/claw page — ArcaneaClaw media engine",
      "Command center with inbox and agent views",
      "Studio panel components (code, image, music, text)",
      "Homepage 8 below-fold sections restored",
      "LazyMotion migration across 16 pages (33KB to 7KB)",
    ],
  },
  {
    date: "2026-03-01",
    version: "2.0.0",
    title: "Arcanea Creative OS",
    category: "feature",
    items: [
      "AI Router system with multi-provider support",
      "Voice Enforcer for creative tone consistency",
      "MCP server with 30+ tools",
      "Skill-rules engine",
      "Full TypeScript rewrite",
    ],
  },
  {
    date: "2025-12-01",
    version: "1.5.0",
    title: "Memory & Learning",
    category: "performance",
    items: [
      "HNSW vector search for semantic memory",
      "Companion namespaces for scoped context",
      "SONA learning engine",
      "Trajectory recording for session replay",
    ],
  },
  {
    date: "2025-08-01",
    version: "1.0.0",
    title: "Arcanea Launch",
    category: "feature",
    items: [
      "Core platform with chat interface",
      "Library with initial content collections",
      "Authentication system",
      "Companion bonding system",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(127,255,212,0.04),transparent_50%)]" />
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* ---- Hero ---- */}
        <section className="pb-12 pt-20 text-center sm:pb-16 sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00bcd4]" />
            <span className="font-mono text-xs tracking-widest text-[#00bcd4]">
              CHANGELOG
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            What&apos;s New in{" "}
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#7fffd4] bg-clip-text text-transparent">
              Arcanea
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
            Latest updates, features, and improvements to the Arcanea Creative
            Intelligence Platform.
          </p>
        </section>

        {/* ---- Timeline ---- */}
        <section className="relative pb-20">
          {/* Vertical timeline line */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-[#00bcd4] via-[#00bcd4]/40 to-transparent"
          />

          <ol className="relative space-y-10">
            {CHANGELOG.map((entry) => {
              const style = CATEGORY_STYLES[entry.category];

              return (
                <li key={entry.version} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[13px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#00bcd4] bg-[#09090b]"
                  />

                  {/* Date badge */}
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <time
                      dateTime={entry.date}
                      className="rounded-md border border-[#00bcd4]/25 bg-[#00bcd4]/8 px-2.5 py-0.5 font-mono text-xs text-[#00bcd4]"
                    >
                      {formatDate(entry.date)}
                    </time>

                    <span className="rounded-md bg-white/[0.06] px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                      v{entry.version}
                    </span>

                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}
                    >
                      {style.label}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
                    <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                      {entry.title}
                    </h2>

                    <ul className="mt-4 space-y-2">
                      {entry.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#00bcd4]/60"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </main>
    </div>
  );
}
