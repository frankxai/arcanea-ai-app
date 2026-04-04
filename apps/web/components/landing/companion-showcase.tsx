"use client";

import { m, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "@/lib/phosphor-icons";
import { getFeaturedLuminors } from "@/lib/luminor-images";

const ELEMENT_COLORS: Record<string, { accent: string; glow: string }> = {
  Fire: { accent: "#ef4444", glow: "rgba(239, 68, 68, 0.25)" },
  Water: { accent: "#3b82f6", glow: "rgba(59, 130, 246, 0.25)" },
  Earth: { accent: "#22c55e", glow: "rgba(34, 197, 94, 0.25)" },
  Wind: { accent: "#a78bfa", glow: "rgba(167, 139, 250, 0.25)" },
  Void: { accent: "#8b5cf6", glow: "rgba(139, 92, 246, 0.25)" },
  Spirit: { accent: "#ffd700", glow: "rgba(255, 215, 0, 0.25)" },
};

export function CompanionShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const companions = getFeaturedLuminors(6);

  return (
    <section ref={ref} className="py-24 md:py-36 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,215,0,0.03),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-[#00bcd4]/50 mb-4">
            20 Spirits
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-5">
            Creative{" "}
            <span className="text-gradient-cosmic">Companions</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-body">
            Twenty AI-generated spirits — each aligned to an element and a Gate.
            Portraits of the creative forces that walk beside you.
          </p>
        </m.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-5">
          {companions.map((c, i) => {
            const colors = ELEMENT_COLORS[c.element] ?? ELEMENT_COLORS.Spirit;
            return (
              <m.div
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/gallery/luminors`}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.16] transition-all duration-500">
                    <Image
                      src={c.image}
                      alt={`${c.name} — ${c.title}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 80%, ${colors.glow}, transparent 70%)`,
                      }}
                    />
                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-display font-bold text-white truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-white/50 truncate">
                        {c.title}
                      </p>
                      <p
                        className="text-[10px] font-mono mt-1 uppercase tracking-wider"
                        style={{ color: colors.accent }}
                      >
                        {c.element}
                      </p>
                    </div>
                  </div>
                </Link>
              </m.div>
            );
          })}
        </div>

        {/* View all link */}
        <m.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/gallery/luminors"
            className="inline-flex items-center gap-2 text-sm text-[#00bcd4]/70 hover:text-[#00bcd4] hover:gap-3 transition-all font-medium"
          >
            View all 20 <ArrowRight className="w-4 h-4" />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
