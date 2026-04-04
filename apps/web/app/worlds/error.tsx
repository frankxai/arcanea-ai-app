"use client";

import Link from "next/link";

export default function WorldsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 bg-[#09090b]">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20">
        <svg className="h-6 w-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold text-[#00bcd4] font-display">The multiverse flickered</h2>
      <p className="mb-6 max-w-sm text-center text-sm text-white/50">Something went wrong loading the worlds. The Gate is still open.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-[#00bcd4]/12 border border-[#00bcd4]/40 text-[#00bcd4] font-display hover:bg-[#00bcd4]/20 transition-colors">
          Try Again
        </button>
        <Link href="/" className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-white/60 font-display hover:bg-white/8 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
