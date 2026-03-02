'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { PhChat, PhSparkle, PhMagicWand, PhRocket, PhArrowRight } from '@/lib/phosphor-icons';

const STEPS = [
  {
    number: '01',
    icon: PhChat,
    title: 'Pick an Intelligence',
    description: 'Choose from 10 creative intelligences — each one has a distinct philosophy, personality, and domain of mastery.',
    color: 'atlantean-teal-aqua',
    visual: 'luminor-selection',
  },
  {
    number: '02',
    icon: PhSparkle,
    title: 'Describe Your Project',
    description: 'Tell it what you are working on. The intelligence adapts to your level — whether you are exploring ideas or refining something specific.',
    color: 'creation-prism-purple',
    visual: 'conversation',
  },
  {
    number: '03',
    icon: PhMagicWand,
    title: 'Create Together',
    description: 'Write, design, compose, or code — with an AI partner that thinks about the craft the way you do.',
    color: 'gold-bright',
    visual: 'creation',
  },
  {
    number: '04',
    icon: PhRocket,
    title: 'Share and Grow',
    description: 'Save your work and track progress in the Academy. The more you create, the more the system reveals.',
    color: 'draconic-crimson',
    visual: 'export',
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-atlantean-teal-aqua/5 to-creation-prism-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-creation-prism-purple/20 mb-6">
            <PhMagicWand className="w-3.5 h-3.5 text-creation-prism-purple" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Four steps to creation
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            From first idea to finished creation. Choose an intelligence, describe your vision, create together.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Step list */}
          <div className="space-y-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onMouseEnter={() => setActiveStep(i)}
                  className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-500 ${
                    isActive
                      ? `iridescent-glass border-${step.color}/30`
                      : 'liquid-glass border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  {/* Step number */}
                  <div className="absolute -left-3 top-6 px-2 py-1 bg-cosmic-deep rounded text-xs font-mono text-text-muted">
                    {step.number}
                  </div>

                  <div className="flex items-start gap-5 pl-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isActive
                          ? `bg-${step.color}/20`
                          : 'bg-white/[0.04] group-hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors ${
                          isActive ? `text-${step.color}` : 'text-text-muted group-hover:text-white'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <h3
                        className={`text-xl font-semibold mb-2 transition-colors ${
                          isActive ? `text-${step.color}` : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeStep"
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-${step.color} rounded-full`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Browser mockup */}
            <div className="relative rounded-2xl iridescent-glass border border-white/[0.10] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Glass noise overlay */}
              <div className="absolute inset-0 glass-noise opacity-[0.15] pointer-events-none z-10 rounded-2xl" />
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.03]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/[0.06] text-xs text-text-muted border border-white/[0.06]">
                    arcanea.ai
                  </div>
                </div>
              </div>

              {/* Preview content */}
              <div className="aspect-[4/3] p-8 relative">
                {/* Step-specific visuals */}
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.number}
                    className="absolute inset-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeStep === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {i === 0 && (
                      // Luminor selection grid
                      <div className="grid grid-cols-5 gap-2">
                        {['Lyria', 'Alera', 'Maylinn', 'Ino', 'Draconia', 'Aiyami', 'Elara', 'Lyssandria', 'Leyla', 'Shinkami'].map((name, n) => (
                          <div
                            key={name}
                            className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-mono text-center leading-tight px-1 ${
                              n === 0
                                ? 'bg-atlantean-teal-aqua/20 border-2 border-atlantean-teal-aqua text-atlantean-teal-aqua'
                                : 'bg-white/[0.04] border border-white/[0.06] text-text-muted'
                            }`}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                    {i === 1 && (
                      // Conversation interface
                      <div className="space-y-4">
                        <div className="flex justify-end">
                          <div className="max-w-[80%] p-4 rounded-2xl bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20">
                            <p className="text-sm">Help me design a world with a Gate-based magic system...</p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="max-w-[80%] p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-atlantean-teal-aqua/15 text-atlantean-teal-aqua">Lyria · Sight Gate</span>
                            </div>
                            <p className="text-sm text-text-secondary">I see your vision clearly. The Ten Gates offer a natural progression — each Gate unlocks new creative frequencies. Which element calls to you first?</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {i === 2 && (
                      // Creation in progress
                      <div className="h-full flex flex-col">
                        <div className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium">World Document</span>
                            <span className="text-xs text-atlantean-teal-aqua">Generating...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-white/[0.06] rounded w-full animate-pulse" />
                            <div className="h-3 bg-white/[0.06] rounded w-4/5 animate-pulse" />
                            <div className="h-3 bg-white/[0.06] rounded w-3/5 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    )}
                    {i === 3 && (
                      // Growth tracking
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold mb-4">Your Creative Journey</h4>
                        {[
                          { label: 'Foundation Gate', status: 'Opened', color: 'bg-atlantean-teal-aqua' },
                          { label: 'Flow Gate', status: 'Opened', color: 'bg-orange-500' },
                          { label: 'Fire Gate', status: 'In Progress', color: 'bg-red-500' },
                          { label: 'Heart Gate', status: 'Locked', color: 'bg-white/20' },
                        ].map((gate) => (
                          <div
                            key={gate.label}
                            className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${gate.color}`} />
                              <span className="text-sm">{gate.label}</span>
                            </div>
                            <span className="text-xs text-text-muted">{gate.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Decorative gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cosmic-surface/80 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -right-4 top-1/4 px-4 py-2 rounded-xl liquid-glass border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-atlantean-teal-aqua animate-pulse" />
                <span className="text-sm">10 intelligences</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
