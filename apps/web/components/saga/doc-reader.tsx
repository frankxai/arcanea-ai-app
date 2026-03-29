'use client';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function SagaDocReader({ content, headings }: { content: string; headings: TocHeading[] }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
