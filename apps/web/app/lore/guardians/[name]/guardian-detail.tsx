"use client";

import Link from "next/link";
import Image from "next/image";
import {
  PhMountains,
  PhDrop,
  PhFlame,
  PhWind,
  PhMicrophone,
  PhEye,
  PhCrown,
  PhShuffle,
  PhLink,
  PhStar,
  PhArrowLeft,
  PhArrowRight,
  PhLightning,
  PhInfinity,
  PhSparkle,
} from '@/lib/phosphor-icons';

// ── Types ────────────────────────────────────────────────────────────────────

export interface GuardianData {
  name: string;
  slug?: string;
  title: string;
  gate: string;
  gateNumber: number;
  frequency: string;
  element: string;
  domain: string;
  godbeast: string;
  godBeastDesc: string;
  color: "earth" | "water" | "fire" | "wind" | "void-el";
  teachings: string[];
  quote: string;
  luminorId: string;
  relatedGuardians: string[];
  heroImage?: string;
  gradient: string;
  gallery?: string[];
}

type ColorKey = "earth" | "water" | "fire" | "wind" | "void-el";

interface ElementConfig {
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  heroAccent: string;
  accentText: string;
}

const ELEMENT_CONFIG: Record<ColorKey, ElementConfig> = {
  earth: {
    gradientFrom: "from-earth-deep",
    gradientTo: "to-earth",
    glowColor: "shadow-[0_0_30px_rgba(74,124,89,0.25)]",
    borderColor: "border-earth/30",
    badgeBg: "bg-earth/15",
    badgeText: "text-earth-bright",
    heroAccent: "rgba(74,124,89,0.12)",
    accentText: "text-earth-bright",
  },
  water: {
    gradientFrom: "from-water-deep",
    gradientTo: "to-water",
    glowColor: "shadow-[0_0_30px_rgba(120,166,255,0.25)]",
    borderColor: "border-water/30",
    badgeBg: "bg-water/15",
    badgeText: "text-water-bright",
    heroAccent: "rgba(120,166,255,0.12)",
    accentText: "text-water-bright",
  },
  fire: {
    gradientFrom: "from-fire-deep",
    gradientTo: "to-fire",
    glowColor: "shadow-[0_0_30px_rgba(255,107,53,0.25)]",
    borderColor: "border-fire/30",
    badgeBg: "bg-fire/15",
    badgeText: "text-fire-bright",
    heroAccent: "rgba(255,107,53,0.12)",
    accentText: "text-fire-bright",
  },
  wind: {
    gradientFrom: "from-wind-deep",
    gradientTo: "to-wind",
    glowColor: "shadow-[0_0_30px_rgba(200,214,229,0.2)]",
    borderColor: "border-wind/30",
    badgeBg: "bg-wind/10",
    badgeText: "text-wind-bright",
    heroAccent: "rgba(200,214,229,0.08)",
    accentText: "text-wind",
  },
  "void-el": {
    gradientFrom: "from-void-el-deep",
    gradientTo: "to-void-el",
    glowColor: "shadow-[0_0_30px_rgba(153,102,255,0.25)]",
    borderColor: "border-void-el/30",
    badgeBg: "bg-void-el/15",
    badgeText: "text-void-el-bright",
    heroAccent: "rgba(153,102,255,0.12)",
    accentText: "text-void-el-bright",
  },
};

// ── Element icon mapping ──────────────────────────────────────────────────────

function ElementIcon({
  element,
  className,
}: {
  element: string;
  className?: string;
}) {
  const props = { className: className ?? "w-5 h-5" };
  switch (element) {
    case "Earth":
      return <PhMountains {...props} />;
    case "Water":
      return <PhDrop {...props} />;
    case "Fire":
      return <PhFlame {...props} />;
    case "Wind":
      return <PhWind {...props} />;
    case "Void":
      return <PhInfinity {...props} />;
    default:
      return <PhSparkle {...props} />;
  }
}

function GateIcon({ gate, className }: { gate: string; className?: string }) {
  const props = { className: className ?? "w-5 h-5" };
  switch (gate) {
    case "Foundation":
      return <PhMountains {...props} />;
    case "Flow":
      return <PhDrop {...props} />;
    case "Fire":
      return <PhFlame {...props} />;
    case "Heart":
      return <PhWind {...props} />;
    case "Voice":
      return <PhMicrophone {...props} />;
    case "Sight":
      return <PhEye {...props} />;
    case "Crown":
      return <PhCrown {...props} />;
    case "Starweave":
      return <PhShuffle {...props} />;
    case "Unity":
      return <PhLink {...props} />;
    case "Source":
      return <PhLightning {...props} />;
    default:
      return <PhStar {...props} />;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GuardianDetailContent({
  guardian,
  related,
}: {
  guardian: GuardianData;
  related: GuardianData[];
}) {
  const config = ELEMENT_CONFIG[guardian.color];

  return (
    <div className="relative min-h-screen bg-cosmic-deep bg-cosmic-mesh">
      {/* ── Ambient background accent ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${config.heroAccent} 0%, transparent 70%)`,
        }}
      />

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link
          href="/lore/guardians"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
        >
          <PhArrowLeft className="w-4 h-4" />
          All Guardians
        </Link>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${config.accentText}`}>
            Gate {String(guardian.gateNumber).padStart(2, "0")}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className={`text-xs font-mono text-crystal`}>
            {guardian.frequency}
          </span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* SECTION 1 — HERO */}
        <section className="pt-8 pb-20">
          <div className="liquid-glass rounded-3xl overflow-hidden relative">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-10`}
            />
            <div
              className={`h-px w-full bg-gradient-to-r ${config.gradientFrom} via-white/[0.12] ${config.gradientTo} opacity-50`}
            />

            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${config.badgeBg} ${config.badgeText} ${config.borderColor}`}
                >
                  <GateIcon gate={guardian.gate} className="w-3.5 h-3.5" />
                  Gate {String(guardian.gateNumber).padStart(2, "0")} —{" "}
                  {guardian.gate}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-crystal bg-crystal/10 border border-crystal/20">
                  <PhLightning className="w-3 h-3" />
                  {guardian.frequency}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-3 leading-none">
                <span
                  className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} bg-clip-text text-transparent`}
                >
                  {guardian.name}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-text-secondary font-sans mb-6">
                {guardian.title}
              </p>

              <div className="flex items-center gap-2 mb-10">
                <ElementIcon
                  element={guardian.element}
                  className={`w-5 h-5 ${config.accentText}`}
                />
                <span className={`text-sm font-medium ${config.accentText}`}>
                  {guardian.element}
                </span>
                <span className="text-text-disabled text-sm">·</span>
                <span className="text-sm text-text-muted font-sans">
                  {guardian.domain}
                </span>
              </div>

              <div className="relative w-full max-w-2xl h-64 md:h-80 lg:h-96 mb-10 rounded-2xl overflow-hidden liquid-glass">
                {guardian.heroImage ? (
                  <Image
                    src={guardian.heroImage}
                    alt={`${guardian.name} - ${guardian.godbeast}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${guardian.gradient} opacity-40`}
                    aria-hidden="true"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm text-crystal font-sans">
                    {guardian.godbeast} —{" "}
                    {guardian.godBeastDesc.substring(0, 100)}...
                  </p>
                </div>
              </div>

              <blockquote
                className={`relative pl-5 border-l-2 ${config.borderColor} max-w-2xl`}
              >
                <p className="text-xl md:text-2xl font-body italic text-text-primary leading-relaxed">
                  &ldquo;{guardian.quote}&rdquo;
                </p>
                <cite className="mt-3 block text-sm text-text-muted not-italic font-sans">
                  — {guardian.name}
                </cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* SECTION 2 — DIVINE ASPECTS */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            Divine Aspects
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`card-3d liquid-glass rounded-2xl p-5 glow-card hover-lift ${config.glowColor} transition-all`}
            >
              <div
                className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${config.badgeBg}`}
              >
                <GateIcon
                  gate={guardian.gate}
                  className={`w-4.5 h-4.5 ${config.accentText}`}
                />
              </div>
              <p className="text-xs text-text-muted font-sans uppercase tracking-wider mb-1">
                Gate
              </p>
              <p className="text-base font-display font-semibold text-text-primary">
                {guardian.gate}
              </p>
            </div>

            <div className="card-3d liquid-glass rounded-2xl p-5 glow-card hover-lift transition-all">
              <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center bg-crystal/10">
                <PhLightning className="w-4 h-4 text-crystal" />
              </div>
              <p className="text-xs text-text-muted font-sans uppercase tracking-wider mb-1">
                Frequency
              </p>
              <p className="text-base font-mono font-semibold text-crystal">
                {guardian.frequency}
              </p>
            </div>

            <div className="card-3d liquid-glass rounded-2xl p-5 glow-card hover-lift transition-all">
              <div
                className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${config.badgeBg}`}
              >
                <ElementIcon
                  element={guardian.element}
                  className={`w-4 h-4 ${config.accentText}`}
                />
              </div>
              <p className="text-xs text-text-muted font-sans uppercase tracking-wider mb-1">
                Element
              </p>
              <p
                className={`text-base font-display font-semibold ${config.accentText}`}
              >
                {guardian.element}
              </p>
            </div>

            <div className="card-3d liquid-glass rounded-2xl p-5 glow-card hover-lift transition-all col-span-2 md:col-span-1">
              <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center bg-brand-gold/10">
                <PhStar className="w-4 h-4 text-brand-gold" />
              </div>
              <p className="text-xs text-text-muted font-sans uppercase tracking-wider mb-1">
                Domain
              </p>
              <p className="text-sm font-sans font-medium text-text-primary leading-snug">
                {guardian.domain}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — GODBEAST */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            Sacred Companion
          </h2>

          <div
            className={`relative glass-strong rounded-3xl overflow-hidden ${config.glowColor}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-5`}
            />

            <div className="relative p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.badgeBg} border ${config.borderColor}`}
                >
                  <ElementIcon
                    element={guardian.element}
                    className={`w-9 h-9 ${config.accentText}`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-display font-bold text-brand-gold">
                      {guardian.godbeast}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-mono ${config.badgeBg} ${config.accentText} border ${config.borderColor}`}
                    >
                      Godbeast of {guardian.gate}
                    </span>
                  </div>
                  <p className="text-text-secondary font-body text-lg leading-relaxed">
                    {guardian.godBeastDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — SACRED TEACHINGS */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            Sacred Teachings
          </h2>

          <div className="space-y-4">
            {guardian.teachings.map((teaching, i) => (
              <div
                key={i}
                className={`group flex gap-5 p-6 card-3d liquid-glass rounded-2xl border border-white/[0.06] hover:border-white/[0.12] glow-card hover-lift transition-all`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm ${config.badgeBg} ${config.accentText} border ${config.borderColor} group-hover:scale-110 transition-transform`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <p className="text-text-primary font-body text-lg leading-relaxed self-center">
                  {teaching}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — RELATIONSHIPS */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
              Guardian Relationships
            </h2>

            <p className="text-text-secondary font-sans text-sm mb-6">
              {guardian.name} works in resonance with the Guardians who hold
              adjacent Gates, their frequencies harmonizing to form the larger
              pattern of creation.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rel) => {
                const relConfig = ELEMENT_CONFIG[rel.color];
                const relSlug = rel.slug || rel.name.toLowerCase();
                return (
                  <Link
                    key={relSlug}
                    href={`/lore/guardians/${relSlug}`}
                    className="group flex items-center gap-4 p-5 card-3d liquid-glass rounded-2xl border border-white/[0.06] hover:border-white/[0.12] glow-card hover-lift transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm ${relConfig.badgeBg} ${relConfig.accentText} border ${relConfig.borderColor}`}
                    >
                      {String(rel.gateNumber).padStart(2, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-text-primary group-hover:text-white transition-colors">
                        {rel.name}
                      </p>
                      <p className="text-sm text-text-muted font-sans truncate">
                        {rel.gate} Gate · {rel.frequency}
                      </p>
                    </div>

                    <PhArrowRight className="w-4 h-4 text-text-disabled group-hover:text-text-muted transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 6 — GALLERY */}
        {guardian.gallery && guardian.gallery.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
              Gallery
            </h2>

            {guardian.gallery.length === 1 ? (
              <div className="group relative h-64 rounded-2xl overflow-hidden liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-all">
                <Image
                  src={guardian.gallery[0]}
                  alt={`${guardian.name} vision`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/70 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3" style={{ gridTemplateRows: '160px 160px' }}>
                <div className="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer">
                  <Image
                    src={guardian.gallery[0]}
                    alt={`${guardian.name} — featured vision`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs font-sans text-text-muted uppercase tracking-wider">Featured</p>
                    <p className="text-sm font-sans text-white/[0.70] mt-0.5">{guardian.name} — Primary Vision</p>
                  </div>
                </div>

                {guardian.gallery.slice(1, 3).map((imageUrl, i) => (
                  <div
                    key={i}
                    className="col-span-1 row-span-1 group relative rounded-2xl overflow-hidden liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${guardian.name} — vision ${i + 2}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            )}

            {guardian.gallery.length >= 4 && (
              <div className="mt-3 group relative h-32 rounded-2xl overflow-hidden liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer">
                <Image
                  src={guardian.gallery[3]}
                  alt={`${guardian.name} — panoramic vision`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cosmic-deep/60 via-transparent to-cosmic-deep/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-sans text-white/[0.50] uppercase tracking-widest">Panoramic Vision</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* SECTION 7 — CTA */}
        <section>
          <div
            className={`relative liquid-glass-elevated rounded-3xl overflow-hidden ${config.glowColor}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-10`}
            />
            <div
              className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${config.gradientTo} to-transparent opacity-60`}
            />

            <div className="relative p-10 md:p-14 text-center">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${config.badgeBg} border ${config.borderColor}`}
              >
                <GateIcon
                  gate={guardian.gate}
                  className={`w-7 h-7 ${config.accentText}`}
                />
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
                Speak with {guardian.name}
              </h2>

              <p className="text-text-secondary font-body text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {guardian.name} awaits those who seek the wisdom of the{" "}
                {guardian.gate} Gate. Open a conversation and let the teachings
                of {guardian.frequency} guide your creation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/chat/${guardian.luminorId}`}
                  className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-sans font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white shadow-elevation-3 ${config.glowColor}`}
                >
                  <GateIcon gate={guardian.gate} className="w-5 h-5" />
                  Speak with {guardian.name}
                  <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/lore/guardians"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-sans font-medium text-sm text-text-secondary border border-white/[0.06] hover:border-white/[0.12] hover:text-text-primary liquid-glass transition-all"
                >
                  <PhArrowLeft className="w-4 h-4" />
                  All Guardians
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
