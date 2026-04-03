'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { JSONContent } from 'novel';
import { ArrowRight, ChatCircleDots, FileText, FolderOpen } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocEditor, type DocEditorSavePayload } from '@/components/docs/doc-editor';
import { extractDocFromEnvelope, type DocApiRecord } from '@/lib/docs/client';
import { DOC_STATUS_LABELS, DOC_TYPE_LABELS, type DocType } from '@/lib/docs/types';
import { OpenProjectChatButton } from '../../open-project-chat-button';

type DocData = DocApiRecord;
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function DocEditorPage() {
  const params = useParams<{ id: string; docId: string }>();
  const router = useRouter();

  const [doc, setDoc] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('note');

  useEffect(() => {
    async function fetchDoc() {
      try {
        const response = await fetch(`/api/projects/${params.id}/docs/${params.docId}`);
        if (!response.ok) {
          router.push(`/projects/${params.id}/docs`);
          return;
        }

        const docPayload = extractDocFromEnvelope(await response.json());
        if (!docPayload) {
          router.push(`/projects/${params.id}/docs`);
          return;
        }

        setDoc(docPayload);
        setTitle(docPayload.title);
        setDocType(docPayload.doc_type);
      } catch {
        router.push(`/projects/${params.id}/docs`);
      } finally {
        setLoading(false);
      }
    }

    void fetchDoc();
  }, [params.id, params.docId, router]);

  const handleSave = useCallback(
    async (payload: DocEditorSavePayload) => {
      setSaveState('saving');
      try {
        const response = await fetch(`/api/projects/${params.id}/docs/${params.docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content_json: payload.content_json,
            content_text: payload.content_text,
            word_count: payload.word_count,
          }),
        });

        if (!response.ok) {
          setSaveState('error');
          return;
        }

        const nextDoc = extractDocFromEnvelope(await response.json());
        if (nextDoc) {
          setDoc(nextDoc);
        } else {
          setDoc((prev) =>
            prev
              ? {
                  ...prev,
                  content: {
                    content_json: payload.content_json,
                    content_text: payload.content_text,
                    word_count: payload.word_count,
                  },
                }
              : prev,
          );
        }

        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2000);
      } catch {
        setSaveState('error');
      }
    },
    [params.id, params.docId],
  );

  const handleTitleBlur = useCallback(async () => {
    if (!doc || title === doc.title) return;

    const response = await fetch(`/api/projects/${params.id}/docs/${params.docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) return;

    const nextDoc = extractDocFromEnvelope(await response.json());
    if (nextDoc) {
      setDoc(nextDoc);
      setTitle(nextDoc.title);
      return;
    }

    setDoc((prev) => (prev ? { ...prev, title } : prev));
  }, [doc, title, params.id, params.docId]);

  const handleDocTypeChange = useCallback(
    async (nextType: DocType) => {
      setDocType(nextType);
      await fetch(`/api/projects/${params.id}/docs/${params.docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_type: nextType }),
      });
      setDoc((prev) => (prev ? { ...prev, doc_type: nextType } : prev));
    },
    [params.id, params.docId],
  );

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    await fetch(`/api/projects/${params.id}/docs/${params.docId}`, { method: 'DELETE' });
    router.push(`/projects/${params.id}/docs`);
  }, [params.id, params.docId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#7fffd4]" />
      </div>
    );
  }

  if (!doc) return null;

  const initialContent =
    doc.content?.content_json && Object.keys(doc.content.content_json).length > 0
      ? (doc.content.content_json as JSONContent)
      : undefined;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex min-w-0 items-center gap-2 font-sans text-xs">
            <Link
              href={`/projects/${params.id}`}
              className="flex-shrink-0 text-white/30 transition-colors hover:text-white/50"
            >
              Project
            </Link>
            <span className="flex-shrink-0 text-white/15">/</span>
            <Link
              href={`/projects/${params.id}/docs`}
              className="flex-shrink-0 text-white/30 transition-colors hover:text-white/50"
            >
              Docs
            </Link>
            <span className="flex-shrink-0 text-white/15">/</span>
            <span className="truncate text-white/50">{doc.title || 'Untitled'}</span>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <OpenProjectChatButton
              projectId={params.id}
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
            >
              <ChatCircleDots size={14} />
              Open in chat
            </OpenProjectChatButton>

            <select
              value={docType}
              onChange={(event) => void handleDocTypeChange(event.target.value as DocType)}
              className="h-7 cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 pr-6 font-sans text-xs text-white/50 transition-colors focus:border-white/[0.15] focus:outline-none"
            >
              {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((type) => (
                <option key={type} value={type} className="bg-[#0f0f17]">
                  {DOC_TYPE_LABELS[type]}
                </option>
              ))}
            </select>

            <span
              className={`font-sans text-[11px] transition-all ${
                saveState === 'saving'
                  ? 'text-white/30'
                  : saveState === 'saved'
                    ? 'text-[#7fffd4]/60'
                    : saveState === 'error'
                      ? 'text-red-400/60'
                      : 'text-white/15'
              }`}
            >
              {saveState === 'saving'
                ? 'Saving...'
                : saveState === 'saved'
                  ? 'Saved'
                  : saveState === 'error'
                    ? 'Save failed'
                    : 'Auto-save on'}
            </span>

            <button
              type="button"
              onClick={() => void handleDelete()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-xs text-white/20 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              aria-label="Delete document"
            >
              x
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => void handleTitleBlur()}
          placeholder="Untitled"
          className="mb-8 w-full resize-none border-none bg-transparent font-sans text-3xl font-semibold text-white placeholder-white/15 focus:outline-none"
        />

        <Card className="mb-8 rounded-3xl border-white/[0.08] bg-white/[0.03] px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                <FileText size={14} className="text-[#7fffd4]" />
                Live project context
              </div>
              <p className="mt-3 text-sm leading-7 text-white/70">
                This doc is part of the current project workspace. The best next move is to keep
                writing here, then open project chat so retrieval can use this document as active context.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  'Write the durable brief, spec, outline, or canon here.',
                  'Open project chat when you are ready to execute against it.',
                  'Save creations back into the same workspace to preserve provenance.',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm leading-6 text-white/55"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/projects/${params.id}`}>
                  <FolderOpen size={14} />
                  Project
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/projects/${params.id}/docs`}>
                  <ArrowRight size={14} />
                  All docs
                </Link>
              </Button>
              <OpenProjectChatButton projectId={params.id} size="sm">
                <ChatCircleDots size={14} />
                Open project chat
              </OpenProjectChatButton>
            </div>
          </div>
        </Card>

        <DocEditor initialContent={initialContent} onSave={handleSave} saveDelay={2000} />

        {doc.content && doc.content.word_count > 0 ? (
          <div className="mt-10 flex items-center gap-4 border-t border-white/[0.04] pt-6 font-sans text-[11px] text-white/20">
            <span>{doc.content.word_count.toLocaleString()} words</span>
            <span className="text-white/10">-</span>
            <span>{DOC_STATUS_LABELS[doc.status]}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
