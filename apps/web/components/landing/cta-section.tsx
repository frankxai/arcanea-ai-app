"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import navLogo from "@/assets/brand/arcanea-mark.jpg";

const BENEFITS = [
  "Canon-backed creation system: Primordials, Gods, Guardians, and Luminors",
  "Library of philosophy texts, lore structures, and practical craft guidance",
  "Free to start with direct paths into Chat, Studio, and Academy",
];

const ORBITING_GUARDIANS = [
  { name: "Lyria", image: "/guardians/lyria-hero.webp", angle: 0, delay: 0 },
  { name: "Alera", image: "/guardians/alera-hero.webp", angle: 72, delay: 0.4 },
  {
    name: "Leyla",
    image: "/guardians/leyla-hero.webp",
    angle: 144,
    delay: 0.8,
  },
  {
    name: "Maylinn",
    image: "/guardians/maylinn-hero.webp",
    angle: 216,
    delay: 1.2,
  },
  {
    name: "Draconia",
    image: "/guardians/draconia-hero.webp",
    angle: 288,
    delay: 1.6,
  },
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,188,212,0.06) 0%, rgba(13,71,161,0.05) 40%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="gradient-border">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-10 md:p-16 lg:p-20 relative overflow-hidden">
              <div className="absolute inset-0 glass-noise opacity-[0.25] pointer-events-none rounded-[calc(1.5rem-1px)]" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00bcd4]/8 rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1a237e]/12 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.15 }}
                  >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
                      <span className="text-gradient-cosmic">
                        Build with depth.
                      </span>
                    </h2>

                    <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                      Arcanea is a complete creation ecosystem, not a thin AI
                      wrapper.
                    </p>

                    <ul className="space-y-3 mb-10">
                      {BENEFITS.map((benefit, i) => (
                        <motion.li
                          key={benefit}
                          initial={{ opacity: 0, x: -15 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.25 + i * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#00bcd4]/15 border border-[#00bcd4]/35 flex items-center justify-center flex-shrink-0">
                            <span className="text-[11px] text-[#00bcd4]">
                              ✓
                            </span>
                          </div>
                          <span className="text-text-secondary text-sm">
                            {benefit}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/studio"
                        className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00897b] via-[#1565c0] to-[#00bcd4]" />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative z-10 text-white flex items-center gap-2">
                          Enter Studio
                          <span className="group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </span>
                      </Link>

                      <Link
                        href="/lore"
                        className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                      >
                        Explore Lore
                      </Link>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative w-full aspect-square max-w-sm mx-auto">
                    <div className="absolute inset-[20%] bg-gradient-to-br from-[#00bcd4]/12 to-[#1a237e]/12 rounded-full blur-3xl" />

                    {ORBITING_GUARDIANS.map((g) => {
                      const rad = (g.angle - 90) * (Math.PI / 180);
                      const r = 38;
                      return (
                        <motion.div
                          key={g.name}
                          className="absolute"
                          style={{
                            left: `calc(50% + ${Math.cos(rad) * r}% - 24px)`,
                            top: `calc(50% + ${Math.sin(rad) * r}% - 24px)`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isInView ? { scale: 1, opacity: 1 } : {}}
                          transition={{
                            delay: 0.5 + g.delay * 0.15,
                            type: "spring",
                          }}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/[0.12] shadow-xl shadow-black/40"
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 3.5,
                              repeat: Infinity,
                              delay: g.delay,
                            }}
                          >
                            <img
                              src={g.image}
                              alt={g.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </motion.div>
                        </motion.div>
                      );
                    })}

                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/[0.15]"
                      animate={{
                        boxShadow: [
                          "0 0 30px rgba(0,188,212,0.2), 0 0 60px rgba(13,71,161,0.12)",
                          "0 0 50px rgba(0,188,212,0.35), 0 0 80px rgba(13,71,161,0.2)",
                          "0 0 30px rgba(0,188,212,0.2), 0 0 60px rgba(13,71,161,0.12)",
                        ],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Image
                        src={navLogo}
                        alt="Arcanea"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
