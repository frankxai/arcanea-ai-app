/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m, useInView, LazyMotion, domAnimation } from "framer-motion";
import { useRef } from "react";
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
    name: "Open Core",
    description: "Public source and Library access",
    availability: "Available",
    featured: false,
    cta: "View Availability",
    href: "/pricing",
    features: [
      "Browse the public Library (20 collections)",
      "Read twenty-two draft works chapter by chapter",
      "Use the published open-core repositories",
    ],
    limits: ["Hosted usage quotas are not guaranteed"],
  },
  {
    name: "Cloud Sync",
    description: "Hosted access is not generally released",
    availability: "Waitlist",
    featured: true,
    cta: "Join Waitlist",
    href: "/pricing#waitlist",
    badge: "Waitlist",
    features: [
      "Cloud Sync remains waitlist-only",
      "Final quotas and entitlements are not published",
      "No SLA or support-time promise",
    ],
    limits: ["Confirm availability before production use"],
  },
  {
    name: "Studio Bench",
    description: "Team access is not generally released",
    availability: "Waitlist",
    featured: false,
    cta: "Join Waitlist",
    href: "/pricing#waitlist",
    features: [
      "Studio Bench remains waitlist-only",
      "Team, API, and analytics terms are not published",
      "No seat count or export entitlement is guaranteed",
    ],
    limits: ["Confirm availability before production use"],
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
              Access Preview
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Availability before promises
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            The public Library and open-core source are available now. Hosted
            tiers remain waitlist-only, with no published quota or SLA guarantee.
          </p>


        </m.div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => {
            const Icon = i === 0 ? PhLightning : i === 1 ? PhSparkle : PhCrown;

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

                {/* Availability */}
                <div className="mb-8">
                  <span className="text-4xl font-display font-bold">
                    {plan.availability}
                  </span>
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
            Hosted tiers remain waitlist-only. Verify availability before
            production use.
          </p>
          <Link
            href="/pricing#waitlist"
            className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:underline"
          >
            Join Waitlist
            <PhArrowRight className="w-4 h-4" />
          </Link>
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
