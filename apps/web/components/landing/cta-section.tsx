"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import navLogo from "@/assets/brand/arcanea-mark.jpg";

const BENEFITS = [
  "One workspace for chat, creation, research, and world-building",
  "A coherent system: product surface, library context, Academy depth, and canon",
  "Developer extension paths through packages, MCP surfaces, and reusable tooling",
];

const ORBITING_GUARDIANS = [
  { name: "Lyria", image: "/guardians/v3/lyria-hero-v3.webp", angle: 0 },
  { name: "Alera", image: "/guardians/v3/alera-hero-v3.webp", angle: 72 },
  { name: "Leyla", image: "/guardians/v3/leyla-hero-v3.webp", angle: 144 },
  { name: "Maylinn", image: "/guardians/v3/maylinn-hero-v3.webp", angle: 216 },
  { name: "Draconia", image: "/guardians/v3/draconia-hero-v3.webp", angle: 288 },
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(0,188,212,0.06) 0%, rgba(13,71,161,0.05) 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="gradient-border">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-10 md:p-16 lg:p-20 relative overflow-hidden">
            <div className="absolute inset-0 glass-noise opacity-[0.25] pointer-events-none rounded-[calc(1.5rem-1px)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00bcd4]/8 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1a237e]/12 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
                  <span className="text-gradient-cosmic">
                    Start with the platform.
                  </span>
                </h2>

                <p className="text-lg text-white/50 mb-8 leading-relaxed">
                  Arcanea should feel clear on first contact and deeper every time
                  you return. Use the workspace now, then go deeper through the
                  system, ecosystem, and canon when you need them.
                </p>

                <ul className="space-y-3 mb-10">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00bcd4]/15 border border-[#00bcd4]/35 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] text-[#00bcd4]">✓</span>
                      </div>
                      <span className="text-white/50 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/chat"
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00897b] via-[#1565c0] to-[#00bcd4] transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00bcd4] via-[#1565c0] to-[#00897b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-white flex items-center gap-2">
                      Open the Workspace
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </span>
                  </Link>

                  <Link
                    href="/developers"
                    className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Build with Arcanea
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square max-w-sm mx-auto">
                  <div className="absolute inset-[20%] bg-gradient-to-br from-[#00bcd4]/12 to-[#1a237e]/12 rounded-full blur-3xl" />

                  {ORBITING_GUARDIANS.map((g) => {
                    const rad = (g.angle - 90) * (Math.PI / 180);
                    const r = 38;
                    return (
                      <div
                        key={g.name}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${Math.cos(rad) * r}% - 24px)`,
                          top: `calc(50% + ${Math.sin(rad) * r}% - 24px)`,
                        }}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/[0.12] shadow-xl shadow-black/40">
                          <img
                            src={g.image}
                            alt={g.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/[0.15] shadow-[0_0_30px_rgba(0,188,212,0.2),0_0_60px_rgba(13,71,161,0.12)]">
                    <Image
                      src={navLogo}
                      alt="Arcanea"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
