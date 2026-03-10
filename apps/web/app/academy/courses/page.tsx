import type { Metadata } from 'next';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Structured learning paths through the Ten Gates. Build your creative practice from Foundation to Vision with practical lessons and exercises.',
  openGraph: {
    title: 'Academy Courses — Arcanea',
    description:
      'Structured learning paths through the Ten Gates. Practical lessons, exercises, and reflections for every stage of creative growth.',
  },
};

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#34d399' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#a78bfa' },
};

export default function CoursesPage() {
  return (
    <div className="relative min-h-screen">
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs text-text-muted"
        >
          <Link
            href="/academy"
            className="transition-colors hover:text-text-secondary"
          >
            Academy
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-text-secondary">Courses</span>
        </nav>

        {/* Header */}
        <section className="mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffd700]">
              Structured Learning
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-[#ffd700] to-[#f59e0b] bg-clip-text text-transparent">
              Academy Courses
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-secondary leading-relaxed md:text-lg">
            Each course maps to a Gate and provides practical lessons, exercises,
            and reflections. Work through them in order, or jump to the one that
            calls to you.
          </p>
        </section>

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {COURSES.map((course) => {
            const diff = DIFFICULTY_LABELS[course.difficulty];
            return (
              <Link
                key={course.slug}
                href={`/academy/courses/${course.slug}`}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-md transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05]"
              >
                {/* Top row */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: course.color }}
                    >
                      Gate {course.gate} — {course.gateName}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${diff.color}15`,
                      color: diff.color,
                    }}
                  >
                    {diff.label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display text-xl font-bold transition-colors duration-200 group-hover:text-[#ffd700]">
                  {course.title}
                </h2>
                <p className="mt-0.5 text-sm text-text-muted">
                  {course.subtitle}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="mt-5 flex items-center gap-4 border-t border-white/[0.05] pt-4">
                  <span className="text-xs text-text-muted">
                    {course.lessons.length} lessons
                  </span>
                  <span className="text-xs text-text-muted">
                    {course.duration}
                  </span>
                  <span className="text-xs text-text-muted">
                    {course.element}
                  </span>
                </div>

                {/* Prerequisites */}
                {course.prerequisites.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] text-text-muted">
                      Requires:{' '}
                      {course.prerequisites
                        .map((p) => {
                          const pre = COURSES.find((c) => c.slug === p);
                          return pre?.title ?? p;
                        })
                        .join(', ')}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted mb-2">
            More courses in development
          </p>
          <p className="text-sm text-text-secondary">
            Courses for the Heart, Crown, Starweave, Unity, and Source Gates are
            being crafted. Each will open when the time is right.
          </p>
        </div>

        {/* Back to Academy */}
        <div className="mt-8 text-center">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-white/[0.2] hover:text-white"
          >
            Back to Academy
          </Link>
        </div>
      </main>
    </div>
  );
}
