import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reference Not Released — Arcanea',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Series bibles and development reference documents remain internal.
 * Public companion works require their own approved release manifest.
 */
export default function DocPage() {
  notFound();
}
