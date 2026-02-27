"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GalleryImage {
  src: string;
  guardian: string;
  slug: string;
  label: string;
  tier: "hero" | "gallery" | "community";
  accent: string;
  element: string;
  gate: string;
}

const GUARDIANS_ORDER = [
  "All", "Aiyami", "Alera", "Draconia", "Elara",
  "Ino", "Leyla", "Lyria", "Lyssandria", "Maylinn", "Shinkami",
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeGuardian, setActiveGuardian] = useState("All");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setImages(data.images ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeGuardian === "All"
      ? images
      : images.filter((img) => img.guardian === activeGuardian);

  const guardianCounts = GUARDIANS_ORDER.map((g) => ({
    name: g,
    count:
      g === "All"
        ? images.length
        : images.filter((i) => i.guardian === g).length,
  }));

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
            {loading ? (
              <span className="inline-block w-48 h-4 bg-white/5 rounded animate-pulse" />
            ) : (
              `${total} visions across ten Gates. Hero portraits, world imagery, and sacred scenes from the Arcanean universe.`
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-0 z-10 bg-cosmic-deep/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {guardianCounts.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => setActiveGuardian(name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-sans transition-all ${
                  activeGuardian === name
                    ? "bg-arcane-crystal/20 text-arcane-crystal border border-arcane-crystal/30"
                    : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {name}
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl bg-white/5"
                style={{ height: `${160 + (i % 4) * 40}px` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-text-secondary">
            <p className="text-lg mb-2">No images for this Guardian yet</p>
            <p className="text-sm">More are being prepared — check back soon.</p>
          </div>
        ) : (
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
                  {img.tier !== "gallery" && (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider mb-1.5 ${
                      img.tier === "hero"
                        ? "bg-arcane-gold/20 text-arcane-gold border border-arcane-gold/30"
                        : "bg-arcane-cosmic/20 text-arcane-cosmic border border-arcane-cosmic/30"
                    }`}>
                      {img.tier === "hero" ? "Hero" : "Community"}
                    </span>
                  )}
                  <p className="text-sm font-sans font-medium text-white">{img.label}</p>
                  <p className={`text-xs font-sans mt-0.5 ${img.accent}`}>
                    {img.guardian} · {img.element}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="mt-20 text-center py-16 border-t border-white/5">
            <p className="text-text-muted font-sans mb-2 text-sm">
              Showing {filtered.length} of {total} images
            </p>
            <p className="text-text-secondary font-sans mb-6">
              Community creations and world imagery being added continuously.
              Every creator who joins adds to this gallery.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-arcane-crystal/10 border border-arcane-crystal/20 text-arcane-crystal font-sans text-sm hover:bg-arcane-crystal/20 transition-all"
            >
              Create in Studio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
