'use client';

import { useState, useEffect, useCallback } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'arcanea-worlds-onboarded';

const STEPS = [
  {
    title: 'Welcome to the Multiverse',
    body: 'Worlds are living universes built by creators. Each has its own characters, locations, and rules.',
  },
  {
    title: 'Create or Explore',
    body: 'Build your own world with AI, or fork someone else\u2019s and make it yours.',
  },
  {
    title: 'Talk to Characters',
    body: 'Every character in a world is an AI you can chat with. They know their world\u2019s lore.',
  },
] as const;

export function WorldsOnboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch { /* SSR or private browsing */ }
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }, []);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  }, [step, dismiss]);

  if (!show) return null;

  const current = STEPS[step];

  return (
    <LazyMotion features={domAnimation}>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <m.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          className="relative w-[300px] rounded-2xl border border-white/[0.08] p-6 text-center"
          style={{
            background: 'rgba(12, 12, 20, 0.85)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(0,188,212,0.08)',
          }}
        >
          {/* Step content */}
          <AnimatePresence mode="wait">
            <m.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-display font-semibold text-white mb-2">
                {current.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {current.body}
              </p>
            </m.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-5 mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === step
                    ? 'bg-[#00bcd4] scale-110'
                    : 'bg-white/15'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={dismiss}
              className="px-4 py-2 text-xs text-white/30 hover:text-white/60 transition-colors rounded-lg"
            >
              Skip
            </button>
            <button
              onClick={next}
              className="px-5 py-2 text-xs font-medium rounded-lg bg-[#00bcd4]/15 border border-[#00bcd4]/30 text-[#00bcd4] hover:bg-[#00bcd4]/25 transition-all"
            >
              {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
