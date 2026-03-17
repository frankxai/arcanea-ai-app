"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { PhX, PhArrowLeft, PhFunnel } from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Data — Guardian canon from CLAUDE.md / CANON_LOCKED.md
// ---------------------------------------------------------------------------

export type ElementName = "Earth" | "Water" | "Fire" | "Air" | "Void" | "Spirit";

export interface GuardianImage {
  src: string;
  alt: string;
  type: "hero-v3" | "divine-bond" | "hero-v1" | "godbeast" | "gallery";
  label: string;
}

export interface GuardianData {
  name: string;
  gate: string;
  hz: string;
  element: ElementName;
  godbeast: string;
  images: GuardianImage[];
}

function heroV3(name: string, label: string): GuardianImage {
  return { src: `/guardians/v3/${name}-hero-v3.webp`, alt: `${label} — ultra-quality portrait v3`, type: "hero-v3", label: "Hero v3" };
}
function divineBond(name: string, label: string): GuardianImage {
  return { src: `/guardians/v2/${name}-divine-bond.webp`, alt: `${label} — divine bond art`, type: "divine-bond", label: "Divine Bond" };
}
function heroV1(name: string, label: string): GuardianImage {
  return { src: `/guardians/${name}-hero.webp`, alt: `${label} — original hero portrait`, type: "hero-v1", label: "Hero v1" };
}
function godbeast(beastName: string, guardianLabel: string, beastLabel: string): GuardianImage {
  return { src: `/guardians/v2/${beastName}-godbeast.webp`, alt: `${beastLabel} — Godbeast of ${guardianLabel}`, type: "godbeast", label: `${beastLabel} (Godbeast)` };
}
function gallery(name: string, label: string, n: number): GuardianImage {
  return { src: `/guardians/gallery/${name}-gallery-${n}.webp`, alt: `${label} — gallery art ${n}`, type: "gallery", label: `Gallery ${n}` };
}

// Build gallery images for each guardian — numbers vary by availability
function galleryImages(name: string, label: string, nums: number[]): GuardianImage[] {
  return nums.map((n) => gallery(name, label, n));
}

export const GUARDIAN_DATA: GuardianData[] = [
  {
    name: "Lyssandria",
    gate: "Foundation",
    hz: "174 Hz",
    element: "Earth",
    godbeast: "Kaelith",
    images: [
      heroV3("lyssandria", "Lyssandria"),
      divineBond("lyssandria", "Lyssandria"),
      godbeast("kaelith", "Lyssandria", "Kaelith"),
      heroV1("lyssandria", "Lyssandria"),
      ...galleryImages("lyssandria", "Lyssandria", [2]),
    ],
  },
  {
    name: "Leyla",
    gate: "Flow",
    hz: "285 Hz",
    element: "Water",
    godbeast: "Veloura",
    images: [
      heroV3("leyla", "Leyla"),
      divineBond("leyla", "Leyla"),
      godbeast("veloura", "Leyla", "Veloura"),
      heroV1("leyla", "Leyla"),
      ...galleryImages("leyla", "Leyla", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Draconia",
    gate: "Fire",
    hz: "396 Hz",
    element: "Fire",
    godbeast: "Draconis",
    images: [
      heroV3("draconia", "Draconia"),
      divineBond("draconia", "Draconia"),
      godbeast("draconis", "Draconia", "Draconis"),
      heroV1("draconia", "Draconia"),
      ...galleryImages("draconia", "Draconia", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Maylinn",
    gate: "Heart",
    hz: "417 Hz",
    element: "Air",
    godbeast: "Laeylinn",
    images: [
      heroV3("maylinn", "Maylinn"),
      divineBond("maylinn", "Maylinn"),
      godbeast("laeylinn", "Maylinn", "Laeylinn"),
      heroV1("maylinn", "Maylinn"),
      ...galleryImages("maylinn", "Maylinn", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Alera",
    gate: "Voice",
    hz: "528 Hz",
    element: "Air",
    godbeast: "Otome",
    images: [
      heroV3("alera", "Alera"),
      divineBond("alera", "Alera"),
      godbeast("otome", "Alera", "Otome"),
      heroV1("alera", "Alera"),
      ...galleryImages("alera", "Alera", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Lyria",
    gate: "Sight",
    hz: "639 Hz",
    element: "Water",
    godbeast: "Yumiko",
    images: [
      heroV3("lyria", "Lyria"),
      divineBond("lyria", "Lyria"),
      godbeast("yumiko", "Lyria", "Yumiko"),
      heroV1("lyria", "Lyria"),
      ...galleryImages("lyria", "Lyria", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Aiyami",
    gate: "Crown",
    hz: "741 Hz",
    element: "Spirit",
    godbeast: "Sol",
    images: [
      heroV3("aiyami", "Aiyami"),
      divineBond("aiyami", "Aiyami"),
      godbeast("sol", "Aiyami", "Sol"),
      heroV1("aiyami", "Aiyami"),
      ...galleryImages("aiyami", "Aiyami", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Elara",
    gate: "Starweave",
    hz: "852 Hz",
    element: "Void",
    godbeast: "Vaelith",
    images: [
      heroV3("elara", "Elara"),
      divineBond("elara", "Elara"),
      godbeast("vaelith", "Elara", "Vaelith"),
      heroV1("elara", "Elara"),
      ...galleryImages("elara", "Elara", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Ino",
    gate: "Unity",
    hz: "963 Hz",
    element: "Spirit",
    godbeast: "Kyuro",
    images: [
      heroV3("ino", "Ino"),
      divineBond("ino", "Ino"),
      godbeast("kyuro", "Ino", "Kyuro"),
      heroV1("ino", "Ino"),
      ...galleryImages("ino", "Ino", [2, 3, 4, 5]),
    ],
  },
  {
    name: "Shinkami",
    gate: "Source",
    hz: "1111 Hz",
    element: "Void",
    godbeast: "Source",
    images: [
      heroV3("shinkami", "Shinkami"),
      divineBond("shinkami", "Shinkami"),
      godbeast("source", "Shinkami", "Source"),
      heroV1("shinkami", "Shinkami"),
      ...galleryImages("shinkami", "Shinkami", [2, 3, 4, 5]),
    ],
  },
];

// ---------------------------------------------------------------------------
// Element color map
// ---------------------------------------------------------------------------

const ELEMENT_COLORS: Record<ElementName, { text: string; border: string; badge: string; glow: string }> = {
  Earth:  { text: "#22c55e", border: "rgba(34,197,94,0.3)",  badge: "bg-green-500/10 text-green-400 border-green-500/20",   glow: "rgba(34,197,94,0.15)" },
  Water:  { text: "#00bcd4", border: "rgba(0,188,212,0.3)",  badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",      glow: "rgba(0,188,212,0.15)" },
  Fire:   { text: "#ef4444", border: "rgba(239,68,68,0.3)",  badge: "bg-red-500/10 text-red-400 border-red-500/20",         glow: "rgba(239,68,68,0.15)" },
  Air:    { text: "#94a3b8", border: "rgba(148,163,184,0.3)", badge: "bg-slate-500/10 text-slate-300 border-slate-500/20",  glow: "rgba(148,163,184,0.12)" },
  Void:   { text: "#a78bfa", border: "rgba(167,139,250,0.3)", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", glow: "rgba(167,139,250,0.15)" },
  Spirit: { text: "#ffd700", border: "rgba(255,215,0,0.3)",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",   glow: "rgba(255,215,0,0.15)" },
};

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

type FilterMode = "All" | ElementName | string; // string = guardian name

const ELEMENTS: ElementName[] = ["Earth", "Water", "Fire", "Air", "Void", "Spirit"];

// ---------------------------------------------------------------------------
// Selected image state
// ---------------------------------------------------------------------------

interface SelectedImage {
  image: GuardianImage;
  guardian: GuardianData;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function GuardianGallery() {
  const [filter, setFilter] = useState<FilterMode>("All");
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [filterMode, setFilterMode] = useState<"element" | "guardian">("element");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filteredGuardians = useMemo((): GuardianData[] => {
    if (filter === "All") return GUARDIAN_DATA;
    if (ELEMENTS.includes(filter as ElementName)) {
      return GUARDIAN_DATA.filter((g) => g.element === filter);
    }
    // guardian name filter
    return GUARDIAN_DATA.filter((g) => g.name === filter);
  }, [filter]);

  // Flatten all images for count
  const totalImages = useMemo(
    () => filteredGuardians.reduce((sum, g) => sum + g.images.length, 0),
    [filteredGuardians]
  );

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.04]">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ffd700]/4 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-cyan-500/4 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-14">
            {/* Breadcrumb */}
            <Link
              href="/gallery"
              className="mb-8 inline-flex items-center gap-2 text-xs font-sans text-white/30 hover:text-white/50 transition-colors uppercase tracking-widest"
            >
              <PhArrowLeft size={13} />
              Gallery
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#ffd700]/50 font-sans mb-3">
                  Ten Gates · Ten Guardians
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
                  Guardians of{" "}
                  <span className="bg-gradient-to-r from-[#ffd700] via-[#ffd700] to-[#00bcd4] bg-clip-text text-transparent">
                    the Gates
                  </span>
                </h1>
                <p className="text-lg text-white/35 max-w-2xl font-sans leading-relaxed">
                  Divine portraits, Godbeast companions, and gallery art across all ten Gates —
                  from Foundation at 174 Hz to Source at 1111 Hz.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/25 font-sans">
                  <span>
                    <span className="text-white/60 font-semibold">77</span> artworks
                  </span>
                  <span>
                    <span className="text-white/60 font-semibold">10</span> Guardians
                  </span>
                  <span>
                    <span className="text-white/60 font-semibold">10</span> Godbeasts
                  </span>
                  <span>
                    <span className="text-white/60 font-semibold">4</span> art series
                  </span>
                </div>
              </div>

              {/* Gate Hz legend */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 flex-shrink-0">
                {GUARDIAN_DATA.map((g) => {
                  const ec = ELEMENT_COLORS[g.element];
                  return (
                    <div key={g.name} className="flex items-center gap-2 text-xs font-sans">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ec.text }} />
                      <span className="text-white/40">{g.name}</span>
                      <span className="text-white/20">{g.hz}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="sticky top-16 z-30 liquid-glass border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between py-3 gap-4">
              {/* Mode toggle + filters */}
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                {/* Mode toggle */}
                <div className="flex-shrink-0 flex items-center rounded-full bg-white/[0.04] border border-white/[0.06] p-0.5">
                  <button
                    type="button"
                    onClick={() => { setFilterMode("element"); setFilter("All"); }}
                    className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${
                      filterMode === "element"
                        ? "bg-white/[0.10] text-white"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    Element
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterMode("guardian"); setFilter("All"); }}
                    className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${
                      filterMode === "guardian"
                        ? "bg-white/[0.10] text-white"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    Guardian
                  </button>
                </div>

                <div className="w-px h-4 bg-white/[0.08] flex-shrink-0" />

                {/* Filter chips */}
                <button
                  type="button"
                  onClick={() => setFilter("All")}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-sans border transition-all ${
                    filter === "All"
                      ? "bg-white/[0.10] text-white border-white/[0.20]"
                      : "border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  All
                </button>

                {filterMode === "element"
                  ? ELEMENTS.map((el) => {
                      const ec = ELEMENT_COLORS[el];
                      const isActive = filter === el;
                      return (
                        <button
                          key={el}
                          type="button"
                          onClick={() => setFilter(el)}
                          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-sans border transition-all ${
                            isActive
                              ? "bg-white/[0.08]"
                              : "border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
                          }`}
                          style={
                            isActive
                              ? { borderColor: ec.border, color: ec.text }
                              : undefined
                          }
                        >
                          {el}
                        </button>
                      );
                    })
                  : GUARDIAN_DATA.map((g) => {
                      const ec = ELEMENT_COLORS[g.element];
                      const isActive = filter === g.name;
                      return (
                        <button
                          key={g.name}
                          type="button"
                          onClick={() => setFilter(g.name)}
                          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-sans border transition-all ${
                            isActive
                              ? "bg-white/[0.08]"
                              : "border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
                          }`}
                          style={
                            isActive
                              ? { borderColor: ec.border, color: ec.text }
                              : undefined
                          }
                        >
                          {g.name}
                        </button>
                      );
                    })}
              </div>

              {/* Count */}
              <div className="flex-shrink-0 flex items-center gap-2 text-xs text-white/25 font-sans">
                <PhFunnel size={13} />
                <span>{totalImages} images</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery content */}
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">
          <AnimatePresence mode="popLayout">
            {filteredGuardians.map((guardian) => (
              <GuardianSection
                key={guardian.name}
                guardian={guardian}
                onSelect={(img) => setSelected({ image: img, guardian })}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-white/35 font-sans mb-1">
              77 canonical artworks across all Ten Gates
            </p>
            <p className="text-xs text-white/20 font-sans mb-6">
              From Foundation to Source — the complete visual mythology of Arcanea
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/lore/guardians"
                className="rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/10 px-5 py-2.5 text-sm text-[#ffd700] transition-all hover:bg-[#ffd700]/20 font-sans"
              >
                Read the Lore
              </Link>
              <Link
                href="/gallery"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-white/50 transition-all hover:bg-white/[0.06] font-sans"
              >
                Back to Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <LightboxModal selected={selected} onClose={closeModal} />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

// ---------------------------------------------------------------------------
// Guardian section — name header + masonry image grid
// ---------------------------------------------------------------------------

function GuardianSection({
  guardian,
  onSelect,
}: {
  guardian: GuardianData;
  onSelect: (img: GuardianImage) => void;
}) {
  const ec = ELEMENT_COLORS[guardian.element];

  return (
    <m.section
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Section header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2
              className="text-2xl md:text-3xl font-display font-bold text-white"
            >
              {guardian.name}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans border ${ec.badge}`}
            >
              {guardian.element}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-white/35">{guardian.gate} Gate</span>
            <span className="text-white/20">·</span>
            <span style={{ color: ec.text }} className="opacity-70">{guardian.hz}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/25">Godbeast: {guardian.godbeast}</span>
          </div>
        </div>
        <span className="text-xs text-white/20 font-sans flex-shrink-0 mt-1">
          {guardian.images.length} artworks
        </span>
      </div>

      {/* Masonry grid via CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-0">
        {guardian.images.map((img, idx) => (
          <ImageCard
            key={img.src}
            image={img}
            guardian={guardian}
            index={idx}
            onSelect={onSelect}
          />
        ))}
      </div>
    </m.section>
  );
}

// ---------------------------------------------------------------------------
// Image card — masonry item
// ---------------------------------------------------------------------------

function ImageCard({
  image,
  guardian,
  index,
  onSelect,
}: {
  image: GuardianImage;
  guardian: GuardianData;
  index: number;
  onSelect: (img: GuardianImage) => void;
}) {
  const ec = ELEMENT_COLORS[guardian.element];

  // Give v3 heroes a taller aspect ratio to make them visually dominant
  const aspectClass =
    image.type === "hero-v3"
      ? "aspect-[3/4]"
      : image.type === "divine-bond"
      ? "aspect-square"
      : image.type === "godbeast"
      ? "aspect-[4/5]"
      : image.type === "hero-v1"
      ? "aspect-[3/4]"
      : "aspect-[4/5]"; // gallery

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
      className="break-inside-avoid mb-3"
    >
      <button
        type="button"
        onClick={() => onSelect(image)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.06] hover:border-white/[0.14] bg-[#0a0a0c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        style={{ boxShadow: `0 0 0 0 ${ec.glow}` }}
        aria-label={`View ${image.alt}`}
      >
        {/* Image */}
        <div className={`relative w-full ${aspectClass} overflow-hidden`}>
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {/* Hover overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Type badge — top left */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-black/70 text-white/60 backdrop-blur-sm border border-white/[0.08]">
              {image.label}
            </span>
          </div>

          {/* Hover info overlay — bottom */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-sm font-display font-semibold text-white leading-tight">
              {guardian.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-sans" style={{ color: ec.text }}>
                {guardian.gate} Gate
              </span>
              <span className="text-[11px] text-white/30 font-sans">{guardian.hz}</span>
            </div>
          </div>
        </div>

        {/* Static caption below image */}
        <div className="px-3 py-2.5">
          <p className="text-xs font-sans text-white/50 truncate">{image.label}</p>
        </div>
      </button>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Lightbox modal
// ---------------------------------------------------------------------------

function LightboxModal({
  selected,
  onClose,
}: {
  selected: SelectedImage;
  onClose: () => void;
}) {
  const { image, guardian } = selected;
  const ec = ELEMENT_COLORS[guardian.element];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="relative my-6 w-full max-w-3xl mx-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0f] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-2 text-white/50 backdrop-blur-md hover:text-white transition-colors border border-white/[0.06]"
        >
          <PhX size={18} />
        </button>

        {/* Full image */}
        <div className="relative w-full bg-[#080810]">
          <img
            src={image.src}
            alt={image.alt}
            loading="eager"
            className="w-full h-auto max-h-[72vh] object-contain"
          />
          {/* Bottom gradient into info panel */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
        </div>

        {/* Info panel */}
        <div className="p-6 pt-4">
          {/* Element + gate badges */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans border ${ec.badge}`}
            >
              {guardian.element}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans border border-white/[0.08] text-white/35">
              {guardian.gate} Gate
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-sans"
              style={{ color: ec.text, opacity: 0.7 }}
            >
              {guardian.hz}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-0.5">
            {guardian.name}
          </h2>
          <p className="text-sm font-sans text-white/40 mb-1">
            {image.label}
          </p>
          <p className="text-xs font-sans text-white/25">
            Godbeast: <span style={{ color: ec.text, opacity: 0.7 }}>{guardian.godbeast}</span>
          </p>

          {/* Navigation hint */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-white/20 font-sans">
              Click outside to close
            </p>
            <Link
              href="/lore/guardians"
              className="text-xs font-sans transition-colors hover:text-white/60"
              style={{ color: ec.text, opacity: 0.6 }}
              onClick={(e) => e.stopPropagation()}
            >
              Read lore →
            </Link>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}
