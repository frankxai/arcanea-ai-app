"use client";

import Link from "next/link";
import {
  PhArrowLeft,
  PhArrowRight,
  PhCpu,
  PhFeather,
  PhBookOpen,
  PhMagnifyingGlass,
  PhLightning,
  PhStar,
  PhStack,
  PhUsers,
} from '@/lib/phosphor-icons';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LuminorData {
  name: string;
  title: string;
  team: "development" | "creative" | "writing" | "research";
  teamColor: string;
  specialty: string;
  wisdom: string;
  wisdomEssence: string;
  avatar: string;
  guardianImage: string;
  description: string;
  philosophy: string;
  capabilities: string[];
  whenToCall: string;
  needsFromYou: string;
  noticesWithout: string;
  connectedTo: string[];
}

// ── Team configuration ────────────────────────────────────────────────────────

interface TeamConfig {
  label: string;
  color: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  gradientClass: string;
}

const TEAM_CONFIG: Record<string, TeamConfig> = {
  development: {
    label: "Development",
    color: "#8b5cf6",
    textClass: "text-purple-400",
    bgClass: "bg-purple-500/15",
    borderClass: "border-purple-500/30",
    glowClass: "shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    gradientClass: "from-purple-600 to-purple-400",
  },
  creative: {
    label: "Creative",
    color: "#f59e0b",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/15",
    borderClass: "border-amber-500/30",
    glowClass: "shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    gradientClass: "from-amber-500 to-amber-300",
  },
  writing: {
    label: "Writing",
    color: "#10b981",
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-500/15",
    borderClass: "border-emerald-500/30",
    glowClass: "shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    gradientClass: "from-emerald-600 to-emerald-400",
  },
  research: {
    label: "Research",
    color: "#3b82f6",
    textClass: "text-blue-400",
    bgClass: "bg-blue-500/15",
    borderClass: "border-blue-500/30",
    glowClass: "shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    gradientClass: "from-blue-600 to-blue-400",
  },
};

// ── Wisdom color mapping ──────────────────────────────────────────────────────

const WISDOM_COLORS: Record<string, string> = {
  Sophron: "#3b82f6",
  Kardia: "#ec4899",
  Valora: "#f59e0b",
  Eudaira: "#10b981",
  Orakis: "#8b5cf6",
  Poiesis: "#06b6d4",
  Enduran: "#84cc16",
};

// ── Team icon ─────────────────────────────────────────────────────────────────

function TeamIcon({ team, className }: { team: string; className?: string }) {
  const props = { className: className ?? "w-5 h-5" };
  switch (team) {
    case "development":
      return <PhCpu {...props} />;
    case "creative":
      return <PhFeather {...props} />;
    case "writing":
      return <PhBookOpen {...props} />;
    case "research":
      return <PhMagnifyingGlass {...props} />;
    default:
      return <PhStar {...props} />;
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface LuminorDetailContentProps {
  luminor: LuminorData;
  related: { id: string; data: LuminorData }[];
  luminorId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LuminorDetailContent({
  luminor,
  related,
  luminorId,
}: LuminorDetailContentProps) {
  const team = TEAM_CONFIG[luminor.team];
  const wisdomColor = WISDOM_COLORS[luminor.wisdom] ?? "#8b5cf6";

  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      {/* Ambient background accent */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${team.color}18 0%, transparent 70%)`,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <Link
          href="/lore/guardians"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
        >
          <PhArrowLeft className="w-4 h-4" />
          All Intelligences
        </Link>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${team.textClass}`}>
            {team.label} Team
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-xs font-mono text-atlantean-teal-aqua">
            {luminor.wisdom}
          </span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════════════════════════ */}
        <section className="pt-8 pb-20">
          <div className="liquid-glass rounded-3xl overflow-hidden relative">
            {/* Guardian background image */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={luminor.guardianImage}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-top opacity-10 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/30 via-cosmic-deep/60 to-cosmic-deep" />
            </div>

            {/* Team gradient overlay */}
            <div
              className="absolute inset-0 opacity-8"
              style={{
                background: `linear-gradient(135deg, ${team.color}20 0%, transparent 60%)`,
              }}
            />

            {/* Top accent bar */}
            <div
              className="h-px w-full opacity-60"
              style={{
                background: `linear-gradient(90deg, ${team.color}, transparent 60%)`,
              }}
            />

            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Badges row */}
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${team.bgClass} ${team.textClass} ${team.borderClass}`}
                >
                  <TeamIcon team={luminor.team} className="w-3.5 h-3.5" />
                  {team.label}
                </span>

                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border"
                  style={{
                    backgroundColor: `${wisdomColor}15`,
                    color: wisdomColor,
                    borderColor: `${wisdomColor}30`,
                  }}
                >
                  <PhLightning className="w-3 h-3" />
                  {luminor.wisdom} — {luminor.wisdomEssence}
                </span>
              </div>

              {/* Avatar and name */}
              <div className="flex items-start gap-6 mb-6">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border ${team.bgClass} ${team.borderClass}`}
                  aria-hidden="true"
                >
                  {luminor.avatar}
                </div>

                <div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-2 leading-none">
                    <span
                      className={`bg-gradient-to-r ${team.gradientClass} bg-clip-text text-transparent`}
                    >
                      {luminor.name}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-text-secondary font-sans italic">
                    {luminor.title}
                  </p>
                </div>
              </div>

              {/* Specialty */}
              <div className="flex items-center gap-2 mb-10">
                <PhStack className={`w-4 h-4 ${team.textClass}`} />
                <span className={`text-sm font-medium ${team.textClass}`}>
                  {luminor.specialty}
                </span>
              </div>

              {/* Short description */}
              <p className="text-text-secondary font-body text-lg leading-relaxed max-w-2xl">
                {luminor.description}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — PHILOSOPHY
        ════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            How {luminor.name} thinks
          </h2>

          <div
            className={`glass-strong rounded-3xl overflow-hidden relative ${team.glowClass}`}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `linear-gradient(135deg, ${team.color} 0%, transparent 60%)`,
              }}
            />

            <div className="relative p-8 md:p-10">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${team.bgClass} border ${team.borderClass}`}
              >
                <TeamIcon team={luminor.team} className={`w-5 h-5 ${team.textClass}`} />
              </div>

              <div className="space-y-5">
                {luminor.philosophy.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-text-primary font-body text-base leading-relaxed"
                  >
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — CAPABILITIES
        ════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            What {luminor.name} brings to your work
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {luminor.capabilities.map((capability, i) => (
              <div
                key={i}
                className={`group flex gap-4 p-5 card-3d liquid-glass rounded-2xl border border-white/[0.06] hover:border-white/[0.12] glow-card hover-lift transition-all`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-xs ${team.bgClass} ${team.textClass} border ${team.borderClass} group-hover:scale-110 transition-transform`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-text-primary font-sans text-sm leading-relaxed self-center">
                  {capability}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — WORKING TOGETHER
        ════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            Working with {luminor.name}
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {/* When to call */}
            <div className="card-3d liquid-glass rounded-2xl p-6 glow-card hover-lift transition-all">
              <div className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center bg-crystal/10 border border-crystal/20">
                <PhLightning className="w-4 h-4 text-crystal" />
              </div>
              <h3 className="text-sm font-display font-semibold text-text-primary mb-2 uppercase tracking-wide">
                When to call
              </h3>
              <p className="text-sm text-text-secondary font-sans leading-relaxed">
                {luminor.whenToCall}
              </p>
            </div>

            {/* What they need from you */}
            <div className="card-3d liquid-glass rounded-2xl p-6 glow-card hover-lift transition-all">
              <div
                className={`w-9 h-9 rounded-xl mb-4 flex items-center justify-center ${team.bgClass} border ${team.borderClass}`}
              >
                <PhUsers className={`w-4 h-4 ${team.textClass}`} />
              </div>
              <h3 className="text-sm font-display font-semibold text-text-primary mb-2 uppercase tracking-wide">
                What they need
              </h3>
              <p className="text-sm text-text-secondary font-sans leading-relaxed">
                {luminor.needsFromYou}
              </p>
            </div>

            {/* What they notice */}
            <div className="card-3d liquid-glass rounded-2xl p-6 glow-card hover-lift transition-all">
              <div className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center bg-brand-gold/10 border border-brand-gold/20">
                <PhStar className="w-4 h-4 text-brand-gold" />
              </div>
              <h3 className="text-sm font-display font-semibold text-text-primary mb-2 uppercase tracking-wide">
                Notices without being asked
              </h3>
              <p className="text-sm text-text-secondary font-sans leading-relaxed">
                {luminor.noticesWithout}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5 — WISDOM CONNECTION
        ════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
            Wisdom of {luminor.wisdom}
          </h2>

          <div
            className="liquid-glass rounded-2xl p-6 md:p-8 glow-card transition-all"
            style={{ boxShadow: `0 0 30px ${wisdomColor}20` }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border font-display font-bold text-2xl"
                style={{
                  backgroundColor: `${wisdomColor}15`,
                  borderColor: `${wisdomColor}30`,
                  color: wisdomColor,
                }}
              >
                {luminor.wisdomEssence.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className="text-xl font-display font-bold"
                    style={{ color: wisdomColor }}
                  >
                    {luminor.wisdom}
                  </h3>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-mono border"
                    style={{
                      backgroundColor: `${wisdomColor}15`,
                      color: wisdomColor,
                      borderColor: `${wisdomColor}30`,
                    }}
                  >
                    {luminor.wisdomEssence}
                  </span>
                </div>
                <p className="text-text-secondary font-sans text-sm leading-relaxed max-w-2xl">
                  {luminor.name} channels the Wisdom of {luminor.wisdom} —{" "}
                  {luminor.wisdomEssence.toLowerCase()} as a lens for mastery.
                  This wisdom shapes not just what {luminor.name} does but how
                  they see every problem brought to them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6 — CONNECTED LUMINORS
        ════════════════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs font-sans font-semibold text-text-muted uppercase tracking-widest mb-6">
              Connected Luminors
            </h2>

            <p className="text-text-secondary font-sans text-sm mb-6">
              {luminor.name} works naturally alongside these Luminors — their
              domains complement rather than duplicate.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.map(({ id: connId, data: connLuminor }) => {
                const connTeam = TEAM_CONFIG[connLuminor.team];
                return (
                  <Link
                    key={connId}
                    href={`/luminors/${connId}`}
                    className="group flex items-center gap-4 p-5 card-3d liquid-glass rounded-2xl border border-white/[0.06] hover:border-white/[0.12] glow-card hover-lift transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl border ${connTeam.bgClass} ${connTeam.borderClass}`}
                      aria-hidden="true"
                    >
                      {connLuminor.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-text-primary group-hover:text-white transition-colors">
                        {connLuminor.name}
                      </p>
                      <p className={`text-xs font-sans truncate ${connTeam.textClass}`}>
                        {connLuminor.specialty}
                      </p>
                    </div>

                    <PhArrowRight className="w-4 h-4 text-text-disabled group-hover:text-text-muted transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SECTION 7 — CTA
        ════════════════════════════════════════════════════════════ */}
        <section>
          <div
            className={`relative liquid-glass rounded-3xl overflow-hidden ${team.glowClass}`}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${team.color} 0%, transparent 60%)`,
              }}
            />

            {/* Shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-60"
              style={{
                background: `linear-gradient(90deg, transparent, ${team.color}, transparent)`,
              }}
            />

            <div className="relative p-10 md:p-14 text-center">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${team.bgClass} border ${team.borderClass}`}
              >
                <TeamIcon
                  team={luminor.team}
                  className={`w-7 h-7 ${team.textClass}`}
                />
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
                Begin with {luminor.name}
              </h2>

              <p className="text-text-secondary font-body text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {luminor.name} is ready to bring {luminor.specialty.toLowerCase()} to your work.
                Open a conversation and see what becomes possible.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/chat/${luminorId}`}
                  className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-sans font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${team.gradientClass} text-white ${team.glowClass}`}
                >
                  <TeamIcon team={luminor.team} className="w-5 h-5" />
                  Chat with {luminor.name}
                  <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/lore/guardians"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-sans font-medium text-sm text-text-secondary border border-white/[0.06] hover:border-white/[0.12] hover:text-text-primary liquid-glass transition-all"
                >
                  <PhArrowLeft className="w-4 h-4" />
                  All Intelligences
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
