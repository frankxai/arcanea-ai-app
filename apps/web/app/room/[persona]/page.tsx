import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RoomClient, PERSONAS, type PersonaId } from './room-client';

interface RoomPageProps {
  params: Promise<{ persona: string }>;
}

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
