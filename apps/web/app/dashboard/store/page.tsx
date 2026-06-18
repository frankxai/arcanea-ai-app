/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { SectionShell, SectionHeader } from "@/components/premium";
import { ArrowLeft, Buildings, Share } from "@/lib/phosphor-icons";

export default function StorefrontPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white font-sans">
        
        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <Link href="/creator-economy" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Creator Economy
          </Link>
        </div>

        {/* Hero */}
        <SectionShell ambient="teal" size="compact">
          <div className="mx-auto max-w-4xl text-center px-6">
            <SectionHeader
              label="Monetization Pathway 07"
              title="Direct Storefront"
              subtitle="Sell courses, sound packs, ebooks, and assets directly to your audience. Integrated with Stripe and boosted by autonomous AI affiliates."
              accent="teal"
            />
          </div>
        </SectionShell>

        {/* Deep Dive Grid */}
        <SectionShell ambient="teal" size="compact" className="-mt-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Engineering Column */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 flex items-center justify-center border border-[var(--arc-brand-atlantean-teal)]/20">
                    <Buildings className="w-5 h-5 text-[var(--arc-brand-atlantean-teal)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Stripe & ACP Integrations</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Your storefront operates directly on your domain with zero forced platform branding, linking directly to your payment endpoints.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-atlantean-teal)] mb-1">Agentic Commerce Protocol (ACP)</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      ACP provides a unified JSON payload standard for checkouts, allowing AI search and shopping agents to purchase items on behalf of users securely.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-atlantean-teal)] mb-1">Signed Expiring CDN Downloads</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Digital assets are served via secure CDN tunnels. Expiring tokens prevent link sharing while ensuring high-speed global delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Affiliate Column */}
              <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/10 bg-[var(--arc-brand-arcanean-gold)]/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                    <Share className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Autonomous AI Affiliates</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Harness AI agents as affiliate promoters. The protocol handles tracking, attribution, and split payments on the fly.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Cryptographic URL Payloads</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Referral tracking codes are cryptographically signed, preventing fraud and ensuring exact payout mapping for referral creators.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Instant Revenue Splits</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Affiliate splits are computed at the payment gateway level, routing referral shares instantly rather than holding funds for weeks.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </SectionShell>

        {/* Technical Specification Protocol */}
        <SectionShell ambient="none" size="compact" className="-mt-12 mb-20">
          <div className="mx-auto max-w-3xl px-6">
            <h3 className="text-sm font-mono uppercase text-white/35 tracking-widest text-center mb-8">Storefront Spec Protocols</h3>
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-white/70 space-y-4">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Payment Gateways</span>
                <span className="text-[var(--arc-brand-atlantean-teal)]">Stripe Connect / Coinbase Commerce</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>API Standard</span>
                <span className="text-[var(--arc-brand-atlantean-teal)]">ACP (Agentic Commerce Protocol) v0.8</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Affiliate Splits</span>
                <span className="text-[var(--arc-brand-atlantean-teal)]">Instant, Gateway-Enforced</span>
              </div>
              <div className="flex justify-between">
                <span>Asset Storage</span>
                <span className="text-[var(--arc-brand-arcanean-gold)]">Decentralized Secure CDN (Expiring Tokens)</span>
              </div>
            </div>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
