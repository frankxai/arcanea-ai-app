"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { PhArrowRight, PhCheck } from '@/lib/phosphor-icons';

const BENEFITS = [
  "Ten creative intelligences, each with a distinct philosophy",
  "A library of 34 original texts — philosophy for makers",
  "A progression system that deepens the more you create",
  "No limits on what you build",
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(127,255,212,0.06) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)",
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
          {/* Gradient border wrapper */}
          <div className="gradient-border">
            <div className="liquid-glass-elevated rounded-[calc(1.5rem-1px)] p-10 md:p-16 lg:p-20 relative overflow-hidden">
              {/* Decorative glow spots */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-atlantean-teal-aqua/8 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-creation-prism-purple/8 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left — Content */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.15 }}
                  >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
                      Imagine a good future.{" "}
                      <span className="bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright bg-clip-text text-transparent">
                        Build it here.
                      </span>
                    </h2>

                    <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                      Arcanea is free. Start with any intelligence, explore
                      the Library, create whatever you want.
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
                          <div className="w-5 h-5 rounded-full bg-atlantean-teal-aqua/15 flex items-center justify-center flex-shrink-0">
                            <PhCheck className="w-3 h-3 text-atlantean-teal-aqua" />
                          </div>
                          <span className="text-text-secondary text-sm">{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/chat"
                        className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                          Start Creating Free
                          <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>

                      <Link
                        href="/about"
                        className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                      >
                        Learn More
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Right — Visual: Guardian portraits orbiting */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative w-full aspect-square max-w-sm mx-auto">
                    {/* Center glow */}
                    <div className="absolute inset-[20%] bg-gradient-to-br from-atlantean-teal-aqua/15 to-creation-prism-purple/15 rounded-full blur-3xl" />

                    {/* Orbiting guardian portraits */}
                    {[
                      { name: "Lyria", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/lyria-hero.webp", angle: 0, delay: 0 },
                      { name: "Alera", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/alera-hero.webp", angle: 72, delay: 0.4 },
                      { name: "Leyla", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/leyla-hero.webp", angle: 144, delay: 0.8 },
                      { name: "Maylinn", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/maylinn-hero.webp", angle: 216, delay: 1.2 },
                      { name: "Draconia", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/draconia-hero.webp", angle: 288, delay: 1.6 },
                    ].map((g) => {
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
                          transition={{ delay: 0.5 + g.delay * 0.15, type: "spring" }}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/[0.12] shadow-xl shadow-black/40"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, delay: g.delay }}
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

                    {/* Center crystal */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl liquid-glass-elevated flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 30px rgba(127,255,212,0.2)",
                          "0 0 50px rgba(127,255,212,0.4)",
                          "0 0 30px rgba(127,255,212,0.2)",
                        ],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <span className="text-2xl font-display font-bold bg-gradient-to-br from-atlantean-teal-aqua to-creation-prism-purple bg-clip-text text-transparent">
                        A
                      </span>
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
