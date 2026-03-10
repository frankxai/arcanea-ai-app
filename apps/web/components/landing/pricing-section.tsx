"use client";

import { m, useInView, LazyMotion, domAnimation } from "framer-motion";
import { useRef, useState } from "react";
import {
  PhCheck,
  PhSparkle,
  PhLightning,
  PhCrown,
  PhArrowRight,
} from '@/lib/phosphor-icons';
import Link from "next/link";

const PLANS = [
  {
    name: "Spark",
    description: "A real starting point, not a demo",
    price: { monthly: 0, yearly: 0 },
    featured: false,
    cta: "Start Free",
    href: "/auth/signup",
    features: [
      "3 Luminors — writing, research, brainstorming",
      "100 messages per month",
      "Browse the full Library (17 collections)",
      "Academy access through Gate 2",
      "Export to PDF",
    ],
    limits: ["Studio tools not included", "No custom prompts"],
  },
  {
    name: "Creator",
    description: "The full creative toolkit",
    price: { monthly: 19, yearly: 190 },
    featured: true,
    cta: "Upgrade",
    href: "/auth/signup?plan=creator",
    badge: "Most Popular",
    features: [
      "All 10 Luminors — writing, code, design, music, research",
      "5,000 messages per month",
      "Full Library with reading progress",
      "Academy progression through all 10 Gates",
      "The Studio — image, music, and code generation",
      "Custom prompt templates",
      "Direct support within 24 hours",
      "All export formats",
    ],
    limits: [],
  },
  {
    name: "Studio",
    description: "For teams and professional workflows",
    price: { monthly: 49, yearly: 490 },
    featured: false,
    cta: "Contact Us",
    href: "/contact",
    features: [
      "Everything in Creator",
      "5 team seats with shared workspace",
      "API access (REST + streaming)",
      "Train custom Luminors on your content",
      "Direct support within 4 hours",
      "Export without Arcanea branding",
      "Usage analytics dashboard",
    ],
    limits: [],
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(true);

  return (
    <LazyMotion features={domAnimation}>
    <section ref={ref} id="pricing" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-atlantean-teal-aqua/10 to-creation-prism-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-gold-bright/10 to-draconic-crimson/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-gold-bright/20 mb-6">
            <PhSparkle className="w-3.5 h-3.5 text-gold-bright" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Start free, upgrade when you're ready. All plans include core
            Arcanea features.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full liquid-glass border border-white/[0.06]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-white text-cosmic-deep"
                  : "text-text-muted hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? "bg-white text-cosmic-deep"
                  : "text-text-muted hover:text-white"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                Save 17%
              </span>
            </button>
          </div>
        </m.div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => {
            const Icon = i === 0 ? PhLightning : i === 1 ? PhSparkle : PhCrown;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const period = isYearly ? "/year" : "/month";

            return (
              <m.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={`relative rounded-3xl p-8 ${
                  plan.featured
                    ? "bg-gradient-to-b from-atlantean-teal-aqua/20 to-cosmic-surface/50 border-2 border-atlantean-teal-aqua/30 scale-105 lg:scale-110"
                    : "liquid-glass border border-white/[0.06]"
                }`}
              >
                {/* Featured badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-atlantean-teal-aqua text-cosmic-deep text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-8">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.featured ? "bg-atlantean-teal-aqua/20" : "bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        plan.featured
                          ? "text-atlantean-teal-aqua"
                          : "text-white"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-text-secondary">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-bold">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-text-muted">{period}</span>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-sm text-text-muted mt-2">
                      ${Math.round(price / 12)}/month billed annually
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all mb-8 ${
                    plan.featured
                      ? "bg-atlantean-teal-aqua text-cosmic-deep hover:bg-atlantean-teal-aqua/90"
                      : "bg-white/[0.06] text-white hover:bg-white/[0.12]"
                  }`}
                >
                  {plan.cta}
                  <PhArrowRight className="w-4 h-4" />
                </Link>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.featured
                            ? "bg-atlantean-teal-aqua/20 text-atlantean-teal-aqua"
                            : "bg-white/[0.06] text-white"
                        }`}
                      >
                        <PhCheck className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-text-secondary">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.limits.map((limit) => (
                    <div
                      key={limit}
                      className="flex items-start gap-3 opacity-50"
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/[0.04]">
                        <span className="w-2 h-0.5 bg-text-muted rounded-full" />
                      </div>
                      <span className="text-sm text-text-muted">{limit}</span>
                    </div>
                  ))}
                </div>
              </m.div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-text-muted mb-4">
            Need more than 5 seats or custom integrations?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:underline"
          >
            Contact Us
            <PhArrowRight className="w-4 h-4" />
          </Link>
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
