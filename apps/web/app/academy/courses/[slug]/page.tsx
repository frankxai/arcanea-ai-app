import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, getCourse } from '@/lib/courses';

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: 'Course Not Found' };

  return {
    title: `${course.title} — Academy Course`,
    description: course.description,
    openGraph: {
      title: `${course.title} | Academy — Arcanea`,
      description: course.description,
    },
  };
}

// ── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

// ── Lesson type labels ───────────────────────────────────────────────────────

const LESSON_TYPES: Record<string, { label: string; icon: string }> = {
  reading: { label: 'Reading', icon: '📖' },
  exercise: { label: 'Exercise', icon: '✏️' },
  reflection: { label: 'Reflection', icon: '🪞' },
  practice: { label: 'Practice', icon: '🎯' },
};

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#34d399' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#a78bfa' },
};

// ── Simple markdown renderer (headings, paragraphs, bold, lists, blockquotes)

function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let blockquoteLines: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="mb-4 ml-4 list-disc space-y-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm text-text-secondary leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  }

  function flushBlockquote() {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote
          key={key++}
          className="mb-4 border-l-2 border-white/20 pl-4 italic text-text-secondary"
        >
          {blockquoteLines.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {renderInline(line)}
            </p>
          ))}
        </blockquote>,
      );
      blockquoteLines = [];
    }
  }

  function renderInline(text: string): React.ReactNode {
    // Bold (**text**)
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white/90">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      blockquoteLines.push(trimmed.slice(2));
      continue;
    }
    flushBlockquote();

    // Heading
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={key++} className="mb-3 mt-6 font-display text-base font-semibold text-white/90">
          {trimmed.slice(4)}
        </h4>,
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="mb-3 mt-8 font-display text-lg font-bold text-white">
          {trimmed.slice(3)}
        </h3>,
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === '---') {
      flushList();
      elements.push(
        <hr key={key++} className="my-6 border-white/[0.06]" />,
      );
      continue;
    }

    // List item
    if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^[-\d]+[.)]\s*/, '');
      listItems.push(content);
      continue;
    }

    // Empty line
    if (trimmed === '') {
      flushList();
      continue;
    }

    // Paragraph
    flushList();
    elements.push(
      <p key={key++} className="mb-3 text-sm text-text-secondary leading-relaxed">
        {renderInline(trimmed)}
      </p>,
    );
  }

  flushList();
  flushBlockquote();

  return elements;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const diff = DIFFICULTY_LABELS[course.difficulty];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `https://arcanea.ai/academy/courses/${slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Arcanean Academy',
      url: 'https://arcanea.ai/academy',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: course.duration,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Academy', item: 'https://arcanea.ai/academy' },
        { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://arcanea.ai/academy/courses' },
        { '@type': 'ListItem', position: 3, name: course.title, item: `https://arcanea.ai/academy/courses/${slug}` },
      ],
    },
  };

  // Find prev/next courses
  const courseIndex = COURSES.findIndex((c) => c.slug === slug);
  const prevCourse = courseIndex > 0 ? COURSES[courseIndex - 1] : null;
  const nextCourse = courseIndex < COURSES.length - 1 ? COURSES[courseIndex + 1] : null;

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs text-text-muted"
        >
          <Link href="/academy" className="transition-colors hover:text-text-secondary">
            Academy
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/academy/courses" className="transition-colors hover:text-text-secondary">
            Courses
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-text-secondary">{course.title}</span>
        </nav>

        {/* Course Header */}
        <section className="mb-12 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div
              className="absolute -left-16 -top-16 h-64 w-64 rounded-full blur-[120px]"
              style={{ backgroundColor: `${course.color}30` }}
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
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

          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${course.color}, white, ${course.color}80)`,
              }}
            >
              {course.title}
            </span>
          </h1>
          <p className="mt-1 text-base text-text-muted">{course.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm text-text-secondary leading-relaxed md:text-base">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap gap-6 text-xs text-text-muted">
            <span>{course.lessons.length} lessons</span>
            <span>{course.duration}</span>
            <span>Guardian: {course.guardian}</span>
            <span>Element: {course.element}</span>
          </div>
        </section>

        {/* Outcomes */}
        <section className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="mb-4 font-display text-lg font-bold">What You Will Learn</h2>
          <ul className="space-y-2">
            {course.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: `${course.color}20`,
                    color: course.color,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-text-secondary">{outcome}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Lessons */}
        <section className="mb-12">
          <h2 className="mb-6 font-display text-lg font-bold">Lessons</h2>
          <div className="space-y-8">
            {course.lessons.map((lesson, i) => {
              const lt = LESSON_TYPES[lesson.type];
              return (
                <article
                  key={lesson.id}
                  id={lesson.id}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-md"
                >
                  {/* Lesson header */}
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: `${course.color}18`,
                            color: course.color,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-medium text-text-muted">
                          {lt.label} · {lesson.duration}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold">
                        {lesson.title}
                      </h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  {/* Lesson content */}
                  <div className="border-t border-white/[0.05] pt-5">
                    {renderMarkdown(lesson.content)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Course navigation */}
        <nav
          aria-label="Course navigation"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {prevCourse ? (
            <Link
              href={`/academy/courses/${prevCourse.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-white/[0.12]"
            >
              <span className="text-text-muted transition-transform group-hover:-translate-x-0.5">
                ←
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Previous
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: prevCourse.color }}
                >
                  {prevCourse.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/academy/courses"
            className="hidden items-center gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2 text-xs text-text-muted transition-colors hover:text-text-secondary sm:inline-flex"
          >
            All Courses
          </Link>

          {nextCourse ? (
            <Link
              href={`/academy/courses/${nextCourse.slug}`}
              className="group flex items-center justify-end gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-white/[0.12]"
            >
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Next
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: nextCourse.color }}
                >
                  {nextCourse.title}
                </p>
              </div>
              <span className="text-text-muted transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  );
}
