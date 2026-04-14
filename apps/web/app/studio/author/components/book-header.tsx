interface BookHeaderProps {
  title: string;
  subtitle?: string;
  chapterCount: number;
  totalWords: number;
  currentChapter: string;
  bookSlug: string;
}

export function BookHeader({ title, subtitle, chapterCount, totalWords, currentChapter, bookSlug }: BookHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <a href="/studio/author" className="text-white/30 hover:text-white/50 text-xs transition-colors">&larr;</a>
        <div>
          <h1 className="font-display text-sm font-semibold text-white/80">{title}</h1>
          {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-6 text-[10px] text-white/25">
        <span>{chapterCount} chapters</span>
        <span className="w-px h-3 bg-white/10" />
        <span>{totalWords.toLocaleString()} words</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="text-[#00bcd4]/60">Editing: {currentChapter}</span>
        <a
          href={`/books/drafts/${bookSlug}`}
          target="_blank"
          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 transition-colors"
        >
          View Published &rarr;
        </a>
      </div>
    </header>
  );
}
