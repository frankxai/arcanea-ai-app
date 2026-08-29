import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_TITLE,
  CINEMATIC_EDITION_ID,
} from '@/lib/books/cinematic-edition';
import { getCinematicBookAccess } from '@/lib/books/polar-access';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Creator’s Ledger — ${CINEMATIC_BOOK_TITLE}`,
  description: 'The documented production record for the founding cinematic edition.',
  robots: { index: false, follow: false },
};

interface LedgerPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function LedgerPage({ params }: LedgerPageProps) {
  const { bookId } = await params;
  if (bookId !== CINEMATIC_BOOK_ID) notFound();

  const access = await getCinematicBookAccess();
  if (access.status !== 'granted') {
    const signInHref = `/auth/login?next=${encodeURIComponent(`/books/${CINEMATIC_BOOK_ID}/ledger`)}`;
    return (
      <main className="flex min-h-screen items-center bg-[#06080d] px-6 py-20 text-[#f4efe4]">
        <section className="mx-auto max-w-xl border-y border-white/10 py-12 text-center">
          <p className="font-mono text-xs tracking-[0.1em] text-[#bda46f]">Buyer companion</p>
          <h1 className="mt-5 font-display text-4xl">The Creator’s Ledger</h1>
          <p className="mt-6 leading-7 text-white/58">
            This documented production record belongs to the complete founding edition. It stays separate from the prose so the story remains uninterrupted.
          </p>
          <Link
            href={access.status === 'signed-out' ? signInHref : `/books/${CINEMATIC_BOOK_ID}`}
            className="mt-8 inline-flex rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/40"
          >
            {access.status === 'signed-out' ? 'Sign in to verify access' : 'View the complete edition'}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1ede3] text-[#211f1a]">
      <header className="border-b border-black/12 bg-[#0a0e13] px-6 py-16 text-[#f5f0e6]">
        <div className="mx-auto max-w-5xl">
          <Link href={`/books/${CINEMATIC_BOOK_ID}`} className="text-sm text-white/52 transition hover:text-white">
            ← {CINEMATIC_BOOK_TITLE}
          </Link>
          <p className="mt-14 font-mono text-xs tracking-[0.11em] text-[#c4a96f]">Documented production record</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">The Creator’s Ledger</h1>
          <p className="mt-6 max-w-2xl font-serif text-xl leading-8 text-white/65">
            A concise record of the decisions, sources, generative contributions, editorial interventions, and limits behind this edition. It documents the work; it does not replace the work.
          </p>
          <p className="mt-8 text-sm text-white/38">Edition revision: {CINEMATIC_EDITION_ID}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-14 px-6 py-20 lg:grid-cols-[0.68fr_1.32fr]">
        <aside className="text-sm leading-7 text-black/55">
          <p className="font-medium text-black/80">Disclosure boundary</p>
          <p className="mt-3">
            This ledger publishes owned task summaries and material contribution records. It excludes hidden reasoning, platform instructions, secrets, private paths, personal correspondence, and third-party prompt text.
          </p>
        </aside>

        <div className="space-y-16">
          <section>
            <p className="font-mono text-xs tracking-[0.08em] text-[#78603b]">01 · Human story decisions</p>
            <h2 className="mt-3 font-display text-3xl">The governing choice</h2>
            <div className="mt-5 space-y-4 text-[1.02rem] leading-8 text-black/68">
              <p>Open on a neighborhood rescue already under material pressure—not prophecy, childhood exposition, or an Academy tour.</p>
              <p>Make Arion’s first act save people and damage homes, so usefulness and harm remain inseparable. Give Mera evidence without moral infallibility. Let Emilia build a correct instrument whose system still fails the person inside it.</p>
              <p>Keep the first shared scene free. The purchase boundary begins only after Arion, Mera, and Emilia have disagreed, worked together, and become emotionally legible as a trio.</p>
            </div>
          </section>

          <section>
            <p className="font-mono text-xs tracking-[0.08em] text-[#78603b]">02 · Owned task-prompt summary</p>
            <h2 className="mt-3 font-display text-3xl">The drafting brief</h2>
            <blockquote className="mt-5 border-l-2 border-[#9c7b45] pl-6 font-serif text-lg leading-8 text-black/67">
              Draft premium adult/crossover academy fantasy in close third person, rotating Arion, Mera, and Emilia. Every chapter needs a concrete want, defensible opposition, irreversible turn, persistent material or relational cost, distinct sensory language, and one trace of ordinary life. Preserve locked canon. Treat working continuity as staging. Avoid prophecy, chosen-one coronation, generic wonder tours, lore exposition, effortless ethics, consequence-free magic, and repeated model cadence.
            </blockquote>
          </section>

          <section>
            <p className="font-mono text-xs tracking-[0.08em] text-[#78603b]">03 · Material generative contribution</p>
            <h2 className="mt-3 font-display text-3xl">What tools did—and did not—do</h2>
            <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {[
                ['Book strategy, bible, outline, and prose drafts', 'Generated and transformed under the human brief, then independently analyzed and revised.'],
                ['Canon and continuity', 'Compared against locked Arcanea canon; no model was allowed to promote staging lore into canon.'],
                ['Developmental editing', 'Critiqued structure, character arcs, pacing, promises, and payoff without silently changing the manuscript.'],
                ['Line and voice editing', 'Audited repeated cadence, procedural accumulation, point-of-view distinction, and model mannerisms.'],
                ['Model receipt', 'OpenAI Codex, GPT-5 family. Exact host-selected model and run receipt remain marked pending until release reconciliation.'],
              ].map(([term, detail]) => (
                <div key={term} className="grid gap-2 py-5 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8">
                  <dt className="font-medium text-black/78">{term}</dt>
                  <dd className="leading-7 text-black/58">{detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <p className="font-mono text-xs tracking-[0.08em] text-[#78603b]">04 · Editorial record</p>
            <h2 className="mt-3 font-display text-3xl">What judgment changed</h2>
            <ul className="mt-6 space-y-4 leading-8 text-black/65">
              <li>The intake breach moved to Chapter 6 so arrival could not become a generic school tour.</li>
              <li>The free opening expanded through Chapter 4 because origins alone did not fulfill the relationship promise.</li>
              <li>Institutional opponents retained defensible motives, evidence limits, correction rights, and consequences.</li>
              <li>Repeated dialogue templates, explanatory interpretation, trailer metaphors, and packet-like policy recitals were cut in the whole-book line pass.</li>
              <li>The final canon audit found no contradiction in the 32 prose chapters and corrected planning notes that over-authenticated Malachar or the lower structure.</li>
            </ul>
          </section>

          <section>
            <p className="font-mono text-xs tracking-[0.08em] text-[#78603b]">05 · Known limits</p>
            <h2 className="mt-3 font-display text-3xl">What remains unclaimed</h2>
            <p className="mt-5 leading-8 text-black/65">
              A model count, prompt length, or production speed is not evidence of literary quality. Exact model receipts, art provenance, title clearance, and release checks remain visibly pending until evidence is attached. Missing evidence is shown as missing rather than reconstructed from memory.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
