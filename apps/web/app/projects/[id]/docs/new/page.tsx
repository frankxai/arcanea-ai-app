'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { extractDocFromEnvelope } from '@/lib/docs/client';

/**
 * Creates a new project doc then immediately redirects to its editor.
 * This page never renders UI — it's a server-action-style redirect.
 */
export default function NewDocPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const didCreate = useRef(false);

  useEffect(() => {
    if (didCreate.current) return;
    didCreate.current = true;

    async function create() {
      try {
        const res = await fetch(`/api/projects/${params.id}/docs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Untitled', doc_type: 'note', status: 'draft' }),
        });

        if (!res.ok) {
          router.replace(`/projects/${params.id}/docs`);
          return;
        }

        const payload = extractDocFromEnvelope(await res.json());
        if (!payload?.id) {
          router.replace(`/projects/${params.id}/docs`);
          return;
        }

        router.replace(`/projects/${params.id}/docs/${payload.id}`);
      } catch {
        router.replace(`/projects/${params.id}/docs`);
      }
    }

    void create();
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[#7fffd4] animate-spin" />
    </div>
  );
}
