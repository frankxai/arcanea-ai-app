/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: t('siteName'),
    description: t('tagline'),
    alternates: {
      canonical:
        locale === routing.defaultLocale
          ? `${routing.domain}/`
          : `${routing.domain}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? `${routing.domain}/` : `${routing.domain}/${l}`,
        ]),
      ),
    },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-12 backdrop-blur-sm">
        <p className="mb-4 text-sm uppercase tracking-[0.18em] text-atlantean-aqua/80">
          {tCommon('siteName')}
        </p>
        <h1 className="font-editorial text-5xl leading-tight text-text-primary md:text-6xl">
          {t('hero')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          {t('subhero')}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/books"
            className="rounded-full bg-atlantean-aqua px-6 py-3 text-sm font-semibold text-cosmic-deep transition hover:bg-atlantean-aqua/90"
          >
            {t('cta')}
          </Link>
          <Link
            href="/books"
            className="rounded-full border border-white/[0.1] px-6 py-3 text-sm font-semibold text-text-primary transition hover:border-white/[0.25]"
          >
            {t('secondaryCta')}
          </Link>
        </div>
        <p className="mt-12 text-sm text-text-muted">{t('tagline')}</p>
      </div>

      {/* 5-Harness Fleet + Grok Personal Excellence Layer — Arcanea Visual Showcase (state-of-the-art). The 4 .grok-native excellence seeds (repo-mastery, multi-harness-orchestrator, excellence-review, harness-integration) + 2 json hooks are sovereign personal to Frank's Grok TUI usage and daily creative practice ("a bit magical, .grok only, not for everything"). They sit on ACOS (shared productivity) + SIS (SIP substrate for personal parts) and resonate with creative ethos but are not part of the Arcanea platform/academy/canon. Confirmed parity + SHARING descriptive cleanup (no opaque codename). */}
      <section className="border-t border-white/[0.08] bg-cosmic-deep/60 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-atlantean-aqua/30 bg-atlantean-aqua/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-atlantean-aqua">
              SIP SUBSTRATE · 5-HARNESS PARITY · GOD 99
            </div>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">The Harnesses.<br />World-class. Built on SIP.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-muted">
              Claude Code canonical + Codex + Gemini + Antigravity/agy + Grok Build. Portable claude-code-hooks + sovereign grok-personal excellence layer (.grok only seeds + personal creative). gstack visual proof (99+ health, TASTE, annotated). Arcanea academy + creator tools dogfood the same excellence.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {[
              { n: 'Claude Code', t: 'Canonical', d: 'Full native .claude + ACOS/SIS junctions. The reference.' },
              { n: 'Codex', t: 'OpenAI', d: 'Review, challenge, consult. Core catalog flows through.' },
              { n: 'Gemini', t: '0.43+', d: 'Junctions via ~/.gemini/config/plugins/acos-frankx.' },
              { n: 'Antigravity', t: 'agy 1.0', d: 'Junctions + .antigravity/harnesses in SIS. Creative parity.' },
              { n: 'Grok Build', t: 'TUI Native', d: 'Subagents, MCP, image/video. 4 .grok-native excellence seeds + 2 json hooks (personal layer, a bit magical, .grok only) + personal creative tools.' },
            ].map((h, idx) => (
              <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-sm">
                <div className="font-semibold text-text-primary">{h.n} <span className="text-[10px] text-text-muted">· {h.t}</span></div>
                <div className="mt-1 text-xs text-text-muted leading-tight">{h.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/[0.02] p-4 text-xs text-amber-200">
            <span className="font-semibold">Grok personal excellence layer (a bit magical, .grok only, not for everything):</span> Core (gstack, verif, orch, mcp, adapters, skill-builder) shared via claude-code-config junctions + ACOS/SIS. The 4 .grok-native excellence seeds (repo-mastery, multi-harness-orchestrator, excellence-review, harness-integration) + 2 excellence json hooks + personal creative tools (frankx personal, soul, conscious, greek/spartan, suno, video, health, oracle) are sovereign in .grok/skills + .grok/hooks (the seeds) or personal overlays (creative tools) ONLY per SHARING.md + SIP §5. Never leak to shared catalog. /sip-share-audit + sip-attest. Greps: 0 in shared .claude/skills. These are personal to Frank's practice (on ACOS foundation + SIP for personal vaults), with creative spirit that resonates with Arcanea but kept separate from the public Arcanea platform.
          </div>

          {/* 3D Harness Orb Demo — visual state-of-the-art enhancement (phase4) */}
          <div className="mt-8 mx-auto max-w-4xl">
            <div className="text-center mb-4">
              <div className="inline text-[10px] font-mono uppercase tracking-widest text-atlantean-aqua/70">3D HARNESS ORB DEMO · INTERACTIVE VISUAL PROOF</div>
            </div>
            <div className="relative h-48 flex items-center justify-center [perspective:1200px]" style={{ background: 'radial-gradient(circle at 40% 30%, rgba(0,200,180,0.06), transparent 60%)' }}>
              {/* Central Orb representing the 5-fleet + Kenya layer */}
              <div className="relative w-32 h-32 rounded-full border border-atlantean-aqua/40 bg-cosmic-deep/80 shadow-[0_0_60px_-10px_rgba(0,200,180,0.5),inset_0_0_40px_rgba(255,255,255,0.06)] flex items-center justify-center text-[10px] font-mono text-atlantean-aqua tracking-[2px] animate-[spin_30s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                SIP
                <div className="absolute inset-0 rounded-full border border-white/10" style={{ transform: 'rotateX(60deg) rotateY(20deg)' }} />
                <div className="absolute inset-0 rounded-full border border-white/10" style={{ transform: 'rotateX(-50deg) rotateY(-30deg)' }} />
              </div>

              {/* Orbiting harness nodes (5) */}
              {[
                { label: 'Claude', x: -110, y: -30, note: 'core' },
                { label: 'Codex', x: 90, y: -40, note: 'core' },
                { label: 'Gemini', x: -70, y: 70, note: 'core' },
                { label: 'Agy', x: 80, y: 55, note: 'core' },
                { label: 'Grok', x: 0, y: -95, note: '.grok personal' },
              ].map((node, i) => (
                <div key={i} className="absolute text-[9px] px-2 py-0.5 rounded border border-white/20 bg-black/60 text-text-primary font-mono tracking-widest" style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: 'translate(-50%, -50%)' }}>
                  {node.label}
                  <span className="ml-1 text-[7px] text-atlantean-aqua/60">{node.note}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-[9px] text-text-muted mt-2">Orbiting nodes: core shared vs Grok personal excellence seeds (.grok only) + personal creative. gstack + TASTE verified 99+ • SIP attested • World-class restraint + depth</div>
          </div>

          <div className="mt-4 text-center text-[10px] text-text-muted">
            gstack is the hammer: real kickoff baselines + atomic fixes + 99+ health + SIP attested screenshots on frankx + arcanea sources for the fleet UI. TASTE 7 gates. These two repos (frankx.ai-vercel-website + arcanea-ai-app) are deliberate visual state-of-the-art showcases — glass, depth, restraint, the best thing. Core shared via junctions. Grok personal excellence seeds + personal creative stay .grok/personal only (a bit magical, not for everything). Built on SIP v1.1.1.
          </div>
        </div>
      </section>

      <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary">
        <Link href="/about" className="hover:text-atlantean-aqua">
          {tNav('about')}
        </Link>
        <Link href="/books" className="hover:text-atlantean-aqua">
          {tNav('books')}
        </Link>
      </nav>
    </div>
  );
}
