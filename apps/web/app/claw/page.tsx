import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ArcaneaClaw — The Creator Media Engine",
  description:
    "Intelligent media pipeline that processes, classifies, scores, and publishes your creative media. Deploy on Railway, Docker, or Claude Code.",
  openGraph: {
    title: "ArcaneaClaw — The Creator Media Engine",
    description:
      "Your AI processes, classifies, scores, and publishes your creative media — while you sleep.",
    images: [
      {
        url: "/guardians/v3/draconia-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "ArcaneaClaw — Creator Media Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/guardians/v3/draconia-hero-v3.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ArcaneaClaw",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux, Docker, Railway",
  description:
    "Intelligent creator media engine that processes, classifies, scores, and publishes creative media automatically.",
  url: "https://arcanea.ai/claw",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
};

/* ─── Pipeline Steps ─────────────────────────────────────────────────────── */

const PIPELINE_STEPS = [
  {
    step: "01",
    name: "Scan",
    description: "Watch folders for new media files across all your drives",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: "02",
    name: "Classify",
    description: "AI identifies characters, scenes, elements, and canon entities",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    step: "03",
    name: "Dedup",
    description: "Perceptual hashing eliminates duplicates and near-duplicates",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "04",
    name: "Process",
    description: "Resize, convert to WebP, generate thumbnails and variants",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "05",
    name: "Score",
    description: "TASTE evaluation: Technical, Aesthetic, Storytelling, Thematic, Emotional",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    step: "06",
    name: "Upload",
    description: "Push to Supabase Storage with metadata, tags, and scoring data",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    step: "07",
    name: "Social",
    description: "Generate captions, schedule posts, publish across platforms",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    step: "08",
    name: "Notify",
    description: "Command Center alerts — approve, reject, or tweak from any device",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

/* ─── Feature Cards ──────────────────────────────────────────────────────── */

const FEATURES = [
  {
    title: "TASTE Scoring",
    subtitle: "5-Dimension AI Quality Evaluation",
    description:
      "Every image gets scored on Technical quality, Aesthetic composition, Storytelling depth, Thematic alignment, and Emotional resonance. Only the best make it to your gallery.",
    color: "from-gold-bright/20 to-gold-deep/5",
    borderColor: "border-gold-bright/20",
    accentColor: "text-gold-bright",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Canon-Aware Classification",
    subtitle: "Understands Your World's Entities",
    description:
      "Recognizes Guardians, Godbeasts, Gates, Elements, and custom entities from your creative universe. Tags media with lore-accurate metadata automatically.",
    color: "from-atlantean-teal-aqua/20 to-atlantean-teal/5",
    borderColor: "border-atlantean-teal-aqua/20",
    accentColor: "text-atlantean-teal-aqua",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Multi-Platform Publishing",
    subtitle: "One Approval, Every Platform",
    description:
      "Approve once in the Command Center. ArcaneaClaw handles resizing, captioning, and posting to your website gallery, social channels, and storage — simultaneously.",
    color: "from-purple-500/20 to-purple-900/5",
    borderColor: "border-purple-500/20",
    accentColor: "text-purple-400",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Agent Dashboard",
    subtitle: "Visual Command Center",
    description:
      "A real-time dashboard showing pipeline status, scoring distributions, recent uploads, and pending approvals. Your creative media, at a glance.",
    color: "from-draconic-sky/20 to-draconic-sky-deep/5",
    borderColor: "border-draconic-sky/20",
    accentColor: "text-draconic-sky-bright",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
];

/* ─── Deploy Options ─────────────────────────────────────────────────────── */

const DEPLOY_OPTIONS = [
  {
    title: "Railway",
    subtitle: "One-Click Cloud",
    description: "Deploy to Railway with a single click. Persistent storage, auto-scaling, environment variables pre-configured.",
    snippet: "railway up --template arcanea-claw",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    href: "https://railway.app/template/arcanea-claw",
  },
  {
    title: "Docker / Podman",
    subtitle: "Self-Hosted",
    description: "Run on your own infrastructure. Full control over storage paths, scheduling, and network access.",
    snippet: "docker compose up -d arcanea-claw",
    accentColor: "text-atlantean-teal-aqua",
    borderColor: "border-atlantean-teal-aqua/20",
    href: "https://github.com/frankxai/arcanea-claw",
  },
  {
    title: "Claude Code",
    subtitle: "MCP Skills",
    description: "Use ArcaneaClaw skills directly in Claude Code. Process media, score images, and manage your pipeline from the terminal.",
    snippet: "claude mcp add arcanea-claw",
    accentColor: "text-gold-bright",
    borderColor: "border-gold-bright/20",
    href: "https://github.com/frankxai/arcanea-claw#claude-code",
  },
];

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function ClawPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-cosmic-void" />
          <div className="absolute inset-0 bg-cosmic-mesh" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(127,255,212,0.04),transparent_50%)]" />
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="mb-20 pt-8">
            <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-14 sm:py-20">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-bright/5 via-transparent to-atlantean-teal-aqua/5 pointer-events-none" />

              <div className="relative text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-bright/20 bg-gold-bright/5 mb-8">
                  <span className="w-2 h-2 rounded-full bg-gold-bright animate-pulse" />
                  <span className="text-xs font-mono tracking-[0.2em] uppercase text-gold-bright">
                    Creator Infrastructure
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
                  <span className="bg-gradient-to-r from-gold-bright via-gold-medium to-atlantean-teal-aqua bg-clip-text text-transparent">
                    ArcaneaClaw
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl font-display text-text-secondary mb-6">
                  The Creator Media Engine
                </p>

                <p className="text-base text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                  Your AI processes, classifies, scores, and publishes your creative media — while you sleep.
                  From raw files scattered across drives to a curated, scored, published gallery.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://railway.app/template/arcanea-claw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold-bright text-cosmic-deep font-semibold hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Deploy on Railway
                  </a>
                  <a
                    href="https://github.com/frankxai/arcanea-claw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl liquid-glass border border-white/[0.08] text-text-primary font-semibold hover:border-gold-bright/30 hover:bg-gold-bright/5 transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── How It Works — 8 Step Pipeline ────────────────────────────── */}
          <section className="mb-20" aria-labelledby="pipeline-heading">
            <div className="text-center mb-12">
              <h2
                id="pipeline-heading"
                className="text-xs font-mono tracking-[0.35em] uppercase text-gold-bright mb-3"
              >
                The Pipeline
              </h2>
              <p className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                8 skills. Fully automated.
              </p>
              <p className="text-text-muted mt-3 max-w-xl mx-auto">
                From raw media on your drives to scored, tagged, published content — every step handled by a specialized AI skill.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PIPELINE_STEPS.map((step, i) => (
                <div
                  key={step.step}
                  className="relative liquid-glass rounded-2xl p-6 hover:border-white/[0.10] transition-all group"
                >
                  {/* Connector line */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-white/[0.08]" />
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-gold-bright/60">{step.step}</span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] text-text-secondary group-hover:text-gold-bright transition-colors">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                    {step.name}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Feature Cards ─────────────────────────────────────────────── */}
          <section className="mb-20" aria-labelledby="features-heading">
            <div className="text-center mb-12">
              <h2
                id="features-heading"
                className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-3"
              >
                Features
              </h2>
              <p className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                Built for creators who ship
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={`liquid-glass rounded-2xl p-8 border ${feature.borderColor} hover:border-white/[0.12] transition-all`}
                >
                  <div className={`bg-gradient-to-br ${feature.color} rounded-xl w-14 h-14 flex items-center justify-center mb-6 ${feature.accentColor}`}>
                    {feature.icon}
                  </div>

                  <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {feature.title}
                  </h3>
                  <p className={`text-xs font-mono ${feature.accentColor} mb-3`}>
                    {feature.subtitle}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Deploy Options ────────────────────────────────────────────── */}
          <section className="mb-20" aria-labelledby="deploy-heading">
            <div className="text-center mb-12">
              <h2
                id="deploy-heading"
                className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-3"
              >
                Deploy
              </h2>
              <p className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                Three ways to run your engine
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {DEPLOY_OPTIONS.map((option) => (
                <a
                  key={option.title}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`liquid-glass rounded-2xl p-8 border ${option.borderColor} hover:border-white/[0.12] transition-all group block`}
                >
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {option.title}
                  </h3>
                  <p className={`text-xs font-mono ${option.accentColor} mb-4`}>
                    {option.subtitle}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {option.description}
                  </p>

                  <div className="rounded-lg bg-cosmic-void/80 border border-white/[0.04] px-4 py-3">
                    <code className="text-xs font-mono text-text-muted">
                      <span className="text-gold-bright/60">$</span>{" "}
                      <span className="text-text-secondary">{option.snippet}</span>
                    </code>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ── Architecture ──────────────────────────────────────────────── */}
          <section className="mb-20" aria-labelledby="architecture-heading">
            <div className="text-center mb-12">
              <h2
                id="architecture-heading"
                className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-3"
              >
                Architecture
              </h2>
              <p className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                How the pieces connect
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-8 sm:p-12 overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono text-text-secondary leading-relaxed whitespace-pre">
{`
  Your Drives                ArcaneaClaw Engine               Destinations
 +-----------+          +-------------------------+        +--------------+
 | Google    |          |                         |        |              |
 | Drive     +--------->+  Scan -> Classify       |        | Supabase     |
 +-----------+          |    |        |            |        | Storage      |
                        |    v        v            +------->+              |
 +-----------+          |  Dedup -> Process        |        +--------------+
 | Local     |          |    |        |            |
 | Folders   +--------->+    v        v            |        +--------------+
 +-----------+          |  Score -> Upload         +------->+ Website      |
                        |    |        |            |        | Gallery      |
 +-----------+          |    v        v            |        +--------------+
 | Cloud     |          |  Social -> Notify        |
 | Storage   +--------->+         |                |        +--------------+
 +-----------+          |         v                +------->+ Social       |
                        |  Command Center          |        | Platforms    |
                        |  (approve / reject)      |        +--------------+
                        +-------------------------+
`}
              </pre>
            </div>
          </section>

          {/* ── Open Ecosystem ────────────────────────────────────────────── */}
          <section className="mb-20" aria-labelledby="ecosystem-heading">
            <div className="text-center mb-12">
              <h2
                id="ecosystem-heading"
                className="text-xs font-mono tracking-[0.35em] uppercase text-gold-bright mb-3"
              >
                Ecosystem
              </h2>
              <p className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                Built for the Claw ecosystem
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  name: "OpenClaw",
                  stat: "Open source",
                  description:
                    "The open-source community that powers Claw tools. ArcaneaClaw builds on top of battle-tested infrastructure.",
                },
                {
                  name: "NanoClaw",
                  stat: "Lightweight core",
                  description:
                    "Minimal footprint media processing. ArcaneaClaw extends NanoClaw with AI scoring, classification, and multi-platform output.",
                },
                {
                  name: "Claude Code Skills",
                  stat: "MCP native",
                  description:
                    "Every ArcaneaClaw capability exposed as a skill. Use from Claude Code, Cursor, or any MCP-compatible agent.",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="liquid-glass rounded-2xl p-8 text-center"
                >
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-gold-bright mb-4">
                    {item.stat}
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Final CTA ─────────────────────────────────────────────────── */}
          <section>
            <div className="liquid-glass rounded-3xl px-8 py-14 sm:px-14 text-center border border-gold-bright/10">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-bright/3 via-transparent to-atlantean-teal-aqua/3 pointer-events-none rounded-3xl" />

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-4">
                Deploy Your Media Engine
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8">
                Stop organizing files. Start publishing art. ArcaneaClaw turns your creative chaos into a curated, scored, published body of work.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/frankxai/arcanea-claw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-bright text-cosmic-deep font-semibold hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-200"
                >
                  Get Started on GitHub
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl liquid-glass border border-white/[0.08] text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 transition-all duration-200"
                >
                  Read the Announcement
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
