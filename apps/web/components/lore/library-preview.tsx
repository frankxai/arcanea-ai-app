"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { ShimmerCard } from "@/components/ui/shimmer-card";
import { GlowButton } from "@/components/ui/glow-button";
import { durations, m3Curves } from "@/lib/design/motion";

const COLLECTION_COLORS: Record<string, { glow: string; dot: string; text: string; bg: string; shimmer: 'cyan' | 'gold' | 'purple' | 'fire' }> = {
  "gold-bright": { glow: "rgba(255, 215, 0, 0.12)", dot: "#ffd700", text: "text-gold-bright", bg: "bg-gold-bright/20", shimmer: "gold" },
  "atlantean-teal-aqua": { glow: "rgba(0, 188, 212, 0.12)", dot: "#00bcd4", text: "text-atlantean-teal-aqua", bg: "bg-atlantean-teal-aqua/20", shimmer: "cyan" },
  "creation-prism-purple": { glow: "rgba(13, 71, 161, 0.12)", dot: "#0d47a1", text: "text-creation-prism-purple", bg: "bg-creation-prism-purple/20", shimmer: "purple" },
  "draconic-crimson": { glow: "rgba(239, 68, 68, 0.12)", dot: "#ef4444", text: "text-draconic-crimson", bg: "bg-draconic-crimson/20", shimmer: "fire" },
};

const FEATURED_COLLECTIONS = [
  { title: "Legends of Arcanea", texts: 5, description: "The founding myths — from the First Dawn to the Ten Guardians", color: "gold-bright", href: "/library/legends-of-arcanea", icon: "scroll" },
  { title: "The Wisdom Scrolls", texts: 4, description: "Daily practices — morning meditations to evening reflections", color: "atlantean-teal-aqua", href: "/library/wisdom-scrolls", icon: "feather" },
  { title: "Poetry of Freedom", texts: 4, description: "Verses for liberation — from chains to wings", color: "creation-prism-purple", href: "/library/poetry-of-freedom", icon: "music" },
  { title: "Academy Handbook", texts: 1, description: "The complete guide for students of creation", color: "draconic-crimson", href: "/library/academy-handbook", icon: "book" },
];

const ALL_COLLECTIONS = [
  "Laws of Arcanea", "Poetry of Freedom", "Wisdom Scrolls", "Legends of Arcanea",
  "Chronicles of Luminors", "Parables of Creation", "Tales of Creators", "Book of Rituals",
  "Dialogues of Masters", "Prophecies", "Bestiary of Creation", "Songs and Hymns",
  "Meditations on Elements", "Academy Handbook", "Book of Shadows", "Codex of Collaboration",
  "Atlas of Territories",
];

const CollectionIcon = ({ icon }: { icon: string }) => {
  const shared = "w-6 h-6";
  switch (icon) {
    case "scroll": return <svg className={shared} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
    case "feather": return <svg className={shared} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></svg>;
    case "music": return <svg className={shared} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
    default: return <svg className={shared} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
  }
};

export function LibraryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-radial from-gold-bright/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-draconic-crimson/20 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="text-sm font-medium text-draconic-crimson">The Library</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            17 Collections of Wisdom
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-body italic">
            &quot;These books are not entertainment. They are equipment for living. Use them.&quot;
          </p>
        </m.div>

        {/* Featured Collections — ShimmerCards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURED_COLLECTIONS.map((collection, i) => {
            const colors = COLLECTION_COLORS[collection.color];
            return (
              <m.div
                key={collection.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: durations.normal, ease: m3Curves.emphasizedDecelerate }}
              >
                <Link href={collection.href} className="block h-full">
                  <ShimmerCard
                    color={colors.shimmer}
                    hoverOnly
                    glow
                    glass="liquid-glass"
                    className="h-full p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.bg} ${colors.text}`}>
                      <CollectionIcon icon={collection.icon} />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-gold-bright transition-colors duration-200">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">{collection.description}</p>
                    <p className="text-xs text-text-muted">{collection.texts} texts</p>
                  </ShimmerCard>
                </Link>
              </m.div>
            );
          })}
        </div>

        {/* All Collections List */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: durations.normal }}
          className="mb-12"
        >
          <h3 className="text-lg font-display font-semibold text-center mb-6 text-text-muted">
            All 17 Collections
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {ALL_COLLECTIONS.map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-full liquid-glass border border-white/[0.06] text-sm text-text-secondary hover:border-white/[0.12] hover:text-white transition-all duration-200 cursor-pointer"
              >
                {name}
              </span>
            ))}
          </div>
        </m.div>

        {/* Stats */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: durations.normal }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
        >
          {[
            { value: "17", label: "Collections" },
            { value: "34+", label: "Major Texts" },
            { value: "200K+", label: "Words of Wisdom" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-display font-bold text-gold-bright">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </m.div>

        {/* CTA — GlowButton */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: durations.normal }}
          className="text-center"
        >
          <GlowButton href="/library" variant="primary" color="white" size="md">
            Enter the Library
          </GlowButton>
        </m.div>
      </div>
    </section>
  );
}
