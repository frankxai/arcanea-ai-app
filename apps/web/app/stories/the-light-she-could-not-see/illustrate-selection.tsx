'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './story.module.css';

type Selection = { excerpt: string; chapter: number };

export function IllustrateSelection() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const capture = useCallback(() => {
    const selected = window.getSelection();
    const excerpt = selected?.toString().replace(/\s+/g, ' ').trim() ?? '';
    if (!selected || excerpt.length < 20 || excerpt.length > 500) return;
    const node = selected.anchorNode?.parentElement;
    const section = node?.closest('section[data-reader-chapter]');
    const endSection = selected.focusNode?.parentElement?.closest('section[data-reader-chapter]');
    if (!section || section !== endSection) return;
    const chapter = Number(section.getAttribute('data-reader-chapter'));
    if (chapter >= 1 && chapter <= 21) setSelection({ excerpt, chapter });
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', capture);
    document.addEventListener('touchend', capture);
    return () => {
      document.removeEventListener('mouseup', capture);
      document.removeEventListener('touchend', capture);
    };
  }, [capture]);

  async function illustrate() {
    if (!selection || working) return;
    setWorking(true);
    setError('');
    setNeedsLogin(false);
    try {
      const response = await fetch('/api/reader/illustrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selection, requestId: crypto.randomUUID() }),
      });
      const result = await response.json();
      if (!response.ok) {
        setNeedsLogin(response.status === 401);
        throw new Error(result.error || 'Could not illustrate this passage.');
      }
      setImageUrl(result.imageUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not illustrate this passage.');
    } finally {
      setWorking(false);
    }
  }

  if (!selection) return (
    <div className={styles.illustrateHint}>
      <p>Select a sentence to see it as an image.</p>
      <Link href="/me/illustrations">Your illustrations</Link>
    </div>
  );

  return (
    <aside className={styles.illustratePanel} aria-label="Illustrate selected passage">
      <button type="button" className={styles.illustrateClose} onClick={() => { setSelection(null); setImageUrl(''); setError(''); }} aria-label="Close illustration panel">Close</button>
      <p className={styles.smallLabel}>Chapter {selection.chapter} · Selected passage</p>
      <blockquote>{selection.excerpt}</blockquote>
      {imageUrl && <Image src={imageUrl} alt={`Illustration of: ${selection.excerpt}`} width={768} height={512} unoptimized className={styles.illustration} />}
      {error && <p className={styles.illustrateError} role="alert">{error} {needsLogin && <Link href={`/auth/login?next=${encodeURIComponent('/stories/the-light-she-could-not-see')}`}>Sign in</Link>}</p>}
      <div className={styles.illustrateActions}>
        <button type="button" onClick={illustrate} disabled={working}>
          {working ? 'Illustrating…' : imageUrl ? 'Illustrate again · 1 credit' : 'Illustrate · 1 credit'}
        </button>
        <Link href="/me/illustrations">Your illustrations</Link>
      </div>
    </aside>
  );
}
