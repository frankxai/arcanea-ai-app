"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { AuthorEditor } from "./author-editor";
import { AuthorAIPanel } from "./author-ai-panel";
export function AuthorWorkspace({
  bookSlug,
  chapterSlug,
  initialHtml,
  initialText,
  children,
}: {
  bookSlug: string;
  chapterSlug: string;
  initialHtml: string;
  initialText: string;
  children?: ReactNode;
}) {
  const current = useRef(initialText);
  const [draftReady, setDraftReady] = useState(false);
  const setDraft = useCallback((text: string) => {
    current.current = text;
    setDraftReady(true);
  }, []);
  const getDraft = useCallback(() => current.current, []);
  return (
    <div className="grid min-w-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_22rem]">
      <main className="min-w-0">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
          <AuthorEditor
            key={`${bookSlug}/${chapterSlug}`}
            bookSlug={bookSlug}
            chapterSlug={chapterSlug}
            initialHtml={initialHtml}
            onDraftChange={setDraft}
          />
        </div>
      </main>
      <div className="min-w-0">
        {children}
        <AuthorAIPanel
          key={`${bookSlug}/${chapterSlug}`}
          bookSlug={bookSlug}
          currentChapter={chapterSlug}
          getEditorText={getDraft}
          draftReady={draftReady}
        />
      </div>
    </div>
  );
}
