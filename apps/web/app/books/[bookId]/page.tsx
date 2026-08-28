import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book Not Released — Arcanea',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Manuscript pages are default-deny. When a book passes every release gate,
 * replace this boundary with a reader backed by the explicit public allowlist.
 */
export default function BookPage() {
  notFound();
}
