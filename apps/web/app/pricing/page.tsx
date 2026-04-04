import { Metadata } from "next";
import Link from "next/link";
import {
  Chat,
  ImageSquare,
  PencilSimple,
  Globe,
  Code,
  GitBranch,
  BookOpen,
  Users,
  Lightning,
  Crown,
  Star,
  ArrowRight,
  Heart,
  Package,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Open Core — Everything Free, Forever Open",
  description:
    "Arcanea is open-source and free to use. Chat with AI, explore 200K+ words of creative philosophy, build worlds, and use all our tools. Join the Founding Circle for early access to premium creation features.",
  openGraph: {
    title: "Open Core — Everything Free, Forever Open",
    description:
      "Open-source creative infrastructure. Chat, create, build worlds — free. Join the Founding Circle for early access to premium features.",
    type: "website",
    images: [
      {
        url: "/guardians/v3/alera-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "Alera — Guardian of the Voice Gate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/guardians/v3/alera-hero-v3.webp"],
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const FREE_FOREVER = [
  {
    Icon: Chat,
    title: "Chat with Lumina",
    desc: "Unlimited conversations with our AI creative companion",
  },
  {
    Icon: BookOpen,
    title: "The Library",
    desc: "200K+ words of creative philosophy, mythology, and wisdom",
  },
  {
    Icon: Globe,
    title: "World Building",
    desc: "Create characters, locations, magic systems, and entire universes",
  },
  {
    Icon: ImageSquare,
    title: "Image Generation",
    desc: "Create original images from prompts, guided by the Arcanean framework",
  },
  {
    Icon: PencilSimple,
    title: "Story Generation",
    desc: "Write chapters, lore entries, and narratives with AI assistance",
  },
  {
    Icon: Users,
    title: "Community",
    desc: "Connect with other world-builders and creators in the multiverse",
  },
];

const OSS_TOOLS = [
  { name: "27 Repositories", desc: "Fork, extend, or build on the entire platform" },
  { name: "35 npm Packages", desc: "MCP servers, CLIs, agents, skills — all MIT licensed" },
  { name: "54 Skills", desc: "Creative and development skills for any coding agent" },
  { name: "10 Guardians", desc: "AI personality frameworks you can use in your own projects" },
  { name: "MCP Server", desc: "42 tools for world-building, characters, quests, and more" },
  { name: "Design System", desc: "Cosmic theme tokens, components, and patterns" },
];

const FOUNDING_BENEFITS = [
  {
    Icon: Crown,
    title: "Founding Member Status",
    desc: "Permanent recognition as one of the first 1,000 Arcaneans",
  },
  {
    Icon: Lightning,
    title: "Early Access",
    desc: "First to try premium creation features, priority GPU queue, custom Guardians",
  },
  {
    Icon: Star,
    title: "Shape the Product",
    desc: "Direct input into what we build next — feature votes, beta testing, roadmap access",
  },
  {
    Icon: Heart,
    title: "Lifetime Discount",
    desc: "Founding members get permanent pricing advantages when paid tiers launch",
  },
];

const COMING_SOON = [
  {
    title: "Creation Credits",
    desc: "Pay-per-creation for images, music, stories, and characters. No subscription required.",
    status: "Q2 2026",
  },
  {
    title: "Forge Unlimited",
    desc: "Unlimited creation for serious builders — images, music, stories, worlds, all unlimited.",
    status: "Q2 2026",
  },
  {
    title: "Creator Marketplace",
    desc: "Sell your worlds, templates, agents, and content to other creators. Keep 90%.",
    status: "Q3 2026",
  },
  {
    title: "Agent Economy",
    desc: "Deploy Luminor agents that work autonomously — for yourself or as services for others.",
    status: "Q3 2026",
  },
];

const FAQs = [
  {
    question: "Is Arcanea really free?",
    answer:
      "Yes. The core platform — AI chat, the Library, world-building, image and story generation, all open-source tools — is free and will remain free. We believe creators need powerful tools without paywalls to explore and build.",
  },
  {
    question: "What's open source?",
    answer:
      "Everything: the code, skills, agents, CLIs, MCP servers, and design system. Arcanea's entire creative infrastructure is open source under MIT license. Fork it, extend it, use it commercially, or contribute back.",
  },
  {
    question: "What will cost money eventually?",
    answer:
      "Premium creation features: high-volume image generation with priority GPU, unlimited music composition, a marketplace for selling your creations, and advanced agent deployment. The core creative experience stays free.",
  },
  {
    question: "What is the Founding Circle?",
    answer:
      "The first 1,000 creators who join get permanent Founding Member status, early access to premium features, lifetime pricing advantages, and direct input into the product roadmap. It costs nothing to join — we just want your email and your ideas.",
  },
  {
    question: "Can I sell what I create?",
    answer:
      "Everything you create with Arcanea is yours — full commercial rights. When the Creator Marketplace launches, you will also be able to sell worlds, templates, and content directly to other creators.",
  },
  {
    question: "Can AI agents use Arcanea?",
    answer:
      "Yes — and this is a core part of our vision. Our MCP server, APIs, and agent framework are designed for both human creators and AI agents. We are building an economy where agents create, trade, and collaborate alongside humans.",
  },
];

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arcanea — Open Core Creative Platform",
    url: "https://arcanea.ai/pricing",
    description:
      "Open-source creative infrastructure. Chat, create, build worlds — free forever.",
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(13,71,161,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,188,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,215,0,0.2),transparent_60%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-8">
            <GitBranch size={14} weight="bold" style={{ color: "#7fffd4" }} />
            <span className="text-sm text-[#7fffd4] font-mono tracking-wider">
              OPEN CORE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Everything is free.
            <span className="block bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-[#ffd700] bg-clip-text text-transparent">
              Everything is open.
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
            27 repos. 35 packages. 200K+ words. AI chat. World-building.
            <br className="hidden md:block" />
            The entire creative engine — open source, free to use.
          </p>

          <p className="text-sm text-text-muted max-w-lg mx-auto">
            We believe the tools for creation should belong to everyone. Build on
            Arcanea, fork it, extend it — it is yours.
          </p>
        </section>

        {/* Free Forever Grid */}
        <section className="pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-semibold mb-2">
              Free Forever
            </h2>
            <p className="text-sm text-text-muted">
              No credit card. No trial. No catch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {FREE_FOREVER.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#7fffd4]/20 transition-colors"
              >
                <Icon
                  size={24}
                  weight="duotone"
                  style={{ color: "#7fffd4", flexShrink: 0, marginTop: 2 }}
                />
                <div>
                  <h3 className="font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Source Arsenal */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-semibold mb-2">
              The Open Source Arsenal
            </h2>
            <p className="text-sm text-text-muted">
              Fork it. Extend it. Build on it. MIT licensed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
            {OSS_TOOLS.map(({ name, desc }) => (
              <div
                key={name}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} weight="duotone" style={{ color: "#78a6ff" }} />
                  <h3 className="font-semibold text-sm">{name}</h3>
                </div>
                <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="https://github.com/frankxai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-sm font-medium hover:bg-white/[0.04] transition-colors"
            >
              <GitBranch size={16} weight="bold" />
              Browse on GitHub
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Founding Circle */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#7fffd4]/10" />
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl" />

            <div className="relative p-10 md:p-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-6">
                  <Crown size={14} weight="fill" style={{ color: "#ffd700" }} />
                  <span className="text-sm text-[#ffd700] font-mono tracking-wider">
                    FOUNDING CIRCLE
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Be one of the first{" "}
                  <span className="bg-gradient-to-r from-[#ffd700] to-[#ffaa00] bg-clip-text text-transparent">
                    1,000
                  </span>
                </h2>

                <p className="text-text-secondary max-w-xl mx-auto">
                  Join the Founding Circle — get permanent status, early access to
                  premium features, and help shape what we build next.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
                {FOUNDING_BENEFITS.map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 p-5 rounded-xl bg-white/[0.03] border border-[#ffd700]/10"
                  >
                    <Icon
                      size={22}
                      weight="duotone"
                      style={{ color: "#ffd700", flexShrink: 0, marginTop: 2 }}
                    />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{title}</h3>
                      <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/auth/signup?ref=founding"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-[#09090b] font-semibold text-lg hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all"
                >
                  Join the Founding Circle
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <p className="text-text-muted text-xs mt-4">
                  Free to join. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-semibold mb-2">
              On the Horizon
            </h2>
            <p className="text-sm text-text-muted">
              Premium features coming soon — free for Founding Circle members to try first
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {COMING_SOON.map(({ title, desc, status }) => (
              <div
                key={title}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold">{title}</h3>
                  <span className="px-3 py-1 rounded-full bg-[#78a6ff]/10 text-[#78a6ff] text-[10px] font-mono">
                    {status}
                  </span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Philosophy */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-display font-semibold mb-6">
              Why Open Core?
            </h2>
            <div className="space-y-6 text-text-secondary text-sm leading-relaxed text-left">
              <p>
                We believe the best creative tools are built in the open. When you can read
                the code, fork the framework, and extend every component — you are not a
                user, you are a co-creator.
              </p>
              <p>
                Arcanea is inspired by how Supabase, Vercel, and GitLab built massive
                ecosystems on open foundations. The tools stay free. The infrastructure
                stays open. Premium features will earn revenue to sustain and grow the
                platform — but the creative engine belongs to everyone.
              </p>
              <p>
                When paid features launch, you will know exactly what you are paying for:
                GPU compute for high-volume creation, marketplace infrastructure for
                selling your work, and advanced agent deployment. The creative framework —
                the worlds, the mythology, the AI personalities, the design system — that
                stays open.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-display font-semibold mb-4">
                Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQs.map((faq, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/15 via-[#78a6ff]/15 to-[#ffd700]/15" />
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Start creating today
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                200K+ words of creative philosophy. Intelligent world-building. A
                community of creators. Everything open source. Everything free.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] text-[#09090b] font-semibold text-lg hover:shadow-[0_0_40px_rgba(127,255,212,0.4)] transition-all"
                >
                  Start Creating
                </Link>
                <Link
                  href="/auth/signup?ref=founding"
                  className="px-8 py-4 rounded-xl border border-[#ffd700]/30 text-[#ffd700] font-semibold text-lg hover:bg-[#ffd700]/10 transition-all"
                >
                  Join Founding Circle
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
