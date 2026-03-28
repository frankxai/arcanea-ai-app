'use client';

import Link from 'next/link';
import { PhActivity, PhArrowRight, PhSparkle } from '@/lib/phosphor-icons';
import { ActivityFeed } from '@/components/community/activity-feed';

export function ActivityFeedSection() {
  return (
    <section
      className="py-16 border-t border-white/[0.04]"
      aria-labelledby="activity-heading"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column: heading + description */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
            <PhActivity className="w-3 h-3 text-crystal" />
            <span className="text-xs font-mono tracking-widest uppercase text-crystal">
              Live Activity
            </span>
          </div>
          <h2
            id="activity-heading"
            className="text-fluid-3xl font-display font-bold mb-4"
          >
            The pulse of creation
          </h2>
          <p className="text-text-secondary font-sans mb-6">
            See what the community is building, who is advancing through the
            Gates, and which creations are resonating across the multiverse.
          </p>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
          >
            <PhSparkle className="w-4 h-4" />
            Start creating
            <PhArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right column: activity feed */}
        <div className="lg:col-span-2 liquid-glass rounded-2xl p-5 border border-white/[0.04]">
          <ActivityFeed maxItems={8} />
        </div>
      </div>
    </section>
  );
}
