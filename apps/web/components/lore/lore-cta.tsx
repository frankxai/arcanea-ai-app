"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { GlowButton } from "@/components/ui/glow-button";
import { durations, m3Curves } from "@/lib/design/motion";

export function LoreCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-surface/30 to-cosmic-deep" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-atlantean-teal-aqua/10 via-creation-prism-purple/5 to-transparent rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: durations.slowest, ease: m3Curves.emphasized }}
          className="text-center"
        >
          {/* Quote */}
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-display italic text-text-secondary leading-relaxed mb-8">
            &quot;Enter seeking, leave transformed, return whenever needed.&quot;
          </blockquote>
          <cite className="block text-sm text-text-muted font-mono tracking-wider mb-16">
            — Inscription on the Library Door
          </cite>

          {/* CTA Buttons — GlowButton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GlowButton href="/auth/signup" variant="primary" color="cyan" size="lg">
              Start Creating
            </GlowButton>

            <GlowButton href="/library/legends-of-arcanea/i-the-first-dawn" variant="secondary" color="purple" size="lg">
              Read the First Legend
            </GlowButton>
          </div>

          {/* Decorative dots */}
          <m.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-16 flex justify-center gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <m.div
                key={i}
                className="w-2 h-2 rounded-full bg-gold-bright/50"
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
