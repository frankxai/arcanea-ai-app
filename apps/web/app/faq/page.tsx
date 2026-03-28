import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Arcanea, creative partners, pricing, and how the platform works.",
  openGraph: {
    title: "FAQ",
    description:
      "Frequently asked questions about Arcanea, creative partners, pricing, and how the platform works.",
  },
};

const FAQ_CATEGORIES = [
  {
    name: "Getting Started",
    icon: "🚀",
    questions: [
      {
        q: "What is Arcanea?",
        a: "Arcanea is a creator platform for chat, world-building, and creative output. You can use it to think with AI, build coherent worlds, create stories and assets, and learn from a deep philosophy library that gives the product its distinct point of view.",
      },
      {
        q: "How do I get started?",
        a: "Create a free account at arcanea.ai, start with chat or the library, and then move into studio or world-building when you are ready. The goal is to let you get useful output quickly without forcing you to understand the whole Arcanea universe first.",
      },
      {
        q: "How are Arcanea's companions different from regular AI?",
        a: "Arcanea is not just a chat box. The companions are specialized creative partners inside a larger system that also includes structured creation tools, world-building surfaces, a learning layer, and a philosophy library that helps your work stay coherent over time.",
      },
      {
        q: "Do I need to understand the lore first?",
        a: "No. Arcanea should work as a clear product before the mythology becomes important. The lore is there to deepen the experience, not to block first-time understanding.",
      },
    ],
  },
  {
    name: "Companions",
    icon: "🌟",
    questions: [
      {
        q: "How many companions are there?",
        a: "Arcanea includes multiple specialist intelligences for different kinds of creative work. The exact lineup can evolve, but the product promise is consistent: you should be able to work with AI partners that are stronger than a one-size-fits-all assistant.",
      },
      {
        q: "Which companion should I use?",
        a: "Start with the one closest to your current task. Use story-oriented partners for narrative work, research-oriented partners for synthesis and planning, and more technical partners for systems, workflows, or implementation.",
      },
      {
        q: "Can companions work together?",
        a: "Yes. Arcanea is designed around compound creative work. Different intelligences should be able to contribute to different parts of a project rather than forcing every task through the same interface or voice.",
      },
      {
        q: "What do Guardians, Luminors, and Gates mean?",
        a: "They are Arcanea's mythic vocabulary for specialist intelligences, AI partners, and creative modes. Publicly, you can think of them as structured ways to organize capability rather than lore you need to memorize.",
      },
    ],
  },
  {
    name: "Pricing & Plans",
    icon: "💎",
    questions: [
      {
        q: "What is included in the free experience?",
        a: "The free experience is meant to be a real on-ramp, not just a teaser. You should be able to explore the library, use core chat flows, and understand what kind of creative system Arcanea is before paying.",
      },
      {
        q: "What do paid plans unlock?",
        a: "Paid plans are for creators who want more generation capacity, stronger creation workflows, and higher-agency use of the platform. The details can evolve, but the principle is simple: free lets you explore, paid lets you build seriously.",
      },
      {
        q: "Can I switch plans later?",
        a: "Yes. Arcanea should support moving from exploration to committed use without making your work feel trapped or disposable.",
      },
      {
        q: "Do you offer team or enterprise options?",
        a: "Yes. Arcanea has both creator-facing plans and a developer or organizational layer for people who want deeper integration, more control, or custom workflows.",
      },
    ],
  },
  {
    name: "Technical & Platform",
    icon: "⚙️",
    questions: [
      {
        q: "What technologies power Arcanea?",
        a: "Arcanea is built with a modern TypeScript stack centered on Next.js, Supabase, and AI integrations. The product also includes a package ecosystem for MCP, overlays, memory systems, and creator tooling.",
      },
      {
        q: "Is my data secure?",
        a: "Security is a baseline expectation. Arcanea should protect creator work, limit unnecessary data exposure, and make the boundaries between product data, tooling, and experimentation clearer over time.",
      },
      {
        q: "What is open source?",
        a: "Arcanea includes developer-facing tools and packages that support the wider ecosystem, but the main creator platform at arcanea.ai is not the same thing as the entire open tooling surface. Public packages and repo details live on the developer side of Arcanea, while the consumer product remains the main entrypoint for creators.",
      },
      {
        q: "Do you offer self-hosting?",
        a: "Some Arcanea tooling is designed for developers and advanced workflows, but the main platform experience is hosted. If you need deeper integration or custom deployment paths, use the developer surfaces first and contact us for advanced options.",
      },
    ],
  },
];

export default function FAQPage() {
  const allQuestions = FAQ_CATEGORIES.flatMap((cat) => cat.questions);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(13,71,161,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-6">
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-atlantean-teal/30 bg-atlantean-teal/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-atlantean-teal animate-pulse" />
            <span className="text-sm text-atlantean-teal font-mono tracking-wider">
              COMMON QUESTIONS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Frequently
            <span className="block bg-gradient-to-r from-atlantean-teal via-[#00bcd4] to-gold-bright bg-clip-text text-transparent">
              Asked Questions
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Everything you need to know about Arcanea as a creator platform.
            If you need a deeper technical answer, start on the developer side.
          </p>
        </section>

        <div className="py-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              aria-label="Search frequently asked questions"
              className="w-full px-6 py-4 rounded-2xl bg-cosmic-surface border border-white/[0.06] text-white placeholder:text-text-muted focus:outline-none focus:border-atlantean-teal focus:ring-2 focus:ring-atlantean-teal/40 text-lg"
            />
            <svg
              className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-16 py-8">
          {FAQ_CATEGORIES.map((category) => (
            <section key={category.name}>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-2xl font-display font-bold">
                  {category.name}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="group p-6 rounded-2xl liquid-glass cursor-pointer"
                  >
                    <summary className="flex items-start justify-between gap-4 list-none">
                      <span className="font-semibold text-text-primary group-hover:text-atlantean-teal transition-colors">
                        {faq.q}
                      </span>
                      <svg
                        className="w-5 h-5 text-text-muted shrink-0 mt-1 group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-white/[0.04]">
                      <p className="text-text-secondary leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="py-16 text-center">
          <div className="liquid-glass rounded-3xl p-10">
            <h2 className="text-3xl font-display font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-8">
              Explore the platform, review pricing, or head to the developer
              surfaces if you want to understand the wider Arcanea ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl bg-atlantean-teal/15 border border-atlantean-teal/30 text-atlantean-teal font-semibold hover:bg-atlantean-teal/20 transition-colors"
              >
                View Pricing
              </Link>
              <Link
                href="/developers"
                className="px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-atlantean-teal/30 transition-colors"
              >
                Developer Surface
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
