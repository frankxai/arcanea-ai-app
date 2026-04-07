"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { m, useInView } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Imagine",
    description:
      "Type one sentence. Sixteen specialized Luminors help you write, paint, compose, and build — each trained on 190K words of creative philosophy.",
    accent: "#00bcd4",
    href: "/chat",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Create entire worlds with characters, factions, locations, and magic systems. Every element auto-links into a living universe you own.",
    accent: "#7c4dff",
    href: "/worlds",
  },
  {
    number: "03",
    title: "Share",
    description:
      "Fork other creators' worlds. Star what inspires you. Build on each other's mythology in a growing multiverse of shared imagination.",
    accent: "#f59e0b",
    href: "/gallery",
  },
  {
    number: "04",
    title: "Grow",
    description:
      "Progress through the Ten Gates. Earn recognition through creation, not consumption. From Apprentice to Luminor — the path is the product.",
    accent: "#00897b",
    href: "/academy",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#00bcd4]/5 to-[#1a237e]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            A stronger creation loop
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            From first idea to a world of your own.
          </p>
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;

            return (
              <Link key={step.number} href={step.href} className="block focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 rounded-2xl">
              <m.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setActiveStep(i)}
                onClick={() => setActiveStep(i)}
                className="group relative p-6 rounded-2xl border cursor-pointer card-lift transition-all duration-300"
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
              </m.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
