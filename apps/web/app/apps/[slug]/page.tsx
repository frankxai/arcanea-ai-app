import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { APPS } from "../apps-data";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

function slugFromHref(href?: string) {
  return href?.startsWith("/apps/") ? href.slice("/apps/".length) : undefined;
}

function findApp(slug: string) {
  return APPS.find((app) => slugFromHref(app.href) === slug);
}

export function generateStaticParams() {
  return APPS.filter((app) => slugFromHref(app.href)).map((app) => ({
    slug: slugFromHref(app.href) as string,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = findApp(slug);

  if (!app) {
    return { title: "App Not Found — Arcanea" };
  }

  return {
    title: `${app.name} — Apps — Arcanea`,
    description: app.tagline,
    openGraph: {
      title: `${app.name} — Arcanea`,
      description: app.tagline,
    },
    alternates: { canonical: `/apps/${slug}` },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = findApp(slug);

  if (!app) {
    notFound();
  }

  const related = APPS.filter(
    (a) => a.filterCategory === app.filterCategory && a.name !== app.name,
  ).slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Link
            href="/apps"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/35 hover:text-white/70 transition-colors mb-8"
          >
            &larr; All apps
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{
                background: `${app.color}12`,
                border: `1px solid ${app.color}25`,
                color: app.color,
              }}
            >
              {app.glyph}
            </div>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border"
              style={{
                background: `${app.color}10`,
                borderColor: `${app.color}28`,
                color: app.color,
              }}
            >
              {STATUS_LABEL[app.status ?? "live"]}
            </span>
          </div>

          <p
            className="text-[11px] font-mono tracking-[0.2em] uppercase mb-2"
            style={{ color: `${app.color}bb` }}
          >
            {app.category}
          </p>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-[-0.02em] text-white mb-4">
            {app.name}
          </h1>

          <p className="text-base md:text-lg text-white/50 leading-relaxed mb-8 font-body max-w-xl">
            {app.tagline}
          </p>

          {app.capabilities && app.capabilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {app.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono text-white/50 bg-white/[0.03] border border-white/[0.06]"
                >
                  {cap}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/15 hover:border-[var(--arc-brand-atlantean-teal)]/35 transition-all duration-200"
            >
              Request early access
              <span className="text-xs">&rarr;</span>
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/60 hover:border-white/[0.15] hover:text-white/80 transition-all duration-200"
            >
              Read connector docs
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4">
              More in {app.category}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((r) => (
                <Link
                  key={r.name}
                  href={r.href ?? "/apps"}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center hover:border-white/[0.15] transition-colors"
                >
                  <div
                    className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: `${r.color}12`,
                      color: r.color,
                    }}
                  >
                    {r.glyph}
                  </div>
                  <p className="text-[11px] text-white/60">{r.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
