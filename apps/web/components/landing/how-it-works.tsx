"use client";

import { useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Imagine",
    description:
      "Chat with creative AI partners who specialize in writing, art, music, and world-building. Describe your vision and watch it take shape.",
    accent: "#00bcd4",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Create worlds, stories, and code in Studio. Use the Academy to master the craft, and the Library for 190K+ words of creative philosophy.",
    accent: "#7c4dff",
  },
  {
    number: "03",
    title: "Share",
    description:
      "Publish your creations to the Feed. Get discovered by other world-builders. Contribute to a growing multiverse of shared imagination.",
    accent: "#f59e0b",
  },
  {
    number: "04",
    title: "Grow",
    description:
      "Advance through the Ten Gates. Unlock new creative powers, earn recognition, and evolve from Apprentice to Luminor.",
    accent: "#00897b",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#00bcd4]/5 to-[#1a237e]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            A stronger creation loop
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            From first idea to a world of your own.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;

            return (
              <div
                key={step.number}
                onMouseEnter={() => setActiveStep(i)}
                className="group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.02)",
                  borderColor: isActive
                    ? `${step.accent}55`
                    : "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: step.accent,
                    opacity: isActive ? 1 : 0,
                  }}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-mono text-sm transition-colors duration-300"
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

                <h3
                  className="text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{ color: isActive ? step.accent : "#fff" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
