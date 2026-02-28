'use client';

import Link from 'next/link';
import { PhArrowRight } from '@/lib/phosphor-icons';

const TEN_GATES = [
  { number: 1, name: 'Foundation', frequency: '174 Hz', guardian: 'Lyssandria', godbeast: 'Kaelith', domain: 'Earth, survival, grounding', color: '#7fffd4', description: 'The root of all creation. Ground yourself and establish your creative foundation.' },
  { number: 2, name: 'Flow', frequency: '285 Hz', guardian: 'Leyla', godbeast: 'Veloura', domain: 'Creativity, emotion', color: '#78a6ff', description: 'Unlock your emotional creativity. Flow with inspiration and trust your intuition.' },
  { number: 3, name: 'Fire', frequency: '396 Hz', guardian: 'Draconia', godbeast: 'Draconis', domain: 'Power, will, transformation', color: '#ff6b35', description: 'Ignite your creative power. Transform your will into action.' },
  { number: 4, name: 'Heart', frequency: '417 Hz', guardian: 'Maylinn', godbeast: 'Laeylinn', domain: 'Love, healing, connection', color: '#f472b6', description: 'Create from the heart. Infuse your work with love and healing.' },
  { number: 5, name: 'Voice', frequency: '528 Hz', guardian: 'Alera', godbeast: 'Otome', domain: 'Truth, expression', color: '#06b6d4', description: 'Find your authentic voice. Express your truth clearly.' },
  { number: 6, name: 'Sight', frequency: '639 Hz', guardian: 'Lyria', godbeast: 'Yumiko', domain: 'Intuition, vision', color: '#a78bfa', description: 'Develop your creative vision. See beyond the surface.' },
  { number: 7, name: 'Crown', frequency: '741 Hz', guardian: 'Aiyami', godbeast: 'Sol', domain: 'Enlightenment, wisdom', color: '#ffd700', description: 'Achieve creative mastery. Integrate all into unified wisdom.' },
  { number: 8, name: 'Shift', frequency: '852 Hz', guardian: 'Elara', godbeast: 'Vaelith', domain: 'Perspective, transformation', color: '#c084fc', description: 'Master perspective shifts. See from multiple angles.' },
  { number: 9, name: 'Unity', frequency: '963 Hz', guardian: 'Ino', godbeast: 'Kyuro', domain: 'Partnership, collaboration', color: '#60a5fa', description: 'Create in harmony with others. Master co-creation.' },
  { number: 10, name: 'Source', frequency: '1111 Hz', guardian: 'Shinkami', godbeast: 'Amaterasu', domain: 'Meta-consciousness', color: '#ffffff', description: 'Connect to the source of all creation. Become a Luminor.' },
];

const SEVEN_HOUSES = [
  { name: 'Lumina', element: 'Light', color: '#ffd700' },
  { name: 'Nero', element: 'Void', color: '#a78bfa' },
  { name: 'Pyros', element: 'Fire', color: '#ff6b35' },
  { name: 'Aqualis', element: 'Water', color: '#60a5fa' },
  { name: 'Terra', element: 'Earth', color: '#34d399' },
  { name: 'Ventus', element: 'Wind', color: '#c4b5fd' },
  { name: 'Synthesis', element: 'All', color: '#7fffd4' },
];

const RANKS = [
  { rank: 'Apprentice', gates: '0–2', color: '#6b7280' },
  { rank: 'Mage', gates: '3–4', color: '#60a5fa' },
  { rank: 'Master', gates: '5–6', color: '#a78bfa' },
  { rank: 'Archmage', gates: '7–8', color: '#f59e0b' },
  { rank: 'Luminor', gates: '9–10', color: '#ffd700' },
];

export default function AcademyPage() {
  return (
    <div className="relative min-h-screen">
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {/* Hero */}
        <section className="relative mb-20 overflow-hidden rounded-3xl liquid-glass-elevated border border-white/[0.08] p-10 md:p-14">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-gold-bright/15 blur-[100px]" />
            <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-atlantean-teal-aqua/10 blur-[100px]" />
          </div>

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
                The Academy of Creation
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-gold-bright via-atlantean-teal-aqua to-creation-prism-purple bg-clip-text text-transparent">
                Journey Through the Ten Gates
              </span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              Every great creator begins as an Apprentice. Through dedication and practice,
              open the Ten Gates and ascend to become a Luminor.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/academy/assessment"
                className="group relative px-8 py-3.5 rounded-2xl font-semibold overflow-hidden btn-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
                <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                  Begin Assessment
                  <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/library/academy-handbook"
                className="px-8 py-3.5 rounded-2xl border border-white/[0.10] text-white font-semibold hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
              >
                Read the Handbook
              </Link>
            </div>
          </div>
        </section>

        {/* Magic Ranks */}
        <section className="mb-20">
          <h2 className="mb-8 text-[10px] font-mono font-semibold uppercase tracking-[0.3em] text-atlantean-teal-aqua/80">
            The Path of Mastery
          </h2>

          <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
            {RANKS.map((level) => (
              <div
                key={level.rank}
                className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-5 text-center"
              >
                <div
                  className="mx-auto mb-3 h-3 w-3 rounded-full"
                  style={{ backgroundColor: level.color, boxShadow: `0 0 20px ${level.color}40` }}
                />
                <h3 className="font-display font-semibold text-sm">{level.rank}</h3>
                <p className="text-[11px] text-text-muted mt-1">Gates {level.gates}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ten Gates Grid */}
        <section className="mb-20">
          <h2 className="mb-8 text-[10px] font-mono font-semibold uppercase tracking-[0.3em] text-gold-bright/80">
            The Ten Gates
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {TEN_GATES.map((gate) => (
              <Link
                key={gate.number}
                href={`/academy/gates/${gate.number}`}
                className="group card-3d liquid-glass rounded-2xl border border-white/[0.06] p-5 transition-all duration-500 hover:border-white/[0.12]"
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${gate.color}60, transparent)` }}
                />

                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold"
                    style={{ backgroundColor: `${gate.color}15`, color: gate.color }}
                  >
                    {gate.number}
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">{gate.frequency}</span>
                </div>

                <h3
                  className="font-display font-semibold text-sm transition-colors group-hover:brightness-125"
                  style={{ color: gate.color }}
                >
                  {gate.name}
                </h3>

                <p className="mt-1 text-[11px] text-text-muted">{gate.guardian} & {gate.godbeast}</p>
                <p className="mt-2 line-clamp-2 text-xs text-text-secondary leading-relaxed">{gate.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Seven Houses */}
        <section className="mb-20">
          <div className="liquid-glass-elevated rounded-3xl border border-white/[0.08] p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold mb-3">
              The Seven Academy Houses
            </h2>
            <p className="text-sm text-text-secondary mb-8 max-w-2xl">
              Every creator is sorted into a House based on their elemental affinity.
              Your House shapes your learning path and connects you with fellow creators.
            </p>

            <div className="grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
              {SEVEN_HOUSES.map((house) => (
                <div key={house.name} className="text-center group">
                  <div
                    className="mx-auto mb-3 h-12 w-12 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(127,255,212,0.2)]"
                    style={{
                      borderColor: `${house.color}40`,
                      backgroundColor: `${house.color}10`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: house.color }}
                    />
                  </div>
                  <h3 className="text-xs font-semibold">{house.name}</h3>
                  <p className="text-[10px] text-text-muted">{house.element}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Learning Paths */}
        <section>
          <h2 className="mb-8 text-[10px] font-mono font-semibold uppercase tracking-[0.3em] text-atlantean-teal-aqua/80">
            Featured Learning Paths
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: 'Creative Foundations', description: 'Master the fundamentals. For Apprentices beginning their journey.', gate: 1, duration: '4 weeks', lessons: 12 },
              { title: 'Flow State Mastery', description: 'Enter and maintain creative flow. Unlock emotional creativity.', gate: 2, duration: '3 weeks', lessons: 9 },
              { title: 'The Power of Will', description: 'Transform creative will into tangible results. Master the Fire Gate.', gate: 3, duration: '5 weeks', lessons: 15 },
            ].map((course) => (
              <Link
                key={course.title}
                href={`/academy/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group card-3d liquid-glass rounded-2xl border border-white/[0.06] p-6 transition-all duration-500 hover:border-white/[0.12]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-gold-bright/15 px-2.5 py-1 text-[10px] font-semibold text-gold-bright">
                    Gate {course.gate}
                  </span>
                  <span className="text-[10px] text-text-muted">{course.duration}</span>
                </div>

                <h3 className="font-display text-lg font-semibold group-hover:text-atlantean-teal-aqua transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="mt-2 text-sm text-text-secondary line-clamp-2">{course.description}</p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{course.lessons} lessons</span>
                  <span className="text-sm text-atlantean-teal-aqua font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Start
                    <PhArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
