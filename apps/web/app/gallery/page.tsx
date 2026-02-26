"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Image manifest — all 47 hero-tier images ──────────────────────────────

interface GalleryImage {
  src: string;
  guardian: string;
  slug: string;
  label: string;
  tier: "hero" | "gallery";
  accent: string;
  element: string;
}

const ALL_IMAGES: GalleryImage[] = [
  // Aiyami
  { src: "/guardians/aiyami-hero.webp",      guardian: "Aiyami",     slug: "aiyami",     label: "Celestial Crown Presence",         tier: "hero",    accent: "text-amber-300",   element: "Void" },
  { src: "/guardians/gallery/aiyami-gallery-2.webp", guardian: "Aiyami", slug: "aiyami", label: "In The Vibrant Dreamy Garden",    tier: "gallery", accent: "text-amber-300",   element: "Void" },
  { src: "/guardians/gallery/aiyami-gallery-3.webp", guardian: "Aiyami", slug: "aiyami", label: "Radiant Celestial Presence",       tier: "gallery", accent: "text-amber-300",   element: "Void" },
  { src: "/guardians/gallery/aiyami-gallery-4.webp", guardian: "Aiyami", slug: "aiyami", label: "The Dawn Bringer",                 tier: "gallery", accent: "text-amber-300",   element: "Void" },
  { src: "/guardians/gallery/aiyami-gallery-5.webp", guardian: "Aiyami", slug: "aiyami", label: "Enchanting Celestial Figure",      tier: "gallery", accent: "text-amber-300",   element: "Void" },
  // Alera
  { src: "/guardians/alera-hero.webp",       guardian: "Alera",      slug: "alera",      label: "Alera — Voice Guardian",           tier: "hero",    accent: "text-sky-300",     element: "Fire" },
  { src: "/guardians/gallery/alera-gallery-2.webp",  guardian: "Alera",  slug: "alera",  label: "Democratizing Music Creation",    tier: "gallery", accent: "text-sky-300",     element: "Fire" },
  { src: "/guardians/gallery/alera-gallery-3.webp",  guardian: "Alera",  slug: "alera",  label: "Empowering Musicians",            tier: "gallery", accent: "text-sky-300",     element: "Fire" },
  { src: "/guardians/gallery/alera-gallery-4.webp",  guardian: "Alera",  slug: "alera",  label: "Goddess Rockstar Energy",         tier: "gallery", accent: "text-sky-300",     element: "Fire" },
  { src: "/guardians/gallery/alera-gallery-5.webp",  guardian: "Alera",  slug: "alera",  label: "Voice of Creation",               tier: "gallery", accent: "text-sky-300",     element: "Fire" },
  // Draconia
  { src: "/guardians/draconia-hero.webp",    guardian: "Draconia",   slug: "draconia",   label: "Draconia — Fire Guardian",         tier: "hero",    accent: "text-orange-400",  element: "Fire" },
  { src: "/guardians/gallery/draconia-gallery-2.webp", guardian: "Draconia", slug: "draconia", label: "Arcanean Creator Dragon",   tier: "gallery", accent: "text-orange-400",  element: "Fire" },
  { src: "/guardians/gallery/draconia-gallery-3.webp", guardian: "Draconia", slug: "draconia", label: "Arcanean Dragon",           tier: "gallery", accent: "text-orange-400",  element: "Fire" },
  { src: "/guardians/gallery/draconia-gallery-4.webp", guardian: "Draconia", slug: "draconia", label: "Trinity Fusion",            tier: "gallery", accent: "text-orange-400",  element: "Fire" },
  { src: "/guardians/gallery/draconia-gallery-5.webp", guardian: "Draconia", slug: "draconia", label: "Dragon Rider",             tier: "gallery", accent: "text-orange-400",  element: "Fire" },
  // Elara
  { src: "/guardians/elara-hero.webp",       guardian: "Elara",      slug: "elara",      label: "Elara — Shift Guardian",           tier: "hero",    accent: "text-emerald-300", element: "Wind" },
  { src: "/guardians/gallery/elara-gallery-2.webp",   guardian: "Elara",  slug: "elara",  label: "Legendary Hunter & Wolf Spirit",  tier: "gallery", accent: "text-emerald-300", element: "Wind" },
  { src: "/guardians/gallery/elara-gallery-3.webp",   guardian: "Elara",  slug: "elara",  label: "Arcanean Codex",                  tier: "gallery", accent: "text-emerald-300", element: "Wind" },
  { src: "/guardians/gallery/elara-gallery-4.webp",   guardian: "Elara",  slug: "elara",  label: "The Transformed World",           tier: "gallery", accent: "text-emerald-300", element: "Wind" },
  { src: "/guardians/gallery/elara-gallery-5.webp",   guardian: "Elara",  slug: "elara",  label: "Consciousness Civilization",      tier: "gallery", accent: "text-emerald-300", element: "Wind" },
  // Ino
  { src: "/guardians/ino-hero.webp",         guardian: "Ino",        slug: "ino",        label: "Ino — Unity Guardian",             tier: "hero",    accent: "text-fuchsia-300", element: "Earth" },
  { src: "/guardians/gallery/ino-gallery-2.webp",     guardian: "Ino",    slug: "ino",    label: "The Epic Battle",                 tier: "gallery", accent: "text-fuchsia-300", element: "Earth" },
  { src: "/guardians/gallery/ino-gallery-3.webp",     guardian: "Ino",    slug: "ino",    label: "Celestial Guardian Presence",     tier: "gallery", accent: "text-fuchsia-300", element: "Earth" },
  { src: "/guardians/gallery/ino-gallery-4.webp",     guardian: "Ino",    slug: "ino",    label: "Unified Arcanean Civilization",   tier: "gallery", accent: "text-fuchsia-300", element: "Earth" },
  { src: "/guardians/gallery/ino-gallery-5.webp",     guardian: "Ino",    slug: "ino",    label: "Mind-Body-Soul Integration",      tier: "gallery", accent: "text-fuchsia-300", element: "Earth" },
  // Leyla
  { src: "/guardians/leyla-hero.webp",       guardian: "Leyla",      slug: "leyla",      label: "Leyla — Flow Guardian",            tier: "hero",    accent: "text-cyan-300",    element: "Water" },
  { src: "/guardians/gallery/leyla-gallery-2.webp",   guardian: "Leyla",  slug: "leyla",  label: "Mamoru the Starlight Wolf",       tier: "gallery", accent: "text-cyan-300",    element: "Water" },
  { src: "/guardians/gallery/leyla-gallery-3.webp",   guardian: "Leyla",  slug: "leyla",  label: "Atlantia & the Glowing Dolphin",  tier: "gallery", accent: "text-cyan-300",    element: "Water" },
  { src: "/guardians/gallery/leyla-gallery-4.webp",   guardian: "Leyla",  slug: "leyla",  label: "Aquarion Underwater City",        tier: "gallery", accent: "text-cyan-300",    element: "Water" },
  { src: "/guardians/gallery/leyla-gallery-5.webp",   guardian: "Leyla",  slug: "leyla",  label: "Underwater Healing Sanctuary",    tier: "gallery", accent: "text-cyan-300",    element: "Water" },
  // Lyria
  { src: "/guardians/lyria-hero.webp",       guardian: "Lyria",      slug: "lyria",      label: "Lyria — Sight Guardian",           tier: "hero",    accent: "text-violet-300",  element: "Void" },
  { src: "/guardians/gallery/lyria-gallery-2.webp",   guardian: "Lyria",  slug: "lyria",  label: "Starlight in Our Minds",          tier: "gallery", accent: "text-violet-300",  element: "Void" },
  { src: "/guardians/gallery/lyria-gallery-3.webp",   guardian: "Lyria",  slug: "lyria",  label: "Vision of Arcanea",               tier: "gallery", accent: "text-violet-300",  element: "Void" },
  { src: "/guardians/gallery/lyria-gallery-4.webp",   guardian: "Lyria",  slug: "lyria",  label: "Cyborg Elf Vision",               tier: "gallery", accent: "text-violet-300",  element: "Void" },
  { src: "/guardians/gallery/lyria-gallery-5.webp",   guardian: "Lyria",  slug: "lyria",  label: "Final Vision of Harmony",         tier: "gallery", accent: "text-violet-300",  element: "Void" },
  // Lyssandria
  { src: "/guardians/lyssandria-hero.webp",  guardian: "Lyssandria", slug: "lyssandria", label: "Lyssandria — Foundation Guardian", tier: "hero",    accent: "text-amber-400",   element: "Earth" },
  { src: "/guardians/gallery/lyssandria-gallery-2.webp", guardian: "Lyssandria", slug: "lyssandria", label: "Earth Guardian Presence", tier: "gallery", accent: "text-amber-400", element: "Earth" },
  // Maylinn
  { src: "/guardians/maylinn-hero.webp",     guardian: "Maylinn",    slug: "maylinn",    label: "Maylinn — Heart Guardian",         tier: "hero",    accent: "text-pink-300",    element: "Wind" },
  { src: "/guardians/gallery/maylinn-gallery-2.webp", guardian: "Maylinn", slug: "maylinn", label: "Legendary Healer & Butterfly",  tier: "gallery", accent: "text-pink-300",    element: "Wind" },
  { src: "/guardians/gallery/maylinn-gallery-3.webp", guardian: "Maylinn", slug: "maylinn", label: "Healing Presence",              tier: "gallery", accent: "text-pink-300",    element: "Wind" },
  { src: "/guardians/gallery/maylinn-gallery-4.webp", guardian: "Maylinn", slug: "maylinn", label: "Consciousness Restoration",     tier: "gallery", accent: "text-pink-300",    element: "Wind" },
  { src: "/guardians/gallery/maylinn-gallery-5.webp", guardian: "Maylinn", slug: "maylinn", label: "Healing Sanctuary",             tier: "gallery", accent: "text-pink-300",    element: "Wind" },
  // Shinkami
  { src: "/guardians/shinkami-hero.webp",    guardian: "Shinkami",   slug: "shinkami",   label: "Shinkami — Source Guardian",       tier: "hero",    accent: "text-yellow-200",  element: "Spirit" },
  { src: "/guardians/gallery/shinkami-gallery-2.webp", guardian: "Shinkami", slug: "shinkami", label: "Arcanea — Cinematic City",  tier: "gallery", accent: "text-yellow-200",  element: "Spirit" },
  { src: "/guardians/gallery/shinkami-gallery-3.webp", guardian: "Shinkami", slug: "shinkami", label: "Dark Cosmic Entity",        tier: "gallery", accent: "text-yellow-200",  element: "Spirit" },
  { src: "/guardians/gallery/shinkami-gallery-4.webp", guardian: "Shinkami", slug: "shinkami", label: "Arcanean Floating Islands",  tier: "gallery", accent: "text-yellow-200",  element: "Spirit" },
  { src: "/guardians/gallery/shinkami-gallery-5.webp", guardian: "Shinkami", slug: "shinkami", label: "Futuristic Cityscape 2025",  tier: "gallery", accent: "text-yellow-200",  element: "Spirit" },
];

const GUARDIANS = ["All", "Aiyami", "Alera", "Draconia", "Elara", "Ino", "Leyla", "Lyria", "Lyssandria", "Maylinn", "Shinkami"];

export default function GalleryPage() {
  const [activeGuardian, setActiveGuardian] = useState("All");

  const filtered = activeGuardian === "All"
    ? ALL_IMAGES
    : ALL_IMAGES.filter((img) => img.guardian === activeGuardian);

  return (
    <div className="min-h-screen bg-cosmic-deep">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-xs font-sans text-text-muted uppercase tracking-widest mb-4">
            <span>Arcanea</span>
            <span>/</span>
            <span>Gallery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            The Arcanea Gallery
          </h1>
          <p className="text-text-secondary font-sans max-w-xl">
            {ALL_IMAGES.length} curated visions across ten Gates. Hero portraits, world imagery, and sacred scenes from the Arcanean universe.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-0 z-10 bg-cosmic-deep/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {GUARDIANS.map((g) => {
              const count = g === "All" ? ALL_IMAGES.length : ALL_IMAGES.filter((i) => i.guardian === g).length;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGuardian(g)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-sans transition-all ${
                    activeGuardian === g
                      ? "bg-arcane-crystal/20 text-arcane-crystal border border-arcane-crystal/30"
                      : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {g}
                  <span className="ml-1.5 text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((img, i) => (
            <Link
              key={img.src}
              href={`/lore/guardians/${img.slug}`}
              className="break-inside-avoid block group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-white/20 transition-all hover-lift"
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading={i < 12 ? "eager" : "lazy"}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {img.tier === "hero" && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-arcane-gold/20 text-arcane-gold border border-arcane-gold/30 mb-1.5">
                    Hero
                  </span>
                )}
                <p className="text-sm font-sans font-medium text-white">{img.label}</p>
                <p className={`text-xs font-sans mt-0.5 ${img.accent}`}>{img.guardian} · {img.element}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center py-16 border-t border-white/5">
          <p className="text-text-muted font-sans mb-2 text-sm">
            Showing {filtered.length} of {ALL_IMAGES.length} images
          </p>
          <p className="text-text-secondary font-sans mb-6">
            Community creations coming soon. Every creator who joins adds to this gallery.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-arcane-crystal/10 border border-arcane-crystal/20 text-arcane-crystal font-sans text-sm hover:bg-arcane-crystal/20 transition-all"
          >
            Create in Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
