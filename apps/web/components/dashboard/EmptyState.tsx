import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-10 sm:p-16 text-center">
      <div
        className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(0,188,212,0.18), rgba(13,71,161,0.08))',
          border: '1px solid rgba(0,188,212,0.15)',
        }}
      >
        <BookOpen size={48} className="text-[#00bcd4]" strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl text-white/95 mb-3">
        You haven&rsquo;t published yet
      </h2>
      <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed mb-8">
        Write your first book with Claude Code and publish to Arcanea in under
        an hour. The library is waiting for what you&rsquo;ll make.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/contribute"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white font-sans font-medium text-sm transition-all hover:shadow-lg hover:shadow-[#00bcd4]/25 hover:-translate-y-0.5"
        >
          Start your first book
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/books/drafts"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] text-white/70 font-sans text-sm transition-all hover:bg-white/[0.04] hover:text-white/90"
        >
          See example books
        </Link>
      </div>
    </div>
  );
}
