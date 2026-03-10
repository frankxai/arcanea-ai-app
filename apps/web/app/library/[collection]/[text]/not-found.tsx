import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Not Found",
  description: "This text does not exist in the Library of Arcanea.",
  robots: { index: false, follow: true },
};

export default function TextNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-[8rem] md:text-[10rem] font-display font-bold leading-none text-white/[0.04] select-none mb-6">
        404
      </h1>

      <p className="text-lg text-text-secondary max-w-md mb-2">
        This text hasn&apos;t been written yet.
      </p>
      <p className="text-sm text-text-muted max-w-sm mb-10">
        Some scrolls remain blank, waiting for the right moment to reveal
        themselves. This may not be the one you were looking for.
      </p>

      <div className="flex gap-4">
        <Link
          href="/library"
          className="px-5 py-2.5 rounded-xl border border-[#00bcd4]/30 bg-[#00bcd4]/10 text-[#00bcd4] text-sm font-medium hover:bg-[#00bcd4]/20 transition-colors"
        >
          Browse the Library
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-text-secondary text-sm font-medium hover:bg-white/[0.04] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
