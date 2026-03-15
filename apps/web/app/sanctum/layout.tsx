import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Sanctum | Arcanea',
  description: 'Discover, forge, and share illuminated AI intelligences. Each Luminor is a creative partner shaped by its creator — with unique voice, domain expertise, and personality.',
};

export default function SanctumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
