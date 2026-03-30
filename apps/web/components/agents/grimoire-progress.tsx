'use client';

import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SectionStatus = 'waiting' | 'generating' | 'complete' | 'error';

export interface GrimoireSection {
  id: string;
  title: string;
  status: SectionStatus;
}

export interface GrimoireProgressProps {
  sections: GrimoireSection[];
  currentSection?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status icon
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: SectionStatus }) {
  if (status === 'complete') {
    return (
      <svg
        className="w-4 h-4 text-[#7fffd4]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (status === 'error') {
    return (
      <svg
        className="w-4 h-4 text-red-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }

  if (status === 'generating') {
    return (
      <m.div
        className="w-4 h-4 rounded-full border-2 border-[#ffd700] border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        role="presentation"
      />
    );
  }

  // waiting
  return (
    <div
      className="w-4 h-4 rounded-full border-2 border-white/20"
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GrimoireProgress({
  sections,
  currentSection,
  className = '',
}: GrimoireProgressProps) {
  const completedCount = sections.filter((s) => s.status === 'complete').length;
  const total = sections.length;
  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <LazyMotion features={domAnimation}>
      <div className={`flex flex-col gap-6 ${className}`} role="status" aria-label="Grimoire generation progress">
        {/* Overall progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">Progress</span>
            <span className="text-sm font-medium text-[#ffd700]">{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <m.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #7fffd4, #ffd700)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Section timeline */}
        <ol className="relative flex flex-col gap-0" aria-label="Section checklist">
          {sections.map((section, index) => {
            const isActive = section.id === currentSection;
            const isLast = index === sections.length - 1;

            return (
              <li key={section.id} className="relative flex items-start gap-3">
                {/* Vertical connector line */}
                {!isLast && (
                  <div
                    className="absolute left-[0.4375rem] top-6 bottom-0 w-px"
                    style={{
                      background:
                        section.status === 'complete'
                          ? 'rgba(127,255,212,0.3)'
                          : 'rgba(255,255,255,0.08)',
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Status indicator */}
                <div className="relative z-10 mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={section.status}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StatusIcon status={section.status} />
                    </m.div>
                  </AnimatePresence>
                  {isActive && section.status === 'generating' && (
                    <m.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)',
                      }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      role="presentation"
                    />
                  )}
                </div>

                {/* Section label */}
                <m.div
                  className="pb-5 flex-1 min-w-0"
                  animate={{
                    opacity:
                      section.status === 'waiting' ? 0.38 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="text-sm leading-snug font-medium"
                    style={{
                      color:
                        section.status === 'complete'
                          ? 'rgba(127,255,212,0.9)'
                          : isActive
                          ? '#ffd700'
                          : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {section.title}
                  </p>
                  {isActive && section.status === 'generating' && (
                    <m.p
                      className="text-xs text-white/40 mt-0.5"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Weaving...
                    </m.p>
                  )}
                  {section.status === 'complete' && (
                    <m.p
                      className="text-xs text-[#7fffd4]/50 mt-0.5"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Complete
                    </m.p>
                  )}
                  {section.status === 'error' && (
                    <p className="text-xs text-red-400/70 mt-0.5">Failed — will retry</p>
                  )}
                </m.div>
              </li>
            );
          })}
        </ol>
      </div>
    </LazyMotion>
  );
}
