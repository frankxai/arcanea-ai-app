'use client';

import Link from 'next/link';

export default function LoreChapterError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="font-display text-2xl font-bold text-white mb-3">Chapter not found</h2>
        <p className="text-white/40 text-sm mb-6">{error.message || 'This chapter of the Living Lore may not exist yet.'}</p>
        <div className="flex justify-center gap-3">
          <button onClick={reset} className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">Try again</button>
          <Link href="/living-lore" className="px-4 py-2 rounded-xl bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-sm text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-colors">Living Lore</Link>
        </div>
      </div>
    </div>
  );
}
