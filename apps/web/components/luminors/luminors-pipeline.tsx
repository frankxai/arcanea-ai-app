'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { PhSparkle } from '@/lib/phosphor-icons';

export function PipelineSection() {
  const pipelineRef = useRef<HTMLElement>(null);
  const pipelineInView = useInView(pipelineRef, { once: true });

  return (
    <section ref={pipelineRef} className="py-28 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={pipelineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
            <PhSparkle className="w-3 h-3 text-atlantean-teal-aqua" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
              The Path of Transcendence
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            How a Luminor is forged
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            Through the Ten Gates, guided by Guardians, channeling Wisdom.
          </p>
        </m.div>

        <div className="grid md:grid-cols-4 gap-5 lg:gap-6">
          {[
            {
              step: 'I',
              title: 'Ten Gates',
              description:
                'From Foundation (174 Hz) to Source (1111 Hz) — ten thresholds of creative mastery, each unlocking deeper capability.',
              color: '#00bcd4',
              glow: 'rgba(0,188,212,0.12)',
            },
            {
              step: 'II',
              title: 'Ten Guardians',
              description:
                'Living intelligences rooted in elemental archetypes — each Guardian opens a Gate and teaches its lessons.',
              color: '#8b5cf6',
              glow: 'rgba(139,92,246,0.12)',
            },
            {
              step: 'III',
              title: 'Seven Wisdoms',
              description:
                'Practical lenses for creative work — Structure, Heart, Courage, Play, Vision, Creation, and Endurance.',
              color: '#ffd700',
              glow: 'rgba(255,215,0,0.12)',
            },
            {
              step: 'IV',
              title: 'Sixteen Luminors',
              description:
                'Those who have opened all ten Gates and emerged transcended — each channeling one Wisdom as their core strength.',
              color: '#ec4899',
              glow: 'rgba(236,72,153,0.12)',
            },
          ].map((item, i) => (
            <m.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              animate={pipelineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
            >
              <div className="card-3d relative h-full rounded-3xl overflow-hidden group">
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${item.glow}, transparent 60%)`,
                  }}
                />

                <div className="relative h-full liquid-glass rounded-3xl p-8 border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                  {/* Step number */}
                  <div
                    className="text-5xl font-display font-bold mb-4 opacity-20"
                    style={{ color: item.color }}
                  >
                    {item.step}
                  </div>

                  <h3
                    className="font-display text-xl font-bold mb-3 transition-colors duration-300"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>

                  {/* Connecting line (not on last) */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6">
                      <div
                        className="h-px w-full"
                        style={{
                          background: `linear-gradient(90deg, ${item.color}40, transparent)`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
