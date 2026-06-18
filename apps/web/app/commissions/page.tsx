/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { SectionShell, SectionHeader } from "@/components/premium";
import { ArrowLeft, Coins, FileText, Scales } from "@/lib/phosphor-icons";

export default function CommissionsPage() {
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
              label="Monetization Pathway 06"
              title="Commissions Marketplace"
              subtitle="Secure custom world-building, character designs, or scores. Protected by smart contract escrow and verified by multi-agent consensus."
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
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <FileText className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Escrows & Briefs</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Our commissions flow eliminates payment disputes. Agreements are compiled into structured JSON briefs and locked on-chain.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-red-400 mb-1">On-Chain Escrow Locks</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Payments are locked in escrow contracts when commissions open. Funds release automatically when delivery milestones verify.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-red-400 mb-1">Milestone Verification APIs</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Integrates with GitHub commits, package versions, or asset uploads. APIs verify deliverables to trigger programmatic release.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agentic Payments Column */}
              <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/10 bg-[var(--arc-brand-arcanean-gold)]/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                    <Scales className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Dispute Resolution</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  If milestones are disputed, Arcanea invokes a multi-agent consensus network. Staking pools vote to verify outcomes.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">BFT Dispute Consensus</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Byzantine consensus mechanisms pool agent votes. Resolves delivery validation based on cryptographic proof and brief guidelines.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Staking Pool Verification</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Verifiers stake tokens to participate in dispute resolution, ensuring high alignment and honesty during review cycles.
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
            <h3 className="text-sm font-mono uppercase text-white/35 tracking-widest text-center mb-8">Marketplace Spec Protocols</h3>
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-white/70 space-y-4">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Escrow Type</span>
                <span className="text-red-400">On-Chain Vault Locked Smart Contract</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Consensus Threshold</span>
                <span className="text-red-400">2/3 Byzantine Agent Quorum</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Platform Take</span>
                <span className="text-red-400">12% (including escrow gas & transaction fees)</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution Time</span>
                <span className="text-[var(--arc-brand-arcanean-gold)]">&lt; 24h via automated stake votes</span>
              </div>
            </div>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
