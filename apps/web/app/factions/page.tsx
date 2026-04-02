import type { Metadata } from 'next';
import Link from 'next/link';
import { FactionGrid } from './faction-grid';

export const metadata: Metadata = {
  title: 'The Eight Origins | Arcanea',
  description:
    'Discover the eight origin classes of Arcanea — from Academy-trained Arcans to reality-shaping Architects. Every being has an origin. What made you extraordinary?',
  openGraph: {
    title: 'The Eight Origins | Arcanea',
    description:
      'Discover the eight origin classes of Arcanea — from Academy-trained Arcans to reality-shaping Architects.',
  },
};

export default function FactionsPage() {
  return (
    <main className="min-h-screen" style={{ background: '#0a0a1a' }}>
      {/* Cosmic ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(155,89,182,0.06) 0%, transparent 55%),' +
            'radial-gradient(ellipse at 70% 80%, rgba(0,255,255,0.04) 0%, transparent 55%),' +
            'radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.02) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <section className="text-center mb-20">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="h-px w-12"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,215,0,0.6))',
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,215,0,0.7)' }}
            >
              Factions Codex
            </span>
            <div
              className="h-px w-12"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,215,0,0.6), transparent)',
              }}
            />
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              background:
                'linear-gradient(135deg, #ffffff 0%, rgba(255,215,0,0.9) 50%, rgba(168,85,247,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            The Eight Origins
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Every being in Arcanea has an origin — the source of their power
            and the shape of their existence. Origin is not race. It is{' '}
            <em style={{ color: 'rgba(255,255,255,0.8)' }}>
              what made you extraordinary.
            </em>
          </p>

          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Select any origin class to open the full codex entry.
          </p>
        </section>

        {/* Origin Grid */}
        <section className="mb-24">
          <FactionGrid />
        </section>

        {/* CTA */}
        <section className="text-center">
          <div
            className="inline-block rounded-2xl px-8 py-10 max-w-lg w-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,215,0,0.6)' }}
            >
              Discover your origin
            </p>
            <h2
              className="text-2xl font-bold mb-3 text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Which class are you?
            </h2>
            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Take the origin quiz to discover which of the eight classes
              resonates with your power and path.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(168,85,247,0.2))',
                border: '1px solid rgba(255,215,0,0.4)',
                color: '#ffd700',
                boxShadow: '0 0 20px rgba(255,215,0,0.1)',
              }}
            >
              Take the Quiz
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
