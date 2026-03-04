import Link from 'next/link';

interface PlaceholderPageProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function PlaceholderPage({
  eyebrow = 'Arcanea',
  title,
  description,
  primaryHref = '/chat',
  primaryLabel = 'Go to Chat',
  secondaryHref = '/',
  secondaryLabel = 'Return Home',
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-3xl py-20">
      <div className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-8 md:p-10">
        <p className="mb-2 text-xs font-mono uppercase tracking-[0.35em] text-atlantean-teal-aqua">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-xl border border-white/[0.10] px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-white/[0.20] hover:text-text-primary"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

