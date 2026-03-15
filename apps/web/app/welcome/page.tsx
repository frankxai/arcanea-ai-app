'use client';

import { MotionProvider, m } from '@/lib/motion';
import Link from 'next/link';
import { PhSparkle, PhArrowRight } from '@/lib/phosphor-icons';

export default function WelcomePage() {
  return (
    <MotionProvider>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <m.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#ffd700]/30"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, '-20%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <m.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center max-w-2xl mx-auto relative z-10"
      >
        {/* Icon */}
        <m.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#ffd700]/20 to-[#00bcd4]/20 backdrop-blur-sm border border-[#ffd700]/30">
            <PhSparkle className="w-10 h-10 text-[#ffd700]" />
          </div>
        </m.div>

        {/* Title */}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#00bcd4] via-[#ffd700] to-[#0d47a1] bg-clip-text text-transparent"
        >
          Welcome to Arcanea
        </m.h1>

        {/* Subtitle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-body text-2xl md:text-3xl text-text-secondary mb-6"
        >
          The creative multiverse
        </m.p>

        {/* Description */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-body text-lg text-text-muted mb-12 max-w-lg mx-auto"
        >
          Chat with AI. Build fantasy worlds. Share what you make.
          A library of original texts. Tools that think with you.
        </m.p>

        {/* CTA Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/onboarding"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#daa520] text-[#09090b] font-body font-semibold text-lg transition-all hover:scale-105 hover:shadow-glow-lg"
          >
            Get Started
            <PhArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/auth/login"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/[0.06] text-text-secondary font-body font-medium hover:border-[#00bcd4] hover:text-[#00bcd4] transition-all"
          >
            I already have an account
          </Link>
        </m.div>
      </m.div>

      {/* Bottom flourish */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="font-body text-sm text-text-muted italic">
          "Enter seeking, leave transformed, return whenever needed."
        </p>
      </m.div>
    </div>
    </MotionProvider>
  );
}
