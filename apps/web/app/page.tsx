import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import {
  HeroV3,
  CTASection,
} from "@/components/landing";
import { Navbar } from "@/components/navigation";
import {
  PhSparkle,
  PhArrowRight,
  PhCircleNotch,
  PhBooks,
  PhGraduationCap,
  PhShieldStar,
} from '@/lib/phosphor-icons';
import footerLogo from "@/assets/brand/arcanea-mark.jpg";

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/10 mb-8">
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
                      <span className="text-[11px] text-white/50">{guardian.gate} Gate</span>
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
        <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center mx-auto mb-6 border border-white/10">
          <PhCircleNotch className="w-6 h-6 text-atlantean-teal-aqua animate-spin" />
        </div>
        <p className="text-sm text-text-muted">Entering the realm...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main>
        <Suspense fallback={<HomeLoading />}>
          <HomeContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]" aria-label="Site footer">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10">
                  <Image
                    src={footerLogo}
                    alt="Arcanea"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-display text-lg font-semibold text-white">
                  Arcanea
                </span>
              </div>
              <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
                The antidote to a terrible future is imagining a good one.
                Ten Guardians. A living mythology for the age of creation.
              </p>
              <div className="flex gap-3">
                {[
                  { href: "https://github.com/frankxai/arcanea", label: "GitHub", path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
                  { href: "https://twitter.com/arcanea_ai", label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { href: "https://discord.gg/arcanea", label: "Discord", path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Arcanea on ${social.label} (opens in new tab)`}
                    className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-text-muted hover:text-atlantean-teal-aqua hover:bg-white/[0.08] transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-text-muted mb-5">Platform</h4>
              <ul className="space-y-3">
                {["Luminors", "Studio", "Library", "Academy"].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-sm text-text-muted hover:text-white transition-colors duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-text-muted mb-5">Explore</h4>
              <ul className="space-y-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Lore", href: "/lore" },
                  { label: "Ecosystem", href: "/ecosystem" },
                  { label: "Contact", href: "mailto:hello@arcanea.ai" },
                ].map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("mailto:") ? (
                      <a href={item.href} className="text-sm text-text-muted hover:text-white transition-colors duration-300">{item.label}</a>
                    ) : (
                      <Link href={item.href} className="text-sm text-text-muted hover:text-white transition-colors duration-300">{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-muted/60">
              &copy; {new Date().getFullYear()} Arcanea. Building the future of creative intelligence.
            </p>
            <div className="flex gap-6 text-xs text-text-muted/60">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
