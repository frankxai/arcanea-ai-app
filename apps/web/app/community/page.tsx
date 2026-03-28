import Link from "next/link";
import {
  PhChatCircle,
  PhGithubLogo,
  PhTwitterLogo,
  PhYoutubeLogo,
  PhCalendar,
  PhGlobe,
  PhMapPin,
  PhStar,
  PhBookOpen,
  PhCpu,
  PhPen,
  PhCode,
  PhTranslate,
  PhPaintBrush,
  PhArrowRight,
  PhArrowUpRight,
  PhUsers,
  PhSparkle,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhGitBranch,
  PhCrown,
  PhPackage,
  PhRocket,
  PhHeart,
  PhShieldStar,
} from '@/lib/phosphor-icons';
import { NewsletterForm } from "@/components/community/newsletter-form";
import { ActivityFeedSection } from "./sections/activity-feed-section";
import { CreatorDiscoverySection } from "./sections/creator-discovery-section";

// ─── Data ──────────────────────────────────────────────────────────────────────

const COMMUNITY_SPACES = [
  {
    id: "discord",
    name: "Discord",
    tagline: "Primary community — real-time creation",
    description:
      "The heartbeat of Arcanea. Real-time collaboration, dedicated channels for active creation, lore discussion, and voice rooms where creators build together live.",
    highlights: [
      "#create — Share works in progress",
      "#lore-discussion — Explore the mythology",
      "Voice creation rooms — Build live together",
      "Companion channels — Creative domain spaces",
    ],
    href: "https://discord.gg/arcanea",
    cta: "Join Discord",
    badge: "Primary",
    badgeColor: "brand-primary",
    icon: PhChatCircle,
    accentClass: "from-brand-primary/20 to-brand-primary/5",
    borderHoverClass: "hover:border-brand-primary/40",
    glowColor: "rgba(13,71,161,0.15)",
    iconColor: "text-brand-primary",
    badgeBg: "bg-brand-primary/20 text-brand-primary border-brand-primary/30",
  },
  {
    id: "github",
    name: "GitHub",
    tagline: "Open source — shape the platform",
    description:
      "Arcanea is built in the open. Contribute skills, report issues, explore the intelligence layer, and help define the future of the creative platform.",
    highlights: [
      "Contribute creative skills",
      "Report issues and request features",
      "Star the repository",
      "Fork and experiment freely",
    ],
    href: "https://github.com/frankxai",
    cta: "View on GitHub",
    badge: "Open Source",
    icon: PhGithubLogo,
    accentClass: "from-crystal/20 to-crystal/5",
    borderHoverClass: "hover:border-crystal/40",
    glowColor: "rgba(0,188,212,0.12)",
    iconColor: "text-crystal",
    badgeBg: "bg-crystal/20 text-crystal border-crystal/30",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    tagline: "@frankxai — daily signal from the cosmos",
    description:
      "Daily wisdom threads, creation showcases from the community, platform updates, and the ongoing mythology of Arcanea — broadcast in real time.",
    highlights: [
      "Daily wisdom from the Library",
      "Community creation showcases",
      "Platform releases and updates",
      "Creator spotlights and threads",
    ],
    href: "https://twitter.com/frankxai",
    cta: "Follow @frankxai",
    badge: "@frankxai",
    icon: PhTwitterLogo,
    accentClass: "from-water/20 to-water/5",
    borderHoverClass: "hover:border-water/40",
    glowColor: "rgba(120,166,255,0.12)",
    iconColor: "text-water",
    badgeBg: "bg-water/20 text-water border-water/30",
  },
  {
    id: "youtube",
    name: "YouTube",
    tagline: "Tutorials, lore, and creation walkthroughs",
    description:
      "Deep-dive tutorials on the Arcanea platform, lore explorations of the mythology, live creation walkthroughs, and recorded Gate Ceremonies.",
    highlights: [
      "Platform tutorials and walkthroughs",
      "Lore deep dives — mythology explored",
      "Creation sessions — watch and learn",
      "Recorded Gate Ceremonies",
    ],
    href: "https://youtube.com/@arcanea_ai",
    cta: "Subscribe",
    badge: "Watch & Learn",
    icon: PhYoutubeLogo,
    accentClass: "from-fire/20 to-fire/5",
    borderHoverClass: "hover:border-fire/40",
    glowColor: "rgba(255,107,53,0.12)",
    iconColor: "text-fire",
    badgeBg: "bg-fire/20 text-fire border-fire/30",
  },
];

const WAYS_TO_CONTRIBUTE = [
  {
    title: "Build",
    subtitle: "Fork repos, submit PRs, create skills",
    description:
      "The entire platform is open source. Pick an issue, build a feature, craft an agent skill, or extend the intelligence layer. Your code ships to creators worldwide.",
    icon: PhCode,
    color: "#00bcd4",
    highlights: ["Fork & contribute code", "Create agent skills", "Build platform features"],
  },
  {
    title: "Create",
    subtitle: "Write lore, compose music, design characters",
    description:
      "Expand the mythology, compose frequency-aligned music, illustrate Guardians and Godbeasts, or write Library texts. Every form of creative work deepens the world.",
    icon: PhPaintBrush,
    color: "#ffd700",
    highlights: ["Write Library texts", "Design character art", "Compose Gate music"],
  },
  {
    title: "Share",
    subtitle: "Publish to the marketplace, help others learn",
    description:
      "Share your creations with the community, mentor new creators, write tutorials, and publish skills and content to the marketplace for others to build upon.",
    icon: PhHeart,
    color: "#ff6b35",
    highlights: ["Publish skills & content", "Write guides & tutorials", "Mentor new creators"],
  },
  {
    title: "Govern",
    subtitle: "Inner circle earns governance through contribution",
    description:
      "Sustained contribution earns governance rights. Shape the platform's direction, vote on canonical decisions, and help steer the creative civilization toward its future.",
    icon: PhCrown,
    color: "#9966ff",
    highlights: ["Earn governance rights", "Shape platform direction", "Vote on canon decisions"],
  },
];

const FEATURED_REPOS = [
  {
    name: "arcanea",
    fullName: "frankxai/arcanea",
    description:
      "The main Arcanea monorepo — Next.js platform, AI services, design system, and the Library of 200K+ words.",
    href: "https://github.com/frankxai/arcanea",
    tags: ["monorepo", "next.js", "ai"],
    color: "#00bcd4",
    icon: PhRocket,
  },
  {
    name: "@arcanea/skills",
    fullName: "frankxai/arcanea-skills-opensource",
    description:
      "54 open-source Claude Code skills — world-building, agent design, creative workflows, and development tools.",
    href: "https://github.com/frankxai/arcanea-skills-opensource",
    tags: ["skills", "claude", "agents"],
    color: "#9966ff",
    icon: PhSparkle,
  },
  {
    name: "claude-arcanea",
    fullName: "frankxai/claude-arcanea",
    description:
      "The Claude Code integration layer — MCP servers, memory, vector search, and intelligence orchestration.",
    href: "https://github.com/frankxai/claude-arcanea",
    tags: ["mcp", "vectors", "intelligence"],
    color: "#ffd700",
    icon: PhCpu,
  },
  {
    name: "oh-my-arcanea",
    fullName: "frankxai/oh-my-arcanea",
    description:
      "Community-contributed Arcanea overlays, themes, and configurations for Claude Code, Cursor, and other AI-native editors.",
    href: "https://github.com/frankxai/oh-my-arcanea",
    tags: ["overlays", "themes", "community"],
    color: "#ff6b35",
    icon: PhPackage,
  },
];

const EVENTS = [
  {
    title: "Monthly Creation Sessions",
    frequency: "Every month",
    format: "Online",
    description:
      "Guided creation gatherings where community members build together in real time, with AI support. Each session focuses on a different domain of mastery.",
    icon: PhSparkle,
    formatIcon: PhGlobe,
    accent: "crystal",
    accentHex: "#00bcd4",
    badgeText: "Monthly",
  },
  {
    title: "Gate Ceremonies",
    frequency: "Quarterly",
    format: "Online ritual",
    description:
      "Sacred gatherings aligned with the Ten Gates. A ceremony of reflection, celebration, and collective advancement. Creators share breakthroughs and honor the Arc.",
    icon: PhStar,
    formatIcon: PhGlobe,
    accent: "void-el",
    accentHex: "#9966ff",
    badgeText: "Quarterly",
  },
  {
    title: "Creator Summit",
    frequency: "Annual",
    format: "Hybrid — physical + digital",
    description:
      "The flagship gathering of the Arcanea world. A multi-day convergence of creators, builders, and visionaries. Keynotes, workshops, and the unveiling of what comes next.",
    icon: PhFlame,
    formatIcon: PhMapPin,
    accent: "brand-gold",
    accentHex: "#ffd700",
    badgeText: "Annual",
    featured: true,
  },
  {
    title: "Local Creator Meetups",
    frequency: "Ongoing — city-based",
    format: "In person",
    description:
      "Community-organized gatherings in cities worldwide. Find your local circle, share your work, and create connections that extend beyond the digital realm.",
    icon: PhUsers,
    formatIcon: PhMapPin,
    accent: "earth",
    accentHex: "#4a7c59",
    badgeText: "Local",
  },
];

const SPOTLIGHTS = [
  {
    title: "The Dungeon of Silence",
    creator: "Resonance Mage",
    gate: "Voice",
    type: "Written Work",
    description:
      "A guided meditation descended from the Voice Gate, combining Alera's teachings with personal creative practice into an immersive ritual text.",
    accent: "#00bcd4",
    gateColor: "text-crystal",
  },
  {
    title: "Godbeast Field Studies",
    creator: "Archive Walker",
    gate: "Sight",
    type: "Visual Series",
    description:
      "An ongoing visual series mapping the forms and territories of the Ten Godbeasts, rendered through AI image generation guided by the Bestiary.",
    accent: "#00bcd4",
    gateColor: "text-water",
  },
  {
    title: "Frequency Compositions",
    creator: "The Solfeggio Wanderer",
    gate: "Foundation",
    type: "Audio Creation",
    description:
      "Original compositions built around the Extended Solfeggio frequencies, one piece per Gate — designed to open creative states before a session.",
    accent: "#9966ff",
    gateColor: "text-void-el",
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function CommunityPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
        <section className="pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-16 sm:py-20 lg:px-20 lg:py-24">
            {/* Elara hero bg */}
            <img
              src="/guardians/v3/elara-hero-v3.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.11] pointer-events-none object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-8">
                <PhUsers className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Community
                </span>
              </div>

              <h1 className="text-fluid-hero font-display font-bold mb-6 leading-none tracking-tight">
                Join the
                <span className="block text-gradient-brand">Creative Civilization</span>
              </h1>

              <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-10">
                Not just users — co-creators. Contribute lore, agents, skills,
                code, art, music. Shape a living ecosystem where imagination
                becomes infrastructure and every creator has a voice.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://discord.gg/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhChatCircle className="w-4 h-4" />
                  Join Discord
                </a>
                <a
                  href="https://github.com/frankxai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <PhGithubLogo className="w-4 h-4" />
                  Explore GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 1b. Creator Discovery ──────────────────────────────────────── */}
        <CreatorDiscoverySection />

        {/* ── 1c. Activity Feed ────────────────────────────────────────────── */}
        <ActivityFeedSection />

        {/* ── 1d. Discussions CTA ────────────────────────────────────────────── */}
        <section className="py-12 border-t border-white/[0.04]">
          <Link
            href="/community/discussions"
            className="group flex items-center justify-between p-6 rounded-2xl liquid-glass border border-white/[0.04] hover:border-crystal/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-crystal/10 flex items-center justify-center">
                <PhChatCircle className="w-6 h-6 text-crystal" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base mb-0.5">
                  Community Discussions
                </h3>
                <p className="text-sm text-text-secondary font-sans">
                  Share ideas, ask lore questions, discuss techniques, and connect with fellow creators.
                </p>
              </div>
            </div>
            <PhArrowRight className="w-5 h-5 text-text-muted group-hover:text-crystal group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </section>

        {/* ── 2. Open Source Stats ─────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="oss-stats-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
              <PhGithubLogo className="w-3 h-3 text-crystal" />
              <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                Open Source
              </span>
            </div>
            <h2
              id="oss-stats-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Built in the open
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              Arcanea is fully open source. Explore the codebase, contribute
              features, build skills, and help shape the platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              { value: "27", label: "Repositories", color: "#00bcd4" },
              { value: "35", label: "npm Packages", color: "#ffd700" },
              { value: "54", label: "Skills", color: "#9966ff" },
              { value: "791", label: "Tests Passing", color: "#4a7c59" },
              { value: "200K+", label: "Words of Lore", color: "#ff6b35" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative card-3d liquid-glass rounded-2xl p-6 text-center overflow-hidden group hover-lift transition-all"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${stat.color}12, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <p
                    className="text-3xl md:text-4xl font-display font-bold mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-muted font-sans">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Ways to Contribute ───────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="contribute-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-earth/30 bg-earth/10 mb-5">
              <PhLeaf className="w-3 h-3 text-earth" />
              <span className="text-xs font-mono tracking-widest uppercase text-earth-bright">
                Contribute
              </span>
            </div>
            <h2
              id="contribute-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Ways to shape Arcanea
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              The platform, the mythology, and the intelligence layer are all
              open to contribution. Every form of creative work is welcome here.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WAYS_TO_CONTRIBUTE.map((way) => {
              const Icon = way.icon;
              return (
                <div
                  key={way.title}
                  className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden glow-card hover-lift transition-all"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 30% 20%, ${way.color}15, transparent 65%)`,
                    }}
                  />

                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${way.color}18` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: way.color }}
                      />
                    </div>

                    <h3 className="text-xl font-display font-bold mb-1">
                      {way.title}
                    </h3>
                    <p
                      className="text-sm font-mono mb-3 opacity-80"
                      style={{ color: way.color }}
                    >
                      {way.subtitle}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed font-sans mb-5">
                      {way.description}
                    </p>

                    <ul className="space-y-1.5" role="list">
                      {way.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-text-muted font-sans"
                        >
                          <span
                            className="mt-1 w-1 h-1 rounded-full shrink-0"
                            style={{ backgroundColor: way.color }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Featured Repos ───────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="repos-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-5">
              <PhGitBranch className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Featured Repos
              </span>
            </div>
            <h2
              id="repos-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Explore the ecosystem
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              The Arcanea ecosystem spans multiple repositories. Start with any
              of these to contribute, learn, or build something new.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURED_REPOS.map((repo) => {
              const RepoIcon = repo.icon;
              return (
                <a
                  key={repo.name}
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden glow-card hover-lift transition-all"
                  aria-label={`${repo.name} — ${repo.description}`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 30% 30%, ${repo.color}12, transparent 65%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${repo.color}18` }}
                      >
                        <RepoIcon
                          className="w-5 h-5"
                          style={{ color: repo.color }}
                        />
                      </div>
                      <PhArrowUpRight
                        className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>

                    <h3 className="font-mono font-semibold text-lg mb-1">
                      {repo.name}
                    </h3>
                    <p className="text-xs text-text-muted font-mono mb-3">
                      {repo.fullName}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed font-sans mb-5">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {repo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: `${repo.color}10`,
                            color: repo.color,
                            borderColor: `${repo.color}25`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="https://github.com/frankxai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-crystal/10 border border-crystal/20 text-crystal font-semibold hover:bg-crystal/15 hover:border-crystal/30 transition-all btn-glow"
            >
              <PhGithubLogo className="w-4 h-4" />
              View all repositories
              <PhArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ── 5. Community Spaces ─────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="spaces-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
              <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                Community Spaces
              </span>
            </div>
            <h2
              id="spaces-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Where creators gather
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              Each space serves a distinct purpose in the ecosystem. Join all of
              them, or start with the one that calls to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {COMMUNITY_SPACES.map((space) => {
              const Icon = space.icon;
              return (
                <a
                  key={space.id}
                  href={space.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative card-3d liquid-glass rounded-2xl p-8 overflow-hidden glow-card hover-lift transition-all ${space.borderHoverClass}`}
                  aria-label={`${space.name} — ${space.tagline}`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 30% 30%, ${space.glowColor}, transparent 65%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${space.accentClass}`}
                      >
                        <Icon className={`w-5 h-5 ${space.iconColor}`} />
                      </div>
                      <span
                        className={`text-xs font-mono px-3 py-1 rounded-full border ${space.badgeBg}`}
                      >
                        {space.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-semibold mb-1">
                      {space.name}
                    </h3>
                    <p
                      className={`text-sm font-mono mb-3 ${space.iconColor} opacity-80`}
                    >
                      {space.tagline}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed font-sans mb-5">
                      {space.description}
                    </p>

                    <ul className="space-y-1.5 mb-6" role="list">
                      {space.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-text-muted font-sans"
                        >
                          <span
                            className={`mt-1 w-1 h-1 rounded-full shrink-0 ${space.iconColor.replace("text-", "bg-")}`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2 text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className={space.iconColor}>{space.cta}</span>
                      <PhArrowUpRight
                        className={`w-3.5 h-3.5 ${space.iconColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── 6. Events ───────────────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="events-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-5">
              <PhCalendar className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Gatherings
              </span>
            </div>
            <h2
              id="events-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Gatherings of Creators
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              The Arc turns in cycles. These gatherings mark the moments where
              the community converges — to celebrate, to create, to advance
              together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENTS.map((event) => {
              const EventIcon = event.icon;
              const FormatIcon = event.formatIcon;
              return (
                <div
                  key={event.title}
                  className={`relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden transition-all ${event.featured ? "ring-1 ring-brand-gold/30 shadow-glow-gold" : ""}`}
                >
                  {event.featured && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/8 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  )}

                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${event.accentHex}18` }}
                    >
                      <EventIcon
                        className="w-4 h-4"
                        style={{ color: event.accentHex }}
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${event.accentHex}15`,
                          color: event.accentHex,
                          borderColor: `${event.accentHex}30`,
                        }}
                      >
                        {event.badgeText}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-base mb-1">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                      <FormatIcon className="w-3 h-3 shrink-0" />
                      <span>{event.format}</span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://discord.gg/arcanea"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl liquid-glass border border-brand-gold/20 text-brand-gold text-sm font-semibold hover:bg-brand-gold/5 hover:border-brand-gold/40 transition-all"
            >
              <PhCalendar className="w-4 h-4" />
              Stay informed — join Discord for event announcements
              <PhArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ── 7. Creator Spotlight ─────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="spotlight-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/20 bg-water/8 mb-5">
              <PhStar className="w-3 h-3 text-water" />
              <span className="text-xs font-mono tracking-widest uppercase text-water">
                Creator Spotlight
              </span>
            </div>
            <h2
              id="spotlight-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              From the community
            </h2>
            <p className="text-text-secondary font-sans max-w-2xl">
              Every week, remarkable works emerge from the Arcanea community.
              These are the creations that illuminate what is possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SPOTLIGHTS.map((work) => (
              <div
                key={work.title}
                className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden glow-card hover-lift transition-all"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${work.accent}18, transparent 60%)`,
                  }}
                />

                <div className="relative">
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border mb-5"
                    style={{
                      backgroundColor: `${work.accent}15`,
                      color: work.accent,
                      borderColor: `${work.accent}30`,
                    }}
                  >
                    {work.type}
                  </div>

                  <div
                    className="w-full h-28 rounded-xl mb-5 flex items-center justify-center"
                    style={{
                      backgroundColor: `${work.accent}10`,
                      borderColor: `${work.accent}20`,
                    }}
                    role="img"
                    aria-label={`Visual preview for ${work.title}`}
                  >
                    <PhSparkle
                      className="w-6 h-6 opacity-40"
                      style={{ color: work.accent }}
                    />
                  </div>

                  <h3 className="font-display font-semibold mb-1">
                    {work.title}
                  </h3>

                  <p
                    className={`text-xs font-mono mb-3 ${work.gateColor} opacity-80`}
                  >
                    {work.gate}
                  </p>

                  <p className="text-text-secondary text-sm leading-relaxed font-sans mb-4">
                    {work.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                    <span className="text-xs text-text-muted font-sans">
                      {work.creator}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-text-muted font-sans">
            Creator spotlights are community-nominated. Share your work in{" "}
            <a
              href="https://discord.gg/arcanea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crystal underline underline-offset-2 hover:text-crystal-bright transition-colors"
            >
              Discord #create
            </a>{" "}
            to be considered.
          </p>
        </section>

        {/* ── 8. Community Links ──────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="links-heading"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/8 mb-5">
              <PhShieldStar className="w-3 h-3 text-brand-primary" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                Connect
              </span>
            </div>
            <h2
              id="links-heading"
              className="text-fluid-3xl font-display font-bold mb-4"
            >
              Find us everywhere
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "GitHub",
                href: "https://github.com/frankxai",
                icon: PhGithubLogo,
                detail: "github.com/frankxai",
                color: "#00bcd4",
              },
              {
                label: "Discord",
                href: "https://discord.gg/arcanea",
                icon: PhChatCircle,
                detail: "discord.gg/arcanea",
                color: "#0d47a1",
              },
              {
                label: "X / Twitter",
                href: "https://twitter.com/frankxai",
                icon: PhTwitterLogo,
                detail: "@frankxai",
                color: "#78a6ff",
              },
              {
                label: "YouTube",
                href: "https://youtube.com/@arcanea_ai",
                icon: PhYoutubeLogo,
                detail: "@arcanea_ai",
                color: "#ff6b35",
              },
            ].map((link) => {
              const LinkIcon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 liquid-glass rounded-xl p-5 hover-lift transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${link.color}18` }}
                  >
                    <LinkIcon className="w-4.5 h-4.5" style={{ color: link.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{link.label}</p>
                    <p className="text-xs text-text-muted font-mono truncate">
                      {link.detail}
                    </p>
                  </div>
                  <PhArrowUpRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 ml-auto shrink-0 transition-opacity" />
                </a>
              );
            })}
          </div>
        </section>

        {/* ── 9. Newsletter CTA ───────────────────────────────────────────── */}
        <section
          className="py-16 border-t border-white/[0.04]"
          aria-labelledby="newsletter-heading"
        >
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-10 sm:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-primary/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <PhSparkle className="w-3 h-3 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  The Dispatch
                </span>
              </div>

              <h2
                id="newsletter-heading"
                className="text-fluid-3xl font-display font-bold mb-4"
              >
                Wisdom delivered
                <span className="block text-gradient-brand">to your realm</span>
              </h2>

              <p className="text-text-secondary font-body leading-relaxed mb-8 max-w-xl">
                Weekly dispatches from Arcanea — platform updates, Library
                wisdom, community highlights, and new AI capabilities. No
                noise, only signal.
              </p>

              <NewsletterForm />

              <p className="mt-3 text-xs text-text-muted font-sans">
                No spam. Unsubscribe anytime. Your email stays within the realm.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. Philosophy Banner ─────────────────────────────────────────── */}
        <section className="py-16 pb-24 border-t border-white/[0.04]">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="h-0.5 w-full bg-gradient-to-r from-fire via-brand-primary via-crystal via-water to-earth" />

            <div className="px-8 py-16 sm:px-14 sm:py-20 text-center">
              <div
                className="flex justify-center gap-5 mb-10"
                aria-hidden="true"
              >
                <div className="w-8 h-8 rounded-lg bg-fire/15 flex items-center justify-center">
                  <PhFlame className="w-4 h-4 text-fire" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-water/15 flex items-center justify-center">
                  <PhDrop className="w-4 h-4 text-water" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-earth/15 flex items-center justify-center">
                  <PhLeaf className="w-4 h-4 text-earth" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-crystal/15 flex items-center justify-center">
                  <PhSparkle className="w-4 h-4 text-crystal" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-primary/15 flex items-center justify-center">
                  <PhStar className="w-4 h-4 text-brand-primary" />
                </div>
              </div>

              <blockquote className="max-w-3xl mx-auto">
                <p className="text-fluid-3xl font-display font-bold leading-snug mb-6">
                  We believe the antidote to a terrible future{" "}
                  <span className="text-gradient-crystal">
                    is imagining a good one.
                  </span>
                </p>
                <p className="text-xl font-display font-semibold text-brand-gold mb-8">
                  Build it here.
                </p>
                <p className="text-text-secondary font-body leading-relaxed max-w-xl mx-auto">
                  Every creator who joins this community, every skill
                  contributed, every line of code, every Library text written —
                  all of it is a vote for the future we want to inhabit. The Arc
                  turns. Begin.
                </p>
              </blockquote>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <a
                  href="https://discord.gg/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhChatCircle className="w-4 h-4" />
                  Join the community
                </a>
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  Explore the Academy
                  <PhArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="h-0.5 w-full bg-gradient-to-r from-earth via-crystal via-water via-brand-primary to-fire" />
          </div>
        </section>
      </main>
    </div>
  );
}
