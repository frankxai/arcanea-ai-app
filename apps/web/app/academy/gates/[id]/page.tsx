import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PhArrowRight,
  PhArrowLeft,
  PhStar,
  PhBookOpen,
  PhSparkle,
  PhWaves,
  PhFire,
  PhWind,
  PhLeaf,
  PhEye,
  PhCrown,
} from '@/lib/phosphor-icons';
import {
  GATES,
  GATE_ORDER,
  NUMBER_TO_SLUG,
  resolveGate,
  type GateData,
} from '@/lib/gates';

// ── Element icon helper ───────────────────────────────────────────────────────

function ElementIcon({ element, className }: { element: string; className?: string }) {
  const cls = className ?? 'w-5 h-5';
  if (element.includes('Fire') || element.includes('Light')) return <PhFire className={cls} />;
  if (element.includes('Water')) return <PhWaves className={cls} />;
  if (element.includes('Wind')) return <PhWind className={cls} />;
  if (element.includes('Earth')) return <PhLeaf className={cls} />;
  if (element.includes('Spirit') || element.includes('Void')) return <PhEye className={cls} />;
  if (element.includes('Crown') || element.includes('All')) return <PhCrown className={cls} />;
  return <PhStar className={cls} />;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gate = resolveGate(id);
  if (!gate) return { title: 'Gate Not Found | Academy' };

  return {
    title: `${gate.name} Gate — ${gate.frequency} | Academy`,
    description: `The ${gate.name} Gate at ${gate.frequency}. Guardian: ${gate.guardian}. Godbeast: ${gate.godbeast}. Element: ${gate.element}. ${gate.description}`,
    openGraph: {
      title: `${gate.name} Gate | ${gate.frequency} | Academy`,
      description: `"${gate.quote}" — ${gate.guardian}, Guardian of the ${gate.name} Gate.`,
      type: 'website',
    },
  };
}

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const slugParams = GATE_ORDER.map((id) => ({ id }));
  const numericParams = Object.keys(NUMBER_TO_SLUG).map((id) => ({ id }));
  return [...slugParams, ...numericParams];
}

// ── Shared sub-components (Server) ────────────────────────────────────────────

function GateHero({ gate }: { gate: GateData }) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl liquid-glass-elevated border border-white/[0.08] p-10 md:p-14">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute -left-16 -top-16 h-64 w-64 rounded-full blur-[120px]"
          style={{ backgroundColor: gate.glowColor }}
        />
        <div
          className="absolute right-[-5%] bottom-0 h-80 w-80 rounded-full blur-[100px]"
          style={{ backgroundColor: gate.glowColor, opacity: 0.5 }}
        />
      </div>

      {/* Gate badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full liquid-glass border border-white/[0.08] px-4 py-1.5">
        <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: gate.color }} />
        <span className="font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: gate.color }}>
          Gate {gate.number} of 10
        </span>
      </div>

      <h1 className="font-display mb-3 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(135deg, ${gate.color}, white, ${gate.color}80)` }}
        >
          {gate.name}
        </span>
      </h1>

      {/* Frequency */}
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-mono text-3xl font-bold tracking-wider" style={{ color: gate.color }}>
          {gate.frequency}
        </span>
        <span className="text-sm text-text-muted">Solfeggio Frequency</span>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <ElementIcon element={gate.element} className="w-4 h-4" />
        <span className="text-sm text-text-secondary">{gate.element} Element</span>
        <span className="text-text-muted mx-1" aria-hidden="true">·</span>
        <span className="text-sm text-text-secondary">{gate.domain}</span>
      </div>

      <p className="mb-8 max-w-2xl text-base text-text-secondary leading-relaxed md:text-lg">
        {gate.description}
      </p>

      <blockquote className="mb-8 border-l-2 pl-4 italic text-text-secondary" style={{ borderColor: gate.color }}>
        <p className="font-body text-lg">&ldquo;{gate.quote}&rdquo;</p>
        <footer className="mt-1 text-xs text-text-muted not-italic">
          — {gate.guardian}, Guardian of the {gate.name} Gate
        </footer>
      </blockquote>

      <div className="flex flex-wrap gap-4">
        <Link
          href={`/lore/guardians/${gate.guardianSlug}`}
          className="group inline-flex items-center gap-2 rounded-2xl liquid-glass border border-white/[0.12] px-7 py-3 font-semibold transition-all duration-300 hover:border-white/[0.20] hover:bg-white/[0.06]"
          style={{ color: gate.color }}
        >
          Meet {gate.guardian}
          <PhArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/academy/assessment"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.10] px-7 py-3 font-semibold text-text-secondary hover:border-white/[0.18] hover:text-white transition-all duration-300"
        >
          <PhStar className="w-4 h-4" />
          Open This Gate
        </Link>
      </div>
    </section>
  );
}

function GuardianAndGodbeast({ gate }: { gate: GateData }) {
  const rankDesc =
    gate.rank === 'Apprentice' ? 'all journeys begin'
    : gate.rank === 'Mage' ? 'deeper skill awakens'
    : gate.rank === 'Master' ? 'true mastery takes form'
    : gate.rank === 'Archmage' ? 'wisdom approaches its fullness'
    : 'the journey becomes the teacher itself';

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl liquid-glass border border-white/[0.06] p-7">
        <p className="mb-1 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: gate.color }}>
          Guardian
        </p>
        <h2 className="font-display mb-3 text-2xl font-bold">{gate.guardian}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {gate.guardian} is the keeper of the {gate.name} Gate, holding the {gate.frequency}{' '}
          frequency. As Guardian, {gate.guardian} guides creators through the domain of{' '}
          {gate.domain.toLowerCase()} — the threshold where {rankDesc}.
        </p>
        <div className="mt-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${gate.color}18`, color: gate.color }}
          >
            Rank: {gate.rank}
          </span>
        </div>
      </div>

      <div className="rounded-2xl liquid-glass border border-white/[0.06] p-7">
        <p className="mb-1 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: gate.color }}>
          Godbeast
        </p>
        <h2 className="font-display mb-3 text-2xl font-bold">{gate.godbeast}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{gate.godBeastDesc}</p>
      </div>
    </div>
  );
}

function GateNav({ gate }: { gate: GateData }) {
  const gateIndex = GATE_ORDER.indexOf(gate.id);
  const prevGate = gateIndex > 0 ? GATES[GATE_ORDER[gateIndex - 1]] : null;
  const nextGate = gateIndex < GATE_ORDER.length - 1 ? GATES[GATE_ORDER[gateIndex + 1]] : null;

  return (
    <nav
      aria-label="Gate navigation"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {prevGate ? (
        <Link
          href={`/academy/gates/${prevGate.id}`}
          className="group flex items-center gap-3 rounded-2xl liquid-glass border border-white/[0.06] px-5 py-4 hover:border-white/[0.12] transition-all duration-300"
        >
          <PhArrowLeft className="w-4 h-4 text-text-muted group-hover:-translate-x-0.5 transition-transform" />
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Gate {prevGate.number}</p>
            <p className="font-display font-semibold text-sm" style={{ color: prevGate.color }}>{prevGate.name}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      <Link
        href="/academy/gates"
        className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors liquid-glass border border-white/[0.04]"
      >
        All Ten Gates
      </Link>

      {nextGate ? (
        <Link
          href={`/academy/gates/${nextGate.id}`}
          className="group flex items-center gap-3 rounded-2xl liquid-glass border border-white/[0.06] px-5 py-4 hover:border-white/[0.12] transition-all duration-300 justify-end"
        >
          <div className="text-right">
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Gate {nextGate.number}</p>
            <p className="font-display font-semibold text-sm" style={{ color: nextGate.color }}>{nextGate.name}</p>
          </div>
          <PhArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function GateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gate = resolveGate(id);
  if (!gate) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${gate.name} — Gate ${gate.number}`,
    description: gate.description,
    url: `https://arcanea.ai/academy/gates/${id}`,
    provider: { '@type': 'Organization', name: 'Arcanean Academy', url: 'https://arcanea.ai/academy' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Academy', item: 'https://arcanea.ai/academy' },
        { '@type': 'ListItem', position: 2, name: 'Gates', item: 'https://arcanea.ai/academy/gates' },
        { '@type': 'ListItem', position: 3, name: gate.name, item: `https://arcanea.ai/academy/gates/${id}` },
      ],
    },
  };

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-text-muted">
          <Link href="/academy" className="hover:text-text-secondary transition-colors">Academy</Link>
          <span aria-hidden="true">/</span>
          <Link href="/academy/gates" className="hover:text-text-secondary transition-colors">Gates</Link>
          <span aria-hidden="true">/</span>
          <span className="text-text-secondary">{gate.name}</span>
        </nav>

        <GateHero gate={gate} />
        <GuardianAndGodbeast gate={gate} />

        {/* Element */}
        <div className="mb-8 rounded-2xl liquid-glass border border-white/[0.06] p-7">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${gate.color}18` }}
            >
              <ElementIcon element={gate.element} className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: gate.color }}>Element</p>
              <h2 className="font-display text-xl font-bold">{gate.element}</h2>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{gate.elementDesc}</p>
        </div>

        {/* Core Teachings */}
        <div className="mb-8 rounded-2xl liquid-glass border border-white/[0.06] p-7">
          <p className="mb-5 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: gate.color }}>
            Core Teachings
          </p>
          <ul className="space-y-4">
            {gate.teachings.map((teaching, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${gate.color}20`, color: gate.color }}
                >
                  {i + 1}
                </div>
                <p className="font-body text-base text-text-secondary leading-relaxed">{teaching}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Gate Practices */}
        <div className="mb-8 rounded-2xl liquid-glass border border-white/[0.06] p-7">
          <p className="mb-5 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: gate.color }}>
            Gate Practices
          </p>
          <ul className="space-y-3">
            {gate.practices.map((practice, i) => (
              <li key={i} className="flex items-start gap-3">
                <PhSparkle className="mt-0.5 w-4 h-4 shrink-0" style={{ color: gate.color }} />
                <p className="text-sm text-text-secondary leading-relaxed">{practice}</p>
              </li>
            ))}
          </ul>

          <div
            className="mt-6 rounded-xl p-4 text-sm"
            style={{ backgroundColor: `${gate.color}10`, borderLeft: `2px solid ${gate.color}40` }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: gate.color }}>
              Opens With
            </p>
            <p className="text-text-secondary">{gate.opensWith}</p>
          </div>
        </div>

        {/* Explore further */}
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          <Link
            href={`/lore/guardians/${gate.guardianSlug}`}
            className="group flex items-center justify-between rounded-2xl liquid-glass border border-white/[0.06] px-6 py-5 hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <PhBookOpen className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Lore</p>
                <p className="font-semibold text-sm">{gate.guardian} — Full Profile</p>
              </div>
            </div>
            <PhArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/library/academy-handbook"
            className="group flex items-center justify-between rounded-2xl liquid-glass border border-white/[0.06] px-6 py-5 hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <PhBookOpen className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Library</p>
                <p className="font-semibold text-sm">Academy Handbook</p>
              </div>
            </div>
            <PhArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <GateNav gate={gate} />
      </main>
    </div>
  );
}
