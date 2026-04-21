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
