/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RoomClient } from './room-client';
import { PERSONAS, type PersonaId } from './personas';

interface RoomPageProps {
  params: Promise<{ persona: string }>;
}

// IMPORTANT: PERSONAS is imported from ./personas (server-safe), NOT from
// ./room-client ('use client'). See personas.ts for the reasoning. Next.js 16
// + Turbopack treated the client module as an opaque boundary, which made
// PERSONAS appear empty at server runtime and caused every /room/<persona>
// request to fall through to notFound() in production (2026-04-21 bug).

export async function generateStaticParams() {
  return Object.keys(PERSONAS).map((persona) => ({ persona }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { persona: raw } = await params;
  const persona = PERSONAS[raw as PersonaId];
  if (!persona) return { title: 'Arcanea · Room' };
  return {
    title: `${persona.name} · Arcanea`,
    description: `Speak with ${persona.name}. ${persona.tagline}.`,
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { persona: raw } = await params;
  if (!(raw in PERSONAS)) notFound();
  return <RoomClient persona={raw as PersonaId} />;
}
