'use client';

import Link from 'next/link';
import {
  PhSparkle,
  PhArrowRight,
  PhGlobe,
  PhUsers,
  PhStar,
  PhCrown,
  PhCompass,
  PhPlus,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhWind,
  PhLightning,
  PhEye,
  PhShare,
  PhTree,
  PhMountains,
  PhMapTrifold,
  PhRocket,
  PhPencilSimple,
} from '@/lib/phosphor-icons';
import { MotionProvider, m } from '@/lib/motion';

const PILLARS = [
  {
    title: 'Cosmology',
    description: 'Define the origin story, cosmic forces, and fundamental laws that govern your universe.',
    icon: PhStar,
    color: '#ffd700',
    features: ['Creation myths', 'Cosmic duality', 'Universal laws', 'Divine hierarchy'],
  },
  {
    title: 'Elements',
    description: 'Design the magical or natural systems that shape your world. Energy, matter, spirit.',
    icon: PhFlame,
    color: '#ef4444',
    features: ['Magic systems', 'Energy sources', 'Natural forces', 'Element interactions'],
  },
  {
    title: 'Characters',
    description: 'Create the beings who inhabit your world. Gods, mortals, creatures, and everything between.',
    icon: PhUsers,
    color: '#78a6ff',
    features: ['Races & species', 'Gods & guardians', 'Creatures & beasts', 'Character arcs'],
  },
  {
    title: 'Progression',
    description: 'Build the systems of growth, advancement, and transformation within your world.',
    icon: PhCrown,
    color: '#a855f7',
    features: ['Gate systems', 'Rank structures', 'Power scaling', 'Achievement paths'],
  },
];

const HOW_IT_WORKS = [
  {
    step: 'Define',
    description: 'Establish your world\'s core identity: its name, genre, tone, and founding principles.',
    icon: PhPencilSimple,
    color: '#7fffd4',
  },
  {
    step: 'Build',
    description: 'Layer in cosmology, geography, magic systems, cultures, and histories with AI guidance.',
    icon: PhMountains,
    color: '#78a6ff',
  },
  {
    step: 'Populate',
    description: 'Create characters, creatures, artifacts, and stories that bring your world to life.',
    icon: PhTree,
    color: '#ffd700',
  },
  {
    step: 'Share',
    description: 'Publish your world to the multiverse. Let others explore, contribute, and build upon it.',
    icon: PhShare,
    color: '#ec4899',
  },
];

const EXAMPLE_WORLDS = [
  {
    name: 'Arcanea',
    genre: 'Mythic Fantasy',
    description: 'The reference world. Ten Gates of consciousness, Five Elements, Seven Houses, and the eternal dance of Lumina and Nero.',
    gradient: 'from-[#7fffd4]/20 via-[#78a6ff]/10 to-[#a855f7]/20',
    borderColor: '#7fffd4',
    elementIcons: [PhFlame, PhDrop, PhLeaf, PhWind, PhEye],
  },
  {
    name: 'Neon Rift',
    genre: 'Cyberpunk Fantasy',
    description: 'A fractured megacity where ancient magic bleeds through digital networks. Hackers channel elemental code.',
    gradient: 'from-[#ec4899]/20 via-[#a855f7]/10 to-[#78a6ff]/20',
    borderColor: '#ec4899',
    elementIcons: [PhLightning, PhGlobe, PhEye],
  },
  {
    name: 'Verdantia',
    genre: 'Ecological Epic',
    description: 'A living world where forests think, oceans remember, and mountains dream. Nature is the protagonist.',
    gradient: 'from-[#22c55e]/20 via-[#06b6d4]/10 to-[#ffd700]/20',
    borderColor: '#22c55e',
    elementIcons: [PhLeaf, PhDrop, PhWind],
  },
];

const WORLD_ELEMENTS = [
  { name: 'Geography', icon: PhGlobe, color: '#22c55e', count: 'Landscapes, climates, biomes' },
  { name: 'Cultures', icon: PhUsers, color: '#78a6ff', count: 'Societies, traditions, languages' },
  { name: 'Magic', icon: PhSparkle, color: '#a855f7', count: 'Systems, rules, limitations' },
  { name: 'History', icon: PhCompass, color: '#ffd700', count: 'Eras, conflicts, legends' },
  { name: 'Ecology', icon: PhLeaf, color: '#06b6d4', count: 'Flora, fauna, ecosystems' },
  { name: 'Economy', icon: PhMapTrifold, color: '#f97316', count: 'Trade, resources, power' },
];

export default function WorldBuilderPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5" />
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7fffd4]/5 rounded-full blur-[120px]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <m.section
            className="pt-20 pb-16 lg:pt-28 lg:pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-transparent to-[#7fffd4]/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#a855f7]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7fffd4]/6 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 mb-6">
                  <PhGlobe className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#a855f7]">
                    World Builder
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                  Design your own{' '}
                  <span className="bg-gradient-to-r from-[#a855f7] to-[#7fffd4] bg-clip-text text-transparent">
                    creative universe
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl mb-8">
                  Build immersive worlds with the Arcanea framework. Define cosmologies,
                  craft magic systems, populate civilizations, and share your creation
                  with the multiverse.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/forge"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#a855f7] text-white font-semibold hover:scale-[1.03] transition-all duration-200"
                  >
                    <PhPlus className="w-4 h-4" />
                    Start Building Your World
                  </Link>
                  <Link
                    href="/lore"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:border-[#a855f7]/30 transition-all duration-200"
                  >
                    <PhCompass className="w-4 h-4" />
                    Explore Arcanea
                  </Link>
                </div>
              </div>
            </div>
          </m.section>

          {/* Four Pillars */}
          <m.section
            className="py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 mb-6">
              <PhCrown className="w-3 h-3 text-[#ffd700]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                The Four Pillars
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Every world needs a foundation</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${pillar.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{pillar.title}</h3>
                    <p className="text-sm text-neutral-400 mb-4">{pillar.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.features.map((f) => (
                        <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-400">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </m.section>

          {/* How It Works */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7fffd4]/20 bg-[#7fffd4]/8 mb-6">
              <PhRocket className="w-3 h-3 text-[#7fffd4]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                How It Works
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">From idea to universe in four steps</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <div className="absolute top-4 right-4 text-4xl font-display font-bold text-white/5">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2" style={{ color: step.color }}>
                      {step.step}
                    </h3>
                    <p className="text-sm text-neutral-400">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* World Building Blocks */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#78a6ff]/20 bg-[#78a6ff]/8 mb-6">
              <PhMapTrifold className="w-3 h-3 text-[#78a6ff]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#78a6ff]">
                Building Blocks
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Everything you need to build</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORLD_ELEMENTS.map((el) => {
                const Icon = el.icon;
                return (
                  <div
                    key={el.name}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-white/20 transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${el.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: el.color }} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">{el.name}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">{el.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Example Worlds */}
          <section className="py-12 border-t border-white/5 pb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ec4899]/20 bg-[#ec4899]/8 mb-6">
              <PhSparkle className="w-3 h-3 text-[#ec4899]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ec4899]">
                Inspiration
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Worlds built with the framework</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {EXAMPLE_WORLDS.map((world) => (
                <div
                  key={world.name}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} pointer-events-none`} />
                  <div className="relative">
                    <div
                      className="h-1 w-16 rounded-full mb-5"
                      style={{ backgroundColor: world.borderColor }}
                    />
                    <h3 className="font-display text-xl font-bold mb-1">{world.name}</h3>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3 block">
                      {world.genre}
                    </span>
                    <p className="text-sm text-neutral-400 mb-4">{world.description}</p>
                    <div className="flex items-center gap-2">
                      {world.elementIcons.map((Icon, i) => (
                        <Icon key={i} className="w-4 h-4 text-neutral-500" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/forge"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7fffd4] text-black font-bold text-lg hover:scale-[1.03] transition-all duration-200"
              >
                <PhPlus className="w-5 h-5" />
                Start Building Your World
                <PhArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
