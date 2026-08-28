/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Arcanea, companions, pricing, and how it works.",
  openGraph: {
    title: "FAQ",
    description:
      "Frequently asked questions about Arcanea, companions, pricing, and how it works.",
  },
};

const FAQ_CATEGORIES = [
  {
    name: "Arcanea",
    icon: "✦",
    questions: [
      {
        q: "What is Arcanea?",
        a: "Arcanea is two connected experiences with a firm rights boundary: a protected story universe, and the Arcanea Connector for developing creator-owned worlds with AI. Starlight is the separate technical substrate beneath the creator tools.",
      },
      {
        q: "Is everything on Arcanea canon?",
        a: "No. Published canon, development canon, reference material, drafts, archives, and generated assets are different states. A work becomes released Arcanea canon only after its release record passes story, editorial, rights, production, and publication gates.",
      },
      {
        q: "Who are the current story leads?",
        a: "ARC-REL-001 is being developed around Arion, Mera, and Emilia, with the Ten Guardians and their Godbeasts as the saga spine. Kael remains legacy development ancestry rather than the public flagship.",
      },
      {
        q: "Is Dragonborne a released book?",
        a: "No. Dragonborne is the greenlit creative lane and an internal descriptor pending professional title clearance. The flagship working title is The Unchosen Bond, in The Godbeast Covenant saga. It is in development, not yet a released novel.",
      },
    ],
  },
  {
    name: "Creator Worlds",
    icon: "🌐",
    questions: [
      {
        q: "Who owns a world I build with the Arcanea Connector?",
        a: "You retain your rights in the original world and content you create, subject to the service terms and any third-party model or asset terms you choose. Using the Connector does not place your world inside Arcanea canon.",
      },
      {
        q: "Can I publish inside Arcanea?",
        a: "Not by default. Arcanea canon is curated and protected. Creator projects use separate namespaces and cannot use Arcanea characters, lore, visual identity, music, or trademarks unless Arcanea grants a specific written license.",
      },
      {
        q: "Are generated assets public automatically?",
        a: "No. New work should begin private and in draft status. Publication requires an explicit action, a rights and provenance record, and the release checks appropriate to the medium.",
      },
      {
        q: "Can the Connector help with images, music, video, books, and cinematic sites?",
        a: "That is the intended product direction. Individual capabilities may be preview, staged, or unavailable. The product interface and release records are authoritative; roadmap language is not a promise of current availability.",
      },
    ],
  },
  {
    name: "Product & Access",
    icon: "◇",
    questions: [
      {
        q: "How many creative specialists are configured?",
        a: "The current product configuration tracks 13 specialist roles. A configured role is not the same as a guaranteed model, autonomous agent, or generally available feature.",
      },
      {
        q: "What is included in each plan?",
        a: "Use the current pricing and checkout surfaces as the source of truth. Entitlements, limits, model availability, and prices can change; this FAQ intentionally does not duplicate them.",
      },
      {
        q: "Is there a stable public API or MCP server?",
        a: "The Developers and Protocol pages describe preview interfaces and evidence states. Treat an interface as stable only when its versioned documentation and release status explicitly say so.",
      },
      {
        q: "Can I self-host Arcanea?",
        a: "Do not assume so. Public repositories and packages are governed component by component. Their licenses do not include the hosted Arcanea product, protected canon, private production systems, or Arcanea trademarks.",
      },
    ],
  },
  {
    name: "Rights, AI & Security",
    icon: "⚖",
    questions: [
      {
        q: "Is Arcanea open source?",
        a: "That label is too broad. Some technical components may use open-source licenses; other repositories are source-available, private, archived, or unresolved. Arcanea canon and brand assets are All Rights Reserved. Always read the license in the specific repository and the content-rights notice.",
      },
      {
        q: "Does AI output automatically receive copyright protection?",
        a: "No universal promise can be made. Protection depends on jurisdiction and meaningful human authorship. Keep human creative decisions, edits, source records, permissions, and model receipts, and obtain legal advice for important releases.",
      },
      {
        q: "Is my data secure?",
        a: "Use the current Privacy, Terms, and security documentation as the governing statements. Never place passwords, API keys, unreleased deal terms, or other secrets in a creative prompt.",
      },
      {
        q: "Where do I report a rights or security issue?",
        a: "Use the contact and policy links published on arcanea.ai. A claim is not considered resolved until it has an owner, evidence, and a recorded disposition.",
      },
    ],
  },
];

export default function FAQPage() {
  const allQuestions = FAQ_CATEGORIES.flatMap((cat) => cat.questions);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(13,71,161,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-atlantean-teal/30 bg-atlantean-teal/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-atlantean-teal animate-pulse" />
            <span className="text-sm text-atlantean-teal font-mono tracking-wider">
              COMMON QUESTIONS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Frequently
            <span className="block bg-gradient-to-r from-atlantean-teal via-[var(--arc-brand-atlantean-teal)] to-gold-bright bg-clip-text text-transparent">
              Asked Questions
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Everything you need to know about Arcanea.
            Can't find the answer? Reach out to our support team.
          </p>
        </section>

        {/* Search */}
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

        {/* FAQ Categories */}
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

        {/* Still Have Questions */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/10 to-atlantean-teal/10 text-center">
            <h3 className="text-xl font-display font-semibold mb-2">
              Still have questions?
            </h3>
            <p className="text-text-secondary mb-6">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-atlantean-teal text-cosmic-deep font-semibold hover:shadow-[0_0_20px_rgba(0,188,212,0.4)] transition-all"
              >
                Contact Support
              </Link>
              <a
                href="https://discord.gg/arcanea"
                className="px-6 py-3 rounded-xl border border-white/[0.12] text-white font-semibold hover:bg-white/[0.04] transition-all"
              >
                Join Discord
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold mb-4">
              Explore More
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Companions",
                desc: "Meet the 13 companions across 5 teams",
                href: "/companions",
              },
              {
                title: "Library",
                desc: "Browse wisdom collections",
                href: "/library",
              },
              {
                title: "Academy",
                desc: "Start your progression",
                href: "/academy",
              },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="p-6 rounded-xl liquid-glass hover:border-atlantean-teal/30 transition-all"
              >
                <h3 className="font-display font-semibold mb-1">
                  {link.title}
                </h3>
                <p className="text-text-secondary text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
