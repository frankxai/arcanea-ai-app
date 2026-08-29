import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_TITLE,
  getCinematicChapterSummaries,
} from '@/lib/books/cinematic-edition';
import { getCinematicBookAccess } from '@/lib/books/polar-access';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Order confirmation — ${CINEMATIC_BOOK_TITLE}`,
  description: 'Secure order verification for the founding cinematic edition.',
  robots: { index: false, follow: false },
};

interface ConfirmedPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function ConfirmedPage({ params }: ConfirmedPageProps) {
  const { bookId } = await params;
  if (bookId !== CINEMATIC_BOOK_ID) notFound();

  const access = await getCinematicBookAccess();
  const chapters = await getCinematicChapterSummaries();
  const firstPaid = chapters.find((chapter) => chapter.number === 5);
  const granted = access.status === 'granted';

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#06080d] px-6 py-20 text-[#f4efe4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(198,148,74,0.2),transparent_32%),radial-gradient(circle_at_18%_75%,rgba(42,118,123,0.16),transparent_30%)]" aria-hidden="true" />
      <section className="relative mx-auto w-full max-w-2xl border-y border-white/10 py-14 text-center">
        <p className="font-mono text-xs tracking-[0.12em] text-[#c4a96f]">
          {granted ? 'Edition unlocked' : 'Order confirmation'}
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
          {granted ? 'The complete path is open.' : 'We’re confirming your access.'}
        </h1>
        <p className="mx-auto mt-6 max-w-lg font-serif text-lg leading-8 text-white/62">
          {granted
            ? `${CINEMATIC_BOOK_TITLE} is now attached to your Arcanea account.`
            : 'Polar may need a brief moment to publish the paid order. Access remains closed until the server verifies it; refreshing this page is safe.'}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {granted && firstPaid ? (
            <Link href={`/books/${CINEMATIC_BOOK_ID}/${firstPaid.id}`} className="rounded-full bg-[#e5c78a] px-6 py-3 text-sm font-semibold text-[#161108] transition hover:bg-[#f0d79f]">
              Continue with Chapter 5
            </Link>
          ) : (
            <Link href={`/books/${CINEMATIC_BOOK_ID}/confirmed`} className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/40">
              Check again
            </Link>
          )}
          <Link href={`/books/${CINEMATIC_BOOK_ID}`} className="text-sm text-white/48 transition hover:text-white">
            Return to the edition
          </Link>
        </div>
      </section>
    </main>
  );
}
