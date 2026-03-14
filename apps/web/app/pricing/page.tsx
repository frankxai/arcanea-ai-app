import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Simple. Start Free.",
  description:
    "Simple pricing for Arcanea. Start free with no credit card required. Upgrade to Creator ($19/mo) for the full creative toolkit — all companions, the Library, the Studio, and Academy progression.",
  openGraph: {
    title: "Pricing — Simple. Start Free.",
    description: "Start free, no credit card required. Upgrade anytime. Creator $19/mo unlocks the full creative toolkit — companions, worlds, Studio, and Academy.",
    type: "website",
  },
};

const TIERS = [
  {
    name: "Spark",
    price: "Free",
    description: "A real starting point, not a demo",
    features: [
      "3 companions — writing, research, and brainstorming",
      "100 messages per month",
      "Browse the full Library (17 collections)",
      "Academy access through Gate 2",
      "Community Discord",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    popular: false,
    color: "crystal",
  },
  {
    name: "Creator",
    price: "$19",
    period: "/month",
    description: "The full creative toolkit",
    features: [
      "All 16 companions — writing, code, design, music, research, and more",
      "5,000 messages per month",
      "Full Library access with reading progress",
      "Academy progression through all 10 Gates",
      "The Studio — image, music, and code generation",
      "Custom prompt templates",
      "Direct support within 24 hours",
    ],
    cta: "Upgrade",
    href: "/auth/signup?plan=creator",
    popular: true,
    color: "violet",
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    description: "For teams and professional workflows",
    features: [
      "Everything in Creator",
      "5 team seats with shared workspace",
      "API access (REST + streaming)",
      "Train custom companions on your content",
      "Direct support within 4 hours",
      "Export without Arcanea branding",
      "Usage analytics dashboard",
    ],
    cta: "Contact Us",
    href: "/contact",
    popular: false,
    color: "gold",
  },
];

const COMPARISON = [
  { feature: "Companions", spark: "3", creator: "All 16", studio: "All 16" },
  {
    feature: "Messages/month",
    spark: "100",
    creator: "5,000",
    studio: "5,000 per seat",
  },
  {
    feature: "Library access",
    spark: "Browse",
    creator: "Full + progress tracking",
    studio: "Full + progress tracking",
  },
  {
    feature: "Academy Gates",
    spark: "1-2",
    creator: "All 10",
    studio: "All 10",
  },
  {
    feature: "The Studio (image, music, code)",
    spark: false,
    creator: true,
    studio: true,
  },
  {
    feature: "Custom prompt templates",
    spark: false,
    creator: true,
    studio: true,
  },
  { feature: "API access", spark: false, creator: false, studio: true },
  {
    feature: "Team seats",
    spark: false,
    creator: false,
    studio: "5 included",
  },
  {
    feature: "Custom companion training",
    spark: false,
    creator: false,
    studio: true,
  },
];

const FAQs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, always. Cancel from your account settings with one click. No questions asked, no cancellation fees. Your data stays accessible on the Spark free tier.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Spark plan is completely free and requires no payment information. You only need a credit card when you choose to upgrade to Creator or Studio.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. Upgrade or downgrade anytime from your settings. Changes take effect immediately, and payments are prorated.",
  },
  {
    question: "What happens to my work if I downgrade?",
    answer:
      "Your conversations, creations, and Library progress are always kept. On Spark you can view everything but are limited to 3 companions and 100 messages.",
  },
  {
    question: "Is there a free trial for Creator?",
    answer:
      "New users get a 7-day Creator trial with all 16 companions. No credit card required.",
  },
  {
    question: "Do you offer student or educator pricing?",
    answer:
      "Yes. 50% off Creator for students, educators, and researchers. Contact us with proof of affiliation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "All major credit cards and PayPal. Studio customers can pay via invoice.",
  },
];

export default function PricingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Arcanea Pricing',
    url: 'https://arcanea.ai/pricing',
    mainEntity: TIERS.map((tier) => ({
      '@type': 'Product',
      name: `Arcanea ${tier.name}`,
      description: tier.description,
      offers: {
        '@type': 'Offer',
        price: tier.price === 'Free' ? '0' : tier.price.replace('$', ''),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    })),
  };

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(13,71,161,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,188,212,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
            <span className="text-sm text-[#00bcd4] font-mono tracking-wider">
              CREATIVE COMPANIONS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Simple pricing.
            <span className="block bg-gradient-to-r from-[#00bcd4] via-[#0d47a1] to-[#ffd700] bg-clip-text text-transparent">
              Start free.
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
            Choose the plan that fits your work.
            Every plan includes companions, the Library, and the Academy.
          </p>

          <p className="text-sm text-text-muted">
            No credit card required to start. Cancel anytime.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-8 rounded-2xl border backdrop-blur-xl transition-all hover:scale-[1.02] ${
                  tier.popular
                    ? "border-[#00bcd4]/50 bg-[#00bcd4]/5 shadow-[0_0_40px_rgba(0,188,212,0.15)]"
                    : "liquid-glass hover:border-white/[0.12]"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-text-muted text-sm">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm mt-2">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <svg
                        className="w-5 h-5 text-[#00bcd4] shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${
                    tier.popular
                      ? "bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white hover:shadow-[0_0_30px_rgba(0,188,212,0.4)]"
                      : "border border-white/[0.12] text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Compare Plans
            </h2>
            <p className="text-text-secondary">
              See exactly what you get at each tier
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 px-4 text-text-muted font-medium">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted font-medium">
                    Spark
                  </th>
                  <th className="text-center py-4 px-4 text-[#00bcd4] font-semibold">
                    Creator
                  </th>
                  <th className="text-center py-4 px-4 text-[#ffd700] font-semibold">
                    Studio
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className="border-b border-white/[0.04]">
                    <td className="py-4 px-4 text-text-secondary">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.spark === "boolean" ? (
                        row.spark ? (
                          <svg
                            className="w-5 h-5 text-[#00bcd4] mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-text-muted mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )
                      ) : (
                        <span className="text-text-secondary">{row.spark}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-[#00bcd4]/5">
                      {typeof row.creator === "boolean" ? (
                        row.creator ? (
                          <svg
                            className="w-5 h-5 text-[#00bcd4] mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-text-muted mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )
                      ) : (
                        <span className="text-text-secondary font-medium">
                          {row.creator}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.studio === "boolean" ? (
                        row.studio ? (
                          <svg
                            className="w-5 h-5 text-[#00bcd4] mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-text-muted mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )
                      ) : (
                        <span className="text-text-secondary">
                          {row.studio}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-secondary">Everything you need to know</p>
            </div>

            <div className="space-y-4">
              {FAQs.map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl liquid-glass"
                >
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#00bcd4]/20 via-[#0d47a1]/20 to-[#ffd700]/20" />
            <div className="absolute inset-0 liquid-glass" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to start creating?
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                Creative partners. A Library of 200K+ words. Tools for building worlds, stories, music, and code.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 rounded-xl bg-[#00bcd4] text-[#09090b] font-semibold text-lg hover:shadow-[0_0_40px_rgba(0,188,212,0.5)] transition-all"
                >
                  Start Free Today
                </Link>
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-xl border border-white/[0.12] text-white font-semibold text-lg hover:bg-white/[0.04] transition-all"
                >
                  Try the Chat
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
