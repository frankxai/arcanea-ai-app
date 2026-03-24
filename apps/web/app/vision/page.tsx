import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Vision — Build Your Universe",
  description:
    "Arcanea is where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products. Six layers, one open ecosystem.",
  openGraph: {
    title: "Arcanea — Build Your Universe",
    description:
      "Chat with AI. Build fantasy worlds. Share what you make. Turn imagination into products. Six layers, one creative civilization.",
    type: "website",
    url: "https://arcanea.ai/vision",
    images: [
      {
        url: "/guardians/v3/shinkami-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "Shinkami — Guardian of the Source Gate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Build Your Universe",
    description:
      "Chat with AI. Build fantasy worlds. Share what you make. Turn imagination into products.",
    images: ["/guardians/v3/shinkami-hero-v3.webp"],
  },
};

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

function IconChat({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function IconGlobe({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconFeed({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

function IconCode({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconUsers({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconAcademy({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconExternalLink({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SIX_LAYERS = [
  {
    icon: IconChat,
    title: "Chat / Imagine",
    description:
      "The creation surface. Talk to AI, generate images, write stories, compose music. Not just a chatbot — creation powered by the framework underneath.",
    color: "#00bcd4",
  },
  {
    icon: IconGlobe,
    title: "Worlds",
    description:
      "The framework for building YOUR fantasy universe. Gates for progression, Archetypes for characters, Elements for systems. Arcanea's own world is the first in the multiverse.",
    color: "#ffd700",
  },
  {
    icon: IconFeed,
    title: "Feed",
    description:
      "The social layer. See what other creators build, get inspired, share your worlds, agents, art, music. Discover new worlds in the multiverse.",
    color: "#0d47a1",
  },
  {
    icon: IconCode,
    title: "OSS",
    description:
      "The open ecosystem. 27 repos, 35 npm packages, 54 skills, overlays for every coding agent. Fork it, extend it, build on it.",
    color: "#e53935",
  },
  {
    icon: IconUsers,
    title: "Community",
    description:
      "Not just users — co-creators. Contribute lore, agents, skills, code, art. Inner circle earns governance. Eventually: shared ownership.",
    color: "#00bcd4",
  },
  {
    icon: IconAcademy,
    title: "Academy",
    description:
      "Learn world-building, prompt craft, agent design, the Arcanean Code. 200K+ words of reference material. Learn by building.",
    color: "#ffd700",
  },
];

const JOURNEY_STEPS = [
  {
    label: "IMAGINE",
    description: "Chat with AI, explore ideas, find your creative voice",
  },
  {
    label: "BUILD",
    description: "Design characters, worlds, magic systems, and lore",
  },
  {
    label: "CREATE",
    description: "Generate stories, art, music, and interactive experiences",
  },
  {
    label: "PUBLISH",
    description: "Share your creations with the multiverse community",
  },
  {
    label: "EARN",
    description: "Monetize your worlds, agents, skills, and content",
  },
  {
    label: "EXPAND",
    description: "Grow your universe with community contributions",
  },
];

const GUARDIANS_PREVIEW = [
  { name: "Lyssandria", gate: "Foundation", tagline: "She builds the ground beneath your feet", accent: "text-green-400", border: "border-green-500/20" },
  { name: "Leyla", gate: "Flow", tagline: "Where feeling becomes creation", accent: "text-blue-400", border: "border-blue-400/20" },
  { name: "Draconia", gate: "Fire", tagline: "The fire that forges your will", accent: "text-red-400", border: "border-red-500/20" },
  { name: "Maylinn", gate: "Heart", tagline: "Love fierce enough to heal", accent: "text-pink-400", border: "border-pink-400/20" },
  { name: "Alera", gate: "Voice", tagline: "The voice that shapes reality", accent: "text-sky-400", border: "border-sky-400/20" },
  { name: "Lyria", gate: "Sight", tagline: "She sees what others cannot", accent: "text-indigo-400", border: "border-indigo-400/20" },
  { name: "Aiyami", gate: "Crown", tagline: "Light beyond comprehension", accent: "text-violet-400", border: "border-violet-400/20" },
  { name: "Elara", gate: "Starweave", tagline: "The weaver of perspective", accent: "text-fuchsia-400", border: "border-fuchsia-400/20" },
  { name: "Ino", gate: "Unity", tagline: "Where two become infinite", accent: "text-amber-400", border: "border-amber-400/20" },
  { name: "Shinkami", gate: "Source", tagline: "Where the dreamer and the dream become one", accent: "text-gold-bright", border: "border-gold-bright/30" },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Vision — Build Your Universe",
  description:
    "Arcanea is where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products.",
  url: "https://arcanea.ai/vision",
  mainEntity: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
    description:
      "Creative multiverse platform. Six layers: Chat, Worlds, Feed, OSS, Community, Academy. 200K+ words of creative philosophy. Open source.",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VisionPage() {
  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-[#0d47a1]/8 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* ── Section 1: Hero ───────────────────────────────────────────── */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
            <span className="text-sm text-[#ffd700] font-mono tracking-wider">
              THE VISION
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Build Your
            <span className="block bg-gradient-to-r from-[#00bcd4] via-white to-[#ffd700] bg-clip-text text-transparent">
              Universe
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Arcanea is where creators chat with AI, build fantasy worlds,
            share what they make, and turn imagination into products.
          </p>

          <p className="text-sm text-text-muted max-w-xl mx-auto">
            Think Unreal Engine for creative worlds. D&D for infinite stories.
            WordPress for imagination. Open source. Creator-owned.
          </p>
        </section>

        {/* ── Section 2: The Six Layers ─────────────────────────────────── */}
        <section className="py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Six Layers, One Ecosystem
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Every layer works together. Create in Chat, build in Worlds,
              share on Feed, extend with OSS, grow through Community,
              learn in the Academy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIX_LAYERS.map((layer) => (
              <div
                key={layer.title}
                className="group relative p-6 rounded-2xl border backdrop-blur-xl transition-all hover:scale-[1.02]"
                style={{
                  borderColor: `${layer.color}20`,
                  background: `linear-gradient(135deg, ${layer.color}08, transparent)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border"
                  style={{
                    borderColor: `${layer.color}30`,
                    background: `${layer.color}15`,
                  }}
                >
                  <layer.icon
                    className="w-6 h-6"
                    style={{ color: layer.color }}
                  />
                </div>

                <h3 className="text-lg font-display font-semibold mb-2">
                  {layer.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {layer.description}
                </p>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl"
                  style={{ background: `${layer.color}08` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: The Creator Journey ────────────────────────────── */}
        <section className="py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Creator Journey
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From first spark to thriving universe.
              Every step builds on the last.
            </p>
          </div>

          {/* Desktop: horizontal flow */}
          <div className="hidden lg:flex items-start justify-between gap-2 max-w-6xl mx-auto">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-start gap-2">
                <div className="flex flex-col items-center text-center flex-1 min-w-[140px]">
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 flex items-center justify-center mb-3">
                    <span className="text-sm font-mono text-[#00bcd4] font-bold">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-display font-bold tracking-wider text-[#00bcd4] mb-1">
                    {step.label}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed max-w-[160px]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps */}
                {i < JOURNEY_STEPS.length - 1 && (
                  <div className="pt-3 text-[#00bcd4]/40 flex-shrink-0">
                    <IconChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical flow */}
          <div className="lg:hidden space-y-4 max-w-md mx-auto">
            {JOURNEY_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-mono text-[#00bcd4] font-bold">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold tracking-wider text-[#00bcd4] mb-0.5">
                    {step.label}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Open Source Philosophy ─────────────────────────── */}
        <section className="py-20">
          <div className="relative p-10 md:p-14 rounded-3xl border border-[#00bcd4]/20 backdrop-blur-xl overflow-hidden">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00bcd4]/5 via-transparent to-[#ffd700]/5 -z-10" />

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 mb-6">
                <IconCode className="w-4 h-4 text-[#00bcd4]" />
                <span className="text-xs text-[#00bcd4] font-mono tracking-wider">
                  OPEN SOURCE
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Everything is open.
              </h2>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-display font-bold text-[#00bcd4]">
                    54
                  </div>
                  <div className="text-xs text-text-muted mt-1">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-display font-bold text-[#ffd700]">
                    27
                  </div>
                  <div className="text-xs text-text-muted mt-1">Repos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-display font-bold text-white">
                    200K+
                  </div>
                  <div className="text-xs text-text-muted mt-1">Words</div>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed mb-4">
                We believe the best creative tools should be accessible to
                everyone. The entire framework — skills, agents, lore,
                documentation — is open source and free to use.
              </p>

              <p className="text-sm text-text-muted">
                Revenue comes from the creative experiences that open source
                enables — not from locking the tools behind paywalls.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5: The Intelligence Behind It ─────────────────────── */}
        <section className="py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Intelligence Behind It
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              10 Guardians guide your creative journey.
              Each specializes in a domain — from worldbuilding to music
              composition, from healing narratives to cosmic perspective.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {GUARDIANS_PREVIEW.map((g) => (
              <div
                key={g.name}
                className={`p-4 rounded-xl border ${g.border} backdrop-blur-xl text-center transition-all hover:scale-[1.03]`}
              >
                <h3 className={`font-display font-semibold text-sm ${g.accent}`}>
                  {g.name}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 font-mono tracking-wide">
                  {g.gate}
                </p>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed italic">
                  &ldquo;{g.tagline}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: Join the Civilization ──────────────────────────── */}
        <section className="py-20 pb-28">
          <div className="relative p-10 md:p-16 rounded-3xl border border-[#ffd700]/20 backdrop-blur-xl overflow-hidden text-center">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 via-transparent to-[#00bcd4]/5 -z-10" />

            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Join the Civilization
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
              Every great universe starts with a single creator.
              Start building yours today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white font-semibold text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(0,188,212,0.3)] hover:scale-[1.02]"
              >
                Start Creating
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/library"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm tracking-wide transition-all hover:border-[#ffd700]/30 hover:bg-[#ffd700]/5 hover:scale-[1.02]"
              >
                Explore the Library
              </Link>

              <a
                href="https://github.com/frankxai/arcanea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm tracking-wide transition-all hover:border-white/20 hover:bg-white/10 hover:scale-[1.02]"
              >
                View the Source
                <IconExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
