import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create | Arcanea',
  description: 'Chat with sixteen Luminors — each specialized in writing, world-building, design, music, and research. One conversation can build an entire universe.',
  openGraph: {
    title: 'Create | Arcanea',
    description: 'Sixteen Luminors. One conversation. An entire universe.',
    type: 'website',
    images: [{ url: '/guardians/v3/elara-hero-v3.webp', width: 1024, height: 1024, alt: 'Elara — Guardian of the Starweave Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
  alternates: { canonical: '/chat' },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // Full-screen chat overlay — covers navbar/footer for immersive experience
  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b] isolate">
      {children}
    </div>
  );
}
