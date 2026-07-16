/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { CommandSidebar } from './sidebar';

export const metadata: Metadata = {
  title: 'Command Center',
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
    <div className="flex min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      {/* Desktop sidebar */}
      <CommandSidebar />

      {/* Main content area */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
