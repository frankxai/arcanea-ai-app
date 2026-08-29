import Link from 'next/link';
import { BookPurchaseButton } from '@/components/books/book-purchase-button';
import type { BookAccessState } from '@/lib/books/polar-access';
import {
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_TITLE,
  CINEMATIC_EDITION_PRICE,
} from '@/lib/books/cinematic-edition';

interface CinematicPaywallProps {
  chapterNumber: number;
  chapterTitle: string;
  chapterId: string;
  access: BookAccessState;
  checkoutConfigured: boolean;
}

export function CinematicPaywall({
  chapterNumber,
  chapterTitle,
  chapterId,
  access,
  checkoutConfigured,
}: CinematicPaywallProps) {
  const signedOut = access.status === 'signed-out';
  const verifying = access.status === 'unavailable';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080d] px-6 py-20 text-[#f4efe4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_10%,rgba(178,126,62,0.18),transparent_34%),radial-gradient(circle_at_12%_70%,rgba(35,116,125,0.16),transparent_30%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl">
        <Link href={`/books/${CINEMATIC_BOOK_ID}`} className="text-sm text-[#b4c9c5] transition hover:text-white">
          ← {CINEMATIC_BOOK_TITLE}
        </Link>

        <section className="mt-16 border-y border-white/10 py-12">
          <p className="font-mono text-xs tracking-[0.12em] text-[#b6a176]">
            Chapter {chapterNumber}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{chapterTitle}</h1>
          <p className="mt-8 max-w-xl font-serif text-lg leading-8 text-white/65">
            The free opening ends after Chapter 4. The complete founding edition includes all 32 chapters, the responsive reader, and the documented production ledger as it is approved for release.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {signedOut ? (
              <Link
                href={`/auth/login?next=${encodeURIComponent(`/books/${CINEMATIC_BOOK_ID}/${chapterId}`)}`}
                className="rounded-full bg-[#e5c78a] px-6 py-3 text-sm font-semibold text-[#151008] transition hover:bg-[#f2d79f]"
              >
                Sign in to unlock the edition
              </Link>
            ) : verifying ? (
              <Link
                href={`/books/${CINEMATIC_BOOK_ID}`}
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/40"
              >
                Retry access check
              </Link>
            ) : (
              <BookPurchaseButton
                configured={checkoutConfigured}
                label={`Unlock the complete edition — ${CINEMATIC_EDITION_PRICE}`}
                className="rounded-full bg-[#e5c78a] px-6 py-3 text-sm font-semibold text-[#151008] transition hover:bg-[#f2d79f]"
              />
            )}
            <Link href={`/books/${CINEMATIC_BOOK_ID}/01-the-house-that-leaned`} className="text-sm text-white/55 transition hover:text-white">
              Return to the free opening
            </Link>
          </div>

          {verifying ? (
            <p className="mt-5 text-sm leading-6 text-amber-100/70">
              We could not verify Polar access just now. Nothing has been charged here; refresh once the service is available.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
