'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  ChatCircleDots,
  Lightbulb,
  Sparkle,
} from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { extractDocFromEnvelope } from '@/lib/docs/client';
import { DOC_TYPE_LABELS, type DocType } from '@/lib/docs/types';
import { OpenProjectChatButton } from '../../open-project-chat-button';

const DOC_TYPE_DESCRIPTIONS: Record<DocType, string> = {
  note: 'Fast working notes for decisions, fragments, and continuity.',
  brief: 'A compact product or story brief that keeps the project aligned.',
  outline: 'A structured sequence for plans, chapters, flows, or releases.',
  lore: 'Worldbuilding, canon, character, and mythology documentation.',
  research: 'Captured references, analysis, and source-backed findings.',
  prompt_book: 'Reusable prompting patterns and model instructions.',
  spec: 'Implementation details, requirements, and technical constraints.',
  journal: 'A running log of project thinking and evolution over time.',
};

const DOC_WORKFLOW_STEPS = [
  'Frame the project in one durable document instead of scattering notes across chats.',
  'Use chat inside the same project so retrieval can pull the doc back into context.',
  'Save creations and connect them to sessions so the graph keeps provenance intact.',
];

export default function NewDocPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('brief');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedDescription = useMemo(() => DOC_TYPE_DESCRIPTIONS[docType], [docType]);

  async function createDoc() {
    setError(null);

    const response = await fetch(`/api/projects/${params.id}/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim() || 'Untitled',
        doc_type: docType,
        status: 'draft',
      }),
    });

    const doc = extractDocFromEnvelope(await response.json().catch(() => null));

    if (!response.ok || !doc?.id) {
      setError('Failed to create the document. Try again.');
      return;
    }

    startTransition(() => {
      router.push(`/projects/${params.id}/docs/${doc.id}`);
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-cosmic-void">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-atlantean-teal-aqua/80">
              <BookOpen size={14} />
              Project Docs
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">
              Start a project doc
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Docs are where the project gets a durable brain. Capture the brief, outline, canon,
              research, or spec here, then continue in chat with the same project context.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="ghost">
              <Link href={`/projects/${params.id}/docs`}>
                View docs
              </Link>
            </Button>
            <OpenProjectChatButton projectId={params.id}>
              <ChatCircleDots size={16} />
              Open project chat
            </OpenProjectChatButton>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card variant="liquid-glass">
            <CardHeader>
              <CardTitle>Create the first durable note</CardTitle>
              <CardDescription>
                Pick the kind of document this project needs now, then drop straight into editing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Input
                label="Title"
                placeholder="Atlas launch brief"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
              />

              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Doc type</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((type) => {
                    const selected = type === docType;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDocType(type)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          selected
                            ? 'border-atlantean-teal-aqua/50 bg-atlantean-teal-aqua/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{DOC_TYPE_LABELS[type]}</p>
                        <p className="mt-2 text-sm leading-6 text-white/55">
                          {DOC_TYPE_DESCRIPTIONS[type]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Selected workflow
                </p>
                <p className="mt-2 text-sm text-white">{DOC_TYPE_LABELS[docType]}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{selectedDescription}</p>
              </div>

              {error ? (
                <p className="text-sm text-rose-300">{error}</p>
              ) : (
                <p className="text-xs text-white/45">
                  Arcanea will create the doc inside this project so retrieval and provenance can
                  use it immediately.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => void createDoc()} disabled={isPending} className="min-w-[180px]">
                  <Sparkle size={16} />
                  {isPending ? 'Creating doc...' : 'Create and open'}
                </Button>
                <Button asChild variant="ghost">
                  <Link href={`/projects/${params.id}`}>
                    Back to project
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card variant="liquid-glass-subtle">
              <CardHeader>
                <CardTitle>Why docs matter here</CardTitle>
                <CardDescription>
                  Arcanea works best when projects have a durable written layer, not just transient
                  chats.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {DOC_WORKFLOW_STEPS.map((step) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <ArrowRight size={14} className="mt-1 text-atlantean-teal-aqua" />
                    <p className="text-sm leading-6 text-white/70">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="liquid-glass-subtle">
              <CardHeader>
                <CardTitle>What to start with</CardTitle>
                <CardDescription>
                  The strongest default is usually a brief or spec, depending on whether the
                  project is product or creative-first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-white/65">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="font-medium text-white">For product work</p>
                  <p className="mt-2">
                    Start with a brief or spec so chat and execution stay aligned to the same
                    constraints.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="font-medium text-white">For story or worldbuilding work</p>
                  <p className="mt-2">
                    Start with lore or outline so continuity survives beyond a single conversation.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="font-medium text-white">For research-heavy work</p>
                  <p className="mt-2">
                    Start with research so evidence and decisions do not get buried inside chat
                    history.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <Lightbulb size={16} className="mt-1 text-atlantean-teal-aqua" />
                  <p>
                    Build the durable artifact first, then use chat as the active execution loop
                    around it.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
