'use client';

export function DocReader({ slug }: { slug: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-text-muted text-sm">Document loading...</p>
    </div>
  );
}
