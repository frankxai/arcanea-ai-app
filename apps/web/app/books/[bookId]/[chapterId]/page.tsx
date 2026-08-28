import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Chapter Not Released — Arcanea',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Development chapters are never read from the repository by a public route.
 */
export default function ChapterPage() {
  notFound();
}
