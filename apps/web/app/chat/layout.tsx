import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat with Arcanea AI specialists — write, code, analyze, and create with domain-specific intelligence.',
  openGraph: {
    title: 'Chat | Arcanea',
    description: 'Chat with AI specialists for writing, coding, analysis, and creative work.',
    type: 'website',
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
