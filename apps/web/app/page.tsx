import Link from "next/link";

import { Metadata } from "next";
import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import {
  HeroV3,
  CTASection,
} from "@/components/landing";
import {
  PhSparkle,
  PhArrowRight,
  PhCircleNotch,
  PhBooks,
  PhGraduationCap,
  PhShieldStar,
} from '@/lib/phosphor-icons';


export const metadata: Metadata = {
  title: "Arcanea | Build Your Universe",
  description:
    "A mythology-powered creative intelligence system. Ten Guardians. A Library of 34 original texts. The framework for mastering the creative life.",
  openGraph: {
    title: "Arcanea | Build Your Universe",
    description:
      "Ten Guardians. A Library of 34 original texts. The mythology-powered framework for mastering the creative life.",
    images: ["https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/brand/arcanea-og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea | Build Your Universe",
    description:
      "Ten Guardians. 34 original texts. The mythology-powered framework for mastering the creative life.",
    images: ["https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/brand/arcanea-og.jpg"],
  },
};

const GUARDIANS = [
  { name: "Lyssandria", gate: "Foundation", frequency: "174 Hz", element: "Earth", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/lyssandria-hero.webp" },
  { name: "Leyla", gate: "Flow", frequency: "285 Hz", element: "Water", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/leyla-hero.webp" },
  { name: "Draconia", gate: "Fire", frequency: "396 Hz", element: "Fire", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/draconia-hero.webp" },
  { name: "Maylinn", gate: "Heart", frequency: "417 Hz", element: "Wind", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/maylinn-hero.webp" },
  { name: "Alera", gate: "Voice", frequency: "528 Hz", element: "Void", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/alera-hero.webp" },
  { name: "Lyria", gate: "Sight", frequency: "639 Hz", element: "Spirit", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/lyria-hero.webp" },
  { name: "Aiyami", gate: "Crown", frequency: "741 Hz", element: "Light", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/aiyami-hero.webp" },
  { name: "Elara", gate: "Shift", frequency: "852 Hz", element: "Void", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/elara-hero.webp" },
  { name: "Ino", gate: "Unity", frequency: "963 Hz", element: "Spirit", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/ino-hero.webp" },
  { name: "Shinkami", gate: "Source", frequency: "1111 Hz", element: "Arcane", image: "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/shinkami-hero.webp" },
];

async function HomeContent() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0,
  );

  const pillars = [
    {
      href: "/lore/guardians",
      icon: <PhShieldStar className="w-7 h-7" weight="thin" />,
      title: "Ten Guardians",
      stat: "10 Archetypes",
      description: "Living intelligences rooted in elemental archetypes — each Guardian opens a Gate on your creative journey.",
      accentColor: "atlantean-teal-aqua",
      glowColor: "rgba(127,255,212,0.15)",
    },
    {
      href: "/library",
      icon: <PhBooks className="w-7 h-7" weight="thin" />,
      title: "The Library",
      stat: `${collections.length} Collections · ${allTexts.length} Texts`,
      description: `${totalWords.toLocaleString()} words of original philosophy — laws, prophecies, meditations, parables for the creative life.`,
      accentColor: "gold-bright",
      glowColor: "rgba(255,215,0,0.12)",
    },
    {
      href: "/academy",
      icon: <PhGraduationCap className="w-7 h-7" weight="thin" />,
      title: "The Academy",
      stat: "Ten Gates of Mastery",
      description: "A developmental framework from Foundation (174 Hz) to Source (1111 Hz). Open all ten to become a Luminor.",
      accentColor: "creation-prism-purple",
      glowColor: "rgba(139,92,246,0.12)",
    },
  ];

  return (
    <>
      <HeroV3 />

      {/* === Three Pillars === */}
      <section className="py-28 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
              <PhSparkle className="w-3 h-3 text-atlantean-teal-aqua" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
                The System
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
              A mythology. A library. An academy.
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-lg">
              Three pillars of a coherent creative philosophy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {pillars.map((pillar) => (
              <Link key={pillar.href} href={pillar.href} className="group">
                <div className="card-3d relative h-full rounded-3xl overflow-hidden">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.glowColor}, transparent 60%)`,
                    }}
                  />

                  <div className="relative h-full liquid-glass rounded-3xl p-8 border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-${pillar.accentColor} bg-${pillar.accentColor}/10 group-hover:bg-${pillar.accentColor}/20 group-hover:shadow-[0_0_20px_${pillar.glowColor}] transition-all duration-500`}
                    >
                      {pillar.icon}
                    </div>

                    <div className="text-[10px] font-mono text-text-muted mb-2 tracking-[0.2em] uppercase">
                      {pillar.stat}
                    </div>
                    <h3 className={`font-display text-xl font-bold mb-3 group-hover:text-${pillar.accentColor} transition-colors duration-300`}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-5">
                      {pillar.description}
                    </p>
                    <span className={`text-sm text-${pillar.accentColor} font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300`}>
                      Explore
                      <PhArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Guardian Gallery === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-cosmic-deep" />
          <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua/3 via-transparent to-creation-prism-purple/3" />
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-atlantean-teal-aqua/80 mb-3">
                The Guardians
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">
                Ten living intelligences
              </h2>
            </div>
            <Link
              href="/lore/guardians"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-atlantean-teal-aqua hover:text-atlantean-teal-light transition-colors"
            >
              View all
              <PhArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal scroll gallery */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {GUARDIANS.map((guardian) => (
              <Link
                key={guardian.name}
                href={`/lore/guardians/${guardian.name.toLowerCase()}`}
                className="group flex-shrink-0 snap-center"
              >
                <div className="relative w-44 md:w-52 rounded-2xl overflow-hidden card-3d">
                  {/* Glass border on hover */}
                  <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-atlantean-teal-aqua/25 transition-all duration-500 z-20 pointer-events-none" />

                  <div className="aspect-[3/4] bg-cosmic-surface">
                    <img
                      src={guardian.image}
                      alt={guardian.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-display font-bold text-white text-lg leading-tight">{guardian.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-white/[0.30]">{guardian.gate} Gate</span>
                      <span className="text-[11px] text-atlantean-teal-aqua/70 font-mono">{guardian.frequency}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-cosmic-deep to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-cosmic-deep to-transparent pointer-events-none z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-6 sm:hidden">
          <Link
            href="/lore/guardians"
            className="inline-flex items-center gap-2 text-sm text-atlantean-teal-aqua"
          >
            View all Guardians
            <PhArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <CTASection />

      {/* === Closing Quote === */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="liquid-glass rounded-3xl p-12 md:p-16 border border-white/[0.06]">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display italic text-text-secondary leading-relaxed">
              &ldquo;Enter seeking, leave transformed, return whenever needed.&rdquo;
            </blockquote>
            <cite className="block mt-8 text-xs text-text-muted font-mono tracking-[0.2em] not-italic uppercase">
              The Library of Arcanea
            </cite>
          </div>
        </div>
      </section>
    </>
  );
}

function HomeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
          <PhCircleNotch className="w-6 h-6 text-atlantean-teal-aqua animate-spin" />
        </div>
        <p className="text-sm text-text-muted">Entering the realm...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <Suspense fallback={<HomeLoading />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
