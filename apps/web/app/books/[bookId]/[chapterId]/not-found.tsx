import Link from "next/link";

export default function ChapterNotFound() {
  return (
    <section
      aria-labelledby="chapter-unavailable-title"
      className="mx-auto max-w-2xl px-6 py-24"
    >
      <h1
        id="chapter-unavailable-title"
        className="font-display text-3xl font-semibold text-[var(--arc-text-primary)] sm:text-4xl"
      >
        Chapter unavailable
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--arc-text-secondary)]">
        This chapter isn&apos;t available at this address. Browse the books to
        choose a public chapter.
      </p>
      <Link
        href="/books"
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--arc-brand-atlantean-teal)] px-5 py-3 font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-cosmic-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)] sm:w-auto"
      >
        Browse books
      </Link>
    </section>
  );
}
