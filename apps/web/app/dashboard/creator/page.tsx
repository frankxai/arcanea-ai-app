import type { Metadata } from 'next';
import { CreatorDashboardClient } from './creator-dashboard-client';

export const metadata: Metadata = {
  title: 'Creator Dashboard | Arcanea',
  description:
    'Your forged Luminors, their usage, and your earnings. Transparent creator economics on the Arcanea registry.',
};

export default function CreatorDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[0.3em] text-white/40">
          Creator Registry
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold text-white/90">
          Your Forge
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/60">
          Every Luminor you forge, every invocation it handles, every credit you earn.
          Transparent 85/15 revenue share. No hidden fees.
        </p>
      </header>
      <CreatorDashboardClient />
    </main>
  );
}
