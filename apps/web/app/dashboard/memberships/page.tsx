/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { SectionShell, SectionHeader } from "@/components/premium";
import { ArrowLeft, Crown, Lightning } from "@/lib/phosphor-icons";

export default function MembershipsPage() {
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
        <SectionShell ambient="gold" size="compact">
          <div className="mx-auto max-w-4xl text-center px-6">
            <SectionHeader
              label="Monetization Pathway 02"
              title="Agentic Memberships"
              subtitle="Build a dedicated, recurring support base for your worlds. Gated automatically by Discord and Whop, optimized by agentic-income intelligence."
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
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 flex items-center justify-center border border-[var(--arc-brand-atlantean-teal)]/20">
                    <Lightning className="w-5 h-5 text-[var(--arc-brand-atlantean-teal)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Tech & Engineering</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Memberships are built on a federated role-mapping layer. Instead of locking you into a single silo, Arcanea syncs permissions across web3 and web2 channels.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-atlantean-teal)] mb-1">Federated Webhooks</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Instant state synchronization with Discord OAuth and Whop API webhook subscriptions. Roles are added or removed dynamically.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-atlantean-teal)] mb-1">Gated Markdown Vault Sync</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Vault assets are stored locally in Markdown and JSON, served via Edge middleware checking authorization headers in real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agentic Income Column */}
              <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/10 bg-[var(--arc-brand-arcanean-gold)]/[0.01] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 flex items-center justify-center border border-[var(--arc-brand-arcanean-gold)]/20">
                    <Crown className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)]" />
                  </div>
                  <h3 className="text-xl font-display font-bold">Agentic-Income Layer</h3>
                </div>
                
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-body">
                  Traditional platforms offer passive dashboards. Arcanea equips you with active, autonomous AI agent workers that actively work to maximize your recurring revenue.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Dynamic Tier Optimization</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      AI agents monitor subscriber cohorts to suggest premium custom benefits, bundle options, or price shifts to match demand patterns.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <h4 className="text-xs font-mono uppercase text-[var(--arc-brand-arcanean-gold)] mb-1">Autonomous Churn Prediction</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Predicts subscriber churn based on engagement signals and coordinates custom outreach prompts, retaining patrons before they cancel.
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
            <h3 className="text-sm font-mono uppercase text-white/35 tracking-widest text-center mb-8">System Architecture Specifications</h3>
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-white/70 space-y-4">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Auth Protocol</span>
                <span className="text-[var(--arc-brand-atlantean-teal)]">OAuth2 / Whop SSO</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Sync Latency</span>
                <span className="text-[var(--arc-brand-atlantean-teal)]">&lt; 250ms via Edge Events</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span>Content Encryption</span>
                <span className="text-[var(--arc-brand-atlantean-teal)]">AES-256-GCM Metadata Gates</span>
              </div>
              <div className="flex justify-between">
                <span>Agent Interconnect</span>
                <span className="text-[var(--arc-brand-arcanean-gold)]">ACOS Task Daemon v1.2</span>
              </div>
            </div>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
