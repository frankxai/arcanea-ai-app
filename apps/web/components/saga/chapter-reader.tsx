'use client';

export function ChapterReader({ bookId, chapterId }: { bookId: string; chapterId: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-text-muted text-sm">Chapter reader loading...</p>
    </div>
  );
}
