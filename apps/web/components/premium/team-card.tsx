"use client";

import { m } from "framer-motion";
import Link from "next/link";
import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// TeamCard — Engineering / creative team showcase card.
// Similar to Canva's engineering blog team listings or Vercel's team pages.
// ---------------------------------------------------------------------------

export interface TeamCardProps {
  name: string;
  charter: string;
  owns: string[];
  members?: { name: string; role: string; avatar?: string }[];
  icon: ComponentType<{ className?: string; weight?: string; style?: React.CSSProperties }>;
  accent: string;
  stats?: { label: string; value: string }[];
  blogHref?: string;
  repoHref?: string;
  index?: number;
}

export function TeamCard({
  name,
  charter,
  owns,
  members,
  icon: Icon,
  accent,
  stats,
  blogHref,
  repoHref,
  index = 0,
}: TeamCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] transition-colors duration-500 p-6 md:p-7 h-full flex flex-col"
    >
      {/* Accent line top */}
      <m.div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${accent}90, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
      />

      {/* Accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(500px circle at 50% 0%, ${accent}10, transparent 60%)`,
        }}
      />

      <div className="relative flex-1 flex flex-col">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
            style={{
              background: `${accent}10`,
              border: `1px solid ${accent}25`,
            }}
          >
            <Icon
              className="w-5 h-5"
              weight="duotone"
              style={{ color: accent } as React.CSSProperties}
            />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/30 mb-0.5">
              Team
            </p>
            <h3
              className="text-lg font-display font-semibold"
              style={{ color: accent }}
            >
              {name}
            </h3>
          </div>
        </div>

        {/* Charter */}
        <p className="text-sm text-white/50 leading-relaxed mb-5 flex-1">
          {charter}
        </p>

        {/* What they own */}
        <div className="mb-5">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25 mb-2">
            Owns
          </p>
          <div className="flex flex-wrap gap-1.5">
            {owns.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-white/55"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mb-5 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  {i > 0 && <span className="w-px h-4 bg-white/[0.08]" />}
                  <div>
                    <p
                      className="text-base font-display font-bold"
                      style={{ color: accent }}
                    >
                      {s.value}
                    </p>
                    <p className="text-[9px] font-mono tracking-wider uppercase text-white/30">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members row */}
        {members && members.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25 mb-2">
              Leads
            </p>
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((m) => (
                <div
                  key={m.name}
                  className="w-7 h-7 rounded-full ring-2 ring-[#09090b] bg-gradient-to-br from-[#0d47a1]/40 to-[#4a148c]/40 flex items-center justify-center text-[10px] font-display font-bold text-white/70"
                  title={`${m.name} — ${m.role}`}
                >
                  {m.name.charAt(0)}
                </div>
              ))}
              {members.length > 5 && (
                <div className="w-7 h-7 rounded-full ring-2 ring-[#09090b] bg-white/[0.04] flex items-center justify-center text-[9px] font-mono text-white/40">
                  +{members.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto">
          {blogHref && (
            <Link
              href={blogHref}
              className="text-xs font-medium transition-colors hover:translate-x-0.5 inline-flex items-center gap-1"
              style={{ color: accent }}
            >
              Blog
              <span className="text-[10px]">&rarr;</span>
            </Link>
          )}
          {repoHref && (
            <a
              href={repoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-white/40 hover:text-white/60 transition-colors inline-flex items-center gap-1"
            >
              Repo
              <span className="text-[10px]">↗</span>
            </a>
          )}
        </div>
      </div>
    </m.div>
  );
}
