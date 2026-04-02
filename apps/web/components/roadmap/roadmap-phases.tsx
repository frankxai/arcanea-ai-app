'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Phase {
  number: string;
  name: string;
  subtitle: string;
  period: string;
  status: 'COMPLETE' | 'IN PROGRESS' | 'PLANNED';
  description: string;
  features: string[];
  accent: string;
  accentGlow: string;
}

// ─── Phase data ───────────────────────────────────────────────────────────────

const PHASES: Phase[] = [
  {
    number: '01',
    name: 'Foundation',
    subtitle: 'Graph & Auth',
    period: 'Q1 2026',
    status: 'COMPLETE',
    description:
      'The bedrock of Arcanea. Authentication, the project graph, and the platform architecture that everything else builds upon.',
    features: [
      'Supabase auth with OAuth providers',
      'Project graph — 190+ interconnected pages',
      'MCP server with 30+ tools',
      'Intelligence OS with 9 core packages',
    ],
    accent: 'hsl(165 60% 50%)',
    accentGlow: 'rgba(80, 200, 160, 0.18)',
  },
  {
    number: '02',
    name: 'Intelligence',
    subtitle: 'Notes & Docs',
    period: 'Q2 2026',
    status: 'IN PROGRESS',
    description:
      'The thinking layer. Rich text editing, AI-powered summarization, and a living document system scoped to every project.',
    features: [
      'Novel editor with slash commands',
      'Project-scoped documentation',
      'AI summarization and rewriting',
      'Version history and diff viewer',
    ],
    accent: 'hsl(160 100% 75%)',
    accentGlow: 'rgba(127, 255, 212, 0.18)',
  },
  {
    number: '03',
    name: 'Vision',
    subtitle: 'Board & Canvas',
    period: 'Q2 2026',
    status: 'PLANNED',
    description:
      'The visual layer. Spatial thinking, moodboards, and story-webs that let creators see how their ideas connect.',
    features: [
      'Infinite canvas with spatial clustering',
      'Reference boards and moodboards',
      'Story web visualization',
      'Export to PDF and image',
    ],
    accent: 'hsl(195 80% 55%)',
    accentGlow: 'rgba(56, 182, 255, 0.18)',
  },
  {
    number: '04',
    name: 'Creation',
    subtitle: 'Studio & Generation',
    period: 'Q3 2026',
    status: 'PLANNED',
    description:
      'The generative layer. Images, video, text, and music — all tied to your project graph and stylized to your world.',
    features: [
      'Image and video generation pipelines',
      'Music and audio generation',
      'Style Packs for consistent aesthetics',
      'Creator workflow automation',
    ],
    accent: 'hsl(48 100% 60%)',
    accentGlow: 'rgba(255, 215, 0, 0.15)',
  },
  {
    number: '05',
    name: 'Connection',
    subtitle: 'Social & Community',
    period: 'Q3 2026',
    status: 'PLANNED',
    description:
      'The social layer. Share what you build, follow other creators, and join challenges that push your craft forward.',
    features: [
      'Collections and public portfolios',
      'Creator follows and feed',
      'Prompt books and shared workflows',
      'Community challenges and leaderboards',
    ],
    accent: 'hsl(265 55% 62%)',
    accentGlow: 'rgba(168, 85, 247, 0.15)',
  },
  {
    number: '06',
    name: 'Expansion',
    subtitle: 'Agent Crews & Marketplace',
    period: 'Q4 2026',
    status: 'PLANNED',
    description:
      'The intelligence layer, fully unleashed. Autonomous agents that know your world, a marketplace for skills, and team workspaces.',
    features: [
      'Style-aware agent crews',
      'Lore architect for world continuity',
      'Skill and style pack marketplace',
      'Team workspaces and shared graphs',
    ],
    accent: 'hsl(25 95% 60%)',
    accentGlow: 'rgba(251, 146, 60, 0.15)',
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<Phase['status'], string> = {
  COMPLETE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'IN PROGRESS': 'bg-aquamarine/10 text-aquamarine border-aquamarine/20',
  PLANNED: 'bg-white/[0.04] text-text-muted border-white/[0.06]',
};

function StatusBadge({ status }: { status: Phase['status'] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono tracking-wider border ${STATUS_STYLES[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'COMPLETE'
            ? 'bg-emerald-400'
            : status === 'IN PROGRESS'
            ? 'bg-aquamarine animate-pulse'
            : 'bg-text-muted'
        }`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

// ─── Single phase card ────────────────────────────────────────────────────────

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  return (
    <div
      className="phase-card opacity-0 translate-y-12 relative flex gap-6 md:gap-8"
      data-index={index}
    >
      {/* Left timeline connector */}
      <div className="hidden md:flex flex-col items-center shrink-0 w-5">
        <div
          className="w-3 h-3 rounded-full shrink-0 mt-6"
          style={{
            backgroundColor: phase.accent,
            boxShadow: `0 0 0 2px hsl(240 6% 4%), 0 0 0 3px ${phase.accent}60, 0 0 14px ${phase.accentGlow}`,
          }}
          aria-hidden="true"
        />
        {index < PHASES.length - 1 && (
          <div
            className="w-px flex-1 mt-2"
            style={{
              background: `linear-gradient(to bottom, ${phase.accent}40, transparent)`,
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-6 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: `0 0 40px ${phase.accentGlow}, 0 16px 48px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Accent bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${phase.accent}, transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="p-7 md:p-9">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div className="flex items-baseline gap-4">
              <span
                className="font-display font-bold text-5xl leading-none select-none"
                style={{ color: `${phase.accent}30` }}
                aria-hidden="true"
              >
                {phase.number}
              </span>
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary leading-tight">
                  {phase.name}
                </h2>
                <p className="text-sm text-text-muted font-body mt-0.5">
                  {phase.subtitle} &mdash; {phase.period}
                </p>
              </div>
            </div>
            <StatusBadge status={phase.status} />
          </div>

          {/* Description */}
          <p className="text-text-secondary font-body leading-relaxed mb-6 max-w-xl">
            {phase.description}
          </p>

          {/* Feature list */}
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {phase.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm font-body text-text-secondary">
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="7" stroke={phase.accent} strokeOpacity="0.4" strokeWidth="1" />
                  <path
                    d="M5 8l2 2 4-4"
                    stroke={phase.accent}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#phases-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.4,
      },
    });
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0"
        style={{
          background:
            'linear-gradient(90deg, hsl(160 100% 75%), hsl(195 80% 55%), hsl(265 60% 65%))',
        }}
      />
    </div>
  );
}

// ─── Main phases section ──────────────────────────────────────────────────────

export function RoadmapPhases() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.phase-card');

      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <ScrollProgressBar />

      <section
        id="phases-section"
        ref={containerRef}
        className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        aria-label="Product phases"
      >
        {/* Section label */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-text-muted mb-3">
            Six phases
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            From Foundation to Expansion
          </h2>
          <p className="font-body text-text-secondary mt-4 max-w-lg mx-auto">
            Each phase unlocks the next. Every layer deepens the graph.
          </p>
        </div>

        {/* Phase cards */}
        <div className="flex flex-col">
          {PHASES.map((phase, i) => (
            <PhaseCard key={phase.number} phase={phase} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
