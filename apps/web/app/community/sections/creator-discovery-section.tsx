'use client';

import { PhUsers, PhCompass } from '@/lib/phosphor-icons';
import { CreatorDiscovery } from '@/components/community/creator-discovery';

export function CreatorDiscoverySection() {
  return (
    <section
      className="py-16 border-t border-white/[0.04]"
      aria-labelledby="discover-heading"
    >
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/8 mb-5">
          <PhCompass className="w-3 h-3 text-brand-primary" />
          <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
            Discover
          </span>
        </div>
        <h2
          id="discover-heading"
          className="text-fluid-3xl font-display font-bold mb-4"
        >
          Find your circle
        </h2>
        <p className="text-text-secondary font-sans max-w-2xl">
          Every creator brings a unique element to the multiverse. Search by
          affinity, gate level, or house to find creators whose work resonates
          with your own.
        </p>
      </div>

      <CreatorDiscovery maxVisible={8} showFilters />
    </section>
  );
}
