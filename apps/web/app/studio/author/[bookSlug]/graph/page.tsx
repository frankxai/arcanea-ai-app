/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import type { Metadata } from 'next';
import * as yaml from 'js-yaml';
import { GraphCanvas } from './graph-canvas';
import { getBookRoot } from '@/lib/content/book-path';
import type { Node, Edge } from '@xyflow/react';
import type { CharacterDiamond } from '@/lib/author/types';

export const dynamic = 'force-dynamic';

const BOOK_ROOT = getBookRoot();

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

interface PageProps {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookSlug } = await params;
  return {
    title: `Story & Entity Graph — ${bookSlug} — Author Studio`,
    description: `Interactive character relationships and narrative plot graph for ${bookSlug}`,
  };
}

export default async function GraphPage({ params }: PageProps) {
  const { bookSlug } = await params;
  const bookDir = join(BOOK_ROOT, bookSlug);

  let bookTitle = bookSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const yamlPath = join(bookDir, 'book.yaml');
  if (await exists(yamlPath)) {
    try {
      const raw = await readFile(yamlPath, 'utf-8');
      const data = yaml.load(raw) as any;
      if (data?.title) bookTitle = data.title;
    } catch {
      // fallback
    }
  }

  // Pre-seed Graph Nodes & Edges representing the Arcanea franchise character network
  const initialNodes: Node[] = [
    {
      id: 'kaelen',
      type: 'default',
      data: { label: 'Kaelen Voss (Protagonist / Arcan)' },
      position: { x: 250, y: 150 },
      style: {
        background: 'rgba(45, 212, 191, 0.15)',
        border: '1px solid #2dd4bf',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '12px 18px',
        fontWeight: 600,
        boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)',
      },
    },
    {
      id: 'lyria',
      type: 'default',
      data: { label: 'Lyria Nightshade (Sight Seer)' },
      position: { x: 550, y: 80 },
      style: {
        background: 'rgba(251, 191, 36, 0.15)',
        border: '1px solid #fbbf24',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '12px 18px',
        fontWeight: 600,
      },
    },
    {
      id: 'sable',
      type: 'default',
      data: { label: 'Sable Corvo (Gate-Touched Rebel)' },
      position: { x: 100, y: 350 },
      style: {
        background: 'rgba(244, 63, 94, 0.15)',
        border: '1px solid #f43f5e',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '12px 18px',
        fontWeight: 600,
      },
    },
    {
      id: 'theron',
      type: 'default',
      data: { label: 'Master Theron (Mentor / Stone Guild)' },
      position: { x: 50, y: 100 },
      style: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '10px 16px',
      },
    },
    {
      id: 'academies',
      type: 'default',
      data: { label: 'The Three Academies (Grand Spire)' },
      position: { x: 450, y: 300 },
      style: {
        background: 'rgba(147, 51, 234, 0.15)',
        border: '1px solid #a855f7',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '12px 18px',
        fontWeight: 600,
      },
    },
    {
      id: 'abyss-rift',
      type: 'default',
      data: { label: 'Abyssal Void Rift (Catalyst Threat)' },
      position: { x: 300, y: 480 },
      style: {
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px dashed #e11d48',
        color: '#fda4af',
        borderRadius: '12px',
        padding: '12px 18px',
        fontWeight: 600,
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e1',
      source: 'theron',
      target: 'kaelen',
      label: 'Mentorship / Guild Oath',
      animated: true,
      style: { stroke: '#94a3b8' },
    },
    {
      id: 'e2',
      source: 'kaelen',
      target: 'lyria',
      label: 'Resonance / Dual Seers',
      animated: true,
      style: { stroke: '#2dd4bf', strokeWidth: 2 },
    },
    {
      id: 'e3',
      source: 'kaelen',
      target: 'sable',
      label: 'Uneasy Alliance',
      style: { stroke: '#fbbf24' },
    },
    {
      id: 'e4',
      source: 'kaelen',
      target: 'academies',
      label: 'Enrolled Trialist',
      style: { stroke: '#a855f7' },
    },
    {
      id: 'e5',
      source: 'sable',
      target: 'abyss-rift',
      label: 'Investigating Corrupted Core',
      animated: true,
      style: { stroke: '#e11d48' },
    },
  ];

  const characters: CharacterDiamond[] = [
    {
      id: 'char-1',
      name: 'Kaelen Voss',
      aliases: ['The Five-Fold Apprentice', 'Stonebreaker'],
      originClass: 'Arcan',
      primaryGate: 'Foundation',
      desire: 'To become a certified master architect and protect his sister.',
      wound: 'Blames himself for the quarry collapse that crippled his father.',
      mask: 'Stoic, obedient stonemason who keeps his head down.',
      truth: 'He must lead beyond stone walls and unite the warring Academies.',
      signatureDialogue: 'Stone remembers every blow. You can’t chisel away the truth without fracturing the foundation.',
      faction: 'Atlantean Mason Guild',
    },
    {
      id: 'char-2',
      name: 'Lyria Nightshade',
      aliases: ['The Sightweaver'],
      originClass: 'Celestial',
      primaryGate: 'Sight',
      desire: 'To uncover the truth behind the vanished 7th Luminary.',
      wound: 'Blindness induced by looking directly into the Abyssal Rift.',
      mask: 'Cold, untouchable high-court seer who predicts without feeling.',
      truth: 'True vision requires feeling the grief of those you see.',
      signatureDialogue: 'I do not predict the future. I listen to what probability refuses to say out loud.',
      faction: 'Draconic Observatory',
    },
    {
      id: 'char-3',
      name: 'Sable Corvo',
      aliases: ['The Ashwalker'],
      originClass: 'Gate-Touched',
      primaryGate: 'Fire',
      desire: 'To burn down the Academy Registry and free the unregistered.',
      wound: 'Branded and hunted as an illegal channeler at age twelve.',
      mask: 'Reckless mercenary who fights for the highest bidder.',
      truth: 'Rebellion without a foundation is just chaos; he needs allies.',
      signatureDialogue: 'The Academies didn’t teach me magic. Survival did.',
      faction: 'Unregistered Underground',
    },
  ];

  return (
    <GraphCanvas
      bookSlug={bookSlug}
      bookTitle={bookTitle}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      characters={characters}
    />
  );
}
