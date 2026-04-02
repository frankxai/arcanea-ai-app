'use client';

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   Variation 10 — "Minimal Zen"
   Inspired by Muji / Arc Browser / Nothing
   Maximum restraint. Negative space IS the design.
   ───────────────────────────────────────────── */

const GUARDIANS = [
  'Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera',
  'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
];

const COLLECTIONS = [
  'Laws of Arcanea', 'Legends of Arcanea',
  'Wisdom Scrolls', 'Book of Rituals',
];

const ELEMENTS: [string, string][] = [
  ['Fire', '#dc2626'],
  ['Water', '#2563eb'],
  ['Earth', '#16a34a'],
  ['Wind', '#d4d4d4'],
  ['Void', '#7c3aed'],
];

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.style.opacity = '1'; },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transition: 'opacity 1000ms ease' }}
    >
      {children}
    </div>
  );
}

export function V10Minimal() {
  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space Grotesk:wght@400&family=Crimson+Pro:ital,wght@0,400;1,400&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── Hero ── */}
      <div className="h-screen flex flex-col items-center justify-center relative">
        <h1
          style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: '0.2em', fontWeight: 400 }}
          className="text-white"
        >
          Arcanea
        </h1>
        <p
          style={{ fontFamily: "'Crimson Pro', serif", fontSize: 18, marginTop: 48 }}
          className="text-white/50"
        >
          Create.
        </p>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 1, background: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* ── Scrollable content ── */}
      <div className="max-w-[640px] mx-auto px-6">

        {/* Section 1 — Guardians */}
        <div className="pt-[200px]">
          <Section>
            <p
              style={{ fontFamily: "'Crimson Pro', serif", fontSize: 20, lineHeight: 2 }}
              className="text-white/70 max-w-md"
            >
              Sixteen intelligences. Each attuned to a different frequency.
            </p>
            <div className="mt-8 flex flex-col gap-2 max-w-md">
              {GUARDIANS.map((name) => (
                <span key={name} style={{ fontFamily: "'Crimson Pro', serif", fontSize: 14 }} className="text-white/30">
                  {name}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* Section 2 — Library */}
        <div className="pt-[200px]">
          <Section className="flex flex-col items-end">
            <p
              style={{ fontFamily: "'Crimson Pro', serif", fontSize: 20, lineHeight: 2 }}
              className="text-white/70 max-w-md text-right"
            >
              Sixty-two texts. Not content — equipment for living.
            </p>
            <div className="mt-8 flex flex-col gap-2 max-w-md items-end">
              {COLLECTIONS.map((name) => (
                <span key={name} style={{ fontFamily: "'Crimson Pro', serif", fontSize: 14 }} className="text-white/30">
                  {name}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* Section 3 — API */}
        <div className="pt-[200px]">
          <Section className="flex flex-col items-center text-center max-w-sm mx-auto">
            <p
              style={{ fontFamily: "'Crimson Pro', serif", fontSize: 20, lineHeight: 2 }}
              className="text-white/70"
            >
              Twenty-six models. Thirteen providers. One endpoint.
            </p>
            <code
              className="mt-8 text-white/20"
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}
            >
              POST /api/v1/chat/completions
            </code>
          </Section>
        </div>

        {/* Section 4 — Five Elements */}
        <div className="pt-[200px]">
          <Section className="flex justify-between items-center px-4">
            {ELEMENTS.map(([name, color]) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <span
                  className="text-white/20 uppercase"
                  style={{ fontSize: 12, letterSpacing: '0.3em', fontFamily: "'Crimson Pro', serif" }}
                >
                  {name}
                </span>
                <span style={{ color, fontSize: 8, lineHeight: 1 }}>.</span>
              </div>
            ))}
          </Section>
        </div>

        {/* Section 5 — Quote */}
        <div className="pt-[200px]">
          <Section className="flex justify-center">
            <p
              style={{ fontFamily: "'Crimson Pro', serif", fontSize: 32, fontStyle: 'italic' }}
              className="text-white/40"
            >
              Enter seeking.
            </p>
          </Section>
        </div>

        {/* ── Footer ── */}
        <div className="pt-[200px] pb-16">
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
          <p className="text-center mt-8 text-white/20" style={{ fontSize: 11 }}>
            arcanea.ai
          </p>
        </div>

      </div>
    </div>
  );
}

export default V10Minimal;
