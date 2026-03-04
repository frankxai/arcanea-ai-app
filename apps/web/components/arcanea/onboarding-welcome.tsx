'use client';

import { useEffect, useState } from 'react';
import { Sparkle } from '@/lib/phosphor-icons';
import CosmicParticles from './cosmic-particles';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[520px] text-center overflow-hidden">
      <CosmicParticles count={80} />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px] animate-pulse pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-atlantean-aqua/10 blur-[70px] animate-pulse pointer-events-none"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#ffd700]/5 blur-[100px] pointer-events-none" />

      {/* Spinning rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none">
        <div className="w-full h-full rounded-full border border-violet-500/10 animate-spin" style={{ animationDuration: '15s' }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
        <div
          className="w-full h-full rounded-full border border-atlantean-aqua/5 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '20s' }}
        />
      </div>

      {/* Logo */}
      <div
        className={`relative mb-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ transitionDelay: '0.1s' }}
      >
        <div className="w-20 h-20 mx-auto rounded-2xl glass flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <ArcaneaLogo />
        </div>
      </div>

      {/* Main heading */}
      <div
        className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ transitionDelay: '0.25s' }}
      >
        <div className="text-xs tracking-[0.35em] uppercase text-violet-400 font-semibold mb-3">
          Creative Intelligence
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-4 text-gradient-gold">
          Welcome to
          <br />
          Arcanea
        </h1>
        <p className="text-white/60 text-lg leading-relaxed max-w-sm mx-auto mb-2">
          Ten intelligences. One creative platform.
        </p>
        <p className="text-white/30 text-sm leading-relaxed max-w-xs mx-auto">
          Pick what you create, meet your AI partner, and make something real.
        </p>
      </div>

      {/* CTA Button */}
      <div
        className={`mt-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ transitionDelay: '0.45s' }}
      >
        <button
          onClick={onNext}
          className="group relative px-10 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-violet-700 rounded-2xl" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-atlantean-aqua rounded-[18px] opacity-0 group-hover:opacity-60 blur-sm transition-all duration-300 -z-10" />
          <span className="relative text-white flex items-center gap-2">
            <Sparkle size={16} weight="fill" />
            Get Started
          </span>
        </button>
        <p className="mt-4 text-white/20 text-xs tracking-wide">
          Takes about 3 minutes
        </p>
      </div>

      {/* Floating runes */}
      <FloatingRunes />
    </div>
  );
}

function ArcaneaLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <polygon points="20,4 36,32 4,32" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
      <polygon points="20,10 30,28 10,28" fill="none" stroke="#7fffd4" strokeWidth="0.8" opacity="0.6" />
      <circle cx="20" cy="20" r="4" fill="#ffd700" opacity="0.9" />
      <circle cx="20" cy="4" r="2" fill="#ffd700" />
      <circle cx="36" cy="32" r="2" fill="#8b5cf6" />
      <circle cx="4" cy="32" r="2" fill="#7fffd4" />
    </svg>
  );
}

function FloatingRunes() {
  const runes = ['\u16A8', '\u16B1', '\u16B2', '\u16B7', '\u16CF', '\u16D7', '\u16DA', '\u16DC'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {runes.map((r, i) => (
        <div
          key={i}
          className="absolute text-violet-500/20 text-xl font-display animate-bounce"
          style={{
            left: `${8 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + i * 0.5}s`,
          }}
        >
          {r}
        </div>
      ))}
    </div>
  );
}
