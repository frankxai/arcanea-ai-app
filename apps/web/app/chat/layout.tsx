import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create',
  description: 'Chat with AI companions — each with unique expertise in writing, coding, design, and research.',
  openGraph: {
    title: 'Create',
    description: 'Chat with AI companions for writing, coding, design, and research.',
    type: 'website',
    images: [{ url: '/guardians/v3/elara-hero-v3.webp', width: 1024, height: 1024, alt: 'Elara — Guardian of the Starweave Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // Full-screen chat overlay — covers navbar/footer for immersive experience
  return (
    <div className="fixed inset-0 z-[60] bg-[#09090b]">
      {children}
    </div>
  );
}
