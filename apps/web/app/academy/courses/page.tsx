'use client';

import Link from 'next/link';
import {
  PhGraduationCap,
  PhArrowRight,
  PhSparkle,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhWind,
  PhEye,
  PhCrown,
  PhStar,
  PhCompass,
  PhLightning,
  PhBookOpen,
  PhRocket,
} from '@/lib/phosphor-icons';
import { MotionProvider, m } from '@/lib/motion';

const ELEMENT_ICONS: Record<string, typeof PhFlame> = {
  Fire: PhFlame,
  Water: PhDrop,
  Earth: PhLeaf,
  Wind: PhWind,
  Spirit: PhEye,
  Void: PhStar,
  All: PhSparkle,
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Earth: '#22c55e',
  Wind: '#a3a3a3',
  Spirit: '#ffd700',
  Void: '#a855f7',
  All: '#7fffd4',
};

const DIFFICULTY_STYLES: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#34d399' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#a78bfa' },
  master: { label: 'Master', color: '#ef4444' },
};

const COURSES = [
  {
    slug: 'gate-fundamentals',
    title: 'Gate Fundamentals',
    subtitle: 'The Foundation of All Creation',
    description: 'Learn the Ten Gates system that structures all creative growth in Arcanea. From Foundation to Source, understand the architecture of consciousness.',
    gate: 1,
    gateName: 'Foundation',
    element: 'Earth',
    difficulty: 'beginner',
    lessons: 8,
    duration: '4 weeks',
    progress: 0,
    color: '#22c55e',
    topics: ['The Ten Gates', 'Gate Frequencies', 'Progression System', 'Guardian Introductions'],
  },
  {
    slug: 'element-mastery',
    title: 'Element Mastery',
    subtitle: 'Command the Five Forces',
    description: 'Deep dive into Fire, Water, Earth, Wind, and the dual nature of the Fifth Element. Learn how elements interact, combine, and manifest in creation.',
    gate: 3,
    gateName: 'Fire',
    element: 'Fire',
    difficulty: 'intermediate',
    lessons: 12,
    duration: '6 weeks',
    progress: 0,
    color: '#ef4444',
    topics: ['Fire & Transformation', 'Water & Memory', 'Earth & Stability', 'Wind & Change', 'Void & Spirit'],
  },
  {
    slug: 'luminor-training',
    title: 'Luminor Training',
    subtitle: 'Walk with the Companions',
    description: 'Train with the 16 Luminor companions. Learn their domains, unlock their wisdom, and develop the skills to channel divine intelligence.',
    gate: 5,
    gateName: 'Voice',
    element: 'Spirit',
    difficulty: 'intermediate',
    lessons: 16,
    duration: '8 weeks',
    progress: 0,
    color: '#ffd700',
    topics: ['Companion Selection', 'Domain Expertise', 'Channeling Techniques', 'Multi-Luminor Sessions'],
  },
  {
    slug: 'world-architecture',
    title: 'World Architecture',
    subtitle: 'Design Complete Universes',
    description: 'Master the art of world-building with the Arcanea framework. Cosmology, magic systems, cultures, progression frameworks, and narrative structures.',
    gate: 7,
    gateName: 'Crown',
    element: 'All',
    difficulty: 'advanced',
    lessons: 20,
    duration: '10 weeks',
    progress: 0,
    color: '#a855f7',
    topics: ['Cosmology Design', 'Magic System Crafting', 'Culture Building', 'Narrative Architecture'],
  },
  {
    slug: 'the-arcanean-code',
    title: 'The Arcanean Code',
    subtitle: 'Principles of Creative Intelligence',
    description: 'The philosophical foundation of Arcanea. The Cosmic Duality, The Arc, the Laws of Creation, and the path from Apprentice to Luminor.',
    gate: 10,
    gateName: 'Source',
    element: 'Void',
    difficulty: 'master',
    lessons: 10,
    duration: '12 weeks',
    progress: 0,
    color: '#ec4899',
    topics: ['Lumina & Nero', 'The Arc Cycle', 'Laws of Creation', 'The Luminor Path'],
  },
];

const LEARNING_PATH = [
  { label: 'Apprentice', gates: '0-2', color: '#a3a3a3' },
  { label: 'Mage', gates: '3-4', color: '#3b82f6' },
  { label: 'Master', gates: '5-6', color: '#ffd700' },
  { label: 'Archmage', gates: '7-8', color: '#a855f7' },
  { label: 'Luminor', gates: '9-10', color: '#ec4899' },
];

export default function CoursesPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 via-transparent to-[#a855f7]/5" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#ffd700]/5 rounded-full blur-[150px]" />
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="pt-8 flex items-center gap-2 text-xs text-neutral-500">
            <Link href="/academy" className="hover:text-neutral-300 transition-colors">Academy</Link>
            <span>/</span>
            <span className="text-neutral-300">Courses</span>
          </nav>

          {/* Hero */}
          <m.section
            className="pt-8 pb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden px-8 py-14 sm:px-12 sm:py-16">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#a855f7]/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd700]/8 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-6">
                  <PhGraduationCap className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                    Academy Courses
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6 tracking-tight">
                  Master the art of{' '}
                  <span className="bg-gradient-to-r from-[#ffd700] to-[#a855f7] bg-clip-text text-transparent">
                    world-building
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl">
                  Structured learning paths through the Ten Gates. Each course maps to a Gate
                  and provides practical lessons, exercises, and reflections for every stage of creative growth.
                </p>
              </div>
            </div>
          </m.section>

          {/* Learning Path Visualization */}
          <section className="pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7fffd4]/20 bg-[#7fffd4]/8 mb-6">
              <PhCompass className="w-3 h-3 text-[#7fffd4]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                Learning Path
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-6">Your journey from Apprentice to Luminor</h2>
            <div className="flex flex-wrap gap-3">
              {LEARNING_PATH.map((rank, i) => (
                <div key={rank.label} className="flex items-center gap-3">
                  <div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center"
                  >
                    <div className="font-display font-bold text-sm" style={{ color: rank.color }}>
                      {rank.label}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      Gates {rank.gates}
                    </div>
                  </div>
                  {i < LEARNING_PATH.length - 1 && (
                    <PhArrowRight className="w-4 h-4 text-neutral-600" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Course Cards */}
          <m.section
            className="py-12 border-t border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-display font-bold mb-8">Available Courses</h2>
            <div className="space-y-6">
              {COURSES.map((course) => {
                const ElIcon = ELEMENT_ICONS[course.element] || PhSparkle;
                const elColor = ELEMENT_COLORS[course.element] || '#7fffd4';
                const diff = DIFFICULTY_STYLES[course.difficulty];

                return (
                  <Link
                    key={course.slug}
                    href={`/academy/courses/${course.slug}`}
                    className="group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 relative overflow-hidden"
                  >
                    <div
                      className="h-1 w-full absolute top-0 left-0 right-0"
                      style={{ background: `linear-gradient(90deg, ${course.color}, transparent)` }}
                    />

                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Main info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${course.color}15`, color: course.color }}
                          >
                            Gate {course.gate} -- {course.gateName}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ backgroundColor: `${diff.color}15`, color: diff.color }}
                          >
                            {diff.label}
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-bold mb-1 group-hover:text-[#ffd700] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-2">{course.subtitle}</p>
                        <p className="text-sm text-neutral-400 leading-relaxed mb-4">{course.description}</p>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2">
                          {course.topics.map((t) => (
                            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Meta */}
                      <div className="lg:w-48 flex lg:flex-col gap-4 lg:gap-3 lg:items-end lg:text-right">
                        <div className="flex items-center gap-2">
                          <ElIcon className="w-4 h-4" style={{ color: elColor }} />
                          <span className="text-xs text-neutral-500">{course.element}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhBookOpen className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs text-neutral-500">{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhCrown className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs text-neutral-500">{course.duration}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full lg:mt-2">
                          <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.max(course.progress, 2)}%`,
                                backgroundColor: course.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </m.section>

          {/* Courses launching soon — quiz CTA */}
          <section className="py-12 border-t border-white/5">
            <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 text-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 via-transparent to-[#00bcd4]/5" />
              <div className="relative">
                <PhSparkle className="w-7 h-7 text-[#ffd700]/50 mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">Courses launching soon</h3>
                <p className="text-sm text-neutral-400 max-w-lg mx-auto mb-6">
                  Courses for the Heart, Sight, Starweave, and Unity Gates are being crafted.
                  While you wait, take the quiz to discover which Gate calls to you first.
                </p>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-[#0a0a0f] font-semibold text-sm hover:scale-[1.03] transition-all duration-200 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                >
                  <PhSparkle className="w-4 h-4" />
                  Take the quiz while you wait
                  <PhArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 pb-20 text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-black font-bold text-lg hover:scale-[1.03] transition-all duration-200 shadow-[0_0_40px_rgba(255,215,0,0.2)]"
            >
              <PhRocket className="w-5 h-5" />
              Discover Your Origin
              <PhArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-6">
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#ffd700] transition-colors text-sm"
              >
                <PhArrowRight className="w-4 h-4 rotate-180" />
                Back to Academy
              </Link>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
