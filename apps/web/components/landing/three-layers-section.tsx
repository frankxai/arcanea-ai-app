"use client";

import Link from "next/link";
import { m, useInView } from "framer-motion";
import { useRef } from "react";

const LAYERS = [
  {
    eyebrow: "Platform",
    title: "Use Arcanea right now",
    description:
      "Chat, create, research, and build in one workspace. The product surface should be understandable on first contact and useful in the first session.",
    href: "/chat",
    cta: "Open the workspace",
    accent: "#00bcd4",
  },
  {
    eyebrow: "System",
    title: "Keep your work coherent",
    description:
      "Arcanea connects product workflows with a living library, structured learning, and canon-aware context so projects stay sharper over time.",
    href: "/library",
    cta: "Explore the system",
    accent: "#ffd700",
  },
  {
    eyebrow: "Ecosystem",
    title: "Extend Arcanea into your stack",
    description:
      "Developers and advanced users can go deeper through packages, protocol surfaces, MCP tooling, and reusable creative infrastructure.",
    href: "/developers",
    cta: "Build with Arcanea",
    accent: "#00897b",
  },
];

export function ThreeLayersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[520px] h-[320px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.04),transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[320px] bg-[radial-gradient(ellipse,rgba(255,215,0,0.035),transparent_65%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
            Three Layers
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-5">
            Product first. Depth on demand.
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
            Arcanea should make sense in stages: platform on first contact,
            system as your work grows, ecosystem when you want to extend it.
            The mythology and Academy remain the depth layer, not the first hurdle.
          </p>
        </m.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {LAYERS.map((layer, index) => (
            <m.div
              key={layer.eyebrow}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 md:p-8"
            >
              <div
                className="w-10 h-[3px] rounded-full mb-5"
                style={{
                  background: `linear-gradient(90deg, ${layer.accent}, transparent)`,
                }}
              />
              <p
                className="text-[11px] font-mono tracking-[0.24em] uppercase mb-3"
                style={{ color: `${layer.accent}cc` }}
              >
                {layer.eyebrow}
              </p>
              <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">
                {layer.title}
              </h3>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed mb-6">
                {layer.description}
              </p>
              <Link
                href={layer.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {layer.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
