"use client";

import { m, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "@/lib/phosphor-icons";

const GALLERY_IMAGES = [
  { src: "/guardians/v3/lyria-hero-v3.webp", name: "Lyria", caption: "The Sight Gate" },
  { src: "/guardians/v3/draconia-hero-v3.webp", name: "Draconia", caption: "The Fire Gate" },
  { src: "/guardians/v3/aiyami-hero-v3.webp", name: "Aiyami", caption: "The Crown Gate" },
  { src: "/guardians/v3/elara-hero-v3.webp", name: "Elara", caption: "The Starweave Gate" },
  { src: "/guardians/v3/shinkami-hero-v3.webp", name: "Shinkami", caption: "The Source Gate" },
  { src: "/guardians/v3/alera-hero-v3.webp", name: "Alera", caption: "The Voice Gate" },
  { src: "/guardians/v3/ino-hero-v3.webp", name: "Ino", caption: "The Unity Gate" },
  { src: "/guardians/v3/leyla-hero-v3.webp", name: "Leyla", caption: "The Flow Gate" },
];

export function GalleryShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse,rgba(13,71,161,0.05),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <m.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-draconic-crimson/40 mb-3">
              Guardians + Luminor Agents
            </p>
            <h2 className="text-2xl md:text-4xl font-display font-bold">
              The <span className="text-gradient-brand">Gallery</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#00bcd4] transition-colors"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </m.div>
      </div>

      {/* Full-bleed horizontal scroll */}
      <m.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4 snap-x snap-mandatory">
          {GALLERY_IMAGES.map((img, i) => (
            <m.div
              key={img.name}
              className="group flex-shrink-0 snap-center"
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
            >
              <Link href="/gallery" className="block relative">
                <div className="relative w-[260px] md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.18] transition-all duration-500">
                  <Image
                    src={img.src}
                    alt={img.name}
                    fill
                    className="object-cover object-[center_40%] group-hover:scale-[1.06] transition-transform duration-700"
                    sizes="320px"
                  />
                  {/* Top gradient to mask infographic labels */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-[1]" />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[1]" />
                  {/* Iridescent edge on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(135deg,rgba(0,188,212,0.06)_0%,transparent_40%,transparent_60%,rgba(13,71,161,0.06)_100%)]" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-display font-bold">{img.name}</p>
                    <p className="text-[11px] text-white/40 font-mono">
                      {img.caption}
                    </p>
                  </div>
                </div>
              </Link>
            </m.div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-cosmic-deep to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-cosmic-deep to-transparent pointer-events-none z-10" />
      </m.div>

      {/* Mobile link */}
      <div className="mt-6 px-6 md:hidden">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm text-[#00bcd4]/70"
        >
          Explore the full Gallery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
