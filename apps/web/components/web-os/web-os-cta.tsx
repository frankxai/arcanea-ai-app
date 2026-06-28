// Scene 5 — conversion. One calm CTA. Honest status. No CTA farm.

import type { JSX } from 'react';
import Link from 'next/link';

export function WebOsCta(): JSX.Element {
  return (
    <section className="relative w-full py-40 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-aquamarine" aria-hidden="true" />
          <span className="font-mono text-xs tracking-widest uppercase text-text-muted">
            Live · reference build
          </span>
        </span>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-text-primary leading-[1.1] mb-6">
          Build the next premium world.
        </h2>
        <p className="font-body text-lg text-text-secondary max-w-xl mx-auto mb-10">
          The full system &mdash; taste, motion, 3D, copy, and quality gates &mdash; ships as
          a portable skill. Run it in any repo, with any agent.
        </p>

        <Link
          href="https://github.com/frankxai/claude-skills-library/tree/main/premium-web-os"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-[#09090b] bg-aquamarine hover:bg-aquamarine-soft transition-colors"
        >
          See the operating model
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
