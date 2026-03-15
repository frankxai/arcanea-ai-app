import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Arcanea, companions, pricing, and how it works.",
};

const FAQ_CATEGORIES = [
  {
    name: "Getting Started",
    icon: "🚀",
    questions: [
      {
        q: "What is Arcanea?",
        a: "Arcanea is a creative multiverse — a living ecosystem where you chat with AI, build fantasy worlds, share what you make, and turn imagination into products. It includes creative partners across development, design, writing, and research, a Library of 200K+ words of creative philosophy, an Academy for world-building, and a Studio for generating art, music, and code.",
      },
      {
        q: "How do I get started?",
        a: "Simply create a free account at arcanea.ai. You'll immediately have access to 3 companions and 100 messages per month. From there, you can explore the Library, start Academy training, or upgrade for access to the full creative team.",
      },
      {
        q: "How are Arcanea's companions different from regular AI?",
        a: "Arcanea is not just a chat interface — it is a creative framework. The companions are domain-specialized creative partners, but they are one layer of a six-layer ecosystem that also includes world-building tools, a social feed, an open-source foundation, a learning Academy, and a community of co-creators.",
      },
      {
        q: "What are the Seven Wisdoms?",
        a: "The Seven Wisdoms are practical mental models for creative work: Sophron (Structure), Kardia (Heart), Valora (Courage), Eudaira (Play), Orakis (Vision), Poiesis (Creation), and Enduran (Endurance). Every companion applies these lenses when approaching your work, giving you proven frameworks for any creative challenge.",
      },
    ],
  },
  {
    name: "Companions",
    icon: "🌟",
    questions: [
      {
        q: "How many companions are there?",
        a: "There are 16 companions organized into 4 teams: Development, Creative, Writing, and Research. Each has a distinct philosophy, expertise, and conversational style. You can explore them all on the Companions page.",
      },
      {
        q: "Which companion should I use?",
        a: "It depends on your creative challenge. Need to architect a system? Start with System Architect. Writing a story? Try Narrative Architect. Need research? Deep Analyst or Knowledge Keeper. You can also chat with multiple companions and let them collaborate on complex projects.",
      },
      {
        q: "Can companions work together?",
        a: "Yes. One of Arcanea's most powerful features is multi-companion collaboration. You can bring in different domain experts for different aspects of a project, or have them review and enhance each other's work. The system is designed for this kind of creative collaboration.",
      },
      {
        q: "How do companions learn and improve?",
        a: "Companions improve through the SONA learning system, which records trajectories of successful creative sessions and identifies patterns that lead to better outcomes. They also learn from your feedback — every interaction helps them better understand your creative style and preferences.",
      },
    ],
  },
  {
    name: "Pricing & Plans",
    icon: "💎",
    questions: [
      {
        q: "What's included in the free plan?",
        a: "The Spark (free) plan includes 3 creative companions, 100 messages per month, full Library access, and Gallery browsing. It's everything you need to explore the platform and see if Arcanea fits your creative workflow.",
      },
      {
        q: "What do the paid plans include?",
        a: "The Creator plan ($19/month) unlocks all creative partners with 5,000 messages per month, full Studio creation tools, complete Academy access, and custom prompt templates. The Studio plan ($49/month) adds API access, priority support, custom partner training, and team collaboration features.",
      },
      {
        q: "Can I switch plans later?",
        a: "Yes. You can upgrade or downgrade at any time. Changes take effect immediately, and we prorate any payments. Your conversations and progress are always preserved.",
      },
      {
        q: "Do you offer team or enterprise plans?",
        a: "Yes. The enterprise plan ($99/month) includes team collaboration, custom companion deployment, dedicated support, SLA guarantees, custom integrations, and white-label options. Contact us for custom solutions.",
      },
    ],
  },
  {
    name: "Technical",
    icon: "⚙️",
    questions: [
      {
        q: "What technologies power Arcanea?",
        a: "Arcanea is built on a modern stack: Next.js 16 for the frontend, TypeScript throughout, Supabase for data, and Vercel AI SDK for AI integration. The platform uses advanced consensus algorithms, vector search, and reinforcement learning for the intelligence layer.",
      },
      {
        q: "Is my data secure?",
        a: "Security is paramount. All conversations are encrypted at rest and in transit. We never use your conversations to train public models. Your creative work remains yours, and you can delete it at any time.",
      },
      {
        q: "Can I use Arcanea via API?",
        a: "Yes. Studio and Enterprise plans include API access. You can integrate Arcanea's companions into your own applications, workflows, and tools. See the Developers page for details.",
      },
      {
        q: "Do you offer self-hosting?",
        a: "Arcanea is available as a CLI tool that you can run locally. Enterprise customers can also explore custom deployment options. Contact us for details.",
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
            <span className="block bg-gradient-to-r from-atlantean-teal via-[#00bcd4] to-gold-bright bg-clip-text text-transparent">
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
          <div className="p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#00bcd4]/10 to-atlantean-teal/10 text-center">
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
                desc: "Meet the 16 companions across 4 teams",
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
