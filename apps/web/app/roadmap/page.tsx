'use client';

import Link from 'next/link';
import { RoadmapHero } from '@/components/roadmap/roadmap-hero';
import { RoadmapPhases } from '@/components/roadmap/roadmap-phases';

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-void">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 70% 10%, hsl(195 80% 20% / 0.12), transparent), radial-gradient(ellipse 50% 40% at 20% 80%, hsl(265 55% 20% / 0.10), transparent)',
          }}
        />
      </div>

      {/* Three.js hero — full viewport */}
      <RoadmapHero />

      {/* Scroll-animated phase cards */}
      <RoadmapPhases />

      {/* CTA section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(127,255,212,0.05), rgba(120,166,255,0.04), rgba(192,132,252,0.04))',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow:
              '0 0 60px rgba(127,255,212,0.06), 0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, hsl(160 100% 75% / 0.4), transparent)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
              Start Your Journey
            </h2>
            <p className="font-body text-text-secondary leading-relaxed mb-8">
              Every creator begins at the Foundation. The path through all six
              phases is yours to walk.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[hsl(240_6%_4%)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(127,255,212,0.35)]"
                style={{ background: 'hsl(160 100% 75%)' }}
              >
                Create Your Account
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/changelog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-text-primary transition-all duration-200 hover:bg-white/[0.04]"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                View Changelog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
