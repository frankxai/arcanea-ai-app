/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { SectionShell, SectionHeader } from "@/components/premium";
import { ArrowLeft, Lightning, Lock, Coins } from "@/lib/phosphor-icons";

export default function DropsPage() {
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
        <SectionShell ambient="fire" size="compact">
          <div className="mx-auto max-w-4xl text-center px-6">
            <SectionHeader
              label="Monetization Pathway 05"
              title="Token-Gated Drops"
              subtitle="Deliver exclusive lore chapters, sound packs, or models to your key token holders. Secured by wallet authorization and micro-payment routing."
              accent="gold"
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
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Authentication & Middleware</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Gating is validated natively at the Edge. Instead of slow DB queries, Arcanea uses cryptographic wallet signatures to authorize access in milliseconds.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-orange-400 mb-1">SIWE Middleware</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Sign-In with Ethereum (SIWE) validates ownership of tokens. The payload is cached at the edge to prevent repetitive signing prompts.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-orange-400 mb-1">RPC Node Verification</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Real-time calls query network smart contracts to verify minimum token thresholds (ERC-20, ERC-721, or ERC-1155) before rendering elements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agentic Payments Column */}
              <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/10 bg-[var(--arc-brand-arcanean-gold)]/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                    <Lightning className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">x402 Micro-Payments</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  For non-holders, Arcanea streams access using the experimental x402 payment protocol. Users pay infinitesimally small amounts per line read or second listened.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Pay-Per-Inference / Read</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Instead of high upfront payments, micro-payments stream automatically from user wallets using Lightning or EVM state channels.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Active Spend Limits</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Enforces cryptographic mandates defining active caps on spending. Restricts agent purchasing to strict allowed limits.
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
            <h3 className="text-sm font-mono uppercase text-white/35 tracking-widest text-center mb-8">Access Spec Protocols</h3>
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-white/70 space-y-4">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Auth Standard</span>
                <span className="text-orange-400">SIWE (EIP-4361)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Micro-Payments Channel</span>
                <span className="text-orange-400">x402 Micropayments Protocol</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Latency Gate</span>
                <span className="text-orange-400">&lt; 150ms Edge Validation</span>
              </div>
              <div className="flex justify-between">
                <span>Gating Support</span>
                <span className="text-[var(--arc-brand-arcanean-gold)]">ERC-20, ERC-721, ERC-1155</span>
              </div>
            </div>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
