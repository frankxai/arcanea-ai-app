import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat with Arcanea Luminors — creative intelligences for writing, coding, design, and research.',
  openGraph: {
    title: 'Chat | Arcanea',
    description: 'Chat with Luminors for writing, coding, design, and research.',
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
