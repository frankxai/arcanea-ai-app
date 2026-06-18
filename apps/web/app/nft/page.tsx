/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { SectionShell, SectionHeader } from "@/components/premium";
import { ArrowLeft, Sparkle, Coins, Database, Shield } from "@/lib/phosphor-icons";

export default function NftPage() {
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
              label="Monetization Pathway 03"
              title="On-Chain Creative Identity"
              subtitle="The Arcanea 1,111 Creators Collection. An evolving on-chain identity that unlocks secondary royalties, verified co-creations, and dynamic reputation-based metadata."
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
                    <Database className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Smart Contracts & Metadata</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Every creator's NFT represents an active node in our reputation index. The metadata isn't static; it evolves dynamically on L2.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-purple-400 mb-1">Dynamic SVG On-Chain Rendering</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      NFT vector graphics are rendered and stored on-chain. As you publish books or build worlds, contract data updates your token's attributes dynamically.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-purple-400 mb-1">ERC-2981 Royalty Standard</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Native compliance with the royalty standard deposits secondary marketplace splits (2.5%) directly to your cryptographic wallet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agentic Payments Column */}
              <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/10 bg-[var(--arc-brand-arcanean-gold)]/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                    <Shield className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Consensus & Treasury</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Co-creation teams and shared pools are managed via the Agentic Payments Protocol (AP2), protecting project treasuries with decentralized rules.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Byzantine Consensus Rules</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      High-value treasury actions require verification signatures from multiple designated co-agents (e.g., 2-out-of-3 consensus) to execute.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Ed25519 Signed Mandates</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      AI agents execute platform interactions with cryptographically signed spending capsules, restricting access windows and budget scopes.
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
            <h3 className="text-sm font-mono uppercase text-white/35 tracking-widest text-center mb-8">On-Chain Specifications</h3>
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-white/70 space-y-4">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Contract Standard</span>
                <span className="text-purple-400">ERC-721A / ERC-2981</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>L2 Deployment Network</span>
                <span className="text-purple-400">Arbitrum One</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Verification Method</span>
                <span className="text-purple-400">Ed25519 Cryptographic Signatures</span>
              </div>
              <div className="flex justify-between">
                <span>Consensus Engine</span>
                <span className="text-[var(--arc-brand-arcanean-gold)]">Byzantine Fault-Tolerant (BFT)</span>
              </div>
            </div>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
