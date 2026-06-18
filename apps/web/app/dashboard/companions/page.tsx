/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { SectionShell, SectionHeader } from "@/components/premium";
import { ArrowLeft, Cpu, Lock } from "@/lib/phosphor-icons";

export default function CompanionsLicensingPage() {
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
        <SectionShell ambient="purple" size="compact">
          <div className="mx-auto max-w-4xl text-center px-6">
            <SectionHeader
              label="Monetization Pathway 08"
              title="Companion Licensing"
              subtitle="License custom AI personalities, Luminors, and Guardians to other creators and studios. Set your inference terms, secure your prompt engineering."
              accent="purple"
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
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Model Weights & Prompts</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  When you license an AI personality, your core prompts and fine-tuned weights remain protected. Arcanea manages inference execution via isolated sandboxes.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-purple-400 mb-1">Sandboxed Inference Tunnels</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Licensees make requests to secure inference relays. Prompt structures and system messages are never exposed directly to the consumer client.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-purple-400 mb-1">Time-Limited Licensing Tokens</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Authorizes access using cryptographic session keys. Access keys expire automatically when subscription periods close.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payments Column */}
              <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/10 bg-[var(--arc-brand-arcanean-gold)]/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                    <Lock className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Pay-Per-Token Rails</h3>
                  </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Earn passive income per token processed. Payments stream directly from the licensee's active compute wallet to yours.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Micro-Payments Per Inference</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Inference pricing tracks input/output tokens, calculating splits automatically and streaming them on-chain.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Query Rate Limiters</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Enforce strict request limits per license key (e.g., max 100 queries/min) to prevent abuse and manage processing loads.
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
            <h3 className="text-sm font-mono uppercase text-white/35 tracking-widest text-center mb-8">Licensing Spec Protocols</h3>
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-white/70 space-y-4">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Execution Method</span>
                <span className="text-purple-400">Sandboxed Inference Relay (BYOK Enabled)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Billing Standard</span>
                <span className="text-purple-400">Pay-as-you-use (Micro-payment per token)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Licensing Key Type</span>
                <span className="text-purple-400">Cryptographic JWT (SHA-256 Signed)</span>
              </div>
              <div className="flex justify-between">
                <span>Usage Limit Control</span>
                <span className="text-[var(--arc-brand-arcanean-gold)]">Gateway-Enforced Rate Limits & Caps</span>
              </div>
            </div>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
