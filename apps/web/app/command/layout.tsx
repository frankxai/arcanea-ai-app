import { Metadata } from 'next';
import { CommandSidebar } from './sidebar';

export const metadata: Metadata = {
  title: 'Command Center — Arcanea',
  description:
    'Creator Command Center: manage media assets, monitor agents, schedule social posts, and publish content across the Arcanea multiverse.',
  robots: { index: false },
  alternates: { canonical: '/command' },
};

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white">
      {/* Desktop sidebar */}
      <CommandSidebar />

      {/* Main content area */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
