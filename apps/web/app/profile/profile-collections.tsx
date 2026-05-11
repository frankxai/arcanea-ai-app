/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Collection {
  title: string;
  type: string;
  count: number;
  glyph: string;
  color: string;
  gradient: string;
  href: string;
  tag?: string;
}

const COLLECTIONS: Collection[] = [
  {
    title: "Starlight Corps Vol. 1",
    type: "NFT Collection",
    count: 111,
    glyph: "✦",
    color: "var(--arc-brand-arcanean-gold)",
    gradient: "from-[var(--arc-brand-cosmic-blue)]/60 via-[var(--arc-brand-arcanean-gold)]/10 to-[var(--arc-brand-cosmic-blue)]/60",
    href: "/forge",
    tag: "LIVE",
  },
  {
    title: "Forge of Ruin",
    type: "Published Book",
    count: 45000,
    glyph: "⌘",
    color: "var(--arc-brand-atlantean-teal)",
    gradient: "from-[var(--arc-brand-cosmic-blue)]/60 via-[var(--arc-brand-atlantean-teal)]/10 to-[var(--arc-brand-cosmic-blue)]/50",
    href: "/library",
    tag: "OPEN",
  },
  {
    title: "World-Builder Starter Kit",
    type: "Template Pack",
    count: 24,
    glyph: "◱",
    color: "var(--arc-brand-atlantean-teal)",
    gradient: "from-[var(--arc-brand-cosmic-blue)]/60 via-[var(--arc-brand-atlantean-teal)]/10 to-[var(--arc-cosmic-void)]/40",
    href: "/templates",
    tag: "FREE",
  },
  {
    title: "Luminor Skill Bundle",
    type: "Skill Pack",
    count: 17,
    glyph: "◈",
    color: "var(--arc-void)",
    gradient: "from-[var(--arc-brand-cosmic-blue)]/60 via-[var(--arc-void)]/15 to-[var(--arc-brand-cosmic-blue)]/50",
    href: "/skills",
  },
];

export function ProfileCollections() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="mb-8">
        <m.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-1">
              Published
            </p>
            <h2 className="text-xl font-display font-bold text-white tracking-[-0.02em]">
              My collections
            </h2>
          </div>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLLECTIONS.map((col, i) => (
            <m.a
              key={col.title}
              href={col.href}
              className="group relative block rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              {/* Preview gradient */}
              <div
                className={`h-28 w-full bg-gradient-to-br ${col.gradient} flex items-center justify-center relative overflow-hidden`}
              >
                {/* Glyph */}
                <span
                  className="text-4xl font-bold transition-transform duration-300 group-hover:scale-110"
                  style={{ color: col.color, opacity: 0.6 }}
                >
                  {col.glyph}
                </span>

                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -skew-x-12"
                    style={{ animation: "shimmer 1.5s ease-in-out" }}
                  />
                </div>

                {/* Status tag */}
                {col.tag && (
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: `${col.color}18`,
                        border: `1px solid ${col.color}30`,
                        color: `${col.color}cc`,
                      }}
                    >
                      {col.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-white/[0.025]">
                <h3 className="text-sm font-display font-semibold text-white/85 group-hover:text-white transition-colors leading-tight mb-1 truncate">
                  {col.title}
                </h3>
                <p className="text-[10px] text-white/35 font-mono mb-2">
                  {col.type}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[11px] font-display font-bold"
                    style={{ color: col.color }}
                  >
                    {col.count.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-white/25 font-mono uppercase tracking-wider">
                    {col.type === "NFT Collection"
                      ? "editions"
                      : col.type === "Published Book"
                      ? "words"
                      : col.type === "Template Pack"
                      ? "templates"
                      : "skills"}
                  </span>
                </div>
              </div>
            </m.a>
          ))}
        </div>
      </section>
    </LazyMotion>
  );
}
