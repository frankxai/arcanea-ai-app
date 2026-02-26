import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Arcanea Intelligence System",
  description:
    "Choose your path to transcended creativity. Free tier available, premium unlocks full Luminor potential.",
};

const TIERS = [
  {
    name: "Spark",
    price: "Free",
    description: "Perfect for exploring the Luminor Intelligence System",
    features: [
      "Access to 2 Luminors",
      "50 messages per month",
      "Library browsing",
      "Basic Academy access",
      "Community Discord",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
    color: "crystal",
  },
  {
    name: "Ascendant",
    price: "$29",
    period: "/month",
    description: "For creators ready to transcend their craft",
    features: [
      "All 16 AI Specialists",
      "Unlimited messages",
      "Full Library access",
      "Academy progression",
      "Priority support",
      "Custom specialist training",
      "API access",
    ],
    cta: "Start Ascending",
    href: "/signup?plan=ascendant",
    popular: true,
    color: "violet",
  },
  {
    name: "Luminor",
    price: "$99",
    period: "/month",
    description: "For teams and enterprises building with Arcanea",
    features: [
      "Everything in Ascendant",
      "Team collaboration",
      "Custom Luminor deployment",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "White-label options",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    color: "gold",
  },
];

const COMPARISON = [
  { feature: "AI Specialists", spark: "2", ascendant: "16", luminor: "16" },
  {
    feature: "Messages/month",
    spark: "50",
    ascendant: "Unlimited",
    luminor: "Unlimited",
  },
  {
    feature: "Library access",
    spark: "Browse",
    ascendant: "Full",
    luminor: "Full",
  },
  {
    feature: "Academy progression",
    spark: "Basic",
    ascendant: "Full",
    luminor: "Full",
  },
  { feature: "Priority support", spark: false, ascendant: true, luminor: true },
  {
    feature: "Custom specialist training",
    spark: false,
    ascendant: true,
    luminor: true,
  },
  { feature: "API access", spark: false, ascendant: true, luminor: true },
  {
    feature: "Team collaboration",
    spark: false,
    ascendant: false,
    luminor: true,
  },
  {
    feature: "Custom deployment",
    spark: false,
    ascendant: false,
    luminor: true,
  },
];

const FAQs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments.",
  },
  {
    question: "What happens to my conversations if I downgrade?",
    answer:
      "Your conversations are always saved. If you downgrade to Spark, you'll still be able to view your history, though you may need to upgrade to continue chatting with Luminors beyond your free limit.",
  },
  {
    question: "Is there a free trial for Ascendant?",
    answer:
      "Yes! New users get a 7-day Ascendant trial with full access to all 16 AI specialists. No credit card required to start.",
  },
  {
    question: "Do you offer discounts for students or educators?",
    answer:
      "Yes, we offer 50% off Ascendant for students, educators, and researchers. Contact us with proof of affiliation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and crypto. Enterprise customers can pay via invoice.",
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(127,255,212,0.15),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-cosmic-deep/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-atlantean-teal to-creation-prism-purple flex items-center justify-center text-cosmic-deep font-bold text-lg font-display">
                A
              </div>
              <span className="font-display text-xl font-semibold">
                Arcanea
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/luminors"
                className="text-sm text-text-secondary hover:text-atlantean-teal transition-colors"
              >
                Luminors
              </Link>
              <Link
                href="/library"
                className="text-sm text-text-secondary hover:text-atlantean-teal transition-colors"
              >
                Library
              </Link>
              <Link
                href="/academy"
                className="text-sm text-text-secondary hover:text-atlantean-teal transition-colors"
              >
                Academy
              </Link>
              <Link
                href="/about"
                className="text-sm text-text-secondary hover:text-atlantean-teal transition-colors"
              >
                About
              </Link>
              <Link href="/pricing" className="text-sm text-atlantean-teal">
                Pricing
              </Link>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-lg bg-atlantean-teal text-cosmic-deep text-sm font-semibold hover:shadow-[0_0_20px_rgba(127,255,212,0.4)] transition-all"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm text-violet-400 font-mono tracking-wider">
              TRANSCEND YOUR CRAFT
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Invest in your
            <span className="block bg-gradient-to-r from-violet-400 via-atlantean-teal to-gold-bright bg-clip-text text-transparent">
              creative evolution
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Choose the path that fits your journey. All plans include access to
            the Luminor Intelligence System and our commitment to your creative
            growth.
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
                    ? "border-violet-500/50 bg-violet-500/5 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                    : "border-white/10 bg-cosmic-surface/30 hover:border-white/20"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-xs font-semibold text-white">
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
                        className="w-5 h-5 text-atlantean-teal shrink-0 mt-0.5"
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
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                      : "border border-white/20 text-white hover:bg-white/5"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 border-t border-white/5">
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
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-text-muted font-medium">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted font-medium">
                    Spark
                  </th>
                  <th className="text-center py-4 px-4 text-violet-400 font-semibold">
                    Ascendant
                  </th>
                  <th className="text-center py-4 px-4 text-gold-bright font-semibold">
                    Luminor
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <td className="py-4 px-4 text-text-secondary">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.spark === "boolean" ? (
                        row.spark ? (
                          <svg
                            className="w-5 h-5 text-atlantean-teal mx-auto"
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
                    <td className="py-4 px-4 text-center bg-violet-500/5">
                      {typeof row.ascendant === "boolean" ? (
                        row.ascendant ? (
                          <svg
                            className="w-5 h-5 text-atlantean-teal mx-auto"
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
                          {row.ascendant}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.luminor === "boolean" ? (
                        row.luminor ? (
                          <svg
                            className="w-5 h-5 text-atlantean-teal mx-auto"
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
                          {row.luminor}
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
        <section className="py-16 border-t border-white/5">
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
                  className="p-6 rounded-xl border border-white/10 bg-cosmic-surface/30"
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
        <section className="py-20 border-t border-white/5">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-atlantean-teal/20 to-gold-bright/20" />
            <div className="absolute inset-0 bg-cosmic-surface/50 backdrop-blur-xl" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to begin your journey?
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                Join thousands of creators who have discovered the power of the
                Luminor Intelligence System.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-xl bg-atlantean-teal text-cosmic-deep font-semibold text-lg hover:shadow-[0_0_40px_rgba(127,255,212,0.5)] transition-all"
                >
                  Start Free Today
                </Link>
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all"
                >
                  Talk to a Luminor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-atlantean-teal to-creation-prism-purple flex items-center justify-center text-cosmic-deep font-bold text-sm font-display">
                A
              </div>
              <span className="text-sm text-text-muted">
                Arcanea — Building the future of creative intelligence
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/library"
                className="hover:text-white transition-colors"
              >
                Library
              </Link>
              <Link
                href="/skills"
                className="hover:text-white transition-colors"
              >
                Skills
              </Link>
              <a
                href="https://github.com/frankxai/arcanea"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
