/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { PhCheck, PhSparkle, PhArrowRight } from '@/lib/phosphor-icons';
import Link from "next/link";

const plans = [
  {
    name: "Open Core",
    price: "Available",
    description: "Public source and Library access",
    features: [
      "Browse the public Library (20 collections)",
      "Read twenty-two draft works chapter by chapter",
      "Use the published open-core repositories",
      "Hosted usage quotas are not guaranteed",
    ],
    cta: "View Availability",
    href: "/pricing",
    popular: false,
  },
  {
    name: "Cloud Sync",
    price: "Waitlist",
    description: "Hosted access is not generally released",
    features: [
      "Cloud Sync remains waitlist-only",
      "Final quotas and entitlements are not published",
      "No SLA or support-time promise",
      "Confirm availability before production use",
    ],
    cta: "Join Waitlist",
    href: "/pricing#waitlist",
    popular: false,
  },
  {
    name: "Studio Bench",
    price: "Waitlist",
    description: "Team access is not generally released",
    features: [
      "Studio Bench remains waitlist-only",
      "Team, API, and analytics terms are not published",
      "No seat count or export entitlement is guaranteed",
      "Confirm availability before production use",
    ],
    cta: "Join Waitlist",
    href: "/pricing#waitlist",
    popular: false,
  },
];

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${plan.popular ? "md:-mt-4" : ""}`}
    >
      {/* Glow effect for popular */}
      {plan.popular && (
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-crystal via-brand-primary to-crystal opacity-50 blur-xl" />
      )}

      <div
        className={`relative h-full p-8 rounded-3xl border transition-all duration-300 ${
          plan.popular
            ? "liquid-glass border-crystal/30 bg-cosmic-deep/90"
            : "liquid-glass border-white/[0.06] hover:border-white/[0.12]"
        }`}
      >
        {/* Popular badge */}
        {plan.popular && (
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-crystal to-brand-primary text-cosmic-deep font-bold text-sm"
          >
            <PhSparkle className="w-4 h-4 inline mr-1" />
            Most Popular
          </m.div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-display font-bold mb-2">{plan.name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-4xl font-display font-bold ${plan.popular ? "text-gradient-crystal" : ""}`}
            >
              {plan.price}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-2">{plan.description}</p>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, i) => (
            <m.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start gap-3"
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  plan.popular ? "bg-crystal/20" : "bg-white/[0.04]"
                }`}
              >
                <PhCheck
                  className={`w-3 h-3 ${plan.popular ? "text-crystal" : "text-text-muted"}`}
                />
              </div>
              <span className="text-sm text-text-secondary">{feature}</span>
            </m.li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={plan.href}
          className={`block w-full py-4 rounded-2xl text-center font-display font-semibold transition-all ${
            plan.popular
              ? "bg-gradient-to-r from-crystal to-brand-primary text-cosmic-deep hover:shadow-glow-md"
              : "liquid-glass border border-white/[0.06] hover:border-crystal/30 text-text-primary"
          }`}
        >
          {plan.cta}
          <PhArrowRight className="inline ml-2 w-4 h-4" />
        </Link>
      </div>
    </m.div>
  );
}

export function PricingPremium() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <LazyMotion features={domAnimation}>
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />

        {/* Animated gradient orbs */}
        <m.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,188,212,0.1) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <m.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(13,71,161,0.1) 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <m.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full liquid-glass border border-brand-primary/20 text-brand-primary font-medium text-sm mb-6"
          >
            Access Preview
          </m.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Open Now, Hosted Later
            <br />
            <span className="text-gradient-brand">Availability Before Promises</span>
          </h2>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            The public Library and open-core source are available now. Hosted
            tiers remain waitlist-only, with no published quota or SLA guarantee.
          </p>
        </m.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Bottom note */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-text-muted"
        >
          <p>
            Hosted tiers remain waitlist-only. Verify current availability before
            relying on Arcanea for production workloads.
          </p>
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
