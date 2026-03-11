"use client";

import { LazyMotion, domMax, m, useInView } from "framer-motion";
import { useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Choose your companion",
    description:
      "Pick a creative AI companion — each specializes in music, writing, visual art, or world-building.",
    accent: "#00bcd4",
  },
  {
    number: "02",
    title: "Describe your vision",
    description:
      "Tell them what you want to create. They ask the right questions and help shape the direction.",
    accent: "#7c4dff",
  },
  {
    number: "03",
    title: "Create and iterate",
    description:
      "Move from concept to finished work in Studio, with guided iteration at each step.",
    accent: "#f59e0b",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <LazyMotion features={domMax}>
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#00bcd4]/5 to-[#1a237e]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            A stronger creation loop
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Three steps from idea to creative output.
          </p>
        </m.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {STEPS.map((step, i) => {
              const isActive = activeStep === i;

              return (
                <m.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onMouseEnter={() => setActiveStep(i)}
                  className="group relative p-6 rounded-2xl border cursor-pointer transition-all duration-500"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.02)",
                    borderColor: isActive
                      ? `${step.accent}55`
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="absolute -left-3 top-6 px-2 py-1 bg-cosmic-deep rounded text-xs font-mono text-text-muted">
                    {step.number}
                  </div>

                  <div className="flex items-start gap-5 pl-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-mono text-sm"
                      style={{
                        backgroundColor: isActive
                          ? `${step.accent}22`
                          : "rgba(255,255,255,0.04)",
                        color: isActive ? step.accent : "rgba(255,255,255,0.6)",
                        border: `1px solid ${isActive ? `${step.accent}66` : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      {step.number}
                    </div>

                    <div>
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: isActive ? step.accent : "#fff" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <m.div
                      layoutId="activeStep"
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                      style={{ backgroundColor: step.accent }}
                    />
                  )}
                </m.div>
              );
            })}
          </div>

          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.10] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 glass-noise opacity-[0.15] pointer-events-none z-10 rounded-2xl" />
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.03]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/[0.06] text-xs text-text-muted border border-white/[0.06]">
                    arcanea.ai/studio
                  </div>
                </div>
              </div>

              <div className="aspect-[4/3] p-8 relative">
                <m.div
                  className="absolute inset-8 rounded-xl border border-white/[0.08] bg-black/20 p-5"
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/35 mb-3">
                    Current step
                  </p>
                  <h4
                    className="text-xl font-display font-semibold mb-2"
                    style={{ color: STEPS[activeStep].accent }}
                  >
                    {STEPS[activeStep].title}
                  </h4>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {STEPS[activeStep].description}
                  </p>
                </m.div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cosmic-surface/80 to-transparent pointer-events-none" />
              </div>
            </div>

            <m.div
              className="absolute -right-4 top-1/4 px-4 py-2 rounded-xl liquid-glass border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
                <span className="text-sm">Guided workflow</span>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
    </LazyMotion>
  );
}
