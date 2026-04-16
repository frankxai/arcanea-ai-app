"use client";

import { m } from "framer-motion";
import type { ReactNode, ComponentType } from "react";

// ---------------------------------------------------------------------------
// ConnectedFlow — Horizontal step flow with animated connectors.
// Use for "How It Works" style sections. Each step links to the next
// via a traveling gradient dot on hover.
// ---------------------------------------------------------------------------

export interface FlowStep {
  number: string;
  icon?: ComponentType<{ className?: string; weight?: string; style?: React.CSSProperties }>;
  iconNode?: ReactNode;
  title: string;
  body: string;
  accent: string;
}

interface ConnectedFlowProps {
  steps: FlowStep[];
  className?: string;
}

export function ConnectedFlow({ steps, className = "" }: ConnectedFlowProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <m.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Connector line (desktop only, between cards) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[52px] -right-3 w-6 h-px z-0">
                  <m.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${step.accent}50, ${steps[i + 1].accent}50)`,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
                  />
                </div>
              )}

              {/* Card */}
              <div
                className="relative p-6 md:p-7 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm h-full hover:bg-white/[0.04] transition-colors duration-500 group"
              >
                {/* Number + icon row */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-sm font-display font-bold"
                    style={{
                      background: `${step.accent}10`,
                      border: `1px solid ${step.accent}25`,
                      color: step.accent,
                    }}
                  >
                    {step.number}
                  </span>
                  {Icon && (
                    <Icon
                      className="w-5 h-5"
                      weight="duotone"
                      style={{ color: `${step.accent}99` } as React.CSSProperties}
                    />
                  )}
                  {step.iconNode}
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-display font-semibold mb-2"
                  style={{ color: step.accent }}
                >
                  {step.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}
