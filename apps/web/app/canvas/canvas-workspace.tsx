'use client';

import { useCallback, useEffect, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState, type Connection, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import styles from './workspace.module.css';

type Illustration = { id: string; excerpt: string; chapter: number; imageUrl: string | null };
type CanvasNode = Node<{ label: string; creationId?: string }>;

export function CanvasWorkspace() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CanvasNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [revision, setRevision] = useState(0);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [status, setStatus] = useState('Loading your canvas…');
  const [note, setNote] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/canvas/personal').then(async (r) => ({ ok: r.ok, status: r.status, data: await r.json() })),
      fetch('/api/reader/illustrations').then(async (r) => r.ok ? r.json() : { illustrations: [] }),
    ]).then(([canvas, gallery]) => {
      if (!canvas.ok) {
        setStatus(canvas.status === 401 ? 'Sign in to save your canvas.' : canvas.data.error || 'Canvas unavailable.');
        return;
      }
      setNodes(canvas.data.nodes || []);
      setEdges(canvas.data.edges || []);
      setRevision(canvas.data.revision || 0);
      setIllustrations(gallery.illustrations || []);
      setReady(true);
      setStatus('Saved canvas loaded');
    }).catch(() => setStatus('Canvas unavailable. Try reloading.'));
  }, [setNodes, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((current) => addEdge({ ...connection, id: crypto.randomUUID() }, current));
    setStatus('Unsaved changes');
  }, [setEdges]);

  function addNote() {
    if (!note.trim()) return;
    setNodes((current) => [...current, {
      id: crypto.randomUUID(), position: { x: 80 + current.length * 36, y: 80 + current.length * 30 },
      data: { label: note.trim().slice(0, 1200) },
    }]);
    setNote('');
    setStatus('Unsaved changes');
  }

  function addIllustration(item: Illustration) {
    setNodes((current) => [...current, {
      id: crypto.randomUUID(), position: { x: 80 + current.length * 36, y: 80 + current.length * 30 },
      data: { label: `Chapter ${item.chapter} · ${item.excerpt}`, creationId: item.id },
    }]);
    setStatus('Unsaved changes');
  }

  async function save() {
    setStatus('Saving…');
    try {
      const res = await fetch('/api/canvas/personal', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges, revision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save.');
      setRevision(data.revision);
      setStatus('Saved to your space');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not save.'); }
  }

  return <section className={styles.workspace} aria-label="Personal infinite canvas">
    <div className={styles.toolbar}>
      <div><h2>Your canvas</h2><p>Arrange ideas, connect scenes, keep what matters.</p></div>
      <div className={styles.actions}>
        <input aria-label="New note" value={note} onChange={(event) => setNote(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addNote(); }} placeholder="Write a note" maxLength={1200} disabled={!ready} />
        <button type="button" onClick={addNote} disabled={!ready || !note.trim()}>Add note</button>
        <button type="button" onClick={save} disabled={!ready}>Save canvas</button>
      </div>
    </div>
    <p className={styles.status} role="status">{status} {status.includes('Sign in') && <Link href="/auth/login?next=%2Fcanvas">Sign in</Link>}</p>
    {ready && <div className={styles.surface}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={(changes) => {
        onNodesChange(changes);
        if (changes.some((change) => change.type === 'position' || change.type === 'remove')) setStatus('Unsaved changes');
      }} onEdgesChange={(changes) => {
        onEdgesChange(changes);
        if (changes.some((change) => change.type === 'remove')) setStatus('Unsaved changes');
      }} onConnect={onConnect} fitView deleteKeyCode={['Backspace', 'Delete']}>
        <Background /> <Controls /> <MiniMap pannable zoomable />
      </ReactFlow>
    </div>}
    {ready && <div className={styles.sources}>
      <h3>From your reading</h3>
      {illustrations.length ? illustrations.map((item) => <button type="button" key={item.id} onClick={() => addIllustration(item)}>Chapter {item.chapter} · {item.excerpt.slice(0, 90)}</button>) : <p>Your illustrated passages appear here. <Link href="/stories/the-light-she-could-not-see">Read the story</Link></p>}
    </div>}
  </section>;
}
