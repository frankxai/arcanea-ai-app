'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProjectWorkspaceControlsProps {
  projectId: string;
  initialTitle: string;
  initialDescription: string | null;
  initialGoal: string | null;
}

export function ProjectWorkspaceControls({
  projectId,
  initialTitle,
  initialDescription,
  initialGoal,
}: ProjectWorkspaceControlsProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? '');
  const [goal, setGoal] = useState(initialGoal ?? '');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function saveProject() {
    setError(null);
    setStatus(null);

    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        goal: goal.trim() || null,
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setError(payload?.error?.message || 'Failed to save project.');
      return;
    }

    setStatus('Project details saved.');
    startTransition(() => {
      router.refresh();
    });
  }

  async function deleteProject() {
    if (!window.confirm('Delete this project workspace? Chats and creations will be detached from it.')) {
      return;
    }

    setError(null);
    setStatus(null);

    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setError(payload?.error?.message || 'Failed to delete project.');
      return;
    }

    startTransition(() => {
      router.push('/projects');
      router.refresh();
    });
  }

  return (
    <Card variant="liquid-glass-subtle" className="self-start">
      <CardHeader>
        <CardTitle>Workspace Controls</CardTitle>
        <CardDescription>
          Update the project frame or delete the workspace if it should no longer hold continuity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          minRows={4}
        />
        <Textarea
          label="Goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          maxLength={1000}
          minRows={3}
        />

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {status ? <p className="text-sm text-emerald-300">{status}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={() => void saveProject()}
            disabled={isPending || title.trim().length === 0}
            className="w-full"
          >
            {isPending ? 'Saving...' : 'Save project'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => void deleteProject()}
            disabled={isPending}
            className="w-full justify-center text-rose-200 hover:text-rose-100"
          >
            <Trash size={16} />
            Delete project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
