import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Create with Credits or Go Unlimited",
  description:
    "Start free with the Library and 5 daily credits. Buy credit packs for pay-per-creation, or go unlimited with Forge at $29/mo. Images, music, stories — full commercial rights.",
  openGraph: {
    title: "Pricing — Create with Credits or Go Unlimited",
    description:
      "Start free. Buy credits when you need them. Go unlimited with Forge. Images, music, stories, worlds — full commercial rights on everything you create.",
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

// ─── Tier Data ────────────────────────────────────────────────────────────────

const CREDIT_PACKS = [
  { credits: 50, price: 5, perCredit: "0.10" },
  { credits: 250, price: 19, perCredit: "0.076", popular: true },
  { credits: 750, price: 49, perCredit: "0.065", savings: "35%" },
];

const TIERS = [
  {
    id: "free",
    name: "The Library",
    tagline: "Free",
    price: "Free",
    subtitle: "Forever",
    description: "A real starting point for every creator",
    features: [
      "Chat with Lumina (unlimited)",
      "Explore the Library (200K+ words)",
      "5 free credits per day to try creation",
      "All open-source tools (skills, CLIs, MCP servers)",
      "Community access",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    popular: false,
    accent: "crystal" as const,
  },
  {
    id: "credits",
    name: "Credits",
    tagline: "Pay Per Creation",
    price: "From $5",
    subtitle: "No subscription",
    description: "Buy what you need, create when you want",
    features: [
      "No subscription required",
      "1 credit = 1 image generation",
      "1 credit = 1 music track",
      "1 credit = 1 story chapter",
      "Credits never expire",
      "Full commercial rights on everything",
    ],
    cta: "Buy Credits",
    href: "/auth/signup?plan=credits",
    popular: false,
    accent: "teal" as const,
  },
  {
    id: "forge",
    name: "Forge",
    tagline: "Unlimited Creation",
    price: "$29",
    period: "/mo",
    description: "Unlimited creation for serious builders",
    features: [
      "Unlimited image generation",
      "Unlimited music composition",
      "Unlimited story and lore generation",
      "Priority GPU queue",
      "Custom Guardian configurations",
      "Early access to new features",
      "Full commercial rights",
    ],
    cta: "Start Forging",
    href: "/auth/signup?plan=forge",
    popular: true,
    accent: "gold" as const,
  },
];

const FAQs = [
  {
    question: "What can I create?",
    answer:
      "Images, music, stories, characters, worlds, and more. Every creation tool in Arcanea works with credits or the Forge unlimited plan. The AI generates original content based on your prompts, guided by the Arcanean creative framework.",
  },
  {
    question: "Do credits expire?",
    answer:
      "No, never. Credits you purchase are yours permanently. Use them whenever inspiration strikes — there is no expiration date, no monthly reset, no pressure.",
  },
  {
    question: "Can I sell what I create?",
    answer:
      "Yes. Everything you create on a paid tier (Credits or Forge) comes with full commercial rights. Use your creations in books, games, merchandise, NFTs, client work — anything you want. Free tier creations are for personal use.",
  },
  {
    question: "What is open source?",
    answer:
      "Arcanea has a developer ecosystem with public tooling, packages, and integrations, but the main pricing on this page is for the creator platform experience. Think of the open tooling as the build layer and arcanea.ai as the creator-facing product layer.",
  },
  {
    question: "Can I switch between Credits and Forge?",
    answer:
      "Absolutely. Start with credits to try things out. Upgrade to Forge when you are creating regularly. Downgrade anytime — your unused credits stay in your account and your creations are always accessible.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "All major credit cards, Apple Pay, Google Pay, and PayPal. Credit packs are one-time purchases. Forge is a monthly subscription you can cancel anytime.",
  },
];

// ─── SVG Icon Helpers ─────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function CreditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arcanea Pricing",
    url: "https://arcanea.ai/pricing",
    mainEntity: [
      {
        "@type": "Product",
        name: "Arcanea Free — The Library",
        description: "A real starting point for every creator",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        name: "Arcanea Credits",
        description: "Pay-per-creation credit packs",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "5",
          highPrice: "49",
          priceCurrency: "USD",
          offerCount: "3",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        name: "Arcanea Forge — Unlimited Creation",
        description: "Unlimited creation for serious builders",
        offers: {
          "@type": "Offer",
          price: "29",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    ],
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
            <span className="text-sm text-[#00bcd4] font-mono tracking-wider">
              PAY FOR WHAT YOU CREATE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Create freely.
            <span className="block bg-gradient-to-r from-[#00bcd4] via-[#7fffd4] to-[#ffd700] bg-clip-text text-transparent">
              Pay fairly.
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
            Start free with the Library. Buy credits when you need them.
            <br className="hidden md:block" />
            Go unlimited when you are ready.
          </p>

          <p className="text-sm text-text-muted">
            No credit card required to start. Credits never expire. Cancel
            anytime.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {TIERS.map((tier) => {
              const isForge = tier.id === "forge";
              const isCredits = tier.id === "credits";

              return (
                <div
                  key={tier.id}
                  className={`relative p-8 rounded-2xl border backdrop-blur-xl transition-all hover:scale-[1.02] ${
                    isForge
                      ? "border-[#ffd700]/50 bg-[#ffd700]/[0.03] shadow-[0_0_60px_rgba(255,215,0,0.12),0_0_120px_rgba(255,215,0,0.06)]"
                      : isCredits
                        ? "border-[#00bcd4]/30 bg-[#00bcd4]/[0.03] hover:border-[#00bcd4]/40"
                        : "liquid-glass hover:border-white/[0.12]"
                  }`}
                >
                  {/* Recommended badge */}
                  {isForge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-xs font-semibold text-[#09090b]">
                      Recommended
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <p className="text-xs font-mono tracking-wider text-text-muted uppercase mb-2">
                      {tier.tagline}
                    </p>
                    <h3 className="text-2xl font-display font-bold mb-1">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-display font-bold ${
                          isForge
                            ? "bg-gradient-to-r from-[#ffd700] to-[#ffaa00] bg-clip-text text-transparent"
                            : ""
                        }`}
                      >
                        {tier.price}
                      </span>
                      {"period" in tier && tier.period && (
                        <span className="text-text-muted text-sm">
                          {tier.period}
                        </span>
                      )}
                      {"subtitle" in tier && tier.subtitle && !tier.period && (
                        <span className="text-text-muted text-sm ml-1">
                          {tier.subtitle}
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mt-2">
                      {tier.description}
                    </p>
                  </div>

                  {/* Credit Packs (only for Credits tier) */}
                  {isCredits && (
                    <div className="mb-6 space-y-2">
                      {CREDIT_PACKS.map((pack) => (
                        <div
                          key={pack.credits}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                            pack.popular
                              ? "border-[#00bcd4]/40 bg-[#00bcd4]/10"
                              : "border-white/[0.06] hover:border-white/[0.12]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold">
                              {pack.credits}
                            </span>
                            <span className="text-text-muted text-sm">
                              credits
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">${pack.price}</span>
                            {pack.savings && (
                              <span className="ml-2 text-xs text-[#00bcd4] font-mono">
                                Save {pack.savings}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckIcon
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            isForge ? "text-[#ffd700]" : "text-[#00bcd4]"
                          }`}
                        />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={tier.href}
                    className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${
                      isForge
                        ? "bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-[#09090b] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
                        : isCredits
                          ? "bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white hover:shadow-[0_0_30px_rgba(0,188,212,0.4)]"
                          : "border border-white/[0.12] text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* How Credits Work */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                How Credits Work
              </h2>
              <p className="text-text-secondary">
                One credit, one creation. Simple as that.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Image",
                  desc: "Generate one original image from a prompt",
                  cost: "1 credit",
                },
                {
                  label: "Music",
                  desc: "Compose one original music track",
                  cost: "1 credit",
                },
                {
                  label: "Story",
                  desc: "Generate one story chapter or lore entry",
                  cost: "1 credit",
                },
                {
                  label: "Character",
                  desc: "Create a character with art and backstory",
                  cost: "1 credit",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-xl liquid-glass text-center"
                >
                  <h4 className="font-display font-semibold text-lg mb-2">
                    {item.label}
                  </h4>
                  <p className="text-text-muted text-sm mb-3">{item.desc}</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#00bcd4]/10 text-[#00bcd4] text-xs font-mono">
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-10">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-text-muted font-mono tracking-wide">
            <span className="flex items-center gap-2">
              <CreditIcon className="w-4 h-4 text-[#00bcd4]" />
              Credits never expire
            </span>
            <span className="flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-[#00bcd4]" />
              Full commercial rights
            </span>
            <span className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-[#00bcd4]" />
              No credit card to start
            </span>
            <span className="flex items-center gap-2">
              <LockIcon className="w-4 h-4 text-[#00bcd4]" />
              Your creations stay yours
            </span>
            <span className="flex items-center gap-2">
              <CodeIcon className="w-4 h-4 text-[#00bcd4]" />
              100% open-source tools
            </span>
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
                    Free
                  </th>
                  <th className="text-center py-4 px-4 text-[#00bcd4] font-semibold">
                    Credits
                  </th>
                  <th className="text-center py-4 px-4 text-[#ffd700] font-semibold">
                    Forge
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Chat with Lumina",
                    free: "Unlimited",
                    credits: "Unlimited",
                    forge: "Unlimited",
                  },
                  {
                    feature: "Library access",
                    free: "Full (200K+ words)",
                    credits: "Full (200K+ words)",
                    forge: "Full (200K+ words)",
                  },
                  {
                    feature: "Image generation",
                    free: "5/day",
                    credits: "Per credit",
                    forge: "Unlimited",
                  },
                  {
                    feature: "Music composition",
                    free: "5/day",
                    credits: "Per credit",
                    forge: "Unlimited",
                  },
                  {
                    feature: "Story generation",
                    free: "5/day",
                    credits: "Per credit",
                    forge: "Unlimited",
                  },
                  {
                    feature: "Open-source tools",
                    free: true,
                    credits: true,
                    forge: true,
                  },
                  {
                    feature: "Commercial rights",
                    free: false,
                    credits: true,
                    forge: true,
                  },
                  {
                    feature: "Priority GPU queue",
                    free: false,
                    credits: false,
                    forge: true,
                  },
                  {
                    feature: "Custom Guardian configs",
                    free: false,
                    credits: false,
                    forge: true,
                  },
                  {
                    feature: "Early access to features",
                    free: false,
                    credits: false,
                    forge: true,
                  },
                ].map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-white/[0.04]"
                  >
                    <td className="py-4 px-4 text-text-secondary">
                      {row.feature}
                    </td>
                    {(["free", "credits", "forge"] as const).map((col) => {
                      const val = row[col];
                      const isForgeCol = col === "forge";
                      return (
                        <td
                          key={col}
                          className={`py-4 px-4 text-center ${
                            isForgeCol ? "bg-[#ffd700]/[0.03]" : ""
                          }`}
                        >
                          {typeof val === "boolean" ? (
                            val ? (
                              <CheckIcon
                                className={`w-5 h-5 mx-auto ${
                                  isForgeCol
                                    ? "text-[#ffd700]"
                                    : "text-[#00bcd4]"
                                }`}
                              />
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
                            <span
                              className={`text-text-secondary ${
                                isForgeCol ? "font-medium" : ""
                              }`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
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
                <div key={i} className="p-6 rounded-xl liquid-glass">
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
                200K+ words of creative philosophy. AI-powered image, music, and
                story generation. A community of world-builders. Start free
                today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-[#09090b] font-semibold text-lg hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-all"
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
