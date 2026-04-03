'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectRecord } from '@/lib/projects/server';

interface ProjectsIndexShellProps {
  initialProjects: ProjectRecord[];
}

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString();
}

export function ProjectsIndexShell({ initialProjects }: ProjectsIndexShellProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function createProject() {
    setError(null);

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || undefined,
        goal: goal.trim() || undefined,
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.data?.project) {
      setError(payload?.error?.message || 'Failed to create project.');
      return;
    }

    const projectId = payload.data.project.id as string;
    setTitle('');
    setDescription('');
    setGoal('');
    startTransition(() => {
      router.push(`/projects/${projectId}`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <Card variant="liquid-glass-subtle" className="self-start">
          <CardHeader>
            <CardTitle>Start a new project</CardTitle>
            <CardDescription>
              Give the workspace a frame so Arcanea can connect chats, docs, creations, memories,
              and provenance around one concrete goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Title"
              placeholder="Atlas Launch"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
            />
            <Textarea
              label="Description"
              placeholder="What is this project trying to build?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
              minRows={4}
            />
            <Textarea
              label="Goal"
              placeholder="What should be true when this workspace is complete?"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              maxLength={1000}
              minRows={3}
            />

            {error ? (
              <p className="text-sm text-rose-300">{error}</p>
            ) : (
              <p className="text-xs text-white/45">
                Projects become the continuity container for linked chat sessions, docs, creations,
                and extracted memories.
              </p>
            )}

            <Button
              onClick={() => void createProject()}
              disabled={isPending || title.trim().length === 0}
              className="w-full"
            >
              <Plus size={16} />
              {isPending ? 'Creating project...' : 'Create project'}
            </Button>
          </CardContent>
        </Card>

        <Card variant="liquid-glass">
          <CardHeader>
            <CardTitle>Project workflow</CardTitle>
            <CardDescription>
              The strongest Arcanea loop starts with durable context, then uses chat and studio as execution surfaces.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Create the project so Arcanea has a clear frame and goal.',
              'Start a doc inside the project to capture the brief, outline, canon, or spec.',
              'Continue in chat with the active project so retrieval can use that written context.',
              'Save creations and memories back into the same project to strengthen provenance and graph intelligence.',
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-medium text-white/70">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-white/70">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {initialProjects.length === 0 ? (
          <Card variant="liquid-glass" className="md:col-span-2">
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Start in chat, move a session into a project, or save work from studio to begin
                building a durable workspace graph.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          initialProjects.map((project) => (
            <Card key={project.id} variant="liquid-glass" className="flex h-full flex-col">
              <CardHeader className="gap-3">
                <CardTitle className="text-white">{project.title}</CardTitle>
                <CardDescription className="line-clamp-4 text-white/60">
                  {project.description || project.goal || 'No description yet.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Updated</p>
                  <p className="mt-2 text-sm text-white/65">{formatTimestamp(project.updatedAt)}</p>
                </div>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href={`/projects/${project.id}`}>
                    Open workspace
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
